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

An [**Agentic Workflow**](https://github.github.com/gh-aw/introduction/overview/) is a plain-English task brief that an AI agent executes inside [GitHub Actions](https://github.github.com/gh-aw/guides/github-actions-primer/). You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls [tools](https://github.github.com/gh-aw/reference/tools/), reasons about the results, and posts the output automatically. The [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) is fully Actions-compatible — [triggers](https://github.github.com/gh-aw/reference/triggers/), [permissions](https://github.github.com/gh-aw/reference/permissions/), and runners all apply.

Think of it like a **scheduled email digest** you've set up in an app: every morning it reads your inbox, picks out the three most important messages, and sends you a one-paragraph summary — without you touching a keyboard. An agentic workflow does the same thing for your GitHub repository: it runs on a [schedule](https://github.github.com/gh-aw/reference/triggers/#scheduled-triggers-schedule), reads your issues, pull requests, or code, and posts a structured summary exactly where your team will see it. You describe the job in plain English; the agent figures out how to do it.

The agent always runs within a sandbox and posts results through a guardrailed output system — you will explore how this works in [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md).

## Quick glossary before you continue

If any term below feels new, skim this table now. You do not need to memorize it — come back to it whenever a word feels fuzzy in the exercises below.

| Term | Plain-language meaning | Everyday analogy |
|---|---|---|
| Trigger | The event or schedule that starts the workflow | An alarm clock that decides when the job begins |
| Frontmatter | The settings block at the top of the file | A settings card attached to the instructions |
| Task brief | The plain-English job description for the agent | The note you hand to a teammate |
| `gh aw compile` | The command that turns the source file into something GitHub Actions can run | Printing your draft into the final form the system accepts |
| `.lock.yml` | The compiled workflow file that GitHub Actions actually runs | The finished form handed to the automation system |
| Safe outputs | The guardrails that control how the workflow can write back to GitHub | An outbox with only approved send buttons |
| Sandbox | The isolated workspace where the agent runs | A workshop bench with walls around it |

Before opening the details below, write one concrete difference between an agentic workflow and a standard Actions workflow:

- [ ] I've written one concrete difference in my own words

<details>
<summary>Why not just use a standard Actions workflow?</summary>

**Not a DevOps engineer?** Here is the short version: a standard workflow runs the same fixed script every time — like a recipe that always follows exactly the same steps in the same order. An agentic workflow reads the situation first, then decides what to do — like asking a colleague to "check what came in overnight and give me a quick rundown." The output is different every run because it reflects what actually happened.

Three concrete differences a DevOps engineer will also notice:

- **Agent reasoning loop:** Each run, the agent reads live repository context, decides what matters, and composes output that differs every time — no two runs are identical.
- **Natural-language task brief:** You write what you want in plain English. No `run:` scripts, no fixed shell commands.
- **Dynamic tool use:** The agent calls tools (read files, list issues, search code) based on what it discovers at runtime — not a predetermined sequence of steps hardcoded in YAML.

If you already write Actions YAML, the frontmatter stays the same (triggers, permissions, runners). And it is not one-or-the-other: agentic workflows can include custom jobs and deterministic steps alongside the AI agent — fixed data-fetch steps can run first, then the agent interprets and synthesizes the results.

</details>

## When to use an agentic workflow

Before you look at the diagram, apply the classification rule. Use this table to decide whether a task calls for an agentic or a standard Actions workflow:

| Signal | Agentic workflow | Standard Actions workflow |
|---|---|---|
| **Task output** | Varies every run — depends on what the agent finds | Same every run — a fixed script produces deterministic output |
| **Instructions** | Plain-English brief — no shell commands needed | YAML `run:` steps with fixed commands and logic |
| **Judgment required** | Agent must read context and decide what matters | No judgment — the same steps run regardless of content |
| **Typical trigger** | Schedule, issue comment, PR event, or manual dispatch | Push, pull request, or tag |

**Try it: classify before you read on.**

Pick the label — agentic or standard — for each task below, then reveal the answer.

**Task 1:** Run unit tests on every pull request and fail the check if any test exits non-zero.

- [ ] I've made my decision for Task 1

<details>
<summary>Reveal Task 1 answer</summary>

**Standard Actions workflow.** The steps are identical on every run — no judgment needed. Output (pass/fail) is determined by fixed commands, not by reading and reasoning about live data.

**If you chose agentic:** check the "judgment required" row. This task only needs to execute the same commands and report an exit code — there is nothing to read and reason about. Revise your mental model before Task 2.

</details>

**Task 2:** Each morning, read open issues, decide which look most urgent, and post a short triage digest.

- [ ] I've made my decision for Task 2

<details>
<summary>Reveal Task 2 answer</summary>

**Agentic workflow.** The agent reads live issue data, applies judgment to assess urgency, and composes a summary that differs every run based on what it finds.

**If you chose standard:** notice that the output cannot be predetermined — it depends entirely on what issues exist today, and "decide which look most urgent" requires reasoning, not a fixed comparison.

</details>

## Three things to know

Before you study the diagram, write your prediction: what two files are involved in an agentic workflow, and which one does GitHub Actions run?

- [ ] I've written my prediction

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/05-workflow-lifecycle-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/05-workflow-lifecycle-light.svg">
  <img alt="Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub" src="images/05-workflow-lifecycle-light.svg">
</picture>

- **What it is:** A Markdown file (`.md`) with YAML frontmatter and a plain-language brief. `gh aw compile` converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.
- **What it produces:** A synthesized report or action the agent composes from live repository data — different every run based on what it finds.
- **Why it exists:** Classic Actions handles deterministic CI/CD. Agentic workflows fill the gap for tasks that need judgment — or you can mix both in a single hybrid workflow.

Now check your prediction: did you name both files (`.md` and `.lock.yml`) and identify which one Actions runs (`.lock.yml`)? If not, re-read the first bullet above before continuing.

- [ ] My prediction matched — I got both files and which one Actions runs

## Try it: describe the lifecycle parts

Write a one-sentence description for each term **before** you reveal the answer. Use your own words — do not copy text from the diagram above.

**Term 1:** `.md` source file

Write your description:

- [ ] I've written my own description for Term 1

<details>
<summary>Reveal Term 1 answer</summary>

The **Markdown source file** — it contains the YAML frontmatter (trigger, permissions, runner) and your plain-English task brief. You author and edit this file.

</details>

**Term 2:** `.lock.yml` compiled file

Write your description:

- [ ] I've written my own description for Term 2

<details>
<summary>Reveal Term 2 answer</summary>

The **compiled lock file** — [`gh aw compile`](https://github.github.com/gh-aw/reference/compilation-process/) generates it from the `.md` source. GitHub Actions runs this file, not the `.md`. Never edit it by hand.

</details>

**Term 3:** `gh aw compile`

Write your description:

- [ ] I've written my own description for Term 3

<details>
<summary>Reveal Term 3 answer</summary>

The **compile command** — it reads the `.md` source and writes the `.lock.yml` file that Actions runs. You must recompile any time you change the source.

</details>

> [!TIP]
> Want more examples of how the two-file structure works? [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) includes a fully annotated workflow pair.

## Try it: predict and observe a task brief

Before you reveal the example, write a one- or two-sentence task brief for this goal:

> Post a daily issue digest that summarizes newly opened issues and flags anything that looks urgent.

- [ ] I wrote my own brief before revealing the example

<details>
<summary>Reveal one possible brief</summary>

You are a repository triage assistant. Each day, review issues opened in the last 24 hours, summarize each in one sentence, flag potential blockers or incidents, and post one concise digest comment for maintainers.

</details>

Now compare your draft to the revealed version:

- [ ] My brief included a **time window** (for example, "last 24 hours")
- [ ] My brief specified the **output format** (single digest comment)
- [ ] My brief defined at least one **priority signal** (for example, blockers or incidents)

If any box is unchecked, revise your brief to add that element before continuing.

## Self-check: three parts without looking

Without scrolling back, fill each blank in your head, then reveal:

- [ ] An agentic workflow always starts with a \_\_\_ (what triggers it?)
- [ ] The agent gets its instructions from the \_\_\_ (which part of the file?)
- [ ] After the agent finishes, output passes through \_\_\_ before it reaches GitHub (what system?)

<details>
<summary>Reveal answers</summary>

- A **trigger** in the frontmatter (schedule, push, workflow_dispatch, etc.) tells Actions when to run the agent.
- The agent reads the **task brief** — the plain-English text below the second `---` in the `.md` file.
- Output passes through **safe-outputs** guardrails, which limit what actions the agent can take (for example, only `create-issue`).

</details>

If any blank was blank, re-read the relevant section and try again before the checkpoint.

- [ ] I can fill all three blanks without looking
- [ ] I understand how the three parts connect: trigger starts the run, the brief tells the agent what to do, safe-outputs controls what it can post

## ✅ Checkpoint

- [ ] I can describe what an agentic workflow is in one sentence
- [ ] I can explain one way an agentic workflow differs from a standard Actions workflow
- [ ] I correctly classified both tasks in "When to use an agentic workflow" before revealing the answers
- [ ] I can identify the three parts: trigger → agent → safe output
- [ ] I know that `gh aw compile` generates `.lock.yml` from the `.md` source
- [ ] I wrote my own description for each lifecycle term before revealing the answer
- [ ] I practiced writing and revising a short workflow task brief — all three criteria checked (time window, output format, priority signal)
- [ ] I completed the self-check and can fill the three-parts blanks without looking

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
**Next:** [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md)
<!-- /journey -->
