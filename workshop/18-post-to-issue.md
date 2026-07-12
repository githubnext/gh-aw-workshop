# Post Your Daily Status to a GitHub Issue

> _A report no one reads is just noise — pinning your daily status to a GitHub Issue makes it persistent, searchable, and shareable with your whole team._

## 🎯 What You'll Do

You'll extend your daily-status workflow to write its AI-generated summary directly to a GitHub Issue. By the end of this step, every scheduled run will either create a new issue entry or append a comment to an existing tracking issue, giving you a running log of your repository's health over time.

## 📋 Before You Start

- You have a working daily-status workflow from [Step 11: Build Your Daily Repo Status Workflow](11-build-daily-status.md).
- You have scheduled it in [Step 13: Schedule It to Run Every Day](13-schedule-it.md).
- You are comfortable editing YAML frontmatter and Markdown task briefs.

## Steps

### 1. Create your tracking issue

Open your repository on GitHub and create a new issue:

1. Click **Issues** → **New issue**.
2. Set the title to `📊 Daily Status Log`.
3. In the body, write: `This issue collects daily status reports from the \`daily-status\` workflow.`
4. Click **Submit new issue**.
5. Note the issue number (e.g. `#42`) — you'll need it shortly.

### 2. Add the `issues: write` permission

Your workflow needs permission to post comments. Open `.github/workflows/daily-status.md` and update the `permissions` block in the YAML frontmatter:

```yaml
permissions:
  contents: read
  issues: write
```

> [!NOTE]
> The built-in `GITHUB_TOKEN` is automatically available to workflow steps. Adding `issues: write` grants it the scope needed to create issue comments — no personal access token required.

### 3. Add a "post summary" step to your task brief

Scroll down to the Markdown task brief section of your workflow file (below the closing `---`). Add an instruction telling the agent to post its summary as a comment on your tracking issue.

Here's an example brief:

```markdown
## Task

1. Summarise the last 24 hours of activity in this repository:
   - Recent commits and their authors
   - Open pull requests and issues
   - Any failed workflow runs

2. Keep the summary under 300 words. Use bullet points. Be specific — names, numbers, titles.

3. Post the completed summary as a comment on issue #42 using the `create_issue_comment` tool.
```

> [!TIP]
> If you added the GitHub MCP server in [Step 17](17-add-mcp-tools.md), `create_issue_comment` is already available. If not, complete Step 17 first.

### 4. Commit and push your changes

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to `.github/workflows/daily-status.md` on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Update the `permissions` block and the task brief as described above.
4. Click **Commit changes**.

</details>

Or from the terminal:

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: post daily status summary to tracking issue"
git push
```

### 5. Trigger a manual run and verify

1. In GitHub, go to **Actions → Daily Status Report → Run workflow → Run workflow**.
2. Wait for the run to complete (usually under two minutes).
3. Open your `📊 Daily Status Log` issue — you should see a new comment with the AI-generated summary.

![New comment posted on the tracking issue by the workflow](images/18-issue-comment.svg)

> [!WARNING]
> If no comment appears, check that the issue number in your brief matches the actual issue number, and that `permissions` includes `issues: write`.

## ✅ Checkpoint

- [ ] You have a `📊 Daily Status Log` issue in your repository
- [ ] Your workflow frontmatter includes `issues: write` under `permissions`
- [ ] Your task brief instructs the agent to post a comment on that issue
- [ ] A manual run has completed and the tracking issue has a new AI-generated comment
- [ ] You can explain why `GITHUB_TOKEN` is sufficient here (no PAT needed)

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
