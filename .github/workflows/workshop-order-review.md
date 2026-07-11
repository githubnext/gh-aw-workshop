---
emoji: 🧭
name: Workshop Order Review
description: Daily reviewer that detects step-ordering inconsistencies in workshop instructions and opens issues for agent follow-up.
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
strict: true
features:
  copilot-requests: true
network:
  allowed:
    - defaults
safe-outputs:
  mentions: false
  allowed-github-references: []
  max-bot-mentions: 0
  create-issue:
    title-prefix: "[ordering-review] "
    deduplicate-by-title: true
    max: 5
steps:
  - name: Collect ordering requirements and dependencies
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json
      import pathlib
      import re

      repo = pathlib.Path('.')
      workshop_dir = repo / 'workshop'
      files = sorted(p for p in workshop_dir.glob('*.md') if p.name != 'README.md')

      command_fence = re.compile(r'```(?:bash|sh|shell|yaml)?\n(.*?)```', re.DOTALL)
      next_link_re = re.compile(r'\*\*Next:\*\*\s+\[[^\]]+\]\(([^)]+)\)')
      table_link_re = re.compile(r'\|[^\n]*?\[[^\]]+\]\(([^)]+)\)')
      link_re = re.compile(r'\[[^\]]+\]\(([^)]+\.md(?:#[^)]+)?)\)')
      inline_command_re = re.compile(r'`([^`\n]+)`')
      step_heading_re = re.compile(r'^###\s+(\d+)\.\s+(.*)$')

      command_prefixes = (
          'git ', 'gh ', 'node ', 'npm ', 'npx ', 'pnpm ', 'yarn ', 'cd ', 'curl ',
          'brew ', 'winget ', 'sudo ', 'echo ', 'pwd', 'cat ', 'mkdir '
      )

      requirement_patterns = {
          'environment_ready': [
              r'\bgit --version\b',
              r'\bnode --version\b',
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

      def sort_key(path: pathlib.Path):
          match = re.match(r'(\d+)([a-z]?)', path.stem)
          if not match:
              return (999, path.stem)
          number = int(match.group(1))
          suffix = match.group(2) or 'z'
          return (number, suffix)

      def extract_section(text: str, heading: str) -> str:
          pattern = re.compile(rf'^##\s+{re.escape(heading)}\s*$(.*?)(?=^##\s+|\Z)', re.MULTILINE | re.DOTALL)
          match = pattern.search(text)
          return match.group(1).strip() if match else ''

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
      for path in sorted(files, key=sort_key):
          text = path.read_text()
          title = next((line[2:].strip() for line in text.splitlines() if line.startswith('# ')), path.stem)
          before_section = extract_section(text, '📋 Before You Start')
          choice_section = extract_section(text, '🔀 Choose Your Path')
          commands = gather_commands(text)
          evidence = command_evidence(text)

          before_links = sorted({link.split('#', 1)[0] for link in link_re.findall(before_section)})
          next_links = sorted({link.split('#', 1)[0] for link in next_link_re.findall(text)})
          choice_links = sorted({link.split('#', 1)[0] for link in table_link_re.findall(choice_section)})

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
              'order': sort_key(path),
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

      context = {
          'files': entries,
          'providers': providers,
          'capability_help': capability_help,
      }
      (repo / '/tmp/gh-aw/data/order-review-context.json')
      pathlib.Path('/tmp/gh-aw/data/order-review-context.json').write_text(json.dumps(context, indent=2))
      PY

  - name: Run ordering heuristics
    run: |
      set -euo pipefail

      python3 <<'PY'
      import json
      import pathlib

      context = json.loads(pathlib.Path('/tmp/gh-aw/data/order-review-context.json').read_text())
      files = context['files']
      capability_help = context['capability_help']
      order_lookup = {entry['file']: tuple(entry['order']) for entry in files}

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
                  })

      deduped = []
      seen = set()
      for finding in findings:
          key = (finding['type'], finding['file'], finding['capability'])
          if key not in seen:
              seen.add(key)
              deduped.append(finding)

      result = {
          'summary': {
              'files_reviewed': len(files),
              'potential_findings': len(deduped),
          },
          'findings': deduped,
      }
      pathlib.Path('/tmp/gh-aw/data/order-review-findings.json').write_text(json.dumps(result, indent=2))
      print(json.dumps(result, indent=2))
      PY
---

# Workshop Ordering Reviewer

You are a specialized reviewer for the workshop content in `workshop/*.md`.

Your focus is **instruction ordering**: detect cases where learners are told to do something before the workshop has prepared the required environment, tool, authentication, or repository state.

Examples of the kinds of problems to flag:
- asking learners to check for Git, `gh`, or Node before they have opened the right terminal or Codespace path
- asking learners to create or clone a project before the setup path is complete
- using `gh aw` commands before the extension or repository setup exists
- prerequisite sections that point to the wrong earlier step for the commands that follow

## Inputs

Read these generated files first:
- `/tmp/gh-aw/data/order-review-context.json`
- `/tmp/gh-aw/data/order-review-findings.json`

Then read only the workshop files cited by the findings you decide to verify.

## Task

1. Review each potential finding from the heuristics output.
2. Confirm whether it is a real ordering inconsistency by checking the cited workshop file and the earlier step that should come first.
3. Ignore false positives.
4. When you find a real problem, create a focused issue for that single inconsistency.

## Issue requirements

Create at most 5 issues. Use one issue per problem area. Each issue body must include:
- the workshop file reviewed
- the exact quoted instruction or command that appears too early
- the missing prerequisite, dependency, or earlier step that should come first
- why the current order could confuse or block a learner
- a concrete suggested fix
- a short note that the issue is ready for an agent to resolve

Use concise titles in this form:
`<file>: <short ordering problem>`

## No-op rule

If the heuristics output is empty or every candidate is a false positive, call `noop` with a short explanation.

## Safe Outputs

- Use `create-issue` for verified ordering problems.
- Use `noop` when no issue should be created.
