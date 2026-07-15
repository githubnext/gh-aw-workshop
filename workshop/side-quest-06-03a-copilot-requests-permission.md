# Side Quest: Method 1 — Copilot Requests Permission

> _Optional: use this method when your practice repository is owned by your personal account, or by an enterprise-managed org that can bill Copilot requests through GitHub Actions. If your repository belongs to a regular GitHub organization, use [Method 2](side-quest-06-03b-copilot-github-token.md) instead._

This is the simplest way to give your agentic workflow Copilot API access when the repository owner can bill Copilot requests through the workflow run token. GitHub Actions already issues every run a short-lived token — you just need to grant it the `copilot-requests: write` permission.

It does **not** cover regular organization-owned repositories that rely on an individual member's Copilot subscription. In that case, add `COPILOT_GITHUB_TOKEN` with [Method 2](side-quest-06-03b-copilot-github-token.md).

## Confirm this method matches your repository

- Continue with Method 1 if your practice repository is owned by your personal account.
- Continue with Method 1 if your repository is in an enterprise-managed org and your org admin enabled Copilot access for Actions runs.
- Stop here and switch to [Method 2](side-quest-06-03b-copilot-github-token.md) if your repository is owned by a regular GitHub organization.

## Add the permission to your workflow

Open your workflow `.md` file and add `copilot-requests: write` under the `permissions` block in the YAML frontmatter:

```yaml
---
name: my-workflow
on:
  workflow_dispatch:
permissions:
  contents: read
  copilot-requests: write   # grants Copilot API access — no secret needed
---
```

That single line is the only workflow change required for repositories that can use Method 1.

## Run your workflow

Trigger a manual run from the GitHub Actions web UI to confirm the permission works:

1. Go to your repository on GitHub and click the **Actions** tab.
2. Select your workflow in the left sidebar.
3. Click **Run workflow** → **Run workflow**.
4. Open the run once it starts and expand the Copilot step logs.
5. Confirm the step completes without a `401 Unauthorized` error.

You can also verify the Copilot access that backs this repository before running:

```bash
gh auth status
```

If the repository is in your personal account, look for the `copilot` scope in the output or confirm your plan is active at [github.com/settings/copilot](https://github.com/settings/copilot).

If the repository is in an enterprise-managed org, confirm your org admin enabled Copilot access for your account and for Actions-based usage.

## ✅ Checkpoint

- [ ] I confirmed Method 1 matches my repository owner (personal account or supported enterprise org)
- [ ] `copilot-requests: write` is present under `permissions` in your workflow frontmatter
- [ ] I confirmed the Copilot access that backs this repository is active
- [ ] A manual workflow run completed without a `401 Unauthorized` error
- [ ] You did not need to create any repository secret

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md) | [Back to auth overview](side-quest-06-03-copilot-token.md)

## Troubleshooting

<details>
<summary>Common failures and fixes</summary>

| Failure | What you see | Fix |
|---|---|---|
| Repository belongs to a regular GitHub organization | `401 Unauthorized` or repeated Copilot auth failures even though `copilot-requests: write` is present | Switch to [Method 2](side-quest-06-03b-copilot-github-token.md) and add `COPILOT_GITHUB_TOKEN` |
| `copilot-requests: write` missing from frontmatter | `401 Unauthorized` in the run log | Add `copilot-requests: write` under `permissions` in your workflow `.md` file |
| No active Copilot subscription | `403 Forbidden` or "Copilot not available" | Visit [github.com/settings/copilot](https://github.com/settings/copilot) and confirm a plan is listed |
| Org policy blocks Copilot access | `403 Forbidden` | Ask your GitHub org admin to enable Copilot model access for your account |

Work through these checks in order if the run still fails:

1. Confirm the repository owner matches Method 1. If the repository belongs to a regular GitHub organization, switch to [Method 2](side-quest-06-03b-copilot-github-token.md).
2. Open your workflow `.md` file and confirm `copilot-requests: write` is present under `permissions`.
3. Verify the Copilot access that backs this repository is active.
4. If you are in an enterprise-managed organization, confirm the org Copilot policy allows agentic workflows — see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

</details>
