# Step 6: Install the gh-aw CLI Extension

> _You're ready to add agentic workflow commands to your `gh` CLI._
> [!IMPORTANT]
> Run this pre-flight check before installing `gh-aw`:
>
> ```bash
> gh --version && echo "✅ gh installed" || echo "❌ install gh first"
> gh auth status && echo "✅ gh authenticated" || echo "❌ run: gh auth login"
> ```
>
> [!CAUTION]
> The extension install will fail if you are not logged in. Run `gh auth login` now if the status check above showed ❌.

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed and then install the `gh-aw`
extension so you can compile and run agentic workflows from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory
- You have authenticated the `gh` CLI with `gh auth login`
  (done in [Adventure A §4](02a-setup-codespace.md#4-authenticate-the-gh-cli)
  or [Adventure B §5](02b-setup-local.md#5-authenticate-the-gh-cli))

## Steps

If `gh` is missing, use your platform command from
[Step 1 (platform-specific commands)](01-prerequisites.md#macos-homebrew):
- [macOS (Homebrew): `brew install gh`](01-prerequisites.md#macos-homebrew)
- [Ubuntu/Debian: `sudo apt install gh`](01-prerequisites.md#ubuntudebian)
- [Windows (winget): `winget install GitHub.cli`](01-prerequisites.md#windows-winget)

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

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install github/gh-aw` ran without errors
- [ ] `gh extension list` shows `github/gh-aw`

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
