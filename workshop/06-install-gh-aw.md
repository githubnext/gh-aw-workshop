# Step 6: Install the gh-aw CLI Extension

> [!CAUTION]
> **Before you continue:** Run the check below. If it shows ❌, complete
> [Adventure A §4 — Authenticate the gh CLI](02a-setup-codespace.md#4-authenticate-the-gh-cli)
> or
> [Adventure B §5 — Authenticate the gh CLI](02b-setup-local.md#5-authenticate-the-gh-cli)
> before installing `gh-aw`.
>
> ```bash
> gh auth status && echo "✅ ready" || echo "❌ run: gh auth login"
> ```
>
> The extension install will fail if you are not logged in.
>
> _You're ready to add agentic workflow commands to your `gh` CLI._

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

> [!IMPORTANT]
> Confirm `gh` is installed before installing `gh-aw`:
>
> ```bash
> gh --version && echo "✅ gh installed" || echo "❌ install gh first"
> ```

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

## Troubleshooting

### Not authenticated

If `gh auth status` reports you are not logged in, run:

```bash
gh auth login
gh auth status
```

### Behind a corporate proxy

Set proxy environment variables in your current shell, then retry:

```bash
export HTTPS_PROXY="http://proxy.company.com:8080"
export HTTP_PROXY="$HTTPS_PROXY"
export NO_PROXY="127.0.0.1,localhost,.company.com"
gh config set git_protocol https
gh auth status
gh extension install github/gh-aw
```

### GHE/GHES endpoint

For GitHub Enterprise Server, authenticate against your hostname and use HTTPS:

```bash
gh config set git_protocol https --host ghes.example.com
gh auth login --hostname ghes.example.com --scopes "repo,read:org,workflow"
gh extension install github/gh-aw --hostname ghes.example.com
gh auth status --hostname ghes.example.com
```

If your administrator requires different scopes, use the minimum required scopes they provide.

### Extension download fails

If `gh extension install github/gh-aw` fails with a network error on a locked-down network:

1. Download the matching release artifact from
   [github/gh-aw releases](https://github.com/github/gh-aw/releases).
2. Extract it on a machine that can reach GitHub.
3. Move the extracted extension folder to your workshop machine and install from local path:

```bash
gh extension install /path/to/gh-aw
gh extension list
```

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] `gh extension install github/gh-aw` ran without errors
- [ ] `gh extension list` shows `github/gh-aw`

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
