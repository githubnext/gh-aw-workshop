# Adventure A: Set Up a Codespace _(recommended for new users)_

> [!IMPORTANT]
> **Using Copilot app or cloud agent?** These entry points don't include a local terminal.
> If you're not already in one, jump to [Step 2: Open the Codespace](#open-the-codespace),
> then continue this step in the Codespace terminal.

Adventure A is the no-local-install path for **GitHub Codespaces**, **VS Code (integrated terminal in Codespaces)**, **copilot-app**, and **cloud-agent** users.

_A Codespace gives you a full development environment in your browser — no installs, no version conflicts, just you and the workshop._

## 🎯 What You'll Do

You'll create your practice repository in GitHub, launch a GitHub Codespace, confirm that all the tools you need are already waiting for you, and arrive at the shared workshop path ready to write your first workflow.

## 📋 Before You Start

- You've completed [Step 1: What You Need Before We Start](01-prerequisites.md)
- You have a free GitHub account and are signed in

## Steps

### 1. Create your practice repository in GitHub

Create the repository you'll use to store your workflows during the workshop.

1. Open [github.com/new](https://github.com/new) in your browser.
2. Enter `my-agentic-workflows` for **Repository name**.
3. Set **Visibility** to **Public**.
4. Check **Add a README file**.
5. Click **Create repository**.

> [!NOTE]
> Creating the repository first keeps the Codespace and terminal setup paths aligned, and adding a README avoids an empty-repository setup edge case.

<a id="open-the-codespace"></a>
### 2. Open the Codespace

1. In [github.com/githubnext/gh-aw-workshop](https://github.com/githubnext/gh-aw-workshop), click the green **Code** button.
2. Click the **Codespaces** tab.
3. Click **Create codespace on main**.

![Open Codespace](images/02a-open-codespace.svg)

GitHub will spin up a container with everything pre-installed. This takes about 30–60 seconds on first launch.

> [!TIP]
> Codespaces auto-saves your work. If you close the tab, open [github.com/codespaces](https://github.com/codespaces) to resume where you left off.

### 3. Verify the tools are ready

Once the Codespace editor loads, open the built-in terminal with **Ctrl+`** (or **Cmd+`** on Mac) and run these checks:

> [!TIP]
> **First time in a terminal?** A blank prompt is normal. Try:
> - `pwd` → prints your current folder path
> - `ls` → lists files and folders in the current location
> - `cd workshop` → moves into the `workshop` folder
> - `cd ..` → moves back up one folder
> - `git status` → shows `On branch main` and whether your working tree is clean

```bash
gh --version
```

You should see something like `gh version 2.x.x`.

```bash
gh extension list
```

You should see `github/gh-aw` listed. If you don't see it yet, don't worry — you'll install it in a later step.

> [!NOTE]
> The Codespace was built from a `.devcontainer` configuration that pre-installs the `gh` CLI. You don't need to install it yourself.

### 4. Authenticate the gh CLI

The `gh` CLI needs to be authorised to act on your behalf.

```bash
gh auth login
```

Follow the prompts. When asked, choose **GitHub.com** and then **Login with a web browser**. Copy the one-time code displayed, open the URL, and paste it.

> [!WARNING]
> Your Codespace is private to you, but it's still good practice to authenticate with the minimum scopes needed. The default scopes selected by `gh auth login` are exactly right for this workshop.

### 5. Confirm you're in the right repo

```bash
gh repo view --json name,owner | cat
```

You should see `githubnext` as `owner` and `gh-aw-workshop` as `name`.

## ✅ Checkpoint

- [ ] Your `my-agentic-workflows` repository is created on GitHub with a starter README
- [ ] The Codespace editor is open in your browser
- [ ] `gh --version` returns a version number
- [ ] `gh auth login` completed without errors

**Next:** [Step 3: Open and Verify Your Practice Repository](03-create-your-repo.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
