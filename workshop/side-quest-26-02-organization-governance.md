<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Organization-Wide Governance with `gh aw env`

> _A companion to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md). Use this side quest if you're a platform admin, or if you want every repository in your org to inherit the same cost guardrails instead of setting `max-ai-credits` by hand in every workflow file._

## :dart: What You'll Do

You'll export current `gh aw` defaults, change one value, and apply it at repository scope with `gh aw env update --dry-run` before committing to a real change. You'll also see how organization and enterprise scopes percolate down so a single setting can cover many repositories at once.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) and understand `max-ai-credits` and `max-daily-ai-credits`.
- You have **admin** access to a repository (organization or enterprise scope requires org/enterprise admin permissions instead).

## Understand what `gh aw env` manages

Instead of editing `max-ai-credits` in every workflow file across every repository, `gh aw env` sets `GH_AW_DEFAULT_*` values as [GitHub Actions variables](https://docs.github.com/en/actions/learn-github-actions/variables) at **repository**, **organization**, or **enterprise** scope. Any workflow that doesn't set an explicit frontmatter value falls back to these defaults.

Scopes percolate from most to least specific — a repository variable always wins over an organization one, which wins over an enterprise one:

1. Workflow frontmatter value (if set)
2. Repository variable
3. Organization variable
4. Enterprise variable
5. Built-in compiler fallback

This means you can set a conservative enterprise-wide baseline, loosen it for specific organizations that need more headroom, and let individual workflows override only when truly necessary.

## Steps

### Export current defaults

Start by seeing what's already configured at repository scope. This step is read-only and safe to run on any repository you can access:

```bash
gh aw env get repo-defaults.yml --scope repo --repo OWNER/REPO
```

Open `repo-defaults.yml`. If nothing has been set yet, most keys will be empty — that's expected for a first run.

### Edit one value

Open `repo-defaults.yml` and set a conservative daily spending guardrail:

```yaml title="repo-defaults.yml"
default_max_daily_ai_credits: "2500"
default_timeout_minutes: "15"
```

> [!NOTE]
> Set a key to `null` (or remove the line) to delete that variable from the scope during `gh aw env update`.

### Preview before applying

Always preview with `--dry-run` first — it shows exactly which variables would change without writing anything:

```bash
gh aw env update repo-defaults.yml --scope repo --repo OWNER/REPO --dry-run
```

Read the output carefully. Confirm only the keys you intended to change are listed.

### Apply the change

Once the dry run looks correct, apply it for real:

```bash
gh aw env update repo-defaults.yml --scope repo --repo OWNER/REPO
```

Any workflow in that repository without its own `max-daily-ai-credits` now inherits `2500` automatically — no frontmatter edits required.

### Scale to organization or enterprise scope

The same commands work at wider scopes if you have the right admin access. Organization and enterprise scopes also accept a `--visibility` flag (`all`, `private`, or `selected`) that controls which repositories can see the variable:

```bash
gh aw env update org-defaults.yml --scope org --org MY_ORG --visibility all --dry-run
gh aw env update org-defaults.yml --scope org --org MY_ORG --visibility all
```

> [!TIP]
> Roll out governance in layers: set an enterprise baseline first, add organization-level overrides only where a team genuinely needs different limits, and keep repository-level and workflow-level overrides rare and explicit. This keeps most repositories aligned while still allowing narrow exceptions.

## Policy variables: hard capability gates

`GH_AW_DEFAULT_*` values are **defaults** — a workflow can still override them in its own frontmatter. For capabilities you want to block outright, use `GH_AW_POLICY_*` variables instead. For example, to stop every workflow in an organization from opening pull requests, regardless of what any workflow's frontmatter says:

```bash
gh variable set GH_AW_POLICY_ALLOW_CREATE_PULL_REQUEST \
  --org MY_ORG --body "false"
```

With this policy active, any workflow configured with `safe-outputs.create-pull-request` fails at startup with a clear error naming the blocking policy variable — instead of silently running with reduced capability.

## :white_check_mark: Checkpoint

- [ ] You ran `gh aw env get` and reviewed the current repository-scope defaults
- [ ] You edited a defaults YAML file with at least one `default_` key
- [ ] You ran `gh aw env update --dry-run` and confirmed the preview matched your intent
- [ ] You applied the change with `gh aw env update` (without `--dry-run`)
- [ ] You can explain the precedence order: frontmatter > repository > organization > enterprise > compiler fallback
- [ ] You can name one `GH_AW_POLICY_*` variable and what it blocks

<!-- journey: all -->
Return to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
<!-- /journey -->
