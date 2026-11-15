<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Runaway-run protection — timeouts, per-user rate limits, and daily AI credit caps</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/cost-management/</source>
  </sources>
  <rationale>Steps 26 and 31 introduce budgets and the firewall, but no step shows how to stop a workflow from being triggered too often or running too long. Teams that open workflows to comment or dispatch triggers need hands-on guardrails.</rationale>
</research-metadata>
-->

# Set Rate Limits and Guardrails on Your Workflow

> _Keep a busy workflow from running too often, too long, or too expensively._

## :dart: What You'll Do

You'll add three guardrails to one of your workflows: a timeout, a per-user rate limit, and a daily AI credit cap. Then you'll compile and confirm the settings landed in the lock file. When you finish, a noisy trigger can't quietly burn through your budget.

## :clipboard: Before You Start

- A compiled workflow from [Step 7](07-your-first-workflow.md) in your Codespace
- The budget ideas from [Step 26](26-manage-costs-and-budgets.md)

## Steps

### Know what already protects you

gh-aw layers several [rate limiting controls](https://github.github.com/gh-aw/reference/rate-limiting-controls/). Agents get read-only tokens, writes go through safe outputs, and a workflow's own safe-output writes don't re-trigger other workflows. You add the three limits below on top.

| Guardrail | What it stops |
|-----------|---------------|
| `timeout-minutes` | A single run that goes on too long |
| `user-rate-limit` | One person triggering runs too often |
| `max-daily-ai-credits` | Total spend across a rolling 24 hours |

### Ask your agent to add the guardrails

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then give it this prompt, replacing the file name with your workflow:

```text
In .github/workflows/daily-status.md, add timeout-minutes: 10, a user-rate-limit of 3 runs per 60 minutes, and max-daily-ai-credits: 2000. Keep everything else unchanged.
```

### Review the frontmatter

Open the file. The top should include lines like these:

```yaml
timeout-minutes: 10
user-rate-limit:
  max-runs-per-window: 3
  window: 60
max-daily-ai-credits: 2000
```

`user-rate-limit` applies to programmatic triggers such as `workflow_dispatch` and `issue_comment`. By default, people with `admin`, `maintain`, or `write` roles are exempt. Add `ignored-roles: []` to limit everyone.

> [!NOTE]
> Manual runs started from the **Actions** tab and slash commands bypass the daily credit cap, so your own testing is never blocked.

### Recompile

```bash
gh aw compile
```

Compilation must finish without errors. Then search the generated lock file for your values:

```bash
grep -n "timeout-minutes" .github/workflows/daily-status.lock.yml
```

### Commit and test

Commit both the `.md` and `.lock.yml` files. Dispatch the workflow once from the **Actions** tab on GitHub.com, as in [Step 8](08-run-your-workflow.md), and confirm it still succeeds.

> [!TIP]
> Start with a limit you'd be comfortable hitting. Use the P90 figure from [Step 26](26-manage-costs-and-budgets.md) to size `max-daily-ai-credits`, and loosen it only when real runs need more.

## :white_check_mark: Checkpoint

- [ ] Your workflow frontmatter has `timeout-minutes`, `user-rate-limit`, and `max-daily-ai-credits`
- [ ] `gh aw compile` finished without errors and you committed the `.md` and `.lock.yml` files
- [ ] You can explain which of the three limits caps time, trigger frequency, and spend
- [ ] A manual run from the **Actions** tab still succeeded

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
