# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time is fundamentally different from reading about it._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, predict what it will do before it runs, then verify your predictions against the live log.

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- Your browser is open to your practice repository on GitHub

## Steps

### Confirm your setup

Before triggering, verify all three:

- [ ] `hello-agent.md` is committed to `.github/workflows/` on `main`
- [ ] The **Actions** tab shows **Hello Agent** in the left workflow sidebar
- [ ] Your practice repository has at least one open issue (create one in the **Issues** tab if not)

### Predict before you run

Before you click anything, write down your predictions:

1. **What will the agent do first?** Write one sentence describing the first action you expect it to take.
2. **Which issue will it pick?** If you have multiple open issues, which one do you expect the agent to select, and why?
3. **What will the output look like?** Will the agent post a comment, create a new issue, or do something else?

Keep your predictions handy — you'll check them against the live log in a moment.

### Trigger the workflow via GitHub Actions UI

1. Click the **Actions** tab in your repository's navigation bar.

   ![Actions tab showing where to find Hello Agent in the workflow list](images/08-actions-tab.svg)

2. In the left sidebar, click **Hello Agent**, then click **Run workflow**.

   ![Workflow sidebar with the Run workflow button highlighted](images/08-run-workflow-button.svg)

3. Keep the default branch selected and click the green **Run workflow** button.

   ![Run workflow confirmation dropdown showing branch selection and final Run workflow button](images/08-run-workflow-confirm-dropdown.svg)

<details>
<summary>Troubleshooting and advanced: terminal trigger</summary>

**Hello Agent not in the Actions sidebar?** Wait 30 seconds and refresh. If it still doesn't appear, confirm `.github/workflows/hello-agent.md` is committed to `main`.

**Workflow doesn't start within 60 seconds?** Refresh — GitHub's run queue occasionally takes up to a minute to dispatch a job.

**Run succeeded but no comment was created?** The agent may have found no open issues. Create one and re-run.

**Prefer the terminal?** Trigger with `gh aw run hello-agent`, but this requires `actions:write` scope. Codespace tokens do not include this by default — see [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

</details>

### Watch the run and interpret the log

After a few seconds a new row appears with a yellow spinning icon. Click it, then click the job to open the live log.

The log streams in real time. An [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) log shows the agent's **reasoning steps** — not build commands:

```
🤔 Planning...  Searching for open issues with 👍 reactions
🔧 Tool call:   github.list_issues  (state=open, sort=reactions-+1)
📥 Result:      3 issues found
🤔 Thinking...  Issue #4 has the most 👍 reactions (7)
🔧 Tool call:   github.add_comment  (issue_number=4)
✅ Done
```

**Interpret the log** — answer these three questions as you watch:

1. Which API call (`tool_call`) did the agent make first?
2. How many reasoning steps did the agent take before posting a comment or creating an issue?
3. Does the agent's behavior match your predictions? Note any surprises.

> [!TIP]
> Agentic logs can feel slow — the agent pauses to reason between steps. Each `🤔 Thinking...` line is the model choosing its next action.

### Check the outcome

Once the run shows a green ✅, go to the **Issues** tab. You should see a new comment on an existing issue (or a new issue created by the agent).

Read the comment, then look back at your workflow file. Notice how your plain-English instructions translated into real GitHub actions. If the result surprises you, compare it to your predictions and consider how you might revise the instructions.

### View the run summary

Go back to the completed run in the **Actions** tab and scroll to the **Summary** section. Agentic workflows post a structured summary showing what the agent did and which [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) operations it performed.

![Workflow run summary panel](images/08-run-summary.svg)

### Re-run with a twist (optional)

Ask Copilot, Claude, or ChatGPT (with the `agentic-workflows` skill) to change the task — for example, add a label instead of posting a comment. Review the diff, push, and trigger another run. This is the core loop: **design → agent edit → run → observe → refine**.

## ✅ Checkpoint

- [ ] The **Hello Agent** workflow appears in the **Actions** tab
- [ ] I triggered a manual run and it completed with a green ✅
- [ ] The run log shows at least one `tool_call` entry
- [ ] A comment or issue was created in my repository by the agent
- [ ] I answered all three "Interpret the Log" questions from the live log

**Next:** [Step 9: Reading Workflow Output](09-understand-output.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
