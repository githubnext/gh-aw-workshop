# Control Outbound Network Access with the Workflow Firewall

> _Locking down which domains your workflow can reach is the single most effective way to contain a misdirected or compromised agent._

## 🎯 What You'll Do

Add a `network:` block to your agentic workflow so the runner only allows outbound connections to the domains your workflow actually needs. You will declare an allowlist, verify the firewall log in a run artifact, and understand when to widen or narrow that list.

## 📋 Before You Start

- You have a working agentic workflow file committed to your repository (completed [Step 11](11a-build-daily-status.md) or equivalent).
- You are comfortable editing YAML frontmatter (see [Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md) if needed).
- **Enterprise teams:** confirm your self-hosted runners have outbound internet access to the domains you plan to allow (see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)).

## Steps

### Understand why the firewall matters

Every agentic workflow run talks to external services: the AI model API, GitHub APIs, and any MCP servers you have configured. Without an explicit allowlist, the agent can make outbound calls to any domain — useful in development but a security gap in production.

The `network.allowed-domains` field restricts outbound connections at the runner level. If the agent or a tool tries to call a domain that is not on the list, the connection is blocked and the attempt appears in the run's `firewall.md` artifact.

> [!TIP]
> Treat your allowlist as a form of documentation: it tells reviewers exactly which external services your workflow depends on.

### Add the network block to your workflow frontmatter

Open your workflow file (for example, `daily-status.md`) and add a `network:` section inside the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * 1-5"
  workflow_dispatch:
permissions:
  contents: read
  issues: write
network:
  allowed-domains:
    - api.githubcopilot.com
    - github.com
    - api.github.com
---
```

Replace the domain list with the ones your workflow actually needs. Common entries:

| Service | Domain to allow |
|---------|----------------|
| GitHub Copilot model | `api.githubcopilot.com` |
| GitHub REST API | `api.github.com` |
| GitHub main site | `github.com` |
| Anthropic Claude | `api.anthropic.com` |
| OpenAI | `api.openai.com` |
| Custom MCP server | your server's hostname |

Commit the updated frontmatter, then compile:

```bash
gh aw compile
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to your workflow file in the repository.
2. Click the **pencil icon (✏️)** to edit it.
3. Add the `network:` block to the YAML frontmatter between the `---` fences.
4. Click **Commit changes**.
5. GitHub Actions will compile the updated file automatically when the workflow next runs.

</details>

### Run the workflow and inspect the firewall log

Trigger a manual run from the **Actions** tab. When it completes, click the run summary and scroll to **Artifacts**. Download `firewall.md` (or open it in the Actions log viewer).

The artifact lists every outbound connection attempt and whether it was **allowed** or **blocked**. If a legitimate service was blocked, add its domain to `allowed-domains` and rerun. If an unexpected domain was blocked, investigate before allowing it.

> [!NOTE]
> If `firewall.md` is missing, your runner may not support the network firewall feature. Check your runner version and the [Network Permissions reference](https://github.github.com/gh-aw/reference/network/).

### Narrow the allowlist over time

Start with a permissive list and tighten it after a few successful runs. The firewall log shows exactly which domains were contacted — use that data to remove any entries that never appear.

Enterprise teams often lock down the list to a corporate proxy domain (`proxy.corp.example.com`) and nothing else, letting the proxy handle external routing under existing security policy.

## ✅ Checkpoint

- [ ] Your workflow frontmatter contains a `network.allowed-domains` block
- [ ] The compiled `.lock.yml` file reflects the new `network:` section
- [ ] You triggered a manual run and found the `firewall.md` artifact in the run summary
- [ ] The artifact shows all expected domains as **allowed** and no unexpected blocked domains
- [ ] You can explain what happens when an agent tries to call a domain not on the allowlist
- [ ] Enterprise teams: you verified the allowlist matches your organisation's outbound proxy or security policy

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Network Permissions reference](https://github.github.com/gh-aw/reference/network/)
- [Side Quest: Token and Secret Exfiltration in Agentic Workflows](side-quest-16-03-token-exfiltration.md)
- [Side Quest: Supply Chain Attacks via MCP Tool Servers](side-quest-17-05-supply-chain-mcp.md)
- [Side Quest: Audit Reference — Artifacts, Firewall Logs, and Report Contents](side-quest-25-01-audit-reference.md)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
