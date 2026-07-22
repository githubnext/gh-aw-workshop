<!-- page-journey: all -->
<!-- page-adventure: core -->
# What Are Agentic Workflows?

**Already familiar with both GitHub Actions and AI agent execution environments?**

Before skipping, confirm you already know both of these:

- You can describe what an Actions workflow [trigger](https://github.github.com/gh-aw/reference/triggers/) does
- You have worked with AI agent execution environments in a production or CI/CD context

If both apply, [Skip to Install gh-aw](06-install-gh-aw.md).

## 📋 Before You Start

- You've read [What Are GitHub Actions?](04-github-actions-intro.md)

An [**Agentic Workflow**](https://github.github.com/gh-aw/introduction/overview/) is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls [tools](https://github.github.com/gh-aw/reference/tools/), reasons about the results, and posts the output automatically. The [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) is fully Actions-compatible — [triggers](https://github.github.com/gh-aw/reference/triggers/), [permissions](https://github.github.com/gh-aw/reference/permissions/), and runners all apply.

Think of it like a **scheduled email digest** you've set up in an app: every morning it reads your inbox, picks out the three most important messages, and sends you a one-paragraph summary — without you touching a keyboard. An agentic workflow does the same thing for your GitHub repository: it runs on a schedule, reads your issues, pull requests, or code, and posts a structured summary exactly where your team will see it. You describe the job in plain English; the agent figures out how to do it.

The part that makes this safe to run unattended: the agent operates **read-only inside a [sandbox](https://github.github.com/gh-aw/reference/sandbox/)** with controlled network access, and it can never write to your repo directly. Anything the agent wants to change flows through a guardrailed **[safe-output](https://github.github.com/gh-aw/reference/safe-outputs/)** system, where a separate, permission-scoped job validates the request before acting.

![Animated GitHub Actions run showing four security jobs: activation validates the agent is authorized to run, agent runs with sandbox, firewall, and integrity filter enabled, detection scans for malicious code, and safe-outputs applies changes within guardrails](images/05-agent-run-log.svg)

<details>
<summary>Why not just use a standard Actions workflow?</summary>

**Not a DevOps engineer?** Here is the short version: a standard workflow runs the same fixed script every time — like a recipe that always follows exactly the same steps in the same order. An agentic workflow reads the situation first, then decides what to do — like asking a colleague to "check what came in overnight and give me a quick rundown." The output is different every run because it reflects what actually happened.

Three concrete differences a DevOps engineer will also notice:

- **Agent reasoning loop:** Each run, the agent reads live repository context, decides what matters, and composes output that differs every time — no two runs are identical.
- **Natural-language task brief:** You write what you want in plain English. No `run:` scripts, no fixed shell commands.
- **Dynamic tool use:** The agent calls tools (read files, list issues, search code) based on what it discovers at runtime — not a predetermined sequence of steps hardcoded in YAML.

If you already write Actions YAML, the frontmatter stays the same (triggers, permissions, runners). And it is not one-or-the-other: agentic workflows can include custom jobs and deterministic steps alongside the AI agent — fixed data-fetch steps can run first, then the agent interprets and synthesizes the results.

</details>

## Three things to know

![Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub](images/05-workflow-lifecycle.svg)

- **What it is:** A Markdown file (`.md`) with YAML frontmatter and a plain-language brief. `gh aw compile` converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.
- **What it produces:** A synthesized report or action the agent composes from live repository data — different every run based on what it finds.
- **Why it exists:** Classic Actions handles deterministic CI/CD. Agentic workflows fill the gap for tasks that need judgment — or you can mix both in a single hybrid workflow.

## Safe by design: sandbox + guardrailed outputs

Letting an AI agent act on your repository on a schedule only works if it can't do damage. Agentic workflows enforce two trust boundaries so you can run agents in automation with confidence:

- **A [sandbox](https://github.github.com/gh-aw/reference/sandbox/) around the agent.** The agent runs isolated inside the [Agent Workflow Firewall](https://github.github.com/gh-aw/reference/sandbox/), with **read-only** access to your repo and network egress limited to the domains you allow. Even if a prompt injection or a compromised tool tries to reach out or exfiltrate data, the firewall blocks anything outside the allowlist.
- **A guardrailed [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) system for writes.** The agent never holds write permissions. Instead, it emits a *structured request* — "create this issue," "post this comment" — and a separate, permission-scoped job validates and executes it, applying per-operation limits (max counts, label and title constraints, allowed repos). That separation gives you least privilege, defense against prompt injection, and a full audit trail of every action.

The security jobs in the run log above map to these boundaries: **activation** checks the agent is authorized to run, the **agent** runs sandboxed behind the firewall, **detection** scans for malicious behavior, and **safe-outputs** applies changes within the guardrails.

<details>
<summary>Why can't the agent just write to the repo directly?</summary>

Direct write access would make every prompt injection a potential supply-chain attack. By keeping the agent read-only and routing all changes through the safe-output system, a malicious instruction the agent picks up from issue text or a fetched page can, at worst, produce a *request* that the guardrails then reject or cap — it can never silently push code, leak secrets, or open unlimited pull requests.

</details>

## Try it: agentic or standard?

For each task below, decide whether it calls for an **agentic workflow** or a **standard Actions workflow**, then reveal the answer.

**Task A:** Run lint and unit tests on every pull request, fail if any check exits non-zero.

- [ ] I've made my decision for Task A

<details>
<summary>Reveal Task A answer</summary>

**Standard Actions workflow.** Every run follows the same fixed steps: run lint, run tests, report the exit code. No judgment is required.

</details>

**Task B:** Each morning, read all open issues, decide which ones look most urgent, and post a short triage summary.

- [ ] I've made my decision for Task B

<details>
<summary>Reveal Task B answer</summary>

**Agentic workflow.** The agent reads live issue data, applies judgment to assess urgency, and composes a summary that differs every run based on what it finds.

</details>

> [!TIP]
> Want to go deeper? [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) covers more exercises, example output, the two-file structure, and concept checks.

## Try it: write a one-sentence task brief

Pick any routine task you do today that involves reading some data and writing a summary — a daily standup note, a weekly inbox digest, or a triage of support tickets. Write a one-sentence task brief for an agent to do it automatically.

Your brief should answer: *what data should the agent read, and what should it post when it's done?*

Example:

```
Each Monday morning, read all pull requests opened in the past week,
identify the three with the most review comments, and post a summary
as an issue with the title "Weekly PR Digest".
```

- [ ] I've drafted a one-sentence task brief for a real routine task
- [ ] My brief specifies what data the agent should read
- [ ] My brief specifies what the agent should post when done

> [!TIP]
> Struggling to think of a task? Browse the [gh-aw issue-ops pattern](https://github.github.com/gh-aw/patterns/issue-ops/) for inspiration. You will write a real version of your brief in Step 7.

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I can explain one way an agentic workflow differs from a standard Actions workflow
- [ ] I can identify the three parts: trigger → agent → safe output
- [ ] I can explain how the sandbox and safe-output system keep the agent safe to run in automation

<!-- journey: all -->
**Next:** [Install the gh-aw CLI Extension](06-install-gh-aw.md)
<!-- /journey -->
