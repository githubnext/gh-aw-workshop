---
emoji: 🧠
name: Training Plan Researcher
description: >
  Performs deep research on github/gh-aw (including downloading LLMs.txt),
  then proposes and authors one new workshop training node with research notes
  stored in XML comments.
on:
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional focus area for the new training node (e.g., mcp tools, safe outputs, workflow debugging)"
        required: false
        type: string
  schedule: weekly
  skip-if-match: "is:pr is:open label:training-plan"
permissions:
  contents: read
  copilot-requests: write
  actions: read
  pull-requests: read
  issues: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  agentic-workflows:
  bash: true
safe-outputs:
  create-pull-request:
    title-prefix: "[training-plan] "
    labels: [workshop, training-plan, documentation]
    draft: true
    allowed-files:
      - "workshop/*.md"
      - "workshop/**/*.md"
      - ".github/workflows/training-plan-research.md"
      - ".github/workflows/training-plan-research.lock.yml"
    if-no-changes: warn
    expires: 1d
network:
  allowed:
    - defaults
    - github
timeout-minutes: 30
steps:
  - name: Download gh-aw LLMs manifest
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      target=/tmp/gh-aw/data/llms.txt
      # The canonical location may vary by repository branch/release; try known mirrors.
      urls=(
        "https://raw.githubusercontent.com/github/gh-aw/main/LLMs.txt"
        "https://raw.githubusercontent.com/github/gh-aw/main/llms.txt"
        "https://github.github.com/gh-aw/llms.txt"
      )
      downloaded=""
      for url in "${urls[@]}"; do
        if curl -fsSL "$url" -o "$target"; then
          downloaded="$url"
          break
        fi
      done
      if [ -z "$downloaded" ]; then
        echo "Failed to download LLMs.txt from all known locations" >&2
        exit 1
      fi
      jq -n --arg source "$downloaded" --arg path "$target" '{llms_source:$source,llms_path:$path}' > /tmp/gh-aw/data/research-inputs.json
      echo "Downloaded LLMs.txt from $downloaded"
---

# Training Plan Researcher

You are a senior technical curriculum designer for this workshop repository.

Your job is to run deep research on `github/gh-aw` and convert that research into exactly one high-value new training node in `/workshop`.

<!--
<research-intent>
  <primary-goal>Create one new workshop node grounded in current gh-aw documentation.</primary-goal>
  <required-artifact>/tmp/gh-aw/data/llms.txt</required-artifact>
  <secondary-goal>Store extra rationale in XML comments inside edited markdown.</secondary-goal>
</research-intent>
-->

## Required inputs

1. Read `/tmp/gh-aw/data/research-inputs.json`.
2. Read `/tmp/gh-aw/data/llms.txt`.
3. Read the current workshop curriculum from `workshop/README.md`.
4. Read `workshop/00-welcome.md`.
5. Read at least three relevant workshop step files before proposing a new node.

## Research process

1. Use `github` tooling to inspect `github/gh-aw` for current concepts, especially:
   - workflow syntax and frontmatter capabilities
   - `safe-outputs`
   - MCP tools and integrations
   - skills and reuse patterns
2. Use the downloaded `LLMs.txt` content to identify high-signal docs and pages to cite in your planning.
3. Compare findings against existing workshop coverage and identify one meaningful gap for learners.

## Authoring task

Create exactly one new workshop node file that fills the identified gap.

Requirements:

- Keep second-person voice, concise instructional style, and a `## ✅ Checkpoint` checklist.
- Do not number headers.
- Include one short "why this matters" framing paragraph.
- Include at least one actionable step that references a real gh-aw concept discovered during research.
- Link relevant gh-aw docs inline in the prose at the first mention of each concept instead of adding a dedicated "See Also" section or a "For more details, see …" footer line.
- Add an XML comment block in the node file with:
  - the selected research focus,
  - top source URLs (including the LLMs.txt download source),
  - and a one-paragraph reasoning summary.

## Curriculum updates

After creating the new node file:

1. Add it to the curriculum table in `workshop/README.md`.
2. If needed, adjust text in `workshop/00-welcome.md` so step counts stay accurate.

## Pull request output

Create a pull request only when files changed.

- Title: `Add research-backed training node: <node title>`
- Body must summarize:
  - research focus,
  - what gap was filled,
  - which files were updated,
  - and where XML comment metadata was stored.

<!--
<quality-bar>
  <must-be-true>Node is net-new and useful for learners.</must-be-true>
  <must-be-true>README curriculum includes the node.</must-be-true>
  <must-be-true>XML comment metadata exists in the new node.</must-be-true>
</quality-bar>
-->
