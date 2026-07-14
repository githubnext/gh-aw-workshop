# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time makes the workflow feel concrete._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, watch it start in the **Actions** tab, and confirm it finishes successfully.

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- `hello-agent.md` is committed to `.github/workflows/` on `main`
- **Codespace users only:** Set workflow permissions to **Read and write permissions** in **Settings → Actions → General**, then confirm **Hello Agent** appears in the **Actions** sidebar
- Your practice repository has at least one open issue (create one in the **Issues** tab if not)

## Run the workflow

Start by checking that every item in **Before You Start** is complete. This step is UI-first because it works for every learner, even if your terminal token does not have permission to trigger workflows.

If you prefer the terminal, you can use `gh aw run hello-agent` as an advanced option. If that fails in Codespaces with an `actions:write` error, use [Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md) or continue with the GitHub UI.

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
