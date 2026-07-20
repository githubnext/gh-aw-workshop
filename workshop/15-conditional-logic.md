<!-- page-journey: all -->
<!-- page-adventure: advanced -->
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
3. Add a top-level `if:` in workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) to skip the agent job when the count is zero.

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

### Compile your changes

After editing the frontmatter, compile the workflow to confirm everything is valid:

```bash
gh aw compile
```

You should see `✅ Compiled successfully`. This regenerates your `.lock.yml` file with the updated conditional logic.

> [!NOTE]
> The `if:` condition is applied during [compilation](https://github.github.com/gh-aw/reference/compilation-process/) — it won't take effect until you compile and push both files.

### Commit and push your conditional logic

#### Terminal path

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: skip summary on days with no commits"
git push
```

<details>
<summary>🖥️ GitHub UI path</summary>

1. Navigate to `.github/workflows/daily-status.md` in your repository on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Add the `steps:` block and `if:` field to the frontmatter.
4. Click **Commit changes**.

> [!IMPORTANT]
> Committing the `.md` file via the web editor does **not** automatically recompile the lock file. After committing, open your Codespace or local terminal and run `gh aw compile`, then push the updated `.lock.yml`. The `if:` condition will not take effect until the compiled lock file is pushed.

</details>

## ✅ Checkpoint

- [ ] Your workflow has a `count recent commits` step with `id: recent`
- [ ] Your workflow frontmatter includes `if: steps.recent.outputs.commit_count != '0'`
- [ ] `gh aw compile` completed without errors and the updated `.lock.yml` is committed and pushed
- [ ] Both `.github/workflows/daily-status.md` and `.github/workflows/daily-status.lock.yml` are committed and pushed
- [ ] You triggered the workflow manually and confirmed the conditional behaviour in the run log
- [ ] The workflow still posts a summary on days with commits

<!-- journey: all -->
**Next:** [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)
<!-- /journey -->


