<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# What's Next? Keep Exploring

> _You've built a real, scheduled AI workflow — here's how to keep growing from here._

## 🎯 What You'll Do

Take stock of everything you've learned, then choose a direction for what to build or explore next. This node is a hub: it links to deeper dives, community resources, and ideas for your own projects.

## 📋 Before You Start

- You have a scheduled daily-status workflow running in GitHub Actions from [Schedule It to Run Every Day](12-test-and-iterate.md).

## Steps

### Celebrate what you've shipped

You've gone from zero to a fully automated, AI-powered workflow that:

- Runs on a schedule in GitHub Actions
- Uses gh-aw to call an AI model from a simple YAML file
- Posts a daily summary without any manual intervention

That is a real, production-capable workflow. Nicely done.

### Reflect and Plan

Answer each question (in your notes or a new GitHub issue in your practice repository), then check the box:

- [ ] What was the hardest part of this workshop, and why?
- [ ] How would you change your daily-status workflow prompt to get better output?
- [ ] What is the next workflow you want to build, and what data source would it need?

### Review what you've learned

Here's a quick recap of the concepts you've touched:

| Concept | Where you used it |
|---|---|
| [GitHub Actions triggers](https://github.github.com/gh-aw/reference/triggers/) | `on: schedule` and `workflow_dispatch` |
| [gh-aw workflow syntax](https://github.github.com/gh-aw/introduction/overview/) | Every `.md` workflow file you wrote |
| AI model calls | The Markdown body (agent instructions) of your daily-status workflow |
| Natural-language schedules | `schedule: daily on weekdays` |
| Iterative debugging | Running, reading output, tweaking, repeating |

---

### Go deeper

- ➡️ [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md) — add conditions so your workflow only runs when there is meaningful activity to report.
- ➡️ [Connect a Live Data Source to Your Workflow](16-connect-data-source.md) — fetch live repository data and pass it into your AI prompt as workflow context.
- ➡️ [Give Your Agent More Tools with MCP](17-add-mcp-tools.md) — connect the GitHub MCP server so your agent can read live repository data as it runs.
- ➡️ [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md) — publish your workflow to a catalog so others can install it with one command.
- ➡️ [Make Your Workflow Remember Across Runs](20-persistent-memory.md) — add cache-backed memory so your workflow skips items it has already reported on.
- ➡️ [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md) — use the planner-worker pattern to keep your main prompt lean and reduce token cost.
- ➡️ [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md) — add defensive briefs, timeouts, and fallback outputs so unattended runs stay reliable.
- ➡️ [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md) — compare prompt variants across runs and let data decide which one to keep.
- ➡️ [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) — target your organisation's runner fleet instead of GitHub-hosted machines (enterprise teams).
- ➡️ [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) — read run artifacts, understand token usage, and build an audit trail for enterprise compliance.
- ➡️ [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) — measure AIC consumption, set spending limits, and keep your workflows within budget (enterprise teams).

<!-- journey: all -->
## ✅ Checkpoint

- [ ] Your scheduled workflow has completed at least one successful automated run
- [ ] You can describe, in plain English, what agentic workflows are and why they're useful
- [ ] You have at least one idea for the next workflow you want to build
- [ ] You drafted a two-sentence brief for your next agentic workflow
- [ ] You know where to find the gh-aw docs when you need them

You've reached the end of the main path — but the graph stays open. Come back any time, branch off in a new direction, and keep building. 🚀

<!-- /journey -->

