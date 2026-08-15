<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Chaining Conditions — Run an Agent Only When Security Findings Exist

> _The cheapest agent invocation is the one you skip. Use a deterministic step to decide whether your repository state is worth an agent's attention._

## :dart: What You'll Do

Add a security scanning step to your workflow that counts open Dependabot vulnerability alerts, then wire the result into an `if:` condition so the agent only runs when there are actual findings. You will chain that check with a branch condition using `&&` and update the agent brief to reference the alert count directly.

## :clipboard: Before You Start

- You have completed [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md).
- Your workflow already has a top-level `if:` condition gating the agent job.

## Steps

### Understand why this pattern matters

Running an agent every time a schedule fires is expensive, even when there is nothing to report. This side quest solves that by front-loading a fast, [deterministic](https://github.github.com/gh-aw/patterns/deterministic-ops/) check: a shell step calls the GitHub API to count open Dependabot alerts, then the `if:` expression evaluates the count before the agent job starts. If no alerts are open, the job is skipped entirely — zero AI credits spent.

The same skeleton applies to any tool that can write a count or boolean to `$GITHUB_OUTPUT`: code scanning alerts, secret scan findings, lint error totals, or failing test counts.

### Add a security-alert count step

In the GitHub Copilot **Chat** or **Agents** tab, paste:

```prompt
/agentic-workflows update .github/workflows/daily-status.md to add a shell step
that counts open Dependabot alerts using the GitHub API and writes the result to
$GITHUB_OUTPUT as `alert_count` with step id `alerts`. Add `security-events: read`
to the workflow permissions and update the if condition to run the agent only when
alert_count is not zero and the ref is the default branch.
```

The skill adds the step, updates the permissions block and the `if:` condition, then recompiles the lock file.

<details>
<summary>:desktop_computer: Terminal path</summary>

1. Add `security-events: read` to the `permissions:` block in your [workflow frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).

2. Add the following step inside the `steps:` block:

```markdown
- name: Count open security alerts
  id: alerts
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    COUNT=$(gh api repos/${{ github.repository }}/dependabot/alerts \
      --jq '[.[] | select(.state == "open")] | length' 2>/dev/null || echo 0)
    echo "alert_count=$COUNT" >> $GITHUB_OUTPUT
```

   The step publishes the count as `steps.alerts.outputs.alert_count`.
3. Update the top-level `if:` to combine both conditions:

```markdown
---
if: steps.alerts.outputs.alert_count != '0' && github.ref == 'refs/heads/main'
---
```

   Both conditions must be true for the agent to run.
4. Run `gh aw compile` to regenerate the lock file.

</details>

### Why chain with a branch check

Dependabot alert counts are repository-wide. Running the agent on every branch would create duplicate summaries on the same data. Adding `github.ref == 'refs/heads/main'` gates the run to a single canonical location while still allowing a manual `workflow_dispatch` to override from the Actions tab regardless of the current branch.

> [!NOTE]
> Values from `$GITHUB_OUTPUT` are always strings. Compare them against quoted literals — `steps.alerts.outputs.alert_count != '0'` — not unquoted values.

### Update the agent brief

Reference the alert count output directly in your brief so the model knows the scope of work before it calls any tools:

```text
There are ${{ steps.alerts.outputs.alert_count }} open Dependabot security alerts in this
repository. Fetch the full list, group them by severity (critical, high, medium, low),
and post a concise triage summary as a comment on the latest open issue labelled
`security-triage`. If no such issue exists, create one.
```

Embedding the count anchors the agent to a concrete number instead of asking it to rediscover a value that the deterministic step already fetched, which reduces unnecessary tool calls and trims AIC usage.

### Verify the conditional behaviour

After compiling and pushing, trigger a manual `workflow_dispatch` run from the Actions tab:

- **With open alerts on the default branch**: the agent job completes and posts the security summary.
- **With no open alerts, or on a non-default branch**: the job appears as **skipped** with a grey icon.

> [!NOTE]
> The `if:` condition takes effect only after you compile and push both the `.md` source and the updated `.lock.yml` file. The `/agentic-workflows` skill handles compilation automatically.

### Commit and push your changes

```bash
git add .
git commit -m "feat: gate agent on open security alerts"
git push
```

## ✅ Checkpoint

- [ ] Your workflow has a `count open security alerts` step with `id: alerts`
- [ ] The `permissions:` block includes `security-events: read`
- [ ] Your top-level `if:` chains the alert-count check and the branch check with `&&`
- [ ] Both `.github/workflows/daily-status.md` and `.github/workflows/daily-status.lock.yml` are compiled, committed, and pushed
- [ ] You triggered the workflow manually and confirmed it skips when there are no open alerts
- [ ] You can explain why embedding the alert count in the brief reduces unnecessary agent tool calls

<!-- journey: all -->
Return to [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md).
<!-- /journey -->
