# Step 4: GitHub Actions in 5 Minutes

> [!TIP]
> **Already know GitHub Actions?** Check the three boxes below and skip ahead:
> - [ ] I know workflows live in `.github/workflows/` as YAML files
> - [ ] I can read `on`, `jobs`, and `steps` keys in a workflow file
> - [ ] I know each step runs on a GitHub-hosted runner
>
> **→ [Skip to Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)**
> (or [jump to Step 6: Install gh-aw](06-install-gh-aw.md) if you know both)

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: [triggers](https://github.github.com/gh-aw/reference/triggers/), jobs, steps, and workflow files. After this step, you'll be able to read any classic GitHub Actions workflow file — a skill you'll build on immediately in Steps 5 and 6.

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
      - run: npm test
```

- [ ] I labeled `on: [push]`
- [ ] I labeled `test:` (the job name under `jobs:`)
- [ ] I labeled `runs-on: ubuntu-latest`
- [ ] I labeled `uses: actions/checkout@v4`
- [ ] I labeled `run: npm test`

<details>
<summary>Reveal the labels</summary>

- `on: [push]` → **trigger** (when this workflow runs)
- `jobs: test:` → **job** (a group of steps that runs on one machine)
- `runs-on: ubuntu-latest` → **runner** (the machine type GitHub provisions)
- `uses: actions/checkout@v4` → **action** (a reusable step from the Actions marketplace)
- `run: npm test` → **step** (a shell command run directly on the runner)

</details>

## Try it: Find a workflow trigger in the wild

Open a real workflow file and identify its trigger — no terminal required, just your browser.

1. Open any public repository on GitHub (for example, the [gh-aw-workshop](https://github.com/githubnext/gh-aw-workshop) repository).
2. Click the **Actions** tab.
3. Click any workflow in the left sidebar.
4. Click **View workflow file** (top right of the run list).
5. Identify: What triggers this workflow? (Look for the `on:` key.)
6. Note your answer — you'll use this observation in Step 5.

## ✅ Checkpoint

- [ ] I can identify `on`, `jobs`, and `steps` in a workflow file
- [ ] I labeled all five parts of the sample workflow above (trigger, job, runner, action, step)
- [ ] I know workflows live in `.github/workflows/`
- [ ] I found and identified at least one workflow trigger in a public repository
- [ ] I can continue to Step 5, or skip ahead to Step 6 if I already know this material

**Next:** [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
