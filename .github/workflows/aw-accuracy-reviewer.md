---
emoji: ✅
name: AW Accuracy PR Reviewer
description: >
  Reviews ready-for-review pull requests for GitHub Agentic Workflows accuracy
  and opens review comments on incorrect guidance.
on:
  pull_request:
    types: [ready_for_review]
    paths:
      - "*.md"
      - "workshop/**/*.md"
      - ".github/**/*.md"
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
strict: true
network:
  allowed:
    - defaults
    - github
tools:
  github:
    mode: gh-proxy
    toolsets: [pull_requests, repos]
safe-outputs:
  create-pull-request-review-comment:
    max: 20
timeout-minutes: 20
---

# AW Accuracy PR Reviewer

## Task

Review this ready-for-review pull request for factual accuracy about GitHub
Agentic Workflows (`gh-aw`).

Before reviewing, read `.github/skills/agentic-workflows/SKILL.md` and apply the
relevant guidance exactly as if the author had asked for the
`/agentic-workflows` skill. Load only the upstream gh-aw reference files needed
for the changed content.

Review only the changed files in this pull request that match the workflow
trigger scope. Focus on statements about:

- `gh aw` commands, flags, and workflow lifecycle
- workflow frontmatter, trigger syntax, tools, permissions, skills, safe
  outputs, and network rules
- rendered gh-aw documentation links under `https://github.github.com/gh-aw/`

Use the pull request diff, changed line context, and current repository files to
confirm whether a statement is incorrect, outdated, or misleading. Report only
high-confidence factual problems. Do not comment on style, tone, formatting, or
optional alternative approaches.

## Review rules

- Post one `create-pull-request-review-comment` per confirmed inaccuracy on the
  exact changed line when possible.
- Quote the incorrect claim, explain the correct current behavior briefly, and
  suggest the smallest accurate fix.
- Skip files or changes that do not make agentic workflow claims.
- Avoid duplicate comments when one precise review comment covers the problem.
- Call `noop` with a short reason when the changed content is accurate or when
  nothing in scope needs review.
