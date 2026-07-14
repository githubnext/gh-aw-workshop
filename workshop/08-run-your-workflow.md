# Step 8: Run and Watch Your Workflow

_Watching an agent work in real time is fundamentally different from reading about it._

## 🎯 What You'll Do

You'll trigger the `hello-agent` workflow from Step 7, predict what it will do before it runs, then verify your predictions against the live log.

> [!IMPORTANT]
> **Codespace users — before you trigger:** Your Codespace token does not include `actions:write` by default.
> **Quick fix (30 seconds):**
> 1. Go to your repository **Settings → Actions → General → Workflow permissions**.
> 2. Select **Read and write permissions** and click **Save**.
> 3. Come back here and continue from **Trigger the workflow via GitHub Actions UI** below.
>
> If you prefer the terminal trigger, see [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

## 📋 Before You Start

- Completed either the [Terminal path](07a-your-first-workflow-terminal.md) or [GitHub UI path](07b-your-first-workflow-ui.md)
- Your browser is open to your practice repository on GitHub

## Steps

### Confirm your setup

Before triggering, verify all three:

- [ ] `hello-agent.md` is committed to `.github/workflows/` on `main`
- [ ] The **Actions** tab shows **Hello Agent** in the left workflow sidebar
- [ ] Your practice repository has at least one open issue (create one in the **Issues** tab if not)
- [ ] (Codespace users) Did the fix work? Confirm the **Hello Agent** workflow appears in the **Actions** tab after updating workflow permissions.

### Predict before you run

Before you click, write down: what do you expect the agent to do first?

- [ ] **Why do you expect that first action?** Write one sentence describing the clue in your workflow that leads you to that prediction.
- [ ] **Which issue will it pick?** If you have multiple open issues, which one do you expect the agent to select, and why?
- [ ] **What will the output look like?** Will the agent post a comment, create a new issue, or do something else?
- [ ] **What will you do if the workflow doesn't appear in the Actions sidebar?** Write one recovery step you'd take before asking for help.

Keep your predictions handy — you'll check them against the live log in a moment.

> [!NOTE]
> **Prefer the terminal?** Trigger with `gh aw run hello-agent`, but this requires `actions:write` scope. Codespace tokens do not include this by default — see [Side Quest: Fix Codespaces `actions:write` Errors](side-quest-08-01-codespaces-actions-write.md).

### Trigger the workflow via GitHub Actions UI

1. Click the **Actions** tab in your repository's navigation bar.

   ![Actions tab showing where to find Hello Agent in the workflow list](images/08-actions-tab.svg)

2. In the left sidebar, click **Hello Agent**, then click **Run workflow**.

   ![Workflow sidebar with the Run workflow button highlighted](images/08-run-workflow-button.svg)

3. Keep the default branch selected and click the green **Run workflow** button.

   ![Run workflow confirmation dropdown showing branch selection and final Run workflow button](images/08-run-workflow-confirm-dropdown.svg)

> [!TIP]
> **Hello Agent not in the sidebar yet?** Wait 30 seconds and refresh. Check that `hello-agent.md` is committed to `main` in `.github/workflows/`.

<!-- -->

> [!TIP]
> **Run succeeded but no comment appeared?** The agent needs at least one open issue. Create one in the **Issues** tab and re-run.

<!-- -->

### Annotate a sample log, then analyse your own

After a few seconds a new row appears with a yellow spinning icon. Click it, then click the job to open the live log.

An [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) log shows the agent's **reasoning steps** — not build commands. Before reading the explanation, label each line in the sample below with its type: `Planning`, `Tool call`, `Result`, or `Done`. Copy the block into a local text file and write your labels next to each line.

```
🤔 Planning...  Searching for open issues with 👍 reactions
🔧 Tool call:   github.list_issues  (state=open, sort=reactions-+1)
📥 Result:      3 issues found
🤔 Thinking...  Issue #4 has the most 👍 reactions (7)
🔧 Tool call:   github.add_comment  (issue_number=4)
✅ Done
```

<details>
<summary>Reveal annotated log</summary>

```
🤔 Planning...  Searching for open issues with 👍 reactions   ← Planning
🔧 Tool call:   github.list_issues  (state=open, sort=reactions-+1)  ← Tool call
📥 Result:      3 issues found                                ← Result
🤔 Thinking...  Issue #4 has the most 👍 reactions (7)        ← Planning
🔧 Tool call:   github.add_comment  (issue_number=4)          ← Tool call
✅ Done                                                       ← Done
```

Each `🤔` line is the model choosing its next action — this is where reasoning happens. Logs can feel slow for exactly this reason.

</details>

Now watch your own run's live log and answer these questions:

1. Which `tool_call` did the agent make first?
2. How many reasoning steps (`🤔`) did the agent take before posting a comment or creating an issue?
3. Does the agent's behavior match your predictions? Note any surprises.

### Check the outcome

**Reflection — before you open the Issues tab:** predict what the agent would have done if your repository had zero open issues. Write your prediction, then open the Issues tab and verify it against the run log.

Once the run shows a green ✅, go to the **Issues** tab. You should see a new comment on an existing issue (or a new issue created by the agent).

Read the comment, then look back at your workflow file. Notice how your plain-English instructions translated into real GitHub actions. If the result surprises you, compare it to your predictions and consider how you might revise the instructions.

### View the run summary

Go back to the completed run in the **Actions** tab and scroll to the **Summary** section. Agentic workflows post a structured summary showing what the agent did and which [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) operations it performed.

![Workflow run summary panel](images/08-run-summary.svg)

### Re-run with a twist (optional)

Ask Copilot, [Claude](side-quest-01-02-environment-reference.md#claude), or ChatGPT (with the `agentic-workflows` skill) to change the task — for example, add a label instead of posting a comment. Review the diff, push, and trigger another run. This is the core loop: **design → agent edit → run → observe → refine**.

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
