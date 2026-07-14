# Side Quest: GitHub Actions Vocabulary Builder

> _Lock in the five key terms before you write your first agentic workflow — so nothing in the steps ahead catches you off guard._

## 🎯 What You'll Do

You'll label the parts of a real workflow YAML snippet, explore a live workflow in your browser, and take a short true/false quiz to confirm your understanding of GitHub Actions building blocks.

## 📋 Before You Start

- You've read [Step 4: GitHub Actions in 5 Minutes](04-github-actions-intro.md) — or you already know what `on`, `jobs`, and `steps` do in a workflow file.
- A browser is all you need — no terminal or credentials required.

## Steps

### Label a sample workflow

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

### Explore a real workflow in your browser

Open a real workflow file and find the three core building blocks — no terminal or credentials required.

1. Open any public repository on GitHub (for example, the [gh-aw-workshop](https://github.com/githubnext/gh-aw-workshop) repository).
2. Click the **Actions** tab.
3. Click any workflow in the left sidebar.
4. Click **View workflow file** (top right of the run list).
5. In the YAML, find and note:
   - The `on:` trigger — what event starts this workflow?
   - One `jobs:` entry — what is the job named?
   - One `steps` item — what command does it run?

You don't need to understand every line. The goal is to see that a real workflow follows exactly the same structure described above.

- [ ] I found the `on:` trigger in a real workflow
- [ ] I identified a job name under `jobs:`
- [ ] I found at least one `steps` command

### Check your understanding

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

- [ ] I labeled all five parts of the sample workflow (trigger, job, runner, action, step)
- [ ] I explored a real workflow and found its trigger, a job name, and a step command
- [ ] I answered the four true/false questions and can explain the answer to question 3

**Return to the main adventure:** [Step 4: GitHub Actions in 5 Minutes](04-github-actions-intro.md)
