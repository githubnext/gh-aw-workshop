<!-- page-journey: all -->
<!-- page-adventure: core -->
# Confirm Model Access

## :clipboard: Before You Start

This step has two entry points:

- **Error recovery (from step 07 access check):** You have completed [Install the gh-aw CLI Extension](06-install-gh-aw.md). Fix model access first, then return to [Write Your First Agentic Workflow](07-your-first-workflow.md).
- **Normal flow (after step 07):** `daily-report-status.md` and `daily-report-status.lock.yml` are committed to your practice repository.

## :dart: What You'll Do

Verify Copilot model access with a quick test, configure billing for your first workflow, then run a dry-run check before continuing to [Step 8](08-run-your-workflow.md).

## Verify model access

1. In the terminal open in your Codespace, run:

```bash
gh copilot
```

1. Send this prompt:

```prompt
/agentic-workflows what trigger does a scheduled workflow use?
```

1. Any response confirms the model and skill are accessible.

> [!IMPORTANT]
> If you see an access error, check [github.com/settings/copilot](https://github.com/settings/copilot) to confirm Copilot is enabled, then see [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md) if the problem persists. Do not continue until you receive a response.

## Choose a billing path

The Step 7 workflow uses GitHub Copilot (no `engine:` line needed). Pick exactly one billing path:

| Situation | Path | Key change |
|---|---|---|
| Organization provides centralized Copilot billing for Actions | **Org billing** | Keep `copilot-requests: write`; no secret needed |
| Personal repo, or org without centralized billing | **Personal billing** | Remove `copilot-requests: write`; add `COPILOT_GITHUB_TOKEN` secret |

### Org billing

1. Ask your org admin to confirm centralized Copilot billing is enabled for Actions.
2. Confirm `daily-report-status.md` includes `copilot-requests: write` in the `permissions:` block. It is already present — do not remove it.
3. Recompile and push:

```bash
gh aw compile && git add . && git commit -m "chore: confirm lock file is current" && git push
```

If you see `401 Unauthorized` later, see [Method 1: Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md).

### Personal billing

1. Remove `copilot-requests: write` from `daily-report-status.md`.
2. Generate a fine-grained PAT with **Copilot requests: Read-only** at [github.com/settings/tokens](https://github.com/settings/tokens).
3. Add a repository secret named `COPILOT_GITHUB_TOKEN` under **Settings → Secrets and variables → Actions**.
4. Recompile and push:

```bash
gh aw compile && git add . && git commit -m "chore: configure personal billing" && git push
```

For a guided walkthrough, see [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md).

## Verify the configuration with a dry run

Run a quick dry run to confirm your billing configuration compiles correctly before Step 8:

```bash
gh aw run --dry-run .github/workflows/daily-report-status.md
```

Confirm the command completes without errors. If it reports missing permissions or an unrecognized secret reference, recheck the billing path steps above.

## ✅ Checkpoint

- [ ] I sent a test prompt in Copilot CLI and received a response
- [ ] I chose organization or personal billing and completed its configuration steps
- [ ] `daily-report-status.md` and its lock file are committed to `main`
- [ ] `gh aw run --dry-run` completed without errors
- [ ] I am ready for [Run and Watch Your Workflow](08-run-your-workflow.md)

<!-- journey: all -->
**Next:** [Run and Watch Your Workflow](08-run-your-workflow.md)
<!-- /journey -->
