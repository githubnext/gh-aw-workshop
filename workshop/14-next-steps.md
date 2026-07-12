# What's Next? Keep Exploring

> _You've built a real, scheduled AI workflow — here's how to keep growing from here._

## 🎯 What You'll Do

Take stock of everything you've learned, then choose a direction for what to build or explore next. This node is a hub: it links to deeper dives, community resources, and ideas for your own projects.

## 📋 Before You Start

- You have a scheduled daily-status workflow running in GitHub Actions from [Schedule It to Run Every Day](13-schedule-it.md).

## Steps

### 1. Celebrate what you've shipped

You've gone from zero to a fully automated, AI-powered workflow that:

- Runs on a schedule in GitHub Actions
- Uses gh-aw to call an AI model from a simple YAML file
- Posts a daily summary without any manual intervention

That is a real, production-capable workflow. Nicely done.

### 2. Review what you've learned

Here's a quick recap of the concepts you've touched:

| Concept | Where you used it |
|---|---|
| GitHub Actions triggers | `on: schedule` and `workflow_dispatch` |
| gh-aw workflow syntax | Every `.md` workflow file you wrote |
| AI model calls | The Markdown body (agent instructions) of your daily-status workflow |
| Natural-language schedules | `schedule: daily on weekdays` |
| Iterative debugging | Running, reading output, tweaking, repeating |

> [!TIP]
> If any of these feel shaky, go back and re-read the relevant node. The workshop is a graph — you can revisit any step at any time.

### 3. Pick your next challenge

Here are a few directions to explore. Choose the one that excites you most.

#### Build a more complex workflow

Add branching logic to your daily-status workflow. For example:

- Only post the summary if there were commits in the last 24 hours → ➡️ [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md)
- Include a different AI prompt on Mondays (weekly review) vs. other days (daily diff).

#### Connect a new data source

gh-aw can call GitHub APIs, run shell commands, and pass results to your AI prompt. Try pulling in:

- Open issues or pull requests
- CI/CD status of recent runs
- Dependency vulnerability alerts

#### Follow a workflow-reuse learning path

Practice by reusing proven workflows before designing your own from scratch:

1. Browse [`githubnext/agentics/workflows`](https://github.com/githubnext/agentics/tree/main/workflows), then pick a workflow ID by removing `.md` from a filename (for example, `ci-doctor.md` becomes `ci-doctor`).
2. Run `gh aw add githubnext/agentics/ci-doctor` in your repository (replace `ci-doctor` with the workflow ID you picked).
3. Open the added workflow file, read the frontmatter and task brief, then run it.
4. Adapt one part (trigger, permissions, or prompt) and re-run to compare behavior.

#### Contribute to the workshop

Found a gap? Have a better explanation? Open an issue or pull request in this repository. The workshop itself is a living document.

### 4. Explore further resources

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
- [ ] You know where to find the gh-aw docs when you need them

You've reached the end of the main path — but the graph stays open. Come back any time, branch off in a new direction, and keep building. 🚀

---

### Go deeper

- ➡️ [Give Your Agent More Tools with MCP](17-add-mcp-tools.md) — connect the GitHub MCP server so your agent can read live repository data as it runs.
