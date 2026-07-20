<!-- page-journey: terminal -->
<!-- page-adventure: core -->
# Write Your First Agentic Workflow — Terminal Path

_Writing your first workflow is the moment theory becomes practice — let's make something real._

> [!NOTE]
> Want to work without a terminal? Switch to the [GitHub UI path](07b-your-first-workflow-ui.md).

## 🎯 What You'll Do

You'll create the first version of `.github/workflows/daily-report-status.md` with just two [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) fields:

- `name` (workflow label)
- `on.schedule` (manual trigger)

Then you'll run your first compile check.

## 📋 Before You Start

- Completed [Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command works in your terminal
- You already ran `gh aw init` and pushed `.github/skills/agentic-workflows/`

## Steps

### Create the workflows directory

```bash
mkdir -p .github/workflows
```

### Create your first workflow file

```bash
touch .github/workflows/daily-report-status.md
```

Open `.github/workflows/daily-report-status.md` in your editor.

> [!IMPORTANT]
> This `.md` file is **not** the workflow GitHub Actions executes. You write the goal in Markdown; `gh aw compile` generates the `.lock.yml` file that Actions actually runs.

### Add the starter frontmatter

Paste this at the top of the file:

```yaml
---
name: Daily Report Status
on:
  schedule: daily
---
```

- `name` is what you see in the Actions UI.
- `schedule: daily` means it triggers once a day. The compiler automatically adds the `workflow_dispatch` event as well.

![How workflow_dispatch works: author the .md file, compile to a lock.yml, push to GitHub, then click Run workflow in the Actions tab to trigger the agent](images/07a-workflow-dispatch-trigger.svg)

### Run your first compile check

```bash
gh aw compile
```

Expected result:

You see a green success message and a generated `.lock.yml` file next to `daily-report-status.md`.

If you hit an error, use [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).


## ✅ Checkpoint

- [ ] `.github/workflows/daily-report-status.md` exists
- [ ] You ran `gh aw compile` successfully

<!-- journey: terminal -->
Continue to [Part 2: Add instructions, safe outputs, and finish](07a-part2-your-first-workflow-instructions.md).
<!-- /journey -->

- [ ] `gh aw compile` succeeds and generates `daily-report-status.lock.yml`
- [ ] `gh extension list` shows `github/gh-aw` is installed
