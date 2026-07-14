# Govern Agentic Workflows Across Your Organisation

> _When one workflow becomes ten, your team needs policies — not just permissions._

## 🎯 What You'll Do

You'll explore the controls available to GitHub Enterprise Cloud (GHEC) and GitHub Enterprise Server (GHES) administrators for managing agentic workflows at scale. By the end you'll know how to audit workflow activity, restrict which workflows can run, and enforce least-privilege permissions across your organisation.

## 📋 Before You Start

- You have completed at least one agentic workflow from [Build — Daily Repo Status Workflow](11a-build-daily-status.md) or equivalent.
- You understand GitHub Actions permissions from [Step 4: What Are GitHub Actions?](04-github-actions-intro.md).
- Enterprise setup: confirm GHES 3.12+ or GHEC from [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

> [!IMPORTANT]
> <details>
> <summary>**Enterprise administrators: some controls require organisation-owner or enterprise-admin access.**</summary>
>
> Most settings in this step live under **Organisation settings → Actions** or **Enterprise settings → Policies → Actions**. Individual contributors can read along, but changes require an owner account.
>
> </details>

## Steps

### Review who can trigger agentic workflows

Agentic workflows run inside GitHub Actions. Your first governance decision is: who is allowed to trigger a run?

1. Go to your organisation on GitHub and click **Settings → Actions → General**.
2. Under **Actions permissions**, choose one of:

   | Option | When to use |
   |--------|-------------|
   | **Allow all actions** | Open experimentation — suitable for developer sandbox orgs |
   | **Allow local actions only** | High-security orgs that do not trust external Actions |
   | **Allow select actions** | Balanced — allowlist specific actions and agentic workflow sources |

3. Under **Workflow permissions**, set the default to **Read repository contents and packages**.

   Agentic workflows that need write access declare it explicitly in frontmatter `permissions:` — so the restrictive default is safe and correct.

### Inspect audit log entries for agentic runs

Every workflow run — including agentic ones — is recorded in the GitHub audit log.

1. Go to **Organisation settings → Audit log**.
2. Filter by `action:workflows`. You will see entries for every workflow dispatch, scheduled run, and permission change.
3. Filter by `actor:<username>` to narrow to a specific user.
4. Look for `workflows.completed` entries with the workflow name in the payload to confirm agentic runs.

> [!TIP]
> <details>
> <summary>Stream audit log entries to a SIEM for continuous monitoring.</summary>
>
> GHEC supports audit log streaming to Amazon S3, Azure Blob Storage, Google Cloud Storage, Splunk, and other targets. Enable it under **Enterprise settings → Audit log → Log streaming**.
>
> GHES exports audit log via REST API at `GET /enterprises/{enterprise}/audit-log`.
>
> </details>

### Configure the network firewall for agentic workflow runners

Agentic workflows can make outbound network calls. On GHEC and GHES, you can restrict which domains the agent may reach.

In your workflow's `network:` frontmatter block, list only the domains your workflow genuinely needs:

```yaml
network:
  allowed-domains:
    - api.github.com
    - models.inference.ai.azure.com
```

This list is enforced at the runner level. Any domain not listed is blocked — even if the agent task brief tries to reach it. Keep the list short and review it on each workflow iteration.

> [!NOTE]
> <details>
> <summary>On self-hosted runners, firewall enforcement depends on runner configuration.</summary>
>
> The `network.allowed-domains` block is honoured when the runner has the gh-aw firewall component enabled. Confirm with your runner administrator that the component is active before relying on this control in a high-security context.
>
> </details>

### Apply organisation-level required reviewers

For workflows that make consequential writes — merging pull requests, publishing releases, deploying to production — add a required reviewer.

1. In the target repository, go to **Settings → Environments** and create an environment called `production` (or match your naming convention).
2. Under **Deployment protection rules**, add one or more **Required reviewers**.
3. In your workflow YAML (`*.lock.yml`), set `environment: production` on the job that runs the agentic step.

Every run that targets this environment will pause and wait for a human to approve before the agent acts.

### Audit safe-output declarations in pull requests

When a workflow creates or updates a pull request via `safe-outputs`, the pull request body includes an agent attribution footer. Use this to spot-check:

1. Open a pull request created by an agentic workflow.
2. Scroll to the footer — confirm the attribution matches the expected workflow name and run ID.
3. Review the declared `safe-outputs` type in the workflow frontmatter to confirm the agent was only allowed to write to the surfaces you intended.

### Set organisation-wide secrets sparingly

Secrets set at the organisation level are visible to all repositories unless scoped.

1. Go to **Organisation settings → Secrets and variables → Actions**.
2. For each secret, click **Update** and review the **Repository access** setting.
3. Change any secret with **All repositories** access to **Selected repositories** — list only the repos that need it.

> [!WARNING]
> <details>
> <summary>Over-scoped organisation secrets are a common source of unintended data access in agentic workflows.</summary>
>
> An agentic workflow in any repository that has access to an org-wide secret can reference it in the task brief. Minimal secret scoping is your most effective control.
>
> </details>

## ✅ Checkpoint

- [ ] You can locate the **Actions permissions** and **Workflow permissions** settings in your organisation
- [ ] You have found at least one agentic workflow run in the organisation audit log
- [ ] Your workflow's `network.allowed-domains` list includes only the domains it actually uses
- [ ] You know how to add required reviewers to an environment for consequential workflows
- [ ] You have reviewed organisation secrets and confirmed each one uses **Selected repositories** access
- [ ] You can explain the difference between `permissions:` in frontmatter and organisation-level workflow permissions

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Side Quest: Storing Credentials with GitHub Secrets](side-quest-16-02-secrets-and-permissions.md)
- [Side Quest: Permission Escalation in Agentic Workflows](side-quest-17-04-permission-escalation.md)
- [Side Quest: Agentic Workflow Security Architecture](side-quest-17-02-security-architecture.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
