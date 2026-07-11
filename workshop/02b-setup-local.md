# Adventure B: Set Up Your Local Terminal

> _Working locally means you'll use the tools and shell you already know — let's get them ready in a few quick steps._

## 🎯 What You'll Do

You'll install the tools you need on your own machine: Git, Node.js, and the `gh` CLI. You'll authenticate with GitHub, and by the end you'll be at exactly the same starting point as Codespace users — ready to write your first workflow.

## 📋 Before You Start

- You've completed [Step 1: What You Need Before We Start](01-prerequisites.md)
- You have a free GitHub account and are signed in
- You have a terminal application open (Terminal on macOS, Windows Terminal or Git Bash on Windows, any terminal on Linux)

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

You should see `git version 2.x.x` or higher. If you see an error, download Git from [git-scm.com](https://git-scm.com) and re-run the check.

### 3. Install Node.js (v20 or later)

Check whether Node.js is already installed:

```bash
node --version
```

If you see `v20.x.x` or higher, you're good. If not, install Node.js using your preferred method:

**macOS (Homebrew):**

```bash
brew install node
```

**Windows (winget):**

```bash
winget install OpenJS.NodeJS.LTS
```

**Linux (apt):**

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

After installing, reopen your terminal and verify:

```bash
node --version
```

> [!TIP]
> If you manage multiple Node.js versions, [nvm](https://github.com/nvm-sh/nvm) is a great tool. Run `nvm install --lts` to get the latest LTS release.

### 4. Install the gh CLI

The `gh` CLI is GitHub's official command-line tool. Check whether it's already installed:

```bash
gh --version
```

If not, follow the instructions for your platform at [cli.github.com](https://cli.github.com). The most common options:

**macOS:**

```bash
brew install gh
```

**Windows:**

```bash
winget install --id GitHub.cli
```

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

### 5. Authenticate the gh CLI

```bash
gh auth login
```

Choose **GitHub.com** and then **Login with a web browser**. A one-time code will appear in your terminal — copy it, open the URL shown, and paste the code when prompted.

> [!WARNING]
> Never share the one-time code or your authentication token with anyone. If you accidentally commit a token, revoke it immediately in **Settings → Developer settings → Personal access tokens**.

### 6. Clone your fork

Replace `YOUR_USERNAME` with your GitHub username:

```bash
gh repo clone YOUR_USERNAME/gh-aw-workshop
cd gh-aw-workshop
```

### 7. Verify everything is in order

```bash
gh repo view --json name,owner | cat
node --version
gh --version
```

All three commands should return output without errors. The repo view should show your username as `owner`.

## ✅ Checkpoint

- [ ] Your fork exists on GitHub
- [ ] `git --version` returns a version number
- [ ] `node --version` returns v20 or higher
- [ ] `gh --version` returns a version number
- [ ] `gh auth login` completed without errors
- [ ] You've cloned the repository and `cd`-ed into it

**Next:** [Step 3: Create Your Practice Repository](03-create-your-repo.md)
