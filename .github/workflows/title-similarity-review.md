---
emoji: 🏷️
name: Title Similarity Review
description: >
  Daily scanner that extracts markdown titles and headings, detects clusters of
  semantically similar titles that appear too often, and opens focused issues
  for consolidation.
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
strict: true
network:
  allowed:
    - defaults
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  bash: true
safe-outputs:
  create-issue:
    title-prefix: "[title-similarity] "
    labels: [documentation]
    deduplicate-by-title: true
    max: 3
timeout-minutes: 20
steps:
  - name: Extract markdown titles
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json
      import pathlib
      import re

      heading_re = re.compile(r'^(#{1,6})\s+(.+?)\s*$')
      fence_re = re.compile(r'^```')

      files = []
      root = pathlib.Path(".")

      workshop_dir = root / "workshop"
      if workshop_dir.exists():
          files.extend(sorted(p for p in workshop_dir.glob("*.md") if p.name != "README.md"))

      workflow_dir = root / ".github" / "workflows"
      if workflow_dir.exists():
          files.extend(sorted(workflow_dir.glob("*.md")))

      titles = []
      for path in files:
          raw = path.read_text(errors="replace")
          body = raw
          if raw.startswith("---\n") and "\n---\n" in raw[4:]:
              body = raw[raw.find("\n---\n", 4) + 5 :]

          in_fence = False
          for line_no, line in enumerate(body.splitlines(), start=1):
              stripped = line.rstrip()
              if fence_re.match(stripped):
                  in_fence = not in_fence
                  continue
              if in_fence:
                  continue
              m = heading_re.match(stripped)
              if not m:
                  continue
              level = len(m.group(1))
              title = m.group(2).strip()
              if len(title) < 8:
                  continue
              titles.append(
                  {
                      "file": str(path),
                      "line": line_no,
                      "level": level,
                      "title": title,
                  }
              )

      out = {
          "total_files": len(files),
          "total_titles": len(titles),
          "titles": titles,
      }
      pathlib.Path("/tmp/gh-aw/data/title-index.json").write_text(json.dumps(out, indent=2))
      print(f"Scanned {len(files)} files and extracted {len(titles)} titles")
      PY

  - name: Cluster similar titles
    run: |
      set -euo pipefail

      python3 <<'PY'
      import collections
      import difflib
      import json
      import pathlib
      import re

      MIN_CLUSTER_SIZE = 3
      SIMILARITY_THRESHOLD = 0.72
      TOKEN_RE = re.compile(r"\b[a-z0-9]{3,}\b")
      STOPWORDS = {
          "step", "steps", "side", "quest", "workshop", "github", "agentic",
          "workflow", "workflows", "check", "review", "run", "daily", "and",
          "the", "for", "with", "your", "from", "into", "this", "that",
      }

      def norm_tokens(text):
          tokens = [t for t in TOKEN_RE.findall(text.lower()) if t not in STOPWORDS]
          return tokens

      def similarity(a, b):
          ta = set(norm_tokens(a))
          tb = set(norm_tokens(b))
          if not ta or not tb:
              return 0.0
          jaccard = len(ta & tb) / len(ta | tb)
          ratio = difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()
          return (0.65 * jaccard) + (0.35 * ratio)

      data = json.loads(pathlib.Path("/tmp/gh-aw/data/title-index.json").read_text())
      titles = data["titles"]

      n = len(titles)
      parent = list(range(n))

      def find(x):
          while parent[x] != x:
              parent[x] = parent[parent[x]]
              x = parent[x]
          return x

      def union(a, b):
          parent[find(a)] = find(b)

      pair_scores = {}
      for i in range(n):
          for j in range(i + 1, n):
              score = similarity(titles[i]["title"], titles[j]["title"])
              if score >= SIMILARITY_THRESHOLD:
                  pair_scores[(i, j)] = round(score, 3)
                  union(i, j)

      groups = collections.defaultdict(list)
      for i in range(n):
          groups[find(i)].append(i)

      clusters = []
      for root, members in groups.items():
          if len(members) < MIN_CLUSTER_SIZE:
              continue
          members_sorted = sorted(members)
          max_score = 0.0
          for i in members_sorted:
              for j in members_sorted:
                  if i >= j:
                      continue
                  max_score = max(max_score, pair_scores.get((i, j), 0.0))
          clusters.append(
              {
                  "id": f"cluster-{root}",
                  "size": len(members_sorted),
                  "max_similarity": round(max_score, 3),
                  "titles": [titles[idx] for idx in members_sorted],
              }
          )

      clusters.sort(key=lambda c: (-c["size"], -c["max_similarity"]))
      result = {
          "total_clusters": len(clusters),
          "clusters": clusters[:10],
      }
      pathlib.Path("/tmp/gh-aw/data/title-clusters.json").write_text(
          json.dumps(result, indent=2)
      )
      print(f"Detected {len(clusters)} clusters with >= {MIN_CLUSTER_SIZE} titles")
      PY
---

# Title Similarity Reviewer

You are a technical content reviewer for **gh-aw-workshop**.

Your task is to identify markdown title/heading phrasing that appears in high
volume and is semantically too similar, then create focused issues for
consolidation.

---

## Phase 1 — Load Data

Read:

- `/tmp/gh-aw/data/title-index.json`
- `/tmp/gh-aw/data/title-clusters.json`

If `total_clusters == 0`, call `noop` with:

```
No high-volume similar-title clusters found. Scanned {total_files} files and {total_titles} titles.
```

---

## Phase 2 — Validate Clusters

For each cluster in `title-clusters.json`:

1. Confirm the cluster reflects semantically similar headings (not just shared
   generic words). Treat headings as semantically similar when they describe the
   same learner intent (for example, "Run your workflow" and "Execute the
   workflow"), and reject clusters where overlap comes only from generic tokens
   such as "Step", "Checkpoint", or "Next steps".
2. Ignore clusters that represent valid parallel structure (for example repeated `## ✅ Checkpoint` headings).
3. Keep only genuine clusters where title wording can be consolidated, clarified, or differentiated.

Prioritize clusters with:

- Larger cluster size
- Higher max similarity
- Coverage across multiple files

---

## Phase 3 — Create Issues (max 3)

Create at most **3** issues, one per validated cluster.

Title format (prefix is added automatically):

```
<cluster representative title>: high-volume similar headings (<size>)
```

Use the first heading from the cluster's `titles` list as the representative
title after sorting `titles` by:

1. highest exact-title frequency within the cluster
2. shortest title length
3. alphabetical order

Issue body must include:

- Why this cluster is semantically too similar
- File paths + line numbers for the affected headings
- The exact heading text for each occurrence
- Suggested direction (consolidate shared heading, rename headings for clearer intent, or move repeated text into a canonical section)
- Closing sentence: `This issue is ready for an automated agent to resolve.`

---

## No-op Rule

Call `noop` if all clusters are false positives or acceptable intentional structure.

---

## Safe Outputs

- Use `create-issue` for validated clusters (max 3).
- Use `noop` when no action is needed.
