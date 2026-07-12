# Adventure B: Set Up Your Local Terminal

> _Working locally means you'll use the tools and shell you already know — let's get them ready in a few quick steps._

## 🎯 What You'll Do

> [!IMPORTANT]
> If you run into trouble with any terminal step, switch to a Codespace at any time — all progress is preserved in your repository. ➡️ [Adventure A: Set Up a Codespace](02a-setup-codespace.md)

You'll install the tools you need on your own machine: Git and the `gh` CLI. You'll authenticate with GitHub, and by the end you'll be at exactly the same starting point as Codespace users — ready to write your first workflow.

## 📋 Before You Start

- You've completed [Step 1: What You Need Before We Start](01-prerequisites.md)
- You have a free GitHub account and are signed in
- You have a terminal application open (Terminal on macOS, Windows Terminal or Git Bash on Windows, any terminal on Linux)

> [!NOTE]
> **New to terminals?** A terminal (also called a shell or command line) is a text-based interface where you type commands to control your computer. If that sounds unfamiliar, you may find it easier to use [Adventure A: Codespace](02a-setup-codespace.md) instead — it sets everything up for you in the browser with no local installs required.

## 🧭 Terminal Basics (1 minute)

If this is your first time in a terminal, use this legend while running each step:

![Annotated terminal screenshot showing prompt, command, and output](images/02b-terminal-command-annotated.svg)

- **Prompt** = where you type
- **Command** = exactly what to copy/paste from the code block
- **Output** = what success or errors look like after pressing Enter

All command blocks below are copy-paste-ready (no leading `$`).

## Steps

### 1. Fork the workshop repository

You'll work in your own copy of the workshop repository.

1. Open [github.com/githubnext/gh-aw-workshop](https://github.com/githubnext/gh-aw-workshop) in your browser.
2. Click **Fork** (top-right corner).
3. Accept the defaults and click **Create fork**.

> [!NOTE]
> Forking creates your own copy under your account. All experiments stay in your fork — the original is untouched.

### 2. Verify Git

```bash
git --version
```

![Example success output after running `git --version`](images/02b-terminal-success-01-git-version.svg)

_What success looks like:_ a line like `git version 2.x.x`.

You should see `git version 2.x.x` or higher. If you see an error, download Git from [git-scm.com](https://git-scm.com) and re-run the check.

### 3. Install the gh CLI

The `gh` CLI is GitHub's official command-line tool. Check whether it's already installed:

```bash
gh --version
```

![Example success output after running `gh --version`](images/02b-terminal-success-07-gh-version.svg)

_What success looks like:_ version details for `gh` are printed.

If not, follow the instructions for your platform at [cli.github.com](https://cli.github.com). The most common options:

**macOS:**

```bash
brew install gh
```

![Example success output after running `brew install gh`](images/02b-terminal-success-08-brew-gh.svg)

_What success looks like:_ installation completes and returns to prompt.

**Windows:**

```bash
winget install --id GitHub.cli
```

![Example success output after running `winget install --id GitHub.cli`](images/02b-terminal-success-09-winget-gh.svg)

_What success looks like:_ package install reports success.

**Linux (Debian/Ubuntu):**

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y
```

![Example success output after running Linux `gh` install commands](images/02b-terminal-success-10-linux-gh.svg)

_What success looks like:_ apt completes and `gh` is installed without errors.

### 4. Authenticate the gh CLI

```bash
gh auth login
```

![Example prompt flow after running `gh auth login`](images/02b-terminal-success-11-gh-auth-login.svg)

_What success looks like:_ interactive prompts complete and login succeeds.

Choose **GitHub.com** and then **Login with a web browser**. A one-time code will appear in your terminal — copy it, open the URL shown, and paste the code when prompted.

> [!WARNING]
> Never share the one-time code or your authentication token with anyone. If you accidentally commit a token, revoke it immediately in **Settings → Developer settings → Personal access tokens**.

### 5. Clone your fork

Replace `YOUR_USERNAME` with your GitHub username:

```bash
gh repo clone YOUR_USERNAME/gh-aw-workshop
cd gh-aw-workshop
```

![Example success output after cloning and changing directories](images/02b-terminal-success-12-gh-repo-clone.svg)

_What success looks like:_ clone finishes and `cd` returns you to a prompt inside `gh-aw-workshop`.

### 6. Verify everything is in order

```bash
gh repo view --json name,owner | cat
gh --version
```

![Example success output for final local setup verification commands](images/02b-terminal-success-13-final-verify.svg)

_What success looks like:_ both commands print output; `owner` is your GitHub username.

Both commands should return output without errors. The repo view should show your username as `owner`.

## 🛟 Troubleshooting: common beginner errors

| Error message | Why it happens | How to fix it |
|------|------|------|
| `command not found` | Tool is missing or terminal session hasn't picked up install yet | Install/reinstall the tool from the step above, then fully close and reopen terminal |
| `permission denied` | Command needs elevated privileges or file permissions are restricted | Re-run the Linux/macOS install command with `sudo` exactly as shown; on Windows use an elevated terminal when needed |
| `No such file or directory` / path-related errors | You're not in the expected folder | Run `pwd` (macOS/Linux) or `cd` (Windows) to check your location, then `cd gh-aw-workshop` and retry |

## ✅ Checkpoint

- [ ] Your fork exists on GitHub
- [ ] `git --version` returns a version number
- [ ] `gh --version` returns a version number
- [ ] `gh auth login` completed without errors
- [ ] You've cloned the repository and `cd`-ed into it

**Next:** [Step 3: Create Your Practice Repository](03-create-your-repo.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
