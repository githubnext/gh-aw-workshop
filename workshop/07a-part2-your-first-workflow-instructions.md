<!-- page-journey: terminal -->
<!-- page-adventure: core -->
# Add Instructions and Finish the Workflow

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

### Update workflow content with Copilot

In Copilot Chat (Agent mode), run this prompt:

```text
/agentic-workflows update `.github/workflows/daily-report-status.md` so it includes:
- frontmatter name: Daily Report Status
- on.workflow_dispatch
- permissions: contents read, issues read, copilot-requests write
- safe-outputs with key `create-issue`
- markdown body text: "Generate an activity report in a new issue."
```

Review the agent's edit, then continue. Prefer this path over hand-editing each line.

### Validate, then commit and push

Run:

```bash
gh aw compile
```

Optional while editing: `gh aw compile --watch`.

Then commit and push:

```bash
git add .
git commit -m "Add daily-report-status agentic workflow"
git push
```

For follow-up edits, keep using an agent with the `agentic-workflows` skill and avoid manual workflow editing unless you are debugging a specific line-level issue.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-report-status.md` includes `permissions` with `copilot-requests: write`
- [ ] `gh aw compile` reports valid
- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed and pushed to `main`
- [ ] You are ready to choose the workflow's billing and authentication method

<!-- journey: terminal -->
**Next:** [Confirm Model Access](07d-confirm-model-access.md)
<!-- /journey -->
