<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Pre-Flight Checklist Before Your First Run

> _A stale lock file or a billing mismatch causes most first-run failures — catch both in under two minutes._

## :dart: What You'll Do

You'll run two quick checks — lock file freshness and billing configuration — before triggering `daily-report-status` for the first time. By the end, you'll know exactly what to look for if your first run fails with a `model-access-not-configured` error.

## :clipboard: Before You Start

- You completed [Confirm Model Access](07d-confirm-model-access.md).
- `daily-report-status.md` and `daily-report-status.lock.yml` are committed to `.github/workflows/` on `main`.

## Steps

### Check 1 — Lock file is present and current

A stale or missing [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml) is the leading cause of `model-access-not-configured` failures. Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Write Your First Agentic Workflow](07-your-first-workflow.md) to complete the workflow creation steps. If the lock file is present but you are unsure it is current, recompile and push before continuing:

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

- [ ] You confirmed both `daily-report-status.md` and `daily-report-status.lock.yml` exist in `.github/workflows/` on `main`
- [ ] You recompiled and pushed if the lock file looked stale
- [ ] You confirmed `copilot-requests: write` matches your chosen billing path
- [ ] You know where to look if your first run fails with a model-access error

**Return to the main adventure:** [Run and Watch Your Workflow](08-run-your-workflow.md)
