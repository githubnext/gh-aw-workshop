# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time makes the workflow feel concrete._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, watch it start in the **Actions** tab, and confirm it finishes successfully.

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- `hello-agent.md` and `hello-agent.lock.yml` are committed to `.github/workflows/` on `main`
- Your practice repository has at least one open issue (create one in the **Issues** tab if not)

## Before You Trigger: Verify Model Access

Before clicking Run, confirm your workflow has model access — this is the most common reason first runs fail.

1. Open `hello-agent.md` and check for an `engine:` line in the frontmatter. Terminal-path learners can identify their engine at a glance:

   ```bash
   grep "^engine:" .github/workflows/hello-agent.md
   # Returns nothing        → GitHub Copilot (default)
   # Returns engine: claude → Claude
   # Returns engine: codex  → OpenAI
   ```

2. Confirm model access is configured for your engine. For the default Copilot path, check that the permissions block in `hello-agent.md` includes `copilot-requests: write`. For other engines, open **Settings → Secrets and variables → Actions** and confirm the relevant API key secret is present (ANTHROPIC_API_KEY for Claude, OPENAI_API_KEY for OpenAI).

3. If access is not configured, complete the [Model Access Check](side-quest-08-00-model-access-check.md) before continuing.

- [ ] I confirmed which engine `hello-agent.md` uses
- [ ] Model access is configured for my engine

## Run the workflow

Start by checking that every item in **Before You Start** is complete. This step is UI-first because it works for every learner, even if your terminal token does not have permission to trigger workflows.

If you prefer the terminal, you can use `gh aw run hello-agent` as an advanced option after completing the model access gate above. If that command fails in Codespaces, use the GitHub UI path instead or follow [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

### Before you click Run

- [ ] **Hello Agent** appears in the **Actions** sidebar
- [ ] I have at least one open issue in my practice repository

### Trigger the workflow via GitHub Actions UI

Open your practice repository in GitHub and click **Actions** in the top navigation. In the left sidebar, select **Hello Agent**.

![Actions tab showing where to find Hello Agent in the workflow list](images/08-actions-tab.svg)

Click **Run workflow**, keep the default branch selected, and click the green **Run workflow** button. If **Hello Agent** is missing, refresh the page and confirm both workflow files are on `main`. If you used the GitHub UI path, go back to [Step 7b](07b-your-first-workflow-ui.md) and use the **Agentic Workflows** agent to compile the lock file. If you used the Terminal path, run `gh aw compile` to check for compile errors.

If the run fails immediately with a model-access or authentication error, stop and complete the [Model Access Check](side-quest-08-00-model-access-check.md) before rerunning.

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

- [ ] I completed the model access gate at the top of this step and my engine access is ready
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
