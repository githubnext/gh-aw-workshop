# Side Quest: Method 2 (UI-only) — COPILOT_GITHUB_TOKEN Secret

> _Optional: use this method when you need a dedicated PAT for Copilot access and want to complete setup entirely in the GitHub web UI. If your repository is in your personal account or a supported enterprise org, prefer [Method 1](side-quest-06-03a-copilot-requests-permission.md) instead._

This method stores a fine-grained Personal Access Token (PAT) as a repository secret named `COPILOT_GITHUB_TOKEN`. The agentic workflow engine picks it up automatically.

## 📋 Before You Start

- You have a GitHub account with an active Copilot subscription.
- You have read [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md) and chosen Method 2.

## ✏️ Sub-exercise A: Generate the token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) and click **Generate new token (fine-grained)**.
2. Name the token (for example, gh-aw-copilot) and set an expiry (90 days is a common default). Consider setting a reminder (for example, in your calendar or task app) so you rotate the token before it expires.
3. Set **Repository access** based on your workshop repository visibility:
   - For a public repository, choose **Public repositories**.
   - For a private repository, choose **Only select repositories** and pick your repository.
4. Under Permissions → **Account permissions**, set Copilot requests to Read-only.
5. Click **Generate token** and copy the value immediately. GitHub shows it only once.

> [!IMPORTANT]
> Copy the token before you navigate away or close the tab. If you miss this window, you must generate a new token.

**Verify:** The token value is visible on screen and copied to your clipboard before continuing.

Quick check:

- [ ] I can see a newly created PAT in my token list
- [ ] I copied the token value before leaving the page
- [ ] I noted the token expiry date

## ✏️ Sub-exercise B: Store the secret

Open your repository in a new tab so you keep the token page open until the secret is saved.

1. In your repository, open **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Enter the name `COPILOT_GITHUB_TOKEN` (uppercase with underscores).
4. Paste the token value and verify no extra spaces were added before or after the token string.
5. Click **Add secret**.
6. Confirm the secret appears in the list as `COPILOT_GITHUB_TOKEN`.

**Verify:** `COPILOT_GITHUB_TOKEN` appears in the Secrets list — then you can safely close the token tab.

Quick check:

- [ ] The secret name is exactly `COPILOT_GITHUB_TOKEN`
- [ ] The secret now appears in the repository Actions secrets list
- [ ] I closed the token tab only after confirming the secret was saved

## Run your workflow

1. Open the **Actions** tab in your repository.
2. Select your workflow and click Run workflow.
3. Open the run and expand the Copilot step logs.
4. Confirm the Copilot step completes without 401 Unauthorized or 403 Forbidden.

## ✅ Checkpoint

- [ ] You generated a new fine-grained PAT and copied it before leaving the token page
- [ ] The token has **Copilot requests: Read-only** under **Account permissions**
- [ ] `COPILOT_GITHUB_TOKEN` exists in **Settings** → **Secrets and variables** → **Actions**
- [ ] A manual workflow run completed after you added the secret
- [ ] The run logs show the Copilot step completed without 401 Unauthorized or 403 Forbidden
- [ ] You noted the PAT expiry date and a rotation reminder
- [ ] You understand when to use Method 1 vs Method 2 (use the [auth overview](side-quest-06-03-copilot-token.md) if needed)

Need a refresher on when to choose Method 2 or how this fits your auth setup? Go back to [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md).

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md)
