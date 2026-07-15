# Govern Your Agentic Workflows at Scale

> _Deploying an AI-powered workflow to a team needs guardrails — this step shows you how to add them._

## 🎯 What You'll Do

You'll configure an approval gate and permission boundaries for your agentic workflow. By the end, your workflow will pause for a human reviewer before running, and every execution will appear in the audit log.

## 📋 Before You Start

- You've built and scheduled an agentic workflow (see [Schedule Your Workflow](13-schedule-it.md)).
- Your repository belongs to a GitHub organization — personal repos lack environment protection rules.
- You have **Admin** access to the repository.

## Steps

### Create a protected environment

GitHub Actions _environments_ let you add required approval steps before a workflow job runs. Create one named `production` with a required reviewer.

1. In your repository on GitHub, click **Settings** → **Environments** → **New environment**.
2. Type `production` and click **Configure environment**.
3. Enable **Required reviewers**, add your username, and click **Save protection rules**.

![A screenshot of the Environments settings page showing Required reviewers enabled](images/25-environment-protection.png)

### Point your workflow at the environment

Open your workflow file (for example, `daily-status.md`) and add `environment: production` to the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily
permissions:
  contents: read
environment: production
---
```

<details>
<summary>🖥️ GitHub UI — edit your workflow file</summary>

1. Navigate to `.github/workflows/daily-status.md`.
2. Click the pencil icon (✏️), add `environment: production` to the frontmatter, and click **Commit changes**.

</details>

If you're in a terminal, recompile and push:

```bash
gh aw compile
```

### Verify the approval gate works

1. In the **Actions** tab, trigger a manual run of your workflow.
2. The run pauses and shows a **Waiting** badge.
3. Click **Review pending deployments**, approve, and watch the run continue.

> [!TIP]
> For automated nightly runs you don't want to block, create a `staging` environment without required reviewers and reserve `production` for manually triggered or release-gated runs.

### Restrict organization-level workflow permissions

To stop any repository workflow from claiming excessive permissions, set the organization default to read-only.

1. In your organization's **Settings**, click **Actions** → **General**.
2. Set **Workflow permissions** to **Read repository contents and packages permissions** and click **Save**.

Any workflow that needs more — such as `issues: write` — must declare it in frontmatter. Least privilege limits the blast radius if a prompt is ever manipulated.

### Verify in the audit log

After the approved run completes, confirm the event was recorded.

1. Go to your organization's **Settings** → **Audit log**.
2. Search for `action:workflows.completed` to find the entry for your run.

> [!TIP]
> On GitHub Enterprise Server, stream audit logs to a SIEM (Splunk, Datadog) via **Enterprise settings → Audit log**. On GitHub Enterprise Cloud, enable streaming to S3, Azure Blob, or Google Cloud Storage for long-term retention.

## ✅ Checkpoint

- [ ] A `production` environment exists in your repository with at least one required reviewer
- [ ] Your workflow frontmatter includes `environment: production`
- [ ] A manual run paused at the approval gate and resumed after you approved it
- [ ] You can find the run in your organization's audit log under `action:workflows.completed`
- [ ] Your organization's default workflow permission is set to **Read** (not **Read and write**)
- [ ] You can explain why least-privilege permissions reduce risk for AI-driven workflows

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Organization audit log](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Side Quest: Permission Escalation](side-quest-17-04-permission-escalation.md)
