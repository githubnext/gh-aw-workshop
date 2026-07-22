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

## Worked examples

The three examples below show what agentic workflows look like in practice — what you write, what the agent does, and what the output looks like.

### Example A — Daily issue triage

You write this task brief:

```
Each weekday morning, read all issues opened in the last 24 hours.
For each issue, write one sentence summarising the reported problem.
Post the list as a new issue titled "Daily Triage — <date>".
```

The agent runs on a schedule, calls the Issues API, composes a summary, and posts a new issue. Two runs in the same week produce different issues because the repository has changed.

### Example B — Weekly PR digest

You write this task brief:

```
Every Monday, list all pull requests merged in the past 7 days.
Group them by label. Post the grouped list as a comment on issue #1.
```

The agent reads merged PRs, groups them, and posts a structured comment — a report that always reflects what actually happened that week, not a hardcoded template.

### Example C — On-demand code review summary

You write this task brief:

```
When a pull request is opened, read the diff and the related issue
description. Post a two-sentence summary of what the PR changes and
why, as a PR comment.
```

This uses an event trigger instead of a schedule. The agent reads context that doesn't exist until the PR is opened — something a fixed `run:` script cannot do without complex scripting.

## Try it: spot the agent decision point

For each task below, identify the step that requires the agent to make a **judgment call** — a decision a fixed script cannot make without being told the answer in advance.

**Task A:** Run lint and unit tests on every pull request, fail if any check exits non-zero.

- [ ] I've identified the decision point for Task A

<details>
<summary>Reveal Task A answer</summary>

There is **no judgment call** — every step is deterministic. This is a good fit for a **standard Actions workflow**. The lint and test results always mean the same thing regardless of context.

</details>

**Task B:** Each morning, read all open issues, decide which ones look most urgent, and post a short triage summary.

- [ ] I've identified the decision point for Task B

<details>
<summary>Reveal Task B answer</summary>

**Deciding which issues look most urgent** is the judgment call. "Urgent" depends on context — wording, labels, age, author, discussion thread — and changes every day. A fixed script could only apply mechanical rules you define in advance. An agent reads the situation and applies the same kind of judgment a human triager would.

</details>

**Task C:** When a new release is published, summarise the commit messages since the last release into a human-readable changelog entry.

- [ ] I've identified the decision point for Task C

<details>
<summary>Reveal Task C answer</summary>

**Writing a human-readable summary from raw commit messages** is the judgment call. Commit messages vary wildly in format and quality. An agent infers what changed and why from the messages; a script would produce a mechanical list that still needs a human to make readable.

</details>

## Safe by design: sandbox + guardrailed outputs

Letting an AI agent act on your repository on a schedule only works if it can't do damage. Agentic workflows enforce two trust boundaries so you can run agents in automation with confidence:

- **A [sandbox](https://github.github.com/gh-aw/reference/sandbox/) around the agent.** The agent runs isolated inside the [Agent Workflow Firewall](https://github.github.com/gh-aw/reference/sandbox/), with **read-only** access to your repo and network egress limited to the domains you allow. Even if a prompt injection or a compromised tool tries to reach out or exfiltrate data, the firewall blocks anything outside the allowlist.
- **A guardrailed [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) system for writes.** The agent never holds write permissions. Instead, it emits a *structured request* — "create this issue," "post this comment" — and a separate, permission-scoped job validates and executes it, applying per-operation limits (max counts, label and title constraints, allowed repos). That separation gives you least privilege, defense against prompt injection, and a full audit trail of every action.

The security jobs in the run log above map to these boundaries: **activation** checks the agent is authorized to run, the **agent** runs sandboxed behind the firewall, **detection** scans for malicious behavior, and **safe-outputs** applies changes within the guardrails.

<details>
<summary>Why can't the agent just write to the repo directly?</summary>

Direct write access would make every prompt injection a potential supply-chain attack. By keeping the agent read-only and routing all changes through the safe-output system, a malicious instruction the agent picks up from issue text or a fetched page can, at worst, produce a *request* that the guardrails then reject or cap — it can never silently push code, leak secrets, or open unlimited pull requests.

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
