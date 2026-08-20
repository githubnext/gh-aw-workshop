<!-- page-journey: enterprise -->
<!-- page-adventure: main -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need more than working workflows — they need visibility, controls, and confidence that every agent acts within policy._

## :dart: What You'll Do

You will apply three layers of enterprise governance to your agentic workflows: permission scoping to enforce least privilege, a cost policy that caps daily AI credit spend, and an audit routine that lets you inspect what every agent did and why. By the end, your workflows will be ready for an enterprise compliance review.

## :clipboard: Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- Your practice repository is inside a GitHub organisation (GHEC or GHES 3.12+).
- You have the **Maintainer** role or higher on the repository, or your org admin has granted you access to the Actions and Copilot policy pages.

## Steps

### Understand the three governance layers

Enterprise governance for agentic workflows sits at three levels:

| Layer | What it controls | Where it lives |
|-------|-----------------|----------------|
| **Permissions** | What GitHub APIs the agent may call | Workflow frontmatter `permissions:` block |
| **Cost policy** | How many AI credits a workflow may spend per day | Workflow frontmatter `max-daily-ai-credits` |
| **Audit trail** | What the agent did, which tools it called, and what it wrote | Run artifacts reviewed with `gh aw audit` |

You touched each layer in earlier steps. This step shows you how to think about them together as a governance checklist before you ship a workflow to production.

### Review and tighten permissions

Open your `daily-status.md` (or any workflow you have authored) in the Codespace editor. Find the `permissions:` block in the frontmatter.

A minimal production-ready permissions block for a read-and-comment workflow looks like this:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: read
```

Ask yourself one question per permission: _"Does this workflow actually use this scope?"_ Remove any scope that the answer is _"no"_ to.

> [!TIP]
> Start from `contents: read` and add only what the workflow needs. It is much easier to add a permission later than to explain a breach caused by an over-scoped workflow.

Use your AI agent to audit the permissions block against the workflow brief:

```prompt
/agentic-workflows review the permissions block in daily-status.md and flag any scope that the task brief does not require
```

Apply any suggestions, then compile:

```bash
gh aw compile
```

### Set a cost policy

A production workflow should declare a daily AI credit cap. This protects your organisation's budget if a trigger fires more times than expected or if a model returns unexpectedly long completions.

Ask your AI agent to add a cost cap based on your usage history:

```prompt
/agentic-workflows add a max-daily-ai-credits limit to daily-status.md based on a conservative estimate for a daily-schedule workflow
```

The agent will add a line like the following to your frontmatter:

```yaml
max-daily-ai-credits: 50
```

Compile again to confirm the value is valid:

```bash
gh aw compile
```

> [!NOTE]
> The `gh aw forecast` command (covered in [the forecast side quest](side-quest-26-01-forecast-costs.md)) can help you derive a data-driven value from past run history. Use the P90 figure as a safe starting point.

### Run the governance audit

Push your updated workflow and trigger a manual run from the **Actions** tab. Once the run completes, pull the audit report from the Codespace terminal:

```bash
gh aw audit --workflow daily-status
```

Read the **Permissions used** section of the report. Confirm that every permission listed in the report matches a scope in your frontmatter — no unexpected calls should appear.

Read the **Cost summary** section. Confirm the run stayed well below your `max-daily-ai-credits` cap.

> [!IMPORTANT]
> If the audit report shows a permission the workflow used but you did not declare, add it to the frontmatter and re-run. Undeclared permissions are blocked by default — the agent call will fail silently in production.

### Document your governance decisions

Add a short comment block near the top of your workflow's Markdown body (below the frontmatter) listing which permissions you kept and why, what cost cap you chose, and how often you will review the audit trail. This context is for your team — the agent ignores human-readable commentary and executes only task instructions.

## :white_check_mark: Checkpoint

- [ ] You reviewed every scope in your workflow's `permissions:` block and removed at least one that was not required
- [ ] You added a `max-daily-ai-credits` cap to your workflow frontmatter
- [ ] `gh aw compile` succeeded after both changes
- [ ] You ran `gh aw audit` on a completed run and confirmed that permissions used match permissions declared
- [ ] You added a governance comment block to your workflow brief explaining your permission and cost decisions
- [ ] You can explain, in one sentence, why least-privilege permissions matter more in agentic workflows than in classic deterministic Actions

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
