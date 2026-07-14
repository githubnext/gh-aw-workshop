# Adventure B: Set Up Your Local Terminal

> [!CAUTION]
> **Don't want to use a terminal? Skip here →** Using **GitHub Copilot app**, **GitHub Mobile**, or a **browser-only** setup? You are in the wrong place. Go directly to **[Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md)** — no terminal required.

## Which path is right for me?

**Before you start: How do you plan to work through this workshop?** Choose the option that matches how you work:

- 🌐 **Browser / Copilot app / Mobile** — I'll use the GitHub web UI, Copilot app, or GitHub Mobile with no terminal → skip this step entirely and go to [Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md)
- ☁️ **Codespace** — I want a browser-based terminal with no local installs → switch to [Adventure A: Set Up a Codespace](02a-setup-codespace.md)
- 💻 **Local terminal** — I want to use my own machine and tools → ✅ you're in the right place, continue below

## 🧪 5-question terminal self-assessment

Check each statement:

- [ ] I have opened a terminal before.
- [ ] I can run `pwd` (or `cd`) and understand what it shows.
- [ ] I can copy, paste, and run multi-line commands.
- [ ] I know how to read command output and spot errors.
- [ ] I feel comfortable troubleshooting local install or proxy issues.

If any answer is **No**, switch to [Adventure A: Set Up a Codespace](02a-setup-codespace.md) for a faster setup with no local installs.

_Working locally means you'll use the tools and shell you already know — let's get them ready in a few quick steps._

## 🎯 What You'll Do

You'll install Git and the `gh` CLI on your own machine, authenticate with GitHub, and clone your practice repository. By the end you'll be at exactly the same starting point as Codespace users — ready to write your first workflow.

## 📋 Before You Start

- You've completed [Step 1: What You Need Before We Start](01-prerequisites.md)
- You have a free GitHub account and are signed in
- You have a terminal application open (Terminal on macOS, Windows Terminal or Git Bash on Windows, any terminal on Linux)

## 🧭 Terminal Basics

If this is your first time in a terminal, use this legend while running each step:

![Annotated terminal screenshot showing prompt, command, and output](images/02b-terminal-command-annotated.svg)

- **Prompt** = where you type
- **Command** = exactly what to copy/paste from the code block
- **Output** = what success or errors look like after pressing Enter

All command blocks below are copy-paste-ready (no leading `$`).

## Steps

**Verify you are on the right path before continuing:**

- [ ] I have a terminal application open on my machine (Terminal on macOS, Windows Terminal or Git Bash on Windows, any terminal on Linux)
- [ ] I am comfortable installing command-line tools locally

### Pre-flight check your current `gh` state

Run this before installing anything:

```bash
gh auth status && gh extension list
```

_What success looks like:_ the command runs without shell errors and shows your current login state plus any installed extensions.

If the command fails with `gh: command not found`, continue to [Install the gh CLI](#install-the-gh-cli) below, then re-run this pre-flight check.

Expected output includes one of these login states:

```text
✓ Logged in to github.com account <your-username>
```

or:

```text
You are not logged into any GitHub hosts. Run gh auth login to authenticate.
```

`gh extension list` can show existing extensions or no entries if you have none yet.

> [!IMPORTANT]
> **On GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), or using self-hosted runners?** Complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) now before continuing. Skipping it will cause `gh auth status` to fail at the verification step below. If you're blocked by SSO, proxy, or host-specific issues, also use [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md).

### Create your practice repository

1. Open [github.com/new](https://github.com/new).
2. Enter `my-agentic-workflows` for **Repository name**.
3. Set **Visibility** to **Public**.
4. Check **Add a README file**.
5. Click **Create repository**.

### Verify Git

```bash
git --version
```

![Example success output after running `git --version`](images/02b-terminal-success-01-git-version.svg)

_What success looks like:_ a line like `git version 2.x.x`.

You should see `git version 2.x.x` or higher. If you see an error, download Git from [git-scm.com](https://git-scm.com) and re-run the check.

### Install the gh CLI

The `gh` CLI is GitHub's official command-line tool. Check whether it's already installed:

```bash
gh --version
```

![Example success output after running `gh --version`](images/02b-terminal-success-07-gh-version.svg)

_What success looks like:_ version details for `gh` are printed.

If not installed, follow the official instructions for your platform at [cli.github.com](https://cli.github.com), then re-run `gh --version` to confirm.

### Authenticate the gh CLI

```bash
gh auth login
```

![Example prompt flow after running `gh auth login`](images/02b-terminal-success-11-gh-auth-login.svg)

_What success looks like:_ interactive prompts complete and login succeeds.

Choose **GitHub.com** and then **Login with a web browser**. A one-time code will appear in your terminal — copy it, open the URL shown, and paste the code when prompted.

> [!WARNING]
> Never share the one-time code or your authentication token with anyone. If you accidentally commit a token, revoke it immediately in **Settings → Developer settings → Personal access tokens**.

### Clone your practice repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
gh repo clone YOUR_USERNAME/my-agentic-workflows
cd my-agentic-workflows
```

![Example success output after cloning and changing directories](images/02b-terminal-success-12-gh-repo-clone.svg)

_What success looks like:_ clone finishes and `cd` returns you to a prompt inside `my-agentic-workflows`.

## 🛟 Troubleshooting

If setup commands fail, use [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) for quick fixes (`command not found`, permissions, proxy, and GHES-specific setup), then return here.

## ✅ Verify your setup

Run this exact command from inside `my-agentic-workflows`:

```bash
gh auth status && gh extension list && gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"'
```

_What success looks like:_ no errors are shown across all command output, and the final line is exactly:

```text
<your-username>/my-agentic-workflows
```

You should see your actual GitHub username in place of `<your-username>` in that final output line.

If this combined check stops early, run each command on its own to find the failing step.

## ✅ Checkpoint

- [ ] Your `my-agentic-workflows` repository exists on GitHub with a starter README
- [ ] `git --version` returns a version number
- [ ] `gh --version` returns a version number
- [ ] `gh auth login` completed without errors
- [ ] You've cloned the repository and `cd`-ed into it

**Next:** [Step 3a: Create Your Practice Repository — Terminal Path](03a-create-your-repo-terminal.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
