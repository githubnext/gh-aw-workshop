<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Pre-Flight Check Before Your First Run

> _Optional: catch the two most common causes of a failed first run before you ever click "Run workflow."_

## :dart: What You'll Do

You'll walk through two quick checks — lock file freshness and billing configuration match — that catch the leading causes of `model-access-not-configured` failures before you trigger your first workflow run.

## :clipboard: Before You Start

- You completed [Write Your First Agentic Workflow](07-your-first-workflow.md) and [Confirm Model Access](07d-confirm-model-access.md).
- `daily-report-status.md` and `daily-report-status.lock.yml` should already be committed to `.github/workflows/` on `main`.

## Steps

### Check that the lock file is present and current

A stale or missing [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml) is the leading cause of `model-access-not-configured` failures at this step. This check takes less than a minute.

Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Write Your First Agentic Workflow](07-your-first-workflow.md) to complete the workflow creation steps. If the lock file is present but you are unsure it is current, recompile and push before continuing:

```bash
gh aw compile
git add .
git commit -m "chore: sync lock file" && git push
```

### Check that billing configuration matches the lock file

Open `daily-report-status.lock.yml` (or `daily-report-status.md`) and confirm the `permissions:` block matches the billing path you chose in [Confirm Model Access](07d-confirm-model-access.md):

| Billing path | `copilot-requests: write` present |
|---|---|
| Organization centralized billing | Yes |
| Personal billing | No — and `COPILOT_GITHUB_TOKEN` is set in **Settings → Secrets → Actions** |

Any mismatch means returning to [Confirm Model Access](07d-confirm-model-access.md) to fix the configuration and recompile.

## :white_check_mark: Checkpoint

- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` exist in `.github/workflows/` on `main`
- [ ] You recompiled and pushed if the lock file was stale or missing
- [ ] The `permissions:` block in your lock file matches your chosen billing path
- [ ] You're ready to trigger your first run with confidence

<!-- journey: all -->
**Return to the main adventure:** [Run and Watch Your Workflow](08-run-your-workflow.md)
<!-- /journey -->
