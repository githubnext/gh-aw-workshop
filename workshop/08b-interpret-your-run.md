<!-- page-journey: all -->
<!-- page-adventure: core -->
# Interpret Your First Run

_Your first run is more useful when you can explain what the agent did and why._

## 🎯 What You'll Do

You'll read the live log from Step 8, find the workflow's output, and learn three quick checks for common run problems.

## 📋 Before You Start

- Completed [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
- Your **Daily Report Status** workflow has at least one completed run

## Read the live log

Open the completed **Daily Report Status** run from the **Actions** tab and click the job name. The log usually moves through a simple pattern: the agent thinks, calls a tool, receives a result, and finishes.

![Agent execution loop: Planning leads to a Tool Call, which returns a Result; the agent loops back or ends with Done](images/08b-agent-loop.svg)

```text
🤔 Planning...  Searching for open issues with 👍 reactions
🔧 Tool call:   github.list_issues
📥 Result:      3 issues found
🤔 Thinking...  Issue #4 has the most 👍 reactions
🔧 Tool call:   github.add_comment
✅ Done
```

The important question is not "Can I read every line?" It is "Can I tell where the agent decided, where it acted, and whether it finished?" Find the first `Tool call` in your own run and write one short note about what it was trying to do.

## Check the output

After the run finishes, scroll to the **Summary** section on the run page. This gives you the short version of what the agent believes it did, including the safe-output action it used.

Then verify the real output in your repository. For **Daily Report Status**, that usually means opening the issue the agent touched and confirming the comment or new issue is actually there. The GitHub change is the ground truth behind the [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) record.

![Workflow run summary panel](images/08-run-summary.svg)

## Check common error patterns first

If your run does not look right, start with these quick checks before changing the workflow:

- **The workflow never appears in Actions** — confirm the workflow file is committed on `main`, then refresh. If you use the terminal path, run `gh aw compile` to catch compile errors.
- **The log shows lots of thinking but no useful action** — your instructions may be too vague. Keep the run open, then refine the workflow body in a later step.
- **The run finishes but nothing changed in GitHub** — make sure your repository has an open issue and that the workflow had permission to write.

For a deeper troubleshooting guide, see [Step 9: Reading Workflow Output](09-understand-output.md) and [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md).

## ✅ Checkpoint

- [ ] I found the first `Tool call` in my completed run
- [ ] I can point to a planning line, a result line, and the final `Done` line
- [ ] I opened the run summary and found the safe-output note
- [ ] I verified the real GitHub output that the workflow created
- [ ] I know the first check to make if a run is missing, confused, or finished without writing anything

<!-- journey: all -->
**Next:** [Step 9: Reading Workflow Output](09-understand-output.md)
<!-- /journey -->


