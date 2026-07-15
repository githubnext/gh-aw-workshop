# Lock Down Your Workflow's Network Access

> _Controlling which domains your agent can reach is the fastest way to prevent data exfiltration and satisfy enterprise security reviews._

## 🎯 What You'll Do

Add a `network:` block to your agentic workflow's frontmatter that restricts outbound traffic to a named list of domains. By the end of this step your workflow will only be able to talk to the hosts you explicitly approve — nothing else.

## 📋 Before You Start

- You have a working agentic workflow file (`.github/workflows/daily-status.md` or similar). If not, start from [Build Your First Agentic Scenario](11a-build-daily-status.md).
- Optional: read [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) if your enterprise uses self-hosted runners — network policy interacts closely with runner egress configuration.

## Steps

### Understand the network firewall

Every agentic workflow runs inside a lightweight firewall that logs all outbound HTTP/HTTPS requests. By default the firewall operates in **audit mode** — it records what the agent tries to reach but does not block anything.

When you add a `network:` block, the firewall switches to **enforce mode** and blocks any domain not on your allow-list. This gives security teams a verifiable record of what the agent is permitted to do.

### Open your workflow file for editing

<details>
<summary>🖥️ GitHub UI path</summary>

1. In your repository on GitHub, navigate to `.github/workflows/daily-status.md`.
2. Click the **pencil icon (✏️)** to open the editor.
3. Edit the frontmatter as shown in the next section.
4. Click **Commit changes** when you are done.

</details>

Or open the file in your editor locally.

### Add the `network:` block

In the YAML frontmatter (between the opening and closing `---`), add a `network:` section. Place it alongside your existing `permissions:` and `on:` blocks:

```yaml
---
name: Daily Status Report
on:
  workflow_dispatch:
  schedule:
    - cron: '0 9 * * 1-5'

permissions:
  contents: read

network:
  allowed:
    - api.github.com
    - github.com
    - models.inference.ai.azure.com

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/agentic-workflow@v1
---
```

> [!NOTE]
> `models.inference.ai.azure.com` is the default endpoint for the Copilot-powered model. If your enterprise uses a different model endpoint — for example, a self-hosted Azure OpenAI instance — replace this value with the hostname your admin provides.

The `allowed` list is exact-hostname matching (no wildcards by default). Only the domains you list will be reachable; everything else is blocked and recorded in the firewall artifact.

### Identify which domains your workflow needs

Not sure which domains to allow? Run the workflow **once without** the `network:` block and then check the firewall artifact:

1. Open the completed Actions run.
2. Click **Summary**, then scroll to **Artifacts**.
3. Download the `firewall` artifact — it is a JSON log of every outbound domain the agent contacted.
4. Add those hostnames to `allowed-domains`.

This audit-then-enforce pattern lets you build the minimal allow-list from real traffic rather than guessing.

### Common domains by use case

| Use case | Domains to add |
|----------|---------------|
| GitHub API reads | `api.github.com` |
| Raw file access | `raw.githubusercontent.com` |
| Copilot model (default) | `models.inference.ai.azure.com` |
| MCP server (Docker Hub) | `registry-1.docker.io`, `auth.docker.io` |
| Custom MCP server | hostname of your MCP server |

### Commit and validate

After editing, compile and commit the file:

```bash
gh aw compile daily-status
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add network firewall allow-list"
git push
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

If you edited through the UI and committed there, GitHub Actions will pick up the change automatically. You can skip the terminal steps above and trigger a manual run to verify.

</details>

### Verify enforcement in a run

Trigger a manual run (**Actions → Daily Status Report → Run workflow**). When the run finishes:

1. Open the run summary.
2. Download the `firewall` artifact.
3. Confirm every logged request shows `allowed: true`.
4. Any blocked request appears as `allowed: false` with the attempted domain — add it to the list if it is legitimate.

## ✅ Checkpoint

- [ ] Your workflow frontmatter has a `network.allowed-domains` block
- [ ] The list includes at minimum `api.github.com` and your model endpoint
- [ ] A manual run completed successfully with no blocked requests
- [ ] You downloaded the firewall artifact and confirmed all domains show `allowed: true`
- [ ] You can explain the difference between audit mode (no `network:` block) and enforce mode (with `network:` block)
- [ ] You know which domains to add if you later connect an MCP server

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Side Quest: Security Architecture of Agentic Workflows](side-quest-17-02-security-architecture.md)
- [Side Quest: Supply Chain Attacks via MCP Tool Servers](side-quest-17-05-supply-chain-mcp.md)
- [Network firewall reference](https://github.github.com/gh-aw/reference/network/)
