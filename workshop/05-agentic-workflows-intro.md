# Step 5: What Are Agentic Workflows?

**Already familiar with GitHub Actions and LLM agent concepts?** [Skip to Step 6: Install gh-aw](06-install-gh-aw.md).

> [!NOTE]
> On GHEC, GHES, or EMU, the **Actions** tab may be restricted by organization policy. If you can't access it, follow [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before continuing.

## 📋 Before You Start

- You've completed [Step 3: Create Your Practice Repository](03-create-your-repo.md)
- You've read [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)

An **agentic workflow** is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls tools, reasons about the results, and posts the output automatically. No shell scripts. No brittle YAML. Just a goal and an agent that figures out the rest.

![Animated GitHub Actions run showing four security jobs: activation validates the agent is authorized to run, agent runs with sandbox, firewall, and integrity filter enabled, detection scans for malicious code, and safe-outputs applies changes within guardrails](images/05-agent-run-log.svg)

> [!NOTE]
> **What does an agentic workflow look like in practice?**
>
> | If you use… | An agentic workflow looks like… |
> |---|---|
> | GitHub Actions UI / browser | A workflow run in the **Actions** tab that shows step-by-step Copilot reasoning and outputs |
> | VS Code / Codespace terminal | A `gh aw run` command that prints live agent progress to your terminal |
> | GitHub Copilot Chat (CCA) | A Copilot conversation that triggers, monitors, and summarizes a workflow for you |
>
> All three paths produce the same result: an automated, AI-powered workflow that runs on GitHub infrastructure.

## Three things to know

![Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub](images/05-workflow-lifecycle.svg)

**What it is:** A Markdown file (`.md`) with two parts — a standard Actions frontmatter block (YAML header between `---` markers, containing triggers and permissions) and a plain-language brief for the agent. The `gh aw compile` command converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.

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
> **Coming from classic Actions? Unlearn these 3 things first:**
> 1. You do NOT write `jobs.steps` — write a goal in plain language instead.
> 2. The `.md` file is NOT documentation — it IS the workflow definition.
> 3. Output is not logs — it's a synthesized report the agent composes at runtime.

Both workflow types live in `.github/workflows/` and share the same `on:` triggers and `permissions:` blocks — only the task description format changes. For a detailed side-by-side comparison, agent anatomy, and YAML authoring details, see [Step 7: Your First Workflow](07-your-first-workflow.md) when you write one yourself.

If you want a one-page cheat sheet for Actions power users, read [Side Quest: Agentic Workflows for GitHub Actions Power Users](side-quest-05-01-actions-power-user.md), then return here.

## Try a quick comparison

Which task is a better fit for an agentic workflow?

```text
Task A: Run unit tests on every pull request, fail if any test exits non-zero, and upload coverage.
Task B: Review newly opened issues each morning, group them by theme, flag the urgent ones, and post a short triage summary.
```

Before you reveal the answer, mark the statements you can explain:

- [ ] I chose which task is the better fit for an agentic workflow
- [ ] I can explain why the other task is better as a deterministic GitHub Actions workflow
- [ ] I can point to the task that needs judgment at runtime
- [ ] I can point to the task that follows the same script every run
- [ ] I can name the live repository data the agent would inspect for the better-fit task
- [ ] I can describe what output the better-fit workflow would publish back to GitHub

<details>
<summary>Reveal the answer</summary>

**Task B** is the better fit for an agentic workflow because the agent has to inspect live repo context, group similar issues, and decide what looks urgent before it writes the summary.

**Task A** is still a great fit for classic GitHub Actions because every run follows the same fixed steps: start the test job, fail on a non-zero exit code, and upload the same coverage artifact.

</details>

> [!NOTE]
> A brand-new repo won't have any workflows yet — the **Actions** tab will show a "Getting started" page. That's expected at this stage. You'll create your first workflow in [Step 7: Your First Workflow](07-your-first-workflow.md).

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I understand that the agent decides _how_ to complete the task at runtime, not you
- [ ] I can explain why Task B is a better fit for an agentic workflow than Task A
- [ ] I can explain why Task A is still a good fit for classic GitHub Actions
- [ ] I navigated to the **Actions** tab in my practice repository and confirmed I can open the getting-started or workflow list page

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
