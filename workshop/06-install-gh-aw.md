# Step 6: Install the gh-aw CLI Extension

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed and then install the `gh-aw`
extension so you can compile and run agentic workflows from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory
- You have authenticated the `gh` CLI with `gh auth login`
  (done in [Adventure A §4](02a-setup-codespace.md#4-authenticate-the-gh-cli)
  or [Adventure B §5](02b-setup-local.md#5-authenticate-the-gh-cli))

> [!IMPORTANT]
> **No local terminal?** If you are using the GitHub web UI, the Copilot app, or a cloud coding agent,
> open a **Codespace** on your practice repository — it comes with `gh` pre-installed and authenticated.
> Haven't set one up yet? Follow [Adventure A: Set Up a Codespace](02a-setup-codespace.md) first.
> Once `gh extension install github/gh-aw` succeeds inside the Codespace, the extension is available
> for all subsequent steps in that environment.

## Steps

> [!TIP]
> **Using VS Code?** Open the integrated terminal with `` Ctrl+` `` (macOS: `` Cmd+` ``),
> then run all `gh aw` commands there. If a command is unfamiliar, try:
> `gh copilot suggest "how do I install a gh extension"`

Before you can install the extension, verify the GitHub CLI is set up correctly:

> [!IMPORTANT]
> **Run these pre-flight checks before installing `gh-aw`.**
>
> **1 — Verify your GitHub CLI authentication** (the extension install will fail if you skip this):
>
> If you completed [Step 1 (Prerequisites)](01-prerequisites.md), you already verified this — skip ahead to check 2.
>
> ```bash
> gh auth status
> ```
>
> If the output says you are not logged in, run:
>
> ```bash
> gh auth login
> ```
>
> Re-run `gh auth status` and confirm you see `Logged in to github.com` before continuing.
>
> **2 — Confirm `gh` is installed:**
>
> ```bash
> gh --version && echo "✅ gh installed" || echo "❌ install gh first"
> ```

If `gh` is missing, install it for your platform:

<details>
<summary>Install <code>gh</code> CLI — platform instructions</summary>

**macOS (Homebrew):**

```bash
brew install gh
```

**Ubuntu/Debian:**

```bash
sudo apt install gh
```

**Windows (winget):**

```powershell
winget install GitHub.cli
```

Full installation docs: [cli.github.com](https://cli.github.com)

</details>

### 1. Install the `gh-aw` extension

```bash
gh extension install github/gh-aw
```

If the extension is already installed, you can update it instead:

```bash
gh extension upgrade github/gh-aw
```

### 2. Confirm installation

```bash
gh extension list
```

You should see an entry for `github/gh-aw`.

## Troubleshooting

Most installs work on the first try after `gh auth status` and `gh extension install github/gh-aw`.
If you hit auth, proxy, GHES hostname, or locked-down-network errors, use the optional troubleshooting side quest.

> [!TIP]
> Need copy-paste fixes? Open [Side Quest: Install `gh-aw` Troubleshooting](side-quest-install-troubleshooting.md), then come back here.

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install github/gh-aw` ran without errors
- [ ] `gh extension list` shows `github/gh-aw`

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
