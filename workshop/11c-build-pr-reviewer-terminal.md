<!-- page-journey: terminal -->
<!-- page-adventure: scenario-c -->
# Build the PR Code Reviewer — Terminal Path

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write `pr-code-reviewer.md`, place it in `.github/workflows/`, and compile it. By the end you'll have a working workflow that triggers automatically on every pull request.

## 📋 Before You Start

- You've completed [Design — PR Code Reviewer](10c-design-pr-reviewer.md)
- Your terminal is inside your practice repository
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

> [!NOTE]
> Want to work in the browser? Switch to the [GitHub UI path](11c-build-pr-reviewer-ui.md).

---

## What's Different About This Workflow?

The daily-status workflow runs on `on: schedule`. This one runs on `on: pull_request` — it fires automatically when someone opens or updates a PR. Everything else (tools, safe-outputs, agent instructions) works the same way.

For a deeper look at available trigger options, see [Side Quest: Event-Driven Triggers](side-quest-11-05-event-triggers.md).

---

## Build the Workflow

### Create and populate the file

```bash
mkdir -p .github/workflows
```

Open your editor and create `.github/workflows/pr-code-reviewer.md`. Run `gh aw compile` after saving to validate.

### Add the [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/)

```yaml
---
emoji: 🔍
description: Review pull requests for duplicate code and post a structured review comment.

on:
  pull_request: {}      # fires on PR open and update
  workflow_dispatch: {} # manual run button for testing

permissions:
  contents: read        # read repo files
  copilot-requests: write

tools:
  github:
    mode: gh-proxy
    toolsets: [default]

safe-outputs:
  add-comment:
    max: 5  # limits comments per run to prevent flooding PRs with excessive findings
---
```

> [!TIP]
> `safe-outputs: add-comment: max: 5` caps the volume of PR comments at five per run. For more on permission scoping and output guardrails, see [Side Quest: Frontmatter — Tools and Outputs](side-quest-11-08-frontmatter-tools-outputs.md).

### Add the agent instructions

Below the closing `---`, add the Markdown task brief:

```markdown
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
- Do not flag: comments, blank lines, import/require statements, licence headers, or boilerplate (e.g. `package main`, `if __name__ == "__main__"`).
- If the PR touches only documentation, configuration, or lock files, reply: "No source code changes to review."
- Keep each finding description under 50 words.
```

### Commit and push

```bash
git add .github/workflows/pr-code-reviewer.md
git commit -m "feat: add pr code reviewer agentic workflow"
git push
```

---

## Complete Workflow (Reference Copy)

<details>
<summary>Complete workflow file</summary>

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
- Do not flag: comments, blank lines, import/require statements, licence headers, or boilerplate (e.g. `package main`, `if __name__ == "__main__"`).
- If the PR touches only documentation, configuration, or lock files, reply: "No source code changes to review."
- Keep each finding description under 50 words.
```

</details>

## ✅ Checkpoint

- [ ] `.github/workflows/pr-code-reviewer.md` exists in your repository
- [ ] `gh aw compile` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

> [!NOTE]
> The PR reviewer triggers on `pull_request`, so [Schedule It to Run Every Day](13-schedule-it.md) does not apply. Jump straight to [What's Next?](14-next-steps.md), or go to [Test and Improve Your Workflow](12-test-and-iterate.md) to practice reading the run log.

**Previous:** [Design — PR Code Reviewer](10c-design-pr-reviewer.md)
<!-- journey: terminal -->
**Next:** [Test and Improve Your Workflow](12-test-and-iterate.md)
<!-- /journey -->


