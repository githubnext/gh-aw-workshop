<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Your Agentic Workflows

> _Agentic workflows write to your repositories and call external APIs — putting guardrails in place keeps your organisation in control._

## 🎯 What You'll Do

You will add the three most impactful governance layers to your workflow: least-privilege permissions, CODEOWNERS review requirements, and a network allowlist. By the end of this step, your agentic workflow will only do what it was designed to do, and your team will have visibility and approval over any changes.

## 📋 Before You Start

- Your agentic workflow is running successfully (see [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)).
- You have admin access to your repository so you can edit branch protection rules.

> [!NOTE]
> If you are on GHES or GHEC, some of these settings may already be enforced at the organisation level. Confirm with your admin before making changes.

## Understand the risk surface

An agentic workflow has three places where things can go wrong:

1. **Permissions** — the `GITHUB_TOKEN` can make changes you did not intend if over-scoped.
2. **Code review** — the workflow `.md` and `.lock.yml` are code; changes should go through pull request review.
3. **Network access** — by default, an agentic workflow can reach any external URL; restricting it limits blast radius.

You do not need to address every risk today, but knowing where each lever lives puts you in control.

## Tighten permissions in frontmatter

Open your workflow file (for example, `.github/workflows/daily-status.md`) and look at the `permissions:` block:

```bash
code .github/workflows/daily-status.md
```

Start with the most restrictive permission set and add only what the workflow actually needs.
A reporting workflow that posts a comment and updates an issue needs very little:

```yaml
---
name: Daily Status Report
permissions:
  contents: read
  issues: write
---
```

Compare that to an over-permissive default:

```yaml
permissions: write-all   # ← never use this for agentic workflows
```

### Why it matters

If a repository file contains an injected instruction such as "delete all branches", a workflow with `contents: write` can obey it. One with `contents: read` cannot.

After editing, compile:

```bash
gh aw compile
```

Commit both files:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "security: apply least-privilege permissions to daily-status"
git push
```

## Protect your workflow files with CODEOWNERS

GitHub's CODEOWNERS feature automatically requests review from a specific team whenever a designated file changes. This means no one can silently update a workflow brief without approval.

### Create or edit the CODEOWNERS file

Open (or create) `.github/CODEOWNERS`:

```bash
code .github/CODEOWNERS
```

Add a rule covering all workflow source files:

```
# Require review for all agentic workflow definitions
.github/workflows/*.md @your-org/workflow-owners
.github/workflows/*.lock.yml @your-org/workflow-owners
```

Replace `@your-org/workflow-owners` with your team's GitHub slug (for example, `@acme-corp/platform-team`).

> [!TIP]
> You can also require approval from a specific individual if you are working in a personal repository: use `@username` instead of a team slug.

Commit the file:

```bash
git add .github/CODEOWNERS
git commit -m "governance: require workflow-owners review for workflow changes"
git push
```

### Enable required reviews in branch protection

1. Open **Settings → Branches** in your repository on GitHub.com.
2. Click **Edit** next to your default branch rule.
3. Enable **Require a pull request before merging** and set **Required approvals** to `1`.
4. Enable **Require review from Code Owners**.
5. Save the rule.

Now every change to a workflow `.md` file triggers a review request to your designated team.

## Restrict outbound network access

You can limit which external hosts your agentic workflow can reach by adding a `network:` block to your frontmatter:

```yaml
---
name: Daily Status Report
network:
  allowed-domains:
    - api.github.com
    - copilot-proxy.githubusercontent.com
---
```

Any tool call or HTTP request to a domain not on this list is blocked.
Start with GitHub's APIs, add MCP server hosts as you connect them, and remove the wildcard default.

> [!NOTE]
> The exact set of domains depends on which tools and safe-outputs your workflow uses. Run the workflow once after adding the allowlist to catch any blocked calls in the run log, then add missing domains as needed.

Compile after editing:

```bash
gh aw compile
```

## ✅ Checkpoint

- [ ] Your workflow's `permissions:` block lists only the scopes the workflow actually uses
- [ ] You can explain why `write-all` is dangerous for an agentic workflow
- [ ] A CODEOWNERS entry covers `*.md` and `*.lock.yml` files in `.github/workflows/`
- [ ] Branch protection on your default branch requires at least one code-owner approval
- [ ] Your workflow frontmatter includes a `network.allowed-domains` list with at least one entry
- [ ] `gh aw compile` completed without errors after your changes
- [ ] Both updated workflow files are committed and pushed

**Next:** [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
