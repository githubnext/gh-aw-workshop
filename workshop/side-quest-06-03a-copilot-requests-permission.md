<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Method 1 — Copilot Requests Permission

> _Optional: use this method when the organization that owns your practice repository has centralized Copilot billing enabled for GitHub Actions. Otherwise, use [Method PAT](side-quest-06-03b-copilot-github-token.md)._

## 📋 Before You Start

- An organization owns your practice repository.
- An organization administrator confirmed centralized Copilot billing is enabled for GitHub Actions.
- You completed [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md) and confirmed Method 1 applies to your repository.
- Your practice repository was created in [Step 3](03-create-your-repo.md).

This is the simplest way to give your agentic workflow Copilot API access when the organization can bill Copilot requests through the workflow run token. GitHub Actions already issues every run a short-lived token — you just need to grant it the [`copilot-requests: write`](https://github.github.com/gh-aw/reference/permissions/#special-permission-copilot-requests-write) permission.

It does **not** cover personal repositories or organizations without centralized billing. In those cases, use `COPILOT_GITHUB_TOKEN` with [Method 2](side-quest-06-03b-copilot-github-token.md).

## Confirm this method matches your repository

If you have not confirmed the billing setting yet, ask your organization administrator before you choose this method.

- Continue with Method 1 if an organization owns the repository and its administrator confirmed centralized Copilot billing is enabled.
- Stop here and switch to [Method PAT](side-quest-06-03b-copilot-github-token.md) for a personal repository or an organization without centralized billing.

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

That single line is the only workflow authentication change required for repositories that can use Method 1. Recompile and commit the lock file after changing the source workflow.

## ✅ Checkpoint

- [ ] I confirmed the owning organization has centralized Copilot billing enabled
- [ ] `copilot-requests: write` is present under `permissions` in your workflow frontmatter
- [ ] I recompiled and committed the matching lock file
- [ ] You did not need to create any repository secret

<!-- journey: all -->
**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md) | [Back to auth overview](side-quest-06-03-copilot-token.md)
<!-- /journey -->

## Troubleshooting

<details>
<summary>Common failures and fixes</summary>

| Failure | What you see | Fix |
|---|---|---|
| Organization does not have centralized Copilot billing | `401 Unauthorized` or repeated Copilot auth failures even though `copilot-requests: write` is present | Switch to [Method 2](side-quest-06-03b-copilot-github-token.md) |
| `copilot-requests: write` missing from frontmatter | `401 Unauthorized` in the run log | Add `copilot-requests: write` under `permissions` in your workflow `.md` file |
| No active Copilot subscription | `403 Forbidden` or "Copilot not available" | Visit [github.com/settings/copilot](https://github.com/settings/copilot) and confirm a plan is listed |
| Org policy blocks Copilot access | `403 Forbidden` | Ask your GitHub org admin to enable Copilot model access for your account |

Work through these checks in order if the run still fails:

1. Confirm the owning organization has centralized Copilot billing. If it does not, switch to [Method 2](side-quest-06-03b-copilot-github-token.md).
2. Open your workflow `.md` file and confirm `copilot-requests: write` is present under `permissions`.
3. Verify the Copilot access that backs this repository is active.
4. If you are in an enterprise-managed organization, confirm the org Copilot policy allows agentic workflows — see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

</details>
