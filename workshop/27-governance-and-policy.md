---
journey: all
adventure: advanced
---
# Govern Your Agentic Workflows at Scale

> _Shipping workflows to production means more than making them work — it means making them trustworthy, controllable, and auditable across teams and environments._

## 🎯 What You'll Do

You'll apply GitHub Actions policy controls to your agentic workflows: tighten token permissions, add a human approval gate using environments, and complete a pre-production checklist your team can adopt before promoting a workflow to unattended scheduling.

## 📋 Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You have at least one agentic workflow `.md` file committed and running on a schedule or on-demand.
- _(Enterprise users)_ Your GitHub administrator has access to the organisation's **Actions** settings page.

## Steps

### Restrict the default token permissions

By default, `GITHUB_TOKEN` has read and write access to the repository. Tighten this before a workflow reaches production.

Go to **Settings → Actions → General → Workflow permissions** and select **Read repository contents and packages permissions**. Then declare only what your workflow actually needs in its frontmatter:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 9 * * 1-5"
permissions:
  issues: write
  contents: read
---
```

Any permission not listed here is denied — even if the task brief tries to use it.

### Add an environment approval gate

Use a [GitHub Actions environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) to require a human reviewer before each run.

1. Go to **Settings → Environments → New environment** and name it `production`.
2. Under **Protection rules**, enable **Required reviewers** and add at least one reviewer.
3. Add `environment: production` to your workflow frontmatter:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 9 * * 1-5"
permissions:
  issues: write
  contents: read
environment: production
---
```

Every run now pauses at the gate until a reviewer approves it in the **Actions** tab.

<details>
<summary>🖥️ GitHub UI path for environment settings</summary>

1. Click **Settings** → **Environments** → **New environment**.
2. Name it (for example, `production`) and click **Configure environment**.
3. Under **Deployment protection rules**, tick **Required reviewers** and add a reviewer.
4. Click **Save protection rules**.

</details>

### Complete the pre-production checklist

Before scheduling a workflow to run unattended:

- [ ] Permissions in frontmatter are scoped to the minimum required.
- [ ] `timeout-minutes` is set to prevent runaway runs.
- [ ] `max-ai-credits` is set (see [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)).
- [ ] The workflow has run successfully at least once and output was reviewed.
- [ ] A human reviewer is assigned to the production environment.
- [ ] The audit log has been checked (see [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)).

> [!NOTE]
> On GitHub Enterprise Server, environment approval gates and allowed-actions policies are managed centrally by your GitHub administrator. Coordinate with them before promoting a workflow to a shared runner fleet. The [Governance guide](https://github.github.com/gh-aw/guides/governance/) covers GHES-specific steps, org-level policy patterns, required workflows, and rulesets.

## ✅ Checkpoint

- [ ] You tightened the default token permissions for your repository to read-only and declared only the permissions your workflow needs in its frontmatter
- [ ] You created a `production` environment with at least one required reviewer
- [ ] You referenced the environment in your workflow frontmatter and verified the gate appears during a manual run
- [ ] You can explain the difference between allowed-actions policy (org level) and workflow permissions (repository level)
- [ ] _(Enterprise)_ You identified your GitHub administrator as the point of contact for org-level policy changes

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
