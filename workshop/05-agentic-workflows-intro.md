# Step 5: What Are Agentic Workflows?

**Already familiar with GitHub Actions and LLM agent concepts?** [Skip to Step 6: Install gh-aw](06-install-gh-aw.md).

> [!NOTE]
> On GHEC, GHES, or EMU, the **Actions** tab may be restricted by organization policy. If you can't access it, follow [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.

## 📋 Before You Start

- You've completed [Step 3: Create Your Practice Repository](03-create-your-repo.md)
- You've read [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)

An **agentic workflow** is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls tools, reasons about the results, and posts the output automatically. This is a smooth transition from classic Actions: you keep the same core workflow model and add agentic reasoning where it helps most.

![Animated GitHub Actions run showing four security jobs: activation validates the agent is authorized to run, agent runs with sandbox, firewall, and integrity filter enabled, detection scans for malicious code, and safe-outputs applies changes within guardrails](images/05-agent-run-log.svg)

> [!NOTE]
> <details>
> <summary><b>What does an agentic workflow look like in practice?</b></summary>
>
> | If you use… | An agentic workflow looks like… |
> |---|---|
> | GitHub Actions UI / browser | A workflow run in the **Actions** tab that shows step-by-step Copilot reasoning and outputs |
> | VS Code / Codespace terminal | A `gh aw run` command that prints live agent progress to your terminal |
> | GitHub Copilot Chat (CCA) | A Copilot conversation that triggers, monitors, and summarizes a workflow for you |
>
> All three paths produce the same result: an automated, AI-powered workflow that runs on GitHub infrastructure.
>
> </details>

## Three things to know

![Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub](images/05-workflow-lifecycle.svg)

**What it is:** A Markdown file (`.md`) with two parts — an Actions-compatible frontmatter block (YAML header between `---` markers, containing triggers, permissions, runners, and optional deterministic steps) and a plain-language brief for the agent. The `gh aw compile` command converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.

**What it produces:** A synthesized, structured output — a report, recommendation, or action taken — that the agent composes at runtime based on live repository data. In [Step 7: Your First Workflow](07-your-first-workflow.md) you'll write exactly this kind of brief; in [Step 8: Run Your Workflow](08-run-your-workflow.md) you'll watch the agent interpret it in real time.

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
> <details>
> <summary><b>Coming from classic Actions? Unlearn these 3 things first:</b></summary>
>
> 1. You do NOT write `jobs.steps` — write a goal in plain language instead.
> 2. The `.md` file is NOT documentation — it IS the workflow definition.
> 3. Output is not logs — it's a synthesized report the agent composes at runtime.
>
> </details>

## Try it now

Here is a minimal agentic workflow file — the same structure you will write in Step 7:

```
---
on:
  schedule: daily
permissions:
  issues: read
---

Review all open issues, summarize the key themes, and post a short digest as a new issue.
```

Look at the sample above and answer these two questions before continuing:

1. Which part is the **task brief** (the plain-English instructions the agent reads)?
2. Which line or block tells GitHub Actions **when** to run the workflow?

> [!TIP]
> There is no single right answer — just make sure you can point to these two parts. You will write both in Step 7.

Both workflow types live in `.github/workflows/` and share the same `on:` triggers and `permissions:` blocks — only the task description format changes. You can also run hybrid workflows: keep deterministic jobs or steps for repeatable data collection, then let the agent interpret the results and decide the final output. For a detailed side-by-side comparison, agent anatomy, and YAML authoring details, see [Step 7: Your First Workflow](07-your-first-workflow.md) when you write one yourself.

If you want a one-page cheat sheet for Actions power users, read [Side Quest: Agentic Workflows for GitHub Actions Power Users](side-quest-05-01-actions-power-user.md), then return here.

## Classify these tasks

For each task below, decide whether it is a better fit for an **agentic workflow** or a **standard Actions workflow**, then check your answers.

```text
Task A: Run unit tests on every pull request, fail if any test exits non-zero, and upload coverage.
Task B: Review newly opened issues each morning, group them by theme, flag the urgent ones, and post a short triage summary.
Task C: Each Friday, scan all open issues and pull requests, summarize recent activity by contributor, and post a weekly team progress digest.
```

Before you reveal the answers, mark the statements you can explain:

- [ ] I classified Task A as agentic workflow or standard Actions workflow
- [ ] I classified Task B as agentic workflow or standard Actions workflow
- [ ] I classified Task C as agentic workflow or standard Actions workflow
- [ ] I can explain which tasks follow the same fixed steps every run
- [ ] I can explain which tasks need live repository context or judgment at runtime

<details>
<summary>Reveal the answers</summary>

**Task A — Standard Actions workflow:** every run follows the same fixed steps: start the test job, fail on a non-zero exit code, and upload the coverage artifact. No judgment required.

**Task B — Agentic workflow:** the agent has to inspect live repo context, group similar issues, and decide what looks urgent before it writes the summary.

**Task C — Agentic workflow:** the agent has to read contributor activity across issues and pull requests, decide what counts as meaningful progress, and compose a digest that differs every week.

</details>

**Want a first look before you install anything?**

- **Browser:** Watch a live agent run in the [gh-aw-workshop Actions tab](https://github.com/githubnext/gh-aw-workshop/actions) — no login required for public runs.
- **Terminal (optional):** If you already have `gh` and `gh-aw` installed, run `gh aw --help` to preview available commands — no files to create yet.

> [!NOTE]
> A brand-new repo won't have any workflows yet — the **Actions** tab will show a "Getting started" page. That's expected at this stage. You'll create your first workflow in [Step 7: Your First Workflow](07-your-first-workflow.md).

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I understand that the agent decides _how_ to complete the task at runtime, not you
- [ ] I classified all three tasks and checked my answers in the reveal
- [ ] I can explain why Tasks B and C are agentic workflows and Task A is a standard Actions workflow
- [ ] I navigated to the **Actions** tab in my practice repository and confirmed I can open the getting-started or workflow list page

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
