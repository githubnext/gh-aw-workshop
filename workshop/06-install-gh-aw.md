# Step 6: Install the gh-aw CLI Extension

> [!IMPORTANT]
> **Path reminder:** Keep using the setup path you chose in Step 2.
> - **Path A — Codespace (browser terminal):** continue in your Codespace terminal.
> - **Path B — Local terminal:** continue in your local terminal.
> - **Path C — UI only (Copilot Chat / CCA browser-only mode):** this step's `gh aw` commands require a terminal. If you stay UI-only, skip terminal commands and plan to trigger runs from the **Actions tab** in [Step 8](08-run-your-workflow.md#trigger-manually-via-github-actions-ui).
> **Want to switch from the GitHub UI path to a browser terminal?** Follow [Adventure A: Set Up a Codespace](02a-setup-codespace.md) using your own practice repository. Once it loads, return here and continue with [Check if already installed](#check-if-already-installed).

<!-- Separate adjacent callouts -->

> [!NOTE]
> **No terminal? Skip this step.** If you are using GitHub Copilot Chat, Copilot Cloud Agent (CCA), or prefer not to use a terminal, `gh-aw` runs on GitHub's infrastructure when your workflow executes — no local installation is needed for browser-triggered workflows. Skip to [GitHub UI alternative](#github-ui-alternative) below, then continue to [Step 7](07-your-first-workflow.md).

<!-- Separate adjacent callouts -->

> [!IMPORTANT]
> **Path C (UI only): skip these sections entirely.** If you are staying in browser-only mode (no terminal), do **not** run or follow:
> - [Check if already installed](#check-if-already-installed)
> - [Open a Codespace for CCA users](#open-a-codespace-for-cca-users)
> - [Install from terminal](#install-from-terminal)
> - [Confirm installation](#confirm-installation)
> - [Verify `gh aw` is available](#verify-gh-aw-is-available)
>
> Your install path is already handled for this workshop flow: go straight to [GitHub UI Alternative](#github-ui-alternative), then continue to [Step 7](07-your-first-workflow.md).

## Choose your path

Use the path that matches your tool before you run any install command:

| I am using… | Do this |
| --- | --- |
| **VS Code Copilot extension** | Start here: [Check if already installed](#check-if-already-installed) |
| **GitHub Copilot Cloud Agent (CCA)** | Use the callout above, then [Check if already installed](#check-if-already-installed) |
| Local terminal or standard Codespace terminal | [Install from terminal](#install-from-terminal) |

## GitHub Copilot Cloud Agent walkthrough

For a browser-first walkthrough, see [Side Quest: Use `gh-aw` with the GitHub Copilot Cloud Agent](side-quest-06-02-cca-codespace.md).

<!-- Separate adjacent callouts -->

> [!NOTE]
> **Using the GitHub Copilot cloud agent?** `gh aw` may already be available in
> your environment. Run `gh aw --version` first — if it returns a version number,
> you can skip straight to [Check if already installed](#check-if-already-installed).

<!-- -->

## GitHub UI Alternative

For **Path C (UI only)** — Copilot Chat, CCA, or browser-only — you do not need to install `gh-aw` locally. `gh-aw` runs on GitHub's infrastructure when your workflow executes.

**What to do:**

1. Skip the installation steps on this page.
2. Continue directly to [Step 7b: Write Your First Agentic Workflow — GitHub UI Path](07b-your-first-workflow-ui.md).
3. In [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md), open the **Actions** tab — if **Hello Agent** appears in the workflow list, `gh-aw` is working on GitHub's side. No local installation needed.

**Path C checkpoint for this step:**

- [ ] I understand that Path C (UI only) does not require a local `gh-aw` installation
- [ ] I will confirm `gh-aw` is working by checking the **Actions** tab in [Step 8](08-run-your-workflow.md)

**Next:** [Step 7a: Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md)

---

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed and then install the `gh-aw`
extension so you can compile and run [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory
- You have authenticated the `gh` CLI with `gh auth login`
  (done in [Verify your Codespace is ready](02a-setup-codespace.md#verify-your-codespace-is-ready)
  or [Authenticate the `gh` CLI](02b-setup-local.md#authenticate-the-gh-cli))

Run this now to confirm `gh` is installed and authenticated before continuing:

```bash
gh auth status
```

Expected output: `Logged in to github.com as <your-username>`. If you see an error about `gh` not being installed, return to [Step 1: Prerequisites](01-prerequisites.md). For authentication errors, return to [Verify your Codespace is ready](02a-setup-codespace.md#verify-your-codespace-is-ready) or [Authenticate the `gh` CLI](02b-setup-local.md#authenticate-the-gh-cli).

## Check if already installed

Run this first:

```bash
gh aw --version
```

If you get a version number, skip to [Confirm installation](#confirm-installation).

If the command is not found:

- If you are using the **GitHub Copilot Cloud Agent (CCA)**, first complete [Open a Codespace for CCA users](#open-a-codespace-for-cca-users)
- Then continue with [Install from terminal](#install-from-terminal)

## Open a Codespace for CCA users

Open a Codespace to run install commands in its terminal:

- [Open the Codespace](02a-setup-codespace.md#open-the-codespace)
- Return to this step and continue with [Install from terminal](#install-from-terminal)

Once your Codespace is open, run `gh auth status` to confirm you are logged in before running the install command.

If you get an HTTP 403 error, use [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md#organization-codespace-token-limitation-http-403).

## Install from terminal

> [!TIP]
> **Using VS Code?** Open the integrated terminal with `` Ctrl+` `` (macOS: `` Cmd+` ``),
> then run all `gh aw` commands there. If a command is unfamiliar, try:
> `gh copilot suggest "how do I install a gh extension"`

<!-- -->

> [!IMPORTANT]
> **Pre-flight checklist (run these in order):**
> - ✅ `gh --version` returns output (if not, complete [Step 1 (Prerequisites)](01-prerequisites.md))
> - ✅ `gh auth status` shows `Logged in to github.com as <your-username>` — this was completed in [Step 2: Set Up a Codespace](02a-setup-codespace.md). If not, go back and complete that auth step before continuing.

<!-- -->

Install the extension with:

```bash
gh extension install github/gh-aw
```

> [!TIP]
> Getting a `403 Forbidden` error? Your org token may not allow public extension installs. Use the fallback installer:
> ```bash
> curl -fsSL https://github.com/github/gh-aw/releases/latest/download/install.sh | sh
> ```
> Need more context? See [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md).

If the extension is already installed, you can update it instead:

```bash
gh extension upgrade github/gh-aw
```

### Confirm installation

```bash
gh extension list
```

You should see an entry for `github/gh-aw`.

### Verify `gh aw` is available

```bash
gh aw --version
```

Example success output:

```text
gh-aw version 0.81.6
```

## Troubleshooting

Most installs work on the first try after `gh auth status` and `gh extension install github/gh-aw`.
If you hit auth, proxy, GHES hostname, or locked-down-network errors, use the optional troubleshooting side quest.

> [!TIP]
> Need copy-paste fixes? Open [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md), then come back here.

## ✅ Checkpoint

- [ ] `gh auth status` shows you are logged in to github.com
- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install github/gh-aw` succeeded (or the fallback install succeeded if you encountered a 403 error)
- [ ] `gh extension list` shows `github/gh-aw`
- [ ] `gh aw --version` returns a version number (e.g. `gh-aw version 0.81.6` or later)

Want to understand how Copilot authenticates with your workflow — or set up a `COPILOT_GITHUB_TOKEN` secret?
➡️ **[Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md)**

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
