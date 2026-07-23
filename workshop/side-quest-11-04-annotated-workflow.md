<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Explore and Adapt an Annotated Workflow

> _Optional: work through this guide to understand the design choices in `daily-status.md` and adapt them in your own copy — then return to [Build: Daily Repo Status Workflow](07-your-first-workflow.md)._

## 📋 Before You Start

- You have completed [Step 11](07-your-first-workflow.md) and `.github/workflows/daily-status.md` exists in your repository.
- Open `daily-status.md` in your editor — you'll make small edits as you work through this guide.

## 🎯 What You'll Do

Understand the four design decisions that make `daily-status.md` safe and predictable, then modify your own copy to confirm what each decision controls.

---

## Four Design Decisions

| Decision | What it controls |
|---------|-----------------|
| Narrow `permissions` | Only the scopes the workflow actually needs — limits blast radius |
| `gh-proxy` in `tools` | Enforces [permissions](https://github.github.com/gh-aw/reference/permissions/) at the [network](https://github.github.com/gh-aw/reference/network/) level |
| `max: 1` in `safe-outputs` | Caps writes to exactly one comment per run |
| Fixed output template | Same format every run — easy to scan and audit |

---

## The Annotated Workflow

Read each `#` comment — it explains _why_ that line exists, not just _what_ it does:

````markdown
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.

on:
  schedule: daily      # compiler converts this to a deterministic cron expression
  workflow_dispatch: {} # adds a manual Run button for testing without waiting for the schedule

# Only the five scopes this workflow actually needs.
# `issues: write` is absent — safe-outputs handles writes more precisely.
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read

# gh-proxy enforces the permissions block at the network level.
# The agent physically cannot call APIs you haven't listed, even if the task brief asks it to.
tools:
  github:
    mode: gh-proxy
    toolsets: [default]

# The only write capability the agent has.
# `max: 1` turns "can write" into "can write exactly once per run".
safe-outputs:
  add-comment:
    max: 1
---
````

---

## ✏️ Your Turn — Metadata

1. In your `daily-status.md`, note your current `emoji:` value, then change it (e.g. from `📊` to `🔍`).
2. Run `gh aw list`. Does the new emoji appear next to the workflow name?
3. Update `description:` text and run `gh aw list` again to confirm it reflects the change.
4. Restore the original `emoji:` and `description:` values when you're done.

## ✏️ Your Turn — Safe-Outputs

1. In your `daily-status.md`, comment out the entire [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/) block.
2. Run `gh aw compile --validate`.
3. Read the error message — what write capability does the agent lose?
4. Uncomment the block and recompile to confirm the error is gone.

---

## Pattern Summary

| Pattern | The problem it solves |
|---------|----------------------|
| Narrow `permissions` | Limits blast radius if the model misbehaves |
| `gh-proxy` in `tools` | Prevents the agent from exceeding declared scopes |
| `max: 1` in `safe-outputs` | One auditable write action per run, no more |
| Fixed output template | Predictable, diff-able daily reports |

---

## ✅ Checkpoint

- [ ] I changed `emoji:`, ran `gh aw list`, and saw the update reflected
- [ ] I removed `safe-outputs:`, observed the compile error, then restored it and confirmed the error was gone
- [ ] I can explain why `issues: write` is absent from `permissions` and what provides write access instead
- [ ] I can explain what `max: 1` prevents the agent from doing

---

<!-- journey: all -->
Return to [Build: Daily Repo Status Workflow](07-your-first-workflow.md).
<!-- /journey -->


