# Side Quest 09-01c: Pattern — `safe-output: BLOCKED`

## 🎯 What You'll Do

You will learn how to interpret blocked writes and choose between increasing allowed outputs or constraining agent behavior.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

`safe-output: BLOCKED` means the agent attempted a write after reaching the configured `max` limit for that output type. The run may still finish successfully, but blocked writes are not executed. Your next step depends on intent:

- If multiple writes are expected (for example, one comment per failing service), increase `max`.
- If only one write should happen, keep `max` low and tighten your guideline to prevent duplicate posts.

Treat `max` as a safety boundary, not a convenience setting. A low limit reduces accidental spam if instructions are interpreted too broadly.

When changing behavior, prefer precise workflow guidance like "Post one comment per run. If a comment already exists today, update context in memory and skip writing." If you need help with that wording, ask the `agentic-workflows` skill or iterate quickly with `gh aw compile --watch`.

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
🔧 [tool] github.add_comment → {issue_number: 4, body: "..."}
📤 [output] safe-output: add-comment BLOCKED (limit reached: 1 / 1)
🤔 [plan] Additional comments were prepared but blocked
✅ [done] Task complete (1 output blocked)
```

<details>
<summary>Show answer</summary>

Pattern: **`safe-output: BLOCKED (limit reached)`**. Decide whether the second write is valid (`max` too low) or unintended (guidance too loose).

</details>

## ✅ Checkpoint

- [ ] I can explain what `BLOCKED` means in safe-output logs
- [ ] I can decide when increasing `max` is appropriate
- [ ] I can add a guideline that prevents duplicate writes
- [ ] I can keep safe-output limits intentionally small for safety
