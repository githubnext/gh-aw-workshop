# Observe and Monitor Your Workflows in Production

> _Shipping a scheduled workflow is just the beginning — knowing how to read its history, spot failures early, and understand its costs is what keeps it running reliably._

## 🎯 What You'll Do

You will use the GitHub Actions dashboard to review your workflow's run history, read the log summary produced by your agent, and configure email notifications so you hear about failures before your teammates do. By the end of this step, you will have a clear routine for checking on your running workflows.

## 📋 Before You Start

- You have a scheduled workflow running in your repository — see [Schedule It to Run Every Day](13-schedule-it.md).
- You are comfortable reading GitHub Actions logs — see [Reading Workflow Output](09-understand-output.md).

## Steps

### Review the run history

1. Open your repository on GitHub.
2. Click the **Actions** tab.
3. In the left sidebar, select your workflow by name.

You will see a list of recent runs with colour-coded status icons:

| Icon | Meaning |
|------|---------|
| ✅ Green circle | Run succeeded |
| ❌ Red circle | Run failed |
| 🟡 Yellow circle | Run is in progress or queued |
| ⚫ Grey circle | Run was cancelled |

1. Click any run to open its details page. The **Summary** section at the top shows total duration and which jobs ran.

> [!TIP]
> Scheduled runs appear with the trigger label `schedule`. Manual runs show `workflow_dispatch`. Knowing the trigger helps you separate test runs from production runs at a glance.

### Read the agent's output

Each successful run writes a summary to the GitHub Actions log. Your agent's task brief controls what ends up there.

1. Inside a run, click the **agent** job name.
2. Expand the step labelled **Run agent** or similar.
3. Scroll through the log to find lines prefixed with `[safe-output]` — these are the structured results your agent emitted.

> [!NOTE]
> If a run succeeded but the `[safe-output]` block is empty, the agent found nothing to report for that run. Check your task brief's fallback instruction — see [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md).

### Set up failure notifications

GitHub can email you whenever a workflow fails — no extra tools required.

1. Click your avatar in the top-right corner and choose **Settings**.
2. Go to **Notifications** → **Actions**.
3. Under **Email**, check **Only notify for failed workflows** (or adjust to your preference).
4. Click **Save**.

You can also watch individual workflows: open the workflow's page, click the **…** menu next to the workflow name, and choose **Create status badge** or **Subscribe** (if available in your GitHub plan).

![Actions notifications settings](images/23-actions-notifications.png)

### Check run duration trends

Long-running workflows can indicate a stuck agent or a runaway loop.

1. On the workflow's run list, glance at the **Duration** column.
2. If a run takes significantly longer than usual, open it and look for a step that is consuming most of the time.
3. Compare against your `timeout-minutes` setting in the workflow frontmatter — if runs approach the limit, tighten the prompt or add an explicit stopping instruction in your task brief.

<details>
<summary>🖥️ GitHub UI — checking run duration without a terminal</summary>

1. Go to **Actions** → your workflow → the run you want to inspect.
2. Each job card shows a duration badge in the top-right corner.
3. Expand individual steps to see per-step timings.

No terminal needed — everything is visible in the browser.

</details>

### Keep a mental health check routine

A simple weekly habit keeps scheduled workflows trustworthy:

1. Open the **Actions** tab and scan the last seven runs.
2. Look for any failure pattern — does the same step fail repeatedly?
3. If failures are clustered around a specific day or time, check whether an external data source (API, repo query) was unavailable.
4. Trigger a manual run after any fix to confirm the workflow is healthy before the next scheduled execution.

## ✅ Checkpoint

- [ ] You can find and open your workflow's run history in the Actions tab
- [ ] You can identify the `[safe-output]` block in a successful run log
- [ ] You have enabled email notifications for workflow failures in your GitHub settings
- [ ] You can explain what to look for when a run takes longer than expected
- [ ] You can describe your weekly routine for checking on a scheduled workflow

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
- [Schedule It to Run Every Day](13-schedule-it.md)
- [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)
- [Side Quest: Debugging Checklist](side-quest-09-01f-debugging-checklist.md)
