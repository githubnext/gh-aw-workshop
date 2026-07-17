# Manage Costs and AI Credit Budgets

> _Agentic workflows consume AI Credits (AIC) on every run — learning to measure, predict, and control that spend turns a powerful tool into a sustainable one._

## 🎯 What You'll Do

You'll review your workflow's AI Credit consumption in the GitHub billing dashboard, estimate monthly costs for a scheduled workflow, and apply at least one technique to keep spending within budget.

## 📋 Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You have run your workflow at least once and seen token usage data in `gh aw logs` output.
- _(Enterprise users)_ Your GitHub administrator has confirmed that Copilot Enterprise billing is enabled for your organisation.

## Steps

### Understand AI Credits

Every agentic workflow run uses an AI model to process your task brief and produce output. GitHub bills this inference as **AI Credits (AIC)**.

- One AIC corresponds roughly to 1,000 input tokens processed by the model.
- A typical daily-status workflow run costs between 0.5 and 3 AIC depending on brief length and tool calls.
- You pay for both input and output tokens, but input dominates cost for most briefs.

> [!NOTE]
> Exact pricing and AIC conversion rates are listed on the [GitHub billing documentation page](https://docs.github.com/en/billing/managing-billing-for-github-copilot/about-billing-for-github-copilot). Rates vary by Copilot plan.

### Check current usage in the billing dashboard

1. Open **github.com** and click your profile picture → **Settings**.
2. In the left sidebar, click **Billing and plans**.
3. Scroll to the **Copilot** section and click **Usage**.
4. Look for the **Agentic Workflows** row. It shows AIC consumed this billing cycle.

![Copilot billing usage dashboard showing AI Credit consumption by feature](images/26-billing-dashboard.png)

### Estimate monthly cost for a scheduled workflow

Use the per-run cost from `gh aw logs` to project monthly spend.

```bash
gh aw logs --workflow daily-status --count 5
```

Look at the **AIC** column. Average the last five runs, then multiply:

```
monthly cost = average AIC per run × runs per day × 30
```

If your workflow averages 1.5 AIC and runs once a day: `1.5 × 1 × 30 = 45 AIC per month`. Share this estimate with your GitHub administrator before enabling a high-frequency schedule.

### Set a spending limit (enterprise)

If you have admin access to a GitHub Enterprise Cloud (GHEC) organisation:

1. Go to your organisation page → **Settings** → **Billing and plans**.
2. Click **Spending limits**.
3. Set a monthly AIC cap for your team.

> [!NOTE]
> Runs that would exceed the cap are blocked rather than run — workflows fail gracefully instead of generating an unexpected bill.

<details>
<summary>🖥️ No admin access?</summary>

Ask your administrator to share the current spending limit. You can see your own usage in **Settings → Billing and plans** but cannot set organisation-level limits without admin rights.

</details>

### Reduce token consumption and set a timeout

A few techniques keep spend in check:

- **Shorten the task brief** — fewer input tokens per run.
- **Filter data before passing it to the agent** — smaller context lowers cost.
- **Cache results with persistent memory** — skip re-processing unchanged data. See [Make Your Workflow Remember Across Runs](20-persistent-memory.md).
- **Reduce run frequency** — fewer runs means fewer AIC.

Adding a `timeout-minutes` field prevents runaway runs from consuming unexpected AIC. GitHub cancels the run if the agent does not finish in time, and you are only billed for tokens consumed before cancellation:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * 1-5"
timeout-minutes: 10
---
```

## ✅ Checkpoint

- [ ] You located your AIC usage for this billing cycle in the GitHub billing dashboard
- [ ] You calculated an estimated monthly AIC cost for your scheduled workflow
- [ ] You can explain what happens when a spending limit is reached
- [ ] You added or verified a `timeout-minutes` value in your workflow frontmatter
- [ ] You identified at least one technique to reduce token consumption

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [About billing for GitHub Copilot](https://docs.github.com/en/billing/managing-billing-for-github-copilot/about-billing-for-github-copilot)
- [Spending limits for Copilot](https://docs.github.com/en/billing/managing-billing-for-github-copilot/managing-the-spending-limit-for-github-copilot)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
