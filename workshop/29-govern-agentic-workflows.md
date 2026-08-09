<!-- page-journey: all -->
<!-- page-adventure: enterprise -->
# Govern Agentic Workflows Across Your Organization

> _Turn individual workflow discipline into organisation-wide policy — so every team's agentic workflows stay secure and auditable by default._

## :dart: What You'll Do

You'll configure organisation-level guardrails for agentic workflows: set a Copilot policy that controls which models teams can use, create a reusable caller workflow that enforces a minimum-permission baseline, and verify that the policy appears in your audit trail. By the end, your organisation has a repeatable governance layer that new workflows inherit automatically.

## :clipboard: Before You Start

- You completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have **organisation owner** or **enterprise admin** access in your GitHub organisation.
- You have at least one agentic workflow compiled and running from a previous step.

> [!NOTE]
> This step is aimed at enterprise teams (GitHub Enterprise Cloud or GHES 3.12+). If you are on a personal account, you can still follow the permission-scoping section to apply least-privilege locally.

## Steps

### Review the Copilot policy for your organisation

Organisation owners can restrict which Copilot models agentic workflows may call.

1. Open your organisation on GitHub.
2. Go to **Settings** → **Copilot** → **Policies**.
3. Under **Agentic workflows**, confirm that the allowed model list matches what your teams actually need. Remove any models that are not approved for your security classification.
4. Save your changes.

If your organisation uses GHES, the policy panel is at **Admin** → **Copilot** → **Access**.

### Set a minimum-permission baseline with a reusable caller

Rather than trusting each team to write correct `permissions:` blocks, create a shared caller workflow that enforces the baseline for you.

Create `.github/workflows/aw-caller-policy.md`:

```yaml
---
name: AW Caller Policy
on:
  workflow_call:
    inputs:
      workflow-ref:
        required: true
        type: string

permissions:
  contents: read
  pull-requests: read

jobs:
  run-agentic:
    uses: ./.github/workflows/${{ inputs.workflow-ref }}
    permissions:
      contents: read
      pull-requests: read
---
```

Any team that calls this caller inherits these scoped permissions. Compile and commit the policy:

```bash
gh aw compile aw-caller-policy
git add .github/workflows/aw-caller-policy.md .github/workflows/aw-caller-policy.lock.yml
git commit -m "chore: add org-level caller policy for agentic workflows"
git push
```

### Verify the audit trail includes the policy

Run any agentic workflow through the new caller, then inspect the artifact:

```bash
gh aw audit --workflow aw-caller-policy --last 1
```

Confirm the report shows `permissions: contents: read` and no additional scopes. The `firewall.md` section should list only domains your approved workflows need.

### Document the policy for your team

Add a short `AGENTIC-POLICY.md` in `.github/` that lists:
- Approved models and their use cases
- Minimum required permissions by workflow type
- The link to the reusable caller
- Who to contact if a workflow needs an exception

This file becomes the human-readable companion to the machine-enforced guardrails above.

## ✅ Checkpoint

- [ ] You reviewed the Copilot model policy for your organisation and removed any unapproved models
- [ ] You created `aw-caller-policy.md`, compiled it, and pushed the result
- [ ] You ran a workflow through the caller and confirmed the audit report shows only the scoped permissions
- [ ] You created or updated `AGENTIC-POLICY.md` with your team's approved model list and escalation contact
- [ ] You can explain why a shared caller workflow is more reliable than asking each team to set permissions individually

<!-- journey: all -->
Want to explore another area? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
