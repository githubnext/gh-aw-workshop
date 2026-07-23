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

The agent always runs within a sandbox and posts results through a guardrailed output system — you will explore how this works in [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md).

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

## Try it: match the lifecycle parts

Match each term to what it describes in an agentic workflow. Make your decision before revealing the answers.

**Term 1:** `.md` source file

- [ ] I've made my decision for Term 1

<details>
<summary>Reveal Term 1 answer</summary>

The **Markdown source file** — it contains the YAML frontmatter (trigger, permissions, runner) and your plain-English task brief. You author and edit this file.

</details>

**Term 2:** `.lock.yml` compiled file

- [ ] I've made my decision for Term 2

<details>
<summary>Reveal Term 2 answer</summary>

The **compiled lock file** — `gh aw compile` generates it from the `.md` source. GitHub Actions runs this file, not the `.md`. Never edit it by hand.

</details>

**Term 3:** `gh aw compile`

- [ ] I've made my decision for Term 3

<details>
<summary>Reveal Term 3 answer</summary>

The **compile command** — it reads the `.md` source and writes the `.lock.yml` file that Actions runs. You must recompile any time you change the source.

</details>

> [!TIP]
> Want more examples of how the two-file structure works? [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) includes a fully annotated workflow pair.

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I can explain one way an agentic workflow differs from a standard Actions workflow
- [ ] I can identify the three parts: trigger → agent → safe output
- [ ] I know that `gh aw compile` generates `.lock.yml` from the `.md` source

<details>
<summary>Still uncertain? Try this before moving on</summary>

A standup bot reads overnight PRs and posts a digest — different every day. That is an agentic workflow.

Does `gh aw compile` change what the agent does at runtime? Decide first.

- [ ] I've decided

<details>
<summary>Reveal</summary>

No. Compile converts `.md` to `.lock.yml`. Runtime output comes from your task brief and live repo state.

</details>

[Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) has annotated examples.

</details>

<!-- journey: all -->
**Next:** [Practice: Recognize Agentic Workflows](05c-agentic-workflows-practice.md)
<!-- /journey -->
