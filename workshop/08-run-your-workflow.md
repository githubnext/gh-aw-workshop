# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time makes the workflow feel concrete._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, watch it start in the **Actions** tab, and confirm it finishes successfully.

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- `hello-agent.md` and `hello-agent.lock.yml` are committed to `.github/workflows/` on `main`
- Your practice repository has at least one open issue (create one in the **Issues** tab if not)

## Run the workflow

Start by checking that every item in **Before You Start** is complete. This step is UI-first because it works for every learner, even if your terminal token does not have permission to trigger workflows.

If you prefer the terminal, you can use `gh aw run hello-agent` as an advanced option. If that fails in Codespaces with an `actions:write` error, use [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md) or continue with the GitHub UI.

### Model access wizard

Before you trigger a run, confirm your workflow can reach an AI model. Runs that fail immediately with a model-access or authentication error almost always indicate a missing or expired token.

**Which engine does your `hello-agent.md` use?** Open `.github/workflows/hello-agent.md` and look for an `engine:` line in the frontmatter. No `engine:` line means GitHub Copilot (the default). Expand only the option that matches your workflow.

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

> **Reflection:** In one sentence, describe what would happen if you clicked Run workflow right now without completing your engine's check above.

<details>
<summary><b>Running in a GitHub Codespace? Expand for one extra step.</b></summary>

Codespace workflows need write access to post comments or create issues. Complete this before triggering the run:

1. Open **Settings → Actions → General** in your practice repository.
2. Select **Read and write permissions** and click **Save**.
3. Confirm **Hello Agent** appears in the **Actions** sidebar.

- [ ] I set **Read and write permissions** in **Settings → Actions → General**.

</details>

<details>
<summary><b>Need deeper troubleshooting for model-access failures?</b></summary>

- For actions:write permission errors in Codespaces, follow [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).
- For Gemini or another provider, confirm the engine-specific API key secret is present in **Settings → Secrets and variables → Actions** and then follow your provider documentation.

</details>

### Before you click Run

- [ ] I opened `.github/workflows/hello-agent.md` and confirmed which engine I am using
- [ ] I completed the matching engine check from the wizard above
- [ ] **Hello Agent** appears in the **Actions** sidebar
- [ ] I have at least one open issue in my practice repository

### Trigger the workflow via GitHub Actions UI

Open your practice repository in GitHub and click **Actions** in the top navigation. In the left sidebar, select **Hello Agent**.

![Actions tab showing where to find Hello Agent in the workflow list](images/08-actions-tab.svg)

Click **Run workflow**, keep the default branch selected, and click the green **Run workflow** button. If **Hello Agent** is missing, refresh the page and confirm both workflow files are on `main`. If you used the GitHub UI path, go back to [Step 7b](07b-your-first-workflow-ui.md) and use the **Agentic Workflows** agent to compile the lock file. If you used the Terminal path, run `gh aw compile` to check for compile errors.

If the run fails immediately with a model-access or authentication error, stop and expand the matching engine check from the wizard above before rerunning.

![Workflow sidebar with the Run workflow button highlighted](images/08-run-workflow-button.svg)

![Run workflow confirmation dropdown showing branch selection and final Run workflow button](images/08-run-workflow-confirm-dropdown.svg)

### Watch the run start

After a few seconds, a new run appears with a yellow spinning icon. Click the run, then click the job name to open the live log.

You do not need to decode every line yet. For now, just confirm that the workflow is active and the log is updating as the agent plans and uses tools.

### Confirm the run finished

Wait for the run to turn green with a ✅. Then open the **Issues** tab in your repository and confirm that the agent updated an issue or created a new one.

This is the moment to compare what happened with what you expected from your Step 7 instructions. If the result surprises you, keep going to the next step so you can interpret the log and summary before changing the workflow.

Before you move on, continue to [Step 8b: Interpret Your First Run](08b-interpret-your-run.md). That follow-up step helps you read the log, locate the output, and spot the first signs of trouble.

## ✅ Checkpoint

- [ ] I used the model access wizard and confirmed my workflow's engine access is ready
- [ ] My workflow has model access configured — either `copilot-requests: write` in the frontmatter or the relevant API key secret listed under **Settings → Secrets and variables → Actions**
- [ ] If I am running in a Codespace, I set **Read and write permissions** in **Settings → Actions → General**
- [ ] The **Hello Agent** workflow appears in the **Actions** tab
- [ ] I triggered a manual run from the GitHub UI
- [ ] I opened the live log while the run was active
- [ ] The run completed with a green ✅
- [ ] I confirmed the agent updated my repository
- [ ] I am ready to interpret the run in [Step 8b](08b-interpret-your-run.md)

**Next:** [Step 8b: Interpret Your First Run](08b-interpret-your-run.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
