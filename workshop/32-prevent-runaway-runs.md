<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting and concurrency controls — keeping triggers, queued runs, and safe-output volume bounded</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>The curriculum (steps 1-31) covers timeouts, cost budgets, staged mode, and the network firewall, but no step shows how to bound how often a workflow runs or how much it can write. gh-aw's rate limiting reference describes defense in depth: concurrency groups, `stop-after`, experimental `user-rate-limit`, and `max` limits on safe outputs. Learners who add event-driven or slash-command triggers (steps 14b and 15) can easily end up with piled-up runs or comment floods. This step fills that gap with a hands-on exercise that sets a concurrency group, a run deadline, a per-user limit, and a safe-output cap, then verifies them in the compiled lock file.</rationale>
</research-metadata>
-->

# Prevent Runaway Runs with Rate Limits and Concurrency

> _Decide how often your workflow can run and how much it can write — before a busy day decides for you._

## :dart: What You'll Do

You'll add four guardrails to an event-driven workflow: a [concurrency group](https://github.github.com/gh-aw/reference/concurrency/), a `stop-after` deadline, a per-user rate limit, and a `max` cap on a safe output. When you finish, you'll know how to keep any workflow's run count and write volume bounded.

Why this matters: event triggers fire whenever someone pushes, comments, or opens an issue. Without limits, a burst of activity can queue many runs, spend AI credits, and flood your issues with comments. The gh-aw [rate limiting controls](https://github.github.com/gh-aw/reference/rate-limiting-controls/) give you simple knobs to prevent that.

## :clipboard: Before You Start

- You completed [Control Network Access with the Firewall](31-control-network-access.md), or you have an event-driven workflow such as the one from [Step 14b](14b-pr-reviewer-workflow.md).
- You can compile workflows with `gh aw compile`.

## Steps

### Know what you get by default

gh-aw already applies defense in depth. Workflow-level concurrency groups include the workflow name plus the issue, pull request, or branch, so runs on different items don't collide. A second, per-engine group means only one agent job runs per AI engine at a time. Safe outputs also run through validation, and workflow dispatches are spaced out with built-in delays.

You add limits on top of these defaults when your workflow needs them.

### Serialize and bound a workflow

Open your event-driven workflow and add a `concurrency:` block and `stop-after:` to the frontmatter:

```markdown .github/workflows/pr-reviewer.md
---
on:
  pull_request:
    types: [opened, synchronize]
concurrency:
  group: pr-reviewer-${{ github.ref }}
  cancel-in-progress: true
stop-after: +72h
permissions:
  contents: read
  pull-requests: read
---
```

`cancel-in-progress: true` cancels an outdated run when a newer push arrives, so you only pay for the latest commit. [`stop-after`](https://github.github.com/gh-aw/reference/rate-limiting-controls/#timeouts) stops the workflow from running after the given time (minimum unit is hours), which suits trials and campaigns.

### Limit runs per user

For workflows that people can trigger by hand or by comment, add [`user-rate-limit`](https://github.github.com/gh-aw/reference/rate-limiting-controls/#rate-limiting-per-user):

```markdown .github/workflows/pr-reviewer.md
user-rate-limit:
  max-runs-per-window: 3
  window: 60
```

This allows each user at most three runs in a 60-minute window. The field is experimental, so `gh aw compile` prints an experimental-feature warning. That's expected.

### Cap what the agent can write

Add a `max` to the safe output so one run can't post an unbounded number of comments:

```markdown .github/workflows/pr-reviewer.md
safe-outputs:
  add-comment:
    max: 1
```

High-risk outputs such as `dispatch-workflow` and `assign-to-agent` already default to `max: 1` to stop exponential cascades. Raise a limit only when you can explain why.

### Compile and confirm

```bash
gh aw compile
```

Open the generated `.lock.yml` and search for `concurrency:` to see your group. Then push two commits to a pull request in quick succession and check the **Actions** tab: the earlier run should show as cancelled.

> [!TIP]
> Preview a new cap safely first with [staged mode](30-preview-with-staged-mode.md).

## :white_check_mark: Checkpoint

- [ ] Your workflow sets a `concurrency:` group and `stop-after:` and compiles cleanly
- [ ] You added `user-rate-limit` and saw the experimental-feature warning
- [ ] A safe output has an explicit `max` value
- [ ] Two quick pushes produced one cancelled run and one completed run
- [ ] You can explain the difference between per-workflow and per-engine concurrency

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
