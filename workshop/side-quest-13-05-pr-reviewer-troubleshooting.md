<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Troubleshoot Your PR Reviewer

> _Optional detour: get a PR reviewer that won't trigger, or won't apply its review skill, working again._

## :dart: What You'll Do

You'll work out why your `pr-reviewer` workflow didn't run, or ran without using the `pr-review-standards` skill, and apply the matching fix.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- You tried the ready-for-review or `/review` trigger and the result wasn't what you expected.

## Steps

### Check that the workflow started

If no run appears in the **Actions** tab, check these two things:

1. The workflow is on your default branch.
2. You moved the pull request from draft to ready. Opening a pull request as ready does not emit the `ready_for_review` event.

> [!NOTE]
> To rerun after pushing another commit, comment `/review` on the pull request instead of moving it back to draft.

### Check that the skill was applied

If the run completes but the review doesn't mention the `pr-review-standards` skill, or doesn't cite changed files and lines, the reviewer likely couldn't find the skills directory.

1. Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run `ls .github/skills/` in your terminal. If the directory is missing, run `gh aw init`, commit the generated files, and push.
2. If the directory exists but the skill was still not applied, ask your agent to reinforce the instruction:

   ```prompt
   /agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
   ```

3. Compile, commit, and push, then comment `/review` to confirm the skill is now applied.

## :white_check_mark: Checkpoint

- [ ] You confirmed the workflow is on your default branch and the pull request went from draft to ready
- [ ] `.github/skills/` exists in your repository and is pushed
- [ ] A rerun with `/review` produced a review that cites changed files and lines

<!-- journey: all -->
**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
<!-- /journey -->
