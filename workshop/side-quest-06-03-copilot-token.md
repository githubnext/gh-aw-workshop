# Side Quest: Configure GitHub Copilot for Agentic Workflows

> _Optional: work through this guide when you want to understand how GitHub Copilot authenticates with agentic workflows, or when you need to set up a `COPILOT_GITHUB_TOKEN` secret for your repository, then return to your main path._

Agentic workflows that use the Copilot engine (the default) need to authenticate with GitHub Copilot at runtime. There are two ways to configure this — a modern, zero-secret approach and a legacy secret-based approach.

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

---

## Method 2 — `COPILOT_GITHUB_TOKEN` secret

Use this method if you prefer a dedicated token, need to authenticate with a service account, or are working with a workflow that predates the copilot requests permission.

### Create a Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) and click **Generate new token (classic)**.
2. Give it a descriptive name, for example `gh-aw-copilot`.
3. Set an expiry (90 days is a reasonable default).
4. Select the `copilot` scope.
5. Click **Generate token** and copy the value immediately — you won't see it again.

> [!NOTE]
> The `copilot` scope grants API access to GitHub Copilot features. It does not grant any repository or organization permissions.

### Store the token as a repository secret

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Set the name to `COPILOT_GITHUB_TOKEN` and paste the token value.
5. Click **Add secret**.

### Verify your frontmatter

With the secret stored, the Copilot engine picks it up automatically. You still need `copilot-requests: write` in your permissions block:

```yaml
permissions:
  copilot-requests: write
```

---

## Verify Copilot access

You can confirm that your account has an active Copilot subscription by running:

```bash
gh auth status
```

Look for a line that mentions the `copilot` scope or check that your Copilot plan is active at [github.com/settings/copilot](https://github.com/settings/copilot).

> [!TIP]
> If the workflow fails with a `401 Unauthorized` error on the Copilot step, the most common cause is either a missing Copilot subscription or the `copilot-requests: write` permission being absent from the frontmatter.

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
