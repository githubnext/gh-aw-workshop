# Connect a Live Data Source to Your Workflow

> _Workflows become truly powerful when they act on real, up-to-the-minute data — not just canned prompts._

## 🎯 What You'll Do

You'll extend your daily-status workflow to fetch open issues from your repository using the GitHub CLI, then inject that data into your AI prompt. By the end, your summary will include an overview of outstanding issues alongside the commit activity.

## 📋 Before You Start

- You have a working daily-status workflow from [Build: Daily Repo Status Workflow](11-build-daily-status.md).
- You're comfortable running and iterating on workflows from [Test and Improve Your Workflow](12-test-and-iterate.md).

## Steps

### 1. Understand how data flows in

gh-aw workflows run inside GitHub Actions, which means you can run any shell command available on the runner — including `gh`, the GitHub CLI. The trick is to capture command output and pass it into your AI prompt as context.

The pattern looks like this:

1. Run a shell step to fetch the data you need.
2. Store the result in `$GITHUB_OUTPUT`.
3. Reference the output in your prompt with `${{ steps.<id>.outputs.<key> }}`.

### 2. Add a step to fetch open issues

Open your workflow file at `.github/workflows/daily-status.md` and add a step **before** the AI prompt step:

```yaml
- name: Fetch open issues
  id: issues
  run: |
    ISSUE_LIST=$(gh issue list --state open --limit 10 \
      --json number,title,labels \
      --jq '.[] | "#\(.number) \(.title)"')
    echo "open_issues<<EOF" >> $GITHUB_OUTPUT
    echo "$ISSUE_LIST" >> $GITHUB_OUTPUT
    echo "EOF" >> $GITHUB_OUTPUT
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

What this does:
- `gh issue list` returns the 10 most recent open issues as JSON.
- `--jq` formats each issue as `#42 Fix the login bug` — a readable list.
- The multi-line `<<EOF` syntax lets you store a multi-line string in `$GITHUB_OUTPUT`.

> [!NOTE]
> `GH_TOKEN` is automatically provided by GitHub Actions in `secrets.GITHUB_TOKEN`. You don't need to create it yourself — it's available in every repository.

### 3. Inject the data into your AI prompt

Find the AI prompt step in your workflow and update the `prompt:` to include the new context:

```yaml
- name: Generate daily summary
  uses: gh-aw/prompt@v1
  with:
    prompt: |
      Summarise recent activity in this repository.

      Recent commits:
      ${{ steps.recent.outputs.commit_log }}

      Open issues (${{ steps.issues.outputs.open_issues_count }} total):
      ${{ steps.issues.outputs.open_issues }}

      Write a concise, friendly update — two short paragraphs. 
      Highlight anything that looks urgent in the issue list.
```

> [!TIP]
> The more specific your prompt, the better the output. Tell the model exactly what format you want (e.g., "two short paragraphs") and what to emphasise.

### 4. Compile and validate

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

Fix any errors reported before moving on.

### 5. Test with `workflow_dispatch`

Push your changes and trigger a manual run in the **Actions** tab to verify the new step appears and the AI output now mentions your open issues.

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: inject open issues into daily summary prompt"
git push
```

![Actions run showing the fetch-issues step and updated summary](images/16-data-source-run.png)

> [!WARNING]
> If your repository has no open issues, the AI will say so — that's expected behaviour. Create a test issue to see the integration in action.

### 6. Try other data sources

Once you're comfortable with this pattern, the same technique works for:

| Data | Command |
|------|---------|
| Open pull requests | `gh pr list --state open` |
| Recent releases | `gh release list --limit 5` |
| Failed workflow runs | `gh run list --status failure --limit 5` |
| Repository stats | `gh api repos/:owner/:repo` |

## ✅ Checkpoint

- [ ] Your workflow has a `fetch open issues` step with `id: issues`
- [ ] Your AI prompt references `steps.issues.outputs.open_issues`
- [ ] `gh aw compile` reports no errors
- [ ] A manual run completes and the summary mentions open issues
- [ ] You can explain the `<<EOF` multi-line output syntax in your own words

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
