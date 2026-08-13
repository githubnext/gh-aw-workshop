<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at Scale

> _Shipping one workflow is easy; keeping dozens of them safe, consistent, and compliant across a whole organisation is a different challenge._

## :dart: What You'll Do

You will apply governance controls to your agentic workflows — restricting which models, tools, and safe-output actions each workflow may use, and wiring in an approval gate so changes to sensitive workflows require a human sign-off before they run.

## :clipboard: Before You Start

- You have at least one compiled agentic workflow from [Your First Agentic Workflow](07-your-first-workflow.md) and have run it successfully ([Run Your Workflow](08-run-your-workflow.md)).
- Your workflows are committed to a repository with GitHub Actions enabled.
- For the approval-gate section you need a team or individual to add as a required reviewer.

## Steps

### Understand the governance surface

Three frontmatter keys shape what an agentic workflow is allowed to do at runtime:

| Key | What it controls |
|-----|-----------------|
| `permissions` | GitHub token scopes granted to the workflow |
| `tools` | GitHub tools (and MCP tools) the agent may call |
| `models` | AI models the agent is allowed to use |

Locking these keys to the minimum needed is the first layer of governance.

Open your `daily-status.md` workflow and review the `permissions` block. Tighten it so the workflow has only the scopes it actually needs:

```yaml
---
name: daily-status
on:
  schedule:
    - cron: "0 8 * * 1-5"
permissions:
  issues: write
  contents: read
models:
  default: copilot/gpt-4.1
  allow:
    - copilot/gpt-4.1
---
```

The `models.allow` list is the allowlist — the agent refuses to switch to any model not listed here, even if the brief explicitly requests one.

After editing, recompile:

```bash
gh aw compile daily-status
```

### Restrict available tools

Add a `tools` block that lists only the GitHub tools your workflow actually needs. Omit any tool category you do not use:

```yaml
tools:
  github:
    - create_issue
    - list_issues
    - get_pull_request
```

Explicit tool restrictions prevent a prompt-injection attack from redirecting your agent toward actions — like pushing commits or deleting secrets — that were never intended.

Recompile after every change and confirm there are no validation errors.

### Add a required reviewer for sensitive workflows

For workflows that write to production branches, create issues in external trackers, or hold elevated permissions, add a [GitHub environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) with a required reviewer:

1. In your repository, go to **Settings** → **Environments** → **New environment**.
2. Name it `governance-review`.
3. Under **Required reviewers**, add yourself or a trusted teammate.
4. In your workflow's Actions YAML (the compiled `.lock.yml` references an `environment:` key — do not edit the lock file directly; instead set the field in frontmatter):

```yaml
---
name: sensitive-workflow
environment: governance-review
---
```

1. Recompile the workflow:

```bash
gh aw compile sensitive-workflow
```

Now every run pauses at the environment gate and waits for a manual approval before the agent executes.

### Document your governance decisions

Add a comment block at the top of the workflow's Markdown body explaining what the workflow is allowed to do and why:

```markdown
<!-- governance
  permissions: issues:write, contents:read
  tools: create_issue, list_issues, get_pull_request
  model-allowlist: copilot/gpt-4.1
  reviewer-env: governance-review
  rationale: This workflow opens issues automatically. It must not push code or
              read secrets, so contents:write and secrets:read are excluded.
-->
```

This comment is ignored at compile time but serves as in-file documentation for auditors and future editors.

> [!TIP]
> Keep governance decisions close to the workflow they apply to. A comment block inside the `.md` file is easier to maintain than a separate policy spreadsheet.

### Review the governance guide

The full reference for governance patterns — including org-wide policy files, branch protection integration, and GHES-specific controls — is in the [Governance guide](https://github.github.com/gh-aw/guides/governance/).

## :white_check_mark: Checkpoint

- [ ] Your `daily-status.md` (or another workflow) includes a `models.allow` list with at least one model
- [ ] Your workflow has a `permissions` block with only the scopes it uses
- [ ] Your workflow has a `tools.github` list with only the tools it calls
- [ ] `gh aw compile daily-status` succeeds after all changes
- [ ] You created a `governance-review` environment (or equivalent) with at least one required reviewer
- [ ] You added a `<!-- governance ... -->` comment block to at least one workflow file
- [ ] You can explain the difference between `permissions` (token scopes) and `tools` (agent actions)

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
