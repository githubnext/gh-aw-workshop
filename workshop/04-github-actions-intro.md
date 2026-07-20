<!-- page-journey: all -->
<!-- page-adventure: core -->
# GitHub Actions in 5 Minutes

> [!TIP]
> <details>
> <summary><b>Already know GitHub Actions?</b> Check the three boxes below and skip ahead:</summary>
>
> - [ ] I know workflows live in `.github/workflows/` as YAML files
> - [ ] I can read `on`, `jobs`, and `steps` keys in a workflow file
> - [ ] I know each step runs on a GitHub-hosted runner
>
> **→ [Skip to Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)**
> (or [jump to Step 6: Install gh-aw](06-install-gh-aw.md) if you know both)
>
> </details>

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: [triggers](https://github.github.com/gh-aw/reference/triggers/), jobs, steps, and workflow files. After this step, you'll be able to read any classic GitHub Actions workflow file — a skill you'll build on immediately in Steps 5 and 6.

## 📋 Before You Start

- You've completed [Step 3: Create Your Practice Repository](03-create-your-repo.md)
- No credentials needed — works entirely in your browser

## Classic Actions vs [Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)

If you already know Actions, here's the key shift at a glance:

| Dimension | Classic Actions | Agentic Workflows |
|-----------|-----------------|-------------------|
| **Task description** | You write YAML `steps` | You write a plain-English brief |
| **Execution model** | Deterministic — same inputs, same path | AI agent reasons and adapts at runtime |
| **Tool selection** | Fixed — you specify every `uses` and `run` | Agent selects and chains tools from declared toolsets |
| **File format** | `.github/workflows/*.yml` | `.github/workflows/*.md` (compiled to `.lock.yml`) |

## Quick Refresher

A GitHub Actions workflow is a YAML file in `.github/workflows/` that tells GitHub:

- _when_ to run (`on`)
- _what_ to run (`jobs`)
- _how_ each job executes (`steps`)

Minimal example:

```yaml
name: Hello Workflow

on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello from GitHub Actions"
```

## Why This Matters for Agentic Workflows

Traditional workflows execute a fixed script path. Agentic workflows still use the same Actions foundation, but introduce AI-driven decision making inside that runtime.

Step 5 is the optional transition if you want the conceptual delta before installing `gh-aw`: _what changes when a workflow can reason and choose next actions_.

## Label a sample workflow

The diagram below shows how the five key parts fit together in every workflow file.

![GitHub Actions workflow anatomy: trigger, job, runner, steps, and actions shown as nested layers](images/04-actions-anatomy.svg)

Before reading on, label each highlighted part of the workflow below with its type:
`trigger`, `job`, `runner`, `step`, or `action`.

```yaml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "All checks passed"
```

- [ ] I labeled `on: [push]`
- [ ] I labeled `test:` (the job name under `jobs:`)
- [ ] I labeled `runs-on: ubuntu-latest`
- [ ] I labeled `uses: actions/checkout@v4`
- [ ] I labeled `run: echo "All checks passed"`

<details>
<summary>Reveal the labels</summary>

- `on: [push]` → **trigger** (when this workflow runs)
- `jobs: test:` → **job** (a group of steps that runs on one machine)
- `runs-on: ubuntu-latest` → **runner** (the machine type GitHub provisions)
- `uses: actions/checkout@v4` → **action** (a reusable step from the Actions marketplace)
- `run: echo "All checks passed"` → **step** (a shell command run directly on the runner)

</details>

## Try it: Explore a real workflow

Open a real workflow file and find the three core building blocks — no terminal or credentials required, just your browser.

1. Open any public repository on GitHub (for example, the [gh-aw-workshop](https://github.com/githubnext/gh-aw-workshop) repository).
2. Click the **Actions** tab.
3. Click any workflow in the left sidebar.
4. Click **View workflow file** (top right of the run list).
5. In the YAML, find and note:
   - The `on:` trigger — what event starts this workflow?
   - One `jobs:` entry — what is the job named?
   - One `steps` item — what command does it run?

You don't need to understand every line. The goal is to see that a real workflow follows exactly the structure described above.

- [ ] I found the `on:` trigger in a real workflow
- [ ] I identified a job name under `jobs:`
- [ ] I found at least one `steps` command

## Check your understanding

Mark each statement as true or false, then reveal the answers:

- [ ] Workflow files live in `.github/workflows/` as YAML
- [ ] The `on:` key defines when a workflow runs, not which commands to execute
- [ ] Each step in a job runs on its own separate virtual machine
- [ ] Agentic workflows replace scripted steps with a plain-language brief

<details>
<summary>Reveal answers</summary>

1. True — workflow files live in `.github/workflows/` as YAML.
2. True — `on:` is the trigger; commands go in `steps` entries.
3. False — steps within a job share one runner; a new machine is provisioned per job.
4. True — agentic workflows use a Markdown brief in place of scripted `steps`; the agent decides the how.

</details>

## ✅ Checkpoint

- [ ] I can identify `on`, `jobs`, and `steps` in a workflow file
- [ ] I labeled all five parts of the sample workflow above (trigger, job, runner, action, step)
- [ ] I know workflows live in `.github/workflows/`
- [ ] I explored a real workflow and found its trigger, a job name, and a step command
- [ ] I answered the check-your-understanding questions
- [ ] I can continue to Step 5, or skip ahead to Step 6 if I already know this material

<!-- journey: all -->
**Next:** [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/) and [Triggers reference](https://github.github.com/gh-aw/reference/triggers/).

