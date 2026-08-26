<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Govern Agentic Workflows Across Your Organization

> _Trusted automation at scale requires guardrails — enforce consistent policies so every team's workflows stay safe, auditable, and within budget._

## :dart: What You'll Do

You'll configure the three governance layers that protect agentic workflows at scale: org-level permissions, per-workflow frontmatter caps, and branch protection for workflow files. By the end you'll have a repeatable baseline your platform team can apply across repositories.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md) or any advanced step from [What's Next? Keep Exploring](14-next-steps.md).
- You have **owner** or admin access to the GitHub organization you want to govern.
- You are familiar with `permissions:` and `safe-outputs:` — see [Permission Escalation in Agentic Workflows](side-quest-17-04-permission-escalation.md) for a refresher.

> [!NOTE]
> If you don't have admin rights, read through to understand the controls your platform team can apply, then use the per-workflow practices in your own files.

## Understand the three governance layers

| Layer | Who controls it | What it governs |
|---|---|---|
| **Org / enterprise settings** | Org admin | Default token permissions, allowed models, Copilot seat policy, spending limits |
| **Workflow frontmatter** | Workflow author | `permissions:`, `max-daily-ai-credits:`, `network:`, `safe-outputs:` |
| **Branch protection + CODEOWNERS** | Repo admin | Who can merge workflow `.md` and `.lock.yml` changes |

Each layer closes a different gap. Relying on only one layer leaves the others open.

## Set default token permissions to read-only

In **Settings** → **Actions** → **General**, set the default workflow token to **Read repository contents and packages**. This forces every workflow to declare write permissions explicitly in its `permissions:` block — making privilege escalation visible in code review.

## Restrict allowed models

In the enterprise admin console under **Copilot** → **Policies**, set an allowed-model list. Workflows that request a model outside the list fail at the agent step rather than silently using an unapproved model.

Name your model explicitly in every workflow so the choice is auditable:

```yaml
---
engine: copilot
model: copilot
---
```

A model change then shows up as a one-line diff that CODEOWNERS reviewers can catch.

## Set a cost cap in every workflow

Set an org spending limit in **Settings** → **Billing** → **GitHub Actions**. Back it up with a per-workflow cap:

```yaml
---
max-daily-ai-credits: 50
---
```

Use `gh aw forecast` to calibrate the cap above your expected P90 cost but below a spike threshold (covered in [Project Future AI Credit Costs](side-quest-26-01-forecast-costs.md)).

## Protect workflow files with CODEOWNERS

Workflow `.md` files are executable code. Treat them like infrastructure-as-code:

1. Add a `CODEOWNERS` rule:

```
.github/workflows/   @your-org/platform-team
```

1. Enable **Require review from Code Owners** in branch protection.
1. Require all CI checks — including `gh aw compile` — to pass before merge.

## :white_check_mark: Checkpoint

- [ ] The default workflow token in org settings is set to read-only
- [ ] An allowed-model list is configured (or confirmed) in the Copilot admin policy
- [ ] Each workflow frontmatter names an explicit `model:` value
- [ ] An org-level spending limit is set and each workflow has a `max-daily-ai-credits:` cap
- [ ] A `CODEOWNERS` entry covers `.github/workflows/` and requires platform-team review
- [ ] Branch protection requires CODEOWNERS approval and passing CI before merge
- [ ] You can explain why all three governance layers work together

<!-- journey: all -->
Want to explore more? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
