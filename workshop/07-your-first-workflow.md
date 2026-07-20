<!-- page-journey: all -->
<!-- page-adventure: core -->
# Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create `.github/workflows/daily-report-status.md`, a small workflow that reads repository issues and posts one controlled response.

## 📋 Before You Start

- Completed [Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command is available in your terminal, or you can open GitHub Copilot for a browser-based session
- If you are using the Terminal path, `gh aw init` has been run and pushed in your practice repository

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build the workflow incrementally in two short parts, compile after each meaningful change, then commit and push | [Write the workflow with the Terminal path](07a-your-first-workflow-terminal.md) |
| **GitHub Copilot path** | Ask an agent in GitHub Copilot or the repository's **Agents** tab to create and validate the workflow, then review and merge its pull request | [Write the workflow with GitHub Copilot](07c-your-first-workflow-copilot.md) |

The Terminal path gives you early compiler feedback. The GitHub Copilot path delegates `gh aw compile` to the agent's session workspace, so browser-first learners can still complete this step without a local terminal.

<!-- journey: codespace,local,terminal -->
Continue with [Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
Continue with [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md).
<!-- /journey -->

Both paths create the same source-and-compiled workflow pair shown below.

![Diagram showing how daily-report-status.md is compiled by gh aw compile into daily-report-status.lock.yml which GitHub Actions then executes](images/07-compile-flow.svg)
