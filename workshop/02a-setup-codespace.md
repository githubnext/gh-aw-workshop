# Adventure A: Set Up a Codespace _(recommended for new users)_

> [!CAUTION]
> **Don't want to use a terminal? Skip here →** Using **GitHub Copilot app**, **GitHub Mobile**, or a **browser-only** setup? You are in the wrong place. Go directly to **[Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md)** — no terminal required.

## Before You Start

Make sure you have:

- A GitHub account (free tier or higher)
- Access to [GitHub Codespaces](side-quest-01-02-environment-reference.md#github-codespaces) on your plan (available on GitHub Free for public repositories and on paid plans)

| Path | Best for | Action |
|------|----------|--------|
| 🌐 Browser / Copilot app / Mobile | No terminal; web UI or mobile preferred | [Skip to Step 3b](03b-create-your-repo-ui.md) |
| ☁️ Codespace | Browser terminal; no local installs | ✅ Continue below |
| 💻 Local terminal | Your own machine and tools | [Switch to Adventure B](02b-setup-local.md) |

## 🎯 What You'll Do

You'll launch a GitHub Codespace for this workshop, open the built-in terminal, and land in a ready-to-use environment for the next step.

## Steps

**Verify you are on the right path before continuing:**

- [ ] I have a GitHub account with access to GitHub Codespaces
- [ ] I want a browser-based terminal and do not need to install tools locally

These steps take about 5 minutes. If you get stuck on any command, [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) is a 2-minute read.

### Open the Codespace

1. Create your own public repository at [github.com/new](https://github.com/new):
   - Name it `my-agentic-workflows`.
   - Check **Add a README file**.
   - Click **Create repository**.
2. In your new repository, click the green **Code** button.
3. Click the **Codespaces** tab.
4. Click **Create codespace on main**.

![Open Codespace](images/02a-open-codespace.svg)

GitHub will spin up a container attached to your practice repository. This takes about 30–60 seconds on first launch.

> [!IMPORTANT]
> **On GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), or using self-hosted runners?** Complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) now before continuing. Skipping it will cause `gh auth status` to fail at the verification step below.

While the Codespace spins up (30–60 seconds), you can read the enterprise side quest.

> [!TIP]
> Codespaces auto-saves your work. If you close the tab, open [github.com/codespaces](https://github.com/codespaces) to resume where you left off.

### Open the Codespace terminal

1. When the Codespace editor loads, open the built-in terminal with **Ctrl+`** (or **Cmd+`** on Mac).
2. Wait for the terminal prompt to appear.
3. Keep this terminal open. It is already inside your practice repository.

If this is your first time in a terminal, see [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) for a quick orientation on navigating folders and running commands.

### Verify your Codespace is ready

The diagram below shows what's inside your Codespace and how it connects to GitHub — everything is pre-installed and pre-authenticated so you can focus on the workshop.

![Codespace environment architecture: your browser connects to a cloud container with pre-installed tools, which communicates with GitHub](images/02a-codespace-architecture.svg)

Run these commands in the Codespace terminal:

```bash
gh --version
gh auth status
gh extension list
```

_What success looks like:_

```text
gh version 2.40.0 (2024-01-01)
...

github.com
  ✓ Logged in to github.com account <your-username> (...)
  ...

(no extensions installed)
```

You should see `gh version 2.40.0` or newer and a line confirming you're logged in to `github.com`. The extension list will be empty at this point — `gh aw` is installed in a later step. Codespaces usually include `gh` already and are often pre-authenticated, but this quick check confirms the environment is ready.

> [!IMPORTANT]
> The Codespace authentication token has a limited set of scopes by default. In particular, it may **not** include `actions:write`, which is required for `gh aw run` to trigger workflows from the terminal (used in [Step 8](08-run-your-workflow.md)). In this workshop, prefer triggering runs from the **GitHub Actions UI** in [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md#trigger-the-workflow-via-github-actions-ui). If you want to use `gh aw run` and hit permission errors, jump to [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md).

## ✅ Checkpoint

- [ ] The Codespace editor is open in your browser
- [ ] The built-in terminal is open in your Codespace
- [ ] `gh --version` returns version 2.40.0 or newer
- [ ] `gh auth status` shows you're logged in to GitHub without errors
- [ ] `gh extension list` runs without errors (the list is empty at this point — `gh aw` is installed in a later step)
- [ ] The Codespace is attached to your `my-agentic-workflows` practice repository

**Next:** [Step 3a: Verify Your Practice Repository — Terminal Path](03a-create-your-repo-terminal.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
