<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Your Agentic Workflows with Org-Level Policy Controls

> _Enterprise teams need guardrails — policy controls let you define exactly which AI actions are allowed, who must approve deployments, and how to stay compliant across your organisation._

## :dart: What You'll Do

You'll learn how GitHub organisation administrators configure policies for agentic workflows, then apply those policies to your own workflow using `required-reviewers` and permission scoping. By the end, you can describe the governance model to a security team and demonstrate that your workflows respect it.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md) or any of the audit and cost management nodes.
- You have Owner or Admin access to the practice organisation, **or** you can read along while your admin demonstrates the settings.
- You understand GitHub Actions [permissions](https://github.github.com/gh-aw/reference/permissions/) and [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/).

## Steps

### Understand the governance model

Agentic workflows run inside GitHub Actions — which means all Actions governance features apply. On top of that, gh-aw adds a second layer of controls at compile time and at the safe-output declaration level.

There are three places where an organisation can enforce policy:

| Layer | Where configured | What it controls |
|---|---|---|
| **GitHub Actions policy** | Organisation → Settings → Actions | Which workflows can run, which runner types are allowed, which external actions can be referenced |
| **gh-aw safe-output allow list** | Workflow frontmatter (`safe-outputs:`) | Which write operations the AI agent is allowed to perform |
| **Required reviewers** | Branch protection rules + environment rules | Who must approve a workflow run before it deploys or writes |

Understanding all three layers is essential for enterprise teams. The safest workflows use all three together.

### Review your workflow's safe-output declarations

Open your `daily-status.md` (or another workflow you built earlier) and read the `safe-outputs:` block in the frontmatter.

Ask your AI agent to audit it for over-broad permissions:

```bash
gh copilot
```

Then paste:

```prompt
/agentic-workflows review the safe-outputs block in daily-status.md and flag any declarations that are broader than the workflow strictly needs
```

The agent will check whether each declared output type (create-issue, push-to-branch, etc.) is referenced in the task brief, and whether scopes could be narrowed.

### Add a required-reviewers environment rule

For workflows that write to production branches or create issues in sensitive repositories, require a human to approve each run.

In your practice repository, create an Actions environment named `agentic-write`:

1. Go to your practice repository on GitHub.com.
2. Click **Settings** → **Environments** → **New environment**.
3. Name it `agentic-write` and click **Configure environment**.
4. Under **Required reviewers**, add yourself (or a team).
5. Click **Save protection rules**.

Now reference that environment in your workflow frontmatter:

```yaml
---
on:
  workflow_dispatch:

jobs:
  daily-status:
    runs-on: ubuntu-latest
    environment: agentic-write
    permissions:
      issues: write
      contents: read
---
```

Any run of this workflow will pause and wait for your approval before the agent executes.

### Narrow permissions to least-privilege

Review the `permissions:` block. Remove any permission the workflow does not actively use.

Ask your AI agent to help:

```bash
gh copilot
```

Then paste:

```prompt
/agentic-workflows update daily-status.md to use the narrowest permissions block that still allows the workflow to create issues and read repository contents
```

Compile to confirm no errors:

```bash
gh aw compile daily-status
```

### Check organisation-level Actions policy (admin step)

> [!NOTE]
> This step requires organisation Owner or Admin access. If you are a participant in a workshop session, your admin will demonstrate this. You can follow along at read-only access.

In the practice organisation, navigate to **Settings** → **Actions** → **General**. Review:

- **Actions permissions**: Is the org set to allow only actions from trusted sources?
- **Workflow permissions**: Is the default token set to read-only (recommended)?
- **Fork pull request workflows**: Are workflows from forks blocked from accessing secrets?

If any of these are set more broadly than necessary, recommend tightening them to your security team.

### Review the gh-aw governance guide

Read the [governance guide](https://github.github.com/gh-aw/guides/governance/) for a complete reference on safe-output allow lists, audit trails, and policy enforcement patterns used in enterprise deployments.

## :white_check_mark: Checkpoint

- [ ] You can describe the three governance layers (Actions policy, safe-output allow list, required reviewers) and what each controls
- [ ] You added an `environment: agentic-write` rule with at least one required reviewer to your workflow
- [ ] You narrowed the `permissions:` block to the minimum needed for your workflow
- [ ] Your AI agent reviewed the `safe-outputs:` declarations and confirmed no over-broad scopes remain
- [ ] `gh aw compile` succeeded after your frontmatter changes
- [ ] You know where to find the [governance guide](https://github.github.com/gh-aw/guides/governance/) for your security team

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
