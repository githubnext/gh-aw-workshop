---
journey: all
adventure: side-quest
---
# Side Quest: Diagnosing Common Agent Output Patterns

> _Optional: use this side quest when a run behaves unexpectedly, then return to [Step 9: Reading Workflow Output](09-understand-output.md)._

## 🎯 What You'll Do

You will diagnose five common output patterns one at a time. Each micro-step includes a short explanation, a realistic log snippet, and an identify-before-reveal exercise.

## 📋 Before You Start

- Complete [Step 9: Reading Workflow Output](09-understand-output.md)

## Pattern Lab Index

| Pattern | What you learn | Micro-step |
|---|---|---|
| Long `[plan]` chain | How to turn planning loops into concrete tool calls | [09-01a](side-quest-09-01a-pattern-long-plan-chain.md) |
| Empty tool results | How to separate permission issues from filter issues | [09-01b](side-quest-09-01b-pattern-empty-results.md) |
| `safe-output: BLOCKED` | How to decide between raising `max` and tightening guidance | [09-01c](side-quest-09-01c-pattern-safe-output-blocked.md) |
| `permission denied` | How to map failures to `permissions` vs `safe-outputs` | [09-01d](side-quest-09-01d-pattern-permission-denied.md) |
| "Done" with no write | How to clarify write conditions and fallback behavior | [09-01e](side-quest-09-01e-pattern-done-no-write.md) |

Need a reusable triage flow after the pattern drills? Open the [Debugging Checklist](side-quest-09-01f-debugging-checklist.md).

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can choose the right micro-step from the pattern table
- [ ] I can use the exercise format to identify each pattern before checking the answer
- [ ] I can open the checklist page when I need full run triage
- [ ] I know to return to [Step 9](09-understand-output.md) after this side quest

<!-- /journey -->
For more details, see [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/), [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/), and [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/).

