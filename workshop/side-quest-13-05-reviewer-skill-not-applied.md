<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Fix a Reviewer That Skips Its Skill

> _Your PR reviewer ran, but its review ignores the `pr-review-standards` skill — this detour shows you how to find out why and fix it._

## :dart: What You'll Do

Diagnose why the `pr-reviewer` inline agent did not apply the `pr-review-standards` skill, confirm the skills directory is present, and reinforce the instruction so the next `/review` cites changed files and lines.

## :clipboard: Before You Start

- You completed [Test the Ready-for-Review Trigger](14b-pr-reviewer-workflow.md) and the **PR Reviewer** run finished.
- The submitted review does not mention the `pr-review-standards` skill, or its findings do not cite changed files and lines.

## Steps

### Spot the symptom

The run completes and a review is submitted, but the review reads like generic feedback. That usually means the reviewer could not find the skills directory, so it never loaded the skill.

### Confirm the skills directory exists

1. In your terminal, run:

   ```bash
   ls .github/skills/
   ```

2. Confirm `.github/skills/agentic-workflows/` is listed and was pushed to your default branch.
3. If the directory is missing, run `gh aw init`, commit the generated files, and push.

### Reinforce the skill instruction

If the directory exists but the skill was still not applied, ask your agent to make the instruction explicit:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

### Recompile and retest

1. Run `gh aw compile`, then commit and push both workflow files.
2. Comment `/review` on the pull request.
3. In the run log, confirm the reviewer loads `pr-review-standards` and that each finding cites a changed file and line.

## :white_check_mark: Checkpoint

- [ ] `.github/skills/agentic-workflows/` exists and is pushed
- [ ] The `pr-reviewer` agent explicitly applies the `pr-review-standards` skill
- [ ] A fresh `/review` run cites changed files and lines

**Return to the main adventure:** [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md)
