<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 09-01c: Pattern — [Safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) `limit reached`

## :dart: What You'll Do

You will learn how to interpret blocked writes and choose between increasing allowed outputs or constraining agent behavior.

## :clipboard: Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

A safe-output error such as `E002: add-comment limit reached — 1 of 1 already used this run` means the agent attempted a write after reaching the configured `max` limit for that output type. The run may still finish successfully, but blocked writes are not executed. Your next step depends on intent:

- If multiple writes are expected (for example, one comment per failing service), increase `max`.
- If only one write should happen, keep `max` low and tighten your guideline to prevent duplicate posts.

Treat `max` as a safety boundary, not a convenience setting. A low limit reduces accidental spam if instructions are interpreted too broadly.

When changing behavior, prefer precise workflow guidance like "Post one comment per run. If a comment already exists today, update context in memory and skip writing."

If you need help with wording, ask the `agentic-workflows` skill or iterate quickly with [`gh aw compile --watch`](https://github.github.com/gh-aw/setup/cli/#compile).

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
:wrench: [tool] github.add_comment → {issue_number: 4, body: "..."}
:x: [error] E002: add-comment limit reached — 1 of 1 already used this run
:thinking: [plan] Additional comments were prepared but blocked
:white_check_mark: [done] Task complete (1 output blocked)
```

<details>
<summary>Show answer</summary>

Pattern: **safe-output `limit reached`**. Decide whether the second write is valid (`max` too low) or unintended (guidance too loose).

</details>

<!-- journey: all -->
## :white_check_mark: Checkpoint

- [ ] I can explain what `BLOCKED` means in safe-output logs
- [ ] I can decide when increasing `max` is appropriate
- [ ] I can add a guideline that prevents duplicate writes
- [ ] I can keep safe-output limits intentionally small for safety

<!-- /journey -->
