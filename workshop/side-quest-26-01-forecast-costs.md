---
journey: all
adventure: side-quest
---
# Side Quest: Project Future AI Credit Costs with `gh aw forecast`

> _A deeper companion to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md). Use this side quest when you want a full walkthrough of `gh aw forecast` — what the output means, how to tune projections, and how to translate the P90 figure into a practical `max-daily-ai-credits` value._

## What `gh aw forecast` does

`gh aw forecast` looks at your actual run history and runs a Monte Carlo simulation to project future AIC consumption. It accounts for:

- Run frequency (how often the workflow triggers)
- Per-run usage (how many AIC each run consumed)
- Success rate (failed runs still consume some tokens)

The result is a probability distribution, not a single number. You get a **P10**, **P50**, and **P90** figure for the projection period.

## Run a basic forecast

```bash
gh aw forecast daily-status
```

Sample output:

```
Workflow: daily-status
Period:   month (30 days)
Runs:     ~30 projected

  P10     P50     P90
  32 AIC  47 AIC  68 AIC
```

- **P10** — only a 10 % chance actual spend falls below this. Optimistic scenario.
- **P50** — the median projection. Half of simulated outcomes land above this, half below.
- **P90** — only a 10 % chance actual spend exceeds this. Conservative upper bound.

Use the **P90** figure when requesting a spending limit from your administrator or setting `max-daily-ai-credits`.

## Use `--period week` for shorter projections

If you run your workflow less than daily, a monthly projection might feel abstract. Switch to weekly:

```bash
gh aw forecast daily-status --period week
```

The output covers 7 days of projected spend. Useful for workflows that run a few times a week and where you want a near-term estimate.

## Use `--days 7` to limit history after a task-brief change

`gh aw forecast` samples from all available run history by default. If you recently changed your task brief or added MCP tools, older runs may have very different costs and will skew the projection.

Limit the history window to the last 7 days:

```bash
gh aw forecast daily-status --days 7
```

> [!TIP]
> Wait until you have at least 5–7 runs after a change before running a forecast. Fewer samples mean wider confidence intervals.

## Forecast all workflows at once

Run `gh aw forecast` with no workflow name to project costs for every workflow in the repository:

```bash
gh aw forecast
```

The output shows one row per workflow so you can spot which workflows drive the most spend.

## Translate the P90 into `max-daily-ai-credits`

The `max-daily-ai-credits` field caps how many AIC a workflow can consume across the last 24 hours for the triggering user. To pick a value that allows normal operation but blocks runaway spend:

1. Note the **P90 monthly** figure from `gh aw forecast`.
2. Divide by 30 to get the P90 daily figure.
3. Multiply by 1.5 as a safety margin.

**Worked example:**

| Metric | Value |
|---|---|
| P90 monthly | 10000 AIC |
| P90 daily (÷ 30) | 333 AIC |
| Safety margin (× 1.5) | 500 AIC |
| Rounded `max-daily-ai-credits` | **500** |

Add that value to your workflow frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily on weekdays
max-daily-ai-credits: 500
---
```

Recompile after editing:

```bash
gh aw compile
```

## ✅ Checkpoint

- [ ] You ran `gh aw forecast` and read the P10/P50/P90 output
- [ ] You used `--period week` to get a shorter projection
- [ ] You used `--days 7` to limit history after a recent workflow change
- [ ] You derived a `max-daily-ai-credits` value from the P90 figure and added it to your workflow

<!-- journey: all -->
Return to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
<!-- /journey -->

For more details, see [About billing for GitHub Copilot](https://docs.github.com/en/billing/managing-billing-for-github-copilot/about-billing-for-github-copilot) and [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).

