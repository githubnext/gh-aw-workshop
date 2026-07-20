<!-- journey: all -->
<!-- adventure: advanced -->
# Make Your Workflows Resilient to Failure

> _A workflow that handles errors gracefully is one you can trust to run unattended, week after week._

## 🎯 What You'll Do

Learn the most common ways agentic workflows fail in production and apply three practical techniques — defensive task briefs, timeout settings, and [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) fallbacks — to keep your workflow useful even when things go wrong.

## 📋 Before You Start

- You have a working scheduled workflow (see [Schedule It to Run Every Day](13-schedule-it.md)).
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

### Compile and push your changes

After editing the frontmatter and task brief, regenerate the lock file so `timeout-minutes` and your defensive brief take effect:

```bash
gh aw compile
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add timeout and defensive fallback to daily-status"
git push
```

> [!IMPORTANT]
> Frontmatter changes — including `timeout-minutes` — only take effect after `gh aw compile` regenerates the `.lock.yml` file. GitHub Actions runs the compiled lock file, not the `.md` source.

<details>
<summary>🖥️ GitHub UI path</summary>

1. Navigate to your workflow file in `.github/workflows/` on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Make your changes to the frontmatter and task brief.
4. Click **Commit changes**.
5. Open your Codespace or local terminal and run `gh aw compile`, then push the updated `.lock.yml`. The `timeout-minutes` limit will not take effect until the compiled lock file is committed and pushed.

</details>

### Verify your changes

After pushing:

1. Trigger a manual run from the **Actions** tab.
2. Open the run log and confirm the safe output step runs even when the data set is small or empty.
3. Check the run duration — it should complete well within your `timeout-minutes` limit.

## ✅ Checkpoint

- [ ] Your task brief includes an explicit fallback instruction for empty or missing data
- [ ] Your workflow frontmatter sets `timeout-minutes`
- [ ] Your safe-output call includes a fallback message for quiet runs
- [ ] You ran `gh aw compile` and pushed the updated `.lock.yml` alongside the `.md` file
- [ ] A manual run completes successfully and the safe output step is visible in the log
- [ ] You can name at least two common agentic workflow failure modes and how to mitigate them

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/), [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [Triggers reference](https://github.github.com/gh-aw/reference/triggers/), [Side Quest: Debugging Output Patterns](side-quest-09-01-debug-output.md), [Side Quest: Pattern — Safe Output Blocked](side-quest-09-01c-pattern-safe-output-blocked.md), [Side Quest: Pattern — Done but No Write](side-quest-09-01e-pattern-done-no-write.md), and [Test and Iterate on Your Workflow](12-test-and-iterate.md).

