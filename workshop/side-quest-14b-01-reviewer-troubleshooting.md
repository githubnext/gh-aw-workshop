<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Troubleshoot Your PR Reviewer

> _When your PR reviewer doesn't run, or runs without using its review skill, this short checklist gets you unstuck._

## :dart: What You'll Do

You'll work out whether your PR reviewer failed to **start** or started but failed to **apply its skill**, and apply the matching fix. By the end, your reviewer will cite changed files and lines in its review.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- You tried the ready-for-review trigger or `/review`, and the result wasn't what you expected.

## Steps

### Check whether the workflow started

If no run appears in the **Actions** tab:

1. Confirm the workflow is on your default branch.
2. Confirm you changed the pull request from draft to **Ready for review**.

> [!NOTE]
> Opening a pull request as ready does not emit the `ready_for_review` event. Open it as a draft first, or comment `/review` instead.

### Check whether the skill was applied

If the run completes but the review doesn't mention the `pr-review-standards` skill or doesn't cite changed files and lines, the reviewer likely could not find the skills directory. Use this checklist to recover:

1. Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run `ls .github/skills/` in your terminal. If the directory is missing, run `gh aw init`, commit the generated files, and push.
2. If the directory exists but the skill was still not applied, ask the agent to reinforce the instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

3. Compile, commit, and re-trigger `/review` to confirm the skill is now applied.

## :white_check_mark: Checkpoint

- [ ] You identified whether the reviewer failed to start or failed to apply its skill
- [ ] `.github/skills/` exists in your repository and is pushed
- [ ] A rerun of the reviewer cites changed files and lines

**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
