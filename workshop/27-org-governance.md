# Govern Agentic Workflows Across Your Organisation

> _Agentic workflows that run autonomously at scale need organisation-level guardrails — this step shows you how to set policies that keep every workflow safe and compliant._

## 🎯 What You'll Do

You will review and apply the three layers of organisation-level governance that matter most for agentic workflows: Copilot access policies, network firewall rules, and safe-outputs write controls. By the end of this step, you will know which settings to configure before rolling out agentic workflows to your wider team.

## 📋 Before You Start

- Your workflow runs successfully (see [Step 12: Test and Iterate](12-test-and-iterate.md)).
- You have a GitHub organisation with Owner or Security Manager permissions — or you can work with someone who does.
- If you are on a self-hosted runner, complete [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) first.

> [!NOTE]
> If you are on a personal `github.com` account with no organisation, read through this step to understand the governance model, then apply the settings when you join or create an organisation.

## Understand the three governance layers

Agentic workflows interact with three controls you can set at the organisation level:

| Layer | What it controls | Where to configure |
|-------|-----------------|-------------------|
| **Copilot access policy** | Which models and features are available to workflows | Organisation → **Settings** → **Copilot** |
| **Network firewall** | Which domains a running workflow can reach | Workflow frontmatter `network.allowed-domains` |
| **Safe-outputs write control** | Which GitHub write operations a workflow is permitted to perform | Workflow frontmatter `safe-outputs` block |

Each layer is independent. A workflow can be stopped by any one of them.

## Review your Copilot policy settings

As an organisation owner, you decide which Copilot features are available to members.

1. Go to your organisation on GitHub.
2. Click **Settings** → **Copilot** → **Policies**.
3. Confirm that **Copilot for GitHub Actions (agentic workflows)** is set to **Enabled**.
4. Check the **Allowed models** list. If your organisation restricts models, only the listed models can be used in workflow frontmatter. Update your workflow's `model:` field to match an allowed model if needed.

> [!TIP]
> On GitHub Enterprise Server 3.12+, these settings live under **Admin** → **Copilot** → **Policies** for the site administrator, and under **Organisation Settings** → **Copilot** for organisation owners.

## Set a network firewall for your workflow

The `network.allowed-domains` field in your workflow frontmatter defines the exact list of domains the agent may contact during a run. Everything else is blocked.

Open your workflow `.md` file and add or update the `network` section:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 9 * * 1-5"
network:
  allowed-domains:
    - api.github.com
    - github.com
---
```

This is the minimum list for workflows that only interact with GitHub. Add further domains only when a specific tool or MCP server requires them — keep the list as short as possible.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to your workflow `.md` file in your repository on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Add the `network:` block to the frontmatter between the opening and closing `---` fences.
4. Click **Commit changes**.

</details>

After editing, compile and push the workflow:

```bash
gh aw compile
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "chore: add network firewall to daily-status workflow"
git push
```

## Review your safe-outputs configuration

Safe-outputs determine what the workflow is allowed to write back to GitHub. Check your frontmatter for a `safe-outputs` block:

```yaml
safe-outputs:
  create-issue: true
  add-comment: true
  create-pull-request: false
```

Set each write operation to `true` only if your workflow genuinely needs it. Disabling unused operations prevents the agent from making unintended writes — even if the task brief accidentally asks for one.

## Document your governance decisions

Before rolling out to your team, capture the answers to these questions in your repository's `CONTRIBUTING.md` or a `docs/agentic-workflows.md` file:

- Which model is approved for use in this repository?
- Which domains are allowed?
- Which safe-outputs write operations are permitted?
- Who approves changes to workflow frontmatter?

This short document turns individual settings into a repeatable, reviewable policy.

## ✅ Checkpoint

- [ ] You confirmed that the Copilot for GitHub Actions policy is enabled for your organisation
- [ ] Your workflow frontmatter includes a `network.allowed-domains` list with only the domains it needs
- [ ] Your workflow frontmatter has a `safe-outputs` block that disables write operations you don't use
- [ ] You can explain the difference between the three governance layers to a teammate
- [ ] You have documented (or plan to document) your governance decisions in the repository

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Network firewall reference](https://github.github.com/gh-aw/reference/network/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
