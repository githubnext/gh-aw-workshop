# Reach Across Repositories with Agentic Workflows

> _A single scheduled workflow can query dozens of repositories at once — unlocking org-wide reporting that would take hours to do manually._

## 🎯 What You'll Do

Add the `cross-repository` capability to your existing daily-status workflow so your agent can read issues, PRs, and activity from multiple repositories in your organisation. By the end, you'll have one workflow that produces a consolidated status report covering several repos.

## 📋 Before You Start

- You have a working daily-status workflow from [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- Your workflow has the `github: mode: gh-proxy` tool configured (covered in [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)).
- You have read access to at least two repositories in your organisation.

## Steps

### Understand what cross-repository means

By default, each workflow run has a `GITHUB_TOKEN` scoped to the repository where the workflow lives. The `cross-repository` capability expands the agent's read access to other repositories in the same organisation, using the same token scope.

> [!NOTE]
> Cross-repository access requires that your organisation's GitHub Actions policy allows workflows in this repository to read other repositories. Check **Settings → Actions → General** in your organisation if runs fail with a permission error.

### Enable cross-repository read access in frontmatter

Open `.github/workflows/daily-status.md` in your Codespace and prompt your AI agent:

```prompt
Add cross-repository read access to my daily-status workflow so it can read issues and pull requests from up to five other repositories in my organisation.
```

The agent will update your frontmatter to include a `cross-repository` block. The result looks similar to this:

```yaml
cross-repository:
  read:
    - owner: your-org
      repo: repo-one
    - owner: your-org
      repo: repo-two
```

Replace `your-org`, `repo-one`, and `repo-two` with real names from your organisation.

### Update the task brief to aggregate across repos

Your agent brief needs to tell the AI _what_ to do with the extra repositories. Prompt your agent again:

```prompt
Update the task brief so the agent reads open issues and recent pull requests from each cross-repository entry and includes a short section for each repo in the daily status report.
```

Keep the brief focused: one section per repo, two or three sentences maximum. Long briefs cost more tokens.

### Recompile and verify

After the agent applies both changes, run:

```bash
gh aw compile daily-status
```

Fix any errors, then commit both `daily-status.md` and `daily-status.lock.yml`:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add cross-repository read to daily-status workflow"
git push
```

### Run and check the output

Dispatch a manual run from the **Actions** tab. Open the run log and look for tool calls that reference your extra repositories. The final report should include a section for each repo you listed.

> [!TIP]
> If a repo section is missing, check that the repository name in `cross-repository.read` exactly matches the repository slug, including capitalisation.

## ✅ Checkpoint

- [ ] Your workflow frontmatter includes a `cross-repository.read` block listing at least two repositories
- [ ] Your task brief instructs the agent to report on each listed repository
- [ ] `gh aw compile daily-status` completed without errors
- [ ] Both `daily-status.md` and `daily-status.lock.yml` are committed and pushed
- [ ] A manual run completed and the log shows tool calls to the extra repositories
- [ ] The workflow output includes a distinct section for each repository

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
