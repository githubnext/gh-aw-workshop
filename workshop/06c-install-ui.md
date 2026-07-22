<!-- page-journey: ui -->
<!-- page-adventure: setup -->
# No Installation Needed — GitHub UI Path

## 🎯 What You'll Do

You'll confirm how the browser-only path works, review what GitHub handles for you, and continue to the GitHub Copilot authoring step with no local installation required.

If you decide you want a terminal after all, switch to [Install gh-aw — Codespace Terminal](06a-install-terminal.md) or [Install gh-aw — Local Terminal](06b-install-local.md).

## How this path works

On the GitHub UI path, you do not install `gh-aw` locally. You stay on github.com, author your workflow in the browser, and let GitHub-hosted automation handle compilation and execution.

![GitHub-hosted execution flow for the UI path](images/06c-github-hosted-execution.svg)

In practice, that means:

- You write or review workflow changes in the GitHub web UI.
- An agent helps create the workflow files for you in a pull request.
- GitHub Actions runs the committed lock file on GitHub's infrastructure.

## ✅ Checkpoint

- [ ] You understand that the browser path does not require a local `gh-aw` install
- [ ] You know you can stay on github.com for the rest of this path
- [ ] You are ready to create your first workflow with GitHub Copilot

<!-- journey: ui -->
**Next:** [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md)
<!-- /journey -->
