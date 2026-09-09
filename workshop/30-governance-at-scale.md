<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Configuration governance for agentic workflows at scale — `gh aw env` defaults and `GH_AW_POLICY_*` runtime policy variables across repository, organization, and enterprise scopes</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/governance/</source>
    <source>https://github.github.com/gh-aw/reference/environment-variables/</source>
    <source>https://github.github.com/gh-aw/reference/cost-management/</source>
  </sources>
  <rationale>Steps 1-29 teach learners to build, test, and compose individual workflows, but every guardrail (timeouts, AI credit caps, model choice) is set one workflow file at a time. Enterprise and platform teams need a way to apply consistent defaults and hard policy gates across many repositories without editing every workflow. This step closes that gap by introducing `gh aw env` for layered defaults and `GH_AW_POLICY_*` variables for organization-wide capability gates, directly serving the enterprise tie-break rule in the authoring guidelines.</rationale>
</research-metadata>
-->

# Govern Agentic Workflows Across Your Organization

> _Set guardrails once at the organization or enterprise level, instead of repeating them in every workflow file._

## :dart: What You'll Do

You'll export your workflow's current cost and timeout settings into a defaults file, apply them as repository-scope variables with `gh aw env`, and set one `GH_AW_POLICY_*` variable to block a risky capability org-wide. By the end, you'll know how defaults percolate from enterprise to organization to repository scope.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) and have `max-ai-credits` set in a workflow.
- You have `gh-aw` installed from [Install the gh-aw CLI Extension](06-install-gh-aw.md).
- _(Enterprise/org admins)_ You have permission to set repository or organization variables. Learners without admin access can still run the `--dry-run` steps below.

## Steps

### Export current defaults

`gh aw env` manages `GH_AW_DEFAULT_*` GitHub Actions variables at repository, organization, or enterprise scope. Export your repository's current values into a YAML file:

```bash
gh aw env get repo-defaults.yml --scope repo --repo OWNER/REPO
```

Open `repo-defaults.yml`. Add or adjust the cost and timeout guardrails you set manually in Step 26:

```yaml
default_max_ai_credits: "1000"
default_max_daily_ai_credits: "2500"
default_timeout_minutes: "10"
```

### Preview and apply the defaults

Always preview before writing variables:

```bash
gh aw env update repo-defaults.yml --scope repo --repo OWNER/REPO --dry-run
gh aw env update repo-defaults.yml --scope repo --repo OWNER/REPO
```

> [!NOTE]
> Workflow frontmatter always wins over a variable default. Precedence runs: frontmatter → repository → organization → enterprise → compiler fallback. Use defaults for the common case and keep frontmatter overrides rare and explicit.

### Set a policy gate

Defaults tune numbers; **policy variables** (`GH_AW_POLICY_*`) block capabilities outright. For example, to stop every workflow in an organization from opening pull requests:

```bash
gh variable set GH_AW_POLICY_ALLOW_CREATE_PULL_REQUEST \
  --org MY_ORG --body "false"
```

Any workflow with `safe-outputs.create-pull-request` configured now fails fast with a clear policy error instead of silently attempting the write.

> [!TIP]
> Enterprise and GHES teams: the same `--scope ent --enterprise MY_ENT` flag applies defaults across every organization in your enterprise. Layer enterprise baselines first, then narrow with organization or repository variables only where a team needs an exception.

## :white_check_mark: Checkpoint

- [ ] You exported your repository's current `GH_AW_DEFAULT_*` values with `gh aw env get`
- [ ] You previewed a defaults update with `--dry-run` before applying it
- [ ] You can explain the precedence order: frontmatter, repository, organization, enterprise, compiler fallback
- [ ] You identified one `GH_AW_POLICY_*` variable and what capability it gates
- [ ] You know which scope flag (`--scope repo`, `--scope org`, `--scope ent`) applies to your role

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
