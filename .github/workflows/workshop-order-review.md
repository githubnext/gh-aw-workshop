---
emoji: 🧭
name: Workshop Order Review
description: Daily reviewer that maps workshop page ordering, detects graph anomalies, and opens issues for agent follow-up.
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
strict: true
network:
  allowed:
    - defaults
safe-outputs:
  mentions: false
  allowed-github-references: []
  create-issue:
    title-prefix: "[ordering-review] "
    deduplicate-by-title: true
    max: 1
    expires: 1d
steps:
  - name: Collect ordering requirements and dependencies
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json
      import pathlib
      import re
      import sys

      sys.path.insert(0, str(pathlib.Path('.github/skills/curriculum-quantitative-assessment').resolve()))
      from curriculum_assessment import is_non_learning_page

      repo = pathlib.Path('.')
      workshop_dir = repo / 'workshop'
      files = sorted(p for p in workshop_dir.glob('*.md') if p.name != 'README.md')

      command_fence = re.compile(r'```(?:bash|sh|shell|yaml)?\n(.*?)```', re.DOTALL)
      navigation_link_re = re.compile(r'\*\*(?:Next|Continue):\*\*\s+\[[^\]]+\]\(([^)]+)\)')
      table_link_re = re.compile(r'\|[^\n]*?\[[^\]]+\]\(([^)]+)\)')
      link_re = re.compile(r'\[[^\]]+\]\(([^)]+\.md(?:#[^)]+)?)\)')
      inline_command_re = re.compile(r'`([^`\n]+)`')

      command_prefixes = (
          'git ', 'gh ', 'cd ', 'curl ',
          'brew ', 'winget ', 'sudo ', 'echo ', 'pwd', 'cat ', 'mkdir '
      )

      requirement_patterns = {
          'environment_ready': [
              r'\bgit --version\b',
              r'\bgh --version\b',
              r'\bgh auth login\b',
              r'\bgh repo (?:create|clone|view)\b',
              r'\bgh extension (?:list|install)\b',
              r'\bgh aw\b',
              r'\bgit (?:clone|init|add|commit|push)\b',
              r'\bcd /workspaces\b',
          ],
          'gh_installed': [
              r'\bgh --version\b',
              r'\bgh auth login\b',
              r'\bgh repo (?:create|clone|view)\b',
              r'\bgh extension (?:list|install)\b',
              r'\bgh aw\b',
          ],
          'gh_authenticated': [
              r'\bgh repo (?:create|clone|view)\b',
              r'\bgh extension install\b',
              r'\bgh aw\b',
          ],
          'practice_repo_ready': [
              r'\bgh aw\b',
              r'\.github/workflows',
          ],
      }

      capability_help = {
          'environment_ready': 'an opened Codespace or local terminal session',
          'gh_installed': 'the GitHub CLI installed in the current environment',
          'gh_authenticated': 'an authenticated gh CLI session',
          'practice_repo_ready': 'the learner inside their practice repository',
      }

      def activity_metadata(path: pathlib.Path):
          stem = path.stem
          side_quest_match = re.match(r'^side-quest-(\d{2})-(\d{2})-', stem)
          if side_quest_match:
              step = int(side_quest_match.group(1))
              sq = int(side_quest_match.group(2))
              return {
                  'label': f'{step:02d}-SQ{sq:02d}',
                  'sort_key': (step, 2, sq, ''),
              }

          branch_match = re.match(r'^(\d{2})([a-z])(?:(?:-part)?(\d+))?-', stem)
          if branch_match:
              step = int(branch_match.group(1))
              suffix = branch_match.group(2)
              sequence = int(branch_match.group(3) or 0)
              label = f'{step:02d}{suffix}'
              if sequence:
                  label = f'{label}.{sequence}'
              return {
                  'label': label,
                  'sort_key': (step, 1, suffix, sequence),
              }

          core_match = re.match(r'^(\d{2})(?:-part(\d+))?-', stem)
          if core_match:
              step = int(core_match.group(1))
              sequence = int(core_match.group(2) or 0)
              label = f'{step:02d}'
              if sequence:
                  label = f'{label}.{sequence}'
              return {
                  'label': label,
                  'sort_key': (step, 0, '', sequence),
              }

          return {
              'label': stem,
              'sort_key': (999, 9, stem, 0),
          }

      def extract_section(text: str, heading: str) -> str:
          pattern = re.compile(rf'^##\s+{re.escape(heading)}\s*$(.*?)(?=^##\s+|\Z)', re.MULTILINE | re.DOTALL)
          match = pattern.search(text)
          return match.group(1).strip() if match else ''

      def normalize_link(link: str):
          clean = link.split('#', 1)[0].strip()
          if not clean.endswith('.md'):
              return None
          return pathlib.Path(clean).name

      _PAGE_JOURNEY_RE = re.compile(r'^<!--\s*journey:\s*([a-z,\s]+?)\s*-->\s*$')
      _PAGE_ADVENTURE_RE = re.compile(r'^<!--\s*adventure:\s*([a-z-]+)\s*-->\s*$')

      def parse_frontmatter(text: str):
          lines = text.splitlines()
          data = {}
          if lines:
              m = _PAGE_JOURNEY_RE.match(lines[0])
              if m:
                  data['journey'] = m.group(1).strip()
          if len(lines) > 1:
              m = _PAGE_ADVENTURE_RE.match(lines[1])
              if m:
                  data['adventure'] = m.group(1).strip()
          return data

      def gather_commands(text: str):
          commands = []
          seen = set()

          for block in command_fence.findall(text):
              for raw_line in block.splitlines():
                  line = raw_line.strip()
                  if not line or line.startswith('#'):
                      continue
                  if line.startswith(command_prefixes):
                      if line not in seen:
                          seen.add(line)
                          commands.append(line)

          for raw in inline_command_re.findall(text):
              line = raw.strip()
              if '\n' in line:
                  continue
              if line.startswith(command_prefixes) and line not in seen:
                  seen.add(line)
                  commands.append(line)

          return commands

      def command_evidence(text: str):
          evidence = []
          for idx, line in enumerate(text.splitlines(), start=1):
              stripped = line.strip()
              for cmd in inline_command_re.findall(stripped):
                  candidate = cmd.strip()
                  if candidate.startswith(command_prefixes):
                      evidence.append({'line': idx, 'command': candidate})
              if stripped.startswith(command_prefixes):
                  evidence.append({'line': idx, 'command': stripped})
          return evidence

      entries = []
      for path in sorted(files, key=lambda p: activity_metadata(p)['sort_key']):
          text = path.read_text()
          metadata = activity_metadata(path)
          frontmatter = parse_frontmatter(text)
          title = next((line[2:].strip() for line in text.splitlines() if line.startswith('# ')), path.stem)
          before_section = extract_section(text, '📋 Before You Start')
          choice_section = extract_section(text, '🔀 Choose Your Path')
          commands = gather_commands(text)
          evidence = command_evidence(text)

          before_links = sorted(filter(None, {normalize_link(link) for link in link_re.findall(before_section)}))
          next_links = sorted(filter(None, {normalize_link(link) for link in navigation_link_re.findall(text)}))
          choice_links = sorted(filter(None, {normalize_link(link) for link in table_link_re.findall(choice_section)}))

          provides = []
          lower_name = path.name.lower()
          if 'setup-codespace' in lower_name or 'setup-local' in lower_name:
              provides.append('environment_ready')
          if any(cmd.startswith('gh --version') for cmd in commands) and ('setup-' in lower_name or 'install-gh-aw' in lower_name):
              provides.append('gh_installed')
          if any('gh auth login' in cmd for cmd in commands):
              provides.append('gh_authenticated')
          if any(re.search(r'\b(?:gh repo create|git init)\b', cmd) for cmd in commands):
              provides.append('practice_repo_ready')
          if any('gh extension install' in cmd and 'gh-aw' in cmd for cmd in commands):
              provides.append('gh_aw_installed')

          requires = {}
          for capability, patterns in requirement_patterns.items():
              matches = []
              for item in evidence:
                  if any(re.search(pattern, item['command']) for pattern in patterns):
                      matches.append(item)
              if matches:
                  requires[capability] = matches

          entries.append({
              'file': path.name,
              'title': title,
              'activity_id': metadata['label'],
              'order': metadata['sort_key'],
              'is_learning_page': not is_non_learning_page(text),
              'journey': frontmatter.get('journey', ''),
              'adventure': frontmatter.get('adventure', ''),
              'before_links': before_links,
              'next_links': next_links,
              'choice_links': choice_links,
              'commands': commands,
              'provides': sorted(set(provides)),
              'requires': requires,
          })

      providers = {}
      for entry in entries:
          for capability in entry['provides']:
              providers.setdefault(capability, []).append(entry['file'])

      files_by_name = {entry['file']: entry for entry in entries}
      edges = []
      constraints = []
      seen_constraints = set()

      def add_edge(source: str, target: str, edge_type: str, reason: str):
          if source not in files_by_name or target not in files_by_name:
              return
          edges.append({
              'source': source,
              'target': target,
              'type': edge_type,
              'reason': reason,
          })
          if (source, target, edge_type) in seen_constraints:
              return
          seen_constraints.add((source, target, edge_type))
          source_entry = files_by_name[source]
          target_entry = files_by_name[target]
          constraints.append({
              'source': source,
              'target': target,
              'type': edge_type,
              'text': f"{source_entry['activity_id']} {source} must come before {target_entry['activity_id']} {target} because {reason}",
          })

      for entry in entries:
          for target in entry['next_links']:
              add_edge(entry['file'], target, 'next', f"{entry['file']} explicitly links to {target} as the next or continue step.")
          for target in entry['choice_links']:
              add_edge(entry['file'], target, 'choice', f"{entry['file']} offers {target} as a choose-your-path destination.")
          for prerequisite in entry['before_links']:
              add_edge(prerequisite, entry['file'], 'before', f"{entry['file']} lists {prerequisite} in its Before You Start section.")
          for capability in entry['requires']:
              provider = next((candidate for candidate in providers.get(capability, []) if candidate != entry['file']), None)
              if provider:
                  add_edge(provider, entry['file'], f'capability:{capability}', f"{entry['file']} requires {capability_help[capability]}, which {provider} appears to provide.")

      node_ids = {entry['file']: f"node_{index:03d}" for index, entry in enumerate(entries, start=1)}

      def mermaid_label(entry):
          label = f"{entry['activity_id']} {entry['file']}\\n{entry['title']}"
          return label.replace('"', '\\"')

      mermaid_lines = ['graph TD']
      for entry in entries:
          mermaid_lines.append(f'  {node_ids[entry["file"]]}["{mermaid_label(entry)}"]')
      for edge in edges:
          mermaid_lines.append(
              f'  {node_ids[edge["source"]]} -->|{edge["type"]}| {node_ids[edge["target"]]}'
          )

      context = {
          'files': entries,
          'providers': providers,
          'capability_help': capability_help,
          'graph': {
              'nodes': [
                  {
                      'file': entry['file'],
                      'activity_id': entry['activity_id'],
                      'title': entry['title'],
                      'order': entry['order'],
                      'is_learning_page': entry['is_learning_page'],
                      'journey': entry['journey'],
                      'adventure': entry['adventure'],
                  }
                  for entry in entries
              ],
              'edges': edges,
              'constraints': constraints,
              'mermaid': '\n'.join(mermaid_lines),
          },
      }
      pathlib.Path('/tmp/gh-aw/data/order-review-context.json').write_text(json.dumps(context, indent=2))
      PY

  - name: Run ordering heuristics
    run: |
      set -euo pipefail

      python3 <<'PY'
      import json
      import pathlib
      from collections import defaultdict

      context = json.loads(pathlib.Path('/tmp/gh-aw/data/order-review-context.json').read_text())
      files = context['files']
      capability_help = context['capability_help']
      graph = context['graph']
      files_by_name = {entry['file']: entry for entry in files}

      provider_order = {}
      provider_file = {}
      for entry in files:
          for capability in entry['provides']:
              if capability not in provider_order or tuple(entry['order']) < provider_order[capability]:
                  provider_order[capability] = tuple(entry['order'])
                  provider_file[capability] = entry['file']

      findings = []
      for entry in files:
          current_order = tuple(entry['order'])
          for capability, matches in entry['requires'].items():
              required_provider_order = provider_order.get(capability)
              if required_provider_order and current_order < required_provider_order:
                  findings.append({
                      'type': 'capability_before_provider',
                      'file': entry['file'],
                      'title': entry['title'],
                      'capability': capability,
                      'required_before': provider_file[capability],
                      'reason': f"This step asks the learner to use {capability_help[capability]} before any earlier step appears to provide it.",
                      'evidence': matches[:3],
                      'related_files': [entry['file'], provider_file[capability]],
                  })

          if entry['requires'].get('environment_ready') and current_order < provider_order.get('environment_ready', current_order):
              findings.append({
                  'type': 'shared_step_before_environment_setup',
                  'file': entry['file'],
                  'title': entry['title'],
                  'capability': 'environment_ready',
                  'required_before': provider_file.get('environment_ready'),
                  'reason': 'This shared step contains terminal commands before either setup path opens a Codespace or local terminal workflow step.',
                  'evidence': entry['requires']['environment_ready'][:3],
                  'related_files': [entry['file'], provider_file.get('environment_ready')],
              })

          if entry['requires'].get('gh_authenticated') and entry['before_links']:
              linked = set(entry['before_links'])
              auth_providers = {f for f in context['providers'].get('gh_authenticated', [])}
              if auth_providers and not linked.intersection(auth_providers):
                  findings.append({
                      'type': 'missing_prerequisite_link',
                      'file': entry['file'],
                      'title': entry['title'],
                      'capability': 'gh_authenticated',
                      'required_before': sorted(auth_providers),
                      'reason': 'This step depends on an authenticated gh session, but its Before You Start links do not point to any step that provides it.',
                      'evidence': entry['requires']['gh_authenticated'][:3],
                      'related_files': [entry['file'], *sorted(auth_providers)],
                  })

      adjacency = defaultdict(list)
      edge_lookup = defaultdict(list)
      for edge in graph['edges']:
          adjacency[edge['source']].append(edge['target'])
          edge_lookup[(edge['source'], edge['target'])].append(edge)

          if edge['type'] == 'next':
              source_order = tuple(files_by_name[edge['source']]['order'])
              target_order = tuple(files_by_name[edge['target']]['order'])
              if target_order < source_order:
                  findings.append({
                      'type': 'backward_next_edge',
                      'file': edge['source'],
                      'title': files_by_name[edge['source']]['title'],
                      'capability': 'graph_order',
                      'required_before': edge['target'],
                      'reason': f"{edge['source']} points forward to {edge['target']} as a next step, but the target sorts earlier in the workshop graph.",
                      'evidence': [{'edge_type': edge['type'], 'source': edge['source'], 'target': edge['target']}],
                      'related_files': [edge['source'], edge['target']],
                  })

      index_ref = [0]
      indices = {}
      lowlinks = {}
      stack = []
      on_stack = set()
      components = []

      def strongconnect(node):
          indices[node] = index_ref[0]
          lowlinks[node] = index_ref[0]
          index_ref[0] += 1
          stack.append(node)
          on_stack.add(node)

          for neighbor in adjacency.get(node, []):
              if neighbor not in indices:
                  strongconnect(neighbor)
                  lowlinks[node] = min(lowlinks[node], lowlinks[neighbor])
              elif neighbor in on_stack:
                  lowlinks[node] = min(lowlinks[node], indices[neighbor])

          if lowlinks[node] == indices[node]:
              component = []
              while True:
                  member = stack.pop()
                  on_stack.remove(member)
                  component.append(member)
                  if member == node:
                      break
              components.append(sorted(component))

      for node in files_by_name:
          if node not in indices:
              strongconnect(node)

      cycles = []
      feedback_loops = []
      weird_cycles = []
      self_loops = []

      for component in components:
          if len(component) == 1:
              node = component[0]
              if node in adjacency and node in adjacency[node]:
                  self_loops.append(component)
              continue

          cycle_edges = []
          edge_types = set()
          for source in component:
              for target in adjacency.get(source, []):
                  if target in component:
                      component_edges = edge_lookup[(source, target)]
                      edge_types.update(edge['type'] for edge in component_edges)
                      cycle_edges.extend(component_edges)

          cycle_data = {
              'nodes': component,
              'edge_types': sorted(edge_types),
              'edges': cycle_edges,
          }
          cycles.append(cycle_data)

          reciprocal_pairs = {
              tuple(sorted((edge['source'], edge['target'])))
              for edge in cycle_edges
              if edge['source'] != edge['target'] and (edge['target'], edge['source']) in edge_lookup
          }
          if reciprocal_pairs:
              feedback_loops.append({
                  'nodes': component,
                  'pairs': sorted(list(pair) for pair in reciprocal_pairs),
                  'edge_types': sorted(edge_types),
              })
          if len(edge_types) > 1 or any(edge['type'] not in {'next', 'choice'} for edge in cycle_edges):
              weird_cycles.append(cycle_data)

      for loop in self_loops:
          findings.append({
              'type': 'self_loop',
              'file': loop[0],
              'title': files_by_name[loop[0]]['title'],
              'capability': 'graph_cycle',
              'required_before': loop[0],
              'reason': f"{loop[0]} points to itself in the workshop graph.",
              'evidence': [{'edge_type': edge['type'], 'source': edge['source'], 'target': edge['target']} for edge in edge_lookup[(loop[0], loop[0])]],
              'related_files': [loop[0]],
          })

      for cycle in cycles:
          findings.append({
              'type': 'cycle',
              'file': cycle['nodes'][0],
              'title': files_by_name[cycle['nodes'][0]]['title'],
              'capability': 'graph_cycle',
              'required_before': cycle['nodes'],
              'reason': f"These pages participate in a directed cycle: {', '.join(cycle['nodes'])}.",
              'evidence': [{'edge_type': edge['type'], 'source': edge['source'], 'target': edge['target']} for edge in cycle['edges'][:10]],
              'related_files': cycle['nodes'],
          })

      for cycle in weird_cycles:
          findings.append({
              'type': 'weird_cycle',
              'file': cycle['nodes'][0],
              'title': files_by_name[cycle['nodes'][0]]['title'],
              'capability': 'graph_cycle',
              'required_before': cycle['nodes'],
              'reason': f"These pages participate in a mixed-edge cycle that likely needs human review: {', '.join(cycle['nodes'])}.",
              'evidence': [{'edge_type': edge['type'], 'source': edge['source'], 'target': edge['target']} for edge in cycle['edges'][:10]],
              'related_files': cycle['nodes'],
          })

      deduped = []
      seen = set()
      for finding in findings:
          required_before = finding['required_before']
          if isinstance(required_before, list):
              required_before = sorted(required_before)
          key = (finding['type'], finding['file'], json.dumps(required_before, sort_keys=True))
          if key not in seen:
              seen.add(key)
              deduped.append(finding)

      report_lines = [
          '# Workshop order graph report',
          '',
          '## Summary',
          f"- Files reviewed: {len(files)}",
          f"- Dispatcher/informational pages (learning:false): {sum(1 for n in graph['nodes'] if not n.get('is_learning_page', True))}",
          f"- Graph nodes: {len(graph['nodes'])}",
          f"- Graph edges: {len(graph['edges'])}",
          f"- Constraints listed: {len(graph['constraints'])}",
          f"- Potential findings: {len(deduped)}",
          f"- Cycles: {len(cycles)}",
          f"- Feedback loops: {len(feedback_loops)}",
          f"- Weird cycles: {len(weird_cycles)}",
          f"- Self loops: {len(self_loops)}",
          '',
          '## Mermaid graph',
          '```mermaid',
          graph['mermaid'],
          '```',
          '',
          '## Ordering constraints',
      ]

      for constraint in graph['constraints']:
          report_lines.append(f"- {constraint['text']}")

      if cycles or feedback_loops or weird_cycles:
          report_lines.extend(['', '## Graph anomalies'])
          if cycles:
              for cycle in cycles:
                  report_lines.append(f"- Cycle: {', '.join(cycle['nodes'])} (edge types: {', '.join(cycle['edge_types'])})")
          if feedback_loops:
              for loop in feedback_loops:
                  pairs = '; '.join(' ↔ '.join(pair) for pair in loop['pairs'])
                  report_lines.append(f"- Feedback loop: {pairs} (edge types: {', '.join(loop['edge_types'])})")
          if weird_cycles:
              for cycle in weird_cycles:
                  report_lines.append(f"- Weird cycle: {', '.join(cycle['nodes'])} (edge types: {', '.join(cycle['edge_types'])})")

      result = {
          'summary': {
              'files_reviewed': len(files),
              'graph_nodes': len(graph['nodes']),
              'graph_edges': len(graph['edges']),
              'constraints': len(graph['constraints']),
              'potential_findings': len(deduped),
              'cycles': len(cycles),
              'feedback_loops': len(feedback_loops),
              'weird_cycles': len(weird_cycles),
              'self_loops': len(self_loops),
          },
          'graph': {
              'mermaid': graph['mermaid'],
              'constraints': graph['constraints'],
              'cycles': cycles,
              'feedback_loops': feedback_loops,
              'weird_cycles': weird_cycles,
              'self_loops': self_loops,
          },
          'findings': deduped,
      }
      pathlib.Path('/tmp/gh-aw/data/order-review-findings.json').write_text(json.dumps(result, indent=2))
      pathlib.Path('/tmp/gh-aw/data/order-review-report.md').write_text('\n'.join(report_lines) + '\n')
      print(json.dumps(result, indent=2))
      PY
---

## Workshop Order Review

You are a specialized reviewer for the workshop content in `workshop/*.md`.

Your focus is **instruction ordering**: map the full workshop page graph, list its ordering constraints, and detect cases where learners are told to do something before the workshop has prepared the required environment, tool, authentication, or repository state.

Examples of the kinds of problems to flag:
- asking learners to check for Git or `gh` before they have opened the right terminal or Codespace path
- asking learners to create or clone a project before the setup path is complete
- using `gh aw` commands before the extension or repository setup exists
- prerequisite sections that point to the wrong earlier step for the commands that follow

### Inputs

Read these generated files first:
- `/tmp/gh-aw/data/order-review-context.json`
- `/tmp/gh-aw/data/order-review-findings.json`
- `/tmp/gh-aw/data/order-review-report.md`

Then read only the workshop files cited by the findings or graph anomalies you decide to verify.

> **Dispatcher and informational pages:** Pages with `is_learning_page: false` in the context JSON are marked with `<!-- learning:false -->` and serve as navigation hubs. They are scored for **clarity and simplicity** (cognitive load, readability, style compliance only — no active learning, checkpoint, or scaffolding requirements). Do not flag ordering issues caused solely by a dispatcher page lacking prerequisite sections or checkpoint items — those issues should be raised against the substantive steps they link to, not the dispatcher.

### Task

1. Review the generated Mermaid graph, ordering constraints, and potential findings.
2. Confirm whether each cited finding, cycle, feedback loop, or weird cycle is a real ordering problem by checking the cited workshop files and the earlier step that should come first.
3. Ignore false positives.
4. If you confirm one or more real graph or ordering problems, create exactly one issue that summarizes the results.

### Issue requirements

Create at most 1 issue. The issue body must include:
- a short summary of the graph health review
- the Mermaid graph in a fenced `mermaid` block
- the ordering constraints list
- any confirmed cycles, feedback loops, or weird cycles
- each verified ordering problem with:
  - the workshop file reviewed
  - the exact quoted instruction or command that appears too early
  - the missing prerequisite, dependency, or earlier step that should come first
  - why the current order could confuse or block a learner
  - a concrete suggested fix
- a short note that the issue is ready for an agent to resolve

Use this title form:
`workshop order graph: <short status>`

### No-op rule

If the heuristics output has no confirmed ordering or graph anomalies, call `noop` with a short explanation.

### Safe Outputs

- Use `create-issue` for the single verified graph report issue.
- Use `noop` when no issue should be created.
