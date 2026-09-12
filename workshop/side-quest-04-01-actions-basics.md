<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: GitHub Actions Basics — Triggers, Jobs, Runners, and Steps

> _A closer look at the building blocks every GitHub Actions workflow file shares — useful if the vocabulary in Step 4 felt unfamiliar._

## :dart: What You'll Do

You'll read an annotated GitHub Actions workflow file line by line, learn what a runner is, and connect each primitive to its plain-English meaning. By the end, you'll be comfortable reading any classic GitHub Actions workflow file, agentic or not.

## :clipboard: Before You Start

- You're partway through [GitHub Actions in 5 Minutes](04-github-actions-intro.md) and want a deeper look at the primitives before continuing.
- No tools or credentials needed for this side quest.

## Steps

### Read the anatomy of a workflow file

A GitHub Actions workflow is a YAML file in `.github/workflows/` that tells GitHub:

- _when_ to run (`on`)
- _what_ to run (`jobs`)
- _how_ each job executes (`steps`)

```text
.github/
  workflows/
    hello.yml   ← each workflow file lives here
```

### Walk through an annotated example

Each comment below names the key term. This is a standard Actions workflow, not an agentic one:

```yaml .github/workflows/hello-workflow.yml
# Standard GitHub Actions workflow — not an agentic workflow
name: Hello Workflow

on: workflow_dispatch         # trigger: the event that starts this workflow

jobs:
  hello:                      # job: a named group of steps on one machine
    runs-on: ubuntu-latest    # runner: the machine GitHub provisions for this job
    steps:
      - run: echo "Hello from GitHub Actions"   # step: a shell command on the runner
```

### Understand what a runner is

A **runner** is the machine GitHub provisions for each job — fresh and isolated for every run.

```markdown .github/workflows/hello-workflow.md
---
runs-on: ubuntu-latest   # also: windows-latest, macos-latest
---
```

You can also bring a **[self-hosted runner](https://github.github.com/gh-aw/reference/self-hosted-runners/)** for custom hardware or private networks. Agentic workflows use the same hosted runners.

### Check your understanding

Before moving on, confirm you can answer each of these without looking back:

- What key starts a workflow (the trigger)?
- What is a job, and what runs inside one?
- What is a runner, and is it shared across runs or fresh each time?
- What is the difference between a `run:` step and a `uses:` step (an action)?

## :white_check_mark: Checkpoint

- [ ] You can name the four core GitHub Actions primitives: trigger, job, runner, step
- [ ] You can describe what a runner is and why it's fresh for every run
- [ ] You understand the difference between a self-hosted and GitHub-hosted runner
- [ ] You can read the annotated example above and explain each highlighted line in your own words

**Return to the main adventure:** [GitHub Actions in 5 Minutes](04-github-actions-intro.md)
