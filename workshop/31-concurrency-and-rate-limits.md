<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Concurrency groups and per-user rate limiting — controlling how many runs of a workflow execute at once and how often people can trigger them</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>The curriculum (steps 1-30) covers timeouts, cost budgets, staged mode, and event-driven triggers, but never explains what happens when several runs fire at once, such as rapid pushes, repeated slash commands, or a manual dispatch during a scheduled run. The concurrency and rate-limiting reference pages describe the default per-workflow and per-engine groups, the compiler's queue behavior, safe-outputs concurrency-group, and the user-rate-limit frontmatter field. None of these appear in the workshop. This step fills that gap with a short exercise that inspects the compiled defaults, serializes safe-output writes, and caps how often one person can trigger a workflow, which complements the existing cost and resilience steps.</rationale>
</research-metadata>
-->

# Control Concurrency and Rate Limits

> _Decide how many runs happen at once, and how often anyone can start one._

## :dart: What You'll Do

You'll inspect the [concurrency](https://github.github.com/gh-aw/reference/concurrency/) groups gh-aw generates for your workflow, serialize its writes with `safe-outputs.concurrency-group`, and cap how often a person can trigger it with `user-rate-limit`. When you finish, your event-driven workflow will stay predictable under bursts of activity.

Why this matters: event-driven workflows can fire many times in quick succession, and every run consumes AI credits and can write to your repository. Concurrency and rate limits keep a busy day from turning into duplicate issues, queued-up spend, or a runaway trigger loop.

## :clipboard: Before You Start

- You completed [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md), or you have any workflow with an `on:` trigger and a `safe-outputs:` block.
- You can compile workflows with `gh aw compile`.

## Steps

### Inspect the default concurrency groups

gh-aw gives every workflow two layers of control: a per-workflow group based on the trigger context (issue, pull request, or branch), and a per-engine group so only one agent job per AI engine runs at a time. Compile your workflow and find both in the lock file:

```bash
gh aw compile
grep -n -A2 "concurrency:" .github/workflows/pr-reviewer.lock.yml
```

Look for a top-level group starting with `gh-aw-` and a job-level group such as `gh-aw-copilot`. Pull request triggers cancel outdated runs when new commits arrive; other triggers queue runs instead of dropping them.

### Serialize safe-output writes

The `safe_outputs` job runs separately from the agent job, so two runs can write at the same time. Add a [`concurrency-group`](https://github.github.com/gh-aw/reference/safe-outputs/) so queued runs wait for each other rather than creating duplicates:

```markdown .github/workflows/pr-reviewer.md
safe-outputs:
  concurrency-group: "safe-outputs-${{ github.repository }}"
  add-comment:
```

### Cap how often people can trigger a run

Add the `user-rate-limit` field to the [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) so one person can't start the workflow repeatedly, for example by posting many slash commands:

```markdown .github/workflows/pr-reviewer.md
user-rate-limit:
  max-runs-per-window: 3
  window: 60
```

This allows each user at most three runs per 60 minutes. When you omit `events`, gh-aw infers them from your `on:` triggers. See [Rate Limiting Controls](https://github.github.com/gh-aw/reference/rate-limiting-controls/) for the other built-in protections, such as bot non-triggering and default `max` limits on high-risk safe outputs.

### Recompile and test

```bash
gh aw compile
git add .
git commit -m "feat: add concurrency and rate limits to pr-reviewer"
git push
```

Trigger the workflow several times in a row and open the **Actions** tab. Confirm that runs queue or are skipped instead of all running at once.

> [!NOTE]
> `concurrency.job-discriminator` is only needed when you dispatch many instances of one workflow with different inputs. It keeps each run's job-level group distinct so fan-out runs aren't cancelled.

## :white_check_mark: Checkpoint

- [ ] You found the generated `gh-aw-` concurrency groups in your lock file
- [ ] Your workflow sets `safe-outputs.concurrency-group` and `user-rate-limit`
- [ ] You recompiled and committed both the `.md` and `.lock.yml` files
- [ ] You can explain the difference between a per-workflow group, a per-engine group, and a per-user rate limit

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
