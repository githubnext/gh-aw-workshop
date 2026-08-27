<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Make Your Workflows Resilient to Failure

> _A workflow that handles errors gracefully is one you can trust to run unattended, week after week._

## :dart: What You'll Do

Learn the most common ways agentic workflows fail in production and apply three practical techniques — defensive task briefs, timeout settings, and [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) fallbacks — to keep your workflow useful even when things go wrong.

## :clipboard: Before You Start

- You have a working scheduled workflow (see [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)).
- You're comfortable editing workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) and task briefs.

## Steps

### Understand common failure modes

Agentic workflows can fail for several reasons:

| Failure type | Example | Effect |
|---|---|---|
| **Empty data** | No open issues to summarise | Agent produces a vague or empty report |
| **Tool error** | GitHub API rate-limit hit mid-run | Agent stops mid-task without writing output |
| **Timeout** | Complex reasoning takes too long | Workflow job is cancelled by Actions |
| **Prompt drift** | Instructions are ambiguous | Agent takes an unexpected code path |

Recognising these patterns helps you write instructions that stay on track.

The diagram below shows how these failure modes map to the three mitigations covered in this step.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/22-resilience-techniques-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/22-resilience-techniques-light.svg">
  <img alt="Four failure modes — prompt drift, timeout, tool error, and empty data — each mapped to one of three mitigations: defensive brief, timeout-minutes, and fallback safe-output, which together produce a reliably running workflow" src="images/22-resilience-techniques-light.svg">
</picture>

### Apply all three changes with the skill

In your Copilot CLI session in the terminal, paste:

```prompt
/agentic-workflows make daily-status.md resilient: add a fallback brief for empty data, set timeout-minutes to 10, and include a fallback message on the safe-output call.
```

The skill applies all three changes and recompiles the [lock file](https://github.github.com/gh-aw/reference/compilation-process/). Review the diff before committing.

<details>
<summary>:pencil2: Manual edit path</summary>

Make the three edits manually (see the reference content below), then run:

```bash
gh aw compile
git add .
git commit -m "feat: add timeout and defensive fallback to daily-status"
git push
```

</details>

### Write a defensive task brief

A defensive task brief tells the agent what to do when data is missing or sparse. Add an explicit fallback instruction in your task description:

```markdown .github/workflows/daily-status.md
If there are no open pull requests or issues to summarise,
write a brief "No activity" report instead of skipping the output step.
Always call the safe output tool — even for empty results.
```

This prevents the most common failure: the agent silently completes without writing any output.

### Set a timeout

Long-running tasks can stall a workflow run indefinitely. Add `timeout-minutes` to your workflow frontmatter to cap the run (see [Timeouts](https://github.github.com/gh-aw/reference/rate-limiting-controls/#timeouts)):

```markdown .github/workflows/daily-status.md
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: write
timeout-minutes: 10
---
```

> [!TIP]
> <details>
> <summary>`timeout-minutes` belongs at the top level of gh-aw frontmatter. Do not nest it under `jobs:` or `run:`.</summary>
>
> Start with a generous limit (10–15 minutes) and tighten it once you know how long typical runs take.
>
> </details>

On GitHub Enterprise Server (GHES) and GitHub Enterprise Cloud (GHEC), administrators can set a maximum job timeout at the organisation or enterprise level. When that policy is more restrictive than your `timeout-minutes` value, the enterprise limit takes precedence and the workflow job will be cancelled at the admin-set threshold. Check with your GitHub administrator before relying on a specific `timeout-minutes` value in an enterprise environment.

### Add a fallback message to [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)

When your workflow uses a `noop` or comment safe output, always include a meaningful fallback body. If the agent reaches the output step but has nothing to report, this ensures the run still records a visible result:

```markdown .github/workflows/daily-status.md
If no meaningful changes were found, call noop with the message:
"No changes found in the past 24 hours — workflow ran successfully."
```

This makes it easy to distinguish a healthy "quiet" run from a silent failure in the Actions run log.

### Commit and push your changes

The `/agentic-workflows` skill recompiles the lock file automatically. Commit both files and push:

```bash
git add .
git commit -m "feat: add timeout and defensive fallback to daily-status"
git push
```

> [!IMPORTANT]
> Frontmatter changes — including `timeout-minutes` — only take effect after the lock file is recompiled. The `/agentic-workflows` skill handles this automatically. If you edited manually in a terminal, run `gh aw compile` before pushing.

### Verify your changes

After pushing:

1. Trigger a manual run from the **Actions** tab.
2. Open the run log and confirm the safe output step runs even when the data set is small or empty.
3. Check the run duration — it should complete well within your `timeout-minutes` limit.

## :white_check_mark: Checkpoint

- [ ] Your task brief includes an explicit fallback instruction for empty or missing data
- [ ] Your workflow frontmatter sets `timeout-minutes`
- [ ] Your safe-output call includes a fallback message for quiet runs
- [ ] The compiled lock file was updated and committed alongside the workflow source
- [ ] A manual run completes successfully and the safe output step is visible in the log
- [ ] You can name at least two common agentic workflow failure modes and how to mitigate them

<!-- journey: all -->
**Next:** [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md)
<!-- /journey -->
