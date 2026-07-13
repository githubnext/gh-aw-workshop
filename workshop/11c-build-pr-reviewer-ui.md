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
3. Paste the complete file:

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
     add-pr-review-comment:
       max: 5
   ---

   # PR Code Review: Duplicate Code Detection

   Review changed files for duplicate code patterns within the diff and against nearby existing code.

   ## Your Task

   1. List changed files and read their diffs.
   2. Sample relevant existing source files.
   3. Identify repeated blocks of five or more lines.
   4. Report no more than five high-confidence findings.

   ## Guidelines

   - Do not approve or request changes.
   - Ignore comments, imports, licence headers, and boilerplate.
   - If the PR has no source changes, say so.
   - Keep each finding under 50 words.
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
