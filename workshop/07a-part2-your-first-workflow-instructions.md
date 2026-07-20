<!-- page-journey: terminal -->
<!-- page-adventure: core -->
# Add Instructions and Finish the Workflow — Terminal Path

_You now have a valid starter file. In this part, you complete it and push it._

## 🎯 What You'll Do

You'll finish `.github/workflows/daily-report-status.md` by adding:

- `permissions` and `safe-outputs` in frontmatter
- a `## Task` instructions block below frontmatter
- a [compile](https://github.github.com/gh-aw/reference/compilation-process/) check, commit, and push

## 📋 Before You Start

- Completed [Part 1](07a-your-first-workflow-terminal.md)
- `gh aw compile` already passes once

## Steps

Each section of your workflow file serves a distinct purpose at runtime — the diagram below shows what each part controls.

### Add `permissions` and `safe-outputs`

In `.github/workflows/daily-report-status.md`, update frontmatter so it looks like this:

```yaml
---
name: Daily Report Status
on:
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
safe-outputs:
  create-issue:
---
```

### Add your task instructions

Below the closing `---`, add:

```markdown
Generate an activity report in a new issue.
```

### Validate, then commit and push

Run:

```bash
gh aw compile
```

Optional while editing: `gh aw compile --watch`.

Then commit and push:

```bash
git add .github/workflows/daily-report-status.md
git commit -m "Add daily-report-status agentic workflow"
git push
```

For follow-up edits, prefer asking an agent to update workflows with the `agentic-workflows` skill instead of hand-editing every line.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-report-status.md` includes `permissions` with `copilot-requests: write`
- [ ] `gh aw compile` reports valid
- [ ] The file is committed and pushed to `main`
- [ ] You are ready to choose the workflow's billing and authentication method

<!-- journey: terminal -->
**Next:** [Confirm Model Access](07d-confirm-model-access.md)
<!-- /journey -->
