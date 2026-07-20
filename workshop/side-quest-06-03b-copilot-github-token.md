---
journey: all
adventure: side-quest
---
# Side Quest: Method 2 — COPILOT_GITHUB_TOKEN Secret

> _Optional: use this method for personal billing, or when the organization that owns the repository does not have centralized Copilot billing enabled._

This method stores a Personal Access Token (PAT) as a repository secret named [`COPILOT_GITHUB_TOKEN`](https://github.github.com/gh-aw/reference/auth/#copilotgithubtoken). The agentic workflow engine picks it up automatically. For background on PAT types and when to use each, see the [auth overview](side-quest-06-03-copilot-token.md).

If you want an all-UI path with no terminal commands, use [Method 2 (UI-only)](side-quest-06-03c-copilot-github-token-ui-only.md).

## 📋 Before You Start

- You have a GitHub account with an active Copilot subscription.
- You have read [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md) and chosen Method 2.

## Shortest terminal path

If your workflow currently includes `copilot-requests: write`, remove that line first. When it is present, the workflow ignores `COPILOT_GITHUB_TOKEN` for inference.

Then run:

```bash
gh aw secrets bootstrap --engine copilot
```

This guided flow checks whether the secret is missing, walks you through creating or pasting a valid [fine-grained PAT](https://github.github.com/gh-aw/reference/auth/#copilot-default), and stores it as `COPILOT_GITHUB_TOKEN`.

If you prefer to create and store the PAT manually, follow the full procedure below.

## ✏️ Sub-exercise A: Generate the token manually

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) and click **Generate new token (fine-grained)**.
2. Name the token (for example, `gh-aw-copilot`) and set an expiry (90 days is a common default).
3. For a public workshop repository, choose **Public repositories**. For a private workshop repository, choose **Only select repositories** and select it.
4. Under **Permissions** → **Account permissions**, set **Copilot requests** to **Read-only**.
5. Click **Generate token** and copy the value immediately — GitHub shows it only once.

> [!IMPORTANT]
> Copy the token before you navigate away or close the tab. If you miss this window, you must generate a new token.

Add a rotation reminder so you remember to renew the token before it expires:

```bash
printf 'Rotate COPILOT_GITHUB_TOKEN by YYYY-MM-DD\n' >> ~/copilot-token-rotation.txt
```

Replace `YYYY-MM-DD` with your token expiry date.

- [ ] I copied the token value before leaving the page
- [ ] I noted the token rotation date

## ✏️ Sub-exercise B: Store the secret manually

Store the token as a repository secret:

```bash
gh secret set COPILOT_GITHUB_TOKEN
```

This prompts for the token value interactively. Alternatively, follow the complete UI steps in [Method 2 (UI-only)](side-quest-06-03c-copilot-github-token-ui-only.md).

**Try it — verify the secret was saved:**

```bash
gh secret list | grep COPILOT_GITHUB_TOKEN
```

You should see `COPILOT_GITHUB_TOKEN` in the output. Once confirmed, you can safely close the token tab.

- [ ] `COPILOT_GITHUB_TOKEN` appears in the repository secrets list
- [ ] I closed the token tab only after confirming the secret was saved

## Select the token in your workflow

If you have not already done so, remove `copilot-requests: write` from the source workflow. When that permission is present, the workflow ignores `COPILOT_GITHUB_TOKEN` for inference.

```bash
gh aw compile
git add .github/workflows/
git commit -m "Use personal Copilot billing"
git push
```

The compile updates the lock file so it uses the token-based method.

## ✅ Checkpoint

- [ ] You generated a fine-grained PAT with **Copilot requests: Read-only** under **Account permissions**
- [ ] `COPILOT_GITHUB_TOKEN` exists in your repository's Actions secrets
- [ ] `gh secret list` confirms the secret is present
- [ ] `copilot-requests: write` is not present in the source workflow
- [ ] The recompiled source and lock files are committed
- [ ] You noted the PAT expiry date and have a rotation reminder

<!-- journey: all -->
Need a refresher on when to choose Method 2 or how this fits your auth setup? Go back to [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md).
<!-- /journey -->

<!-- journey: all -->
**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md)
<!-- /journey -->
