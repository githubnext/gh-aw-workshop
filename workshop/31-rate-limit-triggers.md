<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting controls — user-rate-limit, concurrency, and stop-after for shared and enterprise repositories</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Steps 22 and 26 cover timeouts and AI credit budgets, but nothing shows how to stop people from triggering an agent too often. In shared and enterprise repositories, a comment-triggered or manually dispatched workflow can burn credits fast. This step adds the per-user rate limit, concurrency groups, and a stop-after expiry.</rationale>
</research-metadata>
-->

# Limit How Often Your Workflow Can Be Triggered

> _Keep a busy repository from turning one helpful agent into a runaway bill._

## :dart: What You'll Do

You'll add a per-user [rate limit](https://github.github.com/gh-aw/reference/rate-limiting-controls/#rate-limiting-per-user) and an expiry date to a workflow, then compile it. When you finish, a single person can't start the workflow over and over, and a temporary workflow turns itself off.

This matters most in shared and enterprise repositories, where many people can trigger the same agent.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md), or you have a workflow that people can start manually.
- You are working in your Codespace terminal.

## Steps

### Pick a workflow that people can trigger

Open a workflow with `workflow_dispatch` or an issue or pull request trigger, such as your `pr-reviewer.md` from earlier. Scheduled-only workflows don't need a per-user limit because no person starts them.

### Add a per-user rate limit

`user-rate-limit` counts recent runs per person. If someone goes over the limit, gh-aw cancels the new run before the agent starts.

```yaml
---
on:
  workflow_dispatch: {}
  issue_comment:
    types: [created]
permissions:
  contents: read
  issues: read
user-rate-limit:
  max-runs-per-window: 3
  window: 60
safe-outputs:
  add-comment:
    max: 1
---
```

Here `window` is in minutes. This allows three runs per person per hour.

> [!NOTE]
> Repository admins, maintainers, and users with write access are exempt by default. Add `ignored-roles: []` under `user-rate-limit:` to limit everyone, including them.

### Add an expiry for temporary workflows

`stop-after` blocks new runs after a set time. It suits trials, campaigns, and workshops. Set it inside the `on:` block:

```yaml
on:
  workflow_dispatch: {}
  stop-after: +48h
```

The smallest unit is hours. You can also use an absolute date.

### Understand concurrency

gh-aw already adds a concurrency group, so runs of the same workflow queue instead of running in parallel. You don't need to configure it. Read the [concurrency reference](https://github.github.com/gh-aw/reference/concurrency/) only if you need trigger-specific grouping.

### Compile and check the result

```bash
gh aw compile
```

Open the `.lock.yml` file. Look for a pre-activation job that checks recent runs.

### Test the limit

Trigger the workflow as a non-exempt user more times than `max-runs-per-window`. In the **Actions** tab, the extra runs show as cancelled.

## :white_check_mark: Checkpoint

- [ ] Your workflow has `user-rate-limit` with `max-runs-per-window` and `window` set
- [ ] You can explain which roles are exempt by default and how `ignored-roles: []` changes that
- [ ] You added `stop-after` or can say when it is useful
- [ ] `gh aw compile` finished without errors and the lock file was updated
- [ ] You can name three controls that already limit a workflow: timeouts, AI credit budgets, and rate limits

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
