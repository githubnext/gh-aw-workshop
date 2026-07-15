# Side Quest: Confirm Model Access Before Your First Run

> [!NOTE]
> Use this quick check before [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md), then return to Step 8 to trigger your first run.

## 🎯 What You'll Do

You'll confirm that your `hello-agent` workflow can reach the right model and, if you plan to use `gh aw run` from a Codespace, you'll confirm the extra repository permissions that path needs.

## Identify your workflow engine

Open `.github/workflows/hello-agent.md` in your practice repository and look for an `engine:` line in the frontmatter.

- No `engine:` line means GitHub Copilot (the default).
- `engine: claude` means the workflow uses Claude.
- `engine: codex` means the workflow uses Codex / OpenAI.

## Match the check to your engine

<details>
<summary><b>GitHub Copilot (default — no <code>engine:</code> line in the frontmatter)</b></summary>

Your workflow uses GitHub Copilot when the frontmatter has no `engine:` line.

1. Confirm `copilot-requests: write` appears in the `permissions:` block of your `hello-agent.md`.
2. Confirm you have an active GitHub Copilot subscription — [Open Copilot settings](https://github.com/settings/copilot).

- [ ] I confirmed `copilot-requests: write` is in my frontmatter and my Copilot subscription is active.

Not sure about the `permissions` block? See [Side Quest: Method 1 — Copilot Requests Permission](side-quest-06-03a-copilot-requests-permission.md).

</details>

<details>
<summary><b>Claude (<code>engine: claude</code>)</b></summary>

Your workflow uses Claude when the frontmatter contains `engine: claude`.

1. Confirm `ANTHROPIC_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `ANTHROPIC_API_KEY` is present in **Settings → Secrets and variables → Actions**.

Need to set this up? See [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md).

</details>

<details>
<summary><b>Codex / OpenAI (<code>engine: codex</code>)</b></summary>

Your workflow uses Codex when the frontmatter contains `engine: codex`.

1. Confirm `OPENAI_API_KEY` is set in **Settings → Secrets and variables → Actions** in your practice repository.

- [ ] I confirmed `OPENAI_API_KEY` is present in **Settings → Secrets and variables → Actions**.

Need to set this up? See [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md).

</details>

> [!TIP]
> Reflection: In one sentence, describe what would happen if you returned to Step 8 and clicked **Run workflow** without completing your engine's check.

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
- [ ] My workflow has model access configured — either `copilot-requests: write` in the frontmatter or the relevant API key secret listed under **Settings → Secrets and variables → Actions**
- [ ] If I am running from a Codespace terminal, I set **Read and write permissions** in **Settings → Actions → General**
- [ ] I am ready to return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)

Return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md).
