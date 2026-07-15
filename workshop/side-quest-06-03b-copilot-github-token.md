# Side Quest: Method 2 — COPILOT_GITHUB_TOKEN Secret

> _Optional: use this method when you need a dedicated PAT for Copilot access — for example, a repository owned by a regular GitHub organization, a service account, an older workflow, or an org-level override. If your repository is in your personal account or a supported enterprise org, prefer [Method 1](side-quest-06-03a-copilot-requests-permission.md) instead._

This method stores a Personal Access Token (PAT) with the `copilot` scope as a repository secret named `COPILOT_GITHUB_TOKEN`. The agentic workflow engine picks it up automatically.

## 📋 Before You Start

- You have a GitHub account with an active Copilot subscription.
- You have read [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md) and chosen Method 2.

## ✏️ Exercise: Generate a token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) and click **Generate new token (classic)**.
2. Give it a name, for example `gh-aw-copilot`.
3. Set an expiry — 90 days is a reasonable default. Add a calendar reminder for that date so you remember to rotate the token before it expires.
4. Select the `copilot` scope. No other scopes are required.
5. Click **Generate token** and **copy the value immediately** — GitHub shows it only once.

> [!IMPORTANT]
> Copy the token before you navigate away or close the tab. If you miss this window, you must generate a new token.

**Verify:** The token value is visible on screen and copied to your clipboard before continuing.

## ✏️ Exercise: Add the secret

Open your repository in a **new tab** so you keep the token page open until the secret is saved.

1. In your repository, click **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Enter the name **`COPILOT_GITHUB_TOKEN`** — uppercase, underscores only, no spaces or hyphens.
4. Paste the token value. Confirm no extra whitespace was added at the start or end.
5. Click **Add secret**.
6. Confirm the secret appears in the list as `COPILOT_GITHUB_TOKEN`.

**Verify:** `COPILOT_GITHUB_TOKEN` appears in the Secrets list — then you can safely close the token tab.

## Add the permission to your workflow

Your workflow still needs `copilot-requests: write` in the frontmatter:

```yaml
---
name: my-workflow
on:
  workflow_dispatch:
permissions:
  contents: read
  copilot-requests: write   # required even when using COPILOT_GITHUB_TOKEN
---
```

## Run your workflow

Trigger a manual run to confirm the secret is wired up correctly:

1. Go to the **Actions** tab in your repository.
2. Select your workflow and click **Run workflow** → **Run workflow**.
3. Open the run and expand the Copilot step logs.
4. Look for a line containing `COPILOT_GITHUB_TOKEN` in the log output — this confirms the engine found and used your secret.

## ✅ Checkpoint

- [ ] You generated a PAT with the `copilot` scope at [github.com/settings/tokens](https://github.com/settings/tokens)
- [ ] `COPILOT_GITHUB_TOKEN` is stored as a repository secret (exact name, no spaces or hyphens)
- [ ] Your workflow frontmatter has `copilot-requests: write` under `permissions`
- [ ] A manual run completed and the Copilot step shows it authenticated with `COPILOT_GITHUB_TOKEN`

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md) | [Back to auth overview](side-quest-06-03-copilot-token.md)

## Troubleshooting

<details>
<summary>Common failures and fixes</summary>

| Failure | What you see | Fix |
|---|---|---|
| Wrong secret name (case, typo) | Workflow silently uses no token or falls back to a 401 | Secret name must be exactly `COPILOT_GITHUB_TOKEN` — uppercase, underscores only |
| Token copied incorrectly (leading/trailing space) | `401 Unauthorized` | Delete and re-create the repository secret, paste carefully without extra whitespace |
| PAT missing `copilot` scope | `403 Forbidden` | Re-generate the token with the `copilot` scope checked |
| PAT expired | `401 Unauthorized` after working previously | Generate a new PAT and update the repository secret |

Work through these checks if a run fails with `401 Unauthorized`:

1. In **Settings → Secrets and variables → Actions**, confirm the secret exists with the exact name `COPILOT_GITHUB_TOKEN`.
2. At [github.com/settings/tokens](https://github.com/settings/tokens), confirm the PAT has the `copilot` scope and has not expired.
3. If in doubt, delete the secret, generate a fresh PAT, and re-add the secret — it takes less than two minutes.

</details>
