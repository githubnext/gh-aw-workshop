<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at Scale

> _Without guardrails, autonomous AI workflows can drift — governance keeps them trustworthy, auditable, and compliant as your organisation grows._

## 🎯 What You'll Do

Apply organisation-level governance controls to your agentic workflows: required review gates, permission scoping, and branch protection rules. By the end, you'll have a governance checklist any workflow author on your team can follow.

## 📋 Before You Start

- You have a scheduled agentic workflow running from [Schedule It to Run Every Day](12-test-and-iterate.md).
- You have reviewed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and understand how run artifacts are produced.
- You have admin access to the repository or organisation you want to govern (or can ask someone who does).

## Steps

### Understand what governance covers

Governance sits at three levels: **workflow file** (permissions, timeouts, cost caps), **repository** (branch protection, required reviewers, Actions policy), and **organisation** (runner restrictions, spending limits, Copilot policy).

### Scope permissions explicitly

Every agentic workflow should declare only the permissions it needs. Open your workflow file in the Codespace editor and check the `permissions:` block.

A minimal read-only workflow might look like this:

```yaml
permissions:
  contents: read
  issues: read
```

A workflow that posts a comment needs `issues: write` instead of `issues: read`. Only declare what you actually use — principle of least privilege.

> [!TIP]
> The [permissions reference](https://github.github.com/gh-aw/reference/permissions/) lists every scope agentic workflows can request.

### Add a required reviewer for workflow changes

When a workflow runs unattended with write permissions, changes to its source file carry risk. Protect against accidental or malicious edits by requiring code-owner review.

In your repository:

1. Open **Settings → Branches**.
2. Add (or edit) a branch protection rule for `main`.
3. Enable **Require a pull request before merging** and set the minimum approver count to `1`.
4. Enable **Require review from Code Owners** if your repository has a `CODEOWNERS` file.
5. Click **Save changes**.

Now add a `CODEOWNERS` entry so that changes to `.github/workflows/` always require your team's review:

```text
.github/workflows/ @your-org/workflow-owners
```

Create or update `.github/CODEOWNERS` with that line, then commit and push:

```bash
git add .github/CODEOWNERS
git commit -m "chore: require workflow-owners review for .github/workflows changes"
git push
```

### Set a default token permission policy

By default, GitHub Actions grants `GITHUB_TOKEN` read and write access. Narrow the default at the organisation level so new workflows cannot write without an explicit declaration.

1. Go to your organisation's **Settings → Actions → General**.
2. Under **Workflow permissions**, select **Read repository contents and packages permissions**.
3. Click **Save**.

With this in place, any workflow that needs to write must declare `permissions: write` explicitly. It can no longer silently inherit broad access.

> [!NOTE]
> Changing this organisation policy does not affect existing workflow runs already in progress. New runs pick up the new default immediately.

### Validate permissions on every compile

Run `gh aw compile` after any change to `permissions:`, triggers, or tool declarations.

```bash
gh aw compile
```

A warning about a missing permission scope means the agent may fail silently at runtime instead of surfacing a clear error. Fix warnings before committing.

### Go deeper

The gh-aw docs cover policy templates, enterprise runner restrictions, and multi-repo fleet management: [Governance guide](https://github.github.com/gh-aw/guides/governance/).

## ✅ Checkpoint

- [ ] Your workflow's `permissions:` block lists only the scopes it actually uses
- [ ] Branch protection on `main` requires at least one pull-request approval before merging
- [ ] `.github/CODEOWNERS` routes `.github/workflows/` changes to an owner group
- [ ] The organisation's default workflow permission is set to read-only
- [ ] `gh aw compile` produces no permission-scope warnings on your workflow file
- [ ] You can name the three governance levels (workflow, repository, organisation) and give one control at each level

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
