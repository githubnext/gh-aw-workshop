# Step 3: Create Your Practice Repository

> _Your workflows need somewhere to live — let's create a dedicated repository you'll use for the rest of the workshop._

## 🎯 What You'll Do

You'll create a fresh GitHub repository in your account, set it up with a basic README, and confirm that GitHub Actions is enabled. This repository will be your sandbox for building and testing agentic workflows.

## 📋 Before You Start

- You've completed either [Adventure A: Set Up a Codespace](02a-setup-codespace.md) or [Adventure B: Set Up Your Local Terminal](02b-setup-local.md)
- You have a GitHub account and are signed in

## Steps

### 1. Create the repository

**Terminal:**

```bash
gh repo create my-agentic-workflows --public --description "My GitHub agentic workflows workshop practice repo" --add-readme
```

This command creates the repository, sets it to public, and adds a starter `README.md` in one go.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Go to [github.com/new](https://github.com/new) in your browser.
2. Fill in **Repository name**: `my-agentic-workflows`
3. Set **Visibility** to **Public**.
4. Check **Add a README file**.
5. Click **Create repository**.

![Create repository form on GitHub](images/03-create-repo-ui.png)

</details>

> [!NOTE]
> The repository must be **public** for GitHub Actions to run for free on a personal account. If you use a private repository, Actions minutes will count against your monthly allowance.

### 2. Clone and enter the repository

> [!NOTE]
> **GitHub UI path:** If you plan to create and edit files directly on GitHub (in the browser), you can skip this step — cloning is only needed for terminal-based work.

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
> Remaining steps that use the terminal assume your shell is inside the `my-agentic-workflows` directory. Keep this terminal open — you'll return to it throughout the workshop.

### 3. Confirm GitHub Actions is enabled

Open the repository on GitHub.

**Terminal shortcut:**

```bash
gh repo view --web
```

Click the **Actions** tab at the top of the page. You should see a message like _"Get started with GitHub Actions"_ — that means Actions is enabled and ready to go.

![Actions tab with getting-started message](images/03-actions-tab.png)

> [!NOTE]
> GitHub Actions is enabled by default for all new public repositories. If you see a prompt to enable it, click the button to turn it on.

### 4. Add a .gitignore (optional but tidy)

Workflows sometimes generate local log files. A `.gitignore` keeps your repository clean.

**Terminal:**

```bash
printf '*.log\n.env\n' > .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. In your repository on GitHub, click **Add file** → **Create new file**.
2. Type `.gitignore` as the filename.
3. Paste the following content:
   ```
   *.log
   .env
   ```
4. Click **Commit new file**.

</details>

### 5. Verify your setup

**Terminal:**

```bash
gh repo view --json name,owner,url | cat
```

You should see your username as `owner`, `my-agentic-workflows` as `name`, and a valid GitHub URL.

**GitHub UI:** Navigate to your repository on GitHub and confirm the repository name and your username appear in the page header.

> [!TIP]
> Bookmark the repository URL — you'll visit it often to watch workflows run.

## ✅ Checkpoint

- [ ] `my-agentic-workflows` repository exists in your GitHub account
- [ ] You're inside the repository directory in your terminal (terminal path) or have the repository open in your browser (UI path)
- [ ] The **Actions** tab is visible and enabled on GitHub
- [ ] You can confirm your username is the repository owner

**Next:** [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)
