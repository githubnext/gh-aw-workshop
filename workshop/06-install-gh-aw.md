# Step 6: Install the gh-aw CLI Extension

> _You're ready to add agentic workflow commands to your `gh` CLI._

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed, install it if needed, and then install the `gh-aw` extension so you can compile and run agentic workflows from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory

## Steps

> [!IMPORTANT]
> **Required:** `gh` CLI must be installed before you can run `gh extension install`.
>
> Verify now:
>
> ```bash
> gh --version
> ```
>
> Expected output starts with `gh version 2.` (for example, `gh version 2.75.0`).
>
> If `gh` is missing, install it using one of these one-liners:
>
> **macOS (Homebrew):**
>
> ```bash
> brew install gh
> ```
>
> **Ubuntu/Debian:**
>
> ```bash
> sudo apt install gh
> ```
>
> **Windows (winget):**
>
> ```powershell
> winget install GitHub.cli
> ```
>
> Official installation docs: [cli.github.com](https://cli.github.com)

### 1. Verify `gh` again before installing the extension

Run:

```bash
gh --version
```

You should still see output that starts with `gh version 2.`.

### 2. Install the `gh-aw` extension

```bash
gh extension install githubnext/gh-aw
```

If the extension is already installed, you can update it instead:

```bash
gh extension upgrade githubnext/gh-aw
```

### 3. Confirm installation

```bash
gh extension list
```

You should see an entry for `githubnext/gh-aw`.

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install githubnext/gh-aw` ran without errors
- [ ] `gh extension list` shows `githubnext/gh-aw`

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
