<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Troubleshoot Your PR Reviewer

> _Optional: use this detour when your PR reviewer does not start, or runs without applying the `pr-review-standards` skill._

## :dart: What You'll Do

Work through two quick recovery paths for the PR reviewer from [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md): getting a run to start, and getting the reviewer to apply its skill. By the end, you'll have a review that cites changed files and lines.

## :clipboard: Before You Start

- You created `.github/workflows/pr-reviewer.md` in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- You opened a draft pull request and marked it **Ready for review**, or commented `/review`.

## Steps

### Symptom: no run starts

1. Confirm `pr-reviewer.md` and its compiled `pr-reviewer.lock.yml` are on your default branch. Event triggers only fire from workflows that exist there.
2. Confirm the pull request started as a **draft** and you selected **Ready for review**. Opening a pull request as ready does not emit the `ready_for_review` event.
3. To rerun after pushing another commit, comment `/review` instead of moving the pull request back to draft.

### Symptom: the review ignores the skill

If the run completes but the review does not mention the `pr-review-standards` skill or does not cite changed files and lines, the reviewer likely could not find the skills directory.

1. Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run `ls .github/skills/` in your terminal. If the directory is missing, run `gh aw init`, commit the generated files, and push.
2. If the directory exists but the skill was still not applied, ask your agent to reinforce the instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

3. Compile, commit, and push the change:

```bash
gh aw compile
git add .
git commit -m "fix: make pr-reviewer apply its skill"
git push
```

4. Comment `/review` on the pull request and confirm the new review cites changed files and lines.

## :white_check_mark: Checkpoint

- [ ] You know why a pull request opened as ready does not trigger `ready_for_review`
- [ ] You confirmed `.github/skills/` was pushed to your repository
- [ ] You can reinforce the skill instruction through `/agentic-workflows` and recompile
- [ ] A `/review` rerun produced a review that cites evidence from the changed lines

**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
