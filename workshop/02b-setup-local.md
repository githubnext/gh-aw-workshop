---
journey: local
adventure: setup
---
# Adventure B: Set Up Your Local Terminal

> [!TIP]
> Don't want to use a terminal? Skip to [Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md) and stay browser-only.

## Which path is right for me?

Choose the option that matches how you work:

- 📱 Mobile or Copilot app — skip this step and go to [Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md)
- 🤖 Copilot Cloud Agent — stay browser-only and go to [Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md)
- ☁️ Codespace — switch to [Adventure A: Set Up a Codespace](02a-setup-codespace.md)
- 💻 Local terminal — you're in the right place, continue below

## 🧪 5-question terminal self-assessment

Check each statement:

- [ ] I have opened a terminal before.
- [ ] I can tell which folder I am in and change folders in a terminal.
- [ ] I can copy, paste, and run multi-line commands.
- [ ] I know how to read command output and spot errors.
- [ ] I feel comfortable troubleshooting local install or proxy issues.

If any answer is No, switch to [Adventure A: Set Up a Codespace](02a-setup-codespace.md) for a faster setup with no local installs.

_Working locally means you'll use the tools and shell you already know — let's get them ready in a few quick steps._

## Choose your operating system

Pick one path now and use only that install section below:

| macOS | Windows | Linux |
| --- | --- | --- |
| [macOS install instructions](#macos-quick-install) | [Windows install instructions](#windows-quick-install) | [Linux install instructions](#linux-quick-install) |

## 🎯 What You'll Do

You'll install Git and the `gh` CLI on your own machine and authenticate with GitHub. By the end you'll be ready to create your practice repository in Step 3.

## 📋 Before You Start

- You've completed [Step 1: What You Need Before We Start](01-prerequisites.md)
- You have a free GitHub account and are signed in
- You have a terminal application open (Terminal on macOS, Windows Terminal or Git Bash on Windows, any terminal on Linux)

## 🧭 Terminal Basics

If this is your first time in a terminal, use this legend while running each step:

![Annotated terminal screenshot showing prompt, command, and output](images/02b-terminal-command-annotated.svg)

- Prompt = where you type
- Command = exactly what to copy/paste from the code block
- Output = what success or errors look like after pressing Enter

All command blocks below are copy-paste-ready (no leading `$`).

## Steps

### Verify Git

```bash
git --version
```

![Example success output after running `git --version`](images/02b-terminal-success-01-git-version.svg)

_What success looks like:_ a line like `git version 2.x.x`.

You should see `git version 2.x.x` or higher. If you see an error, download Git from [git-scm.com](https://git-scm.com) and re-run the check.

### Install the GitHub CLI

GitHub CLI is GitHub's official command-line tool, and you run it with the `gh` command. Check whether it's already installed:

```bash
gh --version
```

![Example success output after running `gh --version`](images/02b-terminal-success-07-gh-version.svg)

_What success looks like:_ version details for `gh` are printed.

If the command works, continue to the authentication section. If it does not, run the quick install command for [macOS](#macos-quick-install), [Windows](#windows-quick-install), or [Linux](#linux-quick-install).

#### macOS quick install

```bash
brew install gh
```

<details>
<summary>Don't have Homebrew?</summary>

If Homebrew is missing or blocked, use the macOS installer from [cli.github.com](https://cli.github.com). If Git was not found during [Verify Git](#verify-git), install it from [git-scm.com](https://git-scm.com) before continuing.

</details>

#### Windows quick install

```powershell
winget install --id GitHub.cli
```

<details>
<summary>Don't have winget?</summary>

- If `winget` is unavailable, use the Windows installer from [cli.github.com](https://cli.github.com).
- If Git was not found during [Verify Git](#verify-git), install Git for Windows from [git-scm.com](https://git-scm.com).

</details>

#### Linux quick install

```bash
sudo apt update && sudo apt install gh -y
```

<details>
<summary>Using a different package manager?</summary>

- The quick install above is for Debian and Ubuntu.
- For Fedora, Arch, or other package managers, use the Linux instructions at [cli.github.com](https://cli.github.com).
- If Git was not found during [Verify Git](#verify-git), install it with your distro package manager before continuing.

</details>

Run `gh --version` again after installing to confirm it worked.

If you're on GHES, GHEC, behind SSO, or behind a proxy, complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md). If any install step is blocked by proxy, permissions, or host-specific setup issues, use [Side Quest: Install gh-aw Troubleshooting](side-quest-06-01-install-troubleshooting.md).

### Authenticate the `gh` CLI

```bash
gh auth login
```

![Example prompt flow after running `gh auth login`](images/02b-terminal-success-11-gh-auth-login.svg)

_What success looks like:_ interactive prompts complete and login succeeds.

Choose GitHub.com and then Login with a web browser. A one-time code will appear in your terminal — copy it, open the URL shown, and paste the code when prompted.

> [!WARNING]
> Never share the one-time code or your authentication token with anyone. If you accidentally commit a token, revoke it immediately in **Settings → Developer settings → Personal access tokens**.

<!-- -->

> [!TIP]
> If `gh auth login` fails with a network or proxy error, see [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) for proxy, firewall, and corporate-network fixes.

## 🛟 Troubleshooting

If setup commands fail, use [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) for quick fixes (`command not found`, permissions, proxy, and GHES-specific setup), then return here.

## ✅ Verify your setup

Run this exact command from your terminal:

```bash
gh auth status && gh extension list
```

_What success looks like:_ no errors are shown, and `gh auth status` confirms you're signed in to GitHub.

If this combined check stops early, run each command on its own to find the failing step.

## ✅ Checkpoint

- [ ] `git --version` returns a version number
- [ ] `gh --version` returns a version number
- [ ] `gh auth login` completed without errors
- [ ] `gh auth status` confirms you're signed in

<!-- journey: local -->
**Next:** [Step 3: Create and Verify Your Practice Repository](03-create-your-repo.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/).

