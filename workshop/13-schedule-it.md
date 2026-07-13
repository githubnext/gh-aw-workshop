# Schedule It to Run Every Day

_Automating the trigger turns a one-off workflow into a recurring service._

## 📋 Before You Start

- [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) is complete and your workflow has run successfully at least once.
- `.github/workflows/daily-status.md` is committed to your repository.
- You know which path you will use to make the schedule change (terminal or GitHub UI).

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Edit, compile, commit, and push the schedule change | [Schedule with the Terminal path](13a-schedule-it-terminal.md) |
| **GitHub UI path** | Edit and commit the schedule in the web editor | [Schedule with the GitHub UI path](13b-schedule-it-ui.md) |

Both paths update the same fuzzy schedule expression and finish by confirming it in GitHub Actions.

## ✅ Checkpoint

After completing your chosen path, verify:

- [ ] The `schedule:` field in `.github/workflows/daily-status.md` contains a valid schedule expression (for example, `daily on weekdays`).
- [ ] The schedule expression reflects the cadence you chose, not just the default `daily`.
- [ ] A commit containing the updated `.github/workflows/daily-status.md` appears in your repository's commit history.
- [ ] The **Actions** tab shows the schedule badge for your **daily-status** workflow.
- [ ] At least one run has completed successfully after the schedule change.

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
