<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Your Agentic Workflows at Scale

> _Protect your team and your codebase by setting org-level guardrails before your workflows go anywhere near production._

## :dart: What You'll Do

You'll configure organisation-level controls that limit what your agentic workflows can do: required reviewers on workflow changes, permitted engine allowlists, and minimum permission policies. When you finish, your org's agentic workflow surface will have clear, auditable guardrails rather than individual per-repo settings scattered across dozens of repositories.

## :clipboard: Before You Start

- You completed [Verify Your Workflow Quality with Evals](27-evaluate-workflow-quality.md).
- You have **Owner** or **Actions administrator** access to a GitHub organisation, or your enterprise admin has granted you the settings access described below.
- Enterprise users: your GHES instance is 3.12 or later and Copilot Enterprise is enabled (see [Enterprise Setup](side-quest-enterprise-setup.md)).

## Steps

### Understand the governance layers

Agentic workflows run inside GitHub Actions. That means all standard Actions governance controls apply — and a few agentic-specific ones layer on top.

| Layer | What it controls | Where to configure |
|---|---|---|
| **Actions permissions** | Which repos can run workflows at all | Org → **Settings** → **Actions** → **General** |
| **Workflow permissions** | Default `GITHUB_TOKEN` scope for all jobs | Org → **Settings** → **Actions** → **General** |
| **Required approvals** | Who must approve a workflow run triggered by an outside contributor | Org → **Settings** → **Actions** → **General** |
| **Agentic engine allowlist** | Which AI engines workflows may call | `gh aw policy` (see below) |
| **Protected files** | Files the agent may never write | Per-workflow `protected-files:` frontmatter |

Work through each layer in the order above — broader controls first, narrower controls second.

### Lock down default workflow permissions

Open your organisation's Actions settings page:

1. Go to your org → **Settings** → **Actions** → **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read repository contents and packages permissions**.
4. Check **Require approval for all outside collaborators** if your org includes contractors or external contributors.
5. Click **Save**.

> [!NOTE]
> This sets the baseline for every repository in the org. Individual repos can still grant broader permissions, but a new repo starts with the least-privilege default.

### Configure the agentic engine allowlist

The engine allowlist prevents workflows from calling AI models your organisation hasn't approved or budgeted for. Run this in your Codespace terminal:

```bash
gh aw policy engines list
```

You'll see output similar to:

```
Allowed engines: *  (all engines permitted)
```

To restrict to only Copilot (the recommended starting point):

```bash
gh aw policy engines set --allow copilot
```

To also allow Claude:

```bash
gh aw policy engines set --allow copilot --allow claude
```

Verify the change:

```bash
gh aw policy engines list
```

> [!TIP]
> If you're on GHEC or GHES, your enterprise admin can set an org-wide engine allowlist that individual org owners cannot override. Check with your admin before adding engines here.

### Protect sensitive workflow files

For workflows that touch secrets, credentials, or critical infrastructure, add a `protected-files:` block to the workflow frontmatter. This tells the agent it must never modify those paths, even if instructed to.

Open your daily-status workflow in the Codespace editor and ask your AI agent to add the block:

```prompt
Add a protected-files block to my daily-status workflow that prevents the agent from modifying any file under .github/workflows/ or any file named *.env or *.pem.
```

Your workflow frontmatter should now include something like:

```yaml
protected-files:
  - .github/workflows/**
  - "*.env"
  - "*.pem"
```

Run compile to apply the change:

```bash
gh aw compile daily-status
```

### Add required reviewers for workflow changes

Org-level branch protection rules extend to workflow files. To require a human to review every pull request that modifies `.github/workflows/`:

1. In your org, go to **Settings** → **Branches** → **Add rule**.
2. Set the branch name pattern to `main` (or your default branch).
3. Enable **Require a pull request before merging**.
4. Set **Required approvals** to at least `1`.
5. Under **Require review from Code Owners**, create a `CODEOWNERS` file in your repository root that assigns ownership of the workflow directory:

```
# Require a review from a workflow admin for all agentic workflow files
.github/workflows/ @your-org/workflow-admins
```

> [!IMPORTANT]
> Add at least one person to the `workflow-admins` team before enabling the rule, or no one will be able to merge workflow changes.

### Document your governance decisions

Your team needs to know which guardrails are in place and why. Create a brief governance note in your repository:

```prompt
Create a file called docs/agentic-workflow-governance.md that documents the engine allowlist we set, the protected-files list, and the CODEOWNERS rule. Include a short rationale for each decision.
```

Commit the file and open a pull request so the team can review and discuss the policy.

## :white_check_mark: Checkpoint

- [ ] Your org's default workflow permissions are set to **read-only**
- [ ] `gh aw policy engines list` shows only the engines your org has approved
- [ ] Your daily-status workflow frontmatter includes a `protected-files:` block
- [ ] `gh aw compile daily-status` succeeds after adding `protected-files:`
- [ ] A `CODEOWNERS` rule covers `.github/workflows/` and points to a team with at least one member
- [ ] A governance documentation file exists and is committed to your repository
- [ ] You can explain to a colleague why each layer of governance exists

<!-- journey: all -->
Want to explore other advanced topics? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
