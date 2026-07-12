# Side Quest: Reading an Annotated Agentic Workflow

> _Optional: work through this guide if you want to understand the reasoning behind every design choice in `daily-status.md` before adapting it — then return to [Step 11: Build: Daily Repo Status Workflow](11a-build-daily-status.md)._

## 🎯 What You'll Do

Read a fully annotated copy of the `daily-status.md` workflow and understand the four practical decisions that make it reliable and safe to run unattended. By the end you'll be able to explain each section and apply the same patterns to your own workflows.

---

## Four Design Decisions

Before looking at the annotated file, here are the four choices worth understanding:

### Narrow permissions

The workflow declares only the five GitHub API scopes it actually needs. If the prompt is ever misconfigured or the agent misbehaves, it cannot touch anything outside those scopes. Least-privilege is a security practice borrowed from classic software — it applies here too.

### `gh-proxy` for GitHub access

The `tools` block routes all GitHub API calls through `gh-proxy`. This proxy enforces the `permissions` block at the network level, so the agent physically cannot call GitHub APIs you haven't listed — even if your task brief accidentally asks it to.

### `max: 1` guardrail

The `safe-outputs` block limits write operations to a single comment per run. Without this block the agent cannot write _anything_; with it, it can write _exactly_ one comment. This turns an open-ended capability into a predictable, auditable action.

### Tight output contract

The task brief gives the agent a fixed template to fill in. Predictable output means each daily report looks the same, making it easy to scan and easy to grep. The guidelines section then closes the remaining edge cases (already posted, no open issue) so the agent never has to guess.

---

## The Fully Annotated Workflow

Read through the annotated file below. Each comment explains _why_ that line or block exists, not just _what_ it does.

````markdown
---
# ── METADATA ────────────────────────────────────────────────────────────────
# These two fields appear in `gh aw list` and in the GitHub Actions UI.
# They help humans understand what this workflow does at a glance.
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.

# ── TRIGGERS ─────────────────────────────────────────────────────────────────
# `schedule: daily` is an agentic-workflow shorthand for a cron expression that
# runs once a day at midnight UTC. `workflow_dispatch` adds a manual Run button
# so you can test or re-run the report without waiting for the schedule.
on:
  schedule: daily
  workflow_dispatch: {}

# ── PERMISSIONS (DESIGN DECISION 1) ──────────────────────────────────────────
# Declare only the scopes the workflow actually needs.
# - `contents: read`        → read commits and files
# - `copilot-requests: write` → required by every agentic workflow to call AI
# - `issues: read`          → count issues and find the target issue to post on
# - `pull-requests: read`   → count open PRs
# - `actions: read`         → read the most recent CI run status
#
# There is no `issues: write` here. Write access is handled through `safe-outputs`
# (see below), which is more controlled than a broad permission scope.
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read

# ── TOOLS (DESIGN DECISION 2) ────────────────────────────────────────────────
# `mode: gh-proxy` routes every GitHub API call through a proxy that enforces
# the `permissions` block above. The agent cannot make API calls outside those
# scopes even if the task brief asks it to.
# `toolsets: [default]` activates the standard set of GitHub tools (issues, PRs,
# commits, actions). Additional toolsets can be added later.
tools:
  github:
    mode: gh-proxy
    toolsets: [default]

# ── SAFE-OUTPUTS (DESIGN DECISION 3) ─────────────────────────────────────────
# This block is the only write capability the agent has.
# `add-comment` lets the agent post a comment on an issue or pull request.
# `max: 1` caps the total at one comment per run — any extra attempts are dropped.
# This turns "the agent can write" into "the agent can write exactly one thing".
safe-outputs:
  add-comment:
    max: 1
---

<!-- ── AGENT INSTRUCTIONS ───────────────────────────────────────────────── -->
<!-- Everything below the closing `---` is the Markdown body — the task brief  -->
<!-- the AI agent reads at runtime. Sub-headers (##, ###) are for readability; -->
<!-- the top-level title (#) also appears as the workflow name in the UI and   -->
<!-- is included in the model's context at runtime.                             -->

<!-- Role framing: the top-level title is shown in the GitHub Actions UI and   -->
<!-- included in the model context. The sentence below sets the agent's scope. -->
# Daily Repo Status Report

You are an AI assistant that monitors this repository and posts a concise daily health report.

<!-- Task section: an ordered list so the agent approaches data collection      -->
<!-- in a predictable sequence. Numbered lists help the agent stay on track.   -->
## Your Task

Collect and summarize:
1. **Open pull requests** — count, and flag any open longer than 7 days
2. **Open issues** — total count, how many are labeled "bug"
3. **CI status** — result of the most recent workflow run on the default branch
4. **Last commit** — message and time since it was pushed

<!-- Output contract (DESIGN DECISION 4): a fixed template that pins the exact  -->
<!-- text the agent generates. Same format every day = easy to scan and audit.  -->
## Output Format

Find the most recently updated open issue and post a comment in this format:

```
📊 Daily Repo Status — {today's date}
══════════════════════════════════
🔀 Open pull requests:  {count}
🐛 Open issues:         {count}  ({bug-count} labeled "bug")
✅ CI status:           {passing/failing/unknown}
📝 Last commit:         "{message}" — {time ago}

{One sentence of overall health. Flag anything that needs attention.}
```

<!-- Guidelines: edge-case handling so the agent never has to improvise.       -->
## Guidelines

- Post only one comment. If you have already posted today, skip.
- Keep the report factual. Do not invent numbers.
- If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
````

---

## Pattern Summary

| Pattern | The problem it solves |
|---------|----------------------|
| Narrow `permissions` | Limits blast radius if the prompt is misconfigured or the model misbehaves |
| `gh-proxy` in `tools` | Enforces permissions at the network level — the agent physically cannot exceed what's declared |
| `max: 1` in `safe-outputs` | Converts an open-ended write capability into a single, auditable action |
| Fixed output template | Makes each report predictable and easy to diff, scan, or grep over time |

---

## ✅ Checkpoint

- [ ] You can explain why `permissions` does not include `issues: write` and how `safe-outputs` provides the write access needed to post the comment instead
- [ ] You can explain what `gh-proxy` prevents compared to direct API access
- [ ] You can explain what happens if the agent tries to post a second comment in the same run
- [ ] You can explain why a fixed output template is valuable for a workflow that runs every day

---

Return to [Step 11: Build: Daily Repo Status Workflow](11a-build-daily-status.md).
