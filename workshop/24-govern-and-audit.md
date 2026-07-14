# Govern and Audit Your Agentic Workflows

> _When agentic workflows run on behalf of your whole team or organisation, visibility and control matter as much as the automation itself._

## 🎯 What You'll Do

Learn how to apply organisation-level policies to agentic workflows, review audit logs to understand what each run did, and set guardrails — such as token budgets and network firewall rules — so your workflows are safe to run in production.

## 📋 Before You Start

- You have a working, scheduled agentic workflow from [Schedule It to Run Every Day](13-schedule-it.md).
- You have admin or owner access to a GitHub organisation, **or** you can read along and apply these steps to your personal repository.

> [!NOTE]
> Enterprise Cloud and Enterprise Server users should complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) before this node if you haven't already.

---

## Steps

### Understand what "governance" means for agentic workflows

Agentic workflows are still GitHub Actions jobs. Every governance mechanism that applies to Actions also applies here:

- **Repository permissions** control what the `GITHUB_TOKEN` can do inside a run.
- **Organisation policies** can restrict which repositories are allowed to use Copilot-powered steps.
- **Audit logs** record every trigger, run start, and token usage event.
- **Firewall rules** (gh-aw feature) limit which domains the agent can reach during a run.

You don't need new tools — you extend what you already know.

### Review run logs in the Actions tab

After a workflow runs, the full execution log is stored in GitHub Actions.

1. Open your repository on GitHub.
2. Click the **Actions** tab.
3. Select the most recent run of your agentic workflow.
4. Expand the job and each step to read the agent's reasoning, tool calls, and final output.

Each run log shows you:

- Which model the agent called.
- Which tools it used (for example, `gh` commands or MCP tool calls).
- The safe-output it emitted (the action it was authorised to take).
- Any warnings or errors.

> [!TIP]
> Use the **Search logs** box in the Actions UI to filter for keywords like `tool_call`, `safe-output`, or `error`. This is faster than scrolling for long runs.

### Check the organisation audit log (Enterprise and Org admins)

GitHub logs Copilot usage in the organisation audit log. This lets you answer questions like: "Which repositories ran agentic workflows this week?" and "Who triggered a run that used the model outside business hours?"

1. Navigate to your organisation on GitHub.
2. Click **Settings** → **Audit log**.
3. Filter by the `copilot` category or search for `workflow_run` events.

The audit log records:

| Event | What it shows |
|---|---|
| `copilot.workflow_run` | Repository, actor, trigger type, run ID |
| `copilot.model_call` | Model name, token counts, run ID |
| `copilot.safe_output` | Safe-output type and target repository |

> [!NOTE]
> Audit log retention policies vary by GitHub plan. Enterprise Server admins can configure retention under **Admin** → **Audit log settings**.

### Set a network firewall allowlist

gh-aw lets you declare which domains your agent is allowed to contact. This prevents an agent from accidentally — or maliciously — calling unexpected endpoints.

Add a `network:` block to your workflow frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
  workflow_dispatch:

permissions:
  issues: write

network:
  egress:
    allowed-domains:
      - api.github.com
      - github.com
---
```

After adding `network.egress.allowed-domains`, compile and push:

```bash
gh aw compile daily-status
git add .github/workflows/daily-status.lock.yml
git commit -m "chore: restrict network egress for daily-status workflow"
git push
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to `.github/workflows/daily-status.md` in your repository and click the **pencil icon (✏️)**.
2. Add the `network:` block to the frontmatter between the `---` fences.
3. Click **Commit changes**.
4. The compiled `.lock.yml` will be regenerated automatically on the next workflow run, or you can trigger a compile run manually via `workflow_dispatch` if your repo has a compile workflow set up.

</details>

> [!TIP]
> Start permissive, then tighten. Run the workflow once with no firewall. Open the run log and look for domains in the `Firewall` section. Add each required domain to your allowlist, then remove any you don't need.

### Enforce token and timeout budgets

Runaway agents can consume model tokens for much longer than intended. Two frontmatter fields cap this:

- `timeout-minutes` — kills the entire job after N minutes.
- Per-step `timeout-minutes` — kills a single step.

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
  workflow_dispatch:

permissions:
  issues: write

timeout-minutes: 10

network:
  egress:
    allowed-domains:
      - api.github.com
      - github.com
---
```

A 10-minute budget is generous for most daily-status workflows. Adjust based on your observed run duration from the Actions log.

### Apply organisation-level Copilot policies (Enterprise admins)

Organisation owners can control which repositories are allowed to use Copilot inside Actions:

1. Go to your organisation **Settings** → **Copilot** → **Policies**.
2. Under **Allow Copilot in GitHub Actions**, choose one of:
   - **All repositories** — every repo in the org can use agentic workflows.
   - **Selected repositories** — allowlist specific repos.
   - **Disabled** — no agentic workflow runs for this org.
3. Save the policy. Repositories that are not on the allowlist will see their agentic jobs skip the model step.

This is the primary governance lever for enterprise teams rolling out agentic workflows gradually.

---

## ✅ Checkpoint

- [ ] You located at least one completed agentic workflow run in the Actions tab and read its log
- [ ] You can describe two events visible in the organisation audit log for workflow runs
- [ ] Your workflow frontmatter includes a `network.egress.allowed-domains` block
- [ ] Your workflow frontmatter includes a `timeout-minutes` value
- [ ] `gh aw compile` completed without errors after your frontmatter changes
- [ ] (Enterprise admins) You can locate the Copilot in Actions policy in your organisation settings

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Network firewall reference](https://github.github.com/gh-aw/reference/network/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [GitHub audit log documentation](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
- [Side Quest: Secrets and Permissions](side-quest-16-02-secrets-and-permissions.md)
