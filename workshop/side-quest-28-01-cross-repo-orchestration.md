<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
<!--
<research-metadata>
  <focus>Cross-repository safe outputs (target-repo, allowed-repos) and cross-repository checkout for orchestrating agentic workflows across a multi-repository or enterprise estate</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/cross-repository/</source>
    <source>https://github.github.com/gh-aw/reference/checkout/</source>
    <source>https://github.github.com/gh-aw/reference/github-tools/</source>
  </sources>
  <rationale>Step 28 teaches single-repository orchestration with dispatch-workflow, but many enterprise estates split work across multiple repositories (a hub-and-spoke tracking repo, shared libraries, per-team component repos). No existing node covers target-repo, allowed-repos, or the extra github-token needed for cross-repo authentication. This side quest closes that gap for enterprise learners managing multi-repo orchestration.</rationale>
</research-metadata>
-->

# Side Quest: Orchestrate Across Multiple Repositories

> _Enterprise estates rarely fit in one repository — extend your orchestrator to read and write across repos safely._

## :dart: What You'll Do

You'll learn how `target-repo`, `allowed-repos`, and cross-repository `checkout:` let a single orchestrator workflow read from and create resources in repositories other than the one it runs in — the pattern enterprise teams use for hub-and-spoke tracking across many component repos.

## :clipboard: Before You Start

- You completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have (or can request) admin access to create a fine-grained PAT or GitHub App credential for a second repository.
- Your enterprise admin can confirm whether cross-repository PATs are permitted by org policy.

## Understand cross-repository authentication

`GITHUB_TOKEN` only grants access to the repository where a workflow runs. To read or write another repository, your workflow needs additional authentication — a PAT or GitHub App token stored as a secret.

> [!NOTE]
> On GHES or GHEC with restricted PAT policies, ask your admin whether a GitHub App is required instead of a personal PAT for cross-repo automation.

## Steps

### Add a target repository to a safe output

Most [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/) support `target-repo` to create resources in a different repository than the one running the workflow:

```yaml
safe-outputs:
  github-token: ${{ secrets.CROSS_REPO_PAT }}
  create-issue:
    target-repo: "org/tracking-repo"
    title-prefix: "[component] "
```

This is the **hub-and-spoke** pattern: several component-repo orchestrators file issues into one central tracking repository your enterprise team monitors.

### Allow the agent to pick from several repositories

If the target isn't known until runtime, use `allowed-repos` so the agent can choose:

```yaml
safe-outputs:
  github-token: ${{ secrets.CROSS_REPO_PAT }}
  create-issue:
    target-repo: "org/default-repo"
    allowed-repos: ["org/repo-a", "org/repo-b", "org/repo-c"]
```

The agent's tool call can then include a `repo` field, and gh-aw enforces that it only matches an allowed entry.

### Check out a second repository for context

To let the agent read files from another repository (not just create issues in it), add a `checkout:` entry with a `path:`:

```yaml
checkout:
  - fetch-depth: 0
  - repository: org/shared-libs
    path: ./libs/shared
    github-token: ${{ secrets.CROSS_REPO_PAT }}
```

> :thinking: **Predict:** If you omit `github-token:` on the second checkout entry and `org/shared-libs` is private, what happens? Check your answer by reading the [Cross-Repository Checkout](https://github.github.com/gh-aw/reference/cross-repository/#cross-repository-checkout-checkout) reference — the checkout fails silently or errors with a permission message, depending on visibility.

### Extend your orchestrator

Update `repo-orchestrator.md` to route findings into a central tracking repo, then compile:

```bash
gh aw compile repo-orchestrator
```

Confirm the compiled `.lock.yml` includes the `CROSS_REPO_PAT` secret reference and the `target-repo` value you configured.

## :white_check_mark: Checkpoint

- [ ] You can explain why `GITHUB_TOKEN` alone cannot reach other repositories
- [ ] You added `target-repo` to a safe output and understand the hub-and-spoke pattern
- [ ] You can explain the difference between `target-repo` and `allowed-repos`
- [ ] You added a `checkout:` entry with `path:` and `github-token:` for a second repository
- [ ] `gh aw compile repo-orchestrator` succeeded after your cross-repo changes
- [ ] You know whether your enterprise's PAT policy requires a GitHub App instead

<!-- journey: all -->
Return to [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
<!-- /journey -->
