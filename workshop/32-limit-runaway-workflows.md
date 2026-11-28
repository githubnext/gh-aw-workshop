<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting controls — timeouts, stop dates, and safe-output limits that keep a workflow from running away</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>Steps 30 and 31 teach previewing writes and restricting network access, but no step teaches how to cap how long a workflow runs or how much it can write. Enterprise teams need these guardrails before enabling scheduled workflows across many repositories.</rationale>
</research-metadata>
-->

# Limit Runaway Workflows with Timeouts and Output Caps

> _Set clear ceilings on run time and writes, so a scheduled workflow can never surprise you._

## :dart: What You'll Do

You'll add three guardrails to a workflow: a run-time limit, a stop date, and a cap on how many issues it can create. Then you'll compile and confirm the limits appear in the generated lock file. When you finish, you'll know which dials keep a scheduled workflow predictable.

## :clipboard: Before You Start

- A compiled workflow from [Step 7](07-your-first-workflow.md) in your Codespace
- Familiarity with safe outputs from [Step 30](30-preview-with-staged-mode.md)

## Steps

### Know the built-in protections

Agentic workflows already include several [rate limiting controls](https://github.github.com/gh-aw/reference/rate-limiting-controls/). The agent token is read-only, writes go through safe outputs, and workflows from the `github-actions[bot]` account don't trigger other workflows. You add the three limits below on top of those defaults.

| Frontmatter key | What it limits |
|-----------------|----------------|
| `timeout-minutes` | How long the agent step may run (default: 20 minutes) |
| `stop-after` (under `on:`) | When the workflow stops running at all (for example, `+48h`) |
| `max` under a safe output | How many times the agent may perform that write |

### Ask your agent to add the limits

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then paste this prompt:

```prompt
/agentic-workflows Limit my workflow to 10 minutes, stop it after 48 hours, and allow at most one created issue.
```

### Review the frontmatter

Your workflow's frontmatter should now look similar to this:

```yaml
---
on:
  workflow_dispatch:
  stop-after: +48h
permissions:
  contents: read
  issues: read
timeout-minutes: 10
safe-outputs:
  create-issue:
    max: 1
---

# Limits demo

Summarize recent repository activity and create one issue with the summary.
```

> [!NOTE]
> `stop-after` goes under `on:` and accepts relative values such as `+48h` or an absolute date. The smallest unit is hours. Use it for pilots and trial runs that should switch themselves off.

### Compile and check the lock file

Compile in the terminal:

```bash
gh aw compile
```

Then search the generated lock file for your limits:

```bash
grep -n "timeout-minutes" .github/workflows/*.lock.yml
```

You should see `timeout-minutes: 10` on the agent step. Commit both the `.md` and `.lock.yml` files.

> [!TIP]
> Start with tight limits and loosen them only when a real run needs more. A 10-minute timeout that occasionally fires is easier to fix than a runaway run that quietly burns your budget.

## :white_check_mark: Checkpoint

- [ ] Your workflow sets `timeout-minutes` to a value you chose
- [ ] Your workflow sets `stop-after` with a relative or absolute time
- [ ] Your safe output has a `max` value of `1`
- [ ] `gh aw compile` succeeded and the lock file shows `timeout-minutes: 10`
- [ ] You can name one reason to prefer a low `max` for write operations

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
