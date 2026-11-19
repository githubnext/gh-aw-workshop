<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting controls — protecting event-driven workflows from bursts with user-rate-limit, stop-after, and safe-output max limits</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Step 26 covers AI credit budgets and timeouts, but no step teaches how to stop a burst of triggers or a runaway write loop. Organizations with shared repositories, including enterprise teams, need per-user limits and safe-output caps before they roll event-driven workflows out widely.</rationale>
</research-metadata>
-->

# Add Rate Limits and Guardrails to Event-Driven Workflows

> _Keep one noisy user or one busy afternoon from turning into dozens of agent runs._

## :dart: What You'll Do

You'll add a per-user rate limit, an expiry date, and a safe-output cap to an event-driven workflow. When you finish, your workflow will stop itself when it's triggered too often, and you'll know where to look when a run is cancelled early.

## :clipboard: Before You Start

- An event-driven workflow such as the one from [Step 14b](14b-pr-reviewer-workflow.md), compiled in your Codespace
- A basic idea of budgets from [Step 26](26-manage-costs-and-budgets.md)

## Steps

### Know the built-in protections

Agentic workflows already include several guardrails. Comments and issues created by the `github-actions[bot]` account don't trigger other workflows, so your workflows can't loop on each other's output. A concurrency group also keeps agent jobs from piling up. You can read the full list in the [rate limiting controls reference](https://github.github.com/gh-aw/reference/rate-limiting-controls/).

### Ask your agent to add the limits

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
/agentic-workflows Limit my pr-reviewer workflow to 3 runs per user per hour, stop it after 7 days, and let it post at most 2 comments.
```

### Review the frontmatter

The agent should produce settings like these. Compare them with your file:

```yaml
---
on:
  pull_request:
    types: [opened]
permissions:
  contents: read
  pull-requests: read
engine: copilot
user-rate-limit:
  max-runs-per-window: 3
  window: 60
stop-after: +7d
safe-outputs:
  add-comment:
    max: 2
---
```

Here is what each setting does:

- `user-rate-limit` cancels a run when the same person has triggered the workflow more than three times in the last 60 minutes.
- `stop-after` prevents new runs once the time limit passes. It's handy for pilots and temporary experiments.
- `max` under a safe output caps how many comments one run can post.

> [!NOTE]
> `user-rate-limit` is an experimental feature, so `gh aw compile` prints a warning when you use it. Repository admins, maintainers, and writers are exempt by default. Add `ignored-roles: []` if you want the limit to apply to everyone.

### Compile and commit

Run this in the Codespace terminal:

```bash
gh aw compile
```

Commit the `.md` file and the regenerated `.lock.yml` file together.

### Trigger it past the limit

Open four pull requests in quick succession from a test account without write access. Then open the **Actions** tab on GitHub.com. The fourth run should be cancelled during its pre-activation step, before the agent starts and before any AI credits are used.

> [!TIP]
> If a run is cancelled right away, check the pre-activation log first. It tells you whether the rate limit, a concurrency group, or `stop-after` stopped it.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `user-rate-limit:` block with `max-runs-per-window` set
- [ ] Your workflow has a `stop-after:` value and a `max:` on at least one safe output
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] You found the pre-activation step in the Actions log for a run
- [ ] You can explain how a rate limit differs from a budget like `max-daily-ai-credits`

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
