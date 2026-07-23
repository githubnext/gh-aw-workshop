<!-- page-journey: all -->
<!-- page-adventure: core -->
# Schedule It to Run Every Day

_An automated workflow that runs without you lifting a finger is where agentic workflows go from impressive to genuinely useful._

## 🎯 What You'll Do

You'll update your `daily-report-status` workflow so it fires on a recurring schedule — every weekday morning by default. By the end of this step, your workflow will run automatically without any manual trigger.

## 📋 Before You Start

- Completed [Test and Improve Your Workflow](12-test-and-iterate.md)
- Your `daily-report-status` workflow produces output you are happy with
- Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed to `.github/workflows/` on `main`

## Understand Scheduled Triggers

Your workflow currently has a `workflow_dispatch` trigger, which means you start it manually from the **Actions** tab. That is useful for testing, but for a daily report you want it to run on its own.

GitHub Actions supports scheduled triggers using **cron expressions** — a compact five-field notation that specifies when a job should run (minute, hour, day-of-month, month, day-of-week).

Agentic workflows let you write plain-English schedule values such as `daily on weekdays` instead of raw cron syntax. The `gh aw compile` command converts those into the correct cron string in the `.lock.yml` file.

> [!TIP]
> Not sure which schedule value to use? See [Side Quest: Fuzzy Schedule Expressions](side-quest-13-01-schedule-expressions.md) for the full list of plain-English options and their compiled cron equivalents.

## Add a Schedule to Your Workflow

Open `.github/workflows/daily-report-status.md` in your editor or in the GitHub UI.

Locate the `on:` block near the top of the YAML frontmatter. It should look similar to this:

```yaml
---
name: Daily Report Status
on:
  workflow_dispatch: {}
```

Add a `schedule` key alongside `workflow_dispatch`:

```yaml
---
name: Daily Report Status
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
```

This tells `gh-aw` to compile a cron expression that fires once per day on Monday through Friday. You keep `workflow_dispatch` so you can still trigger the workflow manually while you are testing.

<details>
<summary>🖥️ Editing in the GitHub UI</summary>

1. Navigate to `.github/workflows/daily-report-status.md` in your repository on GitHub.
2. Click the **pencil icon (✏️)** to open the file editor.
3. Add `schedule: daily on weekdays` inside the `on:` block as shown above.
4. Click **Commit changes** and commit directly to `main`.

After committing via the UI, you still need to recompile (see the next section). If you do not have a terminal available, skip ahead to the "UI-first continuation" note below.

</details>

## Compile to Update the Lock File

After editing the source file, regenerate the lock file:

```bash
gh aw compile
```

Open `daily-report-status.lock.yml` and look for the `schedule:` block. You should see a compiled cron expression — something like `cron: '0 9 * * 1-5'` — which means 09:00 UTC on weekdays.

> [!NOTE]
> GitHub Actions runs `.lock.yml`, not `.md`. Until you compile and commit the updated lock file, the schedule change has no effect.

If you are working entirely in the GitHub UI without a terminal, the lock file will be regenerated automatically the next time a `gh aw compile` step runs in a GitHub Actions workflow or Codespace. You can continue to the next section and GitHub Actions will use the last compiled schedule; add the compile step at your earliest convenience.

## Commit and Push Both Files

Stage and commit both the source file and the lock file together:

```bash
git add .github/workflows/daily-report-status.md \
        .github/workflows/daily-report-status.lock.yml
git commit -m "feat: add weekday schedule to daily-report-status workflow"
git push
```

<details>
<summary>🖥️ GitHub UI alternative — commit the lock file</summary>

If you compiled locally and want to commit via the UI:

1. Navigate to `daily-report-status.lock.yml` in your repository.
2. Click the **pencil icon (✏️)**.
3. Paste the updated lock file content.
4. Click **Commit changes** with a brief message.

</details>

## Verify the Schedule Is Registered

Once the updated lock file is on `main`:

1. Go to the **Actions** tab in your repository.
2. Select the **Daily Report Status** workflow from the left sidebar.
3. Look at the workflow summary page — GitHub now shows the next scheduled run time under **This workflow runs every…** (it may take a few minutes to appear).

The schedule will not fire immediately. It runs at the next time matching the cron expression. You can still trigger a manual run at any time using **Run workflow**.

## ✅ Checkpoint

- [ ] `daily-report-status.md` has a `schedule: daily on weekdays` entry in the `on:` block
- [ ] `gh aw compile` completed without errors after the edit
- [ ] `daily-report-status.lock.yml` contains a compiled `cron:` expression
- [ ] Both files are committed and pushed to `main`
- [ ] The **Actions** tab shows the next scheduled run time for the workflow

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
