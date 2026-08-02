<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Resilience Techniques Reference

> _Optional: use this reference if you want full syntax for all three resilience techniques before or after [Step 22](22-error-handling-and-resilience.md), then return to the main path._

## :dart: What You'll Do

Review copy-ready examples for a defensive task brief, `timeout-minutes`, and safe-output fallback messages, then run quick predict-and-try checks to confirm you can apply each pattern in your own workflow.

## :clipboard: Before You Start

- You have completed or started [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md).
- You have a workflow source file in `.github/workflows/` (for example `daily-status.md`).
- You know how to recompile workflow lock files with `gh aw compile`.

---

## Technique 1: defensive task brief

Use explicit fallback instructions in the task brief so the agent still writes output when the dataset is empty.

```markdown .github/workflows/daily-status.md
Summarize open pull requests and open issues from the past 24 hours.

If there are no open pull requests or issues to summarize:
- Write a short "No activity in the past 24 hours" report.
- Still call the configured safe-output tool.
- Do not skip output.
```

> :thinking: **Predict and try:** If there are zero open items, what should the run produce? Trigger a manual run and verify you still get a visible output message.

---

## Technique 2: `timeout-minutes`

Set `timeout-minutes` in frontmatter to prevent long-running jobs from hanging indefinitely.

```markdown .github/workflows/daily-status.md
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: write
timeout-minutes: 10
---
```

> [!TIP]
> `timeout-minutes` is a top-level field in gh-aw frontmatter. Do not nest it under `jobs:` or `run:`.

On GitHub Enterprise Server (GHES) and GitHub Enterprise Cloud (GHEC), administrators can enforce a stricter job timeout policy than the value in your workflow. If they do, the admin limit wins and your run is cancelled at that earlier threshold.

> :thinking: **Predict and try:** If your workflow usually finishes in 2 minutes, is `timeout-minutes: 10` reasonable? Run once, check duration in Actions, and tighten the value if needed.

---

## Technique 3: safe-output fallback message

When writing via safe outputs, include a fallback body for no-change runs so success stays visible in logs and comments.

```markdown .github/workflows/daily-status.md
If no meaningful changes were found, call noop with this message:
"No changes found in the past 24 hours — workflow ran successfully."
```

If your workflow writes comments instead of `noop`, use the same pattern: provide a concise fallback body rather than leaving output blank.

> :thinking: **Predict and try:** What message should reviewers see on a quiet day? Trigger a no-change run and confirm the fallback text appears exactly as written.

---

## Apply all three in one pass

After editing your workflow file, recompile and commit both files:

```bash
gh aw compile
git add .
git commit -m "feat: harden workflow resilience behavior"
git push
```

---

## :white_check_mark: Checkpoint

- [ ] My task brief includes an explicit fallback for empty data
- [ ] My frontmatter sets `timeout-minutes` at the top level
- [ ] My safe-output behavior includes a fallback message for quiet runs
- [ ] I recompiled and committed the updated `.lock.yml`
- [ ] I verified at least one run where the fallback path still produced visible output

---

<!-- journey: all -->
Return to [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md).
<!-- /journey -->
