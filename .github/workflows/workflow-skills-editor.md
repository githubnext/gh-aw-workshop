---
emoji: ✂️
name: Workflow Skills Editor
description: Daily workflow editor that trims workflow prompt bloat, removes duplication, and aligns workflow source content with GitHub Skills lesson tone.
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional workflow improvement hint (for example: tone, duplication, structure, validation)"
        required: false
        type: string
  skip-if-match: "is:pr is:open label:workflow-editor"
permissions:
  contents: read
  actions: read
  copilot-requests: write
  pull-requests: read
  issues: read
tools:
  agentic-workflows:
safe-outputs:
  create-pull-request:
    title-prefix: "[workflow-editor] "
    labels: [workflow-editor, documentation]
    draft: true
    protected-files:
      policy: request_review
    allowed-files:
      - ".github/workflows/*.md"
      - ".github/workflows/*.lock.yml"
    if-no-changes: warn
network:
  allowed:
    - defaults
steps:
  - name: Gather workflow prompt state
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      python3 <<'PY'
      import collections
      import json
      import pathlib
      import re

      workflow_dir = pathlib.Path(".github/workflows")
      files = sorted(p for p in workflow_dir.glob("*.md"))

      paragraph_splitter = re.compile(r"\n\s*\n+")
      heading_re = re.compile(r"^##+\s+", re.MULTILINE)
      repeated_blocks = collections.defaultdict(set)
      entries = []

      for path in files:
          text = path.read_text()
          body = text.split("\n---\n", 1)[1] if text.startswith("---\n") and "\n---\n" in text else text

          blocks = []
          for block in paragraph_splitter.split(body):
              normalized = " ".join(block.split())
              if len(normalized.split()) < 18:
                  continue
              if normalized.startswith("# "):
                  continue
              repeated_blocks[normalized].add(path.name)
              blocks.append(normalized)

          entries.append(
              {
                  "path": str(path),
                  "name": path.name,
                  "line_count": len(text.splitlines()),
                  "word_count": len(re.findall(r"\S+", text)),
                  "heading_count": len(heading_re.findall(body)),
                  "long_block_count": len(blocks),
              }
          )

      duplicates = [
          {
              "text": text,
              "files": sorted(names),
              "file_count": len(names),
              "word_count": len(text.split()),
          }
          for text, names in repeated_blocks.items()
          if len(names) > 1
      ]
      duplicates.sort(key=lambda item: (-item["file_count"], -item["word_count"], item["text"]))

      pathlib.Path("/tmp/gh-aw/data/workflow-editor-state.json").write_text(
          json.dumps(
              {
                  "files": entries,
                  "file_count": len(entries),
                  "duplicate_blocks": duplicates[:25],
              },
              indent=2,
          )
      )
      PY
---

# Workflow Skills Editor

You are a workflow editor for `.github/workflows/*.md`.

Create exactly one draft pull request per run with one focused improvement to the
workflow source files.

## Read first

1. `/tmp/gh-aw/data/workflow-editor-state.json`
2. Only the workflow files you need from `.github/workflows/*.md`

If `focus` is provided, use it to guide the next improvement while keeping the
change set coherent and small.

## Mission

Reduce prompt bloat, remove duplication, and align workflow source content with
GitHub Skills lesson tone: short, direct, supportive, practical, and
educational.

## What counts as a good improvement

Choose one bounded improvement that does at least one of these:

- deletes repeated instructions that add little value
- merges overlapping guidance across nearby sections
- shortens long explanations without losing meaning, safety, or clarity
- rewrites dense text into lean, learner-friendly instructions
- tightens examples or validation guidance so the workflow stays educational and
  information-dense

## Guardrails

- Keep the workflow's purpose, trigger, permissions, safe outputs, and safety
  posture intact unless a small supporting fix is required.
- Prefer subtractive edits over additive edits.
- Change only the files needed for one coherent improvement.
- Do not edit files outside `.github/workflows/`.
- Do not edit `*.lock.yml` by hand.
- Preserve required validation, safe output, and no-op behavior.
- Avoid generic marketing language. Write like a GitHub Skills lesson.

## Change process

1. Pick the highest-value candidate from the state file or `focus`.
2. Read the relevant workflow source file or files.
3. Make one focused change set.
4. Compile every modified workflow source with the `agentic-workflows` compile
   tool using `--validate`.
5. Include the regenerated `*.lock.yml` files in the pull request.

## Pull request body

Explain:

- what bloat or duplication was removed
- which workflow file or files changed
- how the revised wording is more Skills-like and easier to learn from

## No-op rule

Call `noop` with a concise reason when:

- no workflow file needs a meaningful improvement
- the best candidate already has an open pull request
- `focus` does not match a real improvement opportunity
