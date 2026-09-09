<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Recovering When a Reviewer Skill Isn't Applied

> _Optional: work through this recovery checklist if your PR reviewer's review doesn't cite the `pr-review-standards` skill, then return to [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)._

## :dart: What You'll Do

You'll diagnose why the `pr-reviewer` inline agent skipped its `pr-review-standards` skill, confirm the skills directory is actually present and pushed, and reinforce the instruction so the agent reliably applies the skill on the next run.

## :clipboard: Before You Start

- You completed the workflow creation and testing steps in [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- Your **PR Reviewer** run completed, but the submitted review does not mention the `pr-review-standards` skill or does not cite changed files and lines for its findings.

## Steps

### Recognize the symptom

A run that completes successfully but produces a review missing evidence-based findings — no cited file, no cited line, generic feedback — is a sign the `pr-reviewer` agent never discovered or applied the `pr-review-standards` skill. This is different from a workflow that fails to trigger at all; the run itself succeeds, but the *quality* of the output is missing the skill's guidance.

### Confirm the skills directory exists and was pushed

The most common cause is a missing or unpushed skills directory. Confirm it locally:

```bash
ls .github/skills/
```

If `agentic-workflows/` is missing, regenerate and push it:

```bash
gh aw init
git add .
git commit -m "Initialize agentic workflow skills"
git push
```

Re-trigger `/review` on your pull request and check whether the review now cites the skill's guidance.

### Reinforce the instruction in the workflow brief

If the directory exists but the skill still wasn't applied, the `pr-reviewer` agent's instructions may not be explicit enough about discovering and applying the skill. Ask your AI agent to strengthen that instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

Review the diff. The updated `pr-reviewer` agent brief should now explicitly instruct the agent to look for and apply the skill, rather than assuming it will discover it on its own.

### Compile, commit, and re-verify

```bash
gh aw compile
git add .
git commit -m "fix: reinforce skill discovery in pr-reviewer agent"
git push
```

Re-trigger `/review` on the same pull request (or comment `/review` again after a new commit) and confirm the new review cites evidence from the changed lines and reflects the `pr-review-standards` guidance.

## :white_check_mark: Checkpoint

- [ ] You identified that a completed run with a generic, non-evidence-based review indicates a skipped skill
- [ ] You confirmed `.github/skills/agentic-workflows/` exists and is pushed to your default branch
- [ ] You reinforced the skill-discovery instruction in the `pr-reviewer` agent brief
- [ ] You compiled, committed, and pushed the updated workflow
- [ ] A re-triggered `/review` produced a review that cites changed files and lines

**Return to the main adventure:** [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md)
