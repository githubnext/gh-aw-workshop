---
emoji: 🗺️
name: Side Quest
description: Daily workshop editor that extracts one embedded primer or mini tutorial into a standalone side-quest adventure.
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional topic hint for the next side quest (for example: terminal, debugging, setup, yaml)"
        required: false
        type: string
  skip-if-match: "is:pr is:open label:side-quest"
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
  agentic-workflows:
safe-outputs:
  create-pull-request:
    title-prefix: "[side-quest] "
    labels: [workshop, side-quest, documentation]
    draft: true
    protected-files:
      policy: request_review
    allowed-files:
      - "workshop/*.md"
      - "workshop/**/*.md"
    if-no-changes: warn
    expires: 1d
network:
  allowed:
    - defaults
steps:
  - name: Gather workshop candidates
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json
      import pathlib
      import re

      workshop_dir = pathlib.Path("workshop")
      files = sorted(
          p for p in workshop_dir.glob("*.md")
          if p.name != "README.md"
      )

      heading_re = re.compile(r"^(##+)\s+(.*)$", re.MULTILINE)
      fence_re = re.compile(r"^```", re.MULTILINE)

      candidates = []
      for path in files:
          text = path.read_text()
          lines = text.splitlines()
          words = len(re.findall(r"\S+", text))
          fences = len(fence_re.findall(text))
          headings = [
              {
                  "level": len(match.group(1)),
                  "title": match.group(2).strip(),
                  "line": text[:match.start()].count("\n") + 1,
              }
              for match in heading_re.finditer(text)
          ]

          if len(lines) < 110 and words < 700 and fences < 3:
              continue

          title = next(
              (line[2:].strip() for line in lines if line.startswith("# ")),
              path.stem,
          )
          candidates.append(
              {
                  "path": str(path),
                  "title": title,
                  "line_count": len(lines),
                  "word_count": words,
                  "code_fence_count": fences,
                  "headings": headings,
              }
          )

      side_quest_files = sorted(str(p) for p in workshop_dir.glob("side-quest-*.md"))

      pathlib.Path("/tmp/gh-aw/data/side-quest-state.json").write_text(
          json.dumps(
              {
                  "candidate_files": candidates,
                  "existing_side_quests": side_quest_files,
                  "candidate_count": len(candidates),
              },
              indent=2,
          )
      )
      PY
---

## Side Quest

You are a workshop editor for **Learning GitHub Agentic Workflows**.

Your job is to find one large workshop markdown file that hides a useful
internal primer or mini tutorial, extract that focused detour into its own
optional **side quest adventure**, and wire the workshop so learners can take
the detour without losing the main path.

Create **at most one** pull request per run.

## Read first

1. `/tmp/gh-aw/data/side-quest-state.json`
2. `workshop/README.md`
3. Only the candidate workshop files you need from `candidate_files`
4. `.github/workflows/guidelines.md`

If `focus` is provided, prioritize matching candidates while still choosing the
best coherent side quest.

## What counts as a side quest

Choose a section or cluster of adjacent sections that:

- teaches a focused skill or concept that can stand alone
- feels like a primer, walkthrough, troubleshooting detour, or mini tutorial
- is currently embedded inside a larger workshop step
- can be removed from the main file without breaking the primary learning path
- is not already represented by an existing `workshop/side-quest-*.md` file

Good examples:

- terminal basics hidden inside a setup guide
- a mini YAML/frontmatter explainer embedded in a build step
- a troubleshooting detour inside a longer workflow step
- an optional deeper explanation of a single tool or concept

## Required change set

When you find a good candidate, make one focused change set that:

1. Creates exactly one new file named `workshop/side-quest-<topic>.md`
2. Moves the chosen primer/tutorial into that new side-quest file
3. Updates the source workshop file so the extracted section becomes a short
   summary; adds an **Optional Side Quest** callout at the extraction point with
   clear optional language linking to the new side quest; adds a return link in
   the new side quest back to the source step or the next main-path step
4. Preserves the main path in the source file
5. Updates `workshop/README.md` so the new side quest is discoverable, listed
   in a dedicated optional section that mentions which main step it branches from

## Writing rules

Match the workshop voice: practical, friendly, and beginner-safe.

Use this structure:

```text
Title: Side Quest: <Title>

> _One-sentence reason this optional detour is worth taking._

## :dart: What You'll Do

## :clipboard: Before You Start

## Steps

## :white_check_mark: Checkpoint

**Return to the main adventure:** [<Step title>](<source-file>.md)
```

Keep the side quest self-contained and concise. It should cover one concept.
Prefer moving content over duplicating it, and leave enough context in the source file that the main path still works.

## Validate workflow snippets

Use the shared procedure in `.github/workflows/workshop-author.md` under
`### 5. Validate agentic workflow snippets`.

## No-op rule

Call `noop` with a short explanation when:

- no candidate file contains a clean, self-contained side quest
- the best candidate has already been extracted
- the workshop already exposes the useful detour as its own optional route

## Safe outputs

- Use `create-pull-request` for visible changes
- The PR body should say:
  - which source file was mined
  - what side quest was extracted
  - how routing was updated for learners
