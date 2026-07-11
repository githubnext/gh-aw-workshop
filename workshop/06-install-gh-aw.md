# Step 6: Install the gh-aw CLI Extension

> _You're ready to add agentic workflow commands to your `gh` CLI._

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed and then install the `gh-aw`
extension so you can compile and run agentic workflows from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory

## Steps

> [!IMPORTANT]
> **Required:** `gh` CLI must already be installed before you can run
> `gh extension install`.
>
> Verify now:
>
> ```bash
> gh --version
> ```
>
> Expected output starts with `gh version 2.` (for example, `gh version 2.75.0`).
>
> If `gh` is missing, go back to
> [Step 1: What You Need Before We Start](01-prerequisites.md) for the install
> commands and full setup docs.

### 1. Install the `gh-aw` extension

```bash
gh extension install githubnext/gh-aw
```

If the extension is already installed, you can update it instead:

```bash
gh extension upgrade githubnext/gh-aw
```

### 2. Confirm installation

```bash
gh extension list
```

You should see an entry for `githubnext/gh-aw`.

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install githubnext/gh-aw` ran without errors
- [ ] `gh extension list` shows `githubnext/gh-aw`

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
