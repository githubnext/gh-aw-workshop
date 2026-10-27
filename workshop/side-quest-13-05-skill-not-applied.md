<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Fix a Reviewer That Skips Its Skill

> _Optional: take this detour when your PR reviewer run succeeds but the review ignores your `pr-review-standards` skill, then return to the main path._

## :dart: What You'll Do

You'll diagnose why an inline agent did not apply its review skill, restore the skills directory if it is missing, and confirm the fix with a fresh `/review` run.

## :clipboard: Before You Start

- You completed the [Test the Ready-for-Review Trigger](14b-pr-reviewer-workflow.md) section of Step 14b.
- The `PR Reviewer` run finished, but the submitted review does not mention `pr-review-standards` or does not cite changed files and lines.

## Steps

### Check the skills directory

The reviewer discovers its skill by searching the available skills directories. If it could not find that directory, it falls back to generic review behavior.

1. In your Codespace terminal, run:

   ```bash
   ls .github/skills/
   ```

2. Confirm `.github/skills/agentic-workflows/` appears in the output.
3. If the directory is missing, run `gh aw init`, commit the generated files, and push.

### Reinforce the skill instruction

If the directory exists but the skill was still not applied, ask your agent to make the instruction explicit:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

### Recompile and retest

1. Run `gh aw compile`, then commit and push both workflow files.
2. Comment `/review` on your pull request.
3. Open the run log and confirm the reviewer loads `pr-review-standards` before returning findings.
4. Confirm the submitted review cites changed files and lines.

> [!NOTE]
> If no run starts at all, the cause is different: confirm the workflow is on your default branch and that you moved the pull request from draft to ready.

## :white_check_mark: Checkpoint

- [ ] `.github/skills/agentic-workflows/` exists and is pushed
- [ ] The `pr-reviewer` agent explicitly applies the `pr-review-standards` skill
- [ ] A fresh `/review` run loaded the skill and cited changed lines

**Return to the main adventure:** [Step 14b — Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md)

<!-- journey: all -->
<!-- /journey -->
