<!-- page-journey: all -->
<!-- page-adventure: core -->
# Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create `.github/workflows/daily-report-status.md`, a small workflow that reads repository issues and posts one controlled response.

## 📋 Before You Start

- Completed [Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command is available in your terminal, or you have browser access to GitHub Copilot or the repository's **Agents** tab
- If you are using the Terminal path, `gh aw init` has been run and pushed in your practice repository
- If you skipped the Copilot access check in Step 1, complete [Confirm Model Access](07d-confirm-model-access.md) before choosing your path.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build the workflow incrementally in two short parts, compile after each meaningful change, then commit and push | [Write the workflow with the Terminal path](07a-your-first-workflow-terminal.md) |
| **GitHub Copilot path** | Ask an agent in GitHub Copilot or the repository's **Agents** tab to create and validate the workflow, then review and merge its pull request | [Write the workflow with GitHub Copilot](07c-your-first-workflow-copilot.md) |

The Terminal path gives you early compiler feedback. The GitHub Copilot path delegates `gh aw compile` to the agent's session workspace, so browser-first learners can still complete this step without a local terminal.

Both authoring paths converge at [Confirm Model Access](07d-confirm-model-access.md) before you run the workflow.

<!-- journey: codespace,local,terminal -->
Continue with [Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
Continue with [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md).
<!-- /journey -->

![Diagram showing how daily-report-status.md is compiled by gh aw compile into daily-report-status.lock.yml which GitHub Actions then executes](images/07-compile-flow.svg)

## Before You Continue

In one sentence, where will you manually start the first `workflow_dispatch` run in your chosen path?

## ✅ Checkpoint

- [ ] You chose one path (Terminal or GitHub Copilot) and are ready to follow that step
- [ ] You can explain in one sentence how `daily-report-status.md` differs from `daily-report-status.lock.yml`
- [ ] You know the compile command for an agentic workflow file: `gh aw compile`
- [ ] You know the compiled file location: `.github/workflows/daily-report-status.lock.yml`

<!-- journey: codespace,local,terminal -->
**Next:** [Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md)
<!-- /journey -->
<!-- journey: ui,copilot -->
**Next:** [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md)
<!-- /journey -->
