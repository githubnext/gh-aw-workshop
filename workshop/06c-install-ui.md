<!-- page-journey: ui,copilot -->
<!-- page-adventure: setup -->
# GitHub UI Path — No Installation Needed

On the GitHub UI path, `gh-aw` does not need to be installed locally.
A GitHub Copilot agent handles workflow compilation in an isolated session workspace,
and GitHub Actions executes the committed [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml).

## 🎯 What You'll Do

You'll confirm your repository is ready and verify that GitHub Copilot is available, then move on to authoring your first workflow entirely from the browser.

## 📋 Before You Start

- You've completed [What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You created the `my-agentic-workflows` repository on [github.com/new](https://github.com/new) (from [Prerequisites](01-prerequisites.md))

## Confirm your repository

Open your practice repository at `https://github.com/<your-username>/my-agentic-workflows`.

Confirm it has a `README.md` file at the root. If it is empty or missing, add one using the GitHub UI before continuing.

## Verify GitHub Copilot access

Open [github.com/settings/copilot](https://github.com/settings/copilot) and confirm:

- **Copilot is enabled** for your account
- At least one **Model is available**

You will use the **Copilot** or **Agents** tab on your practice repository to author and compile your first workflow in Step 7.

> [!NOTE]
> You do not need to run any terminal commands on this path. The Copilot agent compiles the workflow and opens a pull request for you to review and merge.

## ✅ Checkpoint

- [ ] Your `my-agentic-workflows` repository exists on github.com
- [ ] The repository has a `README.md` file
- [ ] GitHub Copilot is enabled and at least one model is available

<!-- journey: ui,copilot -->
**Next:** [Write Your First Agentic Workflow — GitHub Copilot Path](07c-your-first-workflow-copilot.md)
<!-- /journey -->
