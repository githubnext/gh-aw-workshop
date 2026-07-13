# Step 6: Install the gh-aw CLI Extension

> [!IMPORTANT]
> **No terminal open yet?** If you're using the **GitHub Copilot Cloud Agent (CCA)** or prefer a browser, launch a Codespace first:
> [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/githubnext/gh-aw-workshop)
> Once your Codespace loads, return here and continue with [Install from terminal](#install-from-terminal).

## Choose your path

Use the path that matches your tool before you run any install command:

| I am using… | Do this |
| --- | --- |
| Cloud agent or VS Code Copilot extension | [Check if already installed](#check-if-already-installed) |
| **GitHub Copilot Cloud Agent (CCA)** | [Open a Codespace first](#open-a-codespace-first) |
| Local terminal or standard Codespace terminal | [Install from terminal](#install-from-terminal) |

## Open a Codespace first

If you're using the **GitHub Copilot Cloud Agent (CCA)** and don't have a terminal open yet, use the launch button above.

For a browser-first walkthrough, see [Side Quest: Use `gh-aw` with the GitHub Copilot Cloud Agent](side-quest-06-02-cca-codespace.md).

<!-- Separate adjacent callouts -->

> [!NOTE]
> **Using the GitHub Copilot cloud agent?** `gh aw` may already be available in
> your environment. Run `gh aw --version` first — if it returns a version number,
> you can skip straight to [Check if already installed](#check-if-already-installed).

<!-- -->

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
