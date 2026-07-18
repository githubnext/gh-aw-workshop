# Restrict Your Agent's Network Access with the Built-in Firewall

> _Limit exactly which domains your agent can reach — a lightweight but powerful enterprise security control._

## 🎯 What You'll Do

Enable and configure the gh-aw network firewall for your daily-status workflow. By the end of this step, your workflow will only be permitted to contact a declared set of domains. Any unexpected outbound call is blocked and logged — giving security teams a clear audit trail.

## 📋 Before You Start

- You have a workflow running and can read its logs ([Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)).
- You understand gh-aw frontmatter ([Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)).

## Steps

### Understand what the firewall does

gh-aw runs your agent inside a network sandbox. When the firewall is on, all outbound HTTP and HTTPS traffic is routed through a proxy that:

1. Checks every request against your allowlist.
2. **Allows** requests to listed domains.
3. **Blocks** everything else and writes a line to the firewall log artifact.

This means a prompt-injected instruction such as "send the output to attacker.example" is blocked at the network layer, not just by the agent's reasoning. It also means you can prove to auditors exactly what external services your workflow contacted.

> [!NOTE]
> The firewall applies to agent-initiated HTTP calls (tool calls, MCP server requests, model API calls). It does not affect GitHub Actions runner network access outside the agent's context.

### Read the current firewall log

Before you add any allowlist, run your workflow once and download the firewall artifact to see which domains the agent already contacts:

```bash
gh run list --workflow daily-status.lock.yml --limit 1
gh run download <run-id> --name firewall
cat firewall/firewall.jsonl | jq '.domain' | sort -u
```

This tells you the minimum set of domains to allow.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Go to **Actions** in your repository and open the most recent **daily-status** run.
2. Under **Artifacts**, download the **firewall** artifact.
3. Open `firewall.jsonl` in any text editor. Each line is a JSON object — look at the `domain` field.

</details>

### Add an allowlist to your workflow frontmatter

Open your `daily-status.md` workflow file and add a `network` block inside the frontmatter:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 8 * * 1-5"
  workflow_dispatch:

permissions:
  contents: read
  issues: write

network:
  allowed-domains:
    - api.github.com
    - models.inference.ai.azure.com
---
```

Replace `models.inference.ai.azure.com` with the domain shown in your firewall log for model calls. GitHub Models users typically see this domain; Copilot users will see a different endpoint.

> [!TIP]
> Use the fewest domains possible. Start with what the log shows, then add more only if a run fails because of a new blocked domain.

### Compile and push

After editing the frontmatter, recompile:

```bash
gh aw compile daily-status
git add daily-status.md daily-status.lock.yml
git commit -m "chore: enable network firewall allowlist"
git push
```

<details>
<summary>🖥️ GitHub UI alternative for editing</summary>

1. Open `daily-status.md` in your repository and click the **pencil icon (✏️)**.
2. Add the `network:` block to the frontmatter.
3. Click **Commit changes**.
4. Because compile is terminal-only, wait for the next workflow run — if the `.lock.yml` is out of date, GitHub Actions will surface a compile error in the run log and you can fix it there.

</details>

### Verify the firewall is active

Trigger a manual run and open the logs:

```bash
gh workflow run daily-status.lock.yml
gh run watch
```

In the **firewall** artifact of the completed run, every line should show `"allowed": true`. If any line shows `"allowed": false`, the blocked domain was not in your list — add it or investigate why the agent tried to reach it.

## ✅ Checkpoint

- [ ] You downloaded the firewall artifact from a run and identified the domains your agent contacts
- [ ] You added a `network.allowed-domains` list to your workflow frontmatter
- [ ] You compiled the updated workflow with `gh aw compile` and pushed (or committed via the UI)
- [ ] A new run completed with no blocked domains in the firewall log
- [ ] You can explain to a colleague why a network allowlist is useful in an enterprise environment

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Network reference](https://github.github.com/gh-aw/reference/network/)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Side Quest: Audit Reference — Artifacts, Firewall Logs, and Report Contents](side-quest-25-01-audit-reference.md)
- [Side Quest: Security Architecture](side-quest-17-02-security-architecture.md)
- [Side Quest: Prompt Injection](side-quest-17-03-prompt-injection.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
