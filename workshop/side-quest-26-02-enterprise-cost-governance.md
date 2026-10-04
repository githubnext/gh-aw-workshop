<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Centralize Cost Governance for Your Organization

> _A companion to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md). Use this side quest when you're an organization owner or admin responsible for AI Credit (AIC) spend across many repositories, not just one workflow._

## :dart: What You'll Do

You'll move from per-workflow guardrails to an organization-wide view: where to check aggregate [AIC](https://github.github.com/gh-aw/reference/cost-management/#ai-credits-aic) usage across repositories, how to set a consistent default policy for `max-ai-credits` and `max-daily-ai-credits`, and how to communicate that policy to the workflow authors in your organization.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) and understand per-workflow AIC guardrails.
- You have **organization owner** or **billing manager** access, or can reach someone who does.
- Your organization uses GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server (GHES) with Copilot Enterprise enabled — individual (non-org) accounts do not have organization-level billing policies.

## Steps

### Review aggregate AIC usage across repositories

Per-repository `gh aw logs` and `gh aw forecast` commands only show you one workflow or one repository at a time. For an organization-wide view:

1. Go to your **organization's** Settings page (not a repository's).
2. Click **Billing and plans** in the left sidebar.
3. Open the **Copilot** usage report. Look for the **Agentic Workflows** category, broken down by repository where available.

> [!NOTE]
> Exact report fields and breakdowns vary by plan and GitHub version. Ask your billing administrator which usage reports are enabled for your organization.

### Set a default policy, not just per-workflow limits

`max-ai-credits` and `max-daily-ai-credits` in a workflow's [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) only protect that one workflow. Without an org-wide default, every new workflow author has to remember to add them.

Two practical ways to enforce a consistent floor across repositories:

- **Documented default values.** Publish a short internal standard (for example, "every scheduled agentic workflow must set `timeout-minutes`, `max-ai-credits`, and `max-daily-ai-credits`") and reference it in your repository templates or a [`SKILL.md`](https://github.github.com/gh-aw/reference/frontmatter/#frontmatter-skills-skills) so your AI agent applies it automatically when scaffolding new workflows.
- **Review gates.** Require a code owner or platform team review on `.github/workflows/*.md` changes (via `CODEOWNERS` or branch protection) so new or edited workflows get a quick guardrail check before merging.

> [!TIP]
> If your organization already uses a shared `SKILL.md` for workflow conventions, add your AIC guardrail defaults there — see [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).

### Escalate requests for higher budgets

Some workflows legitimately need more headroom than your organization's default (for example, a research-heavy workflow that calls many MCP tools). Instead of asking every author to self-serve a higher limit:

1. Have the workflow author bring a `gh aw forecast` P90 figure and a one-sentence justification.
2. A billing manager or platform owner reviews the request against overall organization spend.
3. If approved, the author raises `max-daily-ai-credits` for that specific workflow only — never raises the org-wide default without a similar review.

This keeps exceptions deliberate and visible instead of becoming the new norm by accident.

### Decide who gets self-hosted runner access

If your organization uses [self-hosted runners](24-self-hosted-runners.md) partly to control cost (avoiding GitHub-hosted runner minutes), confirm with your admin which repositories are allowed to target your runner fleet. Over-broad runner access combined with loose AIC limits can compound spend risk.

## :white_check_mark: Checkpoint

- [ ] You located an organization-wide Copilot/AIC usage report (not just a single-repository view)
- [ ] You can describe at least one way to enforce a consistent `max-ai-credits`/`max-daily-ai-credits` default across repositories
- [ ] You know the escalation path for a workflow that legitimately needs a higher budget
- [ ] You can explain why organization-wide defaults reduce the risk of one workflow accumulating unexpectedly high spend

<!-- journey: all -->
Return to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
<!-- /journey -->
