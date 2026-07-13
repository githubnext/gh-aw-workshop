# Harden Your Workflow for Production

> _Knowing how to build an agentic workflow is one thing — knowing how to keep it healthy in production is another._

## 🎯 What You'll Do

You will apply a short production-readiness checklist to a workflow you've already built.
By the end, your workflow will have clear error handling, a meaningful safe-output, sensible resource limits, and a lightweight monitoring strategy using GitHub Actions built-ins.

## 📋 Before You Start

- You've completed at least one build step: [11a](11a-build-daily-status.md), [11b](11b-build-daily-docs.md), [11c](11c-build-pr-reviewer.md), or [11d](11d-build-copilot-agents.md).
- Optional but recommended: [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md), [Step 20: Make Your Workflow Remember Across Runs](20-persistent-memory.md), [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).

## Steps

### Review the production checklist

Before pushing a workflow that will run on a schedule or respond to real events, verify:

- **Permissions**: The workflow declares only what it needs.
- **Timeout**: `timeout-minutes` is set so a stuck run doesn't block your queue.
- **Safe outputs**: Every write action goes through a `safe-outputs` declaration.
- **Failure visibility**: The workflow signals clearly even when it has nothing to report.
- **Secrets**: Tokens are stored in repository secrets, not hard-coded.
- **Branch scope**: If the workflow writes to the repo, its trigger is limited to the default branch.

### Open your workflow file

Navigate to `.github/workflows/<your-workflow>.md` in your repository on GitHub and click the pencil icon ✏️ to edit it.

### Set a timeout

Add a `timeout-minutes` field in the frontmatter so a stuck run doesn't consume queue time indefinitely:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 8 * * 1-5"
timeout-minutes: 10
permissions:
  contents: read
---
```

> [!TIP]
> Use `10` minutes for lightweight reporting workflows and `20–30` minutes for workflows that call external APIs or run sub-agents.

### Confirm safe-outputs cover every write

Read through your task brief (the Markdown section below the frontmatter).
Every write action (creating an issue, posting a comment, opening a PR) must map to a `safe-outputs` declaration in the frontmatter.

A `safe-outputs` block looks like this:

```yaml
safe-outputs:
  add_comment:
    item_number: ${{ github.event.issue.number }}
```

If a write action appears in your brief but has no `safe-outputs` entry, add one.
The [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/) lists every supported output type.

### Add a no-op fallback

A workflow that silently does nothing is hard to distinguish from a broken one.
Add a line to your task brief such as:

> If there is no activity to report, call `noop` with the message "No activity since last run."

This produces a visible entry in the Actions log every run — even quiet ones.

### Verify secrets are in place

Open **Settings → Secrets and variables → Actions** in your repository and confirm any token or API key your workflow uses (e.g., `COPILOT_GITHUB_TOKEN`, `ANTHROPIC_API_KEY`) appears in the **Repository secrets** list.

> [!WARNING]
> Never paste a secret value into your workflow file. If a secret appears in a run log, rotate it immediately.

### Trigger a manual test run

After saving, go to **Actions → your workflow → Run workflow** and trigger a manual run.
Check the log for a green ✅ (or an explicit `noop` entry) and confirm the run finishes within your timeout.

![Manual workflow dispatch button in GitHub Actions](images/22-run-workflow.png)

## ✅ Checkpoint

- [ ] `timeout-minutes` is set in your workflow frontmatter
- [ ] Every write action in your task brief has a corresponding `safe-outputs` declaration
- [ ] Your task brief instructs the agent to call `noop` when there is nothing to report
- [ ] All secrets are stored in repository secrets, not in the workflow file
- [ ] A manual test run completed successfully with a visible output or `noop` entry

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Side Quest: Secrets and Permissions Deep Dive](side-quest-16-02-secrets-and-permissions.md)
- [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md)
- [Step 20: Make Your Workflow Remember Across Runs](20-persistent-memory.md)
