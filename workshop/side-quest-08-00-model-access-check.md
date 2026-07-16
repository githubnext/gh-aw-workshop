# Side Quest: Confirm Model Access Before Your First Run

> [!NOTE]
> [Step 8](08-run-your-workflow.md) now includes an inline model access gate. Use this side quest for detailed setup help or troubleshooting if the inline gate flags a problem.

## 📋 Before You Start

- You completed [Step 6: Install `gh-aw`](06-install-gh-aw.md).
- Your practice repository is ready from [Step 3](03-create-your-repo.md).
- Your GitHub account has an active GitHub Copilot subscription (verify at [github.com/settings/copilot](https://github.com/settings/copilot)).
- You know which authentication method you are using (see [Side Quest: Configure GitHub Copilot Authentication](side-quest-06-03-copilot-token.md)).

## 🎯 What You'll Do

You'll confirm that your `daily-report-status` workflow can reach the right model before you continue to [Step 8](08-run-your-workflow.md).

## Identify your workflow engine

Open `.github/workflows/daily-report-status.md` in your practice repository and look for an `engine:` line in the frontmatter.

- No `engine:` line means GitHub Copilot (the default).
- `engine: claude` means the workflow uses Claude.
- `engine: codex` means the workflow uses OpenAI.

## Match the check to your engine

<details>
<summary><b>GitHub Copilot (default — no <code>engine:</code> line in the frontmatter)</b></summary>

Your workflow uses GitHub Copilot when the frontmatter has no `engine:` line.

If you still need setup help, use one of these side quests before continuing:

- [Side Quest: Method 1 — Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md)
- [Side Quest: Method 2 — `COPILOT_GITHUB_TOKEN`](side-quest-06-03b-copilot-github-token.md)

1. Confirm one Copilot access path is ready:
   - `copilot-requests: write` appears in the `permissions:` block of your `daily-report-status.md`.
   - `COPILOT_GITHUB_TOKEN` appears in **Settings → Secrets and variables → Actions**.
2. Confirm you have an active GitHub Copilot subscription — [Open Copilot settings](https://github.com/settings/copilot).

- [ ] I confirmed at least one Copilot authentication method is configured.
- [ ] I confirmed my GitHub Copilot subscription is active.

</details>

<details>
<summary><b>Claude (<code>engine: claude</code>)</b></summary>

Your workflow uses Claude when the frontmatter contains `engine: claude`.

If you still need setup help, use this side quest before continuing:

- [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md)

1. Confirm `ANTHROPIC_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `ANTHROPIC_API_KEY` is present in **Settings → Secrets and variables → Actions**.

</details>

<details>
<summary><b>OpenAI (<code>engine: codex</code>)</b></summary>

Your workflow uses OpenAI when the frontmatter contains `engine: codex`.

If you still need setup help, use this side quest before continuing:

- [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md)

1. Confirm `OPENAI_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `OPENAI_API_KEY` is present in **Settings → Secrets and variables → Actions**.

</details>

## Optional: terminal runs from a Codespace

Step 8 uses the GitHub Actions UI. Only do this extra check if you plan to use `gh aw run daily-report-status` from a GitHub Codespace terminal.

1. Open **Settings → Actions → General** in your practice repository.
2. Select **Read and write permissions** and click **Save**.

- [ ] If I am running from a Codespace terminal, I set **Read and write permissions** in **Settings → Actions → General**.

If terminal runs still fail in a Codespace, use [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

## ✅ Checkpoint

- [ ] I opened `.github/workflows/daily-report-status.md` and confirmed which engine I am using
- [ ] I completed the matching model-access check for my workflow
- [ ] If I am running from a Codespace terminal, I set **Read and write permissions** in **Settings → Actions → General**
- [ ] I am ready to return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
