---
journey: terminal
adventure: core
---
# Create Your Practice Repository — Terminal Path

> _When you're done with this step, you'll have a public `my-agentic-workflows` repository cloned locally or in your Codespace, with GitHub Actions enabled and ready for the rest of the workshop._

## 🎯 What You'll Do

You'll create your `my-agentic-workflows` repository, clone it into your working environment, and confirm GitHub Actions is enabled. This repository is your sandbox for building and testing [agentic workflows](https://github.github.com/gh-aw/introduction/overview/).

## 📋 Before You Start

- You've completed either [Adventure A: Set Up a Codespace](02a-setup-codespace.md) or [Adventure B: Set Up Your Local Terminal](02b-setup-local.md)
- You have a GitHub account and are signed in

> [!NOTE]
> Want to work without a terminal? Switch to the [GitHub UI path](03b-create-your-repo-ui.md).

<!-- Separate adjacent callouts -->

> [!NOTE]
> **Using GitHub Enterprise Server (GHES) or GitHub Enterprise Cloud (GHEC)?** Review [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.

## Steps

### Create or confirm your practice repository

If you opened a Codespace in Step 2a, your `my-agentic-workflows` repository already exists. Continue to [Confirm the repository directory](#confirm-the-repository-directory).

If you're using a local terminal:

1. Open [github.com/new](https://github.com/new) in your browser.
2. Enter `my-agentic-workflows` for **Repository name**.
3. Set **Visibility** to **Public**.
4. Check **Add a README file**.
5. Click **Create repository**.

> [!NOTE]
> Adding a README avoids an empty-repository setup edge case and gives you something to clone right away.

### Open your practice repository

Open `https://github.com/<your-username>/my-agentic-workflows` in your browser.

Replace `<your-username>` with your actual GitHub username.

> [!NOTE]
> The repository must be **public** for GitHub Actions to run for free on a personal account. If you use a private repository, Actions minutes will count against your monthly allowance.

### Confirm the repository directory

If you're in the Codespace created from your practice repository, confirm the current directory:

```bash
pwd
git remote -v
```

The path and remote should identify `my-agentic-workflows`. No clone is needed.

### Clone locally

If you're using your own terminal, clone the new repository:

```bash
gh repo clone my-agentic-workflows
cd my-agentic-workflows
```

> [!TIP]
> Remaining steps that use the terminal assume your shell is inside the `my-agentic-workflows` directory. Keep this terminal open — you'll return to it throughout the workshop.

### Confirm GitHub Actions is enabled

Open the repository on GitHub:

```bash
gh repo view --web
```

Then click the **Actions** tab at the top of the page.

You should see a message like _"Get started with GitHub Actions"_ — that means Actions is enabled and ready to go.

![Actions tab with getting-started message](images/03-actions-tab.svg)

> [!NOTE]
> GitHub Actions is enabled by default for all new public repositories. If you see a prompt to enable it, click the button to turn it on.

### Add a .gitignore (optional but tidy)

Workflows sometimes generate local log files. A `.gitignore` keeps your repository clean.

```bash
printf '*.log\n.env\n' > .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```

### Verify your setup

```bash
gh repo view --json name,owner,url
```

You should see your username as `owner`, `my-agentic-workflows` as `name`, and a valid GitHub URL.

> [!TIP]
> Bookmark the repository URL — you'll visit it often to watch workflows run.

## ✅ Checkpoint

- [ ] `my-agentic-workflows` repository exists in your GitHub account
- [ ] The repository is cloned in your working environment
- [ ] The **Actions** tab is visible and enabled on GitHub
- [ ] You can confirm your username is the repository owner

<!-- journey: terminal -->
**Next:** [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/).

