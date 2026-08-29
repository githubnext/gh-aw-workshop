<!-- page-journey: enterprise -->
# Govern Agentic Workflows Across Your Enterprise

> _Policies, model access controls, and workflow allowlists keep AI-powered automation safe and auditable at organisational scale._

## :dart: What You'll Do

You will configure organisation-level governance controls for agentic workflows — including model access policies, workflow allowlists, and required audit settings. By the end of this step, you will be able to explain and enforce your organisation's governance posture for agentic workflows running on GitHub Enterprise Cloud or GitHub Enterprise Server.

## :clipboard: Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and understand how agentic workflow run logs and artifacts work.
- You have an organisation admin or owner role, or access to someone who does.
- If you are on GitHub Enterprise Server, your instance is version 3.12 or later (see [Enterprise Setup Considerations](side-quest-enterprise-setup.md) if unsure).

## Steps

### Review your organisation's Copilot policy settings

Open your organisation settings and locate the **Copilot** section.

1. Navigate to **Settings → Copilot → Policies**.
2. Verify that **Allow Copilot in GitHub Actions workflows** is enabled. Without this, agentic workflow runs fail silently.
3. Note whether **model selection** is restricted to specific models. Your workflow `model:` frontmatter must name an approved model; `claude-sonnet` and `gpt-4o` are typical enterprise options.

> [!NOTE]
> On GitHub Enterprise Server, these settings are configured by a site admin rather than an org admin. Confirm with your administrator before testing workflows that require specific models.

### Define a workflow allowlist

An allowlist tells the Copilot cloud agent which safe-output operations a workflow is permitted to emit. Allowlisting is a defence-in-depth control — it limits the blast radius if an agent produces unexpected output.

Open one of your existing agentic workflow `.md` files (for example, `daily-status.md`) and add a `safe-outputs` block to the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
permissions:
  issues: write
  contents: read
safe-outputs:
  allowed:
    - create_issue
    - add_comment
---
```

Compile to confirm the allowlist is valid:

```bash
gh aw compile daily-status
```

The lock file will include an `allowed_safe_outputs` field. Review it to confirm only the operations you expect are listed.

### Set organisation-level spending controls

Enterprise teams should set spending limits at the organisation level, not just per-workflow. In the GitHub billing dashboard:

1. Navigate to **Settings → Billing → Copilot**.
2. Set a **monthly AI credit (AIC) budget** for the organisation.
3. Enable **budget overage alerts** so the billing contact receives an email when the organisation reaches 80 % of the limit.

Per-workflow credit limits (the `max-ai-credits` frontmatter key you set in [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)) work alongside the organisation budget — whichever limit is lower takes effect first.

### Require audit artifact retention

Governance frameworks — such as SOC 2 or ISO 27001 — often require evidence that automated actions are logged and retained. Agentic workflow runs produce an `audit` artifact by default; however, the default GitHub Actions retention window is 90 days.

Add a retention override to workflows that need longer-lived audit trails:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
permissions:
  issues: write
  contents: read
audit:
  retention-days: 365
---
```

Compile after the change:

```bash
gh aw compile daily-status
```

> [!NOTE]
> GitHub Enterprise Server retention limits may differ from GitHub.com defaults. Consult your instance admin to confirm the maximum allowed value before setting a high retention period.

### Review the governance guide

The [gh-aw governance guide](https://github.github.com/gh-aw/guides/governance/) collects recommended policies for teams rolling out agentic workflows at scale. Read the **Policy checklist** section and compare it against the settings you have configured in your organisation.

## :white_check_mark: Checkpoint

- [ ] You verified that **Allow Copilot in GitHub Actions workflows** is enabled for your organisation
- [ ] You added a `safe-outputs: allowed:` block to at least one workflow and compiled it successfully
- [ ] You confirmed or set an organisation-level AIC budget in the billing dashboard
- [ ] You added `audit: retention-days:` to a workflow that needs long-term audit trails and recompiled
- [ ] You reviewed the [gh-aw governance guide](https://github.github.com/gh-aw/guides/governance/) policy checklist and identified any gaps in your configuration

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
