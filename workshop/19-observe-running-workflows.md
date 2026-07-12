# Keep Your Workflows Healthy

> _Once a workflow runs on a schedule, your job shifts from builder to operator — this step shows you how to catch failures early and keep things running smoothly._

## 🎯 What You'll Do

You'll learn how to check your scheduled workflow's run history, recognise common failure patterns at a glance, and add a simple self-healing notification so a failed run creates a GitHub issue instead of silently disappearing.

## 📋 Before You Start

- You completed [Step 13: Schedule It to Run Every Day](13-schedule-it.md)
- Your workflow has run at least once (manually or on its schedule)

---

## Steps

### Check your run history

Open your repository on GitHub and click **Actions** in the top navigation bar.

In the left sidebar, find the name of your workflow (for example, **Daily Status Report**). Click it to see a list of all runs — green for success, red for failure.

![Workflow run history showing a mix of successful and failed runs](images/19-run-history.png)

> [!TIP]
> GitHub keeps the last 90 days of run logs by default. If you need to keep records longer, download the logs from a run's summary page before they expire.

### Read a failed run

Click any red run to open it. Then click the failed job to expand the steps.

Look for:
- **A red step** — that's where the run stopped. Click it to see the raw log.
- **"Error: ..."** lines — usually a permissions problem, a missing secret, or a compile error.
- **"Rate limit exceeded"** — the run hit a GitHub API limit. Wait a few minutes and retry.

> [!NOTE]
> Agentic workflow failures often appear in the step named **Run agent** or **Execute task brief**. The log shows the model's reasoning, tool calls, and the exact point it stopped.

### Add a failure notification

Scheduled workflows run silently — nobody watches them in real time. Add a notification step so a failed run raises a GitHub issue automatically.

Open your workflow `.md` file for editing.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to your workflow file (e.g., `.github/workflows/daily-status.md`) on GitHub.
2. Click the **pencil icon (✏️)** to edit it.
3. Make the changes below and click **Commit changes**.

</details>

At the bottom of the `steps:` block in your frontmatter, add a notification step:

```yaml
  - name: notify on failure
    if: failure()
    run: |
      gh issue create \
        --title "⚠️ Daily Status workflow failed — $(date '+%Y-%m-%d')" \
        --body "The scheduled run failed. Check the [Actions log]($GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID) for details." \
        --label "bug"
```

This step only runs when a previous step fails (`if: failure()`). It opens a new issue with a direct link to the run log.

> [!IMPORTANT]
> The `gh issue create` command needs the `issues: write` permission. Check your frontmatter `permissions:` block and add `issues: write` if it is missing.

### Test the notification

The easiest way to test: temporarily break your workflow on purpose (for example, remove a required field from the frontmatter), run it manually under **Actions → Run workflow**, then confirm a new issue appears. Restore the workflow immediately after.

### Review the run summary

Every successful run produces a **Summary** tab on the run detail page. Agentic workflows write their output there. If the summary looks shorter or different than expected, that is your signal to refine the task brief — not necessarily a failure.

> [!TIP]
> Glancing at summaries once a week takes less than two minutes and helps you catch gradual drift in output quality before it becomes a problem.

---

## ✅ Checkpoint

- [ ] You can navigate to your workflow's run history in the **Actions** tab
- [ ] You know how to open a failed run and identify the failing step
- [ ] Your workflow has a `notify on failure` step with `if: failure()`
- [ ] Your frontmatter `permissions:` block includes `issues: write`
- [ ] You triggered a manual run and the failure-notification step appears in the log

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
