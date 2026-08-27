<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need more than individual workflow controls — they need org-wide policy, audit trails, and approval flows that keep AI automation predictable and compliant._

## :dart: What You'll Do

Apply GitHub Enterprise policies to agentic workflows: configure which repositories may run them, set token and credit limits at the organisation level, and establish a lightweight approval process for new workflows. By the end, you will have a governance checklist your team can use before promoting any agentic workflow to production.

## :clipboard: Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) or [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have **org-owner** or **enterprise-owner** access to a GitHub Enterprise Cloud or GitHub Enterprise Server (GHES 3.12+) organisation.
- If you are on `github.com` without an enterprise account, read through the steps to understand the controls and revisit when your organisation adopts GitHub Enterprise.

## Steps

### Understand the governance layer

gh-aw runs as a GitHub Actions job. That means every existing Actions policy already applies to agentic workflows:

- **Repository-level**: workflow files must exist in `.github/workflows/` and the repository must have Actions enabled.
- **Organisation-level**: the org **Actions policy** controls which repositories may run workflows and which third-party actions they may call.
- **Enterprise-level**: enterprise admins can enforce a single policy across all organisations.

Before you can govern agentic workflows specifically, confirm that your org's base Actions policy is in the state your security team expects.

### Set the organisation-level Copilot policy

Agentic workflows call the Copilot API. An org owner must enable this:

1. Open your organisation → **Settings** → **Copilot** → **Policies**.
2. Under **GitHub Copilot in GitHub Actions**, choose **Allowed** (or leave it **Inherited** if your enterprise policy sets it).
3. If your org uses SAML SSO, confirm that the Actions bot identity is included in the allowed list — the Copilot call fails silently if SSO blocks the request.

> [!NOTE]
> On GHES, the equivalent setting is in the **site admin** console under **GitHub Actions** → **AI Features**. Confirm with your site administrator before enabling.

### Restrict which repositories may run agentic workflows

Use the Actions repository policy to create an allowlist:

1. Open **Settings** → **Actions** → **General**.
2. Under **Policies**, select **Allow select actions and reusable workflows**.
3. Add your internal action/workflow references. For agentic workflows, no external action is required — the `gh aw` binary runs inside the job — so this policy limits which _repositories_ may trigger workflows at all.
4. For a more granular control, consider using **Environments with required reviewers** (see next section).

### Add a required-reviewer gate for production agentic workflows

When a workflow has write access to issues, pull requests, or code, add a human review gate:

1. Open the repository → **Settings** → **Environments** → **New environment**.
2. Name it `agentic-production`.
3. Under **Deployment protection rules**, enable **Required reviewers** and add your security or platform team.
4. In your workflow frontmatter, add:

```yaml
jobs:
  run:
    environment: agentic-production
```

Any run that targets this environment will pause and notify the required reviewers before the agent executes.

> [!TIP]
> Use `environment:` only on workflows with elevated permissions (`issues: write`, `contents: write`, or `pull-requests: write`). Read-only workflows don't need a gate.

### Define an organisation-wide AI credit budget

Prevent runaway costs by setting a spending limit at the organisation level:

1. Open **Settings** → **Billing** → **Spending limits**.
2. Set an **AI credits monthly cap** for your organisation.
3. Each repository that runs agentic workflows should also set per-run and per-day limits in its workflow frontmatter. The org cap acts as a final backstop.

For a recommended calculation method, see [Project Future AI Credit Costs with `gh aw forecast`](side-quest-26-01-forecast-costs.md).

### Build a pre-production governance checklist

Before promoting any agentic workflow to production, confirm each item:

| Control | Where to set it | Status |
|---|---|---|
| Minimum required `permissions:` | Workflow frontmatter | |
| `safe-outputs` allowlist reviewed | Workflow frontmatter | |
| `network.allowed-domains` set | Workflow frontmatter | |
| Per-run `max-ai-credits` set | Workflow frontmatter | |
| `environment: agentic-production` added | Workflow frontmatter (for write workflows) | |
| Org Actions policy allows this repository | Org Settings → Actions | |
| Copilot in Actions enabled for org | Org Settings → Copilot | |
| Audit artifact retention ≥ your org's policy | Org Settings → Actions → Artifact and log retention | |

Copy this checklist into a new issue in your practice repository and use it as a PR review template for new workflows.

## :white_check_mark: Checkpoint

- [ ] You can describe the three governance layers (repository, organisation, enterprise) that apply to agentic workflows
- [ ] You confirmed the Copilot in Actions policy is set correctly in your organisation (or know who to ask)
- [ ] You created an `agentic-production` environment with at least one required reviewer on a write-enabled workflow
- [ ] You verified or set an organisation-level AI credit spending limit
- [ ] You completed the pre-production governance checklist for at least one workflow in your practice repository

<!-- journey: all -->
Want to explore more advanced topics? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
