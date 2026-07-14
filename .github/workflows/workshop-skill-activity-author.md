---
emoji: 🧩
description: Daily workshop editor that opens PRs with one GitHub Skills-style activity improvement.
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional topic to improve next (for example: onboarding, setup, checks, troubleshooting)"
        required: false
        type: string
  skip-if-match: "is:pr is:open label:skill-activity"
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
    title-prefix: "[skill-activity] "
    labels: [workshop, skill-activity, documentation]
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
  - name: Gather workshop state
    run: |
      mkdir -p /tmp/gh-aw/data
      if [ -d workshop ]; then
        find workshop -name "*.md" -type f | sort > /tmp/gh-aw/data/workshop-files.txt
        jq -Rn '
          [inputs] as $files
          | {
              files: $files,
              count: ($files | length)
            }
        ' /tmp/gh-aw/data/workshop-files.txt > /tmp/gh-aw/data/workshop-state.json
      else
        echo '{"files":[],"count":0}' > /tmp/gh-aw/data/workshop-state.json
      fi
  - name: Fetch open curriculum quality issues
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      # Fetch open issues filed by curriculum-evaluator (label: curriculum)
      gh issue list \
        --repo "$GITHUB_REPOSITORY" \
        --state open \
        --label curriculum \
        --json number,title,body,createdAt \
        --limit 10 \
        > /tmp/gh-aw/data/curriculum-issues.json 2>/dev/null \
        || echo '[]' > /tmp/gh-aw/data/curriculum-issues.json
      count=$(jq length /tmp/gh-aw/data/curriculum-issues.json)
      echo "Found $count open curriculum quality issue(s)."
---

# Workshop Skill Activity Author

## Task

Create exactly one pull request per run with one meaningful improvement to the `workshop/` learning content.

This workflow creates a **GitHub Skills-style activity**, not a Copilot agent skill.
- Do not create or edit `.github/skills/**`.
- Do not create `SKILL.md`.
- Only edit markdown under `workshop/`.

First, read:
- `/tmp/gh-aw/data/workshop-state.json`
- `/tmp/gh-aw/data/curriculum-issues.json`
- `workshop/README.md` (if present)
- Existing workshop step files in `workshop/`
- `.github/workflows/guidelines.md`

Then:
1. **Check curriculum quality findings first.** If `/tmp/gh-aw/data/curriculum-issues.json`
   contains open issues, extract the flagged files and their specific weaknesses.
   Each issue title follows the format `[curriculum-eval] <file>: <dimension> — <diagnosis>`
   and the issue body contains the file's **Overall Score** and a **Flagged Dimensions**
   table. Sort issues by the `Overall Score` value extracted from the body (ascending)
   to identify the lowest-scoring file. Treat that file as the top candidate for
   improvement — its issue body also contains a ready-to-use **Improvement Prompt**
   you can apply directly.
2. Identify the highest-value content gap, clarity issue, or learner experience improvement.
   Prefer fixing curriculum-flagged files over making other changes when a flagged
   file exists.
   **Enterprise tie-break rule**: when two candidate improvements are of equal value by the
   criteria above, prefer the one that better serves enterprise learners (GHES, GHEC, or
   self-hosted runner users). This includes adding enterprise-specific guidance, clarifying
   steps that behave differently in enterprise environments, or ensuring examples work in
   both github.com and GHES contexts. See `.github/workflows/guidelines.md` under
   "Enterprise user preference in design decisions" for the full policy.
3. Make a single focused change set (for example: add one missing step file, improve one existing step, or update workshop navigation).
4. Keep tone aligned with GitHub Skills: short, direct, supportive, and action-oriented.
5. Keep content practical and learner-first, with clear outcomes and checkpoints.
6. **Check for missing UI path alternatives and early `gh` overuse**: look for steps that are CLI-heavy, require `gh` too early, or present `gh repo create` as the default without a corresponding GitHub UI path. Prefer improvements that delay/minimize `gh` setup and add clear UI-first alternatives.

If `focus` input is provided, prioritize that area while keeping the workshop coherent.

If no meaningful improvement is needed, call `noop` with a concise reason.

## Validate Agentic Workflow Snippets

Use the shared procedure in `.github/workflows/workshop-author.md` under
`### 5. Validate agentic workflow snippets`.

## Content Style Requirements

- Use clear, instructional markdown suitable for beginners.
- Favor concise sections and concrete actions.
- Include verification/checkpoint criteria when relevant.
- Preserve and improve cross-links between workshop steps and `workshop/README.md`.

## Safe Outputs

- Use `create-pull-request` for visible changes.
- Include a short PR body describing:
  - what was improved,
  - which learner pain point it addresses,
  - why it helps workshop flow.
- Use `noop` when no change is required.
