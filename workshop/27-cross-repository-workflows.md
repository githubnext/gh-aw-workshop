<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Run Agentic Workflows Across Multiple Repositories

> _One workflow can monitor, analyse, or act on many repositories at once — useful for teams, monorepos, and enterprise fleets._

## 🎯 What You'll Do

You'll extend your daily-status workflow to query a second repository in addition to the one that hosts your workflow.
By the end, you'll know how to pass cross-repository context into your agent prompt and how to set the permissions your workflow needs to read other repos.

## 📋 Before You Start

- You have a working daily-status workflow from [Test and Improve Your Workflow](12-test-and-iterate.md).
- You understand how `permissions:` works in [gh-aw frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).
- You know how to run `gh aw compile` and push the updated `.lock.yml`.

## Why Cross-Repository Workflows Matter

Each agentic workflow runs inside one host repository, but the agent can **read data from any repository it has permission to access** — letting you track issues across a product suite, aggregate release notes, or flag security alerts for an entire enterprise fleet.

## Grant the Necessary Permissions

A workflow hosted in `my-org/platform-hub` can read another repository, `my-org/api-service`, using the same `GITHUB_TOKEN` **as long as the token is granted the required scopes** in frontmatter.

Open your workflow source file and update the `permissions:` block:

```yaml
permissions:
  contents: read       # host repo — already set
  issues: read         # host repo issues
  metadata: read       # required for cross-repo access to public repo metadata
```

> [!NOTE]
> `metadata: read` is automatically granted to `GITHUB_TOKEN` on GitHub.com but must be listed explicitly to be visible in your frontmatter record for enterprise audits. For private repositories in a different org, you need a Personal Access Token (PAT) or a GitHub App installation token stored as a secret.

## Add a Step That Fetches the Remote Repo

Agentic workflows can run deterministic steps before the AI agent executes.
Use a `run:` step to fetch data from the second repository and write it to `$GITHUB_OUTPUT` so the agent prompt can reference it via the `${{ steps.<id>.outputs.<name> }}` template variable.

Add a step to your workflow frontmatter:

```yaml
jobs:
  report:
    steps:
      - name: Fetch remote issues
        id: remote_issues
        run: |
          count=$(gh issue list \
            --repo my-org/api-service \
            --state open \
            --json number \
            --jq 'length')
          echo "count=$count" >> "$GITHUB_OUTPUT"
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to your workflow `.md` file in the repository on GitHub.
2. Click the **pencil icon (✏️)** to edit it.
3. Add the `jobs:` block with the `run:` step shown above.
4. Click **Commit changes**.

Note: you still need to run `gh aw compile` locally (or rely on an Actions compile job) before the updated lock file is pushed and the changes take effect.

</details>

## Reference the Remote Data in Your Agent Brief

In the Markdown body of your workflow (the agent brief), refer to the output using a template variable:

```markdown
## Task

Summarise the current health of the platform:

- Host repository open issues: ${{ github.repository }}
- Remote repository open issues: ${{ steps.remote_issues.outputs.count }} (my-org/api-service)

Highlight any unusual spikes compared with recent history.
```

The `${{ steps.<id>.outputs.<name> }}` expression is evaluated at compile time and injected into the compiled lock file.
When the workflow runs, the agent sees the actual count.

## Compile and Test

After saving your changes, regenerate the lock file:

```bash
gh aw compile
```

Then push both files:

```bash
git add .github/workflows/daily-report-status.md \
        .github/workflows/daily-report-status.lock.yml
git commit -m "feat: add cross-repo context to daily status workflow"
git push
```

Trigger a manual run from the **Actions** tab and open the run log.
Confirm the `Fetch remote issues` step completes and the agent summary mentions both repositories.

## ✅ Checkpoint

- [ ] Your workflow `permissions:` block includes `metadata: read`
- [ ] Your frontmatter includes a `run:` step that queries a second repository
- [ ] The step writes its output to `$GITHUB_OUTPUT` with a named key
- [ ] Your agent brief references that output via `${{ steps.<id>.outputs.<name> }}`
- [ ] `gh aw compile` completed without errors
- [ ] A manual run completed and the summary mentions both repositories
- [ ] You can explain when you would need a PAT instead of `GITHUB_TOKEN`

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
