# Side Quest: Supply Chain Attacks via MCP Tool Servers

> _A compromised MCP tool server can feed poisoned data back to your agent — gh-aw's network allow-list and version pinning shrink the window for this attack._

## The Attack

A supply chain attack through MCP happens when a tool server your agent trusts returns
manipulated data instead of the real thing. Imagine your daily-status workflow calls a
third-party MCP server to fetch issue data, but that server has been compromised. It
returns a fabricated list of issues — or worse, it injects extra instructions into its
response that redirect your agent to take unintended actions. Your workflow follows the
poisoned instructions without you knowing anything changed.

## Why This Matters for Agentic Workflows

Classic CI/CD pipelines are deterministic: a build script runs the same commands every
time, and the output is predictable. An agentic workflow is different — the agent
decides what to do next based on what tools return. If a tool lies, the agent acts on
the lie. The agent cannot tell the difference between a trustworthy tool result and a
crafted one unless the workflow author has constrained what the tool can reach and
locked down which version of the tool server runs.

MCP multiplies this risk because the agent calls tools dynamically. A compromised server
sitting behind a trusted domain name can serve poisoned payloads to every workflow that
connects to it. The blast radius is larger than a traditional dependency vulnerability,
because the payload is interpreted by an AI model that may follow the embedded
instructions.

## How AW Defends Against It

- **Network allow-list (`network.allowed-domains`)** — the runner blocks outbound
  connections to any domain not listed. An attacker cannot redirect your agent to an
  unknown exfiltration endpoint even if the MCP server tries.
- **Explicit `tools:` block** — you declare exactly which MCP servers the agent may
  use. The runtime refuses to start unlisted servers.
- **Minimal permissions** — even if a tool server returns an instruction like "delete
  all issues", the agent can only act within the `permissions:` you declared. A
  `contents: read` workflow cannot commit anything the tool tells it to.
- **`safe-outputs` constraints** — the agent's visible output surface (PR comment,
  issue body, etc.) is declared up-front. Injected instructions that say "post this
  secret to a webhook" hit a hard boundary.

Example of a well-constrained MCP configuration:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * 1-5"
permissions:
  contents: read
  issues: read
network:
  allowed-domains:
    - api.github.com
    - github.com
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
safe-outputs:
  issue-comment:
    repo: ${{ github.repository }}
---
```

This configuration means the agent can only reach `api.github.com` and `github.com`,
can only read contents and issues, and can only write to an issue comment. A poisoned
MCP response that tries to call home to another domain or commit code is silently
blocked at each layer.

> See [Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md)
> for the full security model.

## What You Can Do as a Workflow Author

- [ ] List only the MCP servers you actually need in the `tools:` block — remove any
      you added "just in case".
- [ ] Add a `network.allowed-domains` block that names only the domains your workflow
      legitimately contacts.
- [ ] Set `permissions:` to the minimum scope required (prefer `read` over `write`
      unless the task requires writing).
- [ ] Pair any `write` permission with a matching `safe-outputs` entry so every write
      action is declared and constrained.
- [ ] Treat unusual tool responses as suspicious — if your workflow output suddenly
      looks very different, check the raw log for unexpected instructions in tool
      results.

## ✅ Checkpoint

- [ ] I can describe the supply chain via MCP attack in one sentence
- [ ] I can name the gh-aw features that limit this attack (`network.allowed-domains`, `tools:` block, `permissions:`, `safe-outputs`)
- [ ] I have applied at least one defensive measure to my own workflow

Return to [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
