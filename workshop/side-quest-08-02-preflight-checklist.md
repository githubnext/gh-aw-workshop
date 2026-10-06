<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Pre-Flight Checklist Before Your First Run

> _A stale lock file or a billing mismatch is the leading cause of `model-access-not-configured` failures — this two-minute checklist catches both before you click Run._

## :dart: What You'll Do

You'll run two quick checks — lock file freshness and billing configuration — so your first workflow run doesn't fail on an avoidable setup mismatch.

## :clipboard: Before You Start

- Completed [Confirm Model Access](07d-confirm-model-access.md)
- `daily-report-status.md` and `daily-report-status.lock.yml` are committed to `.github/workflows/` on `main`

## Steps

### Check the lock file is present and current

A stale or missing [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml) is the leading cause of `model-access-not-configured` failures at this step. Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Write Your First Agentic Workflow](07-your-first-workflow.md) to complete the workflow creation steps. If the lock file is present but you are unsure it is current, recompile and push before continuing:

```bash
gh aw compile
git add .
git commit -m "chore: sync lock file" && git push
```

### Check billing configuration matches the lock file

Open `daily-report-status.lock.yml` (or `daily-report-status.md`) and confirm the `permissions:` block matches the billing path you chose in [Confirm Model Access](07d-confirm-model-access.md):

| Billing path | `copilot-requests: write` present |
|---|---|
| Organization centralized billing | Yes |
| Personal billing | No — and `COPILOT_GITHUB_TOKEN` is set in **Settings → Secrets → Actions** |

Any mismatch means returning to [Confirm Model Access](07d-confirm-model-access.md) to fix the configuration and recompile.

## :white_check_mark: Checkpoint

- [ ] I confirmed both `daily-report-status.md` and `daily-report-status.lock.yml` are committed to `main`
- [ ] I recompiled and pushed if the lock file might have been stale
- [ ] I confirmed the `permissions:` block matches my chosen billing path
- [ ] I'm ready to trigger my first run with both checks passing

**Return to the main adventure:** [Run and Watch Your Workflow](08-run-your-workflow.md)
