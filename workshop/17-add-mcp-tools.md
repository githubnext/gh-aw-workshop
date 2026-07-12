# Give Your Agent More Tools with MCP

> _MCP servers turn your agent from a text generator into an active participant that can read, fetch, and act._

## 🎯 What You'll Do

You'll add an MCP (Model Context Protocol) server to your workflow's frontmatter, giving the AI agent access to a new set of tools it can call at runtime. By the end, your daily-status workflow will be able to do more than just generate text — it can interact with live data sources using structured tool calls.

## 📋 Before You Start

- You have installed the `gh-aw` extension in [Step 6: Install the `gh-aw` CLI Extension](06-install-gh-aw.md).
- You have a working daily-status workflow from [Build: Daily Repo Status Workflow](11-build-daily-status.md).
- You're comfortable editing the YAML frontmatter section at the top of your workflow file.

## Steps

### 1. Understand what MCP adds

MCP (Model Context Protocol) connects external tool servers to the agent so it can call structured operations — like listing issues or fetching commits — and weave the live results into its output. Without MCP, the agent only knows what you wrote in the brief; with MCP, it can go out and look things up itself.

> [!TIP]
> **Optional Side Quest:** Want a deeper look at how the agentic loop changes, what the `tools:` block does, and how to read tool calls in the Actions log? Work through [Side Quest: How MCP Tool Servers Work](side-quest-mcp-concepts.md), then come back here.

### 2. Add an MCP server to your workflow

Open your daily-status workflow file (`.github/workflows/daily-status.md`) and find the YAML frontmatter at the top. Add a `tools` block:

```yaml
---
name: Daily Status Report
on:
  workflow_dispatch:
  schedule:
    - cron: "0 9 * * 1-5"
permissions:
  contents: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
---
```

> [!NOTE]
> The `github` tool entry tells gh-aw to start the GitHub MCP server in proxy mode. The agent can then call GitHub tools — listing issues, fetching commits, reading file contents — scoped to the permissions you've declared above.

### 3. Reference the tools in your task brief

Below the frontmatter, update the task brief to tell the agent it can use the MCP tools:

```markdown
You have access to GitHub tools via MCP. Use them to:
1. Fetch the last 5 commits on the default branch.
2. List all open issues labelled `bug`.
3. Write a concise daily summary combining both.
Post the summary as a new issue titled "Daily Status — {today's date}".
```

The agent will read this brief, decide which MCP tool calls to make, and weave the results into its final output — all without you scripting each API call manually.

### 4. Validate and push

If you're working locally, compile before pushing:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

<details>
<summary>🖥️ GitHub UI path (no local compile needed)</summary>

1. Navigate to your workflow file on GitHub.
2. Click the **pencil icon (✏️)** to edit it.
3. Paste the updated frontmatter.
4. Click **Commit changes**.
5. Trigger the workflow manually under **Actions → Daily Status Report → Run workflow** and check the run log for MCP tool calls.

</details>

### 5. Watch the agent reason

Open the run log in **Actions**. You'll see the agent interleaving tool calls with its reasoning — it fetches data, processes it, then produces the summary. That's the agentic loop in action.

## ✅ Checkpoint

- [ ] Your frontmatter has a `tools:` block with `github: mode: gh-proxy`
- [ ] Your task brief mentions what the agent should do with the tools
- [ ] A manual run completes and the log shows at least one MCP tool call
- [ ] The workflow output reflects live data retrieved via MCP, not just static text

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
