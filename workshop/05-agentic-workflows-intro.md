# Step 5: What Are Agentic Workflows?

> [!TIP]
> **Already familiar with GitHub Actions and LLM agent concepts?** → [Skip to Step 6: Install gh-aw](06-install-gh-aw.md)

An **agentic workflow** is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls tools, reasons about the results, and posts the output automatically. No shell scripts. No brittle YAML. Just a goal and an agent that figures out the rest.

![Animated agent run log — the agent reads a task brief, calls list_issues and list_pull_requests, reasons about the results, and posts a comment to GitHub](images/05-agent-run-log.svg)

## Three things to know

**What it is:** A Markdown file (`.md`) with two parts — a standard Actions frontmatter block (YAML header between `---` markers, containing triggers and permissions) and a plain-language brief for the agent. The `gh aw compile` command converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.

**What it produces:** A synthesized, structured output — a report, recommendation, or action taken — that the agent composes at runtime based on live repository data.

**Why it exists:** Classic GitHub Actions workflows are great for deterministic CI/CD steps. Agentic workflows fill the gap for tasks that need judgment: triage, summarization, reporting, and decisions that change based on context.

By the end of this workshop, a scheduled workflow will automatically generate a daily repo status report like this:

```markdown
## Daily Repository Status — July 12

- ✅ CI health: 18 workflows succeeded, 1 failed (`docs-link-check`)
- 🔄 Pull requests: 7 open (2 need review, 1 stale > 14 days)
- 🐛 Issues: 4 new, 3 closed, 2 high-priority still open
- 🚀 Releases: No new tags in the last 24 hours

### Recommended next actions
1. Re-run `docs-link-check` and update broken external URLs.
2. Review PR #412 and PR #415 before noon.
3. Triage high-priority issue #398 with the platform team.
```

> [!IMPORTANT]
> **Coming from classic Actions? Unlearn these 3 things first:**
> 1. You do NOT write `jobs.steps` — write a goal in plain language instead.
> 2. The `.md` file is NOT documentation — it IS the workflow definition.
> 3. Output is not logs — it's a synthesized report the agent composes at runtime.

Both workflow types live in `.github/workflows/` and share the same `on:` triggers and `permissions:` blocks — only the task description format changes. For a detailed side-by-side comparison, agent anatomy, and YAML authoring details, see [Step 7: Your First Workflow](07-your-first-workflow.md) when you write one yourself.

If you want a one-page cheat sheet for Actions power users, read [Side Quest: Agentic Workflows for GitHub Actions Power Users](side-quest-05-01-actions-power-user.md), then return here.

Enterprise users (GHEC, GHES, or EMU) who need runner and model access guidance can follow [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I understand that the agent decides _how_ to complete the task at runtime, not you
- [ ] I can name one task (triage, summarization, or reporting) where agentic workflows fit better than a scripted CI step
- [ ] I navigated to the **Actions** tab in my practice repository and confirmed I can see the workflow list

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
