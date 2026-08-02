<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Govern Agentic Workflows at Scale

> _Before you roll out agentic workflows across a team or organisation, put guardrails in place — so every workflow operates within your security and compliance boundaries._

## :dart: What You'll Do

You'll apply organisation-level governance controls to your agentic workflows: trim safe-output types, configure required reviewers, and document a change-management process. By the end, your workflows are ready for broader rollout in a team or enterprise environment.

## :clipboard: Before You Start

- You completed [Verify Your Workflow Quality with Evals](27-evaluate-workflow-quality.md).
- You have admin access to your practice repository (or a staging repository in your org).

## Steps

### Review what your workflow can write

Open `.github/workflows/daily-status.md` (or whichever workflow you're governing) and find the `safe-outputs:` section. Read each entry:

```yaml
safe-outputs:
  - type: ISSUE
    max: 1
  - type: COMMENT
    max: 5
```

Ask yourself: does each output type match the workflow's stated purpose? Remove any type the workflow does not strictly need. Minimising `safe-outputs` limits the blast radius if the agent misjudges its task.

After editing, recompile:

```bash
gh aw compile
```

### Lock permissions to the minimum required

Find the `permissions:` block in your workflow frontmatter. Reduce each permission to `read` unless the workflow explicitly writes to that resource.

Example of a tightly scoped read-only workflow:

```yaml
permissions:
  issues: write
  contents: read
  pull-requests: read
```

Only `issues` needs write access if the workflow creates issues. Everything else reads.

### Add a required reviewer in GitHub

A required reviewer forces a human approval before a workflow run writes any output. This matters most for workflows that post public comments, open issues, or modify repository content.

1. In your repository, go to **Settings → Environments**.
2. Create an environment named `agentic-production`.
3. Under **Deployment protection rules**, add yourself (or a teammate) as a **Required reviewer**.
4. Add the environment name to your workflow frontmatter:

```yaml
environment: agentic-production
```

Recompile after the change:

```bash
gh aw compile
```

On the next manual run, GitHub pauses before the write step and waits for your approval. You'll see a **Review deployments** button in the Actions UI.

> [!NOTE]
> Required reviewers are available on GitHub Free for public repositories and on GitHub Team and GitHub Enterprise Cloud for private repositories. On GitHub Enterprise Server, consult your administrator about environment protection rule availability.

### Document your governance decisions

Create a short `GOVERNANCE.md` at the repository root. Use your AI agent:

```bash
gh copilot
```

```prompt
Draft a GOVERNANCE.md file documenting the agentic workflow owner, allowed safe-output types, the required reviewer process, and how to propose a new workflow.
```

Review the draft and commit it.

### Review secrets in use

Agentic workflows that use external APIs store credentials as repository or organisation secrets. Open **Settings → Secrets and variables → Actions** and confirm each secret is still in use. Remove any that are not. Plan to rotate active secrets at least every 90 days.

## :white_check_mark: Checkpoint

- [ ] You trimmed `safe-outputs:` to only the types your workflow needs
- [ ] Your `permissions:` block grants write access only where strictly required
- [ ] You created an `agentic-production` environment with a required reviewer
- [ ] `environment: agentic-production` is in your workflow frontmatter and `gh aw compile` succeeded
- [ ] A manual run paused at the deployment gate before writing
- [ ] You created a `GOVERNANCE.md` documenting workflow scope and ownership
- [ ] You confirmed all repository secrets are current

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
