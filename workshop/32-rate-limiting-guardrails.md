<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting controls — stopping runaway or over-triggered workflows</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Steps 22 and 26 cover timeouts and cost budgets, but no step shows how to limit how often people can trigger a workflow. Workflows that respond to comments or manual dispatch can be triggered repeatedly, so this step adds the per-user rate limit and ties it to the daily credit cap.</rationale>
</research-metadata>
-->

# Limit How Often Your Workflow Can Run

> _Stop a busy or over-eager trigger from turning into a surprise bill._

## :dart: What You'll Do

You'll add a [per-user rate limit](https://github.github.com/gh-aw/reference/rate-limiting-controls/) to a workflow that people can trigger by hand or by comment. When you finish, a user who triggers it too often has extra runs cancelled before the agent starts.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md), or you have a workflow with `workflow_dispatch` or an `issue_comment` trigger.
- You can compile workflows with `gh aw compile`.

## Steps

### Know the built-in guardrails

gh-aw already protects you in layers:

- **Bot non-triggering:** issues and comments created by safe outputs don't trigger other workflows, so loops can't start.
- **Concurrency groups:** one run per workflow, and one agent job at a time per engine.
- **Safe output limits:** risky outputs such as `dispatch-workflow` default to a `max` of 1.

A per-user limit adds one more layer: it controls how often a *person* can start a run.

### Ask your agent to add a rate limit

In your Codespace terminal, start Copilot:

```bash
gh copilot
```

Then paste this prompt:

```prompt
/agentic-workflows Add a user-rate-limit of 3 runs per hour to my workflow.
```

### Check the result

The agent should add a block like this to the frontmatter:

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
---
```

- `max-runs-per-window` is how many runs one user may start (1–10).
- `window` is the length of the window in minutes (default 60, maximum 180).

> [!NOTE]
> `user-rate-limit` is experimental. `gh aw compile` prints a warning about it, and that warning is expected.

### Compile and commit

```bash
gh aw compile
```

Commit the `.md` and `.lock.yml` files.

### Know who is exempt

By default, users with `admin`, `maintain`, or `write` roles are **not** limited. If you are the repository owner, you won't see a cancelled run while testing. To limit everyone, including admins, set `ignored-roles: []` under `user-rate-limit:`.

### Pair it with the daily credit cap

A rate limit counts runs. The `max-daily-ai-credits` field caps what those runs can *spend* in a rolling 24 hours. Use both for workflows that anyone on a team can trigger. Manual `workflow_dispatch` runs and slash commands bypass the daily cap, so the rate limit is your check on those.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `user-rate-limit:` block with `max-runs-per-window` set
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] You can name two built-in guardrails that already prevent runaway loops
- [ ] You can explain why repository admins aren't limited by default and how to change that

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
