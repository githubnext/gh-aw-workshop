<!-- page-journey: all -->
<!-- page-adventure: core -->
# Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll use Copilot to create `.github/workflows/daily-report-status.md` — a scheduled workflow that also supports manual dispatch. You'll configure it with [`permissions`](https://github.github.com/gh-aw/reference/permissions/), [`safe-outputs`](https://github.github.com/gh-aw/reference/safe-outputs/), and a task brief, then compile it to produce `daily-report-status.lock.yml`, the file [GitHub Actions](https://github.github.com/gh-aw/guides/github-actions-primer/) runs.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/07-compile-flow-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/07-compile-flow-light.svg">
  <img alt="Diagram showing how you prompt an agent with the agentic-workflows skill to create daily-report-status.md, which is compiled by gh aw compile into daily-report-status.lock.yml, which GitHub Actions then executes" src="images/07-compile-flow-light.svg">
</picture>

## 📋 Before You Start

- Completed [Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command works in your terminal
- You already ran `gh aw init` and pushed `.github/skills/agentic-workflows/`

**Verify Copilot access before you begin.** Open the **Agents** tab in your repository on GitHub.com and send this prompt:

```prompt
/agentic-workflows what trigger does a scheduled workflow use?
```

Confirm you receive a reply. Any response means Copilot and the `agentic-workflows` skill are accessible.

> [!IMPORTANT]
> If you see an error instead of a reply, do not continue. Fix the access issue first — model-access errors will cause Step 8 to fail. Check [github.com/settings/copilot](https://github.com/settings/copilot), then see [Confirm Model Access](07d-confirm-model-access.md) for detailed troubleshooting.

- [ ] I sent the test prompt and received a reply from the Agents tab

## Create your first workflow

> [!NOTE]
> Use the **AI agent that runs your agentic workflows** (Copilot, Claude, Codex, or whichever you configured) for all agentic workflow tasks in this workshop. Using the same agent locally gives you behavior that matches production — Copilot Chat (Agent Mode) runs in a different harness and may produce different results.

In your AI agent, run this prompt:

```prompt
/agentic-workflows Create a daily-report-status workflow with:
- name: Daily Report Status
- triggers: daily schedule and workflow_dispatch
- permissions: contents read, issues read, copilot-requests write
- safe-outputs with key `create-issue`
- task brief: "Generate an activity report in a new issue."
Compile it after creating it.
```

Review the agent's edit, then continue. Prefer this path over hand-editing each line.

**What the agent created** — the generated file should look roughly like this:

```yaml
---
name: Daily Report Status
on:
  schedule:
    - cron: "0 9 * * *"      # runs every day at 09:00 UTC
  workflow_dispatch: {}       # also allows manual runs
permissions:
  contents: read
  issues: read
  copilot-requests: write     # required to call the AI model
safe-outputs:
  - key: create-issue         # the only write action the agent may perform
---

Generate an activity report for this repository and post it as a new issue.
```

The **frontmatter** tells GitHub Actions when to run, what permissions the agent has, and which write action it may use (`create-issue`). The **task brief** below the second `---` is what the AI agent reads and acts on.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/07a-workflow-dispatch-trigger-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/07a-workflow-dispatch-trigger-light.svg">
  <img alt="How workflow_dispatch works: author the .md file, compile to a lock.yml, push to GitHub, then click Run workflow in the Actions tab to trigger the agent" src="images/07a-workflow-dispatch-trigger-light.svg">
</picture>

If you hit a compile error, use [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Validate, then commit and push

Run:

```bash
gh aw compile
```

Optional while editing: `gh aw compile --watch`.

Then commit and push:

```bash
git add .
git commit -m "Add daily-report-status agentic workflow"
git push
```

For follow-up edits, keep using an agent with the `agentic-workflows` skill and avoid manual workflow editing unless you are debugging a specific line-level issue.

## ✅ Checkpoint

- [ ] Copilot access was confirmed in the **Agents** tab before starting (test prompt received a reply)
- [ ] `.github/workflows/daily-report-status.md` exists and contains an `on: schedule:` trigger in the frontmatter
- [ ] The file includes `permissions` with `copilot-requests: write`
- [ ] `gh aw compile` exits with no errors and produces `daily-report-status.lock.yml`
- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed and pushed to `main`
- [ ] The workflow appears in the **Actions** tab of your repository under "Daily Report Status"
- [ ] You are ready to choose the workflow's billing and authentication method

<!-- journey: all -->
**Next:** [Confirm Model Access](07d-confirm-model-access.md)
<!-- /journey -->
