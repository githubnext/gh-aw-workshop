# Step 11c: Build the PR Code Reviewer — Terminal Path

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write `pr-code-reviewer.md`, place it in `.github/workflows/`, and compile it. By the end you'll have a working workflow that triggers automatically on every pull request.

## 📋 Before You Start

- You've completed [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
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

### Add the frontmatter

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

Below the closing `---`, keep this heading, then replace the placeholder line with
your final starter brief from
[Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md#a-ready-to-use-starter-brief):

```markdown
# PR Code Review: Duplicate Code Detection

[Paste the full Step 10c starter brief here, replacing this line.]
```

### Commit and push

```bash
git add .github/workflows/pr-code-reviewer.md
git commit -m "feat: add pr code reviewer agentic workflow"
git push
```

## ✅ Checkpoint

- [ ] `.github/workflows/pr-code-reviewer.md` exists in your repository
- [ ] `gh aw compile` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

> [!NOTE]
> The PR reviewer triggers on `pull_request`, so [Step 13: Schedule It to Run Every Day](13-schedule-it.md) does not apply. Jump straight to [Step 14: What's Next?](14-next-steps.md), or go to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) to practice reading the run log.

**Previous:** [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools, Imports, and Permissions reference](https://github.github.com/gh-aw/reference/tools/)
