<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Pre-Flight Checks Before Your First Run

> _Two minutes of checking now saves you a confusing `model-access-not-configured` failure later._

## :dart: What You'll Do

You'll walk through the two checks worth running before you click **Run workflow** for the first time: confirming your lock file is present and current, and confirming your billing configuration matches what's in the file. By the end, you'll know exactly what "stale" and "mismatched" look like so you can spot them on your own workflows later.

## :clipboard: Before You Start

- You completed [Confirm Model Access](07d-confirm-model-access.md).
- `daily-report-status.md` and `daily-report-status.lock.yml` are committed to `.github/workflows/` on `main`.

## Steps

### Why this matters

A stale or missing [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml) is the leading cause of `model-access-not-configured` failures on a first run. The two checks below take less than a minute each and catch almost every case before you waste a run watching it fail.

### Check 1 — Lock file is present and current

Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Write Your First Agentic Workflow](07-your-first-workflow.md) to complete the workflow creation steps.

If the lock file is present but you are unsure it is current, recompile and push before continuing:

```bash
gh aw compile
git add .
git commit -m "chore: sync lock file" && git push
```

### Check 2 — Billing configuration matches the lock file

Open `daily-report-status.lock.yml` (or `daily-report-status.md`) and confirm the `permissions:` block matches the billing path you chose in [Confirm Model Access](07d-confirm-model-access.md):

| Billing path | `copilot-requests: write` present |
|---|---|
| Organization centralized billing | Yes |
| Personal billing | No — and `COPILOT_GITHUB_TOKEN` is set in **Settings → Secrets → Actions** |

Any mismatch means returning to [Confirm Model Access](07d-confirm-model-access.md) to fix the configuration and recompile.

## :white_check_mark: Checkpoint

- [ ] I confirmed both `daily-report-status.md` and `daily-report-status.lock.yml` exist on `main`
- [ ] I recompiled and pushed if the lock file might have been stale
- [ ] I confirmed the `permissions:` block matches my chosen billing path
- [ ] I know which two checks to redo first if a run ever fails with a model-access error

**Return to the main adventure:** [Run and Watch Your Workflow](08-run-your-workflow.md)
