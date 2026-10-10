<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Pre-Flight Check Before Your First Run

> _Optional: run these two quick checks before triggering your workflow in [Run and Watch Your Workflow](08-run-your-workflow.md) to avoid the most common first-run failure._

## :dart: What You'll Do

You'll verify that your compiled [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml) is present and current, and that your billing configuration matches it — the two checks that catch most `model-access-not-configured` failures before they happen.

## :clipboard: Before You Start

- You completed [Write Your First Agentic Workflow](07-your-first-workflow.md) and [Confirm Model Access](07d-confirm-model-access.md).
- `daily-report-status.md` exists in your practice repository.

## Steps

### Confirm the lock file is present and current

A stale or missing lock file is the leading cause of `model-access-not-configured` failures. Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Step 7](07-your-first-workflow.md) to complete the workflow creation steps.

If the lock file is present but you are unsure it is current, recompile and push before continuing:

```bash
gh aw compile
git add .
git commit -m "chore: sync lock file" && git push
```

### Confirm billing configuration matches the lock file

Open `daily-report-status.lock.yml` (or `daily-report-status.md`) and confirm the `permissions:` block matches the billing path you chose in Step 7d:

| Billing path | `copilot-requests: write` present |
|---|---|
| Organization centralized billing | Yes |
| Personal billing | No — and `COPILOT_GITHUB_TOKEN` is set in **Settings → Secrets → Actions** |

Any mismatch means returning to [Confirm Model Access](07d-confirm-model-access.md) to fix the configuration and recompile.

## :white_check_mark: Checkpoint

- [ ] `daily-report-status.md` and `daily-report-status.lock.yml` are both present on `main`
- [ ] You recompiled and pushed if the lock file looked stale
- [ ] Your `permissions:` block matches your chosen billing path

---

Return to the main adventure: [Run and Watch Your Workflow](08-run-your-workflow.md).
