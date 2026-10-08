<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Many Repositories

> _Once more than one repository runs agentic workflows, you need shared defaults and policy guardrails — not a copy-pasted frontmatter block in every file._

## :dart: What You'll Do

You'll export and apply shared `gh aw env` defaults at repository, organization, or enterprise scope, set a policy variable that disables a risky capability org-wide, and learn how a ruleset can require an agentic workflow check across many repositories.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have a working agentic workflow with `max-ai-credits` or `timeout-minutes` set.
- _(Org or enterprise admins)_ You have `--org` or `--enterprise` admin access, or know who to ask.

> [!NOTE]
> Not an admin? Read this step anyway to understand how org defaults reach your workflow. The hands-on commands need elevated access — pair with an admin to try them live.

## Steps

### Understand scope and precedence

[`gh aw env`](https://github.github.com/gh-aw/reference/governance/) manages `GH_AW_DEFAULT_*` values as GitHub Actions variables at three scopes: repository, organization, and enterprise. When a setting exists at more than one scope, the **most specific scope wins**:

1. workflow frontmatter value (if set)
2. repository variable
3. organization variable
4. enterprise variable
5. built-in compiler fallback

A platform team can set a safe enterprise-wide baseline — for example, a default `max-ai-credits` — while individual repositories still override it when they have a good reason.

### Export and apply defaults

Export whatever defaults already exist at the scope you manage:

```bash
gh aw env get org-defaults.yml --scope org --org MY_ORG
```

The generated file has `default_` keys such as `default_max_ai_credits`, `default_timeout_minutes`, and `default_model_copilot`. Edit it, then preview before applying:

```bash
gh aw env update org-defaults.yml --scope org --org MY_ORG --visibility all --dry-run
gh aw env update org-defaults.yml --scope org --org MY_ORG --visibility all
```

> :thinking: **Predict:** Your organization sets `default_max_ai_credits: "2000"`. One repository's workflow frontmatter sets `max-ai-credits: 500`. Which value wins for that repository's runs? Check the precedence list above, then confirm your answer.

### Set a policy guardrail

Policy variables (`GH_AW_POLICY_*`) are boolean capability gates, separate from numeric defaults. For example, to stop every workflow in an organization from opening pull requests:

```bash
gh variable set GH_AW_POLICY_ALLOW_CREATE_PULL_REQUEST \
  --org my-org --body "false"
```

Any workflow with `safe-outputs.create-pull-request` configured now refuses to start, with an error naming the policy variable. Delete the variable (or set it to `"true"`) to lift the restriction.

### Require an agentic workflow check with a ruleset

Platform teams can require a specific agentic workflow's check — for example a PR review bot — across many repositories using a [ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets), without asking each owner to wire branch protection manually. Keep the workflow's `name:` and job names stable so the check doesn't drift when you update it.

## :twisted_rightwards_arrows: Choose Your Path

| If you… | Go to… |
|---------|--------|
| Want to go deeper on self-hosted runner infrastructure for policy enforcement | ➡️ [Self-Hosted Runner Infrastructure Deep Dive](side-quest-24-01-runner-infrastructure.md) |
| Are ready to compose multiple governed workflows together | ➡️ [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md) |

## :white_check_mark: Checkpoint

- [ ] You exported current `gh aw env` defaults for a repository, organization, or enterprise scope
- [ ] You can explain the five-level precedence order from frontmatter down to compiler fallback
- [ ] You ran `gh aw env update` with `--dry-run` before applying a real change
- [ ] You identified one `GH_AW_POLICY_*` variable and what capability it gates
- [ ] You can explain how a ruleset requires an agentic workflow check without manual branch protection setup in each repository

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
