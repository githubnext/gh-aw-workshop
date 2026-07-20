---
journey: all
adventure: side-quest
---
# Side Quest: How MCP Tool Servers Work

> _Optional: work through this primer after [Step 17](17-add-mcp-tools.md) if you want to understand how MCP changed your workflow's agentic loop, then continue to the next step._

## 📋 Before You Start

- You have completed [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
- You have a workflow YAML file open in your editor.

By default, a gh-aw agent reads your task brief and produces text. **MCP (Model Context Protocol)** breaks that boundary — it lets the agent call structured tools at runtime and incorporate real data into its output.

---

## What is MCP?

**Model Context Protocol** is an open standard originally developed by Anthropic that defines a uniform way for AI models to call external tools. Instead of building a custom integration for every API you want the agent to use, MCP gives you a single protocol. A server speaks MCP; the agent calls it. That's the whole contract.

A tool server is a process that:

1. Advertises a list of named operations (tools) with typed inputs and outputs.
2. Runs those operations on demand when the agent calls them.
3. Returns structured results the agent can reason about.

The GitHub MCP server, for example, advertises tools like `list_issues`, `get_pull_request`, `list_commits`, and dozens of others. When the agent calls `list_issues`, the server makes the GitHub API request and hands the result back.

---

## How the agentic loop changes

Without MCP, the agent loop looks like this:

```
Read brief → Generate response → Done
```

With MCP enabled, the loop becomes iterative:

```
Read brief
  → Decide which tools to call
  → Call tool(s) → Receive results
  → Reason about results
  → Call more tools if needed
  → Generate final response
```

The agent can interleave tool calls with its reasoning as many times as it needs. It decides _which_ tools to call and _when_ — you don't script that in the brief. You just tell the agent what outcome you want.

---

## Hands-On Exercise

Open your workflow's YAML frontmatter. Does it have a `tools:` block? If yes, identify which MCP server is configured and write it in the space below or in a scratch comment in the file.

```text
Configured MCP server:
```

---

## What the `tools:` frontmatter block does

The `tools:` block in your workflow's YAML frontmatter tells gh-aw which MCP servers to start before the agent runs:

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

| Field | What it controls |
|-------|-----------------|
| `tools:` | Parent key. Lists every tool server the agent may use. |
| `github:` | Starts the GitHub MCP server. The agent can now call GitHub API tools. |
| `mode: gh-proxy` | Routes all GitHub tool calls through a security proxy that enforces the `permissions` block. The agent cannot exceed the scopes you declared. |
| `toolsets: [default]` | Specifies which groups of tools to expose. `default` includes issues, PRs, commits, and Actions. |

> [!NOTE]
> You can have multiple entries under `tools:` if you want to connect more than one MCP server. Each entry starts a separate server process.

If you're working locally, run this command to confirm your `tools:` block has no schema errors:

```bash
gh aw validate
```

---

## How toolsets work

A toolset is a named subset of the tools a server provides. Toolsets let you grant the agent access to only the tools it needs — reducing the surface area for unintended behavior.

The GitHub MCP server ships with these toolsets:

| Toolset | What it includes |
|---------|-----------------|
| `default` | Issues, pull requests, commits, Actions runs, file contents |
| `discussions` | Repository discussions and comments |
| `code_security` | Dependabot alerts, code scanning alerts |

To enable multiple toolsets, pass a list:

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default, discussions]
```

---

## Reading MCP tool calls in the Actions log

When you run a workflow with MCP enabled, the Actions log shows each tool call the agent makes. Look for lines like:

```
[tool_use] list_issues  {"owner":"…","repo":"…","state":"open"}
[tool_result] list_issues  → 7 issues returned
```

This trace is the agentic loop made visible. You can see:

- **Which tools the agent chose** — useful for verifying it's doing what you intended.
- **What parameters it passed** — helpful for debugging incorrect or unexpected API calls.
- **What results it received** — confirms the live data the agent used to build its output.

If the agent makes a tool call you didn't expect, revisit your task brief. Adding more specific instructions about which tools to use (or which to avoid) shapes the agent's decisions without requiring code changes.

---

## Trust and Security Concepts

Because MCP tool servers receive and return data at runtime, a few security concepts apply specifically to this environment. You will encounter them in the [Supply Chain Attacks via MCP](side-quest-17-05-supply-chain-mcp.md) side quest.

**Supply chain attack through MCP** — occurs when a tool server your agent trusts returns manipulated data instead of the real thing. Rather than compromising your workflow file directly, an attacker targets the tool server, so the same workflow file can produce harmful results.

**Poisoned payload** — the manipulated data a compromised tool server returns. It may be fabricated data (such as fake issue lists) or embedded instructions that redirect the agent to take unintended actions.

**Blast radius** — the scope of damage a successful attack can cause. For MCP-based agents, the blast radius is larger than a traditional dependency vulnerability because the payload is interpreted by an AI model that may act on embedded instructions.

---

## ✅ Checkpoint

- [ ] You can explain what an MCP tool server is and what it provides to the agent
- [ ] You understand how enabling MCP changes the agentic reasoning loop
- [ ] You located the `tools:` block in your workflow and identified the MCP server name
- [ ] You know what each field in the `tools:` frontmatter block does
- [ ] You know how to use toolsets to limit the agent's tool access
- [ ] You know where to find MCP tool calls in the Actions log

---

<!-- journey: all -->
Return to [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
<!-- /journey -->

## 📚 See Also

- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
- [GitHub Tools read permissions](https://github.github.com/gh-aw/reference/permissions/)
- [Network Permissions](https://github.github.com/gh-aw/reference/network/)
- [Security Architecture](https://github.github.com/gh-aw/introduction/architecture/)
