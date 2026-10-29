<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Prevent Overlapping Runs with Concurrency

> _Stop two runs of the same workflow from posting duplicate comments or racing each other._

## :dart: What You'll Do

You'll add a `concurrency:` block to a workflow so GitHub Actions allows only one run per group at a time. You'll trigger the workflow twice and watch the second run wait, or replace the first. When you finish, you'll know which setting fits which kind of workflow.

Why this matters: agents are slow. A pull request workflow can still be running when someone pushes again, and two agents writing to the same pull request can post duplicate or conflicting comments. Learn more in the [concurrency reference](https://github.github.com/gh-aw/reference/concurrency/).

## :clipboard: Before You Start

- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md), or you have any workflow you can edit and recompile.
- You can trigger a run from the **Actions** tab.

## Steps

### Understand the two settings

`concurrency:` is standard GitHub Actions frontmatter, so it works in agentic workflows exactly as it does in classic ones. It has two parts:

- `group` is a name. Runs that share a name are limited to one active run at a time.
- `cancel-in-progress` decides what happens to the older run. With `true`, the older run is cancelled. With `false`, the newer run waits in line.

> [!NOTE]
> The compiler already adds a default concurrency group for agentic workflows. Add your own block only when you want different behavior, such as one group per pull request.

### Ask your agent to add it

Start your agent in the Codespace terminal:

```bash
gh copilot
```

Then paste this prompt, using the name of one of your workflows:

```prompt
/agentic-workflows Add a concurrency group to daily-status so only one run happens at a time.
```

### Check the result

The agent should produce frontmatter like this. The `group` below uses a [GitHub expression](https://docs.github.com/en/actions/learn-github-actions/expressions) so each pull request gets its own line:

```markdown .github/workflows/pr-summary.md
---
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  contents: read
  pull-requests: read
concurrency:
  group: pr-summary-${{ github.event.pull_request.number }}
  cancel-in-progress: true
safe-outputs:
  add-comment:
    max: 1
---

# PR Summary

Summarize the changes in this pull request in three bullet points.
```

Here, a new push to the same pull request cancels the older run. Pushes to different pull requests never block each other.

### Recompile and test

In the terminal, compile after the change:

```bash
gh aw compile
```

Then commit and push both files. Trigger the workflow twice in quick succession from the **Actions** tab and open the **Actions** run list.

1. With `cancel-in-progress: true`, the first run shows as **Cancelled**.
2. With `cancel-in-progress: false`, the second run shows **Queued** until the first finishes.

### Choose the right setting

| Workflow type | Setting | Why |
|---------------|---------|-----|
| Pull request review or summary | `cancel-in-progress: true` | Only the latest commit matters. |
| Scheduled report that writes memory | `cancel-in-progress: false` | A half-finished run shouldn't be thrown away. |
| Issue triage | `cancel-in-progress: false` | Each issue event deserves its own answer. |

> [!TIP]
> Cancelled runs still consume the minutes and tokens they used before cancelling. Put the group on the smallest unit of work, such as a pull request number, to avoid cancelling unrelated runs.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `concurrency:` block with a `group` and a `cancel-in-progress` value
- [ ] You recompiled with `gh aw compile` and committed both the `.md` and `.lock.yml` files
- [ ] You triggered two runs and saw one cancelled or queued in the **Actions** tab
- [ ] You can explain why a pull request number belongs in the group name

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
