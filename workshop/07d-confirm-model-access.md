# Step 7d: Confirm Model Access

## 📋 Before You Start

- You completed one Step 7 authoring path.
- `daily-report-status.md` and `daily-report-status.lock.yml` are committed to your practice repository.

## 🎯 What You'll Do

You'll choose the billing and authentication method for the first workflow, configure it, and confirm the source and lock files agree before you continue to [Step 8](08-run-your-workflow.md).

## Confirm the workflow engine

Open `.github/workflows/daily-report-status.md`. The Step 7 workflow has no `engine:` line, so it uses GitHub Copilot.

Claude and Codex are optional engines introduced in later side quests. You do not need an Anthropic or OpenAI API key for this first run.

## Choose one Copilot billing path

Choose exactly one method. The methods are alternatives, not fallbacks used together.

### Organization with centralized Copilot billing

Use this path only when the organization that owns the repository has centralized Copilot billing enabled for Actions.

1. Ask your organization administrator to confirm centralized billing is enabled.
2. Keep `copilot-requests: write` in the workflow's `permissions:` block.
3. Complete [Method 1: Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md).

The workflow uses the organization subscription. You do not need a personal Copilot token for this path.

### Personal billing

Use this path for a personal repository, or when the owning organization does not provide centralized Copilot billing.

1. Complete [Method 2: `COPILOT_GITHUB_TOKEN`](side-quest-06-03b-copilot-github-token.md), or use its [GitHub UI-only path](side-quest-06-03c-copilot-github-token-ui-only.md).
2. Remove `copilot-requests: write` from `daily-report-status.md`.
3. Recompile and commit `daily-report-status.lock.yml` as described in the method guide.

> [!IMPORTANT]
> When `copilot-requests: write` is present, the workflow ignores `COPILOT_GITHUB_TOKEN` for inference. Remove the permission and recompile when you choose personal billing.

## Check the final configuration

Open `daily-report-status.md` and confirm it matches the method you selected:

| Billing path | `copilot-requests: write` | Required secret |
|---|---|---|
| Organization centralized billing | Present | None |
| Personal billing | Removed | `COPILOT_GITHUB_TOKEN` |

## ✅ Checkpoint

- [ ] I confirmed the first workflow uses GitHub Copilot
- [ ] I chose organization centralized billing or personal billing
- [ ] I completed the matching authentication guide
- [ ] My source and compiled lock file use the selected method
- [ ] Both workflow files are committed to `main`
- [ ] I am ready for [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)

**Next:** [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
