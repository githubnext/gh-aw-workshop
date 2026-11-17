<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Runaway-run protection — concurrency, timeouts, stop-after, and per-user rate limits</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Steps 22 and 26 touch on timeouts and budgets, but no step teaches the overlapping-run and trigger-flood controls. Enterprise teams with shared runners and metered AI usage need a hands-on step that caps how often and how long a workflow can run.</rationale>
</research-metadata>
-->

# Prevent Runaway Runs with Limits

> _Make sure one busy hour, or one over-eager teammate, can never turn into a pile of overlapping agent runs._

## :dart: What You'll Do

You'll add three guardrails to one of your workflows: a run time limit, an automatic stop date, and a per-user rate limit. Then you'll trigger the workflow several times and see the extra runs cancelled. When you finish, you'll know which limit stops which kind of runaway.

## :clipboard: Before You Start

- A compiled workflow from [Step 7](07-your-first-workflow.md) in your Codespace
- Familiarity with AI credit budgets from [Step 26](26-manage-costs-and-budgets.md)
- Optional: [Step 31](31-control-network-access.md), which covers the firewall side of the same safety story

## Steps

### Know what is already protected

Every agentic workflow ships with [built-in protections](https://github.github.com/gh-aw/reference/rate-limiting-controls/). The agent job runs one at a time per AI engine, and a post made with `github-actions[bot]` credentials does not trigger other workflows. You add limits on top when a trigger can fire often, such as `issue_comment` or `workflow_dispatch`.

| Limit | What it stops |
|-------|---------------|
| `timeout-minutes` | One run that takes too long |
| `stop-after` | A workflow that keeps running after its purpose ends |
| `user-rate-limit` | One person triggering many runs in a short window |

### Ask your agent to add the limits

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
/agentic-workflows Add a 10-minute timeout, stop my daily-status workflow after 48 hours, and limit each user to 3 runs per hour.
```

### Review the frontmatter

The agent should produce something like this:

```yaml
---
on:
  workflow_dispatch:
permissions:
  contents: read
engine: copilot
timeout-minutes: 10
stop-after: +48h
user-rate-limit:
  max-runs-per-window: 3
  window: 60
---

# Status report

Summarize this repository's open issues in three bullet points.
```

> [!NOTE]
> `user-rate-limit` is experimental, so `gh aw compile` prints a warning. That's expected. By default, people with `admin`, `maintain`, or `write` access are exempt. Add `ignored-roles: []` to apply the limit to everyone while you test.

### Recompile

Compile in the terminal, then commit the `.md` and `.lock.yml` files:

```bash
gh aw compile
```

### Trigger the limit

Open the **Actions** tab on GitHub.com, select your workflow, and choose **Run workflow** four times in a row. Because of `ignored-roles: []`, the fourth request should be cancelled before the agent starts.

### Read the evidence

Open the cancelled run. The first job, which checks activation, explains that the rate limit was exceeded. No AI credits were used, because the agent never started.

> [!TIP]
> `stop-after` accepts relative values such as `+48h` (hours are the smallest unit) or an absolute date. Use it for seasonal workflows, like a release-week digest.

## :white_check_mark: Checkpoint

- [ ] Your frontmatter includes `timeout-minutes`, `stop-after`, and `user-rate-limit`
- [ ] `gh aw compile` succeeded and you committed both the `.md` and `.lock.yml` files
- [ ] A fourth quick dispatch was cancelled before the agent job started
- [ ] You can explain which limit stops a slow run, an outdated workflow, and a trigger flood

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
