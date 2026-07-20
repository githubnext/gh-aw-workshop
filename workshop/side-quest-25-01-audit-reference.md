---
journey: all
adventure: side-quest
---
# Side Quest: Audit Reference — Artifacts, Firewall Logs, and Report Contents

> _A detailed companion to [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md). Use this side quest when you want to understand the full contents of an audit report or dig into individual artifact files._

## gh aw audit report anatomy

`gh aw audit` generates a Markdown report that covers:

- **Run metadata** — workflow name, trigger, engine, and model
- **Agent AIC** — total AI Credits consumed by the agent turn
- **Threat-detection AIC (⌖ AIC)** — credits consumed by the firewall's threat-detection model, reported separately from agent inference
- **MCP tool calls** — each tool the agent invoked, with any errors
- **Threat detection verdict** — whether prompt injection, secret leak, or malicious patch was detected
- **Safe outputs** — every safe-output declaration the agent emitted

## Artifact files explained

### Agent artifact

The `agent` artifact — downloaded by both `gh aw logs --artifacts all` and `gh aw audit` — contains the full record of what the agent did.

| File | What it tells you |
|---|---|
| `safeoutputs.jsonl` | Every safe-output declaration the agent emitted |
| `mcp-logs/` | One log file per MCP server, listing every tool call and result |
| `sandbox/firewall/audit/` | Domain-level network access log (raw data) |
| `agent_usage.json` | Token usage for the agent turn |

### Parsed log files (--parse)

When you run `gh aw audit <run-id> --parse`, two readable files are written alongside the raw artifacts:

- `log.md` — the full agent conversation formatted as Markdown
- `firewall.md` — a formatted summary of outbound network access (allowed and blocked domains)

Use `firewall.md` to quickly identify blocked domains. For raw domain-level records, look inside `sandbox/firewall/audit/` in the agent artifact.

## AIC billing details

AIC (AI Credits) is the billing unit for agentic workflow inference and is derived from token consumption. Exact billing figures appear in your GitHub billing dashboard.

The **⌖ AIC** column in `gh aw logs` output shows credits consumed by the threat-detection model separately from the main agent turn. Both contribute to your organisation's total AIC usage.

## Adding a blocked domain to network.allow

If the firewall blocked a domain your workflow needs, add it to `network.allow` in your workflow frontmatter and recompile:

```yaml
network:
  allow:
    - api.example.com
```

Share the allowed-domains list from a successful run with your enterprise security team as a ready-made firewall allowlist.

## ✅ Checkpoint

- [ ] You can identify the five files inside the agent artifact and what each contains
- [ ] You understand what ⌖ AIC represents and how it differs from agent AIC
- [ ] You can use `firewall.md` to identify blocked domains and add them to `network.allow`
- [ ] You know what the threat detection verdict checks for

Return to [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
