<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Write and Review a `dispatch-workflow` Orchestrator

> _Writing the orchestrator by hand shows you exactly how the `dispatch-workflow` allowlist and `max` cap keep routing safe and predictable._

## :dart: What You'll Do

You'll write a `repo-orchestrator` workflow directly in your terminal, compile it, and review the `dispatch-workflow` [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) that controls which specialist workflows it can trigger.

## :clipboard: Before You Start

- You reached the "Create the orchestrator workflow" section of [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have `daily-status` and `pr-reviewer` workflows in `.github/workflows/`.

## Steps

### Write the orchestrator directly

Create `.github/workflows/repo-orchestrator.md` with this starting template:

```markdown .github/workflows/repo-orchestrator.md
---
name: Repository Orchestrator
on:
  schedule: daily on weekdays
permissions:
  contents: read
  issues: read
  pull-requests: read
safe-outputs:
  dispatch-workflow:
    workflows:
      - daily-status
      - pr-reviewer
    max: 1
---

Read the current repository state:
1. Count open pull requests older than 3 days.
2. Check whether a GitHub issue with the title prefix "Daily Repository Status" was created today.

Based on what you find:
- If stale open PRs exist, dispatch the `pr-reviewer` workflow.
- If no status issue exists today, dispatch the `daily-status` workflow.
- If neither condition is true, output a one-line summary and stop.

Dispatch at most one workflow per run.
```

Then compile:

```bash
gh aw compile repo-orchestrator
```

### Review the `dispatch-workflow` safe-output

Confirm the frontmatter contains:

```markdown .github/workflows/repo-orchestrator.md
safe-outputs:
  dispatch-workflow:
    workflows:
      - daily-status
      - pr-reviewer
    max: 1
```

The `workflows` list is an allowlist — your orchestrator can only dispatch workflows named here. The `max: 1` cap prevents one run from triggering many specialists at once.

> [!NOTE]
> `dispatch-workflow` triggers the named workflow with a `workflow_dispatch` event. The specialist runs asynchronously in its own Actions job. Your orchestrator does not wait for it to complete.

## :white_check_mark: Checkpoint

- [ ] `repo-orchestrator.md` exists with a `dispatch-workflow` safe-output
- [ ] The `workflows` allowlist names only the specialists you intend to dispatch
- [ ] `gh aw compile repo-orchestrator` succeeds
- [ ] You can explain why `max: 1` keeps orchestrator behavior predictable

**Return to the main adventure:** [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md)
