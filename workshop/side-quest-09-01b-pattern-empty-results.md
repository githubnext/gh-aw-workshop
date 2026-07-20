---
journey: all
adventure: side-quest
---
# Side Quest 09-01b: Pattern — Empty `[result]` Data

## 🎯 What You'll Do

You will diagnose empty tool responses and decide whether the root cause is missing read scope, over-filtering, or truly empty repository data.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

An empty result does not always mean failure. The call may succeed but return zero records. Start by checking whether your tool needs a read scope that is missing from `permissions:`. Then test whether your query is too narrow. For example, `labels: bug` returns nothing if no issue currently has that label. Your goal is to isolate one variable at a time so you can see whether the problem is authorization, query logic, or data state.

Use this sequence:

1. Confirm the required read scope in workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) (for example, `issues: read`).
2. Re-run with broader filters (or no optional filters).
3. Compare with repository reality in the GitHub UI.

If the call still returns empty and data exists, ask the `agentic-workflows` skill to review your tool arguments, or keep `gh aw compile --watch` running while you adjust inputs.

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
🔧 [tool] github.list_issues → {state: open, labels: "bug"}
📥 [result] 0 issues returned
🤔 [plan] No matching records; nothing to post
✅ [done] Task complete
```

<details>
<summary>Show answer</summary>

Pattern: **`[tool]` call returns empty results**. Check required read permissions and broaden filters to confirm data availability.

</details>

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can distinguish an empty result from a failed tool call
- [ ] I can verify required read scopes in `permissions:`
- [ ] I can test a broader query to isolate filter problems
- [ ] I can validate whether matching repository data actually exists

<!-- /journey -->
For more details, see [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/), [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), and [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/).

