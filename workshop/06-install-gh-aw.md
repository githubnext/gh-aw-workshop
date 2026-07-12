# Step 6: Install the gh-aw CLI Extension

> [!NOTE]
> **Using the GitHub Copilot cloud agent?** `gh aw` may already be available in
> your environment. Run `gh aw --version` first — if it returns a version number,
> you can skip straight to [Check if already installed](#check-if-already-installed).

<!-- -->

## 🎯 What You'll Do

You'll verify the `gh` CLI is installed and then install the `gh-aw`
extension so you can compile and run agentic workflows from your terminal.

## 📋 Before You Start

- You've completed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
- You're inside your `my-agentic-workflows` repository directory
- You have authenticated the `gh` CLI with `gh auth login`
  (done in [Verify GitHub authentication](02a-setup-codespace.md#verify-github-authentication)
  or [Authenticate the `gh` CLI](02b-setup-local.md#authenticate-the-gh-cli))

## Choose your path

Use the path that matches your tool before you run any install command:

| I am using... | Do this |
| --- | --- |
| Cloud agent or VS Code Copilot extension | [Check if already installed](#check-if-already-installed) |
| `copilot-app` | [Open a Codespace (`copilot-app` users)](#open-a-codespace-copilot-app-users) |
| Local terminal or standard Codespace terminal | [Install from terminal](#install-from-terminal) |

## Check if already installed

Run this first:

```bash
gh aw --version
```

If you get a version number, skip to [Confirm installation](#confirm-installation).

If the command is not found:

- If you are using `copilot-app`, first complete [Open a Codespace (`copilot-app` users)](#open-a-codespace-copilot-app-users)
- Then continue with [Install from terminal](#install-from-terminal)

## Open a Codespace (`copilot-app` users)

If you are using `copilot-app`, you must open a Codespace to run install commands in its terminal:

- [Open the Codespace](02a-setup-codespace.md#open-the-codespace)
- Return to this step and continue with [Install from terminal](#install-from-terminal)

## Install from terminal

> [!TIP]
> **Using VS Code?** Open the integrated terminal with `` Ctrl+` `` (macOS: `` Cmd+` ``),
> then run all `gh aw` commands there. If a command is unfamiliar, try:
> `gh copilot suggest "how do I install a gh extension"`

<!-- -->

> [!IMPORTANT]
> **Pre-flight checklist (run these in order):**
> - ✅ `gh --version` returns output (if not, complete [Step 1 (Prerequisites)](01-prerequisites.md))
> - ✅ `gh auth status` shows you are logged in
> - ⚠️ If you're in an org-owned Codespace, see the HTTP 403 workaround in the following callout before the standard install command.

<!-- -->

> [!IMPORTANT]
> **Getting HTTP 403?** You're likely in an organization-owned Codespace.
> Run this fallback instead:
> ```bash
> curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
> ```

Then install the extension:

```bash
gh extension install github/gh-aw
```

If the extension is already installed, you can update it instead:

```bash
gh extension upgrade github/gh-aw
```

### Confirm installation

```bash
gh extension list
```

You should see an entry for `github/gh-aw`.

### Verify `gh aw` is available

```bash
gh aw --version
```

Example success output:

```text
gh-aw version 0.81.6
```

## Troubleshooting

Most installs work on the first try after `gh auth status` and `gh extension install github/gh-aw`.
If you hit auth, proxy, GHES hostname, or locked-down-network errors, use the optional troubleshooting side quest.

> [!TIP]
> Need copy-paste fixes? Open [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md), then come back here.

## ✅ Checkpoint

- [ ] `gh --version` returns a `gh version 2.x.x` value
- [ ] Either `gh extension install github/gh-aw` worked, or you used the install script fallback for Codespaces org-token 403 errors
- [ ] `gh extension list` shows `github/gh-aw`
- [ ] `gh aw --version` returns a version number (e.g. `gh-aw version 0.81.6` or later)

**Next:** [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md)
