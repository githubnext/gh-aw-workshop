<!-- page-journey: all -->
<!-- page-adventure: scenario-b -->
# Build — Daily Documentation Updater

_You've designed the workflow on paper — now choose how you want to create it._

## 📋 Before You Start

- You've completed [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
- Your practice repository is ready
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

## What You'll Build

Both paths produce `.github/workflows/daily-docs.md` — a workflow that reads your repository's documentation files and posts a daily health report as a GitHub issue comment. Here is a complete skeleton to orient you before you start:

```markdown
---
emoji: 📚
description: Post a daily documentation health report as a GitHub issue comment.

on:
  schedule: daily       # Runs once per day at a compiler-chosen time
  workflow_dispatch: {} # Add a manual Run button in the Actions UI

permissions:
  contents: read          # Read files in the repository
  copilot-requests: write # Required for every agentic workflow
  issues: read            # Read issues and find where to post the report

tools:
  github:
    mode: gh-proxy      # Route API calls through the scoped proxy
    toolsets: [default]

safe-outputs:
  add-comment:
    max: 1              # The agent may post at most one comment per run
---

# Daily Documentation Health Report

You are an AI assistant that monitors this repository's documentation.
Scan for stale files, thin pages, and broken internal links.
Find the issue titled "Daily Docs Health" (or create it) and post one comment with a concise health summary.
```

The `on:` block sets when the workflow runs — `schedule: daily` is a fuzzy expression that `gh aw compile` converts to a once-per-day schedule at a compiler-chosen time. The `permissions:` block declares the minimum GitHub API scopes the workflow may use. The `safe-outputs:` guardrail limits the agent to posting at most one issue comment per run.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build each section incrementally and compile for feedback | [Build with the Terminal path](11b-build-daily-docs-terminal.md) |
| **GitHub UI path** | Paste the complete workflow and commit it in the browser | [Build with the GitHub UI path](11b-build-daily-docs-ui.md) |

Both paths produce `.github/workflows/daily-docs.md` and converge at Step 12.

## ✅ Checkpoint

- [ ] You chose the path that matches how you want to work
- [ ] You know both paths produce the same workflow file
- [ ] Your workflow file includes a valid `on:` trigger and `permissions:` block
- [ ] You can explain in one sentence what your agent brief instructs the agent to do

**Previous:** [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
<!-- journey: all -->
**Next:** Continue with your chosen path above.
<!-- /journey -->


