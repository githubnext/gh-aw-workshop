<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Your Agentic Workflows Across an Organisation

> _Shipping one workflow is empowering — letting dozens of teams run agentic workflows safely requires guardrails at the organisation level._

## :dart: What You'll Do

Configure organisation-level policy settings, [concurrency](https://github.github.com/gh-aw/reference/concurrency/) limits, and workflow approval gates so every agentic workflow in your org runs under a consistent, auditable governance model. By the end, you will have applied three controls that let platform teams approve what runs, how much it costs, and how many agents run in parallel.

## :clipboard: Before You Start

- You have at least one agentic workflow running successfully (see [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)).
- You have reviewed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have **Owner** or **Admin** access to the GitHub organisation where your workflow lives.

> [!NOTE]
> <details>
> <summary><b>GHES and GHEC users: check admin policy first.</b></summary>
>
> On GitHub Enterprise Server and GitHub Enterprise Cloud, some of the settings below are
> controlled at the **enterprise level** by your GitHub Enterprise administrator, not at the
> organisation level. If you do not see a setting, ask your administrator whether it has been
> locked at the enterprise policy layer.
>
> </details>

## Steps

### Review the org-level agentic workflow policy

1. Go to your organisation's **Settings** page on GitHub.
2. Under **Actions**, select **General**.
3. Locate the **Agentic workflows** section.

Here you will find controls for:

| Setting | What it controls |
|---|---|
| **Allow agentic workflows** | Whether any agentic workflow can run in the org |
| **Require approval for first-time contributors** | Whether the agent waits for a human approval before the first run |
| **Maximum AI Credits per workflow run** | An org-wide ceiling that individual workflows cannot exceed |

Set **Allow agentic workflows** to **Enabled for specific repositories** if you want to roll out to a pilot group before opening it org-wide.

### Add a per-workflow concurrency limit

Concurrency limits prevent multiple runs of the same workflow from running simultaneously — important for workflows that write to shared state (issues, memory, labels). Open your workflow file and add a `concurrency` block inside the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily on weekdays
concurrency:
  group: daily-status
  cancel-in-progress: false
---
```

`cancel-in-progress: false` queues the new run rather than discarding it. Use `true` only when running the latest version always supersedes an in-progress run (for example, a PR-triggered analysis that is re-triggered by a new push).

After editing, compile and push:

```bash
gh aw compile
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "chore: add concurrency group to daily-status"
git push
```

### Set an org-level AI Credit ceiling

In **Settings → Actions → General**, set the **Maximum AI Credits per workflow run** field to a value that reflects your cost policy. This ceiling applies to every agentic workflow in the org — individual `max-ai-credits` values in frontmatter can be lower, but not higher.

If your org uses cost centres or charge-back, document the ceiling in your internal runbook alongside the formula you used in [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).

### Require an approval gate with [environments](https://github.github.com/gh-aw/reference/frontmatter/#environment)

For workflows that write to sensitive targets (production repositories, external APIs), add a GitHub environment with required reviewers:

1. Go to **Settings → Environments** and create an environment named `production-writes`.
2. Add one or more required reviewers (individual users or a team).
3. Reference the environment in your workflow frontmatter:

```yaml
---
name: Production Report
environment: production-writes
---
```

When the workflow is triggered, GitHub Actions pauses at the environment gate and notifies reviewers. The agent does not start until a reviewer approves the run.

Compile after adding the `environment` field:

```bash
gh aw compile
```

### Validate the governance chain end-to-end

1. Trigger your workflow manually via **Actions → your workflow → Run workflow**.
2. If an approval gate is configured, you should see the run pause at the environment approval step.
3. Approve the run and confirm it proceeds.
4. After the run completes, run `gh aw audit` to confirm the run appears in your audit log with the correct reviewer identity.

```bash
gh aw audit <run-id>
```

Check that the audit output includes the approver and the environment name.

## :white_check_mark: Checkpoint

- [ ] You located the org-level agentic workflow policy page under **Settings → Actions → General**
- [ ] You added a `concurrency` block to at least one workflow and compiled successfully
- [ ] You set (or confirmed) an org-level AI Credit ceiling
- [ ] You created a GitHub environment with at least one required reviewer
- [ ] You triggered a workflow run through the approval gate and confirmed the agent waited for approval
- [ ] `gh aw audit` shows the run with the correct approver identity in the audit log
- [ ] You can explain the difference between the org-level AIC ceiling and the per-workflow `max-ai-credits` frontmatter field

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
