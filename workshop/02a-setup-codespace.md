<!-- page-journey: codespace -->
<!-- page-adventure: setup -->
# Set Up a Codespace

## :clipboard: Before You Start

- [ ] You have a GitHub account with access to GitHub Codespaces
- [ ] Your account can create public repositories (free tier works)
- [ ] You want a browser-based terminal and do not need to install tools locally

> [!TIP]
> Not sure if your plan includes Codespaces? Free GitHub accounts include 60 hours/month. Check your [billing settings](https://github.com/settings/billing) or ask your organization admin.

## :dart: What You'll Do

You'll launch a GitHub Codespace for this workshop, open the built-in terminal, and land in a ready-to-use environment for the next step.

Codespaces is the recommended environment for this workshop and the path used throughout the core steps.

## Steps

These steps take about 5 minutes. If you get stuck on any command, [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) is a 2-minute read.

### New repository

1. Create your own public repository at [github.com/new](https://github.com/new):
   - Choose yourself as owner.
   - Visibility **Private**, it's good to learn on our own. We can make it public later if we want to share our work.
   - Name it `my-agentic-workflows`.
   - Check **Add a README file**.
   - Click **Create repository**.

### Open the Codespace

1. In your new repository, click the green **Code** button.
2. Click the **Codespaces** tab.
   - Leave **main** selected as the branch.
   - Click **Create codespace on main**.
   - Wait 30–60 seconds for GitHub to prepare the container.
3. The Codespace opens in a new browser tab showing a VS Code-style editor. Leave this tab open for the rest of the workshop.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/02a-open-codespace-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/02a-open-codespace-light.svg">
  <img alt="Open Codespace" src="images/02a-open-codespace-light.svg">
</picture>

Codespaces auto-save your work. If you close the tab, open [github.com/codespaces](https://github.com/codespaces) to resume where you left off.

<details>
<summary>Codespace not appearing or taking too long?</summary>

- **"Create codespace on main" is greyed out** — your account may not have Codespaces enabled. Check your GitHub plan details or ask your organization admin.
- **Spinner runs more than 3 minutes** — refresh the browser tab. If still stuck, go to [github.com/codespaces](https://github.com/codespaces), find the pending Codespace, click **⋯ → Delete**, and try again.
- **"Codespace storage limit reached"** — you may have existing Codespaces using your quota. Visit [github.com/codespaces](https://github.com/codespaces), delete any you no longer need, and retry.
- **VS Code desktop opens instead of the browser** — see [Side Quest: Install Local](side-quest-06-04-install-local.md) if you prefer that path, or click **Open in Browser** to continue here.

</details>

### Open the Codespace terminal

1. When the Codespace editor loads, open the built-in terminal with **Ctrl+\`** (or **Cmd+Option+\`** on Mac).
2. Wait for the terminal prompt to appear.
3. Keep this terminal open. It is already inside your practice repository.

> [!TIP]
> If the terminal in your Codespace shows a `$` prompt, the container is ready. If you see a permission error when running `gh auth status`, try `gh auth login` to authenticate.

<details>
<summary>First time in a terminal?</summary>

Type your command after the `$` prompt and press Enter. Output appears below; a new `$` prompt means the command finished. See [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) for more.

</details>

### Verify your Codespace is ready

The diagram below shows your Codespace connection to GitHub.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/02a-codespace-architecture-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/02a-codespace-architecture-light.svg">
  <img alt="Codespace environment architecture: your browser connects to a cloud container with pre-installed tools, which communicates with GitHub" src="images/02a-codespace-architecture-light.svg">
</picture>

1. Run these commands in the Codespace terminal:

```bash
gh --version
gh auth status
```
1. Confirm `gh --version` shows `gh version 2.40.0` or newer.
2. Confirm `gh auth status` shows you are logged in to `github.com`.

_What success looks like:_

```text
gh version 2.40.0 (2024-01-01)
...
github.com
  ✓ Logged in to github.com as <your-username>
```

## :white_check_mark: Checkpoint

- [ ] You confirmed your GitHub plan includes Codespaces access (free tier includes 60 hours/month)
- [ ] The Codespace editor is open in your browser
- [ ] The built-in terminal is open in your Codespace
- [ ] `gh --version` returns version 2.40.0 or newer
- [ ] `gh auth status` confirms you are logged in to `github.com`
- [ ] The Codespace is attached to your `my-agentic-workflows` practice repository

<!-- journey: codespace -->
**Next:** [GitHub Actions Intro](04-github-actions-intro.md)
<!-- /journey -->
