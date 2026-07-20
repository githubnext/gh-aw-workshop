---
journey: all
adventure: scenario-a
---
# Step 11a: Build — Daily Repo Status Workflow

_You've designed the workflow on paper — now choose how you want to create it._

## 📋 Before You Start

- [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md) is complete and you have a written design for your daily-status workflow.
- You know which build path you will use (terminal, GitHub UI, or Add Wizard).
- Your practice repository exists and you have write access to it.

## 🎯 What You'll Have When You're Done

You'll have `.github/workflows/daily-status.md` committed to your repository and passing `gh aw compile` with no errors. The workflow file will include all required sections — `on:`, `task:`, and at least one data-source — and will be ready to test in Step 12.

## What You'll Build

Every daily-status workflow file has the same three-part skeleton, regardless of which construction path you take:

```
---
on:
  schedule: daily
safe-outputs:
  add-comment: {}
---
## Task

<your agent instructions here>
```

The **frontmatter** (between the `---` fences) declares _when_ the workflow runs (`on: schedule: daily`) and _what write actions_ the agent may take (`safe-outputs`). The **Markdown body** below the closing `---` is the task brief — plain-English instructions the AI agent reads each time it runs. Keeping this structure in mind as you follow any path below will make each section feel familiar rather than arbitrary.

> [!TIP]
> Refer back to the brief you wrote in Step 10a as you build. Each component of your design maps directly to a section of this skeleton.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build each section incrementally and compile for feedback | [Build with the Terminal path](11a-build-daily-status-terminal.md) |
| **GitHub UI path** | Paste the complete workflow and commit it in the browser | [Build with the GitHub UI path](11a-build-daily-status-ui.md) |
| **Add Wizard** | Use an interactive terminal wizard to generate the workflow | [Build with the Add Wizard](11a-build-daily-status-wizard.md) |

All paths produce `.github/workflows/daily-status.md` and converge at Step 12.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-status.md` exists in your repository.
- [ ] Running `gh aw compile` exits with no errors.
- [ ] The workflow file includes the `on:`, `task:`, and at least one data-source section.
- [ ] A commit containing the new workflow file appears in your repository's commit history.

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
**Next:** Continue with your chosen path above.
