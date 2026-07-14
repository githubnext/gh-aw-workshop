# Side Quest: Diagnosing Common Agent Output Patterns

> _Optional: use this side quest when a run behaves unexpectedly, then return to [Step 9: Reading Workflow Output](09-understand-output.md)._

## 🎯 What You'll Do

You will diagnose five common output patterns one at a time. Each micro-step includes a short explanation, a realistic log snippet, and an identify-before-reveal exercise.

## 📋 Before You Start

- Completed [Step 9: Reading Workflow Output](09-understand-output.md)

## Quick Triage

Before diving into a specific pattern, glance at the top of the failing run's log. Here is what a long plan chain failure looks like:

```
[plan] I will search for open pull requests and collect their titles.
[plan] I should also check the issue count before writing.
[plan] I will search again to confirm the results are complete.
[plan] Let me re-read the task brief to make sure I haven't missed anything.
```

**Which pattern does this match?**

<details>
<summary>Reveal answer</summary>

Long `[plan]` chain → see [09-01a](side-quest-09-01a-pattern-long-plan-chain.md)

</details>

## Pattern Lab Index

| Pattern | What you learn | Micro-step |
|---|---|---|
| Long `[plan]` chain | How to turn planning loops into concrete tool calls | [09-01a](side-quest-09-01a-pattern-long-plan-chain.md) |
| Empty tool results | How to separate permission issues from filter issues | [09-01b](side-quest-09-01b-pattern-empty-results.md) |
| `safe-output: BLOCKED` | How to decide between raising `max` and tightening guidance | [09-01c](side-quest-09-01c-pattern-safe-output-blocked.md) |
| `permission denied` | How to map failures to `permissions` vs `safe-outputs` | [09-01d](side-quest-09-01d-pattern-permission-denied.md) |
| "Done" with no write | How to clarify write conditions and fallback behavior | [09-01e](side-quest-09-01e-pattern-done-no-write.md) |

Need a reusable triage flow after the pattern drills? Open the [Debugging Checklist](side-quest-09-01f-debugging-checklist.md).

## ✅ Checkpoint

- [ ] I ran at least one micro-step drill and identified the pattern before revealing the answer
- [ ] I can choose the right micro-step from the pattern table
- [ ] I can use the exercise format to identify each pattern before checking the answer
- [ ] I can open the checklist page when I need full run triage
- [ ] I know to return to [Step 9](09-understand-output.md) after this side quest

## 📚 See Also

- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/)
- [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/)
- [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/)
