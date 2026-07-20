---
journey: all
adventure: side-quest
---
# Side Quest 09-01a: Pattern — Long `[plan]` Chains

## 🎯 What You'll Do

You will learn how to spot a planning loop and rewrite your workflow brief so the agent starts with an explicit first tool call.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

When you see many consecutive `[plan]` lines and no `[tool]` line, the agent is thinking but not acting. This usually means your brief leaves too much room for interpretation. A goal like "find the most important issue" sounds clear to you, but it does not tell the agent what data to fetch first or how to rank results.

Use this structure in your brief:

- Start action: "Call `github.list_issues` to list open issues."
- Ranking rule: "Sort by reactions and pick the top item."
- Output rule: "Post one comment that includes the selected issue URL and reason."

If you need help tightening wording, ask the `agentic-workflows` skill to rewrite your brief or run `gh aw compile --watch`.

## Hands-On Exercise

Read this snippet and identify the pattern before you open the answer.

```text
🤔 [plan] Need the highest-impact issue
🤔 [plan] I should define impact first
🤔 [plan] Reactions might help
🤔 [plan] I need to compare issue engagement
🤔 [plan] I should list open issues eventually
```

<details>
<summary>Show answer</summary>

Pattern: **Long `[plan]` chain with no `[tool]` call**. Fix by adding an explicit first call and ranking rule.

</details>

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can recognize a planning loop from log lines alone
- [ ] I can explain why ambiguous goals create delayed tool use
- [ ] I can add a concrete first tool call to my workflow brief
- [ ] I can define a clear ranking rule the agent can execute

<!-- /journey -->
For more details, see [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/), [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), and [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/).

