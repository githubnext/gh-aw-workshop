# Side Quest: Configure GitHub Copilot for Agentic Workflows

> _Optional: work through this guide when you want to understand how GitHub Copilot authenticates with agentic workflows, or when you need to set up a `COPILOT_GITHUB_TOKEN` secret for your repository, then return to your main path._

Agentic workflows that use the Copilot engine (the default) need to authenticate with GitHub Copilot at runtime. There are two ways to configure this — a modern, zero-secret approach and a legacy secret-based approach.

---

## ⚠️ Most Common Failures (Read First)

These are the mistakes that trip up learners most often. Read them before you start — they will save you time.

| Failure | What you see | Fix |
|---|---|---|
| `copilot-requests: write` missing from frontmatter | `401 Unauthorized` in the run log | Add `copilot-requests: write` under `permissions` in your workflow `.md` file |
| No active Copilot subscription | `403 Forbidden` or "Copilot not available" | Visit [github.com/settings/copilot](https://github.com/settings/copilot) and confirm a plan is listed |
| Org policy blocks Copilot access | `403 Forbidden` | Ask your GitHub org admin to enable Copilot model access for your account |
| Token copied incorrectly (leading/trailing space) | `401 Unauthorized` | Delete and re-create the repository secret, paste carefully without extra whitespace |
| Wrong secret name (case, typo) | Workflow silently uses no token or falls back to a 401 | Secret name must be exactly `COPILOT_GITHUB_TOKEN` — uppercase, underscores only |
| PAT expired | `401 Unauthorized` after working previously | Generate a new PAT and update the repository secret |
| PAT missing `copilot` scope | `403 Forbidden` | Re-generate the token with the `copilot` scope checked |

---

---

## 📋 Before You Start

Before configuring Copilot authentication, confirm the following:

- [ ] You arrived here from **Step 6** (Install the gh-aw CLI Extension) or **Step 11a** (Add a Copilot-powered step to your workflow).
- [ ] You have an **active GitHub Copilot subscription** on the account that owns the repository (required for Method 1 — check at [github.com/settings/copilot](https://github.com/settings/copilot)).
- [ ] Your workflow file is open and ready to edit.

---

## Choose your authentication method

| Method | What you need | When to use it |
|---|---|---|
| **Copilot requests permission** (recommended) | An active GitHub Copilot subscription on your account | Most workflows — no secret to manage |
| **`COPILOT_GITHUB_TOKEN` secret** | A PAT with Copilot access stored as a repository secret | Older workflows, org-level overrides, or automation that can't use the copilot requests permission |

---

## Method 1 — Copilot requests permission (recommended)

This method uses the GitHub Actions token that every workflow run already has. No additional secret is required.

Add the following to your workflow frontmatter:

```yaml
permissions:
  copilot-requests: write   # Required: grants the workflow Copilot API access
```

With this in place, the workflow authenticates automatically using `${{ github.token }}` — the same token GitHub Actions uses for all other API calls in the same run.

> [!IMPORTANT]
> Your GitHub account must have an active GitHub Copilot subscription. The token inherits Copilot access from the account that owns the repository. If you are running inside a GitHub organization, the organization Copilot policy must allow agentic workflows.

<!-- -->

> [!TIP]
> The `copilot` engine is the default — you don't need to write `engine: copilot` explicitly. If your frontmatter has `copilot-requests: write`, the workflow is already configured.

### ✅ Verify it works

After adding `copilot-requests: write` to your workflow frontmatter, trigger your workflow manually:

1. Go to your repository on GitHub and click the **Actions** tab.
2. Select your workflow from the left sidebar and click **Run workflow**.
3. Watch the run — if the Copilot step completes without a `401 Unauthorized` error, your token is configured correctly.

You can also confirm your account's Copilot access before running:

```bash
gh auth status
```

Look for the `copilot` scope in the output, or verify your plan is active at [github.com/settings/copilot](https://github.com/settings/copilot).

---

## Method 2 — `COPILOT_GITHUB_TOKEN` secret

Use this method if you prefer a dedicated token, need to authenticate with a service account, or are working with a workflow that predates the copilot requests permission.

### Create a Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) and click **Generate new token (classic)**.
2. Give it a descriptive name, for example `gh-aw-copilot`.
3. Set an expiry — **90 days** is a reasonable default. Note the expiry date somewhere so you can rotate it before it expires.
4. Select the `copilot` scope. No other scopes are required.
5. Click **Generate token**.

> [!IMPORTANT]
> GitHub shows the token value **only once**. Copy it to your clipboard immediately — before you navigate away or close the tab. If you miss this window, you must generate a new token.

<!-- -->

> [!NOTE]
> The `copilot` scope grants API access to GitHub Copilot features. It does not grant any repository or organisation permissions.

### Store the token as a repository secret

Do this immediately after copying the token value — do not close the token page until you have saved it as a secret.

1. Open your repository on GitHub in a **new tab** so you keep the token page open.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Enter the name **`COPILOT_GITHUB_TOKEN`** (uppercase, underscores only — no spaces, no hyphens).
5. Paste the token value. Check that no extra whitespace was added at the start or end.
6. Click **Add secret**.
7. Confirm the secret appears in the list as `COPILOT_GITHUB_TOKEN`.

> [!TIP]
> If you are unsure whether you copied the token correctly, delete the secret and start over — it only takes 30 seconds and avoids a hard-to-diagnose 401 error later.

### Verify your frontmatter

With the secret stored, the Copilot engine picks it up automatically. You still need `copilot-requests: write` in your permissions block:

```yaml
permissions:
  copilot-requests: write
```

### 🔍 Test your secret

Trigger a run to confirm the secret is wired up correctly:

1. Go to the **Actions** tab in your repository and run your workflow manually.
2. Open the run and expand the Copilot step's logs.
3. Look for a line like `Authenticated with COPILOT_GITHUB_TOKEN` — this confirms that the engine found and used your secret.

If you see a `401 Unauthorized` error:

- Verify the secret name is exactly `COPILOT_GITHUB_TOKEN`.
- Verify the PAT has the `copilot` scope at [github.com/settings/tokens](https://github.com/settings/tokens).
- Verify the PAT has not expired.
- If in doubt, generate a fresh PAT and replace the secret.

---

## 🛠️ Troubleshooting

<details>
<summary>401 Unauthorized — Copilot step fails immediately</summary>

Work through these checks in order:

1. Open `.github/workflows/hello-agent.md` (or your workflow file) and confirm `copilot-requests: write` is present under `permissions`.
2. Verify your GitHub account has an active Copilot subscription at [github.com/settings/copilot](https://github.com/settings/copilot).
3. If you are using `COPILOT_GITHUB_TOKEN`: go to **Settings → Secrets and variables → Actions** and confirm the secret exists with that exact name.
4. If you are using `COPILOT_GITHUB_TOKEN`: open [github.com/settings/tokens](https://github.com/settings/tokens) and check the token has the `copilot` scope and has not expired.
5. If all looks correct but the error persists, delete and re-create the secret with a freshly generated token.

</details>

<details>
<summary>403 Forbidden — access blocked by organisation policy</summary>

Enterprise and organisation accounts can restrict Copilot model access. If you see a 403:

1. Confirm you have a Copilot seat in your organisation (**Settings → Copilot**).
2. Ask your GitHub org admin to verify that the Copilot policy allows agentic workflows for your account.
3. See [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) for a full checklist.

</details>

<details>
<summary>Token generated but I forgot to copy it</summary>

You cannot retrieve the token value after closing the page. Go back to [github.com/settings/tokens](https://github.com/settings/tokens), delete the old token, generate a new one, and immediately save it as a repository secret before navigating away.

</details>

<details>
<summary>Workflow worked before but fails with 401 after a while</summary>

Your PAT has likely expired. Generate a new one (same steps as Method 2 above), then go to **Settings → Secrets and variables → Actions**, click on `COPILOT_GITHUB_TOKEN`, and choose **Update** to replace the value.

</details>

---

## ✅ Checkpoint

- [ ] You understand the difference between the copilot requests permission method and the `COPILOT_GITHUB_TOKEN` method
- [ ] Your workflow frontmatter has `copilot-requests: write` under `permissions`
- [ ] If using the secret method: `COPILOT_GITHUB_TOKEN` is stored as a repository secret
- [ ] Your GitHub account has an active Copilot subscription

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) or [Write Your First Agentic Workflow](07-your-first-workflow.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
