<!-- page-journey: ui -->
<!-- page-adventure: setup -->
# GitHub UI Path — No Installation Needed

> [!NOTE]
> Changed your mind and want a terminal? Switch to [Codespace Terminal](06a-install-terminal.md) or [Local Terminal](06b-install-local.md).

## 🎯 What You'll Do

You'll confirm that the GitHub UI path does not require a local `gh-aw` installation and proceed to the browser-based GitHub Copilot authoring path.

## 📋 Before You Start

- You've completed [What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You are signed in to [github.com](https://github.com)
- You have your practice repository ready (from [GitHub UI Path](02a-setup-codespace.md))

## Why no installation is needed

The compiled `.lock.yml` file is what GitHub actually runs. In Step 7 you'll ask GitHub Copilot or the repository's **Agents** tab to create and validate the workflow in a browser-based session, so no local compile step is needed. GitHub's infrastructure then executes the committed workflow files when you trigger them from the Actions tab.

![GitHub-hosted execution flow: the learner authors and triggers workflows from a browser; GitHub's infrastructure executes the pre-compiled .lock.yml workflow and runs AI agents entirely](images/06c-github-hosted-execution.svg)

You'll author workflow files with GitHub Copilot or the repository's **Agents** tab in Step 7c and trigger them from the Actions tab in Step 8. You'll confirm `gh-aw` is working when **Daily Report Status** appears in your workflow list.

## Triggering your workflow from the browser

CCA and mobile learners are already authenticated — you signed in to GitHub to reach this step. No additional authentication or terminal is needed.

After you merge the workflow pull request from [Step 7c](07c-your-first-workflow-copilot.md) or complete a later browser-first step, navigate to the **Actions** tab in your repository, select the workflow name in the sidebar, and click **Run workflow**. You do not need `gh aw run`.

If you want a browser-only scenario with no terminal, [Adventure E in Step 10](07c-your-first-workflow-copilot.md) walks you through using the Agentic Workflows agent (Copilot app or Agents tab) to create, compile, and commit a daily status workflow — no terminal required at any stage.

## What to do next

<!-- journey: ui -->
Continue to [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md).
<!-- /journey -->

## ✅ Checkpoint

- [ ] You are signed in to github.com
- [ ] You have your practice repository open and ready
- [ ] You understand that the GitHub UI path does not require a local `gh-aw` installation
- [ ] You understand that you will confirm `gh-aw` is working in [Step 8](08-run-your-workflow.md) via the Actions tab
- [ ] You know that CCA and mobile learners can trigger workflows from the **Actions** tab without `gh aw run`

<!-- journey: ui -->
**Next:** [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md)
<!-- /journey -->

