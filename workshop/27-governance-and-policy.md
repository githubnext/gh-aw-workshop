<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at Scale

> _A single workflow is easy to reason about — a fleet of them needs policy, review, and guardrails to stay trustworthy and compliant._

## 🎯 What You'll Do

You'll apply key governance practices to your agentic workflows: controlling which workflows can run, reviewing AI permissions before they reach production, and documenting a lightweight policy for your organisation or team.

## 📋 Before You Start

- You've completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) or at least the core workshop through [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You have at least one compiled, running workflow in your practice repository.

## Steps

### Understand what governance means for agentic workflows

Agentic workflows differ from ordinary CI pipelines because the AI model makes decisions at runtime. Governance must cover:

- **Which workflows are approved** to run in your organisation.
- **What permissions** each workflow holds — the `permissions:` frontmatter block and any `tools:` declared.
- **Who reviews changes** before a workflow is merged and scheduled.
- **How outputs are verified** — especially safe-output calls that post comments or open PRs.

### Review your workflow's permissions

Open your daily-status workflow file (`.github/workflows/daily-status.md`) and locate the `permissions:` block. It likely looks like this:

```yaml
permissions:
  contents: read
  issues: write
```

Remove any permission that no step in the task brief actually needs. Compile and push:

```bash
gh aw compile
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "chore: remove unused permissions from daily-status"
git push
```

**Least privilege**: request only what the workflow must have. This limits the blast radius of a prompt injection or a misbehaving model.

### Add a CODEOWNERS rule for workflow files

Add a rule so every change to `.github/workflows/` requires review:

```
# Require review for all agentic workflow files
.github/workflows/*.md @your-team/workflow-reviewers
.github/workflows/*.lock.yml @your-team/workflow-reviewers
```

Replace `@your-team/workflow-reviewers` with your actual GitHub team or username. GitHub then blocks merging a workflow change until a designated reviewer approves it.

> [!TIP]
> On GitHub Enterprise Cloud or GitHub Enterprise Server, repository rulesets can enforce this check even across forks. Ask your admin about branch protection rules if CODEOWNERS is not sufficient.

### Write a one-page workflow policy

A short policy helps teammates answer "can I add a workflow for this?" without asking every time. Cover four questions:

1. **What triggers are allowed?** (e.g., `schedule`, `pull_request`, `workflow_dispatch`)
2. **What permissions are acceptable by default?** (e.g., `contents: read`, never `contents: write` without review)
3. **What data sources may workflows access?** (only this repository by default)
4. **Who reviews workflow changes before merge?**

Store the policy at `docs/workflow-policy.md` and link to it from your `README.md`.

> [!NOTE]
> For GitHub Enterprise Server or GitHub Enterprise Cloud organisations, an [organisation-level policy](https://github.github.com/gh-aw/guides/governance/) can extend these controls to all repositories under the organisation. Coordinate with your GitHub admin to apply org-wide runner restrictions, allowed actions lists, and required status checks.

## ✅ Checkpoint

- [ ] You reviewed your workflow's `permissions:` block and removed any unused entries
- [ ] `gh aw compile` completed without errors after editing permissions
- [ ] You added or updated a `CODEOWNERS` rule to require review of workflow changes
- [ ] You drafted or located a one-page workflow policy for your team or organisation
- [ ] You can explain the principle of least privilege in the context of agentic workflows
- [ ] You know who in your organisation to contact for org-level policy controls (GHES/GHEC)

<!-- journey: all -->
Return to the workshop hub to explore other advanced paths: [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
