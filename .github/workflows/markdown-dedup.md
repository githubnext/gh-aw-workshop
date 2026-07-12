---
emoji: 🧹
name: Markdown Dedup
description: >
  Daily scanner that uses a Markdown AST parser (mistletoe / QMD-style) to
  chunk workshop and workflow markdown files into sections, computes TF-IDF
  cosine similarity to cluster near-duplicate segments (across files and
  within the same file), and opens agent-ready issues prompting automated
  consolidation.
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional: 'workshop' to scan workshop/ only, 'workflows' to scan .github/workflows/ only"
        required: false
        type: string
  skip-if-match: "is:issue is:open label:dedup"
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
  copilot-requests: write
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  agentic-workflows:
  bash: true
safe-outputs:
  create-issue:
    title-prefix: "[dedup] "
    labels: [documentation, dedup]
    deduplicate-by-title: true
    max: 5
network:
  allowed:
    - defaults
timeout-minutes: 20
steps:
  - name: Install Markdown AST parser
    run: pip install --quiet mistletoe

  - name: Chunk markdown files using AST parser
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import collections
      import json
      import pathlib
      import re
      import sys

      # -- AST parser setup --------------------------------------------------
      try:
          import mistletoe
          from mistletoe import Document
          from mistletoe.ast_renderer import AstRenderer
          PARSER = "mistletoe"
      except ImportError:
          PARSER = "regex"

      # -- mistletoe-based AST chunker ---------------------------------------

      def _text_from_node(node):
          """Recursively extract plain text from a mistletoe AST node dict."""
          if isinstance(node, str):
              return node
          raw = node.get("content", "")
          if isinstance(raw, str) and raw:
              return raw
          parts = [_text_from_node(c) for c in node.get("children", [])]
          return " ".join(p for p in parts if p)

      def chunk_with_mistletoe(text, filepath):
          """Return a list of section dicts using mistletoe's full AST."""
          with AstRenderer() as renderer:
              doc = Document(text)
              raw = renderer.render(doc)
          ast = json.loads(raw)

          chunks = []
          heading_stack = []   # [{level, title}]
          current = None

          for node in ast.get("children", []):
              if node.get("type") == "Heading":
                  level = node.get("level", 1)
                  title = _text_from_node(node).strip()

                  if current is not None:
                      current["content"] = "\n".join(current.pop("_lines"))
                      current["text"] = (current["title"] + " " + current["content"]).strip()
                      current["word_count"] = len(re.findall(r'\S+', current["text"]))
                      if current["word_count"] >= 20:
                          chunks.append(current)

                  heading_stack = [h for h in heading_stack if h["level"] < level]
                  heading_stack.append({"level": level, "title": title})
                  current = {
                      "file": str(filepath),
                      "level": level,
                      "title": title,
                      "heading_path": [h["title"] for h in heading_stack],
                      "_lines": [],
                  }
              elif current is not None:
                  current["_lines"].append(_text_from_node(node))

          if current is not None:
              current["content"] = "\n".join(current.pop("_lines"))
              current["text"] = (current["title"] + " " + current["content"]).strip()
              current["word_count"] = len(re.findall(r'\S+', current["text"]))
              if current["word_count"] >= 20:
                  chunks.append(current)

          return chunks

      # -- regex-based fallback chunker -------------------------------------

      def chunk_with_regex(text, filepath):
          """Heading-level section chunker using regex (no external deps)."""
          heading_re = re.compile(r'^(#{1,6})\s+(.+)$')
          fence_re = re.compile(r'^```')

          lines = text.splitlines()
          chunks = []
          in_fence = False
          current = None
          heading_stack = []

          for lineno, raw_line in enumerate(lines, start=1):
              line = raw_line.rstrip()
              if fence_re.match(line):
                  in_fence = not in_fence
              if not in_fence:
                  m = heading_re.match(line)
                  if m:
                      level = len(m.group(1))
                      title = m.group(2).strip()

                      if current is not None:
                          current["content"] = "\n".join(current.pop("_lines"))
                          current["text"] = (current["title"] + " " + current["content"]).strip()
                          current["word_count"] = len(re.findall(r'\S+', current["text"]))
                          if current["word_count"] >= 20:
                              chunks.append(current)

                      heading_stack = [h for h in heading_stack if h["level"] < level]
                      heading_stack.append({"level": level, "title": title})
                      current = {
                          "file": str(filepath),
                          "level": level,
                          "title": title,
                          "heading_path": [h["title"] for h in heading_stack],
                          "_lines": [],
                      }
                      continue
              if current is not None:
                  current["_lines"].append(line)

          if current is not None:
              current["content"] = "\n".join(current.pop("_lines"))
              current["text"] = (current["title"] + " " + current["content"]).strip()
              current["word_count"] = len(re.findall(r'\S+', current["text"]))
              if current["word_count"] >= 20:
                  chunks.append(current)

          return chunks

      # -- file collection ---------------------------------------------------

      focus = "${{ inputs.focus || '' }}"
      files_to_scan = []

      if focus != "workflows":
          workshop_dir = pathlib.Path("workshop")
          if workshop_dir.exists():
              files_to_scan.extend(
                  sorted(p for p in workshop_dir.glob("*.md") if p.name != "README.md")
              )

      if focus != "workshop":
          wf_dir = pathlib.Path(".github/workflows")
          if wf_dir.exists():
              files_to_scan.extend(sorted(p for p in wf_dir.glob("*.md")))

      # -- chunk all files ---------------------------------------------------

      all_chunks = []
      for fpath in files_to_scan:
          raw = fpath.read_text(errors="replace")
          # Strip YAML frontmatter
          body = raw
          if raw.startswith("---\n") and "\n---\n" in raw[4:]:
              end = raw.find("\n---\n", 4)
              body = raw[end + 5:]

          try:
              if PARSER == "mistletoe":
                  file_chunks = chunk_with_mistletoe(body, fpath)
              else:
                  file_chunks = chunk_with_regex(body, fpath)
          except Exception:
              file_chunks = chunk_with_regex(body, fpath)

          all_chunks.extend(file_chunks)

      # -- persist -----------------------------------------------------------

      output = {
          "parser": PARSER,
          "total_files": len(files_to_scan),
          "total_chunks": len(all_chunks),
          "chunks": all_chunks,
      }
      pathlib.Path("/tmp/gh-aw/data/md-chunks.json").write_text(
          json.dumps(output, indent=2)
      )
      print(
          f"Parser: {PARSER} | Files: {len(files_to_scan)} | "
          f"Sections: {len(all_chunks)}"
      )
      PY

  - name: Cluster near-duplicate sections (TF-IDF cosine)
    run: |
      set -euo pipefail

      python3 <<'PY'
      import collections
      import json
      import math
      import pathlib
      import re
      import sys

      # 0.55 = lower bound of "partial overlap" range (see markdown-chunker SKILL.md)
      SIMILARITY_THRESHOLD = 0.55

      def tokenize(text):
          return re.findall(r'\b[a-z]{3,}\b', text.lower())

      def tfidf_vector(tokens, idf):
          tf = collections.Counter(tokens)
          total = len(tokens) or 1
          return {t: (count / total) * idf.get(t, 1.0) for t, count in tf.items()}

      def cosine(v1, v2):
          shared = set(v1) & set(v2)
          if not shared:
              return 0.0
          dot = sum(v1[k] * v2[k] for k in shared)
          mag1 = math.sqrt(sum(x * x for x in v1.values()))
          mag2 = math.sqrt(sum(x * x for x in v2.values()))
          return dot / (mag1 * mag2) if mag1 and mag2 else 0.0

      # -- load chunks -------------------------------------------------------

      data = json.loads(pathlib.Path("/tmp/gh-aw/data/md-chunks.json").read_text())
      chunks = data["chunks"]

      if not chunks:
          pathlib.Path("/tmp/gh-aw/data/md-clusters.json").write_text(
              json.dumps({"clusters": [], "total_pairs": 0, "total_clusters": 0})
          )
          print("No chunks to cluster")
          sys.exit(0)

      # -- TF-IDF ------------------------------------------------------------

      tokenized = [tokenize(c["text"]) for c in chunks]

      df = collections.Counter()
      for tok_set in tokenized:
          for t in set(tok_set):
              df[t] += 1
      N = len(chunks)
      idf = {t: math.log(N / (1 + cnt)) for t, cnt in df.items()}

      vectors = [tfidf_vector(tok, idf) for tok in tokenized]

      # -- pairwise similarity ------------------------------------------------

      similar_pairs = []
      for i in range(len(chunks)):
          for j in range(i + 1, len(chunks)):
              sim = cosine(vectors[i], vectors[j])
              if sim >= SIMILARITY_THRESHOLD:
                  similar_pairs.append((i, j, round(sim, 3)))

      # -- union-find clustering ---------------------------------------------

      parent = list(range(len(chunks)))

      def find(x):
          while parent[x] != x:
              parent[x] = parent[parent[x]]
              x = parent[x]
          return x

      def union(a, b):
          parent[find(a)] = find(b)

      for i, j, _ in similar_pairs:
          union(i, j)

      group_map = collections.defaultdict(list)
      for idx in range(len(chunks)):
          group_map[find(idx)].append(idx)

      # -- build cluster objects ---------------------------------------------

      pair_lookup = {(min(i, j), max(i, j)): sim for i, j, sim in similar_pairs}

      clusters = []
      for root, members in group_map.items():
          if len(members) < 2:
              continue
          files = {chunks[m]["file"] for m in members}

          member_set = set(members)
          max_sim = max(
              (pair_lookup.get((min(i, j), max(i, j)), 0.0)
               for i in members for j in members if i != j),
              default=0.0,
          )

          clusters.append({
              "id": f"cluster-{root}",
              "size": len(members),
              "files": sorted(files),
              "max_similarity": max_sim,
              "chunks": [chunks[m] for m in members],
          })

      clusters.sort(key=lambda c: -c["max_similarity"])

      # Keep top 10 clusters by similarity to bound issue creation volume
      result = {
          "clusters": clusters[:10],
          "total_pairs": len(similar_pairs),
          "total_clusters": len(clusters),
      }
      pathlib.Path("/tmp/gh-aw/data/md-clusters.json").write_text(
          json.dumps(result, indent=2)
      )
      print(
          f"Similar pairs: {len(similar_pairs)} | "
          f"Clusters: {len(clusters)}"
      )
      PY
---

# Markdown Dedup Reviewer

You are a technical content editor for the **gh-aw-workshop** repository.

Your job is to detect duplicate and near-duplicate content across markdown files,
triage each cluster using an inline analyst agent, and open focused issues that
prompt an automated agent to consolidate the redundant sections.

---

## Load Results

Read:

- `/tmp/gh-aw/data/md-chunks.json` — all significant sections parsed from markdown files
- `/tmp/gh-aw/data/md-clusters.json` — top clusters of near-duplicate sections

Key fields in `md-clusters.json`:

| Field | Meaning |
|---|---|
| `clusters` | Top ≤ 10 clusters sorted by `max_similarity` descending |
| `total_pairs` | Similar pairs detected |
| `total_clusters` | Total clusters found |

For chunking details, consult the `markdown-chunker` inline skill:
`.github/skills/markdown-chunker/SKILL.md`

If `total_clusters == 0` or `clusters` is empty, call `noop` with:

```
No duplicate clusters found. Scanned {total_files} files → {total_chunks} sections.
```

---

## Triage Each Cluster

For each cluster in `clusters`, invoke the `markdown-dedup-analyst` inline agent
(`.github/agents/markdown-dedup-analyst.agent.md`) and pass the full cluster object.

Ask the analyst:

1. Are these sections genuinely redundant (same concept, similar wording)?
2. Which file/section should be the canonical home for the content?
3. What exact change should the collapsing agent make?
4. Is there value lost by merging (unique details in only one copy)?

Collect the structured JSON verdict for each cluster before moving to Phase 3.

---

## Verify Findings

For each cluster where the analyst returned `"verdict": "genuine"`, read the
actual file sections to confirm:

- Both sections exist and match the cluster data.
- The similarity is real (not an artefact of very short repeated boilerplate).
- The canonical file and proposed action are sensible.

Discard any cluster where verification fails.

---

## Create Issues

For each verified genuine duplicate cluster, create one issue.

**Title** format (the `[dedup]` prefix is added automatically):

```
<basename(file1)> + <basename(file2)>: duplicate "<section title>" (sim={similarity})
```

**Body** must include:

- Which sections are duplicated — file path + heading breadcrumb for each
- A short excerpt (≤ 5 lines) showing the overlap
- The analyst's recommended consolidation action (canonical file, what to keep,
  how to cross-reference)
- A closing line: `This issue is ready for an automated agent to resolve.`

Limit to 5 issues maximum.

---

## No-op Rule

Call `noop` (with a concise reason) when:

- No clusters were detected.
- All clusters are `parallel` or `false-positive` after triage.
- Fewer than 2 clusters pass verification.

---

## Safe Outputs

| Situation | Output |
|---|---|
| Confirmed duplicate clusters exist | `create-issue` (one per cluster) |
| Nothing actionable | `noop` with reason |
