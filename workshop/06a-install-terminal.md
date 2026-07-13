# Step 6a: Install gh-aw — Codespace Terminal

> [!NOTE]
> Using a local terminal instead? Switch to [Step 6b: Install gh-aw — Local Terminal](06b-install-local.md).

## 🎯 What You'll Do

You'll verify the `gh` CLI is authenticated, check whether `gh-aw` is already installed, install it if needed, and confirm the extension is working in your Codespace terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You have a Codespace terminal open (from [Step 2a: Set Up a Codespace](02a-setup-codespace.md))
- The `gh` CLI is authenticated in your Codespace

> [!NOTE]
> **GitHub Copilot Cloud Agent (CCA) users:** If you don't have a Codespace terminal open yet, complete [Side Quest: Use gh-aw with the GitHub Copilot Cloud Agent](side-quest-06-02-cca-codespace.md) first, then return here.

Run this to confirm `gh` is authenticated before continuing:

```bash
gh auth status
```

Expected output: `Logged in to github.com as <your-username>`. If you see an error, return to [Step 2a: Verify your Codespace is ready](02a-setup-codespace.md#verify-your-codespace-is-ready).

## Check if already installed

Run:

```bash
gh aw --version
```

If you get a version number, skip to [Confirm installation](#confirm-installation).

## Install the extension

```bash
gh extension install github/gh-aw
```

> [!TIP]
> Getting a `403 Forbidden` error? Your org token may not allow public extension installs. Use the fallback installer:
> ```bash
> curl -fsSL https://github.com/github/gh-aw/releases/latest/download/install.sh | sh
> ```
> Need more help? See [Side Quest: Install gh-aw Troubleshooting](side-quest-06-01-install-troubleshooting.md).

If the extension is already installed, update it instead:

```bash
gh extension upgrade github/gh-aw
```

## Confirm installation

```bash
gh extension list
```

You should see an entry for `github/gh-aw`.

## Verify gh aw is available

```bash
gh aw --version
```

Example success output:

```text
gh-aw version 0.81.6
```

## ✅ Checkpoint

- [ ] `gh auth status` shows you are logged in to github.com
- [ ] `gh --version` returns a version number
- [ ] `gh extension install github/gh-aw` succeeded (or the fallback install succeeded)
- [ ] `gh extension list` shows `github/gh-aw`
- [ ] `gh aw --version` returns a version number

Want to understand how Copilot authenticates with your workflow?
➡️ **[Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md)**

**Next:** [Step 7a: Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md)
