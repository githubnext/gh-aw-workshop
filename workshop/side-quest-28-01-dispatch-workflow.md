<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Reviewing the `dispatch-workflow` Safe-Output

> _Optional: take this detour to understand how the `dispatch-workflow` allowlist and `max` cap keep an orchestrator predictable, then return to [Step 28](28-orchestrate-workflows.md)._

## :dart: What You'll Do

You'll inspect the `dispatch-workflow` [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) in your orchestrator's frontmatter and confirm what each setting controls and how dispatched specialists run.

## :clipboard: Before You Start

- You created `.github/workflows/repo-orchestrator.md` in [Step 28](28-orchestrate-workflows.md).

## Steps

### Review the `dispatch-workflow` safe-output

After the skill or your manual edit creates the file, confirm the frontmatter contains:

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

### Check each setting

1. Confirm every specialist your brief mentions appears in the `workflows` list.
2. Confirm `max: 1` matches the "dispatch at most one workflow per run" instruction in your brief.
3. Confirm each listed workflow exists in `.github/workflows/` and can be started manually.

## :white_check_mark: Checkpoint

- [ ] Your `dispatch-workflow` block has an explicit `workflows` allowlist
- [ ] You can explain why `max: 1` keeps orchestrator behavior predictable
- [ ] You know the orchestrator does not wait for the specialist to finish

**Return to the main adventure:** [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md)
