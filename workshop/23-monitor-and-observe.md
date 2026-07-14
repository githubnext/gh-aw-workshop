# Monitor Your Workflow in Production

> _A workflow you can't observe is a workflow you can't trust — visibility is what turns a one-off experiment into a reliable automation._

## 🎯 What You'll Do

Learn how to check on your scheduled workflow's health using the GitHub Actions UI. You'll review run history, interpret status badges, set up email notifications, and build a habit of catching problems early before they go unnoticed.

## 📋 Before You Start

- Your workflow runs on a schedule (see [Schedule It to Run Every Day](13-schedule-it.md)).
- You've applied at least one resilience technique (see [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)).

## Steps

### Check run history in the Actions tab

The GitHub Actions tab is your primary observability dashboard.

1. Open your repository on GitHub.
2. Click the **Actions** tab.
3. Find your scheduled workflow in the left sidebar and click it.

You'll see a list of all past runs with status icons:

| Icon | Meaning |
|------|---------|
| ✅ Green check | Run completed successfully |
| ❌ Red X | Run failed — click to see the error |
| 🟡 Yellow dot | Run is in progress |
| ⏭️ Skip | Run was skipped (e.g., no trigger event) |

> [!TIP]
> Look for a pattern over multiple days. One failed run might be a fluke — three in a row usually means something needs fixing.

### Read a run's detail page

Click any run to open its detail page. Each run shows:

- **Jobs**: the list of jobs in the workflow (usually just one for agentic workflows).
- **Steps**: the individual steps inside each job, including the agent execution step.
- **Annotations**: warnings and errors the runner recorded.

Scroll to the agent step and expand it to see what the AI agent actually did. The structured log shows every tool call, decision, and safe-output action.

### Set up email notifications

GitHub can email you when a scheduled workflow fails. This is the simplest monitoring setup available.

1. Click your profile photo in the top right corner of GitHub.
2. Go to **Settings** → **Notifications**.
3. Scroll to **Actions**.
4. Make sure **Send notifications for failed workflows only** or **Send notifications for all workflows** is enabled.

> [!NOTE]
> Email notifications for scheduled workflows fire only on failure by default. If you want success notifications too, enable **Successful runs** under the same setting.

### Add a status badge to your README

A status badge in your repository README gives anyone who lands on the page an instant view of workflow health.

1. In the **Actions** tab, click your workflow in the sidebar.
2. Click the **⋯** (three-dot) menu near the top right and select **Create status badge**.
3. Copy the generated Markdown snippet.
4. Paste it into your `README.md`.

The badge updates automatically after each run.

<details>
<summary>🖥️ Add the badge via the GitHub UI editor</summary>

1. Navigate to `README.md` in your repository.
2. Click the **pencil icon (✏️)** to open the editor.
3. Paste the badge snippet at the top of the file.
4. Click **Commit changes**.

</details>

### Know when to investigate

Not every failed run needs immediate action, but some patterns do:

- **Consecutive failures** on a scheduled workflow — check for API rate limits, expired tokens, or a broken task brief.
- **Runs that succeed but produce no output** — the agent ran but the safe-output step may not have fired. Review the agent log for a `noop` call with an unexpected reason.
- **Dramatically longer run times** — could indicate a prompt that triggers long reasoning chains; consider tightening the task brief or lowering the timeout.

> [!TIP]
> Keep a simple note (in an issue or a pinned comment) of the last time you reviewed your workflow's run history. Even a monthly check-in catches most problems early.

## ✅ Checkpoint

- [ ] You've opened the **Actions** tab and located your scheduled workflow's run history
- [ ] You can identify what a failed run looks like and where to find its error log
- [ ] You've enabled GitHub email notifications for failed Actions runs
- [ ] You've added a workflow status badge to your repository `README.md`
- [ ] You can name at least two patterns that signal a workflow needs investigation

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
- [Side Quest: Debugging Output Patterns](side-quest-09-01-debug-output.md)
- [Side Quest: Debugging Checklist](side-quest-09-01f-debugging-checklist.md)
