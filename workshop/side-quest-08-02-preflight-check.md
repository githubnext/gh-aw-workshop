<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Side Quest: Pre-Flight Check Before Your First Run

> _A stale lock file or a billing mismatch is the leading cause of failed first runs — catch both in under two minutes._

## :dart: What You'll Do

You'll verify that your `daily-report-status` workflow's compiled lock file is present and current, and that its `permissions:` block matches the billing path you configured in [Confirm Model Access](07d-confirm-model-access.md). By the end, you'll know exactly what to check whenever a run fails with a `model-access-not-configured` error.

## :clipboard: Before You Start

- Completed [Confirm Model Access](07d-confirm-model-access.md)
- `daily-report-status.md` exists in `.github/workflows/` on `main`

## Steps

### Confirm the lock file is present and current

Open `.github/workflows/` in your repository on GitHub and confirm both files are there:

- `daily-report-status.md` (source)
- `daily-report-status.lock.yml` (compiled lock file)

If either file is missing, return to [Step 7](07-your-first-workflow.md) to complete the workflow creation steps. If the lock file is present but you are unsure it is current, recompile and push before continuing:

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

- [ ] I confirmed `daily-report-status.md` and `daily-report-status.lock.yml` are both present in `.github/workflows/` on `main`
- [ ] I recompiled and pushed if the lock file was stale
- [ ] I confirmed the `permissions:` block matches my chosen billing path
- [ ] I know where to return if the lock file or billing configuration needs fixing

**Return to the main adventure:** [Run and Watch Your Workflow](08-run-your-workflow.md)
