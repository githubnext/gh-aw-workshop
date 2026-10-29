<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Fix a PR Reviewer That Skips Its Skill

> _Optional: take this detour if your PR reviewer run finished but ignored `pr-review-standards`, then return to [Step 14b](14b-pr-reviewer-workflow.md)._

## :dart: What You'll Do

You'll diagnose why the `pr-reviewer` agent did not apply its review skill, restore the skills directory if it is missing, and re-trigger `/review` to confirm the fix.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- A reviewer run completed, but the review does not mention the `pr-review-standards` skill or does not cite changed files and lines.

## Steps

### Confirm the skills directory exists

When the review ignores the skill, the reviewer likely could not find the skills directory.

1. Run this in your terminal:

   ```bash
   ls .github/skills/
   ```

2. Confirm `.github/skills/agentic-workflows/` is listed and that it was pushed to GitHub.
3. If the directory is missing, run `gh aw init`, commit the generated files, and push.

### Reinforce the instruction

If the directory exists but the skill was still not applied, ask your agent to make the instruction explicit:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

### Compile and re-trigger

1. Compile the workflow with `gh aw compile`.
2. Commit and push both the `.md` and `.lock.yml` files.
3. Comment `/review` on your pull request.
4. Open the run log and confirm the reviewer loads the skill before returning findings.

## :white_check_mark: Checkpoint

- [ ] `.github/skills/` exists in your repository and is pushed
- [ ] The `pr-reviewer` brief explicitly tells the agent to apply `pr-review-standards`
- [ ] A fresh `/review` run mentions the skill and cites changed files and lines

---

**Return to the main adventure:** [Step 14b — Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)

<!-- /journey -->
