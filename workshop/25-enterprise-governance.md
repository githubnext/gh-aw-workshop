# Govern Agentic Workflows in an Enterprise Environment

> _When AI agents write code and open pull requests on your behalf, your organisation needs clear guardrails — this step shows you how to put them in place._

## 🎯 What You'll Do

You will configure GitHub's built-in governance features — required deployment environments, approval gates, and audit logs — to keep your agentic workflows safe and auditable in a GHEC or GHES environment.
By the end of this step, every production run of your workflow will require a human approval and leave a full audit trail.

## 📋 Before You Start

- Your agentic workflow runs successfully on schedule or on demand (see [Step 13: Schedule It to Run Every Day](13-schedule-it.md)).
- You have the **Manage repository** or **Manage organisation** permission to create environments and set protection rules.
- Your organisation uses GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server 3.7+ (GHES). Required reviewers for environments are an Enterprise feature.

> [!NOTE]
> On a personal or free organisation account, required reviewers are not available. You can still follow the audit-log section of this step; skip the environment protection rules.

## Understand the governance model

Agentic workflows interact with your repository the same way any GitHub Actions workflow does — they use the `GITHUB_TOKEN` (or a custom token) and respect standard Actions permissions. This means all existing Actions governance tools apply:

- **Deployment environments** let you require one or more approvals before a workflow can run against a protected environment.
- **Audit logs** record every workflow trigger, token use, and permission change in the organisation's tamper-resistant log.
- **Workflow permissions policies** let organisation admins restrict what tokens agentic jobs can request, capping blast radius if a prompt is ever manipulated.

## Create a protected deployment environment

A deployment environment is a named target (for example, `production` or `ai-production`) that you attach protection rules to. Your workflow references the environment in its frontmatter, and Actions enforces the rules before the job starts.

### Create the environment in the GitHub UI

1. In your repository, go to **Settings** → **Environments**.
2. Click **New environment**.
3. Name it `ai-production` and click **Configure environment**.
4. Under **Deployment protection rules**, enable **Required reviewers**.
5. Add one or more reviewers — individuals or teams — who must approve each run.
6. Click **Save protection rules**.

![Environment protection rules panel showing required reviewers](images/25-environment-protection-rules.png)

> [!TIP]
> Add your on-call rotation team as a reviewer so approvals don't block on a single person's availability.

### Reference the environment in your workflow frontmatter

Open your workflow file and add an `environment:` key inside your job definition.

<details>
<summary>🖥️ GitHub UI path</summary>

1. In your repository, navigate to `.github/workflows/daily-status.md`.
2. Click the **pencil icon (✏️)** to open the editor.
3. Add `environment: ai-production` to the frontmatter as shown below.
4. Click **Commit changes**.

</details>

<details>
<summary>💻 Terminal path</summary>

Open the file in your editor, add the `environment:` field, then commit:

```bash
code .github/workflows/daily-status.md
# edit, then:
git add .github/workflows/daily-status.md
git commit -m "chore: require approval via ai-production environment"
git push
```

</details>

Add the field to your frontmatter (the YAML block at the top of your `.md` workflow file):

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 8 * * 1-5"
  workflow_dispatch:
runs-on: ubuntu-latest
environment: ai-production
permissions:
  contents: write
  pull-requests: write
---
```

With `environment: ai-production` in place, every run — including scheduled ones — will pause at the gate and wait for a reviewer to approve before any agent action executes.

> [!NOTE]
> Scheduled workflows that require approval will stay in a **Waiting** state until approved or the approval window times out (default: 30 days).

## Review the organisation audit log

Every workflow run, token use, and environment approval is recorded in the organisation's audit log. Your security team can query this log to see exactly what each agentic run did.

1. Go to your **organisation's** Settings (not the repository).
2. In the left sidebar, under **Security**, click **Audit log**.
3. Search for `action:workflows.completed repo:<your-org>/<your-repo>` to see all completed workflow runs.
4. Click any entry to expand the event detail — it shows the actor, the workflow, the runner, and the commit SHA that triggered the run.

> [!TIP]
> Enterprise admins can stream the audit log to a SIEM (Splunk, Datadog, etc.) using the **Audit log streaming** feature under organisation settings. Agentic workflow events appear in the stream alongside all other Actions events.

## Restrict workflow permissions at the organisation level

Org admins can prevent any workflow — agentic or otherwise — from requesting write permissions unless a repository explicitly opts in.

1. Go to **Organisation Settings** → **Actions** → **General**.
2. Under **Workflow permissions**, select **Read repository contents and packages permissions**.
3. Click **Save**.

Repositories that need write access (such as the one running your daily-status workflow) then opt in explicitly by declaring `permissions:` in their frontmatter, which you already do. Repositories that omit permissions declarations get read-only tokens automatically.

This limits blast radius: a compromised or misbehaving workflow in another repository cannot accidentally write to your codebase.

## ✅ Checkpoint

- [ ] You created an `ai-production` environment in your repository with at least one required reviewer
- [ ] Your workflow frontmatter includes `environment: ai-production`
- [ ] You triggered a manual run and saw the **Waiting for approval** state in the Actions tab
- [ ] You approved the run and confirmed it completed successfully
- [ ] You located your organisation's audit log and found the workflow completion event
- [ ] You can explain why limiting the default workflow permissions reduces blast radius for agentic workloads

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Using environments for deployment](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment)
- [Reviewing deployments](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/reviewing-deployments)
- [Organisation audit log](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [Streaming the audit log](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
