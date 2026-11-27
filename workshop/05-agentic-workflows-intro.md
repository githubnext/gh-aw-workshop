<!-- page-journey: all -->
<!-- page-adventure: core -->
# What Are Agentic Workflows?

**Already familiar with both GitHub Actions and AI agent execution environments?**

Before skipping, confirm you already know both of these:

- You can describe what an Actions workflow [trigger](https://github.github.com/gh-aw/reference/triggers/) does
- You have worked with AI agent execution environments in a production or CI/CD context

If both apply, [Skip to Install gh-aw](06-install-gh-aw.md).

## :clipboard: Before You Start

- You've read [What Are GitHub Actions?](04-github-actions-intro.md)

An [**Agentic Workflow**](https://github.github.com/gh-aw/introduction/overview/) is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls tools, and posts the output automatically.

The agent always runs in a [sandbox](https://github.github.com/gh-aw/reference/sandbox/) and posts results through guardrailed [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/). You will explore security in [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md).

## Three key terms

| Term | What it means |
|---|---|
| [Trigger](https://github.github.com/gh-aw/reference/triggers/) | The event or schedule that starts the workflow |
| [Task brief](https://github.github.com/gh-aw/reference/markdown/) | The plain-English instructions you write for the agent |
| [Safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) | The guardrails that control how the workflow writes back to GitHub |

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/05-three-terms-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/05-three-terms-light.svg">
  <img alt="Agentic workflow: three key terms in sequence. A Trigger (schedule or event) starts the workflow. The Task Brief (plain-English instructions) guides the AI agent as it reads repo data and calls tools. Safe Outputs (guardrailed write paths) control how results are posted back to GitHub." src="images/05-three-terms-light.svg">
</picture>

For a full glossary, see [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md).

## The two-file structure

Before studying the diagram, write your prediction: what two files are involved, and which one does GitHub Actions actually run?

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/05-workflow-lifecycle-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/05-workflow-lifecycle-light.svg">
  <img alt="Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub" src="images/05-workflow-lifecycle-light.svg">
</picture>

- **`.md` source file** — contains [YAML frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) (trigger, [permissions](https://github.github.com/gh-aw/reference/permissions/), runner) and your plain-English task brief. You author and edit this file.
- **`.lock.yml` compiled file** — [`gh aw compile`](https://github.github.com/gh-aw/reference/compilation-process/) generates it from the `.md`. GitHub Actions runs this file, not the `.md`. Never edit it by hand.

**Activity 1 — find the trigger:** You haven't compiled a workflow yet, so use this excerpt from a compiled `.lock.yml`. Find the `on:` key — that is the trigger that came from the frontmatter of the `.md` source.

```yaml
name: "Daily Issue Digest"
"on":
  schedule:
  - cron: "0 9 * * *"
  workflow_dispatch:
permissions: {}
jobs:
  agent:
    runs-on: ubuntu-latest
```

- [ ] Find the `on:` key and name the two ways this workflow can start (`schedule` and `workflow_dispatch`).

Now check your prediction: did you name both files and identify which one Actions runs (`.lock.yml`)?

## Activity 2 — agentic or standard?

The diagram below shows how the same schedule trigger leads to two very different outcomes — one driven by static YAML, the other by an AI agent with built-in safety guardrails.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/00-actions-vs-agentic-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/00-actions-vs-agentic-light.svg">
  <img alt="Side-by-side comparison of Classic GitHub Actions YAML versus an Agentic Workflow with safety highlights. Classic: schedule trigger flows through static YAML steps and shell scripts to produce output. Agentic: same trigger flows through a plain-English task brief with safety config (permissions, tools, safe-outputs) into a sandbox-isolated AI agent that applies integrity filtering and zero-secrets constraints, producing output only through declared safe-output surfaces." src="images/00-actions-vs-agentic-light.svg">
</picture>

Read each task and decide before revealing the answer.

**Task A:** Run lint and unit tests on every pull request, fail if any check exits non-zero.

<details>
<summary>Reveal Task A answer</summary>

**Standard Actions workflow.** Every run follows the same fixed steps. No judgment required.

</details>

**Task B:** Each morning, read all open issues, decide which look most urgent, and post a short triage summary.

<details>
<summary>Reveal Task B answer</summary>

**Agentic workflow.** The agent reads live data, applies judgment, and composes a different summary every run based on what it finds.

</details>

## Activity 3 — sharpen a task brief

This brief is too vague for an agent to act on consistently:

```
Tell me about new issues.
```

Rewrite it before revealing the example. Your goal: a daily digest that summarizes newly opened issues and flags anything urgent.

<details>
<summary>Reveal one possible brief</summary>

You are a repository triage assistant. Each day, review issues opened in the last 24 hours, summarize each in one sentence, flag potential blockers, and post one concise digest comment for maintainers.

</details>

Check your rewrite against these three criteria:

- [ ] It includes a **time window** (for example, "last 24 hours")
- [ ] It specifies the **output format** (single digest comment)
- [ ] It defines at least one **priority signal** (for example, blockers)

If any box is unchecked, revise your brief before continuing.

> [!TIP]
> Want annotated examples and more exercises? See [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md).

## :white_check_mark: Checkpoint

- [ ] You can describe what an agentic workflow is in one sentence
- [ ] You can explain one difference between an agentic and a standard Actions workflow
- [ ] You know the three key terms: trigger, task brief, [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)
- [ ] You know that `gh aw compile` generates `.lock.yml` from the `.md` source
- [ ] You found the `on:` key in the sample `.lock.yml` excerpt
- [ ] Your rewritten task brief includes a time window, output format, and priority signal

<details>
<summary>Still uncertain? Try this before moving on</summary>

Does `gh aw compile` change what the agent does at runtime? Decide first.

<details>
<summary>Reveal</summary>

No. Compile converts `.md` to `.lock.yml`. Runtime output comes from your task brief and live repo state.

</details>

</details>

<!-- journey: all -->
**Next:** [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md)
<!-- /journey -->
