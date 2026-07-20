---
journey: all
adventure: advanced
---
# Govern Your Agentic Workflows

> _Shipping a workflow is the easy part — keeping it safe, auditable, and under control as your team grows is where governance pays off._

## 🎯 What You'll Do

You will apply three governance controls: scope permissions to the minimum required, restrict which write operations the agent can perform, and protect branches so that AI-authored changes are always reviewed before they land.

## 📋 Before You Start

- You have a working agentic workflow. The daily-status workflow from [Build Your Daily Status Workflow](11a-build-daily-status.md) works well for this step.
- **Enterprise teams:** confirm your organisation has enabled Copilot for your repositories. See [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

## Scope permissions to the minimum

Every agentic workflow runs with a `GITHUB_TOKEN` whose default scopes depend on your repository settings. Granting more permission than a workflow needs creates unnecessary risk.

Open your workflow `.md` file and review the `permissions` block in the frontmatter. A daily-status workflow that only posts a comment needs at most:

```yaml
permissions:
  issues: write
  pull-requests: read
  contents: read
```

Remove any scope your task brief doesn't use.

> [!TIP]
> Start from zero-permissions and add only what the first failed run asks for. It is easier to add a scope than to discover you granted too many.

## Control safe-outputs write scope

The `safe-outputs` feature is what lets agents create issues, post comments, or open pull requests. You can restrict which output types a workflow is allowed to use by adding a `safe-outputs` block to the frontmatter:

```yaml
safe-outputs:
  allowed-types:
    - add_comment
    - noop
```

With this in place, the agent can comment on issues but cannot open new pull requests or create labels — even if the task brief asks it to.

> [!NOTE]
> The `allowed-types` list is validated at compile time. If the task brief references a safe-output type not on the list, `gh aw compile` will report an error before the workflow ever runs.

## Require reviews for AI-authored pull requests

When an agentic workflow opens a pull request, require at least one human approval before merging.

In your repository settings:

1. Go to **Settings** → **Branches** → **Add branch protection rule**.
2. Target the branch your workflow writes to (e.g. `main`).
3. Enable **Require a pull request before merging** and set approvals to **1**.
4. Enable **Dismiss stale reviews when new commits are pushed**.

> [!TIP]
> Pair branch protection with **CODEOWNERS** to route AI-authored changes to the right team automatically.

## Limit which events trigger write-capable workflows

Avoid `pull_request` or `push` triggers on write-capable workflows — they increase the attack surface for prompt-injection through untrusted PR content. Prefer `schedule` and `workflow_dispatch`:

```yaml
on:
  schedule:
    - cron: "0 9 * * 1-5"
  workflow_dispatch:
```

## ✅ Checkpoint

- [ ] Your workflow frontmatter lists only the `permissions` scopes the task brief actually uses
- [ ] You have added or reviewed a `safe-outputs.allowed-types` list that limits write operations to what the workflow needs
- [ ] Branch protection is enabled on your target branch with at least one required reviewer
- [ ] Your `on:` block uses only the event triggers the workflow needs (no unnecessary `push` or `pull_request` triggers for write-capable workflows)
- [ ] You can explain the difference between `permissions` (GitHub token scopes) and `safe-outputs.allowed-types` (agent write capabilities)

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Governance guide](https://github.github.com/gh-aw/guides/governance/)
- [Permissions reference](https://github.github.com/gh-aw/reference/permissions/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/)
- [Side Quest: Prompt Injection](side-quest-17-03-prompt-injection.md)
- [Side Quest: Permission Escalation](side-quest-17-04-permission-escalation.md)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
