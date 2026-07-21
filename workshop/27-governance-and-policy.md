# Govern Your Agentic Workflows at Scale

> _Set organisation-wide guardrails so every agentic workflow your team ships meets your compliance, security, and cost policies — without blocking productivity._

## 🎯 What You'll Do

You'll learn how to apply Copilot policy settings, required workflow patterns, and frontmatter constraints to govern agentic workflows across an organisation or enterprise. By the end of this step you'll have a checklist of controls you can bring to your admin or platform team.

## 📋 Before You Start

- You have completed [Run Your First Workflow](08-run-your-workflow.md) and have at least one working agentic workflow.
- You have read [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have (or can ask) admin access to your GitHub organisation settings, or your admin is available to review changes with you.

## The governance challenge

Any workflow that runs on a schedule, calls an AI model, and writes back to GitHub touches three sensitive surfaces at once: compute, AI credits, and repository permissions. Without organisation-wide guardrails, individual teams can accidentally create runaway costs, over-permissioned tokens, or workflows that conflict with compliance requirements.

The good news: GitHub provides layered controls that let platform teams set policy once, and workflow authors stay productive inside those boundaries.

## Layer 1 — Copilot policy settings

Admins control which models and features are available to agentic workflows at the organisation level.

### Where to find them

1. Navigate to your organisation on GitHub.
2. Click **Settings** → **Copilot** → **Policies**.
3. Review the **Allow GitHub Copilot in Actions workflows** toggle and the approved model list.

> [!NOTE]
> On GitHub Enterprise Cloud (GHEC) and GitHub Enterprise Server (GHES 3.16+), your admin may further restrict which Copilot model tiers (Copilot Business vs. Copilot Enterprise) are usable in workflow runs. Workflows that call a disallowed model tier fail at the agent step — always check policy before choosing a model in your frontmatter.

### Recommended policies for enterprise teams

| Policy | Recommended setting | Why |
|--------|--------------------|----|
| Copilot in Actions workflows | Enabled for selected repositories | Limits surface area without blocking approved teams |
| Allowed model tier | Enterprise or Business only | Prevents cost surprises from unrestricted model access |
| AI credit budget (org level) | Set a monthly AIC cap | First line of defence against runaway costs |

## Layer 2 — Required workflows

GitHub supports **required workflows** at the organisation level. A required workflow runs automatically on every repository's pull request, even if the repository's own workflow files don't include it.

Use a required workflow to enforce standards such as:

- **Lint agentic workflow frontmatter** — run `gh aw compile --validate` on every PR that touches `*.md` workflow files to catch schema errors before merge.
- **Check permissions scope** — fail the PR if a workflow requests `contents: write` without a corresponding audit justification comment.
- **Validate cost limits** — confirm every workflow file sets `max-ai-credits` before it reaches the default branch.

### Setting up a required workflow

1. In your `.github` repository (the special org-level repo), create `.github/workflows/aw-standards.yml`.
2. Add a job that checks out the changed files and runs your validation commands.
3. In your organisation **Settings** → **Actions** → **Required workflows**, add `aw-standards.yml` and target it to all repositories (or a selected subset).

> [!TIP]
> Start with a non-blocking required workflow (set it to "allowed to fail") while you roll out standards, then flip it to blocking once teams have had time to update their files.

## Layer 3 — Frontmatter constraints as policy

The frontmatter fields your team adopts become a lightweight, human-readable policy document embedded in every workflow file.

Agree on a set of baseline frontmatter requirements with your team:

```yaml
---
name: my-workflow
on:
  schedule:
    - cron: "0 9 * * 1-5"
permissions:
  issues: write
  contents: read
# Cost guardrails — required by platform policy
max-ai-credits: 500
max-daily-ai-credits: 1500
timeout-minutes: 15
---
```

The `max-ai-credits`, `max-daily-ai-credits`, and `timeout-minutes` fields are the three most impactful budget controls. Treat them as mandatory in your team's pull-request checklist.

## Layer 4 — Audit trail integration

Combine the per-run audit artifacts from [Step 25](25-audit-and-observability.md) with your organisation's SIEM or log aggregation tool.

- Download workflow run artifacts from the Actions API and push them to your logging platform.
- Set GitHub Actions artifact retention to match your compliance retention policy (default is 90 days; enterprise teams often need longer).
- Use the `permissions: actions: read` scope to allow a dedicated audit workflow to pull logs from other workflow runs in the same repository.

> [!NOTE]
> Artifact retention defaults may differ on GHES. Confirm the default with your admin and set `retention-days:` explicitly in any compliance-critical workflow.

## A governance checklist for your team

Work through this list with your admin before enabling agentic workflows organisation-wide:

- Copilot in Actions is enabled for the approved repository set.
- Org-level AIC budget is configured.
- A required workflow validates frontmatter on every PR.
- All production workflows include `max-ai-credits`, `max-daily-ai-credits`, and `timeout-minutes`.
- Audit artifacts are retained for the required period.
- Token permissions follow least-privilege (no `contents: write` unless the workflow actually needs to commit).
- A runbook exists for incident response if a workflow creates unexpected output.

![Governance layers diagram](images/27-governance-layers.svg)

## ✅ Checkpoint

- [ ] You can name the four governance layers: Copilot policy, required workflows, frontmatter constraints, and audit trail integration
- [ ] You have reviewed your organisation's Copilot policy settings (or know who to ask)
- [ ] You can describe what a required workflow does and how it differs from a repository workflow
- [ ] Your own workflow file includes `max-ai-credits` and `timeout-minutes`
- [ ] You know where to set the org-level artifact retention policy on your GitHub deployment
- [ ] You have shared or noted the governance checklist with your admin or platform team

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
