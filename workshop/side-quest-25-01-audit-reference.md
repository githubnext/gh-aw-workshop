<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Audit Reference — Artifacts, Firewall Logs, and Report Contents

> _A detailed companion to [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md). Use this side quest when you want to understand the full contents of an audit report or dig into individual artifact files._

## 📋 Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and have at least one workflow run ID to work with.
- `gh aw` is installed and authenticated (see [Install the gh-aw CLI Extension](06-install-gh-aw.md)).

## [gh aw audit](https://github.github.com/gh-aw/reference/audit/#gh-aw-audit) report anatomy

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

## Adding a blocked domain to [network.allow](https://github.github.com/gh-aw/reference/network/#configuration)

If the firewall blocked a domain your workflow needs, add it to `network.allow` in your workflow frontmatter and recompile:

```yaml
network:
  allow:
    - api.example.com
```

Share the allowed-domains list from a successful run with your enterprise security team as a ready-made firewall allowlist.

## Try it yourself

### Run an audit on a recent run

Open the **Actions** tab in your repository, click a completed workflow run, and copy the run ID from the URL (the number after `/runs/`). Then run:

```bash
gh aw audit <run-id>
```

Sample output:

```text
## Audit Report

**Workflow:** daily-status
**Trigger:** schedule
**Engine:** copilot
**Model:** gpt-4o

| Metric       | Value |
|---|---|
| Agent AIC    | 42    |
| ⌖ AIC        | 3     |
| MCP calls    | 7     |
| Threat verdict | none |
```

- [ ] I found a run ID from the Actions tab
- [ ] The report shows the workflow name, trigger, and model
- [ ] The ⌖ AIC figure appears separately from Agent AIC
- [ ] The threat verdict shows `none` (or I noted what was flagged)

### Explore the parsed agent log

Add `--parse` to write `log.md` and `firewall.md` alongside the raw artifacts:

```bash
gh aw audit <run-id> --parse
```

Open `log.md` in your editor. Each section represents one agent turn and lists the tool calls in order.

- [ ] `log.md` and `firewall.md` were created in `.github/aw/logs/<run-id>/`
- [ ] I found the first MCP tool call in `log.md`
- [ ] I wrote one sentence describing what the agent was trying to accomplish in that turn
- [ ] I checked `agent_usage.json` for the total token count

### Inspect the firewall summary

`firewall.md` groups outbound network calls into allowed and blocked lists. Scan it to confirm your workflow only contacted expected domains:

- [ ] I opened `firewall.md` and identified at least one domain the workflow accessed
- [ ] If any domains are blocked, I know to add them to `network.allow` in the workflow frontmatter
- [ ] I can distinguish the formatted `firewall.md` from the raw records in `sandbox/firewall/audit/`

## ✅ Checkpoint

- [ ] You can identify the five files inside the agent artifact and what each contains
- [ ] You understand what ⌖ AIC represents and how it differs from agent AIC
- [ ] You can use `firewall.md` to identify blocked domains and add them to `network.allow`
- [ ] You know what the threat detection verdict checks for
- [ ] You ran `gh aw audit` on a real run and reviewed the generated report
- [ ] You used `--parse` to produce `log.md` and read at least one tool call

<!-- journey: all -->
Return to [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
<!-- /journey -->


