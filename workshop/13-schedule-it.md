<!-- page-journey: all -->
<!-- page-adventure: core -->
# Schedule It to Run Every Day

> _Your workflow runs great manually — now let it run itself, every day, without you._

## 🎯 What You'll Do

You'll add a `schedule:` trigger to your daily status workflow so GitHub Actions launches it automatically on a recurring basis. By the end of this step, your workflow will run on its own, post a report, and keep doing so without any intervention from you.

## 📋 Before You Start

- You have a working `daily-status.md` agentic workflow from [Test and Improve Your Workflow](12-test-and-iterate.md).
- The workflow can run manually via **Actions** → **Run workflow** and produces useful output.
- You have write access to your practice repository.

## Steps

### Open your workflow file for editing

Navigate to your practice repository on GitHub. Open `.github/workflows/daily-status.md` using the pencil icon (✏️) to edit it in the browser.

You should see frontmatter at the top of the file between the `---` fences — something like:

```yaml
---
name: Daily Status
on:
  workflow_dispatch:
permissions:
  issues: write
---
```

### Add the schedule trigger

Add a `schedule:` entry alongside the existing `workflow_dispatch:` trigger. Use a plain-English fuzzy expression — `gh-aw` converts it to a cron expression when it compiles the workflow:

```yaml
---
name: Daily Status
on:
  workflow_dispatch:
  schedule: daily on weekdays
permissions:
  issues: write
---
```

The `daily on weekdays` expression schedules the workflow to run once per weekday. You can change it to `daily`, `weekly`, or `every 6 hours` depending on how often you want the report.

> [!TIP]
> Not sure which expression to pick? See [Side Quest: Fuzzy Schedule Expressions](side-quest-13-01-schedule-expressions.md) for a full reference table and tips on choosing the right cadence.

### Commit the change

Click **Commit changes**, write a short message such as `Add daily schedule trigger`, and commit directly to your default branch.

<details>
<summary>🖥️ Terminal alternative</summary>

1. Open `daily-status.md` in your editor and add the `schedule:` line as shown above.
2. Compile the updated workflow to regenerate the lock file:

   ```bash
   gh aw compile
   ```

3. Commit both the `.md` file and the updated `.lock.yml`:

   ```bash
   git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
   git commit -m "Add daily schedule trigger"
   git push
   ```

</details>

> [!NOTE]
> When you push `.github/workflows/daily-status.md`, GitHub Actions automatically compiles the workflow and registers the schedule. You do not need to run `gh aw compile` locally if you prefer the UI-only path — the Actions runner handles compilation at runtime.

### Verify the schedule was registered

After committing, go to **Actions** in your repository. Find your **Daily Status** workflow in the left sidebar and click it. You should see a message like _"This workflow will run on its next scheduled event"_ or the last run listed with a `schedule` trigger badge.

![Schedule trigger confirmed in the Actions workflow view](images/13-schedule-registered.png)

If you don't see the schedule listed, check that:
- The `schedule:` line is inside the `on:` block in your frontmatter.
- You committed to the default branch (GitHub only runs scheduled workflows from the default branch).

### Trigger a manual run to confirm everything still works

Before waiting for the automatic schedule, trigger the workflow manually one more time:

1. Click **Run workflow** → **Run workflow**.
2. Wait for the run to complete.
3. Confirm the output looks correct.

This ensures your recent edits didn't introduce any issues before the scheduled run takes over.

## ✅ Checkpoint

- [ ] Your `daily-status.md` frontmatter includes a `schedule:` trigger alongside `workflow_dispatch:`
- [ ] You committed the change to your default branch
- [ ] The **Actions** tab shows the Daily Status workflow is registered for scheduled runs
- [ ] A manual run after the commit completes successfully
- [ ] You can explain what "fuzzy schedule expression" means and where the cron value comes from

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
