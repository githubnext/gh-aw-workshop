<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Build a PR Reviewer with an Agent and Skill

_Turn pull request review into a small team: an orchestrator, a focused reviewer, and reusable review guidance._

## :dart: What You'll Do

You'll use your AI agent and the `/agentic-workflows` skill to create an event-driven PR reviewer. The workflow will define:

- an inline `pr-reviewer` agent that inspects one pull request
- an inline `pr-review-standards` skill that keeps findings evidence-based
- a parent brief that turns the reviewer's findings into one safe pull request review

By the end, you'll have a reviewer that runs when a draft becomes ready, can be rerun with `/review`, and keeps its review method separate from its orchestration.

## :clipboard: Before You Start

- You have a working workflow from [Refine, Test, and Improve Your Workflow](09-agentic-editing.md).
- You have pushed the files created by `gh aw init`, including `.github/skills/agentic-workflows/`.
- The `gh aw` command works in your Codespace terminal.

## Understand the Agent and Skill Split

The parent workflow should coordinate the run, not contain every review rule. It delegates the diff analysis to a focused inline agent. That agent applies an inline skill containing the review method.

| Part | Responsibility |
|---|---|
| Parent brief | Identify the pull request, call the reviewer, and submit the result |
| `pr-reviewer` agent | Read the diff and return prioritized, evidence-backed findings |
| `pr-review-standards` skill | Define what counts as a useful finding and how to format it |

The agent can change how it investigates a pull request without changing the stable standards in the skill. You can also improve the skill without making the parent brief longer. The same split makes it straightforward to extend the reviewer to apply labels based on which files changed (see [Pattern: Auto-Label PRs by Content](side-quest-13-01-pr-labeler-pattern.md)) or to post a structured summary that doubles as a release note draft (see [Pattern: Generate a PR Summary Comment](side-quest-13-02-pr-summary-pattern.md)).

> :thinking: **Predict:** Which instruction belongs in the skill: “review pull request 42” or “cite a changed file and line for every finding”? The first is run-specific orchestration; the second is reusable review guidance.

## Ask Your Agent to Create the Workflow

Open your AI agent in the practice repository and pass this prompt:

```prompt
/agentic-workflows Create a PR reviewer workflow at .github/workflows/pr-reviewer.md with an inline pr-reviewer agent and pr-review-standards skill, triggering on pull_request ready_for_review and the /review slash command.
```

Review the agent's diff before accepting it. The source should contain one parent brief plus both inline blocks near the bottom of the file.

## Inspect the Generated Structure

The workflow frontmatter should follow this shape:

```markdown .github/workflows/pr-reviewer.md
---
on:
  pull_request:
    types: [ready_for_review]
  slash_command:
    strategy: centralized
    name: review
    events: [pull_request_comment, pull_request_review_comment]
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
tools:
  github:
    mode: gh-proxy
    toolsets: [pull_requests, repos]
safe-outputs:
  submit-pull-request-review:
    max: 1
    allowed-events: [COMMENT, REQUEST_CHANGES]
---
```

Notice that the agent job has no repository or pull request write permission. `copilot-requests: write` only authenticates Copilot. The `submit-pull-request-review` safe output performs the controlled repository write after the agent finishes. `APPROVE` is intentionally absent because the default GitHub Actions token cannot approve pull requests.

Near the bottom, look for the two reusable blocks:

```markdown .github/workflows/pr-reviewer.md
## agent: `pr-reviewer`
---
description: Reviews one pull request for actionable problems
model: small
---

Inspect the pull request diff. Discover the relevant skill under the available
skills directories and apply its review guidance. Return prioritized findings
with evidence for the parent agent.

## skill: `pr-review-standards`
---
description: Produces evidence-based pull request review findings
---

Report only actionable problems introduced by the changed lines. For every
finding, cite the changed file and line, explain the impact, and suggest a
specific next step. Omit style-only and speculative feedback.
```

The exact wording may differ. Confirm that the responsibilities stay separated: the parent coordinates, the agent investigates, and the skill defines review quality. If your team works from a shared checklist rather than open-ended criteria, [Pattern: PR Review Checklist](side-quest-13-03-pr-checklist-pattern.md) shows how to restructure the skill around that format.

## Compile and Push

In your Codespace terminal, run:

```bash
gh aw compile
git add .
git commit -m "feat: add agent and skill PR reviewer"
git push
```

Optional while your agent edits: run `gh aw compile --watch` in a separate terminal for immediate compiler feedback.

## Test the Ready-for-Review Trigger

1. Create a branch with a small code change that has an obvious, non-security bug.
2. Open a **draft** pull request against your default branch.
3. Select **Ready for review**.
4. Open the **Actions** tab and inspect the **PR Reviewer** run.
5. Return to the pull request and inspect the submitted review.

In the run log, confirm that the parent calls `pr-reviewer` and that the reviewer loads the review skill before returning findings.

To test the manual path, add a `/review` comment to the pull request. After pushing another commit, use `/review` again instead of moving the pull request back to draft.

> [!NOTE]
> If no run starts, confirm that the workflow is on your default branch and that you changed the pull request from draft to ready. Opening a pull request as ready does not emit the `ready_for_review` event.

If the run completes but the review does not mention the `pr-review-standards` skill or does not cite changed files and lines, the reviewer likely could not find the skills directory. Use this checklist to recover:

1. Confirm `.github/skills/agentic-workflows/` exists and was pushed. Run `ls .github/skills/` in your terminal. If the directory is missing, run `gh aw init`, commit the generated files, and push.
2. If the directory exists but the skill was still not applied, ask the agent to reinforce the instruction:

```prompt
/agentic-workflows Update .github/workflows/pr-reviewer.md so the pr-reviewer agent explicitly searches for and applies the pr-review-standards skill before returning findings.
```

1. Compile, commit, and re-trigger `/review` to confirm the skill is now applied.

## Improve One Layer

Choose one change and send it through `/agentic-workflows`:

- Update the **skill** if the review standard needs to change across every review.
- Update the **agent** if its investigation or returned evidence needs to change.
- Update the **parent brief** if review submission or orchestration needs to change.

For example:

```prompt
/agentic-workflows Update the pr-review-standards skill in .github/workflows/pr-reviewer.md to distinguish blocking findings from non-blocking observations.
```

Run `/review` again and compare the new result with the first review. Once you have run a few variations, use the [Observe and Reduce Token Costs](side-quest-13-04-token-optimization.md) side quest to measure the AIC impact of each change and identify the highest-value optimizations.

## :white_check_mark: Checkpoint

- [ ] You created `.github/workflows/pr-reviewer.md` through your AI agent and `/agentic-workflows`
- [ ] The workflow contains a `pr-reviewer` inline agent and a `pr-review-standards` inline skill
- [ ] The parent brief calls the reviewer, and the reviewer applies the skill
- [ ] The agent job has read-only repository and pull request permissions
- [ ] The safe output allows one `COMMENT` or `REQUEST_CHANGES` review, but not `APPROVE`
- [ ] `gh aw compile` completed and both workflow files are committed and pushed
- [ ] Marking a draft ready or commenting `/review` triggered the workflow
- [ ] The submitted review cites evidence from the changed lines
- [ ] You changed one layer and compared the rerun with the first review

<!-- journey: all -->
**Next:** [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md)
<!-- /journey -->
