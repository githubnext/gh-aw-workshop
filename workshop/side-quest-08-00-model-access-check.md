# Side Quest: Confirm Model Access Before Your First Run

> [!NOTE]
> Use this quick check before [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md), then return to Step 8 to trigger your first run.

## 🎯 What You'll Do

You'll confirm that your `hello-agent` workflow can reach the right model and, if you plan to use `gh aw run` from a Codespace, you'll confirm the extra repository permissions that path needs.

## Identify your workflow engine

Open `.github/workflows/hello-agent.md` in your practice repository and look for an `engine:` line in the frontmatter.

- No `engine:` line means GitHub Copilot (the default).
- `engine: claude` means the workflow uses Claude.
- `engine: codex` means the workflow uses OpenAI.

## Match the check to your engine

<details>
<summary><b>GitHub Copilot (default — no <code>engine:</code> line in the frontmatter)</b></summary>

Your workflow uses GitHub Copilot when the frontmatter has no `engine:` line.

If you still need to set up Copilot access, or if you want the full walkthrough, use one of these side quests before continuing:

- [Side Quest: Method 1 — Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md) — Recommended workshop path
- [Side Quest: Method 2 — `COPILOT_GITHUB_TOKEN`](side-quest-06-03b-copilot-github-token.md) — Use this if Method 1 is not available in your environment or you need a PAT-based setup

1. Verify that at least one of the following Copilot authentication methods is configured (complete the appropriate setup side quest above if needed):
   - **Method 1 (permission-based):** `copilot-requests: write` appears in the `permissions:` block of your `hello-agent.md`.
   - **Method 2 (token-based):** `COPILOT_GITHUB_TOKEN` appears in **Settings → Secrets and variables → Actions**.
2. Confirm you have an active GitHub Copilot subscription — [Open Copilot settings](https://github.com/settings/copilot).

- [ ] I confirmed at least one Copilot authentication method is configured.
- [ ] I confirmed my GitHub Copilot subscription is active.

</details>

<details>
<summary><b>Claude (<code>engine: claude</code>)</b></summary>

Your workflow uses Claude when the frontmatter contains `engine: claude`.

If you still need to set up Claude access, or if you want the full walkthrough, use this side quest before continuing:

- [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md)

1. Confirm `ANTHROPIC_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `ANTHROPIC_API_KEY` is present in **Settings → Secrets and variables → Actions**.

</details>

<details>
<summary><b>OpenAI (<code>engine: codex</code>)</b></summary>

Your workflow uses OpenAI when the frontmatter contains `engine: codex`.

If you still need to set up OpenAI access, or if you want the full walkthrough, use this side quest before continuing:

- [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md)

1. Confirm `OPENAI_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `OPENAI_API_KEY` is present in **Settings → Secrets and variables → Actions**.

</details>

> [!NOTE]
> Before you return to Step 8, say out loud or jot down one sentence describing the kind of error you would expect if your workflow did not have model access configured.

## Optional: terminal runs from a Codespace

Step 8 uses the GitHub Actions UI because it works for every learner. If you plan to use `gh aw run hello-agent` from a GitHub Codespace instead, confirm the repository is ready for that advanced path.

1. Open **Settings → Actions → General** in your practice repository.
2. Select **Read and write permissions** and click **Save**.
3. Confirm **Hello Agent** appears in the **Actions** sidebar.

- [ ] If I am running from a Codespace terminal, I set **Read and write permissions** in **Settings → Actions → General**.

If you still hit an `actions:write` or `HTTP 403: Resource not accessible by integration` error in a Codespace, use [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

## ✅ Checkpoint

- [ ] I opened `.github/workflows/hello-agent.md` and confirmed which engine I am using
- [ ] I completed the matching model-access check for my workflow
- [ ] My workflow has model access configured — either `copilot-requests: write`, `COPILOT_GITHUB_TOKEN`, or the relevant API key secret listed under **Settings → Secrets and variables → Actions**
- [ ] If I am running from a Codespace terminal, I set **Read and write permissions** in **Settings → Actions → General**
- [ ] I am ready to return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
