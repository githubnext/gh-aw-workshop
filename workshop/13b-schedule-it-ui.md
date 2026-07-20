<!-- page-journey: ui -->
<!-- page-adventure: core -->
# Schedule It to Run Every Day — GitHub UI Path

> [!NOTE]
> Want to compile before committing? Switch to the [Terminal path](13a-schedule-it-terminal.md).

## 🎯 What You'll Do

You'll update the fuzzy schedule expression in the GitHub web editor, commit it, and confirm that GitHub Actions registered the schedule.

## 📋 Before You Start

- You have a working workflow from [Step 12](12-test-and-iterate.md)
- `.github/workflows/daily-status.md` is committed to your repository

## Update the schedule

1. Open `.github/workflows/daily-status.md` on GitHub.
2. Click the **pencil icon (✏️)**.
3. Find:

   ```yaml
   on:
     schedule: daily
     workflow_dispatch: {}
   ```

4. Replace `daily` with the cadence you want. For example:

   ```yaml
   on:
     schedule: daily on weekdays
     workflow_dispatch: {}
   ```

5. Click **Commit changes**.

Keep `workflow_dispatch` so you can still run the workflow on demand.

> [!IMPORTANT]
> Committing the `.md` file via the web editor does **not** automatically recompile the lock file. After committing, open your Codespace or local terminal and run `gh aw compile`, then push the updated `.lock.yml`.

<!-- Separate adjacent callouts -->

> [!TIP]
> See [Fuzzy Schedule Expressions](side-quest-13-01-schedule-expressions.md) for more cadence options.

## Confirm the schedule

Open **Actions**, select **daily-status**, and confirm the sidebar shows **This workflow has a schedule trigger**.

![Scheduled workflow badge visible in the Actions sidebar](images/13-schedule-badge.svg)

GitHub may delay the first scheduled run. Use **Run workflow** to confirm the edited workflow still runs without waiting.

## ✅ Checkpoint

- [ ] The workflow contains `workflow_dispatch` and a fuzzy `schedule` expression
- [ ] The schedule matches the cadence you want
- [ ] The change is committed
- [ ] The schedule badge appears in GitHub Actions
- [ ] A manual or scheduled run completes successfully

<!-- journey: ui -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/), [Triggers reference](https://github.github.com/gh-aw/reference/triggers/), and [Schedule Syntax reference](https://github.github.com/gh-aw/reference/schedule-syntax/).

