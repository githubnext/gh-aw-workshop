# What's Next? Keep Exploring

> _You've built a real, scheduled AI workflow — here's how to keep growing from here._

## 🎯 What You'll Do

Take stock of everything you've learned, then choose a direction for what to build or explore next. This node is a hub: it links to deeper dives, community resources, and ideas for your own projects.

## 📋 Before You Start

- You have a scheduled daily-status workflow running in GitHub Actions from [Schedule It to Run Every Day](13-schedule-it.md).

## Steps

### Celebrate what you've shipped

You've gone from zero to a fully automated, AI-powered workflow that:

- Runs on a schedule in GitHub Actions
- Uses gh-aw to call an AI model from a simple YAML file
- Posts a daily summary without any manual intervention

That is a real, production-capable workflow. Nicely done.

### Review what you've learned

Here's a quick recap of the concepts you've touched:

| Concept | Where you used it |
|---|---|
| GitHub Actions triggers | `on: schedule` and `workflow_dispatch` |
| [gh-aw workflow syntax](https://github.github.com/gh-aw/introduction/overview/) | Every `.md` workflow file you wrote |
| AI model calls | The Markdown body (agent instructions) of your daily-status workflow |
| Natural-language schedules | `schedule: daily on weekdays` |
| Iterative debugging | Running, reading output, tweaking, repeating |

> [!TIP]
> If any of these feel shaky, go back and re-read the relevant node. The workshop is a graph — you can revisit any step at any time.

### Pick your next challenge

Here are a few directions to explore. Choose the one that excites you most.

#### Build a more complex workflow

Add branching logic to your daily-status workflow. For example:

- Only post the summary if there were commits in the last 24 hours → ➡️ [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md)
- Include a different AI prompt on Mondays (weekly review) vs. other days (daily diff).
- Compare two prompt strategies head to head → ➡️ [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md)

#### Connect a new data source

gh-aw can call GitHub APIs, run shell commands, and pass results to your AI prompt. Try pulling in:

- Open issues or pull requests
- CI/CD status of recent runs
- Dependency vulnerability alerts

See ➡️ [Connect a Live Data Source to Your Workflow](16-connect-data-source.md) or ➡️ [Give Your Agent More Tools with MCP](17-add-mcp-tools.md).

#### Make your workflow production-ready

Once your workflow is running, take it further:

- **Remember across runs** — skip issues you've already reported with persistent memory → ➡️ [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- **Handle failures gracefully** — add defensive briefs, timeouts, and fallback outputs → ➡️ [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
- **Split complex tasks** — keep your main prompt lean by delegating repeated sub-tasks to inline agents → ➡️ [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md)

#### Follow a workflow-reuse learning path

Practice by reusing proven workflows before designing your own from scratch:

1. Browse the [available workflow catalog in `githubnext/agentics`](https://github.com/githubnext/agentics#-available-workflows), then pick a workflow ID (for example, `ci-doctor`).
2. Run `gh aw add githubnext/agentics/ci-doctor` in your repository (replace `ci-doctor` with the workflow ID you picked).
3. Open the added workflow file, read the [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) and task brief, then run it.
4. Adapt one part (trigger, [permissions](https://github.github.com/gh-aw/reference/permissions/), or prompt) and re-run to compare behavior.

#### Contribute to the workshop

Found a gap? Have a better explanation? Open an issue or pull request in this repository. The workshop itself is a living document.

### ✏️ Exercise: Draft Your Next Workflow

Open a new file in your editor (or a GitHub issue draft) and write a two-sentence brief for the next agentic workflow you want to build:

```text
Workflow name:
What it automates (one sentence):
Trigger (schedule / PR / push):
Safe output (what it posts or creates):
```

This takes 5 minutes and gives you a concrete starting point the next time you open this repository.

### Explore further resources

- **gh-aw documentation**: run `gh aw --help` or visit the extension's GitHub page for the full reference.
- **GitHub Actions docs**: [docs.github.com/actions](https://docs.github.com/en/actions) — the official home for triggers, runners, and marketplace actions.
- **GitHub Models**: [github.com/marketplace/models](https://github.com/marketplace/models) — browse available AI models you can call from your workflows.
- **Community discussions**: look for the `gh-aw` topic on GitHub to see what others have built.

> [!NOTE]
> gh-aw is evolving quickly. Check the release notes regularly — new syntax and capabilities land frequently.

## ✅ Checkpoint

- [ ] Your scheduled workflow has completed at least one successful automated run
- [ ] You can describe, in plain English, what agentic workflows are and why they're useful
- [ ] You have at least one idea for the next workflow you want to build
- [ ] You drafted a two-sentence brief for your next agentic workflow
- [ ] You know where to find the gh-aw docs when you need them

You've reached the end of the main path — but the graph stays open. Come back any time, branch off in a new direction, and keep building. 🚀

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
- ➡️ [Restrict Your Agent's Network Access with the Built-in Firewall](27-network-firewall.md) — declare an outbound domain allowlist so security teams can audit and control exactly which services your agent contacts (enterprise teams).

## 📚 See Also
- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/)
- [Permissions reference](https://github.github.com/gh-aw/reference/permissions/)
- [Inline Sub-Agents reference](https://github.github.com/gh-aw/reference/inline-sub-agents/)
- [Cost Management reference](https://github.github.com/gh-aw/reference/cost-management/)
