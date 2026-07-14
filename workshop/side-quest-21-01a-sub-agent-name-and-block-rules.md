# Side Quest: Sub-Agent Names and Block Boundaries

> _Optional: use this before or after [Step 21](21-inline-sub-agents.md) if you want quick practice with the first two syntax rules._

## Before You Start

- You are working through [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

---

## Name rules

Write each helper as ``## agent: `name` ``. A valid name is wrapped in backticks, starts with a letter, and uses only lowercase letters, digits, `_`, or `-`.

### 🔍 Predict Again

Which heading compiles?

```markdown
## agent: `issue-summarizer`
## agent: `Issue Summarizer`
## agent: `1st-agent`
```

<details>
<summary>Answer</summary>

Only `issue-summarizer` compiles. The second heading uses spaces and uppercase letters. The third starts with a digit.

</details>

### ✏️ Try It

Fix the two broken headings.

```markdown
## agent: `Daily Reporter`
## agent: `2nd-pass`
```

<details>
<summary>Answer</summary>

One valid fix is:

```markdown
## agent: `daily-reporter`
## agent: `second-pass`
```

</details>

## Block boundaries

A sub-agent starts right after its heading. It ends at the next `##` heading or at end of file. Keep every sub-agent block at the bottom of the workflow, after the main brief.

### ✏️ Quick Check

What must move?

```markdown
## agent: `summarizer`

Summarize one issue.

## How to use this workflow
Run it from Actions.
```

<details>
<summary>Answer</summary>

Move the whole `summarizer` block below `## How to use this workflow`. A regular `##` heading ends the sub-agent block, so the helper must stay at the bottom.

</details>

### 🔍 Predict

Where does the first block end?

```markdown
## agent: `collector`
Read one issue.

## agent: `writer`
Write the final digest.
```

<details>
<summary>Answer</summary>

The `collector` block ends right before the `writer` agent heading. That second level-2 heading starts a new sub-agent block.

</details>

## ✅ Checkpoint

- [ ] You can spot one valid and two invalid sub-agent names.
- [ ] You corrected a name that had uppercase letters or spaces.
- [ ] You corrected a name that started with a digit.
- [ ] You can rewrite ``## agent: `Daily Reporter` `` as a valid heading.
- [ ] You can explain that the next `##` heading ends the current sub-agent block.
- [ ] You can point to the exact heading that ends the `collector` block.
- [ ] You can place a sub-agent block at the bottom of a workflow file.

---

Next: [Side Quest: Sub-Agent Frontmatter Fields and Chaining](side-quest-21-01b-sub-agent-frontmatter-fields.md) or return to [Step 21](21-inline-sub-agents.md).
