# Enterprise Governance for Agentic Workflows

> _Deploying AI-powered workflows at scale requires guardrails — this step shows you how to control who can run them, track model usage, and keep your organisation's policy team confident._

## 🎯 What You'll Do

You'll configure organisation-level settings that govern which repositories can run agentic workflows, review the audit log entries that Copilot-powered workflow runs produce, and learn where to set spending controls so costs stay predictable.

## 📋 Before You Start

- You completed [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) or [Step 13: Schedule It to Run Every Day](13-schedule-it.md).
- You have **Owner** or **Admin** access to your GitHub organisation (GHEC or GHES 3.12+). If you're working in a personal repository, read through the steps — you won't need every setting.

## Steps

### Understand what "governance" means here

Agentic workflows add a new actor to your repository: an AI model that reads code and writes outputs. Governance means:

- Controlling **which repos** can trigger model calls.
- Knowing **who triggered** a run and what the model produced.
- Setting **spending limits** so an accidentally looping schedule doesn't exhaust your Copilot seat budget.

### Review Copilot access policies

1. Open your organisation on GitHub, then go to **Settings** → **Copilot** → **Policies**.
2. Under **GitHub Copilot in GitHub Actions**, confirm the toggle matches your intended scope.

   - **Allowed for all repositories** — every repo in the org can run agentic workflows.
   - **Allowed for selected repositories** — only approved repos can use the model. This is the recommended starting point for enterprise rollouts.
   - **Disabled** — no repo can run agentic workflows until explicitly enabled.

3. If you chose **selected repositories**, click **Add repositories** and add your practice repository.

> [!TIP]
> Start with **selected repositories** during a pilot. Expand to all repositories only after you've reviewed a few production runs and confirmed your brief quality guidelines.

### Check the audit log

Every time an agentic workflow calls the model, GitHub logs the event. You can search these logs to answer questions like "which workflows ran this week?" or "did any workflow access repository secrets?"

1. In your organisation settings, go to **Logs** → **Audit log**.
2. Search for `action:copilot.workflow_run` to see model-powered workflow runs.
3. Each entry shows the actor (the Actions service account), the repository, the workflow name, and a timestamp.

> [!NOTE]
> Audit log retention follows your GHEC/GHES plan. Enterprise plans retain logs for up to 180 days. Export to an external SIEM if you need longer retention.

### Set a spending limit (GHEC)

Copilot usage in Actions is metered. Set a monthly ceiling so a runaway schedule doesn't generate unexpected bills.

1. In your organisation settings, go to **Billing** → **Spending limits**.
2. Under **GitHub Copilot**, enter a limit in US dollars.
3. GitHub sends an email alert when you reach 75 % of the limit and blocks new model calls at 100 %.

> [!NOTE]
> GHES deployments with a network-isolated Copilot endpoint should contact their GitHub account team about usage metering options — the spending limit UI may differ or be absent.

### Require approvals for first-time contributors

If your workflow is triggered by external events (such as a new pull request from a fork), add a protection that prevents the workflow from running automatically for first-time contributors:

1. Go to your repository → **Settings** → **Actions** → **General**.
2. Under **Fork pull request workflows**, choose **Require approval for first-time contributors**.
3. This prevents the AI agent from reading fork code and producing outputs before a human has reviewed the intent of the pull request.

### Document your governance decisions

Create a short internal runbook that answers:

- Which repositories are approved to use agentic workflows?
- Who reviews and approves new agentic workflow files before merge?
- What is the monthly spending limit and who owns the alert email?
- Where are audit logs stored and for how long?

A `docs/agentic-workflows-policy.md` file in your organisation's policy repository is a good home for this.

## ✅ Checkpoint

- [ ] You reviewed the **Copilot in GitHub Actions** policy for your organisation and set the correct scope
- [ ] You searched the audit log for `action:copilot.workflow_run` and can read an entry
- [ ] You set or confirmed a Copilot spending limit (GHEC) or noted the relevant GHES metering option
- [ ] You enabled fork protection on your practice repository
- [ ] You know where you would document your organisation's agentic workflow policy

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [GitHub Copilot in GitHub Actions — policy documentation](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-in-github-actions)
- [GitHub audit log documentation](https://docs.github.com/en/organizations/keeping-your-organization-secure/reviewing-the-audit-log-for-your-organization)
- [Managing spending limits for Copilot](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-copilot/about-billing-for-github-copilot)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
