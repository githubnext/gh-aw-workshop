# Side Quest: Sub-Agent Frontmatter Fields and Chaining

> _Optional: use this before or after [Step 21](21-inline-sub-agents.md) if you want quick practice with sub-agent frontmatter and multiple helper blocks._

## Before You Start

- You finished [Part A: Sub-Agent Names and Block Boundaries](side-quest-21-01a-sub-agent-name-and-block-rules.md) or already know those rules.
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

---

## Frontmatter fields

Inside a sub-agent block, keep frontmatter small. `description` explains the helper. `model` can stay `inherited` or use `small` for cheap bounded work or `large` for heavier reasoning. Other fields are stripped with a warning.

### 🔍 Predict Again

Which fields stay?

```yaml
---
description: Summarizes one issue
model: small
tools: [github]
engine: openai
---
```

<details>
<summary>Answer</summary>

`description` and `model` stay. `tools` and `engine` are stripped because sub-agents inherit those settings from the parent workflow.

</details>

### ✏️ Try It

Choose the best `model` value for a worker that reads one issue and returns one sentence.

```yaml
---
description: Summarizes one issue
model: ?
---
```

<details>
<summary>Answer</summary>

Use `model: small`. The task is bounded and repeated, so the cheaper worker model is the best fit.

</details>

## Chaining multiple sub-agent blocks

You can define more than one helper in the same workflow. Put each block at the bottom of the file and start the next one with another `## agent:` heading.

### ✏️ Quick Check

What is wrong with this layout?

```markdown
## agent: `collector`
Read one issue.

## Notes for maintainers
Keep this workflow simple.

## agent: `writer`
Write the final digest.
```

<details>
<summary>Answer</summary>

The maintainer notes split the helpers apart. Move `## Notes for maintainers` above the sub-agent section, then keep `collector` and `writer` together at the bottom.

</details>

### 🔍 Predict

Which line starts the second helper?

```markdown
## agent: `collector`
Read one issue.

## agent: `writer`
Write the final digest.
```

<details>
<summary>Answer</summary>

``## agent: `writer` `` starts the second helper. It also ends the first helper block.

</details>

## ✅ Checkpoint

- [ ] You can name the two frontmatter fields that a sub-agent keeps.
- [ ] You can explain why `engine` and `tools` are stripped from sub-agent frontmatter.
- [ ] You chose `small`, `large`, or `inherited` for a helper based on the task.
- [ ] You can explain why `small` fits a one-issue summarizer.
- [ ] You can explain when `inherited` is a better choice than `small`.
- [ ] You can place two sub-agent blocks together at the bottom of a workflow file.
- [ ] You can move `## Notes for maintainers` above the sub-agent section.
- [ ] You can explain which `## agent:` heading starts the second helper.
- [ ] You can explain which heading also ends the first helper block.

---

Return to [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
