<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Recover When the PR Reviewer Skips Its Skill

> _Optional: use this checklist when your PR reviewer run finishes but the review ignores your `pr-review-standards` skill._

## :dart: What You'll Do

Confirm that the skills directory exists in your practice repository, then ask your agent to make the reviewer apply the skill explicitly. By the end, a `/review` run cites changed files and lines.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- A reviewer run completed, but the review does not mention the `pr-review-standards` skill or does not cite changed files and lines.

## Steps

### Check that the skills directory was pushed

Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run this in your terminal:

```bash
ls .github/skills/
```

If the directory is missing, run `gh aw init`, commit the generated files, and push.

### Reinforce the skill instruction

If the directory exists but the skill was still not applied, ask the agent to reinforce the instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

### Recompile and re-trigger

Compile, commit, and push the change, then comment `/review` on your pull request. In the run log, confirm the reviewer loads the skill before returning findings.

## :white_check_mark: Checkpoint

- [ ] `.github/skills/` exists in your repository and is pushed
- [ ] The `pr-reviewer` agent explicitly applies the `pr-review-standards` skill
- [ ] A fresh `/review` run cites changed files and lines

**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
