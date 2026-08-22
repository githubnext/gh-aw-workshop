<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at Scale

> _Agentic workflows make powerful things easy — which makes governance essential. Learn how to enforce policy, gate write access, and audit AI activity across an enterprise._

## :dart: What You'll Do

You will apply three enterprise governance controls to a real agentic workflow: required reviewers on environment-protected deployments, a `protected-files` block that prevents the agent from touching sensitive paths, and a `network.allowed` allowlist that limits outbound calls. By the end, you will have a workflow configuration that a security or platform team can confidently approve for production use.

## :clipboard: Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have admin access to the repository settings, or a colleague who does.
- If you are on GHES or GHEC, your enterprise admin has enabled required reviewers and deployment environments for Actions. See [Enterprise Setup Considerations](side-quest-enterprise-setup.md) if you are unsure.

## Steps

### Create a protected deployment environment

Deployment environments add a manual approval gate before the agent's job runs. Any write action the agent takes — comments, pull requests, branch pushes — is blocked until a designated reviewer approves.

1. Go to your repository on GitHub.com and open **Settings → Environments**.
2. Select **New environment** and name it `agentic-production`.
3. Under **Deployment protection rules**, enable **Required reviewers** and add yourself or a teammate.
4. Save the environment.

### Reference the environment in your workflow frontmatter

Open `.github/workflows/daily-status.md` (or any workflow you created in an earlier step) and add an `environment:` key to the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily
environment: agentic-production
permissions:
  issues: write
  contents: read
safe-outputs:
  - type: CREATE_ISSUE
    max: 1
---
```

Run `gh aw compile` to regenerate the lock file, then commit and push.

```bash
gh aw compile
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "Add agentic-production environment gate"
git push
```

### Add a `protected-files` block

A `protected-files` block tells `gh-aw` to refuse any safe-output that would write to the listed paths, even if the agent's brief asks for it.

```yaml
protected-files:
  - ".github/workflows/**"
  - "CODEOWNERS"
  - "package-lock.json"
```

Add this block to the same frontmatter, then recompile.

### Restrict outbound network calls

The `network.allowed` list in your frontmatter limits which external domains the agent can reach. Add an explicit allowlist to close the default wildcard:

```yaml
network:
  allowed:
    - defaults
```

`defaults` covers the GitHub API and any domains your skills require. Recompile after adding this block.

> [!TIP]
> Run `gh aw audit` after the next scheduled run to verify the firewall log shows only allowed domains. Any blocked domain appears in the `firewall.md` artifact so you can decide whether to add it or tighten the brief.

## :white_check_mark: Checkpoint

- [ ] Your repository has an `agentic-production` environment with at least one required reviewer configured in **Settings → Environments**
- [ ] Your workflow frontmatter includes `environment: agentic-production`, and `gh aw compile` succeeds with no errors
- [ ] A `protected-files` block guards `.github/workflows/**`, `CODEOWNERS`, or another sensitive path in your repository
- [ ] Your frontmatter includes `network: allowed: [defaults]` and you have recompiled successfully
- [ ] You triggered a manual run and confirmed the job paused at the deployment gate awaiting approval

**Next:** Return to [What's Next? Keep Exploring](14-next-steps.md) to choose another advanced path.
