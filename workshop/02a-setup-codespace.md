# Adventure A: Set Up a Codespace _(recommended for new users)_

## 📋 Before You Start

Make sure you have completed Step 1, then re-check the items that matter for this path:

- All items in [Prerequisites](01-prerequisites.md) are complete
- A GitHub account you can use to create a public practice repository (free tier is fine)
- Copilot access enabled on your account (verify at [github.com/settings/copilot](https://github.com/settings/copilot))
- Access to [GitHub Codespaces](side-quest-01-02-environment-reference.md#github-codespaces) on your plan (available on GitHub Free for public repositories and on paid plans)

| Path | Best for | Action |
|------|----------|--------|
| 📱 Mobile / Copilot app | No terminal; GitHub Mobile or Copilot app | [Skip to Step 3b](03b-create-your-repo-ui.md) |
| 🤖 Copilot Cloud Agent (CCA) | Browser-only, no local install; CCA chat | [Skip to Step 3b](03b-create-your-repo-ui.md) |
| ☁️ Codespace | Browser terminal; no local installs | ✅ Continue below |
| 💻 Local terminal | Your own machine and tools | [Switch to Adventure B](02b-setup-local.md) |

> [!NOTE]
> GitHub Mobile and Copilot Cloud Agent paths do not require a terminal. Continue on the GitHub UI path and trigger workflows from the Actions tab in your browser.

## Which path is right for you?

Check the statement that matches you best, then follow the link:

- [ ] I want to use GitHub Copilot app, GitHub Mobile, or browser-only — **[Go to Step 3b: GitHub UI Path →](03b-create-your-repo-ui.md)**
- [ ] I want a browser-based terminal with no local installs — ✅ **Continue below (Codespace)**
- [ ] I have a local terminal and want to install tools myself — **[Go to Adventure B: Local Terminal →](02b-setup-local.md)**

## 🎯 What You'll Do

You'll launch a GitHub Codespace for this workshop, open the built-in terminal, and land in a ready-to-use environment for the next step.

## Steps

**Verify you are on the right path before continuing:**

- [ ] I have a GitHub account with access to GitHub Codespaces
- [ ] I want a browser-based terminal and do not need to install tools locally
- [ ] Mobile and CCA users should follow [Step 3b](03b-create-your-repo-ui.md) instead

These steps take about 5 minutes. If you get stuck on any command, [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) is a 2-minute read.

### Open the Codespace

1. Create your own public repository at [github.com/new](https://github.com/new):
   - Name it `my-agentic-workflows`.
   - Check **Add a README file**.
   - Click **Create repository**.
2. In your new repository, click the green **Code** button.
3. Click the **Codespaces** tab.
   - Leave **main** selected as the branch.
   - Click **Create codespace on main**.
   - Wait 30–60 seconds for GitHub to prepare the container and open the editor.

![Open Codespace](images/02a-open-codespace.svg)

> [!IMPORTANT]
> **On GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), or using self-hosted runners?** Complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) now before continuing. Skipping it will cause `gh auth status` to fail at the verification step below.

Codespaces auto-save your work. If you close the tab, open [github.com/codespaces](https://github.com/codespaces) to resume where you left off.

### Open the Codespace terminal

1. When the Codespace editor loads, open the built-in terminal with **Ctrl+`** (or **Cmd+`** on Mac).
2. Wait for the terminal prompt to appear.
3. Keep this terminal open. It is already inside your practice repository.

> [!TIP]
> If the terminal in your Codespace shows a `$` prompt, the container is ready. If you see an error, see [install troubleshooting](side-quest-06-01-install-troubleshooting.md).

If this is your first time in a terminal, see [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) for a quick orientation on navigating folders and running commands.

### Verify your Codespace is ready

The diagram below shows your Codespace connection to GitHub.

![Codespace environment architecture: your browser connects to a cloud container with pre-installed tools, which communicates with GitHub](images/02a-codespace-architecture.svg)

> [!TIP]
> **No terminal? Verify Copilot access via your browser:** Open [github.com/settings/copilot](https://github.com/settings/copilot) — if you see a green checkmark next to your Copilot plan, your access is active. Mobile and Copilot app users can skip straight to [Step 3b](03b-create-your-repo-ui.md).

1. Run these commands in the Codespace terminal:

   ```bash
   gh --version
   gh auth status
   gh extension list
   ```

2. Confirm `gh --version` shows `gh version 2.40.0` or newer.
3. Confirm `gh auth status` shows that you're logged in to `github.com`.
4. Confirm `gh extension list` runs without errors, even if it shows no extensions yet.

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

> [!NOTE]
> <details>
> <summary><b>If <code>gh auth status</code> shows an error:</b></summary>
>
> - **Codespaces on github.com (free/Pro/Team):** run `gh auth login` in the terminal, choose **GitHub.com**, and follow the prompts. Then re-run `gh auth status`.
> - **GHES, GHEC, or EMU:** your token scope may be restricted by organization policy. Open [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.
>
> </details>

<!-- -->

> [!IMPORTANT]
> The Codespace authentication token has a limited set of scopes by default. In particular, it may **not** include `actions:write`, which is required for `gh aw run` to trigger workflows from the terminal (used in [Step 8](08-run-your-workflow.md)). In this workshop, prefer triggering runs from the **GitHub Actions UI** in [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md#trigger-the-workflow-via-github-actions-ui). If you want to use `gh aw run` and hit permission errors, jump to [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md).

## ✅ Checkpoint

- [ ] The Codespace editor is open in your browser
- [ ] The built-in terminal is open in your Codespace
- [ ] `gh --version` returns version 2.40.0 or newer
- [ ] `gh auth status` shows you're logged in to GitHub without errors **OR** Copilot access is verified active at [github.com/settings/copilot](https://github.com/settings/copilot)
- [ ] `gh extension list` runs without errors (the list is empty at this point — `gh aw` is installed in a later step)
- [ ] The Codespace is attached to your `my-agentic-workflows` practice repository
- [ ] I know GitHub Mobile and Copilot app users should continue on [Step 3b](03b-create-your-repo-ui.md)
- [ ] I know Copilot Cloud Agent (CCA) users should continue on [Step 3b](03b-create-your-repo-ui.md)

**Next:** [Step 3a: Verify Your Practice Repository — Terminal Path](03a-create-your-repo-terminal.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
