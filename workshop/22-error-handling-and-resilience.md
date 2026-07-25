<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Make Your Workflows Resilient to Failure

> _A workflow that handles errors gracefully is one you can trust to run unattended, week after week._

## 🎯 What You'll Do

Learn the most common ways agentic workflows fail in production and apply three practical techniques — defensive task briefs, timeout settings, and [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) fallbacks — to keep your workflow useful even when things go wrong.

## 📋 Before You Start

- You have a working scheduled workflow (see [Schedule It to Run Every Day](12-test-and-iterate.md)).
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

In the GitHub Copilot **Chat** or **Agents** tab, paste:

```text
/agentic-workflows update .github/workflows/daily-status.md to:
1. Add an explicit fallback instruction to the task brief for when there are no issues or pull requests.
2. Add `timeout-minutes: 10` to the frontmatter.
3. Add a fallback message to the safe-output call for quiet runs.
```

The skill applies all three changes and recompiles the lock file. Review the diff before committing.

<details>
<summary>🖥️ Terminal path</summary>

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

```markdown
If there are no open pull requests or issues to summarise,
write a brief "No activity" report instead of skipping the output step.
Always call the safe output tool — even for empty results.
```

This prevents the most common failure: the agent silently completes without writing any output.

### Set a timeout

Long-running tasks can stall a workflow run indefinitely. Add `timeout-minutes` to your workflow frontmatter to cap the run:

```yaml
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

### Add a fallback message to safe outputs

When your workflow uses a `noop` or comment safe output, always include a meaningful fallback body. If the agent reaches the output step but has nothing to report, this ensures the run still records a visible result:

```markdown
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

## ✅ Checkpoint

- [ ] Your task brief includes an explicit fallback instruction for empty or missing data
- [ ] Your workflow frontmatter sets `timeout-minutes`
- [ ] Your safe-output call includes a fallback message for quiet runs
- [ ] The compiled lock file was updated and committed alongside the workflow source
- [ ] A manual run completes successfully and the safe output step is visible in the log
- [ ] You can name at least two common agentic workflow failure modes and how to mitigate them

<!-- journey: all -->
**Next:** [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md)
<!-- /journey -->

