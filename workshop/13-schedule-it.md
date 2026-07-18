# Schedule It to Run Every Day

_Automating the trigger turns a one-off workflow into a recurring service._

## 📋 Before You Start

- [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) is complete and your workflow has run successfully at least once.
- `.github/workflows/daily-status.md` is committed to your repository.
- You are familiar with the `schedule:` trigger syntax introduced in [Step 7a: Your First Workflow (Terminal)](07a-your-first-workflow-terminal.md).
- A fuzzy expression like `daily on weekdays` is plain English that `gh aw compile` converts to a valid [cron](https://github.github.com/gh-aw/reference/schedule-syntax/) string at compile time — you never need to write cron syntax by hand.

For example, the fuzzy expression `schedule: daily` compiles to a cron value such as `"49 23 * * *"` in the generated lock file:

```yaml
# Before (in daily-status.md)
on:
  schedule: daily

# After gh aw compile (in daily-status.lock.yml)
on:
  schedule:
    - cron: "49 23 * * *"
```

> [!NOTE]
> The exact cron value is determined at compile time by `gh aw compile` using your repository as a seed, scattering execution to avoid load spikes. Your compiled output may differ from the example above, but it stays the same on subsequent compiles of the same repository.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Edit, compile, commit, and push the schedule change | [Schedule with the Terminal path](13a-schedule-it-terminal.md) |
| **GitHub UI path** | Edit and commit the schedule in the web editor | [Schedule with the GitHub UI path](13b-schedule-it-ui.md) |

Both paths update the same fuzzy schedule expression and finish by confirming it in GitHub Actions.

## ✅ Checkpoint

After completing your chosen path, verify:

- [ ] I ran `gh aw compile` after editing the schedule expression and confirmed the lock file updated.
- [ ] I can explain what a `schedule:` trigger does in GitHub Actions — it runs the workflow automatically at the defined cadence without manual intervention.
- [ ] I understand that `gh aw compile` converts a fuzzy expression like `daily on weekdays` into a valid cron string in the lock file.
- [ ] The `schedule:` field in `.github/workflows/daily-status.md` contains a valid schedule expression (for example, `daily on weekdays`).
- [ ] The compiled `.lock.yml` shows a valid cron string under `on.schedule` (for example, `"50 11 * * 1-5"`).
- [ ] A commit containing the updated `.github/workflows/daily-status.md` appears in your repository's commit history.
- [ ] The **Actions** tab shows the schedule badge for your **daily-status** workflow.
- [ ] At least one run has completed successfully after the schedule change.

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also
- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Schedule Syntax reference](https://github.github.com/gh-aw/reference/schedule-syntax/)
