<!-- page-journey: all -->
<!-- page-adventure: main -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need more than individual workflows — they need guardrails that keep every workflow across every team safe, consistent, and cost-controlled._

## :dart: What You'll Do

You'll apply organisation-level policy controls to agentic workflows: set required permissions, configure dispatch allowlists, and enable approval gates for high-risk writes. By the end, your organisation will have a baseline governance posture for running agentic workflows at scale.

## :clipboard: Before You Start

- You have completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) or [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You have **Admin** access to a GitHub organisation (GHEC or GHES 3.12+).
- Your organisation has Copilot Enterprise enabled and at least one agentic workflow committed to a repository.

## Steps

### Review your workflow's declared permissions

Every agentic workflow should declare only the scopes it actually uses. Open your `daily-status.md` and confirm the `permissions:` block is minimal:

```yaml
---
permissions:
  issues: write
  contents: read
---
```

Remove any scope you cannot justify. Undeclared scopes default to `read` in most contexts, so listing only what is needed reduces your blast radius if a prompt is misused.

### Enable organisation-wide required-reviewers for automated writes

For workflows that write to important branches or create releases, add a required reviewer:

1. Open your organisation's **Settings** → **Actions** → **General**.
2. Under **Fork pull request workflows**, confirm the approval policy matches your risk appetite.
3. For repositories that hold production configuration, navigate to **Settings** → **Environments**, create an environment called `agentic-writes`, and add at least one required reviewer.
4. In your workflow frontmatter, add the environment declaration:

```yaml
---
environment: agentic-writes
permissions:
  contents: write
---
```

This adds a manual approval gate. Any workflow run that reaches a write-output step will pause until a reviewer approves it in the Actions UI.

### Configure a workflow dispatch allowlist

When workflows dispatch other workflows (as in [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md)), you should limit which workflows are authorised to trigger which others.

In your orchestrator workflow, verify the `dispatch-workflow` block includes an explicit `workflows` allowlist:

```yaml
tools:
  dispatch-workflow:
    workflows:
      - daily-status
      - pr-reviewer
```

Workflows not in this list cannot be triggered by the orchestrator even if the agent asks. This is a compile-time constraint, not a runtime policy, so it is enforced before the agent ever runs.

> [!TIP]
> Run `gh aw compile --validate` on any orchestrator workflow after editing its allowlist to catch mis-spelled workflow names before they reach production.

### Review the `gh-aw` governance guide

The [governance guide](https://github.github.com/gh-aw/guides/governance/) walks through organisation-level settings including:

- Disabling agentic workflows for specific repositories.
- Requiring code-owner review before a compiled `.lock.yml` can be merged.
- Configuring audit-log streaming to an external SIEM.

Read the guide's **Policy matrix** table and note which controls require GHES 3.14+ or a GHEC-only setting.

### Validate your updated workflow

After any frontmatter change, recompile:

```bash
gh aw compile
```

Check the output for permission or environment warnings. Commit both the updated `.md` and the regenerated `.lock.yml`.

## :white_check_mark: Checkpoint

- [ ] Your workflow's `permissions:` block contains only the scopes you can justify
- [ ] You created (or identified an existing) `agentic-writes` environment with at least one required reviewer
- [ ] Your orchestrator workflow's `dispatch-workflow` block includes an explicit `workflows` allowlist
- [ ] `gh aw compile` succeeded with no warnings after your changes
- [ ] You read the governance guide's policy matrix and identified at least one control relevant to your deployment
- [ ] You know which governance controls require a GHES 3.14+ upgrade or a GHEC-only plan

<!-- journey: all -->
Want to explore more enterprise topics? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
