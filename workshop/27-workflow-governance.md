<!-- page-journey: all -->
<!-- page-adventure: enterprise -->
# Enforce Workflow Governance with Reusable Policies

> _Good governance means your whole organisation runs agentic workflows consistently — without every team reinventing security, budget, and approval rules from scratch._

## 🎯 What You'll Do

You will create a reusable workflow policy template in your organisation and configure it as a **required workflow** — a workflow that must succeed before pull requests can be merged. By the end of this step, your organisation will have a single source of truth for agentic workflow guardrails that any repository can adopt automatically.

## 📋 Before You Start

- You have a working agentic workflow from earlier steps (for example, the daily-status workflow from [Schedule It to Run Every Day](12-test-and-iterate.md)).
- You've reviewed AI credit budgets in [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have **Owner** or **Admin** access to a GitHub organisation (GHEC or GHES 3.12+).

## Steps

### Understand the governance model

GitHub provides two complementary tools for enterprise workflow governance:

- **Workflow templates** — starter `.yml` files and metadata stored in `.github/workflow-templates/` inside an organisation's `.github` repository. When a member creates a new Actions workflow, GitHub suggests these templates.
- **Required workflows** (GHEC/GHES) — workflows that run automatically on pull requests across repositories in your organisation, regardless of whether the repository defines its own workflow.

Together they let you codify security, cost, and approval policies once and enforce them across every repository in your organisation.

### Create a governance workflow template

Create the shared `.github` repository for your organisation if it does not exist, then add the workflow template.

<details>
<summary>🖥️ GitHub UI path (recommended)</summary>

1. Go to `github.com/<your-org>` → **Repositories** → **New repository**.
2. Name it `.github` and set visibility to **Public**.
3. Inside the new repo, click **Add file → Create new file** and type `workflow-templates/aw-policy.yml` in the name box.
4. Paste the starter policy content below, then click **Commit new file**.
5. Repeat for `workflow-templates/aw-policy.properties.json` with the metadata content below.

</details>

**Starter policy file** — `workflow-templates/aw-policy.yml`:

```yaml
name: Agentic Workflow Policy Check

on:
  pull_request:
    paths:
      - "**.md"
      - "**.lock.yml"

jobs:
  policy-check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Check lock file present
        run: |
          for md in $(git diff --name-only origin/${{ github.base_ref }} HEAD | grep '\.md$'); do
            lock="${md%.md}.lock.yml"
            if [ ! -f "$lock" ]; then
              echo "::error file=$md::Missing compiled lock file: $lock"
              exit 1
            fi
          done
```

**Metadata file** — `workflow-templates/aw-policy.properties.json`:

```json
{
  "name": "Agentic Workflow Policy Check",
  "description": "Ensures every agentic workflow .md file has a compiled .lock.yml before merging.",
  "iconName": "octicon-shield-check",
  "categories": ["agentic-workflows", "governance"]
}
```

### Configure a required workflow (GHEC / GHES)

A required workflow runs on every pull request in the repositories you select — even if those repos don't define the workflow themselves.

<details>
<summary>🖥️ GitHub UI path</summary>

1. Go to your **Organisation settings** → **Code and automation** → **Actions** → **Required workflows**.
2. Click **Add required workflow**.
3. Select your `.github` repository and choose `workflow-templates/aw-policy.yml`.
4. Under **Applied to repositories**, select **All repositories** or choose specific repos.
5. Click **Add workflow**.

</details>

> [!NOTE]
> Required workflows are available on GitHub Enterprise Cloud and GitHub Enterprise Server 3.14+. On GitHub.com free/pro plans, use branch protection rules with status checks instead.

### Add a budget-limit policy comment

Extend the policy by adding a check that warns when a workflow's `max-ai-credits` is above your organisation's recommended ceiling. This keeps costs predictable across teams.

Add the following step to your `aw-policy.yml` after the lock-file check:

```yaml
      - name: Warn on high AI credit limit
        run: |
          limit=5000
          for lock in $(git diff --name-only origin/${{ github.base_ref }} HEAD | grep '\.lock\.yml$'); do
            value=$(grep 'max-ai-credits:' "$lock" | awk '{print $2}' | tr -d '"')
            if [ -n "$value" ] && [ "$value" -gt "$limit" ]; then
              echo "::warning file=$lock::max-ai-credits ($value) exceeds org recommendation ($limit)."
            fi
          done
```

Commit and push the updated file, then open a test pull request that changes a workflow file to verify both checks run.

### Verify the policy in action

Open a pull request that changes a workflow `.md` file. The **Agentic Workflow Policy Check** should appear under the **Checks** tab. If configured as a required workflow, the merge button stays disabled until the check passes.

## ✅ Checkpoint

- [ ] Your organisation has a `.github` repository with a `workflow-templates/` folder
- [ ] `aw-policy.yml` and `aw-policy.properties.json` are committed to that folder
- [ ] The policy workflow runs on a test pull request and the lock-file check passes
- [ ] You configured the workflow as a required workflow (or know the equivalent branch-protection approach for your plan)
- [ ] You can explain the difference between a workflow template and a required workflow
- [ ] You added the budget-limit warning step and verified it produces a warning for an over-limit value

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
