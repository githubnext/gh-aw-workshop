# Schedule It to Run Every Day

> _Automating the trigger is what turns a one-off script into a true workflow — after this step your report will arrive without you lifting a finger._

## 🎯 What You'll Do

You'll add a `schedule` trigger to your workflow so GitHub Actions runs it automatically every morning. By the end, you'll understand cron syntax well enough to choose any cadence you like.

## 📋 Before You Start

- You have a working, manually tested workflow from [Test and Improve Your Workflow](12-test-and-iterate.md).
- Your workflow file lives at `.github/workflows/daily-status.md` (or `.yml` if you compiled it already).

## Steps

### 1. Open your workflow file

In your editor (or Codespace), open `.github/workflows/daily-status.yml`.

### 2. Locate the `on:` block

You should already have a `workflow_dispatch` trigger that lets you run the workflow by hand. It looks like this:

```yaml
on:
  workflow_dispatch:
```

### 3. Add a `schedule` trigger

Append a `schedule` entry directly below `workflow_dispatch`. The value is a list of cron expressions.

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "0 8 * * *"   # 08:00 UTC every day
```

> [!NOTE]
> Cron syntax has five fields: **minute hour day-of-month month day-of-week**. The expression `0 8 * * *` means "at minute 0 of hour 8, every day". [crontab.guru](https://crontab.guru) is a handy visual editor if you want a different time.

> [!TIP]
> GitHub Actions schedules run in UTC. If your team is in UTC-5, `0 13 * * *` fires at 08:00 local time.

### 4. Choose your schedule

Pick a time that makes sense for you:

| Cadence | Cron expression |
|---------|-----------------|
| Daily at 08:00 UTC | `0 8 * * *` |
| Weekdays at 09:00 UTC | `0 9 * * 1-5` |
| Every Monday at 07:00 UTC | `0 7 * * 1` |

Edit the `cron:` line to match your preference.

### 5. Commit and push

```bash
git add .github/workflows/daily-status.yml
git commit -m "chore: schedule daily status workflow"
git push
```

### 6. Confirm the schedule is registered

Navigate to your repository on GitHub, then **Actions → daily-status**. On the right-hand sidebar you'll see a **This workflow has a schedule trigger** badge.

![Scheduled workflow badge visible in the Actions sidebar](images/13-schedule-badge.png)

> [!WARNING]
> GitHub may delay the very first scheduled run by up to 15 minutes after you push. If the workflow doesn't fire at the expected time, check **Actions** for queued runs before assuming something is broken.

### 7. Wait for or trigger a run

You can wait for the next scheduled time, or click **Run workflow** → **Run workflow** to trigger it immediately and confirm everything still works.

## ✅ Checkpoint

- [ ] Your `on:` block now contains both `workflow_dispatch` and `schedule`
- [ ] The cron expression reflects the cadence you actually want
- [ ] You have pushed the change and can see the schedule badge in the Actions UI
- [ ] At least one scheduled (or manual) run has completed successfully after the change

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
