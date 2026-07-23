<!-- page-journey: all -->
<!-- page-adventure: core -->
<!-- learning:false -->
# Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create `.github/workflows/daily-report-status.md`, a small workflow that reads repository issues and posts one controlled response.

In either path, you'll start with `daily-report-status.md` and end with `daily-report-status.lock.yml`, the compiled workflow that GitHub Actions runs.

![Diagram showing how daily-report-status.md is compiled by gh aw compile into daily-report-status.lock.yml which GitHub Actions then executes](images/07-compile-flow.svg)

## 📋 Before You Start

- Completed [Install the gh-aw CLI Extension](06-install-gh-aw.md)
- You can use `gh aw` in a terminal or open GitHub Copilot for a browser-based session

> [!IMPORTANT]
> **Verify Copilot access before you create your workflow.** Open the **Agents** tab in your repository and send: `What is GitHub Actions? Reply in one sentence.` If you receive a reply, you are ready. If you see an error, go to [github.com/settings/copilot](https://github.com/settings/copilot) to confirm Copilot is enabled, then see [Confirm Model Access](07d-confirm-model-access.md) for detailed troubleshooting. A model-access problem will cause your first run in Step 8 to fail — fix it now.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build the workflow incrementally in two short parts, compile after each meaningful change, then commit and push | [Write the workflow with the Terminal path](07a-your-first-workflow-terminal.md) |
| **GitHub Copilot path** | Ask an agent in GitHub Copilot or the repository's **Agents** tab to create and validate the workflow, then review and merge its pull request | [Write the workflow with GitHub Copilot](07c-your-first-workflow-copilot.md) |

The Terminal path gives you early compiler feedback. The GitHub Copilot path delegates `gh aw compile` to the agent's session workspace, so browser-first learners can still complete this step without a local terminal.

<!-- journey: codespace,local,terminal -->
**Next:** [Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md)
<!-- /journey -->
<!-- journey: ui,copilot -->
**Next:** [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md)
<!-- /journey -->
