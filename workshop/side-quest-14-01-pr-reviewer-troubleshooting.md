<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Troubleshoot Your PR Reviewer Run

> _Find out why your PR reviewer didn't run, or why its review ignored the skill, and fix it in a few minutes._

## :dart: What You'll Do

You'll diagnose the two most common problems with the PR reviewer from [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md): no run starts, or the run completes but the review doesn't apply the `pr-review-standards` skill.

## :clipboard: Before You Start

- You created and pushed `.github/workflows/pr-reviewer.md` and its `.lock.yml` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- You tried the ready-for-review trigger or the `/review` command at least once.

## Steps

### No run started

Confirm each of these:

1. The workflow and its `.lock.yml` are on your default branch.
2. You changed the pull request from **draft** to **Ready for review**.

> [!NOTE]
> Opening a pull request as ready does not emit the `ready_for_review` event. Open it as a draft first, or use `/review` in a comment.

### The review doesn't use the skill

If the run completes but the review doesn't mention the `pr-review-standards` skill or doesn't cite changed files and lines, the reviewer likely could not find the skills directory.

1. Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run `ls .github/skills/` in your terminal. If the directory is missing, run `gh aw init`, commit the generated files, and push.
2. If the directory exists but the skill was still not applied, ask your agent to reinforce the instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

3. Compile, commit, and push, then comment `/review` on the pull request to confirm the skill is now applied.

## :white_check_mark: Checkpoint

- [ ] You can explain why opening a pull request as ready doesn't trigger `ready_for_review`
- [ ] You confirmed `.github/skills/` exists in your repository
- [ ] A fresh `/review` run cites changed files and lines

<!-- journey: all -->
**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
<!-- /journey -->
