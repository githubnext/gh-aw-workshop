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

## Steps

> [!IMPORTANT]
> **Run these pre-flight checks before installing `gh-aw`.**
>
> **1 — Verify your GitHub CLI authentication** (the extension install will fail if you skip this):
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

- **macOS (Homebrew):** `brew install gh`
- **Ubuntu/Debian:** `sudo apt install gh`
- **Windows (winget):** `winget install GitHub.cli`

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

If `gh extension install` fails with an error such as:

```
error connecting to api.github.com: HTTP 401: Bad credentials
```

or:

```
failed to authenticate to api.github.com
```

you are not logged in to the GitHub CLI. Run:

```bash
gh auth login
gh auth status
```

Re-run `gh auth status` and confirm you see `Logged in to github.com`, then retry the extension install.

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
