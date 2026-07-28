<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at the Organisation Level

> _Scaling agentic workflows beyond one repository means putting guardrails in place so teams can move fast without breaking things._

## 🎯 What You'll Do

Configure organisation-level policies that control where, when, and how agentic workflows can run. You will set environment protection rules, limit which repositories can call the Copilot cloud agent, and review the key settings that enterprise admins need to understand.

## 📋 Before You Start

- You have a working agentic workflow (see [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)).
- You have owner-level access to a GitHub organisation, or you can pair with someone who does.
- If you are on GitHub Enterprise Server (GHES), confirm your instance is version 3.12 or later (see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)).

## Steps

### Understand the governance model

Agentic workflows run as GitHub Actions jobs. This means every governance feature you already use for Actions applies: branch protection rules, environment protection rules, CODEOWNERS, and Copilot policy settings all layer on top of one another.

There are three levels where you can apply controls:

| Level | What you control |
|-------|-----------------|
| **Repository** | Which branches can trigger runs, who can approve deployments, which secrets are available |
| **Organisation** | Which repositories can use Copilot features, which runners are available, billing visibility |
| **Enterprise** | Copilot Enterprise enablement, model access policy, GHES network routing |

### Restrict which repositories can run agentic workflows

On GitHub Enterprise Cloud (GHEC), an organisation owner can limit Copilot usage to selected repositories:

1. Go to your organisation's **Settings** page on GitHub.com.
2. In the sidebar, click **Copilot** → **Policies**.
3. Under **Repositories**, choose **Selected repositories** and add only the repositories that should run agentic workflows.

> [!TIP]
> Start with a dedicated practice repository. Expand access repository by repository as teams demonstrate safe usage.

### Add environment protection rules

Protect your workflows from unreviewed changes by requiring human sign-off before a deployment environment is used.

1. In your repository, go to **Settings** → **Environments**.
2. Click **New environment** and name it `agentic-production`.
3. Enable **Required reviewers** and add the team or individuals who should approve production runs.
4. Reference the environment in your workflow frontmatter:

```yaml
---
name: Daily Status
on:
  schedule: daily on weekdays
environment: agentic-production
permissions:
  contents: read
  issues: write
---
```

1. Run `gh aw compile` in the Codespace terminal to regenerate the lock file:

```bash
gh aw compile
```

Any future run that targets `agentic-production` will pause for reviewer approval before the Copilot cloud agent is called.

> [!NOTE]
> Environment protection rules are available on all GitHub plans. Required reviewers require a paid plan for private repositories.

### Limit token scope with fine-grained permissions

The `permissions` block in your frontmatter is your first line of defence. Keep it as narrow as possible:

- Grant `contents: read` unless the workflow must commit changes.
- Add `issues: write` only when the workflow posts issue comments.
- Avoid `contents: write` on shared repositories unless a human reviewer is in the loop.

The [permissions reference](https://github.github.com/gh-aw/reference/permissions/) lists every permission token and the GitHub API calls each one unlocks.

### Enable audit logging for agentic runs

On GHEC and GHES, organisation audit logs capture every workflow trigger, including who approved an environment deployment and which Copilot model was called.

1. Go to your organisation's **Settings** → **Audit log**.
2. Filter by `action:actions.workflow_run` to see agentic workflow activity.
3. Export the log as CSV for compliance review.

For automated audit collection, see [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) — `gh aw audit` generates per-run reports you can archive alongside the Actions audit log.

### Review your governance checklist before going to production

Before promoting an agentic workflow from a personal practice repository to a shared team repository, confirm:

- [ ] The `permissions` block is as narrow as the workflow actually needs
- [ ] A protected environment or required-reviewer gate is in place for any workflow that writes to issues, PRs, or branches
- [ ] Copilot repository access is restricted to approved repositories in your organisation settings
- [ ] At least one team member knows how to disable the workflow (`gh aw disable <workflow-id>` or disabling the Actions workflow from the UI) in an emergency

## ✅ Checkpoint

- [ ] You reviewed the three governance levels (repository, organisation, enterprise)
- [ ] You navigated to your organisation's **Copilot → Policies** page and know where to restrict repository access
- [ ] You created or identified an `agentic-production` environment with required reviewers in your practice repository
- [ ] You added an `environment:` key to your workflow frontmatter and ran `gh aw compile`
- [ ] You reviewed the `permissions` block in your workflow and removed any permission that isn't required

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
