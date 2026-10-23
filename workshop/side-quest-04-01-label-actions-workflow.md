<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Label a GitHub Actions Workflow

> _Optional: practice naming the five parts of a workflow file so every later agentic workflow looks familiar._

## :dart: What You'll Do

You'll look at the anatomy of a GitHub Actions workflow and label each line of a small sample as a `trigger`, `job`, `runner`, `step`, or `action`. When you're done, you can read any classic workflow file at a glance.

## :clipboard: Before You Start

- You've read the refresher in [GitHub Actions in 5 Minutes](04-github-actions-intro.md).
- No tools or credentials needed.

## Steps

### Study the anatomy diagram

The diagram below shows how the five key parts fit together in every workflow file.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/04-actions-anatomy-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/04-actions-anatomy-light.svg">
  <img alt="GitHub Actions workflow anatomy: trigger, job, runner, steps, and actions shown as nested layers" src="images/04-actions-anatomy-light.svg">
</picture>

### Label the sample

Before reading on, label each highlighted part of the workflow below with its type:
`trigger`, `job`, `runner`, `step`, or `action`.

```yaml .github/workflows/hello-workflow.yml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "All checks passed"
```

Write a label beside each line:

1. `on: [push]`
2. `test:` (the job name under `jobs:`)
3. `runs-on: ubuntu-latest`
4. `uses: actions/checkout@v4`
5. `run: echo "All checks passed"`

<details>
<summary>Reveal the labels</summary>

- `on: [push]` → **trigger** (when this workflow runs)
- `jobs: test:` → **job** (a group of steps that runs on one machine)
- `runs-on: ubuntu-latest` → **runner** (the machine type GitHub provisions)
- `uses: actions/checkout@v4` → **action** (a reusable step from the Actions marketplace)
- `run: echo "All checks passed"` → **step** (a shell command run directly on the runner)

</details>

## :white_check_mark: Checkpoint

- [ ] You labeled all five parts of the sample workflow (trigger, job, runner, action, step)
- [ ] You can explain the difference between an action (`uses:`) and a shell step (`run:`)

**Return to the main adventure:** [GitHub Actions in 5 Minutes](04-github-actions-intro.md)
