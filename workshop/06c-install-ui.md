# Step 6c: GitHub UI Path — No Installation Needed

> [!NOTE]
> <details>
> <summary>Changed your mind and want a terminal? Switch to [Step 6a: Codespace Terminal](06a-install-terminal.md) or [Step 6b: Local Terminal](06b-install-local.md).</summary>
> </details>

## 🎯 What You'll Do

You'll confirm that the GitHub UI path does not require a local `gh-aw` installation and proceed directly to authoring your first workflow in the browser.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You are signed in to [github.com](https://github.com)
- You have your practice repository ready (from [Step 3b: GitHub UI Path](03b-create-your-repo-ui.md))

## Why no installation is needed

The compiled `.lock.yml` file is what GitHub actually runs. In Step 7b you'll paste the complete compiled workflow directly into the web editor — no local compile step needed. GitHub's infrastructure then executes the compiled workflow when you trigger it from the Actions tab.

![GitHub-hosted execution flow: the learner authors and triggers workflows from a browser; GitHub's infrastructure executes the pre-compiled .lock.yml workflow and runs AI agents entirely](images/06c-github-hosted-execution.svg)

You'll author workflow files using the GitHub web editor in Step 7b and trigger them from the Actions tab in Step 8. You'll confirm `gh-aw` is working when **Hello Agent** appears in your workflow list.

## What to do next

Continue to [Step 7b: Write Your First Agentic Workflow — GitHub UI Path](07b-your-first-workflow-ui.md).

## ✅ Checkpoint

- [ ] You are signed in to github.com
- [ ] You have your practice repository open and ready
- [ ] You understand that the GitHub UI path does not require a local `gh-aw` installation
- [ ] You understand that you will confirm `gh-aw` is working in [Step 8](08-run-your-workflow.md) via the Actions tab

**Next:** [Step 7b: Write Your First Agentic Workflow — GitHub UI Path](07b-your-first-workflow-ui.md)
