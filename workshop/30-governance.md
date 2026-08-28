<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Govern Agentic Workflows Across Your Organization

> _When agentic workflows proliferate across teams, org-level governance keeps them consistent, auditable, and safe._

## :dart: What You'll Do

You'll learn how to apply organization-wide policies to agentic workflows using required workflows, approval rules, and permission controls. By the end, you'll know where the controls live, how to enforce them without blocking developers, and what a minimal governance baseline looks like.

## :clipboard: Before You Start

- You completed [What's Next? Keep Exploring](14-next-steps.md) and have at least one workflow running.
- You have owner or org admin permissions, **or** you're following along to understand what your platform team configures.

## Steps

### Understand the governance model

GitHub provides three layers of governance for agentic workflows:

1. **Repository permissions** — who can trigger or modify the `.lock.yml` file.
2. **Required workflows** — org-level workflows that run automatically on every repository, regardless of per-repo configuration.
3. **Deployment environments with approval gates** — a manual review step before an agentic workflow can write to production targets.

These layers work together. Repository permissions stop unauthorized changes to the workflow file itself. Required workflows ensure a baseline audit or compliance check always runs. Approval gates add a human review step for sensitive targets.

### Explore the governance reference

The gh-aw documentation contains a full governance guide:

> [!TIP]
> Read the [Governance guide](https://github.github.com/gh-aw/guides/governance/) for the complete policy reference, including org-level `network.allowed-domains` defaults and audit retention settings.

### Set a repository-level permissions baseline

Open your workflow's frontmatter and confirm `permissions:` is explicit and minimal. An overly broad permissions block is the most common governance gap:

```yaml
permissions:
  contents: read
  issues: write
```

Each permission should appear only if the workflow actually uses it. The agent brief should reference only the resources those permissions cover.

After editing, compile to confirm the frontmatter validates cleanly:

```bash
gh aw compile
```

### Review required workflows for your org

If your organization enforces required workflows, they appear under **Organization Settings → Actions → Required workflows**. Required workflows run in addition to any workflows in the repository — they cannot be disabled by repository owners.

To check whether a required workflow is already covering audit or compliance for agentic runs:

1. Open **Organization Settings** in the GitHub web UI.
2. Navigate to **Actions → Required workflows**.
3. Look for any workflow that calls `gh aw audit` or checks for a `.lock.yml` signature.

If no audit workflow exists, you can propose one using the patterns in [Step 25 — Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).

### Add an environment approval gate (optional but recommended)

For workflows that write to sensitive targets — publishing releases, creating org-level issues, or posting to external services — wrap the write step in a named environment that requires a reviewer:

```yaml
jobs:
  agentic-task:
    environment: production-approvals
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... agentic step
```

Define the `production-approvals` environment under **Repository Settings → Environments** and add at least one required reviewer.

> [!NOTE]
> Environment protection rules apply to the `.lock.yml` step, not to the `.md` source. The approval gate fires at runtime, not at compile time.

### Validate your governance baseline

Use your AI agent to review whether your workflow meets a minimal governance checklist. In your Codespace terminal, start the agent:

```bash
gh copilot
```

Then paste this prompt:

```prompt
Using the /agentic-workflows skill, review my daily-report-status.md workflow for governance compliance: check that permissions are minimal, safe-outputs are declared, network.allowed-domains is set, and no long-lived credentials are embedded. List any gaps.
```

The agent will audit the frontmatter and suggest specific edits. Apply each suggestion, then compile again:

```bash
gh aw compile
```

## :white_check_mark: Checkpoint

- [ ] You can name the three governance layers (permissions, required workflows, approval gates) and describe what each controls
- [ ] Your workflow's `permissions:` block contains only the scopes the workflow actually uses
- [ ] You checked your organization's **Required workflows** page and know whether an audit workflow is already enforced
- [ ] You know how to add an environment approval gate to a `.lock.yml` job
- [ ] You ran the governance review prompt and addressed at least one gap (or confirmed there were none)

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
