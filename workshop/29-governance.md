<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need more than working workflows — they need a governed, auditable pipeline from author to production._

## :dart: What You'll Do

Set up org-level governance controls for your agentic workflows: a central catalog, a required-review gate before any workflow enters production, and a policy document your team can maintain and audit.

## :clipboard: Before You Start

- You completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md) or have at least one compiled workflow running in GitHub Actions.
- You have admin access to your GitHub organisation (or a practice org for this exercise).
- Enterprise Cloud or GitHub Enterprise Server 3.12+ is recommended, though the catalog and review pattern work on `github.com` too.

## Steps

### Understand the governance model

When agentic workflows run autonomously on a schedule or in response to events, they can read repository data, post comments, open pull requests, and dispatch other workflows. This power requires guardrails.

The governance model for agentic workflows has three layers:

| Layer | What it controls |
|---|---|
| **Permissions** | What the workflow can read and write (declared in frontmatter `permissions:`) |
| **Safe outputs** | Which write actions are allowed and how many (declared in frontmatter `safe-outputs:`) |
| **Catalog + review gate** | Whether a workflow is approved for production use by a human reviewer |

You already know layers one and two. This step focuses on layer three.

### Create a central workflow catalog repository

A catalog repository is a central place where your team tracks which agentic workflows are approved, who owns them, and when they were last reviewed.

1. In your GitHub organisation, create a new repository named **`agentic-workflow-catalog`**.

2. Add a `catalog.yml` file at the root:

```yaml
# agentic-workflow-catalog/catalog.yml
# One entry per approved agentic workflow.
workflows:
  - name: daily-status
    source_repo: my-org/my-practice-repo
    workflow_file: .github/workflows/daily-status.md
    owner: "@your-username"
    approved_by: "@reviewer-username"
    approved_at: "2026-08-04"
    triggers:
      - schedule
    permissions:
      issues: write
    safe_outputs:
      - create-issue
    notes: "Posts a daily repository health summary."
```

1. Commit and push `catalog.yml`.

### Add a required-review gate

A review gate is a pull-request-based approval step. Instead of committing a new workflow directly to your practice repository, you route it through a PR that requires a designated reviewer to approve before merging.

1. In your practice repository, go to **Settings → Branches → Branch protection rules**.

2. Add a rule for the `main` branch that requires at least one approving review before merge.

3. Under **Restrict who can dismiss pull request reviews**, add your team's security lead or workflow owner.

4. From now on, when you or a teammate creates a new agentic workflow, open a pull request instead of pushing directly. The PR body should include:

   - What the workflow does and when it triggers
   - Which `permissions:` it needs and why
   - Which `safe-outputs:` it uses and how many writes it allows
   - A link to the relevant entry in `agentic-workflow-catalog/catalog.yml` (or a draft entry)

> [!TIP]
> The PR reviewer checklist in [Pattern: PR Review Checklist](side-quest-13-03-pr-checklist-pattern.md) is a good starting point for a workflow-governance review template.

### Write a governance policy document

A short governance policy gives your team a shared contract. Create `.github/AGENTIC_WORKFLOW_POLICY.md` in your organisation's `.github` repository (which serves as the org-level community health file location):

```markdown
# Agentic Workflow Governance Policy

## Approval requirement

Every new or substantially changed agentic workflow must be reviewed and approved
via pull request before merging to `main`.

## Minimum review checklist

- [ ] `permissions:` block contains only the scopes the workflow genuinely needs
- [ ] `safe-outputs:` block explicitly names every allowed write action and sets a `max:` value
- [ ] The workflow brief is free of instructions that could be exploited by crafted repository content
- [ ] The workflow is registered in `agentic-workflow-catalog/catalog.yml`

## Quarterly review

Catalog entries older than 90 days must be re-reviewed to confirm the workflow
is still needed, still accurate, and still uses minimal permissions.
```

1. Commit this file to your org's `.github` repository.

### Verify the gate works

1. Create a new branch in your practice repository.
2. Add a small, harmless change to your `daily-status.md` workflow brief (for example, change one sentence in the agent task description).
3. Run `gh aw compile` to regenerate the lock file.
4. Open a pull request from your new branch to `main`.
5. Confirm the PR cannot be merged until a reviewer approves it.

> [!NOTE]
> On GitHub Enterprise Server, branch protection rules are managed the same way — your GHES admin may have set org-level default branch protections that apply automatically to new repositories.

## :white_check_mark: Checkpoint

- [ ] You created an `agentic-workflow-catalog` repository in your org with a `catalog.yml` entry for at least one workflow
- [ ] Your practice repository's `main` branch requires at least one approving review before merge
- [ ] You created `.github/AGENTIC_WORKFLOW_POLICY.md` in your org's `.github` repository
- [ ] You opened a practice PR that required approval before merge
- [ ] You can explain why each of the three governance layers (permissions, safe outputs, catalog+review) matters independently

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
