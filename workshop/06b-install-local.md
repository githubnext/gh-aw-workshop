# Step 6b: Install gh-aw — Local Terminal

> [!NOTE]
> Using a Codespace instead? Switch to [Step 6a: Install gh-aw — Codespace Terminal](06a-install-terminal.md).

## 🎯 What You'll Do

You'll verify the `gh` CLI is authenticated, install the `gh-aw` extension, and confirm it is working in your local terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You've completed [Adventure B: Set Up Your Local Terminal](02b-setup-local.md)
- The `gh` CLI is installed and authenticated (completed in [Authenticate the `gh` CLI](02b-setup-local.md#authenticate-the-gh-cli))

Run this to confirm `gh` is authenticated before continuing:

```bash
gh auth status
```

Expected output: `Logged in to github.com as <your-username>`. If you see an error about `gh` not being installed, return to [Step 1: Prerequisites](01-prerequisites.md). For authentication errors, return to [Authenticate the `gh` CLI](02b-setup-local.md#authenticate-the-gh-cli).

## Install from terminal

Check whether `gh-aw` is already installed, then install or update accordingly:

```bash
gh aw --version
```

- **Version shown?** Update the extension: `gh extension upgrade github/gh-aw`
- **Command not found?** Install the extension (open your terminal — in [VS Code](side-quest-01-02-environment-reference.md#visual-studio-code-vs-code) use `` Ctrl+` `` / `` Cmd+` ``):

```bash
gh extension install github/gh-aw
```

<details>
<summary>Troubleshooting: 403 Forbidden on install</summary>

Your org token may not allow public extension installs. Use the fallback installer:

```bash
curl -fsSL https://github.com/github/gh-aw/releases/latest/download/install.sh | sh
```

Need more help? See [Side Quest: Install gh-aw Troubleshooting](side-quest-06-01-install-troubleshooting.md).

</details>

Verify the extension is ready:

```bash
gh aw --version
```

You should see output like `gh-aw version 0.81.6`.

## 🏃 Try It

Run `gh aw --help` and scan the list of sub-commands.

Which one sub-command do you expect to use in Step 7 when you create and run your first workflow?

## ✅ Checkpoint

- [ ] `gh auth status` shows you are logged in to github.com
- [ ] `gh aw --version` returns a version number
- [ ] You can name one `gh aw` sub-command from `gh aw --help`

Want to understand how Copilot authenticates with your workflow?
➡️ **[Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md)**

**Next:** [Step 7a: Write Your First Agentic Workflow — Terminal Path](07a-your-first-workflow-terminal.md)
