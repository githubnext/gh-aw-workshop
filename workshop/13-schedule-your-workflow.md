<!-- page-journey: all -->
<!-- page-adventure: core -->
# Schedule It to Run Every Day

> _A workflow that runs itself is more useful than one you have to remember to trigger._

## 🎯 What You'll Do

Right now your workflow runs when you click **Run workflow** in the Actions tab. You'll change that so it fires automatically on a schedule — and add a manual trigger so you can still run it on demand. By the end, your workflow will wake up and report every weekday without any action from you.

## 📋 Before You Start

- You have iterated on your workflow in [Test and Improve Your Workflow](12-test-and-iterate.md).
- You can edit `.github/workflows/daily-report-status.md` in a Codespace, terminal, or the GitHub web editor.

## Steps

### Understand how gh-aw scheduling works

At the top of your workflow file you have YAML frontmatter between `---` fences. The `on:` block controls when GitHub Actions runs the workflow.

`gh-aw` lets you write a human-readable schedule instead of a raw cron expression:

```yaml
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
```

When you run `gh aw compile`, the compiler translates `daily on weekdays` into a `cron:` value and writes it into your `.lock.yml` file. You never have to write cron by hand.

> [!TIP]
> Always keep `workflow_dispatch: {}` alongside `schedule:`. It lets you trigger the workflow manually from the **Actions** tab for quick tests even when no scheduled run is due.

Common schedule expressions:

| Expression | Runs… |
|------------|-------|
| `daily` | Once per day |
| `daily on weekdays` | Monday–Friday, once per day |
| `weekly` | Once per week |
| `every 6 hours` | Four times per day |

Need help picking one? See the [Schedule Expressions reference](side-quest-13-01-schedule-expressions.md).

### Update your workflow frontmatter

Open `.github/workflows/daily-report-status.md`. Find the `on:` block near the top and update it:

```yaml
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
```

If your frontmatter already has `schedule: daily`, change it to `daily on weekdays` to keep the workflow quiet on weekends.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. In your repository on GitHub, navigate to `.github/workflows/daily-report-status.md`.
2. Click the **pencil icon (✏️)** to open the web editor.
3. Update the `on:` block as shown above.
4. Click **Commit changes** and commit directly to your default branch.

After committing via the UI, the `.lock.yml` file needs to be regenerated. Either run `gh aw compile` locally and push the updated lock file, or trigger a manual run — the Actions log will show a compilation step that regenerates it automatically if your repository has a compile step configured.

</details>

### Compile and push the updated workflow

After saving the file, regenerate the lock file:

```bash
gh aw compile
git add .github/workflows/daily-report-status.md .github/workflows/daily-report-status.lock.yml
git commit -m "schedule workflow to run daily on weekdays"
git push
```

### Verify the schedule was registered

1. Go to the **Actions** tab in your repository.
2. Select the **daily-report-status** workflow in the left sidebar.
3. Click **Run workflow** → **Run workflow** to trigger a manual run and confirm everything still works.
4. Return the next weekday morning — the workflow will have run overnight automatically.

> [!NOTE]
> GitHub Actions schedules use **UTC**. A `daily on weekdays` schedule typically fires between 9 AM and midnight UTC, at a scattered minute chosen by the compiler to avoid load spikes. Check your compiled `.lock.yml` for the exact `cron:` value.

## ✅ Checkpoint

- [ ] Your workflow frontmatter has `schedule: daily on weekdays` and `workflow_dispatch: {}`
- [ ] You ran `gh aw compile` and the `.lock.yml` was regenerated without errors
- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed and pushed
- [ ] A manual run from the **Actions** tab completed successfully
- [ ] You can find the compiled `cron:` value in the `.lock.yml` file
- [ ] You know that the schedule runs in UTC and can translate it to your local time zone

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
