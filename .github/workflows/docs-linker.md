---
emoji: 🔗
name: Docs Linker
description: >
  Daily workflow that cross-correlates workshop tasks and concepts with
  gh-aw documentation pages. A preindexing step fetches every doc page and
  extracts section anchors (cached for 7 days), enabling the agent to produce
  precise URL#anchor links. Uses cache-memory round-robin to process at least
  10 workshop files per run, then opens a pull request that adds inline links
  and a "See Also" section pointing to the rendered gh-aw docs
  (Astro Starlight site at https://github.github.com/gh-aw/).
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional: path to a specific workshop file to process (e.g. workshop/07-your-first-workflow.md)"
        required: false
        type: string
  skip-if-match: "is:pr is:open label:docs-linker"
permissions:
  contents: read
  copilot-requests: write
  pull-requests: read
  issues: read
  actions: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  cache-memory: true
  agentic-workflows:
  bash: true
safe-outputs:
  create-pull-request:
    title-prefix: "[docs-linker] "
    labels: [documentation, docs-linker]
    draft: false
    allowed-files:
      - "workshop/*.md"
      - "workshop/**/*.md"
    if-no-changes: warn
network:
  allowed:
    - defaults
    - github
timeout-minutes: 30
steps:
  - name: Gather workshop files
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      workshop_files=()
      if [ -d workshop ]; then
        while IFS= read -r f; do
          [[ "$(basename "$f")" != "README.md" ]] && workshop_files+=("$f")
        done < <(find workshop -name "*.md" | sort)
      fi

      printf '%s\n' "${workshop_files[@]:-}" \
        | grep -v '^$' \
        | jq -R . \
        | jq -sc '{workshop_files: .}' \
        > /tmp/gh-aw/data/repo-state.json

      echo "=== Workshop files ===" && cat /tmp/gh-aw/data/repo-state.json

  - name: Preindex documentation pages
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data /tmp/gh-aw/cache-memory

      CACHE_FILE=/tmp/gh-aw/cache-memory/docs-index.json
      # 7 days: balances freshness with avoiding excessive HTTP requests on every daily run
      MAX_AGE=604800

      # Reuse cached index if fresh
      if [[ -f "$CACHE_FILE" ]]; then
        indexed_at=$(python3 -c "import json; print(json.load(open('$CACHE_FILE')).get('indexed_at', 0))" 2>/dev/null || echo 0)
        age=$(( $(date +%s) - indexed_at ))
        if [[ "$age" -lt "$MAX_AGE" ]]; then
          echo "Doc index is fresh (${age}s old). Reusing cached index."
          cp "$CACHE_FILE" /tmp/gh-aw/data/doc-index.json
          echo "=== Cached doc index ===" && \
            jq -r '.pages | to_entries[] | "  \(.key): \(.value.anchors | length) sections"' \
            /tmp/gh-aw/data/doc-index.json
          exit 0
        fi
        echo "Doc index is stale (${age}s old). Re-fetching."
      else
        echo "No cached doc index. Building from scratch."
      fi

      python3 <<'PYEOF'
      import json
      import os
      import re
      import shutil
      import subprocess
      import time

      PAGES = [
        ("https://github.github.com/gh-aw/introduction/overview/", "Overview of GitHub Agentic Workflows"),
        ("https://github.github.com/gh-aw/reference/syntax/", "Syntax reference"),
        ("https://github.github.com/gh-aw/reference/agentic/", "Agentic syntax reference"),
        ("https://github.github.com/gh-aw/reference/tools/", "Tools reference"),
        ("https://github.github.com/gh-aw/reference/triggers/", "Triggers reference"),
        ("https://github.github.com/gh-aw/reference/memory/", "Memory reference"),
        ("https://github.github.com/gh-aw/reference/safe-outputs/", "Safe Outputs reference"),
        ("https://github.github.com/gh-aw/reference/safe-outputs-content/", "Safe Outputs - Content types"),
        ("https://github.github.com/gh-aw/reference/safe-outputs-automation/", "Safe Outputs - Automation types"),
        ("https://github.github.com/gh-aw/reference/safe-outputs-management/", "Safe Outputs - Management types"),
        ("https://github.github.com/gh-aw/reference/safe-outputs-runtime/", "Safe Outputs - Runtime types"),
        ("https://github.github.com/gh-aw/reference/network/", "Network reference"),
        ("https://github.github.com/gh-aw/reference/messages/", "Messages reference"),
        ("https://github.github.com/gh-aw/reference/subagents/", "Subagents reference"),
        ("https://github.github.com/gh-aw/reference/loop/", "Loop reference"),
        ("https://github.github.com/gh-aw/guides/patterns/", "Patterns guide"),
        ("https://github.github.com/gh-aw/guides/workflow-patterns/", "Workflow Patterns guide"),
        ("https://github.github.com/gh-aw/guides/token-optimization/", "Token Optimization guide"),
        ("https://github.github.com/gh-aw/reference/context/", "Context reference"),
        ("https://github.github.com/gh-aw/reference/skills/", "Skills reference"),
        ("https://github.github.com/gh-aw/guides/reuse/", "Reuse guide"),
        ("https://github.github.com/gh-aw/reference/experiments/", "Experiments reference"),
        ("https://github.github.com/gh-aw/reference/github-mcp-server/", "GitHub MCP Server reference"),
        ("https://github.github.com/gh-aw/reference/mcp-clis/", "MCP CLIs reference"),
        ("https://github.github.com/gh-aw/reference/agentic-workflows-mcp/", "Agentic Workflows MCP reference"),
        ("https://github.github.com/gh-aw/reference/cli-commands/", "CLI Commands reference"),
        ("https://github.github.com/gh-aw/guides/pr-reviewer/", "PR Reviewer guide"),
        ("https://github.github.com/gh-aw/guides/report/", "Report guide"),
        ("https://github.github.com/gh-aw/reference/llms/", "LLMs reference"),
        ("https://github.github.com/gh-aw/reference/workflow-constraints/", "Workflow Constraints reference"),
        ("https://github.github.com/gh-aw/guides/workflow-editing/", "Workflow Editing guide"),
      ]

      def fetch_anchors(url):
          """Fetch a doc page and extract headings with anchor IDs."""
          result = subprocess.run(
              ["curl", "-sSL", "--max-time", "15", "--retry", "2",
               "--retry-delay", "1", "--max-redirs", "10", url],
              capture_output=True, text=True
          )
          html = result.stdout
          if not html:
              return None, []

          status = subprocess.run(
              ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
               "--max-time", "10", "-L", "--max-redirs", "10", url],
              capture_output=True, text=True
          ).stdout.strip()
          if not status.startswith("2"):
              return status, []

          anchors = []
          # Pattern 1: <h1-4 id="anchor">...</h1-4>
          for m in re.finditer(
              r'<(h[1-4])[^>]*\bid=["\']([^"\']+)["\'][^>]*>(.*?)</\1>',
              html, re.DOTALL | re.IGNORECASE
          ):
              anchor_id = m.group(2)
              text = re.sub(r'<[^>]+>', '', m.group(3)).strip()
              if text and anchor_id:
                  anchors.append({"id": anchor_id, "text": text, "url": url + "#" + anchor_id})

          # Pattern 2 fallback: some Starlight/older static sites emit a bare
          # <a id="anchor"></a> anchor tag before the heading text rather than
          # placing id directly on the heading element. Only try this if
          # Pattern 1 produced no results.
          if not anchors:
              for m in re.finditer(
                  r'<a[^>]*\bid=["\']([^"\']+)["\'][^>]*>\s*</a>\s*(.*?)\s*(?=<(?:h[1-4]|a\s))',
                  html, re.DOTALL | re.IGNORECASE
              ):
                  anchor_id = m.group(1)
                  text = re.sub(r'<[^>]+>', '', m.group(2)).strip()
                  if text and anchor_id:
                      anchors.append({"id": anchor_id, "text": text, "url": url + "#" + anchor_id})

          return status, anchors

      index = {"indexed_at": int(time.time()), "pages": {}}

      for url, title in PAGES:
          status, anchors = fetch_anchors(url)
          # status is None when curl returned no output; otherwise it is a
          # string HTTP status code (e.g. "200", "404").
          if status is None or not status.startswith("2"):
              print("SKIP " + url + " - HTTP " + str(status))
              continue
          index["pages"][url] = {"title": title, "anchors": anchors}
          print("OK   " + url + " - " + str(len(anchors)) + " sections")

      os.makedirs("/tmp/gh-aw/data", exist_ok=True)
      os.makedirs("/tmp/gh-aw/cache-memory", exist_ok=True)
      with open("/tmp/gh-aw/data/doc-index.json", "w") as f:
          json.dump(index, f, indent=2)
      shutil.copy("/tmp/gh-aw/data/doc-index.json", "/tmp/gh-aw/cache-memory/docs-index.json")
      print("\nDoc index: " + str(len(index["pages"])) + " pages indexed")
      PYEOF
---

# Docs Linker

You are a documentation curator for the **"Learning GitHub Agentic Workflows"** workshop.

Your job is to keep at least 10 workshop files per run well-connected to the official
gh-aw documentation, by adding precise **inline hyperlinks** and a **"📚 See
Also"** section at the bottom. You never remove content — you only enrich it
with links.

---

## Docs site

The rendered gh-aw documentation is hosted at:

```
https://github.github.com/gh-aw/
```

The URL structure follows [Astro Starlight](https://starlight.astro.build/)
conventions:

```
https://github.github.com/gh-aw/<category>/<page-slug>/
```

Use the table below as your authoritative map of source reference files to
rendered doc URLs. When the agent discovers additional pages while fetching
docs, add them to its working knowledge.

| Source file in github/gh-aw | Rendered URL |
|---|---|
| `.github/aw/github-agentic-workflows.md` | `https://github.github.com/gh-aw/introduction/overview/` |
| `.github/aw/syntax-core.md` | `https://github.github.com/gh-aw/reference/syntax/` |
| `.github/aw/syntax-agentic.md` | `https://github.github.com/gh-aw/reference/agentic/` |
| `.github/aw/syntax-tools-imports.md` | `https://github.github.com/gh-aw/reference/tools/` |
| `.github/aw/triggers.md` | `https://github.github.com/gh-aw/reference/triggers/` |
| `.github/aw/memory.md` | `https://github.github.com/gh-aw/reference/memory/` |
| `.github/aw/safe-outputs.md` | `https://github.github.com/gh-aw/reference/safe-outputs/` |
| `.github/aw/safe-outputs-content.md` | `https://github.github.com/gh-aw/reference/safe-outputs-content/` |
| `.github/aw/safe-outputs-automation.md` | `https://github.github.com/gh-aw/reference/safe-outputs-automation/` |
| `.github/aw/safe-outputs-management.md` | `https://github.github.com/gh-aw/reference/safe-outputs-management/` |
| `.github/aw/safe-outputs-runtime.md` | `https://github.github.com/gh-aw/reference/safe-outputs-runtime/` |
| `.github/aw/network.md` | `https://github.github.com/gh-aw/reference/network/` |
| `.github/aw/messages.md` | `https://github.github.com/gh-aw/reference/messages/` |
| `.github/aw/subagents.md` | `https://github.github.com/gh-aw/reference/subagents/` |
| `.github/aw/loop.md` | `https://github.github.com/gh-aw/reference/loop/` |
| `.github/aw/patterns.md` | `https://github.github.com/gh-aw/guides/patterns/` |
| `.github/aw/workflow-patterns.md` | `https://github.github.com/gh-aw/guides/workflow-patterns/` |
| `.github/aw/token-optimization.md` | `https://github.github.com/gh-aw/guides/token-optimization/` |
| `.github/aw/context.md` | `https://github.github.com/gh-aw/reference/context/` |
| `.github/aw/skills.md` | `https://github.github.com/gh-aw/reference/skills/` |
| `.github/aw/reuse.md` | `https://github.github.com/gh-aw/guides/reuse/` |
| `.github/aw/experiments.md` | `https://github.github.com/gh-aw/reference/experiments/` |
| `.github/aw/github-mcp-server.md` | `https://github.github.com/gh-aw/reference/github-mcp-server/` |
| `.github/aw/mcp-clis.md` | `https://github.github.com/gh-aw/reference/mcp-clis/` |
| `.github/aw/agentic-workflows-mcp.md` | `https://github.github.com/gh-aw/reference/agentic-workflows-mcp/` |
| `.github/aw/cli-commands.md` | `https://github.github.com/gh-aw/reference/cli-commands/` |
| `.github/aw/pr-reviewer.md` | `https://github.github.com/gh-aw/guides/pr-reviewer/` |
| `.github/aw/report.md` | `https://github.github.com/gh-aw/guides/report/` |
| `.github/aw/llms.md` | `https://github.github.com/gh-aw/reference/llms/` |
| `.github/aw/workflow-constraints.md` | `https://github.github.com/gh-aw/reference/workflow-constraints/` |
| `.github/aw/workflow-editing.md` | `https://github.github.com/gh-aw/guides/workflow-editing/` |

---

## Load State

1. Read `/tmp/gh-aw/data/repo-state.json`. It contains:
   - `workshop_files` — sorted array of all workshop markdown paths

2. Load the cache-memory file `/tmp/gh-aw/cache-memory/docs-linker-state.json` if it exists.
   Initialize with defaults when absent:

   ```json
   {
     "round_robin_index": 0,
     "files_processed": []
   }
   ```

3. Read the prebuilt doc index from `/tmp/gh-aw/data/doc-index.json`. This index maps
   each doc page URL to its title and a list of extracted section anchors:

   ```json
   {
     "indexed_at": 1234567890,
     "pages": {
       "https://github.github.com/gh-aw/reference/safe-outputs/": {
         "title": "Safe Outputs reference",
         "anchors": [
           { "id": "create-pull-request", "text": "Create Pull Request",
             "url": "https://github.github.com/gh-aw/reference/safe-outputs/#create-pull-request" },
           ...
         ]
       },
       ...
     }
   }
   ```

   All page-level URLs in this index have already been validated as reachable.
   Use the anchor URLs to produce precise `URL#anchor` links when a concept
   matches a specific section heading.

---

## Select Files (Round-Robin)

1. If the `focus` input is non-empty, use it as the only entry in `target_files`.
   Otherwise:
   - `batch_size = min(10, len(workshop_files))`
   - `target_files = [workshop_files[(round_robin_index + i) % len(workshop_files)] for i in range(batch_size)]`
   - Increment `round_robin_index` by `batch_size` in the updated state.

2. Read the full content of each file in `target_files`.

---

## Identify Concepts and Tasks

For each file in `target_files`, scan the file for every **concept**, **task**,
**term**, or **feature** that has a matching reference page in the docs-site table
above. Consider:

- Frontmatter fields mentioned (`on:`, `permissions:`, `tools:`, `safe-outputs:`,
  `network:`, `cache-memory:`, `strict:`, `timeout-minutes:`, etc.)
- Named tools or toolsets (`bash`, `edit`, `github`, `agentic-workflows`, etc.)
- Workflow trigger types (`schedule`, `workflow_dispatch`, `push`, `pull_request`, etc.)
- Safe-output types (`create-pull-request`, `add-comment`, `create-issue`, etc.)
- Concepts like subagents, memory, loop, patterns, token optimization
- CLI commands (`gh aw compile`, `gh aw run`, etc.)

For each matched concept, resolve the most precise URL using the doc index loaded
in the previous step:

1. Look up the page URL for the concept in the docs-site table.
2. If the doc index has anchors for that page, find the anchor whose `text` most
   closely matches the concept term (case-insensitive, partial match allowed).
3. If a matching anchor is found, use its `url` field (which includes `#anchor-id`)
   as the `doc_url` for that mapping entry.
4. If no anchor match is found, fall back to the page-level URL.

Build a mapping:

```json
[
  {
    "term": "create-pull-request",
    "context": "the sentence or heading where the term appears",
    "doc_url": "https://github.github.com/gh-aw/reference/safe-outputs/#create-pull-request",
    "doc_title": "Safe Outputs — Create Pull Request"
  },
  {
    "term": "schedule",
    "context": "the sentence or heading where the term appears",
    "doc_url": "https://github.github.com/gh-aw/reference/triggers/#schedule",
    "doc_title": "Triggers — schedule"
  },
  ...
]
```

Only include entries where a matching URL exists in the table.

---

## Verify Concept Coverage (Doc Index Check)

For the **top 3–5 most prominent concept matches**, confirm that the matched
anchor text or page title actually covers the concept by checking the doc index:

- If the matched entry came from a **section anchor**, its `text` field must
  contain at least one word from the identified concept term. Discard the entry
  if it does not.
- If the matched entry is a **page-level URL** (no anchor), the page title must
  be topically related to the concept. Discard obviously mismatched entries.

This replaces fetching raw source files from `github/gh-aw`, which is
unavailable during workflow execution.

---

## Phase 4b — Validate Rendered URLs (Live HTTP Check)

URLs for pages that appear in the doc index are already confirmed reachable —
skip the HTTP check for those entries.

For any mapping entry whose `doc_url` is **not** covered by the doc index
(e.g., a newly discovered page or an anchor URL not seen before), run:

```bash
http_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 \
  --retry 2 --retry-delay 1 --retry-max-time 15 -L \
  --max-redirs 10 "<doc_url>")
```

Evaluate the HTTP status code:

- If `http_code` is **2xx** (e.g. `200`, `201`) → keep the mapping entry.
- If `http_code` is **000** (connection failure, timeout, redirect loop, or max redirects exceeded) → **discard** the mapping entry.
- If `http_code` is **4xx** or **5xx** → **discard** the mapping entry.

For any discarded entry, log with the actual values substituted:
`Skipping https://github.github.com/gh-aw/reference/cli-commands/ — HTTP 404; removing from link candidates.`

Do **not** add any link whose URL fails this check.

---

## Add Inline Links

For each verified mapping entry, search the current target file for the **first bare
occurrence** of the term (i.e., the term appears as plain text, not already
inside a Markdown link). Wrap only that **first** occurrence with a hyperlink.
Use the most precise URL available — prefer `URL#anchor` links from the doc index
over bare page-level URLs:

```markdown
[create-pull-request](https://github.github.com/gh-aw/reference/safe-outputs/#create-pull-request)
```

Rules:
- Link each distinct term **at most once** per file (first occurrence only).
- Do not modify occurrences that are already hyperlinks.
- Do not link occurrences inside fenced code blocks (` ``` ... ``` `).
- Do not link occurrences wrapped in inline code (single backticks, e.g. `` `safe-outputs` ``).
- Do not link occurrences inside YAML frontmatter (`---` … `---`).
- Preserve the exact surrounding text; change only the target word/phrase.
- If a term already has an inline link in the file (any URL), skip it.

---

## Add or Update "See Also" Section

For each file in `target_files`, locate any existing `## 📚 See Also` (or
`## See Also`) section at the bottom of the current file. If it exists, update
it. If not, append one.

The section must list **every** doc page referenced by the inline links added in
Phase 5, **plus** any additional highly relevant docs for the file's topic that
were not linked inline (e.g., overview pages that provide broader context).
Format:

```markdown
## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
```

Place the section at the very end of the file, after `**Next:**` or `**Return to:**`
navigation links (if they exist), so it does not interrupt the learning flow.

---

## Decide and Act

### Nothing to change

Call `noop` with a concise explanation when **all** of the following are true:
- No new concept matches were found for all selected files (or all matching terms are already hyperlinked)
- All selected files already have a complete and up-to-date `## 📚 See Also` section covering all relevant doc pages

If there are inline links to add **or** the "See Also" section needs updating, proceed with changes.

### Changes to make

Write updated content back to each changed file in `target_files` using the
`edit` tool. Then
create a pull request with:

- **Title**: `workshop docs: add gh-aw doc links` (the `[docs-linker]` prefix is added automatically)
- **Body**: group by file, listing each term linked, the doc URL it points to, and the updated "See Also" entries.

---

## Update Cache State

Write the updated state to `/tmp/gh-aw/cache-memory/docs-linker-state.json`:

```json
{
  "round_robin_index": <incremented value>,
  "files_processed": [<append each processed file if not already present>]
}
```

The cache-memory tool persists this between daily runs.
