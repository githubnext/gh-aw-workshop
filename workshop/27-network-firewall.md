# Control Your Workflow's Network Access

> _Every outbound connection your agent makes is a potential risk — declaring exactly which domains are allowed keeps your workflows secure and auditable._

## 🎯 What You'll Do

You'll add a `network:` block to your agentic workflow, understand what the built-in domain presets cover, and narrow the allowlist to only the domains your workflow actually needs.
By the end, your workflow will refuse any connection not on your approved list — a key control for enterprise security reviews.

## 📋 Before You Start

- You have a working agentic workflow from [Write Your First Agentic Workflow](07-your-first-workflow.md).
- If you connected MCP tools in [Give Your Agent More Tools with MCP](17-add-mcp-tools.md), have that workflow file open — you'll extend it here.

## Steps

### Understand the network firewall

Every agentic workflow run includes a built-in **network firewall**. The firewall inspects every outbound connection the agent makes and blocks requests to domains that are not on the allowlist.

If you omit the `network:` block entirely, the firewall uses a default allowlist that covers GitHub and Copilot infrastructure. Your workflow runs, but you have no visibility into — or control over — which domains are reachable.

Declaring `network:` explicitly gives you that control.

### Add a network block to your workflow

Open your workflow file (`daily-status.md` or whichever you are editing) and add a `network:` section to the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily on weekdays
permissions:
  contents: read
  issues: read
network:
  allowed:
    - defaults
---
```

The `defaults` preset approves all domains that GitHub's own infrastructure needs — the Copilot model proxy, the Actions runtime APIs, and similar endpoints. It is the safest starting point for most workflows.

### Use the `github` preset when reading live repository data

If your workflow calls GitHub APIs directly (for example, via the `github` tool or MCP), add the `github` preset alongside `defaults`:

```yaml
network:
  allowed:
    - defaults
    - github
```

The `github` preset adds `api.github.com` and related GitHub endpoints.

> [!TIP]
> Using both `defaults` and `github` covers the vast majority of workshop workflows. Start there and tighten only if a security review requires it.

### Allow a custom domain for external data sources

If your workflow fetches data from an external API (see [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)), add the hostname explicitly:

```yaml
network:
  allowed:
    - defaults
    - github
    - api.example.com
```

Only add domains your workflow actually calls. Every extra entry widens the blast radius if an injected prompt tries to exfiltrate data.

### Compile and verify

After editing the frontmatter, compile the workflow to catch any syntax issues:

```bash
gh aw compile
```

Then trigger a manual run in GitHub Actions (**Actions → your workflow → Run workflow**). In the run log, look for the **Network** section — it lists every domain the agent contacted and confirms each was allowed.

> [!NOTE]
> If a domain is blocked mid-run, the agent receives an error and may retry or report the failure in its output. Review the run log to identify which domain was blocked and decide whether to add it to the allowlist.

### Review the firewall log after a run

The firewall log is saved as an artifact named `firewall` for every run. Download it from the run's **Artifacts** panel or with:

```bash
gh run download <run-id> --name firewall
```

The log shows every allowed and blocked request. Share this artifact with your security team to demonstrate that the workflow only contacted approved endpoints.

## ✅ Checkpoint

- [ ] Your workflow frontmatter includes a `network:` block with at least the `defaults` preset
- [ ] You can explain the difference between the `defaults` and `github` presets
- [ ] You know how to add a custom domain for an external API your workflow calls
- [ ] `gh aw compile` completed without errors after your change
- [ ] You triggered a manual run and found the **Network** section in the run log
- [ ] You can describe where the firewall artifact is saved and how to retrieve it

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Network Permissions reference](https://github.github.com/gh-aw/reference/network/)
- [Side Quest: Agentic Workflow Security Architecture](side-quest-17-02-security-architecture.md)
- [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)
- [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
