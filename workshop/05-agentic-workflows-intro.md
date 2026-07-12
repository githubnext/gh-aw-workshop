# Step 5: What Are Agentic Workflows?

> [!TIP]
> **Already know GitHub Actions and LLM concepts?** → [Jump to Step 6: Install gh-aw](06-install-gh-aw.md)

**Before** — classic GitHub Actions (you write every step):

```yaml
- name: List open issues
  run: gh issue list --json title,number | jq '.[] | .number, .title'
```

**After** — agentic workflow (you describe the goal):

```text
List all open issues that need triage and summarize them with recommended next steps.
```

That's the core shift. The agent handles the how at runtime.

---

By the end of this workshop, your workflow produces a daily, stakeholder-ready repo status report like this:

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

> **TL;DR** — By the end of this workshop, a scheduled GitHub Actions workflow will automatically
> generate a daily, stakeholder-ready status report for your repo — no script maintenance required.
> This step explains what makes that possible.

You'll finish this workshop with an automated workflow that checks your repository, decides what matters, and publishes a report your team can act on. This page gives you the payoff first, then explains the agentic workflow model behind it so the rest of the workshop feels concrete instead of abstract.

> [!IMPORTANT]
> **Coming from classic Actions? Unlearn these 3 things first:**
> 1. You do NOT write `jobs.steps` — write a goal in plain language instead.
> 2. The `.md` file is NOT documentation — it IS the workflow definition.
> 3. Output is not logs — it's a synthesized report the agent composes at runtime.

_If you already know Actions, this step is the delta: what's new when workflows can reason, decide, and act._

## 🎯 What You'll Do

You'll connect what you already know about classic GitHub Actions to the agentic model used in this workshop.

This is not a re-introduction to Actions fundamentals — it's a focused view of what's different.

> [!IMPORTANT]
> **Using GitHub Enterprise Server (GHES)?** Agentic workflows require GitHub Copilot cloud agent — the agentic execution feature behind these workflows — to be enabled by your GHES administrator. See [Enabling GitHub Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent). If it is not yet enabled, reach out to your platform team before continuing.

## Classic Actions vs Agentic Workflows

An agentic workflow is a Markdown file with two parts: a YAML frontmatter block that is fully backward compatible with GitHub Actions (same `on:`, `permissions:`, and trigger syntax you already know, plus a few agent-specific extras), and a body that is the plain-language prompt the agent receives. The `gh aw compile` command converts that Markdown file into a standard Actions workflow (`.lock.yml`) that runs the agent in a safe, sandboxed, gated job.

If you're coming from classic GitHub Actions, here's where the two models diverge:

- **File format:** Classic workflows are `.yml` files with `jobs.steps`. Agentic workflows are `.md` files (compiled to `.lock.yml`) — the task description is plain language below the frontmatter.
- **Execution:** Classic workflows are deterministic — same input, same output. Agentic workflows let the AI agent interpret the brief and decide how to act at runtime.
- **Runtime:** Classic workflows have no AI model involved. Agentic workflows use Copilot or another LLM as the runtime.
- **Best for:** Classic workflows excel at CI/CD pipelines, builds, and deployments. Agentic workflows are best for summaries, triage, reporting, and tasks that need judgment.

> [!NOTE]
> Both types of workflow live in `.github/workflows/` and use the same `on:` triggers and `permissions:` blocks — only the task description format changes.

Here is a complete minimal agentic workflow — the same structure you'll write in Step 7:

```yaml
---
name: Hello Agent
on:
  workflow_dispatch:
---

List all open issues that need triage and summarize them with recommended next steps.
```

> [!NOTE]
> **If you've used GitHub Actions before:** the key difference is that you write a _brief_ in plain language, not a sequence of shell commands — the agent decides how to fulfill it.

## Quick Summary

For platform engineers and DevOps teams evaluating adoption, agentic workflows cut the cost of maintaining bespoke scripted automation. Engineers spend less time updating fragile scripts and more time on higher-value work. Every workflow definition is a versioned Markdown file that goes through a pull request, so teams retain full auditability, change history, and approval gates. This makes agentic automation compatible with enterprise compliance requirements and existing runner fleet investments.

> **Key differences from classic Actions:**
>
> - A `gh-aw` workflow still starts with YAML frontmatter fenced by `---`, usually with `name`, `on`, and `permissions`.
> - Below that frontmatter, you write a Markdown task brief instead of a fixed `jobs.steps` script.
> - The agent uses that brief plus the declared permissions and safe outputs to decide how to complete the work at runtime.

For Actions users, keep this quick mental model:

> [!TIP]
> **How this differs from classic Actions**
> - You define the goal in plain language instead of scripting each step in `jobs.steps`.
> - The agent decides how to use available tools at runtime instead of following a fixed command sequence.
> - The output is a synthesized report with recommendations, not just raw command logs.

## Advanced fast-track: What's New cheat sheet

Use this as a one-page reference for the shift from classic workflows to agentic workflows.

| Classic GitHub Actions | Agentic workflows |
|---|---|
| Predetermined sequence of steps | Goal-oriented flow where an agent can choose next actions |
| Logic is encoded manually in YAML and scripts | Logic can be delegated to an AI agent guided by prompts and constraints |
| Handles known, explicit branches well | Handles ambiguous inputs by reasoning and adapting |
| Output is usually command/script results | Output can include synthesized summaries, decisions, and follow-up actions |
| Human updates workflow logic for every new scenario | Human defines guardrails; agent handles more variation at runtime |
| Great for deterministic automation | Best when tasks require interpretation, triage, or planning |

## What Stays the Same

- Workflows still run in GitHub Actions runners
- Triggers, permissions, and repository context still matter
- You still version workflows in git and review them like code

The same authoring and review workflow applies everywhere — only the runner configuration differs.

## Platform Compatibility

> [!WARNING]
> **GHES (GitHub Enterprise Server) users:** Agentic workflows are **not supported by default** on GHES. Support varies by version and organization configuration. If you are on a GHES instance and agentic workflows are not enabled, you will encounter 404 errors or permission failures at Steps 6–8 with no clear explanation.
>
> **Recommended options for GHES users:**
> - Follow along in read-only mode to learn the concepts — you can still complete all non-execution steps.
> - Request a **github.com** account (free tier is sufficient) to run the hands-on portions of the workshop.
> - Ask your GitHub Enterprise administrator whether agentic workflows have been enabled for your organization.

| GitHub deployment | Agentic workflows supported? |
|---|---|
| **github.com** (free/Team/Enterprise) | ✅ Fully supported |
| **GitHub Enterprise Cloud (GHEC)** | ✅ Fully supported |
| **GitHub Enterprise Server (GHES)** | ⚠️ Not supported by default — varies by version and org configuration |

> [!IMPORTANT]
> In this workshop, learn to iterate on agentic workflows by asking Copilot (or another capable agent) to use the `agentic-workflows` skill. Reading the workflow directly helps you understand it, but editing and debugging agentic workflows by hand is usually less effective. **Agents edit agents.**

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I can name at least one way agentic workflows differ from classic GitHub Actions

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
