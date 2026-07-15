# Side Quest: Supply Chain Attacks via MCP Tool Servers

> _A compromised MCP tool server can feed poisoned data back to your agent. Your job is to spot the trust boundary early and keep the workflow's write surface narrow._

## 📋 Before You Start

- Completed Side Quest: [How MCP Tool Servers Work](side-quest-17-01-mcp-concepts.md)
- You have a workflow with a `tools:` block already configured.

## The Risk in One Sentence

A supply chain attack through MCP starts when you trust a tool server, package, or image that can change outside your repository, and that server returns data your agent treats as real.

## Attack surface at a glance

Use this table as a quick threat model when you add or review an MCP server.

| Attack type | How it works | Detection signal |
| --- | --- | --- |
| Typosquatted package | A package name looks familiar, but the publisher or package is not the one you meant to install. | The name is close to a trusted tool, but the publisher is unfamiliar. |
| Compromised server or image | A real server or container starts returning altered results after the publisher account or registry is compromised. | The config uses a mutable tag such as `latest`, or a remote endpoint with no version pin. |
| Tool poisoning | The server exposes more tools than your task needs, so a bad response has more ways to steer the agent. | The tool list is broad, vague, or includes an "everything" style toolset. |
| Output injection | The server returns normal-looking data with hidden instructions mixed into the result. | Tool output suddenly contains directives such as "ignore previous instructions" or asks for extra actions. |

## ✏️ Exercise: Inspect This `.mcp.json`

Read this fictional config and look for the warning signs from the attack-surface table above.

```json
{
  "mcpServers": {
    "github-agentic-workflows": {
      "type": "local",
      "command": "gh",
      "args": ["aw", "mcp-server"]
    },
    "inventory-audit": {
      "type": "remote",
      "url": "https://tools.example.dev/mcp",
      "publisher": "octo-tools-preview"
    }
  }
}
```

- [ ] Which entry would you question first?
- [ ] What makes it risky?

<details>
<summary>Review your answer</summary>

`inventory-audit` is the suspicious entry. It points to a remote URL with no pinned version, and the publisher name is not one you have already verified in your workflow or the tool's documentation.

Before you trust a server like this, verify who publishes it, confirm the expected URL from official docs, and pin the exact package, image digest, or release version you intend to run.

</details>

## Three Habits That Lower the Risk

Adopt these habits when you work with MCP servers:

1. **Pin the server you run.** Prefer a specific version or image digest over a mutable default like `latest`.
2. **Restrict permissions and outputs.** Keep `permissions:` minimal and declare only the write surfaces you actually need in `safe-outputs`.
3. **Audit tool names before you add them.** Confirm the publisher, verify the expected server name, and keep the tool list narrow.

gh-aw helps by making you declare `tools:` explicitly, limit network destinations with `network.allowed`, and narrow what the workflow can write with `permissions:` and `safe-outputs`.

Further reading:

- [Side Quest: Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md)
- [Side Quest: Output Injection via Safe Outputs](side-quest-17-06-output-injection.md)

## ✅ Checkpoint

- [ ] I can describe the MCP supply chain risk in one sentence
- [ ] I can use the attack-surface table to spot at least one detection signal
- [ ] I identified the suspicious `.mcp.json` entry and explained why it is risky
- [ ] I applied at least one of the three hardening habits to my own workflow

Return to [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).

## 📚 See Also

- [Security Architecture](https://github.github.com/gh-aw/introduction/architecture/)
- [Network Permissions](https://github.github.com/gh-aw/reference/network/)
- [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/)
- [Safe Outputs](https://github.github.com/gh-aw/reference/safe-outputs/)
