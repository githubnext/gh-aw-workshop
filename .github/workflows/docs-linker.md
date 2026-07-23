---
emoji: 🔗
name: Docs Linker
description: >
  Daily workflow that cross-correlates workshop tasks and concepts with
  gh-aw documentation pages. A preindexing step does a shallow sparse checkout
  of docs/src/ from github/gh-aw, parses every markdown source to extract
  section anchors (cached for 7 days), enabling the agent to produce precise
  URL#anchor links. Uses cache-memory round-robin to process at least 10
  workshop files per run, then opens a pull request that adds inline links to
  the rendered gh-aw docs (Astro Starlight site at https://github.github.com/gh-aw/).
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
    expires: 1d
network:
  allowed:
    - defaults
    - github
    - gh-aw
timeout-minutes: 30
checkout:
  repository: github/gh-aw
  sparse-checkout: docs/src
  path: gh-aw-docs-repo
  github-token: ${{ github.token }}
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
      # 7 days: balances freshness with avoiding repeated checkouts on every daily run
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
      import json, os, re, shutil, time

      REPO_URL_BASE = "https://github.github.com/gh-aw"
      DOCS_REPO     = os.path.join(os.environ.get("GITHUB_WORKSPACE", "."), "gh-aw-docs-repo")

      def find_content_dir(base):
          """Find the Starlight content directory under docs/src/."""
          for candidate in [
              os.path.join(base, "docs/src/content/docs"),
              os.path.join(base, "docs/src/content"),
              os.path.join(base, "docs/src"),
          ]:
              if os.path.isdir(candidate) and any(
                  fname.endswith((".md", ".mdx"))
                  for _, _, files in os.walk(candidate)
                  for fname in files
              ):
                  return candidate
          return None

      def slugify(text):
          """Convert heading text to a rehype-slug / GitHub-style anchor ID."""
          text = re.sub(r"<[^>]+>", "", text)   # strip HTML tags
          text = text.lower().strip()
          text = re.sub(r"[^\w\s-]", "", text)  # keep word chars, spaces, hyphens
          text = re.sub(r"\s+", "-", text)      # spaces → hyphens
          return text.strip("-")

      content_dir = find_content_dir(DOCS_REPO)
      if not content_dir:
          raise SystemExit("ERROR: Could not locate content directory in docs/src/")

      print(f"Content directory: {content_dir}")
      index = {"indexed_at": int(time.time()), "pages": {}}

      for root, dirs, files in os.walk(content_dir):
          dirs.sort()
          for fname in sorted(files):
              if not re.search(r"\.mdx?$", fname):
                  continue
              fpath = os.path.join(root, fname)
              rel   = os.path.relpath(fpath, content_dir).replace(os.sep, "/")
              slug  = re.sub(r"\.mdx?$", "", rel)
              if slug.endswith("/index"):
                  slug = slug[:-6]
              url = f"{REPO_URL_BASE}/{slug}/"

              with open(fpath, encoding="utf-8") as f:
                  raw = f.read()

              # Extract title from frontmatter
              title = slug.split("/")[-1].replace("-", " ").title()
              fm = re.match(r"^---\n(.*?)\n---", raw, re.DOTALL)
              if fm:
                  m = re.search(r"^title:\s*[\"']?(.+?)[\"']?\s*$", fm.group(1), re.MULTILINE)
                  if m:
                      title = m.group(1).strip("\"'")

              # Extract section headings from body (skip frontmatter)
              body = raw[fm.end():] if fm else raw
              anchors = []
              for m in re.finditer(r"^#{1,4}\s+(.+)$", body, re.MULTILINE):
                  raw_text = m.group(1).strip()
                  clean = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", raw_text)
                  clean = re.sub(r"[`*_{}]", "", clean).strip()
                  anchor_id = slugify(clean)
                  if anchor_id:
                      anchors.append({
                          "id":   anchor_id,
                          "text": clean,
                          "url":  f"{url}#{anchor_id}",
                      })

              index["pages"][url] = {"title": title, "anchors": anchors}
              print(f"OK   {url}  ({len(anchors)} sections)")

      os.makedirs("/tmp/gh-aw/data",         exist_ok=True)
      os.makedirs("/tmp/gh-aw/cache-memory", exist_ok=True)
      with open("/tmp/gh-aw/data/doc-index.json", "w") as f:
          json.dump(index, f, indent=2)
      shutil.copy("/tmp/gh-aw/data/doc-index.json", "/tmp/gh-aw/cache-memory/docs-index.json")
      print(f"\nDoc index: {len(index['pages'])} pages indexed")
      PYEOF

  - name: Validate indexed documentation URLs
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data /tmp/gh-aw/cache-memory

      INDEX_FILE=/tmp/gh-aw/data/doc-index.json
      OUT_FILE=/tmp/gh-aw/data/validated-doc-index.json
      CACHE_FILE=/tmp/gh-aw/cache-memory/validated-doc-index.json
      # 1 day: re-validates daily so broken/moved pages are detected promptly
      MAX_AGE=86400

      if [[ ! -f "$INDEX_FILE" ]]; then
        echo "No doc index found — skipping URL validation."
        echo '{"indexed_at":0,"validated_at":0,"pages":{}}' > "$OUT_FILE"
        exit 0
      fi

      # Reuse cached validation result if it is fresh AND was built from the same index
      if [[ -f "$CACHE_FILE" ]]; then
        validated_at=$(python3 -c "import json; print(json.load(open('$CACHE_FILE')).get('validated_at', 0))" 2>/dev/null || echo 0)
        cached_index_at=$(python3 -c "import json; print(json.load(open('$CACHE_FILE')).get('indexed_at', 0))" 2>/dev/null || echo 0)
        index_at=$(python3 -c "import json; print(json.load(open('$INDEX_FILE')).get('indexed_at', 0))" 2>/dev/null || echo 0)
        age=$(( $(date +%s) - validated_at ))
        if [[ "$age" -lt "$MAX_AGE" && "$cached_index_at" -eq "$index_at" ]]; then
          echo "Validated URL cache is fresh (${age}s old, matches index). Reusing."
          cp "$CACHE_FILE" "$OUT_FILE"
          jq -r '"Valid pages: " + (.pages | length | tostring)' "$OUT_FILE"
          exit 0
        fi
        echo "Validated URL cache is stale or index changed (age=${age}s). Re-validating."
      else
        echo "No validated URL cache. Validating all indexed URLs."
      fi

      python3 <<'PYEOF'
      import json, shutil, subprocess, sys, time

      INDEX_FILE  = "/tmp/gh-aw/data/doc-index.json"
      OUT_FILE    = "/tmp/gh-aw/data/validated-doc-index.json"
      CACHE_FILE  = "/tmp/gh-aw/cache-memory/validated-doc-index.json"

      with open(INDEX_FILE) as f:
          index = json.load(f)

      valid_pages   = {}
      invalid_pages = []

      for url, page_data in index.get("pages", {}).items():
          result = subprocess.run(
              [
                  "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                  "--max-time", "10",
                  "--retry", "2", "--retry-delay", "1", "--retry-max-time", "15",
                  "-L", "--max-redirs", "10",
                  "-I",  # HEAD request — checks reachability without downloading the body
                  url,
              ],
              capture_output=True, text=True,
          )
          http_code = result.stdout.strip()
          if http_code.startswith("2"):
              valid_pages[url] = page_data
              print(f"OK   {http_code}  {url}")
          else:
              invalid_pages.append({"url": url, "http_code": http_code})
              print(f"FAIL {http_code}  {url}", file=sys.stderr)

      validated = {
          "indexed_at":   index.get("indexed_at", 0),
          "validated_at": int(time.time()),
          "pages":        valid_pages,
      }

      with open(OUT_FILE, "w") as f:
          json.dump(validated, f, indent=2)
      shutil.copy(OUT_FILE, CACHE_FILE)

      print(f"\nValidation complete: {len(valid_pages)} valid, {len(invalid_pages)} invalid")
      if invalid_pages:
          print("Invalid URLs (excluded from validated index):")
          for entry in invalid_pages:
              print(f"  {entry['http_code']}  {entry['url']}")
      PYEOF

      echo "=== Validated doc index ===" && \
        jq -r '.pages | to_entries[] | "  \(.key): \(.value.anchors | length) sections"' \
        /tmp/gh-aw/data/validated-doc-index.json
---

# Docs Linker

You are a documentation curator for the **"Learning GitHub Agentic Workflows"** workshop.

Your job is to keep at least 10 workshop files per run well-connected to the official
gh-aw documentation, by adding precise **inline hyperlinks** at the first bare occurrence
of each matched concept. You never remove content — you only enrich it with inline links.

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

3. Read the pre-validated doc index from `/tmp/gh-aw/data/validated-doc-index.json`.
   This index was built from the docs source files. Every page-level URL was
   confirmed reachable by a deterministic HTTP check in the bash prevalidation step.
   It maps each doc page URL to its title and a list of extracted section anchors:

   ```json
   {
     "indexed_at": 1234567890,
     "validated_at": 1234567890,
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

   Every page-level URL present in this index is confirmed reachable (HTTP 2xx).
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
**term**, or **feature** that has a matching reference page in the doc index
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

1. Look up the page URL for the concept in the doc index.
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

Only include entries where a matching URL exists in the doc index.

---

## Verify Concept Coverage (Doc Index Check)

For the **top 3–5 most prominent concept matches**, confirm that the matched
anchor text or page title actually covers the concept by checking the doc index:

- If the matched entry came from a **section anchor**, its `text` field must
  contain at least one word from the identified concept term. Discard the entry
  if it does not.
- If the matched entry is a **page-level URL** (no anchor), the page title must
  be topically related to the concept. Discard obviously mismatched entries.
- Discard any `doc_url` that does not appear in the validated index.

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

## Decide and Act

### Nothing to change

Call `noop` with a concise explanation when **all** of the following are true:
- No new concept matches were found for all selected files (or all matching terms are already hyperlinked)

If there are inline links to add, proceed with changes.

### Changes to make

Write updated content back to each changed file in `target_files` using the
`edit` tool. Then
create a pull request with:

- **Title**: `workshop docs: add gh-aw doc links` (the `[docs-linker]` prefix is added automatically)
- **Body**: group by file, listing each term linked and the doc URL it points to.

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
