# Step 11a: Build the Daily Repo Status Workflow — GitHub UI Path

> [!NOTE]
> Want incremental compiler feedback? Switch to the [Terminal path](11a-build-daily-status-terminal.md).

## 🎯 What You'll Do

You'll paste a complete daily repository status workflow into the GitHub web editor and commit it in your browser.

## 📋 Before You Start

- You've completed [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- Your practice repository is open on GitHub

## Create the workflow

1. Click **Add file** → **Create new file**.
2. Enter `.github/workflows/daily-status.md` as the filename.
3. Paste the complete file:

   ```markdown
   ---
   emoji: 📊
   description: Post a daily repository status summary as a GitHub issue comment.

   on:
     schedule: daily
     workflow_dispatch: {}

   permissions:
     contents: read
     copilot-requests: write
     issues: read
     pull-requests: read
     actions: read

   tools:
     github:
       mode: gh-proxy
       toolsets: [default]

   safe-outputs:
     add-comment:
       max: 1
   ---

   # Daily Repo Status Report

   You are an AI assistant that monitors this repository and posts a concise daily health report.

   ## Your Task

   Collect and summarize:

   1. **Open pull requests** — count, and flag any open longer than 7 days
   2. **Open issues** — total count, how many are labeled "bug"
   3. **CI status** — result of the most recent workflow run on the default branch
   4. **Last commit** — message and time since it was pushed

   ## Output Format

   Find the most recently updated open issue and post a comment in this format:

   ```
   📊 Daily Repo Status — {today's date}
   ══════════════════════════════════
   🔀 Open pull requests:  {count}
   🐛 Open issues:         {count}  ({bug-count} labeled "bug")
   ✅ CI status:           {passing/failing/unknown}
   📝 Last commit:         "{message}" — {time ago}

   {One sentence of overall health. Flag anything that needs attention.}
   ```

   ## Guidelines

   - Post only one comment. If you have already posted today, skip.
   - Keep the report factual. Do not invent numbers.
   - If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
   ```

4. Select **Commit directly to the `main` branch**.
5. Click **Commit changes**.

> [!NOTE]
> The GitHub UI path skips local compile checkpoints. GitHub Actions compiles the workflow when it runs and reports errors in the run log.

## Understand the guardrails

- `permissions` grants only the repository reads and Copilot request access the workflow needs.
- `tools.github` lets the agent inspect repository data through the scoped proxy.
- `safe-outputs.add-comment.max: 1` limits the workflow to one comment per run.

> [!TIP]
> For future changes, ask an agent with the `agentic-workflows` skill to update the workflow and review its proposed diff.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-status.md` exists
- [ ] The complete workflow is committed to `main`
- [ ] You understand that [compilation](https://github.github.com/gh-aw/reference/compilation-process/) occurs when GitHub Actions runs the workflow
- [ ] You understand the workflow's permissions and output guardrail

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Compilation Process reference](https://github.github.com/gh-aw/reference/compilation-process/)
- [GitHub Tools read permissions](https://github.github.com/gh-aw/reference/permissions/)
