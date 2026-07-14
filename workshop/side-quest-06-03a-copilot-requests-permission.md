# Side Quest: Method 1 — Copilot Requests Permission

> _Optional: use this method when you want zero-secret Copilot authentication for your agentic workflow. Requires an active GitHub Copilot subscription on the account that owns the repository._

This is the recommended way to give your agentic workflow Copilot API access. GitHub Actions already issues every run a short-lived token — you just need to grant it the `copilot-requests: write` permission.

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

That single line is the only change required.

## Run your workflow

Trigger a manual run from the GitHub Actions web UI to confirm the permission works:

1. Go to your repository on GitHub and click the **Actions** tab.
2. Select your workflow in the left sidebar.
3. Click **Run workflow** → **Run workflow**.
4. Open the run once it starts and expand the Copilot step logs.
5. Confirm the step completes without a `401 Unauthorized` error.

You can also verify your account has an active Copilot subscription before running:

```bash
gh auth status
```

Look for the `copilot` scope in the output, or confirm your plan is active at [github.com/settings/copilot](https://github.com/settings/copilot).

## ✅ Checkpoint

- [ ] `copilot-requests: write` is present under `permissions` in your workflow frontmatter
- [ ] Your GitHub account has an active Copilot subscription (confirmed at [github.com/settings/copilot](https://github.com/settings/copilot))
- [ ] A manual workflow run completed without a `401 Unauthorized` error
- [ ] You did not need to create any repository secret

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md) | [Back to auth overview](side-quest-06-03-copilot-token.md)

## Troubleshooting

<details>
<summary>Common failures and fixes</summary>

| Failure | What you see | Fix |
|---|---|---|
| `copilot-requests: write` missing from frontmatter | `401 Unauthorized` in the run log | Add `copilot-requests: write` under `permissions` in your workflow `.md` file |
| No active Copilot subscription | `403 Forbidden` or "Copilot not available" | Visit [github.com/settings/copilot](https://github.com/settings/copilot) and confirm a plan is listed |
| Org policy blocks Copilot access | `403 Forbidden` | Ask your GitHub org admin to enable Copilot model access for your account |

Work through these checks in order if the run still fails:

1. Open your workflow `.md` file and confirm `copilot-requests: write` is present under `permissions`.
2. Verify your GitHub account has an active Copilot subscription at [github.com/settings/copilot](https://github.com/settings/copilot).
3. If you are in a GitHub organization, confirm the org Copilot policy allows agentic workflows — see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

</details>
