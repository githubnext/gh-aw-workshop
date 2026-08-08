<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Your Agentic Workflows at Scale

> _Set approval policies, permission boundaries, and audit checkpoints so your AI workflows meet enterprise compliance requirements._

## :dart: What You'll Do

You'll review the key governance controls available for agentic workflows — required reviewers, restricted permissions, environment protection rules, and audit log integration — then apply them to the orchestrator workflow you built in the previous step. By the end, you will have a workflow that cannot run without an explicit approval, records every run in the audit log, and operates under a clearly scoped permissions policy.

## :clipboard: Before You Start

- You completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have admin access to your practice repository (to create and configure an environment).
- Your repository is on github.com, GHEC, or GHES 3.12+ — all three support the features in this step.

## Steps

### Understand the governance layers

Three layers protect agentic workflows at enterprise scale:

- **Workflow permissions** — which GitHub API scopes the workflow token can use.
- **Repository environments** — required reviewers and deployment gates before a job starts.
- **Audit log** — a tamper-evident record of every trigger, approval, and run outcome.

### Narrow your workflow's permissions

Open your `repo-orchestrator.md` in the Codespace editor and locate the `permissions:` block in the YAML frontmatter. Restrict it to exactly the scopes the workflow actually uses:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: read
```

> [!TIP]
> The principle of least privilege applies to AI-powered workflows too. A workflow that can only write issues cannot accidentally push code or change repository settings, even if the agent produces unexpected output.

Save the file, then recompile:

```bash
gh aw compile repo-orchestrator.md
```

Confirm that `repo-orchestrator.lock.yml` shows only the permissions you listed.

### Create a protected environment

A GitHub Actions _environment_ is a named gate you can attach required reviewers to. Any job that targets an environment will pause and wait for a human to approve before it runs.

1. In your practice repository on GitHub.com, go to **Settings** → **Environments** → **New environment**.
2. Name it `agentic-production`.
3. Under **Deployment protection rules**, enable **Required reviewers** and add yourself (or a teammate) as an approver.
4. Save the environment.

![Creating the agentic-production environment with required reviewers](images/29-environment-required-reviewers.png)

Now open `repo-orchestrator.md` and add the environment to the job that runs the orchestrator:

```yaml
jobs:
  orchestrate:
    runs-on: ubuntu-latest
    environment: agentic-production
```

Recompile:

```bash
gh aw compile repo-orchestrator.md
```

Commit both files:

```bash
git add .github/workflows/repo-orchestrator.md .github/workflows/repo-orchestrator.lock.yml
git commit -m "Add governance: least-privilege permissions + agentic-production environment"
```

### Trigger a run and approve it

Dispatch the orchestrator manually from the GitHub Actions tab (**Run workflow**). Instead of starting immediately, the run will pause at the `agentic-production` environment gate and show a **Review deployments** prompt.

Click **Review deployments**, select `agentic-production`, add an optional comment, and click **Approve and deploy**.

The workflow resumes and runs under your approved context.

### Verify the audit log entry

> [!NOTE]
> Audit log access requires org owner or enterprise owner permissions. If you are in a personal repository, note this capability for future reference.

Navigate to your organization → **Settings** → **Audit log** and filter by `workflow_run`. You should see entries for the dispatch event, the environment approval, and the run outcome. On GHEC and GHES, these logs are also available via the audit log streaming API for SIEM integration.

### Enterprise policy options (GHEC and GHES)

Your organization admin can enforce additional controls across all repositories:

- **Actions permissions** (Org → Settings → Actions → General): restrict which workflows can run at all.
- **Required status checks**: prevent merging workflow changes until CI passes.
- **OIDC token trust** (OpenID Connect): let workflows authenticate to cloud providers without stored secrets.
- **Runner group restrictions**: ensure agentic workflows run only on approved runner fleets.

> [!NOTE]
> Runner group restrictions pair well with [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md). When both are in place, your agentic workflows run on your infrastructure only.

## :white_check_mark: Checkpoint

- [ ] I narrowed `permissions:` in my orchestrator workflow to only the scopes it actually needs
- [ ] I ran `gh aw compile repo-orchestrator.md` and confirmed the lock file reflects the updated permissions
- [ ] I created an `agentic-production` environment with at least one required reviewer
- [ ] I added `environment: agentic-production` to the orchestrator job and recompiled
- [ ] I triggered a manual run, saw the environment gate pause it, and approved the deployment
- [ ] I can describe at least two additional organization-level policy controls that apply to agentic workflows in GHEC or GHES

**Next:** You've reached the end of the advanced governance path. Return to [What's Next? Keep Exploring](14-next-steps.md) to revisit other workshop branches or share what you've built.
