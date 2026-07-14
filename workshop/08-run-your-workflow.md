# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time makes the workflow feel concrete._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, watch it start in the **Actions** tab, and confirm it finishes successfully.

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- `hello-agent.md` is committed to `.github/workflows/` on `main`
- **Codespace users only:** Set workflow permissions to **Read and write permissions** so the workflow can post comments or create issues:
  1. Open **Settings → Actions → General**.
  2. Select **Read and write permissions** and click **Save**.
  3. Confirm **Hello Agent** appears in the **Actions** sidebar.
- Your practice repository has at least one open issue (create one in the **Issues** tab if not)

## Run the workflow

Start by checking that every item in **Before You Start** is complete. This step is UI-first because it works for every learner, even if your terminal token does not have permission to trigger workflows.

If you prefer the terminal, you can use `gh aw run hello-agent` as an advanced option. If that fails in Codespaces with an `actions:write` error, use [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md) or continue with the GitHub UI.

### Verify Copilot access

Before you trigger a run, confirm your workflow is configured to reach a Copilot model. Runs that fail immediately with a model-access or authentication error almost always indicate a missing or expired token.

Check your configuration based on the authentication method in your `hello-agent.md` frontmatter:

- If your frontmatter has **`copilot-requests: write`** under `permissions`: confirm your GitHub account has an active Copilot subscription at [github.com/settings/copilot](https://github.com/settings/copilot).
- If you configured **`COPILOT_GITHUB_TOKEN`** or another inference provider secret: go to **Settings → Secrets and variables → Actions** in your practice repository and confirm the secret is listed under **Repository secrets**.
- Not sure which your workflow uses? Open `.github/workflows/hello-agent.md` and look for a `permissions` block or a `secrets` reference, or complete [Side Quest: Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md) before continuing.

### Trigger it from the Actions tab

Open your practice repository in GitHub and click **Actions** in the top navigation. In the left sidebar, select **Hello Agent**.

![Actions tab showing where to find Hello Agent in the workflow list](images/08-actions-tab.svg)

Click **Run workflow**, keep the default branch selected, and click the green **Run workflow** button. If **Hello Agent** is missing, refresh the page, confirm the workflow file is on `main`, and run `gh aw compile` from your terminal if you need to check for compile errors.

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

- [ ] I ran the pre-flight check and confirmed Copilot access is ready
- [ ] My workflow has Copilot access configured — either `copilot-requests: write` in the frontmatter or `COPILOT_GITHUB_TOKEN` (or equivalent inference secret) listed under **Settings → Secrets and variables → Actions**
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
