# Step 3: Create Your Practice Repository

> _Your workflows need somewhere to live — let's create a dedicated repository you'll use for the rest of the workshop._

## 🎯 What You'll Do

You'll create a fresh GitHub repository in your account, set it up with a basic README, and confirm that GitHub Actions is enabled. This repository will be your sandbox for building and testing agentic workflows.

## 📋 Before You Start

- You've completed either [Adventure A: Set Up a Codespace](02a-setup-codespace.md) or [Adventure B: Set Up Your Local Terminal](02b-setup-local.md)
- The `gh` CLI is installed and authenticated

## Steps

### 1. Create the repository

Use the `gh` CLI to create a new public repository called `my-agentic-workflows`:

```bash
gh repo create my-agentic-workflows --public --description "My GitHub agentic workflows workshop practice repo" --add-readme
```

This command does three things at once: creates the repository, sets it to public, and adds a starter `README.md`.

> [!NOTE]
> The repository must be **public** for GitHub Actions to run for free on a personal account. If you use a private repository, Actions minutes will count against your monthly allowance.

### 2. Clone and enter the repository

If you're on the **local path**, clone the new repository:

```bash
gh repo clone my-agentic-workflows
cd my-agentic-workflows
```

If you're using a **Codespace**, open a new terminal and clone into the Codespace workspace:

```bash
cd /workspaces
gh repo clone my-agentic-workflows
cd my-agentic-workflows
```

> [!TIP]
> All remaining workshop steps assume your terminal is inside the `my-agentic-workflows` directory. Keep this terminal open — you'll return to it throughout the workshop.

### 3. Confirm GitHub Actions is enabled

Open the repository on GitHub:

```bash
gh repo view --web
```

Click the **Actions** tab at the top of the page. You should see a message like *"Get started with GitHub Actions"* — that means Actions is enabled and ready to go.

![Actions tab with getting-started message](images/03-actions-tab.png)

> [!NOTE]
> GitHub Actions is enabled by default for all new public repositories. If you see a prompt to enable it, click the button to turn it on.

### 4. Add a .gitignore (optional but tidy)

Workflows sometimes generate local log files. A `.gitignore` keeps your repository clean:

```bash
echo "*.log\n.env" > .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```

### 5. Verify your setup

Check that everything is connected:

```bash
gh repo view --json name,owner,url | cat
```

You should see your username as `owner`, `my-agentic-workflows` as `name`, and a valid GitHub URL.

> [!TIP]
> Bookmark the repository URL that appears — you'll visit it often to watch workflows run.

## ✅ Checkpoint

- [ ] `my-agentic-workflows` repository exists in your GitHub account
- [ ] You're inside the repository directory in your terminal
- [ ] The **Actions** tab is visible and enabled on GitHub
- [ ] `gh repo view` shows your username as the owner

**Next:** [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)
