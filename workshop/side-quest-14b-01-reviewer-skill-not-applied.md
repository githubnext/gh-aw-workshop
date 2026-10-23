<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Fix a PR Reviewer That Ignores Its Skill

> _When a review comes back generic, a few minutes of troubleshooting gets your `pr-review-standards` skill applied again._

## :dart: What You'll Do

Diagnose why your PR reviewer finished a run without applying the `pr-review-standards` skill, then fix it and confirm that findings cite changed files and lines.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- You triggered at least one run (by marking a draft ready or commenting `/review`).
- You can run commands in your Codespace terminal.

## Steps

### Recognize the symptom

The run completes, but the submitted review does not mention the `pr-review-standards` skill or does not cite changed files and lines. This usually means the reviewer could not find the skills directory.

### Confirm the skills directory exists

1. Run this in your terminal:

   ```bash
   ls .github/skills/
   ```

2. Confirm `.github/skills/agentic-workflows/` is listed.
3. If the directory is missing, run `gh aw init`, commit the generated files, and push.

### Reinforce the skill instruction

If the directory exists but the skill was still not applied, ask your agent to make the instruction explicit:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

### Recompile and re-trigger

1. Run `gh aw compile`, then commit and push the changes.
2. Comment `/review` on your pull request.
3. Open the **Actions** run and confirm the reviewer loads the skill before returning findings.

## :white_check_mark: Checkpoint

- [ ] `.github/skills/` exists and contains `agentic-workflows/`
- [ ] The `pr-reviewer` agent explicitly applies the `pr-review-standards` skill
- [ ] A fresh `/review` run produced findings that cite changed files and lines

**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
