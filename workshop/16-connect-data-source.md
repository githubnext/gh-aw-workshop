# Connect a Live Data Source to Your Workflow

> _Workflows become truly powerful when they act on real, up-to-the-minute data — not just canned prompts._

## 🎯 What You'll Do

You'll extend your daily-status workflow to fetch open issues from your repository using the [GitHub CLI](side-quest-01-02-environment-reference.md#github-cli-gh), then inject that data into your AI prompt. By the end, your summary will include an overview of outstanding issues alongside the commit activity.

## 📋 Before You Start

- You have installed the `gh-aw` extension in [Step 6: Install the `gh-aw` CLI Extension](06-install-gh-aw.md).
- You have a working daily-status workflow from [Build: Daily Repo Status Workflow](11a-build-daily-status.md).
- You're comfortable running and iterating on workflows from [Test and Improve Your Workflow](12-test-and-iterate.md).

## Steps

### Understand how data flows in

[gh-aw workflows](https://github.github.com/gh-aw/introduction/overview/) run inside GitHub Actions, which means you can run any shell command available on the runner — including `gh`, the GitHub CLI. The trick is to capture command output and pass it into your AI prompt as context.

The pattern looks like this:

1. Run a shell step to fetch the data you need.
2. Store the result in `$GITHUB_OUTPUT`.
3. Reference the output in your prompt with `${{ steps.<id>.outputs.<key> }}`.

If you're unfamiliar with `$GITHUB_OUTPUT`, the optional [Side Quest: Passing Data Between Steps with $GITHUB_OUTPUT](side-quest-16-01-github-output.md) explains why `export` doesn't work across steps and how to write multi-line values.

### Add a step to fetch recent commits

Open your workflow file at `.github/workflows/daily-status.md` and add two steps to the `steps:` block in the frontmatter.

First, fetch the recent commit log:

```yaml
- name: Fetch recent commits
  id: recent
  run: |
    COMMIT_LOG=$(git log --oneline --since="24 hours ago" --format="%h %s" | head -10)
    echo "commit_log<<EOF" >> $GITHUB_OUTPUT
    echo "$COMMIT_LOG" >> $GITHUB_OUTPUT
    echo "EOF" >> $GITHUB_OUTPUT
```

What this does:
- `git log` with a time filter lists commits from the last 24 hours.
- `--format="%h %s"` produces a short hash followed by the commit subject, e.g. `a1b2c3d Fix login bug`.
- The multi-line `<<EOF` syntax stores a multi-line string in `$GITHUB_OUTPUT` (see the [side quest](side-quest-16-01-github-output.md) for details).

🤔 **Predict:** What will `${{ steps.recent.outputs.commit_log }}` contain if no commits were made in the last 24 hours? Form your prediction now and verify it at the checkpoint below, once you've completed the full step and triggered a run.

### Add a step to fetch open issues

Next, add a step to fetch open issues from GitHub:

```yaml
- name: Fetch open issues
  id: issues
  run: |
    ISSUE_LIST=$(gh issue list --state open --limit 10 \
      --json number,title,labels \
      --jq '.[] | "#\(.number) \(.title)"')
    ISSUE_COUNT=$(gh issue list --state open --json number --jq 'length')
    echo "open_issues<<EOF" >> $GITHUB_OUTPUT
    echo "$ISSUE_LIST" >> $GITHUB_OUTPUT
    echo "EOF" >> $GITHUB_OUTPUT
    echo "open_issues_count=$ISSUE_COUNT" >> $GITHUB_OUTPUT
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

What this does:
- `gh issue list` returns the 10 most recent open issues as JSON.
- `--jq '.[] | "#\(.number) \(.title)"'` formats each issue as `#42 Fix the login bug` — a readable list.
- A second `gh issue list` call counts the total with `--jq 'length'` and stores it as `open_issues_count`.
- `GH_TOKEN` is set to `secrets.GITHUB_TOKEN`, which GitHub Actions provides automatically in every repository — you do not need to create it.

✏️ **Try it:** Run `gh issue list --state open --json number --jq 'length'` in your terminal and note the count. After you complete this step and trigger a workflow run, check whether `open_issues_count` in the output matches.

### Inject the data into your AI prompt

In gh-aw, the AI prompt is not a step — it is the **Markdown body** of the workflow file: the natural-language text that appears after the closing `---` of the YAML frontmatter. The compiler picks this up automatically.

Open `.github/workflows/daily-status.md` and update the Markdown body (after the frontmatter) to reference the step outputs you just added:

```markdown
---
# … your existing frontmatter with the two new steps …
---

Summarise recent activity in this repository.

Recent commits (last 24 hours):
${{ steps.recent.outputs.commit_log }}

Open issues (${{ steps.issues.outputs.open_issues_count }} total):
${{ steps.issues.outputs.open_issues }}

Write a concise, friendly update — two short paragraphs.
Highlight anything that looks urgent in the issue list.
```

The `${{ steps.<id>.outputs.<key> }}` expressions are resolved at runtime and the values are injected into the prompt before the AI sees it. The more specific you make the instructions (e.g., "two short paragraphs"), the more consistent the output will be.

✏️ **Try it:** Change `"two short paragraphs"` to `"one bullet list per topic"`, recompile, and re-run the workflow. Notice how the output format shifts — then decide which style suits your daily report better.

### Compile and validate

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

Fix any errors reported before moving on.

### Test with `workflow_dispatch`

Push your changes and trigger a manual run in the **Actions** tab to verify the new step appears and the AI output now mentions your open issues.

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: inject open issues into daily summary prompt"
git push
```

![Actions run showing the fetch-issues step and updated summary](images/16-data-source-run.svg)

> [!WARNING]
> If your repository has no open issues, the AI will say so — that's expected behaviour. Create a test issue to see the integration in action.

### Try other data sources

Once you're comfortable with this pattern, the same technique works for:

| Data | Command |
|------|---------|
| Open pull requests | `gh pr list --state open` |
| Recent releases | `gh release list --limit 5` |
| Failed workflow runs | `gh run list --status failure --limit 5` |
| Repository stats | `gh api repos/:owner/:repo` |

## ✅ Checkpoint

- [ ] Your workflow has a `fetch recent commits` step with `id: recent`
- [ ] Your workflow has a `fetch open issues` step with `id: issues`
- [ ] Your AI prompt references `steps.recent.outputs.commit_log` and `steps.issues.outputs.open_issues`
- [ ] `gh aw compile` reports no errors
- [ ] A manual run completes and the summary mentions both commits and open issues
- [ ] You can explain the `<<EOF` multi-line output syntax in your own words

**Next:** [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)

> [!TIP]
> Now that your workflow reads live repository data, you're exposing a surface that attackers can try to exploit. Learn how crafted issue or PR content can attempt to exfiltrate your `GITHUB_TOKEN` — and how gh-aw stops it — in the optional [Side Quest: Token and Secret Exfiltration in Agentic Workflows](side-quest-16-03-token-exfiltration.md).

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
