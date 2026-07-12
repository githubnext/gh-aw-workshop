# Side Quest: Event-Driven Triggers in Agentic Workflows

> _Optional: use this primer if you want help choosing between scheduled and event-driven workflows before you finish [Step 11c: Build — PR Code Reviewer](11c-build-pr-reviewer.md), then return to the main adventure._

## 🎯 What You'll Do

You'll compare scheduled and event-driven triggers, copy four starter trigger blocks, and learn how trigger choice affects `safe-outputs`. By the end you'll know when to reach for `pull_request`, `push`, `issues`, or `schedule`.

## Scheduled vs event-driven triggers

A **scheduled** workflow runs because the clock says it is time. An **event-driven** workflow runs because something happened in the repository, like a pull request opening or an issue being reopened.

| Trigger style | What starts it | Good fit |
|---------------|----------------|----------|
| Scheduled | Time passes | Daily summaries, reminders, audits |
| Event-driven | A GitHub event happens | PR review, issue triage, post-push follow-up |

If you want the workflow to react to a specific repository action, use an event trigger. If you want it to run even when nobody touched the repo, use a schedule.

## Four common trigger patterns

### `pull_request`

Use this when the workflow should react to pull request activity.

```yaml
on:
  pull_request: {}
  workflow_dispatch: {}
```

This is a good fit when you want feedback tied to the current PR, like the PR Code Reviewer in Step 11c.

### `push`

Use this when the workflow should react as soon as commits land on a branch.

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch: {}
```

This is a good fit when you want to check or summarize changes after code is pushed.

### `issues`

Use this when the workflow should react to issue activity.

```yaml
on:
  issues:
    types: [opened, reopened]
  workflow_dispatch: {}
```

This is a good fit when you want an assistant to triage, label, or reply when someone opens an issue.

### `schedule`

Use this when the workflow should run on a clock, whether or not anyone touched the repository.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

This is a good fit for recurring reports like the Daily Repo Status workflow in Step 11a.

## How trigger choice changes `safe-outputs`

The trigger decides **when** the workflow starts. The `safe-outputs` block decides **where it is allowed to write back**.

| Trigger | Natural thing to reply to | Common `safe-outputs` choice |
|---------|----------------------------|------------------------------|
| `pull_request` | The current pull request | `add-pr-review-comment` |
| `issues` | The current issue | `add-comment` |
| `push` | Often no built-in conversation thread | Usually none at first, or `add-comment` if the workflow posts to an issue or PR it finds |
| `schedule` | Usually a standing issue or report thread | `add-comment` |

> [!IMPORTANT]
> The trigger does **not** automatically grant write access. You still need to choose the right `safe-outputs` entry for the place you want the agent to write.

## Three questions to pick the right trigger

Ask yourself:

1. **What exactly should wake this workflow up?**
2. **Is there already a pull request or issue for the agent to reply to?**
3. **Should the workflow still run even if nobody changed anything?**

Use this rule of thumb:

- If the answer is "a PR changed," start with `pull_request`.
- If the answer is "a commit landed," start with `push`.
- If the answer is "an issue changed," start with `issues`.
- If the answer is "nothing happened, but I still want a report," start with `schedule`.

## Concrete example: Step 11a vs Step 11c

The Daily Repo Status workflow in [Step 11a](11a-build-daily-status.md) and the PR Code Reviewer in [Step 11c](11c-build-pr-reviewer.md) use the same workflow format, but they solve different timing problems.

| Step | Trigger | Why it fits | Safe output |
|------|---------|-------------|-------------|
| 11a Daily Repo Status | `schedule: daily` | You want a report every day, even on quiet days | `add-comment` |
| 11c PR Code Reviewer | `pull_request: {}` | You want feedback only when a PR changes | `add-pr-review-comment` |

That is the core decision: pick the trigger that matches the moment you care about, then pick the write target that matches the object you want the workflow to answer.

## ✅ Checkpoint

- [ ] I can explain the difference between a scheduled workflow and an event-driven workflow
- [ ] I know starter trigger blocks for `pull_request`, `push`, `issues`, and `schedule`
- [ ] I understand that `safe-outputs` controls write access separately from the trigger
- [ ] I can explain why Step 11a uses `add-comment` and Step 11c uses `add-pr-review-comment`

---

Return to the main adventure: [Step 11c: Build — PR Code Reviewer](11c-build-pr-reviewer.md).
