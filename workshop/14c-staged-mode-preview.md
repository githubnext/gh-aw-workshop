<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Preview Safe Outputs Before They Go Live

_See exactly what your agent would write before it writes anything._

## :dart: What You'll Do

You'll add [staged mode](https://github.github.com/gh-aw/reference/staged-mode/) to your PR reviewer workflow so you can preview the review it would submit, without actually posting it. By the end, you'll have a repeatable way to pilot new or risky outputs safely before trusting them with real writes.

## :clipboard: Before You Start

- You completed [Build a PR Reviewer with an Agent and Skill](14b-pr-reviewer-workflow.md).
- Your `.github/workflows/pr-reviewer.md` file compiles and runs successfully.
- The `gh aw` command works in your Codespace terminal.

## Why This Matters

Every [safe output](https://github.github.com/gh-aw/reference/safe-outputs/) you add — a new review type, a different label set, a changed PR template — is a guess about what the agent will actually produce until you see a real run. Re-running against live issues and pull requests to check prompt changes is slow and can spam collaborators with half-finished output. Staged mode runs the full agent session, including every tool call and reasoning step, but replaces each write with a detailed preview in the Actions step summary — so you can validate a change with zero side effects.

## Enable Staged Mode for the Whole Workflow

Open `.github/workflows/pr-reviewer.md` and add `staged: true` to the top of the `safe-outputs:` block:

```yaml
safe-outputs:
  staged: true
  submit-pull-request-review:
    max: 1
    allowed-events: [COMMENT, REQUEST_CHANGES]
```

Compile and push:

```bash
gh aw compile
git add .
git commit -m "chore: stage pr-reviewer output for preview"
git push
```

Trigger a run with `/review` on an open pull request, then open the **Actions** tab and inspect the run's step summary. Instead of a submitted review, you'll see a 🎭-marked section listing the review body, comment type, and every field the agent would have written.

## Scope Staged Mode to One Output Type

Once you trust a workflow's existing outputs, you don't have to stage everything when testing a new one. Set `staged` per output type to preview only the output you're iterating on:

```yaml
safe-outputs:
  staged: false
  submit-pull-request-review:
    staged: true
    max: 1
    allowed-events: [COMMENT, REQUEST_CHANGES]
```

A type-level `staged` setting overrides the workflow-level default, so you could add a new `add-labels` output here and let it write for real while the review stays in preview.

> :thinking: **Predict:** If you set `staged: true` at the workflow level and `staged: false` on `submit-pull-request-review`, which one wins? Check the docs link above to confirm — the more specific, type-level setting always takes precedence.

## Disable Staged Mode Once You're Confident

After comparing a few preview runs against what you expect, remove `staged: true` (or set it to `false`) and recompile:

```bash
gh aw compile
git add .
git commit -m "chore: enable live pr-reviewer output"
git push
```

Run `/review` again and confirm the review now posts for real.

## :white_check_mark: Checkpoint

- [ ] You added `staged: true` to the `safe-outputs:` block in `pr-reviewer.md`
- [ ] A triggered run produced a 🎭 preview in the Actions step summary instead of a real review
- [ ] You scoped `staged: true` to only `submit-pull-request-review` while leaving the workflow-level default `false`
- [ ] You predicted and confirmed which staged setting takes precedence
- [ ] You disabled staged mode and confirmed a real review posts again

<!-- journey: all -->
**Next:** [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md)
<!-- /journey -->

<!--
<research-node-metadata>
  <focus>Staged mode for previewing safe outputs before they execute, applied to the existing pr-reviewer workflow</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/docs/src/content/docs/reference/staged-mode.md</source>
    <source>https://github.github.com/gh-aw/reference/staged-mode/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>
    Scanning the gh-aw LLMs.txt index alongside the existing /workshop curriculum showed every safe-outputs-related
    step (14b, 15, 17, 22) teaches learners to add or secure safe outputs, but none show how to validate a safe
    output's content before it goes live. Staged mode is a documented, low-risk feature purpose-built for exactly
    this gap: it runs the full agent session and replaces writes with an Actions step-summary preview, scoped
    either workflow-wide or per output type. Teaching it right after the PR reviewer step lets learners reuse a
    workflow they already built and see an immediate, concrete payoff — a safer, faster iteration loop for any
    future safe-outputs change — without introducing new workflow concepts.
  </rationale>
</research-node-metadata>
-->
