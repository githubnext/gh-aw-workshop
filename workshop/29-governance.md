<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _Put the right guardrails in place so every team in your org can adopt agentic workflows safely and consistently._

## :dart: What You'll Do

You will explore the policy controls, repository permissions, and review gates that let platform and security teams manage agentic workflows at scale. By the end of this step you will have a working governance checklist and an understanding of the levers available on GitHub Enterprise Cloud (GHEC) and GitHub Enterprise Server (GHES).

## :clipboard: Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) or [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have an org-level Copilot seat (Enterprise Cloud or Enterprise Server 3.12+).
- You can access your organisation's **Settings** page (org owner or org admin role required).

## Steps

### Understand the governance model

Agentic workflows run as standard GitHub Actions jobs. Every governance control that applies to Actions — required reviewers, protected branches, OIDC token policies, and environment secrets — applies equally to agentic workflows. The extra dimension you are managing is **AI credit spend** and **safe-output declarations**.

Three layers protect your organisation:

1. **Repository and branch policies** — prevent unreviewed changes to workflow files.
2. **Org-level Copilot policies** — control which models and tools are available to agents.
3. **Rate-limiting controls** — cap AI credit spend per workflow run.

### Review and lock down workflow file permissions

By default, Actions workflow files in `.github/workflows/` can be edited by anyone with write access to the repository. For production workflows, protect this path:

1. In your repository, go to **Settings → Branches**.
2. Add a branch protection rule for `main` (or your default branch).
3. Enable **Require a pull request before merging** and set at least one required reviewer.
4. Enable **Restrict who can push to matching branches** and add only your platform team as allowed pushers.

This ensures every change to a workflow `.md` file (and its compiled `.lock.yml`) goes through a pull request review.

### Set org-level Copilot policies

1. Go to your **organisation settings → Copilot → Policies**.
2. Review which models are enabled. For audit compliance, consider pinning to a specific model family rather than allowing "all available models."
3. Under **Allowed tools**, review MCP server access. Disable any MCP server that should not be reachable from automated workflows.
4. Save your policy changes.

> [!NOTE]
> Copilot policy changes apply to all new runs immediately. Existing in-progress runs use the model and tools that were available when the job started.

### Add rate-limiting controls to shared workflows

For any workflow that runs on a schedule or in response to high-volume events, add explicit credit limits to the frontmatter:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 9 * * 1-5"
rate-limiting:
  max-ai-credits: 200
  max-daily-ai-credits: 400
---
```

Use your AI agent to add these limits to your existing workflow:

```prompt
/agentic-workflows add rate-limiting controls to daily-status with max-ai-credits 200 and max-daily-ai-credits 400
```

Then recompile:

```bash
gh aw compile
```

### Build an org-wide governance checklist

Ask your AI agent to generate a governance review template for your team:

```prompt
/agentic-workflows generate a governance checklist for reviewing agentic workflow pull requests in an enterprise org
```

Save the output as `.github/AGENTIC_WORKFLOW_REVIEW.md` in your repository so reviewers know what to check before approving changes to workflow files.

### Use CODEOWNERS to auto-assign reviewers

Add a `CODEOWNERS` entry so pull requests that touch workflow files always get the right reviewer:

```
# Require platform team review for all agentic workflow files
.github/workflows/*.md  @your-org/platform-team
.github/workflows/*.lock.yml  @your-org/platform-team
```

Push this file to `.github/CODEOWNERS` (or `CODEOWNERS` in the repository root).

> [!TIP]
> The gh-aw documentation covers additional governance patterns — including org-level workflow catalogs and reusable workflow imports — at [https://github.github.com/gh-aw/guides/governance/](https://github.github.com/gh-aw/guides/governance/).

## :white_check_mark: Checkpoint

- [ ] Your default branch has a protection rule requiring at least one reviewer for changes to workflow files
- [ ] You reviewed your org's Copilot model and tool policies and made any needed adjustments
- [ ] Your scheduled workflow frontmatter includes `max-ai-credits` and `max-daily-ai-credits` limits
- [ ] `gh aw compile` succeeds after the frontmatter update
- [ ] You have a `CODEOWNERS` entry that auto-assigns reviewers for `.github/workflows/` files
- [ ] You can explain the three governance layers (branch policy, Copilot policy, rate-limiting) to a colleague

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
