# Step 11c: Build the PR Code Reviewer — GitHub UI Path

> [!NOTE]
> Want incremental compiler feedback? Switch to the [Terminal path](11c-build-pr-reviewer-terminal.md).

## 🎯 What You'll Do

You'll paste a complete pull request reviewer workflow into the GitHub web editor and commit it in your browser.

## 📋 Before You Start

- You've completed [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
- Your practice repository is open on GitHub

## Create the workflow

1. Click **Add file** → **Create new file**.
2. Enter `.github/workflows/pr-code-reviewer.md` as the filename.
3. Paste this workflow template. In the template below, replace the exact placeholder
   line `[Paste the full Step 10c starter brief here, replacing this line.]` with your final starter brief from
   [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md#a-ready-to-use-starter-brief):

   ```markdown
   ---
   emoji: 🔍
   description: Review pull requests for duplicate code and post a structured review comment.

   on:
     pull_request: {}
     workflow_dispatch: {}

   permissions:
     contents: read
     copilot-requests: write
     pull-requests: write

   tools:
     github:
       mode: gh-proxy
       toolsets: [default]

   safe-outputs:
     add-comment:
       max: 5
   ---

   # PR Code Review: Duplicate Code Detection

   [Paste the full Step 10c starter brief here, replacing this line.]
   ```

4. Select **Commit directly to the `main` branch**.
5. Click **Commit changes**.

> [!NOTE]
> The GitHub UI path skips local compile checkpoints. GitHub Actions compiles the workflow when it runs and reports errors in the run log.

## Understand the guardrails

- The workflow can read repository files and post pull request review comments.
- The GitHub tool uses the scoped proxy.
- `safe-outputs` limits each run to five comments.

## ✅ Checkpoint

- [ ] `.github/workflows/pr-code-reviewer.md` exists
- [ ] The complete workflow is committed to `main`
- [ ] You understand that compilation occurs when GitHub Actions runs the workflow
- [ ] You understand the workflow's permissions and five-comment limit

**Previous:** [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
