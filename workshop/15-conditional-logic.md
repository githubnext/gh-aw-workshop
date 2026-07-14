# Make Your Workflow Smarter with Conditional Logic

> _A workflow that always runs is useful — a workflow that only runs when it matters is elegant._

## 🎯 What You'll Do

Add a conditional check to your daily-status workflow so it only posts a summary when there have been recent commits. You'll learn how to use shell commands to gather context and pass that context into your AI prompt.

## 📋 Before You Start

- You have a working daily-status workflow from [Build: Daily Repo Status Workflow](11a-build-daily-status.md).
- You understand how to edit and re-run a workflow from [Test and Improve Your Workflow](12-test-and-iterate.md).

## Steps

### Understand the problem

Right now your daily-status workflow runs every weekday — even on days when nothing happened. That means noisy, unhelpful summaries like "No activity to report." Conditional logic lets you skip the AI call entirely on quiet days.

The approach:
1. Run a shell command to count recent commits.
2. Store the result in an output variable.
3. Add a top-level `if:` in workflow frontmatter to skip the agent job when the count is zero.

### Add a commit-count step

Open your daily-status workflow file (e.g., `.github/workflows/daily-status.md`) and add this inside the YAML frontmatter under `steps:`:

```yaml
steps:
  - name: Count recent commits
    id: recent
    run: |
      COUNT=$(git log --oneline --since="24 hours ago" | wc -l | tr -d ' ')
      echo "commit_count=$COUNT" >> $GITHUB_OUTPUT
```

This shell command:
- Uses `git log` with a time filter to list commits from the last 24 hours.
- Counts the lines with `wc -l`.
- Writes the result to `$GITHUB_OUTPUT` so the next step can read it.

> [!NOTE]
> <details>
> <summary>`$GITHUB_OUTPUT` is a special GitHub Actions file. Anything you write in the format `key=value` becomes available to later steps as `steps.<id>.outputs.key`.</summary>
>
> Want to understand how `${{ steps.recent.outputs.commit_count }}` works and what other context objects exist? See [Side Quest: GitHub Actions Expressions and Contexts](side-quest-15-01-expressions-and-contexts.md).
>
> </details>

### Add a top-level condition in frontmatter

In the same frontmatter block, add a top-level `if:` key (at the same level as `on:` and `steps:`):

```yaml
if: steps.recent.outputs.commit_count != '0'
```

This condition skips the compiler-generated agent job entirely when `commit_count` is `0`.

> [!TIP]
> You can use `${{ steps.recent.outputs.commit_count }}` inside your prompt text too — for example: "Summarise the last ${{ steps.recent.outputs.commit_count }} commits."

### Test it locally first

Use `workflow_dispatch` to trigger the workflow manually. Check the run log:

- If there were recent commits, the summary should run.
- If not, you should see the agent job marked as **skipped** (a grey icon in the Actions UI).

![Skipped step in GitHub Actions](images/15-skipped-step.svg)

### Commit and push your conditional logic

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: skip summary on days with no commits"
git push
```

> [!WARNING]
> Make sure the commit-count command stays in frontmatter `steps:` so `commit_count` is available to the top-level `if:`.

## ✅ Checkpoint

- [ ] Your workflow has a `count recent commits` step with `id: recent`
- [ ] Your workflow frontmatter includes `if: steps.recent.outputs.commit_count != '0'`
- [ ] You triggered the workflow manually and confirmed the conditional behaviour in the run log
- [ ] The workflow still posts a summary on days with commits

**Next:** [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
