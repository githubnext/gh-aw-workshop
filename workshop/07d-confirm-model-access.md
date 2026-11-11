<!-- page-journey: all -->
<!-- page-adventure: core -->
# Confirm Model Access

## :clipboard: Before You Start

This step has two entry points:

- **Arriving from step 07 (error recovery):** Workflow files do not need to exist yet — fix model access first, then return to [Write Your First Agentic Workflow](07-your-first-workflow.md).
- **Arriving as the next step after step 07 (normal flow):** `daily-report-status.md` and `daily-report-status.lock.yml` are committed to your practice repository.

## :dart: What You'll Do

You'll run a one-sentence test prompt, confirm Copilot is reachable, choose your [billing](https://github.github.com/gh-aw/reference/billing/) path, and configure the workflow before continuing to [Step 8](08-run-your-workflow.md).

## Verify model access

1. In the terminal already open in your Codespace, run:

```bash
gh copilot
```

1. Send this prompt:

```prompt
/agentic-workflows what trigger does a scheduled workflow use?
```

1. Any reply confirms the model and skill are accessible. Continue to **Choose a billing path**.

> [!IMPORTANT]
> <details>
> <summary><b>Troubleshoot access errors before continuing</b></summary>
>
> If you see an error instead of a reply, check these items before continuing:
>
> - **Copilot seat:** Confirm an active Copilot seat is assigned to your account at [github.com/settings/copilot](https://github.com/settings/copilot).
> - **Org policy:** If your repository is in an organization, confirm organization policies permit Copilot usage.
> - **`gh copilot` login:** Run `gh auth status` or start `gh copilot` to verify your CLI session is authenticated.
>
> If the problem persists after these checks, see [Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md), then return here.
>
> </details>

If you arrived from the step 07 access check and the test prompt succeeded, return to [Write Your First Agentic Workflow](07-your-first-workflow.md) now.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/07d-preflight-troubleshoot-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/07d-preflight-troubleshoot-light.svg">
  <img alt="Pre-flight troubleshooting decision tree: send a test prompt, then follow YES or NO branches to either continue the workshop or fix model access" src="images/07d-preflight-troubleshoot-light.svg">
</picture>

## Choose a billing path

> [!NOTE]
> For golden-ticket workshops, billing is pre-provisioned by your org. Use the **Organization centralized billing** path unless your instructor says otherwise.

Choose the path that matches your repository setup:

| Situation | Path | Key setting |
|---|---|---|
| Organization provides centralized Copilot billing for Actions | **Organization centralized billing** | Keep `copilot-requests: write`; no secret needed |
| Personal repo, or org does not provide centralized billing | **Personal billing** | Remove `copilot-requests: write`; add `COPILOT_GITHUB_TOKEN` secret |

### Configure centralized billing

Confirm `permissions:` includes `copilot-requests: write` in `.github/workflows/daily-report-status.md`, then recompile and commit:

```bash
gh aw compile
git add .
git commit -m "chore: confirm centralized billing lock file"
git push
```

### Configure personal billing

Remove `copilot-requests: write` from `.github/workflows/daily-report-status.md`, add your PAT as secret `COPILOT_GITHUB_TOKEN` in repository settings, then recompile and commit:

```bash
gh aw compile
git add .
git commit -m "chore: configure personal billing path"
git push
```

For step-by-step guidance on PAT configuration and secret setup, see [Side Quest: Copilot Billing Paths](side-quest-07d-billing-paths.md).

## :white_check_mark: Checkpoint

- [ ] I sent the test prompt in Copilot CLI and received a reply
- [ ] I confirmed no access errors appeared
- [ ] I chose a billing path and completed all configuration steps
- [ ] I can name which billing path I chose and verified `copilot-requests: write` presence or `COPILOT_GITHUB_TOKEN`
- [ ] My source file and compiled lock file reflect the chosen method
- [ ] Both files are committed to `main`
- [ ] I am ready for [Run and Watch Your Workflow](08-run-your-workflow.md)

<!-- journey: all -->
**Next:** [Run and Watch Your Workflow](08-run-your-workflow.md)
<!-- /journey -->
