# Audit and Monitor Your Agentic Workflows

> _Knowing what your agent did — and proving it — is what turns a useful automation into a trustworthy one._

## 🎯 What You'll Do

You will use the `gh aw logs` and `gh aw audit` commands to read the built-in artifacts that every agentic workflow run produces, understand token usage, and identify the audit trail your organisation needs for enterprise compliance. You will also learn to bring audit output to an agent using the `/agentic-workflows` Copilot skill to debug unexpected behavior and iterate on your workflow. By the end you will know exactly where to look when a run behaves unexpectedly or when a compliance review asks what the agent did.

## 📋 Before You Start

- Your workflow runs successfully (see [Test and Iterate on Your Workflow](12-test-and-iterate.md)).
- `gh aw` is installed and authenticated (see [Install the gh-aw CLI Extension](06-install-gh-aw.md)).

## Steps

### Review recent runs with gh aw logs

`gh aw logs` downloads artifacts from your workflow's recent runs and prints a summary table showing duration, token usage, and cost in AI Credits (AIC).

Run it from inside your repository:

```bash
gh aw logs <your-workflow-id>
```

Replace `<your-workflow-id>` with the basename of your workflow file (for example, `daily-status` for `daily-status.md`).

The summary table shows one row per run. Key columns:

| Column | What it tells you |
|---|---|
| AIC | Total AI Credits consumed by the agent |
| ⌖ AIC | Credits used by threat detection |
| Model | The AI model that ran the agent |
| Conclusion | Whether the run succeeded |

To download all artifacts — including the agent conversation, firewall log, and MCP tool calls — add `--artifacts all`:

```bash
gh aw logs <your-workflow-id> --artifacts all
```

Downloaded files land in `.github/aw/logs/<run-id>/` by default.

### Audit a specific run with gh aw audit

When you need a deeper look at one run — for debugging or compliance evidence — use `gh aw audit` with the run ID or URL from the Actions tab:

```bash
gh aw audit <run-id>
```

This downloads all artifacts for that run and generates a concise Markdown report covering:

- Run metadata: workflow, trigger, engine, model
- Agent AIC and threat-detection AIC
- MCP tool calls and any errors
- Threat detection verdict (prompt injection, secret leak, malicious patch)
- Safe outputs declared by the agent

To also parse the raw agent and firewall logs into readable Markdown:

```bash
gh aw audit <run-id> --parse
```

This writes `log.md` (agent conversation) and `firewall.md` (network access summary) to the output directory.

> [!TIP]
> Pass the run URL directly from your browser's address bar — `gh aw audit` accepts both numeric run IDs and full GitHub Actions URLs.

### Debug with an agent and the /agentic-workflows skill

Once you have an audit report, the fastest way to interpret it and improve your workflow is to bring it to an agent. Open GitHub Copilot Chat, then paste the contents of the audit report and describe what puzzled you:

```text
Here is the audit report for my last run. The agent called github.list_issues
three times in a row and the total AIC was higher than I expected.
Help me understand why and suggest how to reduce it.

<paste report here>
```

For more targeted guidance, use the **`/agentic-workflows` skill** in the chat:

```text
/agentic-workflows Here is my audit log. The firewall blocked calls to
api.example.com. Can you help me add the correct network.allow entry?

<paste firewall audit here>
```

The `/agentic-workflows` skill understands agentic workflow frontmatter and
safe-output rules. It can validate your changes, suggest a more efficient prompt,
or walk you through adding a `network.allow` entry — all without you leaving the chat.

> [!TIP]
> For follow-up edits to the workflow file, ask the agent to make the changes directly rather than hand-editing every line. This way the agent runs `gh aw compile` to validate the result before committing.

### Read the agent artifact

The `agent` artifact — downloaded by both `gh aw logs --artifacts all` and `gh aw audit` — contains the full record of what the agent did. After downloading, look for:

| File (inside the agent artifact) | What it tells you |
|---|---|
| `safeoutputs.jsonl` | Every safe-output declaration the agent emitted |
| `mcp-logs/` | One log file per MCP server, listing every tool call and result |
| `sandbox/firewall/audit/` | Domain-level network access log |
| `agent_usage.json` | Token usage for the agent turn |

### Understand the usage artifact

The `usage` artifact contains token consumption broken down by job. It is also summarised in the `gh aw logs` overview table under the **AIC** column.

Use this data to spot unexpectedly long runs, track cost trends over time, and set a budget baseline before enabling a scheduled trigger.

> [!NOTE]
> AIC (AI Credits) is the billing unit for agentic workflow inference and is derived from token consumption. Exact billing figures appear in your GitHub billing dashboard.

### Check the firewall log

The firewall artifact records every outbound domain the agent attempted to reach and whether it was allowed or blocked.

After `gh aw audit <run-id> --parse`, open `firewall.md` for a formatted summary. To scan raw data, look inside `sandbox/firewall/audit/` in the downloaded agent artifact.

If a domain your workflow needs is blocked, add it to `network.allow` in your workflow frontmatter:

```yaml
network:
  allow:
    - api.example.com
```

> [!TIP]
> Share the allowed-domains list from a successful run with your enterprise security team as a ready-made firewall allowlist.

### Browse artifacts in the GitHub UI

If you prefer not to use the CLI, every artifact is also available in the browser:

1. Go to the **Actions** tab in your repository.
2. Click a completed workflow run.
3. Scroll to the **Artifacts** section at the bottom of the run summary page and download the archive you need.

### Retention policy

GitHub retains artifacts for **90 days** by default. For enterprise compliance, ask your GitHub administrator whether a global retention policy overrides this, or whether you need to copy artifacts to external storage for longer-term audit requirements.

> [!NOTE]
> On GitHub Enterprise Server, retention defaults may differ from github.com.

## ✅ Checkpoint

- [ ] You ran `gh aw logs <your-workflow-id>` and read the AIC summary for your workflow
- [ ] You ran `gh aw audit <run-id>` and reviewed the generated report
- [ ] You pasted an audit report into Copilot Chat with the `/agentic-workflows` skill and got actionable feedback
- [ ] You located the `safeoutputs.jsonl` and `mcp-logs/` files in the `agent` artifact
- [ ] You checked the firewall log for blocked domains
- [ ] You can describe what a compliance reviewer would find in the `agent` artifact
- [ ] You know your organisation's artifact retention policy (or know who to ask)

**Next:** [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Network reference](https://github.github.com/gh-aw/reference/network/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
