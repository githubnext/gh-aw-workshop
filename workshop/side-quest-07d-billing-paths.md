# Side Quest: Copilot Billing Paths

Choose exactly one [billing](https://github.github.com/gh-aw/reference/billing/) path for your first workflow, configure it, and commit the updated [lock file](https://github.github.com/gh-aw/reference/glossary/#workflow-lock-file-lockyml).

## Quick reference

| Situation | Path | Key setting |
|---|---|---|
| Organization provides centralized Copilot billing for Actions | **Organization centralized billing** | Keep `copilot-requests: write`; no secret needed |
| Personal repo, or org does not provide centralized billing | **Personal billing** | Remove `copilot-requests: write`; add `COPILOT_GITHUB_TOKEN` secret |

If you are not sure which applies, ask: "Is centralized Copilot billing for GitHub Actions enabled for this repository?" If the answer is "no" or "I don't know," follow **Personal billing**.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/07d-billing-path-decision-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/07d-billing-path-decision-light.svg">
  <img alt="Decision flow for choosing Copilot billing path: organization centralized billing or personal billing" src="images/07d-billing-path-decision-light.svg">
</picture>

## Path A: Organization centralized billing

Use this path when the organization that owns the repository has centralized Copilot billing enabled for GitHub Actions.

1. Ask your org admin to confirm centralized billing is enabled.
2. Open `daily-report-status.md` and confirm the `permissions:` block includes `copilot-requests: write`:

```markdown
---
permissions:
  contents: read
  copilot-requests: write
---
```

   This line is already present in the Step 7 template. Do not remove it.

1. No repository secret is needed.
1. Recompile and commit:

```bash
gh aw compile
git add .
git commit -m "chore: confirm lock file is current" && git push
```

If you see `401 Unauthorized` in the run log, see [Method 1: Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md).

## Path B: Personal billing

Use this path for a personal repository, or when the owning organization does not provide centralized Copilot billing.

> [!IMPORTANT]
> When `copilot-requests: write` is present, the workflow ignores `COPILOT_GITHUB_TOKEN`. Remove that permission line before adding the secret.

1. Open `daily-report-status.md` and remove `copilot-requests: write`.
2. Generate a fine-grained PAT with **Copilot requests: Read-only** at [github.com/settings/tokens](https://github.com/settings/tokens).
3. In your repository go to **Settings** → **Secrets and variables** → **Actions**.
4. Add a repository secret named `COPILOT_GITHUB_TOKEN` and paste the PAT.
5. Recompile and commit:

```bash
gh aw compile
git add .
git commit -m "chore: configure personal billing path" && git push
```

For a browser-only walkthrough, see [Method 2 (UI-only): COPILOT_GITHUB_TOKEN](side-quest-06-03c-copilot-github-token-ui-only.md). For terminal setup, see [Method 2: COPILOT_GITHUB_TOKEN secret](side-quest-06-03b-copilot-github-token.md).

## Confirm [engine](https://github.github.com/gh-aw/reference/engines/)

Open `daily-report-status.md` and verify there is no `engine:` line. The workflow defaults to GitHub Copilot — no Anthropic or OpenAI key is needed for this first run.

To switch engines later, see:
- [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md)
- [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md)

## :white_check_mark: Checkpoint

- [ ] I chose a billing path and completed all configuration steps
- [ ] `daily-report-status.md` reflects the chosen method
- [ ] `daily-report-status.lock.yml` is recompiled and committed to `main`
- [ ] I am ready to return to [Confirm Model Access](07d-confirm-model-access.md)

**Return to:** [Confirm Model Access](07d-confirm-model-access.md)
