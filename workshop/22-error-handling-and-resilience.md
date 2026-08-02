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

The skill applies all three changes and recompiles the lock file. Review the diff before committing.

<details>
<summary>:pencil2: Manual edit path</summary>

Make the three edits manually, then run:

```bash
gh aw compile
git add .
git commit -m "feat: add timeout and defensive fallback to daily-status"
git push
```

</details>

> [!TIP]
> Optional side quest: if you want full syntax examples, predict-and-try checks, and enterprise timeout notes before you edit manually, use [Side Quest: Resilience Techniques Reference](side-quest-22-01-resilience-reference.md), then return here to continue.

### Write a defensive task brief

A defensive task brief tells the agent exactly what to do when data is missing or sparse. Add an explicit fallback instruction ("if there is no activity, publish a short no-activity report and still write output") so quiet runs are still observable and do not look like silent failures.

### Set a timeout

Long-running tasks can stall or be cancelled unpredictably, so set `timeout-minutes` at the top level of your workflow frontmatter. Start with a safe default (for example, 10) and tune based on real run durations so your workflow fails fast instead of hanging indefinitely.

### Add a fallback message to [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)

When your workflow uses a `noop` or comment safe output, include a meaningful fallback message for quiet runs. A clear "no changes found" message gives you a visible success signal in Actions logs and makes healthy no-op runs easy to distinguish from failures.

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
