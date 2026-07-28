<!-- page-journey: all -->
<!-- page-adventure: core -->
<!-- learning:false -->
# Install the gh-aw CLI Extension

`gh-aw` is the CLI extension that compiles your [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) Markdown files and triggers runs from your terminal.

> [!NOTE]
> Using your own machine instead? Take the optional [Install `gh-aw` in a Local Terminal side quest](side-quest-06-04-install-local.md).

## :dart: What You'll Do

You'll verify the `gh` CLI is authenticated, install the `gh-aw` extension, and run one quick diagnostic to confirm your Codespace terminal is ready for [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) setup.

## :clipboard: Before You Start

- You've completed [What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You have a Codespace terminal open (from [Set Up a Codespace](02a-setup-codespace.md))

Run this to confirm `gh` is authenticated before continuing:

```bash
gh auth status
```

Expected output: `Logged in to github.com as <your-username>`. If you see an error, return to [Verify your Codespace is ready](02a-setup-codespace.md#verify-your-codespace-is-ready).

## Install from terminal

Check whether `gh-aw` is already installed, then install or update accordingly:

```bash
gh aw --version
```

- **Version shown?** Update the extension: `gh extension upgrade github/gh-aw`
- **Command not found?** Install using the install script:

```bash
curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
gh aw --version
```

You should see output like `gh-aw version 0.81.6`.

> [!NOTE]
> Outside of Codespaces, you can also install with `gh extension install github/gh-aw`.
> In org-owned Codespaces the GitHub token is scoped to the org and cannot access the extension marketplace, so the curl script is the reliable path.

Need more help? See [Side Quest: Install gh-aw Troubleshooting](side-quest-06-01-install-troubleshooting.md).

## Run a quick diagnostic

```bash
gh aw doctor
```

This verifies your GitHub CLI authentication using the same setup checks `gh-aw` expects before later authoring and compile steps.

Expected result: a success message confirming GitHub CLI authentication. If it fails, use [Side Quest: Install gh-aw Troubleshooting](side-quest-06-01-install-troubleshooting.md), then rerun `gh aw doctor`.

## Initialize [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) skills

Before you author your first workflow, initialize and push the generated skill files:

```bash
gh aw init
git add .
git commit -m "Initialize agentic workflow skills"
git push
```

This creates several files needed for agentic workflow authoring:
`.github/skills/agentic-workflows/SKILL.md`,
`.github/skills/agentic-workflow-designer/SKILL.md`,
`.github/agents/agentic-workflows.md`, `.github/mcp.json`,
`.github/workflows/copilot-setup-steps.yml`, and `.vscode/settings.json`.

## :running_man: Try It

Run `gh aw --help` and scan the list of sub-commands.

Which one sub-command do you expect to use in Step 7 when you create and run your first workflow?

Want to understand how Copilot authenticates with your workflow?
:arrow_right: **[Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md)**

<!-- journey: all -->
**Next:** [Write Your First Agentic Workflow](07-your-first-workflow.md)
<!-- /journey -->
