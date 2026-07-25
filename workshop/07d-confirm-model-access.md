<!-- page-journey: all -->
<!-- page-adventure: core -->
# Confirm Model Access

## 📋 Before You Start

- `daily-report-status.md` and `daily-report-status.lock.yml` are committed to your practice repository.

## 🎯 What You'll Do

You'll verify Copilot model access with a quick test that uses the `agentic-workflows` skill, then choose the [billing](https://github.github.com/gh-aw/reference/billing/) and authentication method for the first workflow, configure it, and confirm the source and lock files agree before you continue to [Step 8](08-run-your-workflow.md).

## Verify model access with a test prompt

Before configuring billing, confirm Copilot is reachable from this repository.
Catching an access problem here saves debugging time in the billing steps and in Step 8.

1. In the terminal that is already open in your Codespace, run:

   ```bash
   gh copilot
   ```

2. Send the following prompt in Copilot CLI:

   ```prompt
   /agentic-workflows suggest one improvement to `.github/workflows/daily-report-status.md` and explain why in one sentence.
   ```

3. Confirm you receive a reply. Any response means the model and skill are accessible.
4. If you see an error, check [github.com/settings/copilot](https://github.com/settings/copilot) to confirm Copilot is enabled on your account, then return here.

> [!IMPORTANT]
> Do not continue if you received an error instead of a response. Fix the access issue now — model-access errors will cause Step 8 to fail and are much harder to diagnose mid-run. Check [github.com/settings/copilot](https://github.com/settings/copilot) first, then see [Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md) if the problem persists.

## Pre-flight troubleshooting decision tree

Use this quick check before you choose a billing path:

- **You receive a normal reply in Copilot CLI**
  - Continue to **Confirm Copilot access in your browser** below.
- **You receive an access or entitlement error**
  - Confirm Copilot is enabled for your account at [github.com/settings/copilot](https://github.com/settings/copilot).
  - If your repository is in an organization, ask your org admin to confirm your Copilot seat and policy access.
  - Retry the same one-sentence prompt in Copilot CLI.
- **You still cannot get a reply after account checks**
  - Pause here and complete [Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md), then return to this step.

## Confirm Copilot access in your browser

Before you choose a billing path, confirm your account-level Copilot access from the browser. This step catches the most common access problems without needing the terminal, and is required before the billing fork regardless of how you ran the CLI check above.

1. Open [github.com/settings/copilot](https://github.com/settings/copilot) in a new browser tab.
2. Find your access status and match it to the table below:

| What you see | What to do next |
|---|---|
| **"Copilot is active"** or model options are visible | Account access confirmed — continue to **Choose one Copilot billing path** |
| **"Copilot is not enabled"** or no subscription shown | Enable Copilot on your account first, then return here |
| **"Your organization manages your Copilot access"** | Ask your org admin to confirm your seat is active before choosing a billing path |

> [!IMPORTANT]
> Fix any access problem here before choosing a billing path. All billing paths require an active Copilot subscription. Skipping this check and proceeding to the billing steps will not resolve an access problem — it will just move the error to Step 8 where it is harder to diagnose.

## Confirm the workflow engine

Open `.github/workflows/daily-report-status.md`. The Step 7 workflow has no `engine:` line, so it uses GitHub Copilot.

Claude and Codex are optional [engines](https://github.github.com/gh-aw/reference/engines/) introduced in later side quests. You do not need an Anthropic or OpenAI API key for this first run.

If you are working in Claude Code or OpenAI Codex, keep this first workflow on Copilot and switch later if you want:

- **Claude Code:** use [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md).
- **OpenAI Codex:** use [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md).

- [ ] I confirmed the workflow file has no `engine:` line — it uses GitHub Copilot by default

## Choose one Copilot billing path

Choose exactly one method. The diagram below shows both paths and the key configuration difference between them.

> [!NOTE]
> <details>
> <summary><b>Plain-language billing summary</b></summary>
>
> - **Choose organization centralized billing** when the repository's organization already pays for Copilot in GitHub Actions. Keep `copilot-requests: write`. Do not add a `COPILOT_GITHUB_TOKEN` secret.
> - **Choose personal billing** when this is your personal repository, or when the organization does not pay for Copilot in GitHub Actions. Remove `copilot-requests: write`, then add a `COPILOT_GITHUB_TOKEN` secret in the repository's **Settings** → **Secrets and variables** → **Actions** page.
> - **If you are not sure which path applies, ask one question:** "Is centralized Copilot billing for GitHub Actions enabled for this repository?" If the answer is "no" or "I don't know," follow the personal billing path until an admin confirms otherwise.
>
> </details>

![Decision flow for choosing Copilot billing path: organization centralized billing or personal billing](images/07d-billing-path-decision.svg)

### Billing quick-reference

Before you read the table, predict: what is the one workflow permission setting that changes between the two billing paths?

- [ ] I've written my prediction

Use this table first, then follow the detailed steps for your selected path below.

| If this is true | Choose this path | Key setting |
|---|---|---|
| Your organization provides centralized Copilot billing for Actions | **Organization with centralized Copilot billing** | Keep `copilot-requests: write`; no `COPILOT_GITHUB_TOKEN` secret |
| You are in a personal repo, or your org does not provide centralized billing | **Personal billing** | Remove `copilot-requests: write`; configure `COPILOT_GITHUB_TOKEN` |

> Check your prediction: the key difference is `copilot-requests: write` — present for organization billing, removed for personal billing. The `COPILOT_GITHUB_TOKEN` secret is only required on the personal path.

### Organization with centralized Copilot billing

Use this path when the organization that owns the repository has centralized Copilot billing enabled for Actions.

1. Ask your organization administrator to confirm centralized billing is enabled.
2. Open `daily-report-status.md` and confirm the `permissions:` block includes `copilot-requests: write`:

   ```yaml
   permissions:
     contents: read
     copilot-requests: write
   ```

   This line is already present in the workflow template. Do not remove it.
3. No repository secret is needed for this path.
4. Recompile and commit the lock file from your terminal so it reflects the confirmed configuration:

   ```bash
   gh aw compile
   git add .
   git commit -m "chore: confirm lock file is current" && git push
   ```

The workflow uses the organization subscription. If you see `401 Unauthorized` in the run log, see [Method 1: Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md) for troubleshooting.

- [ ] I confirmed `copilot-requests: write` is present in the permissions block and the lock file is recompiled

### Personal billing

Use this path for a personal repository, or when the owning organization does not provide centralized Copilot billing.

> [!IMPORTANT]
> When `copilot-requests: write` is present, the workflow ignores `COPILOT_GITHUB_TOKEN` for inference. Remove the permission before you set up the secret, then recompile.

1. Remove `copilot-requests: write` from `daily-report-status.md`.
2. Generate a fine-grained PAT with **Copilot requests: Read-only** in [github.com/settings/tokens](https://github.com/settings/tokens).
3. In your repository, open **Settings** → **Secrets and variables** → **Actions**.
4. Add a new repository secret named `COPILOT_GITHUB_TOKEN` and paste the PAT value.
5. Recompile and commit `daily-report-status.lock.yml`.

For the full browser walkthrough, see [Method 2 (UI-only): `COPILOT_GITHUB_TOKEN`](side-quest-06-03c-copilot-github-token-ui-only.md). If you prefer terminal setup, use [Method 2: `COPILOT_GITHUB_TOKEN` secret](side-quest-06-03b-copilot-github-token.md).

- [ ] I confirmed `copilot-requests: write` is removed and `COPILOT_GITHUB_TOKEN` is added as a repository secret

## Check the final configuration

Open `daily-report-status.md` and confirm it matches the method you selected:

| Billing path | `copilot-requests: write` | Required secret |
|---|---|---|
| Organization centralized billing | Present | None |
| Personal billing | Removed | `COPILOT_GITHUB_TOKEN` |

## ✅ Checkpoint

- [ ] I opened Copilot CLI in the terminal and sent a test prompt
- [ ] I received a response from the model and the `agentic-workflows` skill
- [ ] I confirmed no access errors appeared
- [ ] I confirmed Copilot is active at [github.com/settings/copilot](https://github.com/settings/copilot) in my browser
- [ ] I confirmed the first workflow uses GitHub Copilot
- [ ] I used the agent + `agentic-workflows` guidance to improve workflow design decisions
- [ ] I chose organization centralized billing or personal billing
- [ ] I completed all configuration steps for my chosen billing path (inline above — no side-quest visit required)
- [ ] My source and compiled lock file use the selected method
- [ ] Both workflow files are committed to `main`
- [ ] I am ready for [Run and Watch Your Workflow](08-run-your-workflow.md)

<!-- journey: all -->
**Next:** [Run and Watch Your Workflow](08-run-your-workflow.md)
<!-- /journey -->
