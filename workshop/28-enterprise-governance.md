<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Govern Agentic Workflows Across Your Enterprise

> _Add approval gates, policy checks, and audit evidence so your organisation can run AI-powered workflows with confidence._

## :dart: What You'll Do

You'll add a required-reviewer approval gate to your agentic workflow, apply a policy constraint that limits the safe outputs the agent can emit, and verify that every run leaves a tamper-evident audit trail in the Actions log.

By the end of this step you'll have a workflow that satisfies a typical enterprise change-management checklist: gated execution, bounded permissions, and a durable record of every AI-generated action.

## :clipboard: Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You are working in a GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server (GHES) organisation, or a personal repository that uses branch protection rules.

> [!NOTE]
> If you're not in an enterprise org yet, you can still follow the policy and permission steps. Skip the environment protection section and return to it when you move to an enterprise org.

## Steps

### Understand the governance model

Three layers protect an agentic workflow in an enterprise setting:

- **Environment protection rules** — require a human reviewer before the job runs.
- **Permissions declarations** — limit what the `GITHUB_TOKEN` can do.
- **Safe-output constraints** — restrict which write operations the AI agent can emit.

### Add an environment protection rule

1. Open your repository on GitHub.com and navigate to **Settings** → **Environments**.
2. Click **New environment** and name it `governed-ai`.
3. Under **Deployment protection rules**, enable **Required reviewers** and add yourself (or your team).
4. Save the environment.

### Reference the environment in your workflow frontmatter

Open `daily-report-status.md` in your Codespace and add the `environment` key:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
  workflow_dispatch:
permissions:
  issues: write
environment: governed-ai
---
```

> [!TIP]
> The `environment` key is standard GitHub Actions syntax. `gh aw compile` passes it through to the generated lock file unchanged — no special agentic syntax required.

Compile after saving:

```bash
gh aw compile
```

### Tighten the permissions declaration

Review the `permissions:` block in your frontmatter. Apply the principle of least privilege:

- Remove any permission you are not actively using.
- If your workflow only comments on issues, keep `issues: write` and nothing else.
- If it creates pull requests, add `pull-requests: write` and remove `contents: write` if you don't push commits.

A minimal, correct permissions block is the clearest evidence to a reviewer that the workflow cannot exceed its stated scope.

### Verify the audit trail

1. Trigger a manual run from the **Actions** tab using **Run workflow**.
2. When the run reaches the `governed-ai` environment, approve the **Review deployments** prompt.
3. After the run completes, open the job log and locate the **safe outputs** step.
4. Expand the step — you'll see a structured record of every write the agent requested: action type, target, and timestamp.

Download the log as a `.txt` file (**⋮ → Download log archive**) and keep it as your audit artifact.

> [!NOTE]
> On GHES, environment protection rules require GitHub Enterprise Server 3.5 or later. Earlier versions support branch protection rules as an alternative gating mechanism.

### Document your governance policy

Add a short policy comment to `daily-report-status.md`, below the frontmatter:

```markdown
<!-- governance
  environment: governed-ai
  approval-required: true
  permitted-safe-outputs: COMMENT (issues, max 1 per run)
  reviewed-by: @<your-username>
  last-reviewed: <YYYY-MM-DD>
-->
```

This comment is not parsed by `gh aw` — it is documentation for your security team. Update it whenever you change permissions or safe-output scope.

Compile and push the final version:

```bash
gh aw compile
git add .github/workflows/daily-report-status.md .github/workflows/daily-report-status.lock.yml
git commit -m "Add governance gate and policy comment to daily-report-status workflow"
git push
```

## :white_check_mark: Checkpoint

- [ ] You created a `governed-ai` environment with at least one required reviewer
- [ ] Your workflow frontmatter includes `environment: governed-ai`
- [ ] Your `permissions:` block contains only the permissions your workflow actually uses
- [ ] A manual run paused at the approval gate and completed after you approved it
- [ ] The job log shows the safe outputs step with a structured record of AI-generated writes
- [ ] You added a `<!-- governance -->` policy comment to the workflow source file
- [ ] `gh aw compile` completes without errors and both workflow files are committed and pushed

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
