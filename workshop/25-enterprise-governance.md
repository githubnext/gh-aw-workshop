# Govern Agentic Workflows Across Your Organisation

> _Running agentic workflows at scale means more than just shipping automations — it means knowing who can run what, who can see the results, and how to stay compliant._

## 🎯 What You'll Do

You will learn how GitHub's policy controls and audit log give your enterprise visibility and governance over agentic workflows. By the end of this step, you will know how to restrict workflow permissions at the organisation level, verify that your workflows run with least-privilege access, and locate agentic workflow events in the GitHub audit log.

## 📋 Before You Start

- You have at least one agentic workflow running in a repository (see [Step 12: Test and Iterate](12-test-and-iterate.md)).
- You have access to an organisation on GitHub.com, GHEC, or GHES 3.12+.
- For organisation-level policy changes, you need **organisation owner** or **enterprise owner** access. If you only have repository access, read through this step to understand the controls available to your admin.

> [!NOTE]
> Some policy settings described here are only available to organisation owners or enterprise admins. If you are a repository user without those permissions, bookmark this step and revisit it when you have a governance conversation with your admin.

## Understand the permission surface

Agentic workflows use standard GitHub Actions permissions. The `permissions:` block in your workflow frontmatter declares exactly what the `GITHUB_TOKEN` can do during a run.

A minimal, least-privilege frontmatter looks like this:

```yaml
---
name: Daily Status
on:
  schedule: daily
permissions:
  contents: read
  issues: write
---
```

Two principles apply:

1. **Explicit over implicit.** List only the scopes your workflow actually needs. Omitting the `permissions:` block grants default token permissions, which can be broader than necessary.
2. **Organisation policy as a ceiling.** Even if a workflow requests `contents: write`, an organisation policy can cap the effective permission at `read`. Your workflow cannot exceed the ceiling set by your admin.

## Set organisation-level default token permissions

Organisation owners can restrict the maximum token permissions for all workflows in the org.

### Set default workflow permissions in the UI

1. Go to your organisation on GitHub and click **Settings**.
2. Under **Actions**, click **General**.
3. Scroll to **Workflow permissions**.
4. Select **Read repository contents and packages permissions** to restrict all workflows to read-only by default.
5. Optionally, uncheck **Allow GitHub Actions to create and approve pull requests** to prevent automated PR creation across the org.
6. Click **Save**.

> [!TIP]
> Start with the most restrictive setting and loosen it per repository if needed. This is easier to audit than starting permissive and trying to tighten later.

Individual repositories can override the org default in their own **Settings → Actions → General → Workflow permissions** page, but they cannot grant _more_ than the org ceiling allows.

## Control which repositories can run agentic workflows

If your organisation uses GitHub Enterprise Cloud or GHES, you can restrict which repositories are allowed to use GitHub Actions at all — and therefore which repositories can run agentic workflows.

### Restrict repository access in the UI

1. Go to your organisation **Settings → Actions → General**.
2. Under **Policies**, choose one of:
   - **Allow all actions and reusable workflows** — no restriction.
   - **Allow enterprise, and select non-enterprise, actions and reusable workflows** — curate an allowlist.
   - **Allow only actions defined by this repository** — most restrictive.
3. Click **Save**.

> [!NOTE]
> The `gh-aw` extension compiles workflows to standard GitHub Actions YAML. The restriction above applies to actions called _inside_ the compiled workflow, not to the agentic runner itself.

## Review agentic workflow runs in the audit log

Every workflow run — including agentic ones — produces events in the GitHub audit log. Use the audit log to answer questions such as: Who triggered this run? Which actor approved the deployment? Did the workflow modify repository contents?

### Review audit log in the UI

1. Go to your organisation **Settings → Audit log**.
2. In the search box, enter `action:workflows.completed` to see finished workflow runs.
3. To narrow to a specific repository, add `repo:your-org/your-repo`.
4. Click any entry to expand the event details.

Key audit event types for agentic workflows:

| Event | What it means |
|-------|---------------|
| `workflows.created` | A new workflow file was committed |
| `workflows.completed` | A workflow run finished (includes conclusion: success/failure) |
| `org.update_actions_settings` | An org policy was changed |

<details>
<summary>💻 Terminal path — query audit log with gh</summary>

```bash
gh api \
  "/orgs/YOUR_ORG/audit-log?phrase=action:workflows.completed&per_page=20" \
  --paginate \
  --jq '.[] | {actor, action, repo, created_at, conclusion: .data.conclusion}'
```

Replace `YOUR_ORG` with your organisation slug. The `--jq` filter extracts the most useful fields.

</details>

## Apply branch protection to guard workflow files

Agentic workflow definitions live in `.github/workflows/`. Treat these files with the same care you give to application code — they run with `GITHUB_TOKEN` and can write to your repository.

Recommended protections for the default branch:

- **Require pull request reviews** before merging changes to `.github/workflows/`.
- **Require status checks** so CI must pass before a workflow definition change lands.
- **Restrict who can push** to the default branch to a named team.

### Set branch protection in the UI

1. Go to your repository **Settings → Branches**.
2. Click **Edit** next to your default branch rule (or **Add branch protection rule**).
3. Enable **Require a pull request before merging** and set the required number of reviewers.
4. Enable **Restrict who can push to matching branches** and add your trusted team.
5. Click **Save changes**.

## ✅ Checkpoint

- [ ] Your workflow frontmatter includes an explicit `permissions:` block with only the scopes it needs
- [ ] You can locate the **Workflow permissions** setting in your organisation's Actions policy page
- [ ] You know how to restrict which repositories can use GitHub Actions in your org
- [ ] You can find completed workflow run events in the GitHub audit log
- [ ] Your default branch has a protection rule that requires review for changes to `.github/workflows/`
- [ ] You can explain the difference between the org-level permission ceiling and the per-workflow `permissions:` block

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [GitHub Actions permissions documentation](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [Organisation audit log documentation](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Side Quest: Secrets and Permissions](side-quest-16-02-secrets-and-permissions.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
