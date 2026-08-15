<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Classify Agentic vs. Standard Workflows

> _Optional: work through this side quest after [What Are Agentic Workflows?](05-agentic-workflows-intro.md) to sharpen the distinction through hands-on classification practice._

## :clipboard: Before You Start

- You've read [What Are Agentic Workflows?](05-agentic-workflows-intro.md)

## The core distinction

A standard Actions workflow runs the same fixed steps every time — no judgment required. An [agentic workflow](https://github.github.com/gh-aw/introduction/overview/#what-are-agentic-workflows) replaces those fixed steps with a plain-English task brief, and the AI agent decides how to carry it out.

**Key signal:** if the output could be different each run because the agent is reading context and making decisions, it's agentic.

## Classify Task A

**Task:** Run unit tests on every pull request, fail if any test exits non-zero, and upload coverage.

Write your classification (agentic or standard) in your notes, then reveal.

<details>
<summary>Check Task A answer</summary>

**Standard Actions workflow.** Every run follows identical fixed steps: start the test job, fail on a non-zero exit code, upload the coverage artifact. No judgment required — the result is the same regardless of what changed in the PR.

```yaml
# Example: standard deterministic step
- run: npm test
```

</details>

## Classify Task B

**Task:** Review newly opened issues each morning, group them by theme, flag the urgent ones, and post a short triage summary.

Write your classification, then reveal.

<details>
<summary>Check Task B answer</summary>

**Agentic workflow.** The agent has to inspect live repo context, decide how to group similar issues, and judge what looks urgent — none of that is a fixed rule. The summary will differ every morning based on what issues exist.

```markdown
<!-- Example task brief for Task B -->
Review all issues opened in the last 24 hours. Group them by theme,
flag any that look urgent, and post a triage digest as a new issue comment.
```

</details>

## Classify Task C

**Task:** Each Friday, scan all open issues and pull requests, summarize recent activity by contributor, and post a weekly team progress digest.

Write your classification, then reveal.

<details>
<summary>Check Task C answer</summary>

**Agentic workflow.** The agent reads contributor activity, decides what counts as meaningful progress, and composes a digest that differs every week. The output requires interpretation, not just counting.

</details>

## Classify Task D — hybrid

**Task:** On every pull request, run ESLint (fail on errors), then have an AI read the diff and post a summary comment.

Write your classification, then reveal.

<details>
<summary>Check Task D answer</summary>

**Agentic (hybrid) workflow.** ESLint is deterministic — same pass/fail result every run. The AI summary requires judgment: reading the diff and deciding how to describe the change.

- The ESLint step: deterministic, same result for the same code
- The AI summary step: different output each run, based on what changed

A workflow that mixes deterministic and AI steps is still agentic overall.

```markdown
<!-- Hybrid example: deterministic + agentic -->
Run ESLint on the changed files, then read the diff and post a plain-English
summary of what changed and why it matters.
```

</details>

## Your turn

Write one sentence describing what _your_ agentic workflow should do. Save it in your notes — you'll use this idea in Step 7. Focus on a task that needs judgment, not a test or deploy script.

## Self-check

What makes a workflow agentic rather than standard? Write your answer, then reveal.

<details>
<summary>Show model answer</summary>

A workflow is agentic when an AI agent makes judgment calls — reading context, deciding what matters, and producing output that differs each run. Standard workflows follow fixed steps.

Does your answer include:

- AI making judgment calls on live context
- Output that varies each run
- Contrast with standard fixed-step workflows

</details>

> [!TIP]
> Ready to go deeper? [Side Quest: The Two-File Structure](side-quest-05-03-two-file-structure.md) shows how `.md` and `.lock.yml` relate, and walks through key vocabulary.

---

Return to the main adventure: [What Are Agentic Workflows?](05-agentic-workflows-intro.md).

## ✅ Checkpoint

- [ ] You classified Task A as a standard workflow and explained why it needs no AI judgment
- [ ] You classified Task B as an agentic workflow and named the decision the agent makes
- [ ] You classified Task C as an agentic workflow and described how each Friday run would differ
- [ ] You classified Task D as a hybrid agentic workflow and identified its deterministic step
- [ ] You can explain what makes a workflow agentic in one sentence
- [ ] You've written down your own agentic workflow idea for Step 7
