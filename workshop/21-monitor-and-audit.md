# Monitor and Audit Your Agentic Workflows

> _Knowing your workflow ran is good; knowing what it actually did — and what it cost — is even better._

## 🎯 What You'll Do

You'll learn how to review the run history of an agentic workflow in the GitHub Actions UI, read the agent's decision log to understand why it responded the way it did, and estimate token usage so you can right-size your workflows over time.

## 📋 Before You Start

- You have a working, scheduled agentic workflow from [Schedule Your Workflow to Run Automatically](13-schedule-it.md).
- You understand the basic run lifecycle covered in [Run Your Workflow](08-run-your-workflow.md).

## Steps

### Open the run history

Every workflow run is stored in the **Actions** tab of your repository.

1. Go to your repository on GitHub.
2. Click the **Actions** tab in the top navigation.
3. In the left sidebar, find the name of your agentic workflow (for example, **Daily Status Report**).
4. Click its name to see the list of past runs.

Each row shows:
- **Status** — a green tick (success), red cross (failure), or yellow dot (in progress).
- **Trigger** — what started the run: `schedule`, `workflow_dispatch`, or a push event.
- **Duration** — how long the run took.

![Run list in the Actions tab](images/21-run-list.png)

### Read the agent log

1. Click any run in the list to open the run summary.
2. Click the job name (usually **Run agentic workflow**) to expand the steps.
3. Find the step labelled **Run agent** or similar and click it to open the raw log.

The log shows the agent's inner loop:
- **Tool calls** the agent made (for example, listing issues via MCP).
- **Tool results** it received back.
- **The text it generated** before writing its final output.

> [!TIP]
> Look for lines that start with `[tool_use]` or `[tool_result]`. These lines let you verify the agent is reading the data you intended — not making things up.

### Check for common failure patterns

| Symptom | Likely cause | What to look for in the log |
|---------|-------------|------------------------------|
| Run succeeds but output is empty | Agent brief too vague | Look for a short assistant message with no tool calls |
| Run fails with a permissions error | Missing `permissions:` in frontmatter | Look for `403` or `Resource not accessible by integration` |
| Run hangs and times out | Infinite loop or very large context | Look for repeated tool calls with identical parameters |
| Output is stale or missing new items | Memory filter too aggressive | Check [Persistent Memory](20-persistent-memory.md) slot contents |

> [!NOTE]
> If a run fails, the **Annotations** panel at the top of the run summary often shows a one-line summary of the error — check there before diving into the raw log.

### Estimate token usage

Agentic workflow runs consume AI tokens, which affect cost if you are using a paid model. The `gh-aw` extension writes a token summary to the workflow step output.

In the agent log, search for a line that looks like:

```
usage: input_tokens=1823 output_tokens=412
```

You can also run this command in your terminal to pull the summary for your latest run:

```bash
gh run view --log --repo <owner>/<repo> | grep "usage:"
```

If the token count is unexpectedly high, check:
- Whether your task brief includes large, unbounded data fetches (for example, all issues ever opened).
- Whether the MCP server is returning more data than the agent needs.
- Whether your `memory:` slot is growing too large.

<details>
<summary>🖥️ Reading logs entirely in the GitHub UI</summary>

1. In the **Actions** tab, open the run you want to inspect.
2. Click the job name to expand the step list.
3. Click the **⚙️ gear icon** next to any step and choose **View raw logs** to download the complete log file.
4. Open the downloaded file in any text editor and search for `usage:` or `tool_use`.

</details>

### Set a spending alert (optional)

If your organisation uses a metered Copilot plan or a third-party model key, consider adding a `timeout-minutes:` field to your workflow frontmatter. This caps the maximum wall-clock time — and therefore the maximum token spend — per run.

Open your workflow's `.md` file and add the field inside the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * 1-5"
timeout-minutes: 5
permissions:
  issues: read
  contents: read
---
```

A five-minute cap is a reasonable starting point for a daily-status workflow. Adjust up if the agent legitimately needs longer.

## ✅ Checkpoint

- [ ] You can navigate to the run history for your agentic workflow in the Actions tab
- [ ] You can open a run log and identify at least one tool call or tool result line
- [ ] You have located the `usage:` line in at least one run and noted the token counts
- [ ] You know which failure patterns to look for if a run produces empty or incorrect output
- [ ] (Optional) You've added `timeout-minutes:` to your workflow frontmatter

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Side Quest: Debug Your Workflow Output](side-quest-09-01-debug-output.md)
- [Add Persistent Memory to Your Workflow](20-persistent-memory.md)
- [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
