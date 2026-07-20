<!-- journey: ui -->
<!-- adventure: scenario-c -->
# Build the PR Code Reviewer — GitHub UI Path

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
     add-comment:
       max: 5
   ---

   # PR Code Review: Duplicate Code Detection

   You are an AI code reviewer. When a pull request is opened or updated, check the changed files for duplicate code patterns — both within the PR diff and against the existing codebase.

   ## Your Task

   1. **List changed files** — get the list of files modified in this pull request
   2. **Read the diff** — retrieve the added and modified lines for each changed file
   3. **Sample the codebase** — read existing source files in the same directories as the changed files (up to ten files per directory) to use as a comparison baseline
   4. **Identify duplicates** — look for blocks of five or more lines in the diff that appear with minor variations elsewhere in the changed files or in the sampled existing files

   ## Output Format

   Post a PR review comment with this structure:

   ```
   🔍 Duplicate Code Review
   ════════════════════════
   Files reviewed: {count changed files} changed, {count existing files} sampled
   Findings: {count}

   {For each finding, up to five:}
   📋 **Possible duplicate** in `{file}` (lines {start}–{end})
      Similar to: `{other file or location}`
      Suggestion: {one sentence — e.g. extract to a shared helper, or confirm intentional copy}

   {If no findings:}
   ✅ No significant code duplication detected in this PR.
   ```

   ## Guidelines

   - Post at most five findings. If there are more, add a note: "Additional findings omitted — showing top 5 by similarity."
   - Do not approve or request changes on the PR — only add a comment.
   - Do not flag: comments, blank lines, import/require statements, licence headers, or boilerplate.
   - If the PR touches only documentation, configuration, or lock files, reply: "No source code changes to review."
   - Keep each finding description under 50 words.
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
- [ ] You understand that [compilation](https://github.github.com/gh-aw/reference/compilation-process/) occurs when GitHub Actions runs the workflow
- [ ] You understand the workflow's [permissions](https://github.github.com/gh-aw/reference/permissions/) and five-comment limit

**Previous:** [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
<!-- journey: ui -->
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/), [Triggers reference](https://github.github.com/gh-aw/reference/triggers/), [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [Tools reference](https://github.github.com/gh-aw/reference/tools/), [Compilation Process reference](https://github.github.com/gh-aw/reference/compilation-process/), and [Permissions reference](https://github.github.com/gh-aw/reference/permissions/).

