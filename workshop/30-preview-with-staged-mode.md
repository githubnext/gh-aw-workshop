<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Staged mode for safe outputs — previewing what a workflow would write (issues, comments, pull requests) with `safe-outputs.staged: true` and per-type `staged:` overrides before enabling real writes</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt (downloaded to /tmp/gh-aw/data/llms.txt)</source>
    <source>https://github.github.com/gh-aw/reference/staged-mode/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
    <source>https://github.github.com/gh-aw/reference/compilation-process/</source>
  </sources>
  <rationale>Steps 1-29 teach safe-outputs, memory, sub-agents, evals, cost controls, orchestration, and skills, but no step shows how to test a workflow that writes to GitHub without side effects. Learners who add create-issue, add-comment, or create-pull-request outputs have no safe rehearsal path. Staged mode, documented in the gh-aw reference and absent from the workshop, closes that gap: it lets the agent run fully while the Actions step summary shows a 🎭 preview of each write. Per-type scoping also gives a practical rollout pattern, previewing risky outputs such as pull requests while letting low-risk outputs run.</rationale>
</research-metadata>
-->

# Preview Your Workflow's Writes with Staged Mode

> _Let the agent do its full job, then read what it would have written before anything touches your repository._

## :dart: What You'll Do

You'll turn on [staged mode](https://github.github.com/gh-aw/reference/staged-mode/) for a workflow, run it, and read the 🎭 preview in the run summary. Then you'll scope staging to one output type and disable it once you trust the result.

Why this matters: a workflow that creates issues or comments on pull requests can be noisy or wrong on its first runs. Staged mode lets you review the exact titles, bodies, and labels first, so you iterate on your prompt without cleaning up after it.

## :clipboard: Before You Start

- You completed [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md) or are comfortable with [`safe-outputs`](https://github.github.com/gh-aw/reference/safe-outputs/) from earlier steps.
- You have a workflow that writes to GitHub, such as the PR reviewer from [Build Your First Event-Driven Workflow](14b-pr-reviewer-workflow.md), or the daily report workflow that creates an issue.
- You can run `gh aw compile` and `gh aw run`.

## Steps

### Stage every output

Open your workflow's `.md` file and add `staged: true` inside the `safe-outputs:` block:

```yaml
safe-outputs:
  staged: true
  create-issue:
    title-prefix: "[ai] "
    labels: [automation]
```

Compile and run it:

```bash
gh aw compile
gh aw run <your-workflow-name>
```

> :thinking: **Predict:** The agent still runs end to end. What do you expect to find in your Issues tab afterward?

### Read the preview

Open the finished run in the Actions tab and scroll to the step summary. Each staged operation appears under a heading marked with 🎭, for example `Staged Mode: Issue Creation Preview`. Check that:

- the title, body, labels, and assignees look right,
- the number of operations matches what you expected, and
- the summary ends with `No GitHub resources were created.`

If a preview looks wrong, edit the Markdown brief, recompile, and run again. Nothing has been written yet, so iterating costs nothing but a run.

### Scope staging to one output type

When your workflow has more than one output, you can preview only the risky one. A type-level `staged:` setting applies to that output alone:

```yaml
safe-outputs:
  create-pull-request:
    staged: true
  add-comment:
```

Here the pull request is previewed while comments post normally. Type-level `staged: false` can't override a global `staged: true`, so remove the global setting when you want mixed behavior.

> [!NOTE]
> Staged mode previews built-in safe outputs only. Custom jobs, scripts, external MCP servers, and memory persistence aren't sandboxed by it, so review those separately.

### Go live

When the previews look right, remove `staged: true` (or set it to `false`), then recompile and run once more:

```bash
gh aw compile
gh aw run <your-workflow-name>
```

Confirm the real issue, comment, or pull request now exists and matches the preview you approved.

## :white_check_mark: Checkpoint

- [ ] You added `staged: true` under `safe-outputs:` and recompiled the workflow
- [ ] A run completed and the step summary showed a 🎭 preview with no resources created
- [ ] You can explain how a type-level `staged:` setting differs from the global one
- [ ] You removed staging and confirmed the real output matches the preview

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
