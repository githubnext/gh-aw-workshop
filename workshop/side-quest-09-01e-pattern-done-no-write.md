<!-- journey: all -->
<!-- adventure: side-quest -->
# Side Quest 09-01e: Pattern — "Done" but Nothing Written

## 🎯 What You'll Do

You will diagnose successful runs that produce no write output and tighten instructions so expected writes happen reliably.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

A run can finish with `✅ [done]` and still create no comment or issue. That outcome is often correct: your condition may not have been met. The challenge is determining whether the skip was intentional or caused by ambiguous logic.

Start with three checks:

1. Confirm whether your condition was actually true at runtime.
2. Confirm a matching write action exists in `safe-outputs:`.
3. Confirm your instructions define what to do when no condition matches.

To avoid silent no-write outcomes, include explicit fallback behavior such as: "If no incidents are found, post one status comment saying no action is required." This still gives users a visible status indicator and proves the workflow ran.

If you are unsure how to phrase conditions, ask the `agentic-workflows` skill to rewrite the conditional language, or iterate with `gh aw compile --watch`.

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
🤔 [plan] Repository checks passed; no escalation criteria met
✅ [done] Task complete

### Summary
Reviewed signals and took no action.
```

<details>
<summary>Show answer</summary>

Pattern: **Summary says "done" but nothing was written**. Clarify write conditions and add a fallback write rule when you need visible output every run.

</details>

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can explain why a successful run might skip writing
- [ ] I can verify whether write conditions were truly met
- [ ] I can check that `safe-outputs:` includes the needed write action
- [ ] I can add a fallback output rule for no-action scenarios

<!-- /journey -->
For more details, see [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/), and [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/).

