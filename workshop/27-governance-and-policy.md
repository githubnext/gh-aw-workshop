---
journey: all
adventure: advanced
---
# Govern Your Agentic Workflows

> _Agentic workflows that run unattended need clear guardrails — governance turns good intentions into enforceable policy._

## 🎯 What You'll Do

Review the governance levers available in gh-aw and apply at least one to your existing workflow: permission scoping, network firewall rules, or a required reviewer. You will finish with a workflow that is ready for team or enterprise use.

## 📋 Before You Start

- You have a running agentic workflow from [Schedule It to Run Every Day](13-schedule-it.md) or any of the build steps (11a–11d).
- You have editor access to the workflow's `.md` file.

## Steps

### Understand the three layers of governance

Governance in gh-aw works at three levels.

| Layer | What it controls | Frontmatter key |
|-------|-----------------|----------------|
| **Permissions** | Which GitHub APIs the agent can call | `permissions:` |
| **Network firewall** | Which external hosts the agent can reach | `network:` |
| **Safe outputs** | Which write operations the agent can perform | `safe-outputs:` |

Start with permissions — it has the biggest impact for the least effort.

### Scope your workflow permissions

Open your workflow's `.md` file and find (or add) a `permissions:` block. Replace any over-broad grants with only what the workflow actually needs.

A typical read-only status report needs:

```yaml
permissions:
  contents: read
  issues: read
  pull-requests: read
```

A workflow that posts comments needs `issues: write` as well. Resist the temptation to add `write-all` for convenience — it grants the agent write access to every API.

> [!TIP]
> Start with `read` for every scope. Add `write` only when you see a safe-output failure that requires it.

### Add a network firewall rule

If your workflow calls external APIs (such as a data source from [Connect a Live Data Source](16-connect-data-source.md)), lock down outbound traffic with an `allowed-domains` list.

```yaml
network:
  allowed-domains:
    - api.github.com
    - ghcr.io
```

The firewall blocks all other outbound requests by default when `allowed-domains` is present. This prevents a malicious prompt from exfiltrating data to an unexpected host.

> [!NOTE]
> You can review which domains your workflow actually contacted by downloading the `firewall` artifact from a completed run in the Actions tab.

### Require a reviewer for sensitive write operations

For workflows that post issues or open PRs, add a **required reviewer** via GitHub's environment protection rules. Go to **Settings** → **Environments**, create an environment (e.g., `production`), enable **Required reviewers**, and add yourself or a team. Then add `environment: production` to your workflow's job block. Every run will pause for human approval before writing.

### Compile and push your changes

After updating the frontmatter, recompile the lock file and push both files together.

```bash
gh aw compile
git add .github/workflows/your-workflow.md .github/workflows/your-workflow.lock.yml
git commit -m "chore: tighten permissions and add network firewall"
git push
```

> [!TIP]
> UI-first learners: edit the `.md` file in the GitHub editor and commit. Actions will recompile on the next run, or trigger `workflow_dispatch` immediately.

### Trigger a manual run and verify

Go to **Actions** → your workflow → **Run workflow**. After the run completes, open the run summary and confirm it succeeded. Download the **firewall** artifact and verify only expected domains appear. Check the run log's **Permissions** section — it should match your frontmatter.

## ✅ Checkpoint

- [ ] Your workflow's `permissions:` block lists only the scopes it actually needs
- [ ] You added or reviewed a `network: allowed-domains` list (or confirmed none is needed for your workflow)
- [ ] You can explain what the firewall artifact contains and where to find it
- [ ] A manual run completed successfully after your governance changes

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->

For more details, see [Governance guide](https://github.github.com/gh-aw/guides/governance/), [Permissions reference](https://github.github.com/gh-aw/reference/permissions/), [Network reference](https://github.github.com/gh-aw/reference/network/), [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md), and [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).
