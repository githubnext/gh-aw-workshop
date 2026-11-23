<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting controls — timeouts, stop-after, and safe-output max limits that keep an agentic workflow from running away</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>Steps 22, 26, and 30 touch on timeouts, budgets, and staged writes, but no step teaches learners to set explicit ceilings on run time, lifetime, and write volume. Enterprise admins running shared runners and billing need a hands-on step for capping a workflow before it is scheduled widely.</rationale>
</research-metadata>
-->

# Set Guardrails and Limits on Your Workflow

> _Put a ceiling on how long, how long-lived, and how chatty your workflow can be — before it runs unattended._

## :dart: What You'll Do

You'll add three limits to a workflow: a run-time cap, an automatic stop date, and a cap on how many items it can write. Then you'll compile and confirm each limit appears in the generated lock file. When you finish, your workflow has predictable boundaries for time, lifetime, and output.

## :clipboard: Before You Start

- A compiled workflow from [Step 7](07-your-first-workflow.md) in your Codespace
- Optional: the cost view from [Step 26](26-manage-costs-and-budgets.md)

## Steps

### Know the three limits

Agentic workflows already have built-in protections, such as read-only agents and non-triggering bot accounts. See the [rate limiting controls](https://github.github.com/gh-aw/reference/rate-limiting-controls/) reference for the full list. These three are ones you set yourself:

| Limit | Frontmatter key | What it caps |
|-------|-----------------|--------------|
| Run time | `timeout-minutes` | How long the agent step may run (default 20 minutes) |
| Lifetime | `on.stop-after` | When the workflow stops running (minimum unit is hours) |
| Write volume | `safe-outputs.<type>.max` | How many items of one type the agent can create |

### Ask your agent to add the limits

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
/agentic-workflows Update my daily-status workflow: cap the agent at 10 minutes, stop the workflow after 7 days, and allow at most 1 issue to be created per run.
```

### Review the frontmatter

The agent should produce something close to this:

```yaml
---
on:
  workflow_dispatch:
  stop-after: +7d
timeout-minutes: 10
permissions:
  contents: read
  issues: read
engine: copilot
safe-outputs:
  create-issue:
    max: 1
---

# Guarded status report

Summarize this week's repository activity in one issue.
```

> [!NOTE]
> `stop-after` goes under `on:` and accepts relative values such as `+48h` or `+7d`, and absolute dates. It is checked before the agent starts, so a stopped workflow skips cleanly instead of failing.

### Recompile and inspect

Compile in the terminal:

```bash
gh aw compile
```

Open the generated `.lock.yml` file and search for `timeout-minutes` and `stop-after`. Both should appear in the agent job. Commit the `.md` and `.lock.yml` files together.

### Check the limits during a run

Dispatch the workflow from the **Actions** tab on GitHub.com, as you did in [Step 8](08-run-your-workflow.md). If the agent tries to create a second issue, the run summary reports that the safe-output limit was reached. That is the guardrail working, not a failure.

> [!TIP]
> Start with tight limits and loosen them one at a time. A limit you raised on purpose is easier to defend in a review than one you never set.

## :white_check_mark: Checkpoint

- [ ] Your workflow sets `timeout-minutes`, `stop-after`, and a `max` on one safe output
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] You found `timeout-minutes` in the generated lock file
- [ ] You can explain which limit caps time, which caps lifetime, and which caps writes

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
