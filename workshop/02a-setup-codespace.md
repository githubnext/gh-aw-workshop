# Adventure A: Set Up a Codespace _(recommended for new users)_

**New to terminals, but want compiler feedback?** A Codespace gives you a browser-based terminal with the tools you need and no local installation.

## Which path is right for me?

> [!IMPORTANT]
> Ask yourself:
> 1. **Do you have a terminal available?**
> 2. **Are you using GitHub Copilot Chat or the GitHub web UI only?**
> 3. **If you have a terminal, do you prefer a browser terminal or your local machine?**
> Choose one path and keep it through Step 8.
> - **Terminal path — Codespace:** recommended for beginners who want compile feedback. ✅ **You're in the right place.**
> - **Terminal path — local:** for learners with `gh` installed locally. ➡️ [Set Up Your Local Terminal](02b-setup-local.md)
> - **GitHub UI path:** for browser-only learners. ➡️ [Create Your Repository in the GitHub UI](03b-create-your-repo-ui.md)

Adventure A is the **recommended, no-local-install path** for **GitHub Codespaces**, **VS Code (integrated terminal in Codespaces)**, and **GitHub Copilot Cloud Agent (CCA)** users.

_A Codespace gives you a full development environment in your browser — no installs, no version conflicts, just you and the workshop._

## 🎯 What You'll Do

You'll launch a GitHub Codespace for this workshop, open the built-in terminal, and land in a ready-to-use environment for the next step.

## Steps

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

> [!NOTE]
> **Using GitHub Enterprise Server (GHES) or GitHub Enterprise Cloud (GHEC)?** Review [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.

<!-- -->

> [!TIP]
> Codespaces auto-saves your work. If you close the tab, open [github.com/codespaces](https://github.com/codespaces) to resume where you left off.

### Open the Codespace terminal

1. When the Codespace editor loads, open the built-in terminal with **Ctrl+`** (or **Cmd+`** on Mac).
2. Wait for the terminal prompt to appear.
3. Keep this terminal open. It is already inside your practice repository.

> [!TIP]
> **First time in a terminal?** A blank prompt is normal. Try:
> - `pwd` → prints your current folder path
> - `ls` → lists files and folders in the current location
> - `cd workshop` → moves into the `workshop` folder
> - `cd ..` → moves back up one folder
> - `git status` → shows `On branch main` and whether your working tree is clean

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

You should see `gh version 2.40.0` or newer and a line confirming you're logged in to `github.com`. The extension list will be empty at this point — `gh aw` is installed in a later step.

> [!NOTE]
> Codespaces usually include `gh` already and are often pre-authenticated, but this quick check confirms the environment is ready before you create your practice repository or install `gh-aw`.

<!-- -->

> [!IMPORTANT]
> The Codespace authentication token has a limited set of scopes by default. In particular, it may **not** include `actions:write`, which is required for `gh aw run` to trigger workflows from the terminal (used in [Step 8](08-run-your-workflow.md)). In this workshop, prefer triggering runs from the **GitHub Actions UI** in [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md#trigger-manually-via-github-actions-ui). If you want to use `gh aw run` and hit permission errors, jump to [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md).

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
