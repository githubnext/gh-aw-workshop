# Side Quest: Sub-Agent Syntax Reference

> _Optional: work through this reference if you want to understand sub-agent name rules, block boundaries, and supported frontmatter fields in depth before or after completing [Step 21](21-inline-sub-agents.md), then return to the main path._

This reference covers everything you need to write correct inline sub-agent blocks — names, boundaries, frontmatter fields, and model aliases.

## 📋 Before You Start

Complete [Step 21 (Inline Sub-Agents)](21-inline-sub-agents.md) or work through this guide before starting Step 21.

---

## Name rules

A sub-agent heading looks like `## agent: \`name\``. The name must:

- Be enclosed in backticks: `` `name` ``
- Contain only lowercase letters, digits, hyphens, and underscores
- Start with a letter

Valid examples: `` `planner` ``, `` `file-summarizer` ``, `` `code-reviewer` ``

Invalid examples: `` `File Summarizer` `` (spaces and uppercase), `` `1st-agent` `` (starts with a digit)

### ✏️ Quick Check — Name rules

Which of these names are valid? Explain why each is valid or invalid.

- (a) `` `File-Summarizer` ``
- (b) `` `file_summarizer` ``
- (c) `` `1st-agent` ``

<details>
<summary>Answer</summary>

- (a) **Invalid** — contains uppercase letters (`F`, `S`). Names must use only lowercase letters, digits, hyphens, and underscores.
- (b) **Valid** — all lowercase, starts with a letter, only letters and underscores.
- (c) **Invalid** — starts with a digit (`1`). Names must start with a letter.

</details>

---

## Block boundary rules

- The sub-agent block starts immediately after the `` ## agent: `name` `` heading.
- The block ends at the next level-2 heading (`##`) or at end of file.
- No closing marker is needed.
- Always place sub-agent blocks **at the bottom** of the file, after all main workflow content.

### ✏️ Quick Check — Block boundaries

Consider this workflow snippet. Is the sub-agent block placement correct? If not, what needs to change?

```markdown
## agent: `summarizer`

Summarize the issue.

## How to use this workflow

Run via GitHub Actions...
```

<details>
<summary>Answer</summary>

**Incorrect** — the sub-agent block appears before the "How to use this workflow" section. Sub-agent blocks must be placed **at the bottom** of the file, after all main workflow content. Move the `## agent: \`summarizer\`` block to the end of the file.

</details>

---

## Supported frontmatter fields

Each sub-agent block may have its own YAML frontmatter fence. Only two fields are meaningful:

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `description` | No | — | Human-readable summary of the sub-agent's role |
| `model` | No | `inherited` | Model override. Use aliases (see table below) for portability. |

All other fields (`engine:`, `tools:`, `network:`, etc.) are **stripped at compile time with a warning**. Sub-agents inherit the parent workflow's engine, tool access, and network configuration.

### ✏️ Quick Check — Frontmatter fields

You write this frontmatter inside a sub-agent block:

```yaml
---
description: Classifies issue severity
model: small
engine: openai
tools: [read_file]
---
```

Which fields will be kept at compile time, and which will be stripped? What warning(s) should you expect?

<details>
<summary>Answer</summary>

**Kept:** `description` and `model` — these are the only two supported fields.

**Stripped with a warning:** `engine` and `tools` — sub-agents inherit these from the parent workflow and cannot override them. Expect a compile-time warning for each stripped field.

</details>

---

## Model aliases

| Alias | Resolves to | When to use |
|-------|-------------|-------------|
| `small` | mini / haiku / gpt-5-mini / gpt-5-nano / gemini-flash | Cheap, fast tasks: extraction, classification, formatting |
| `large` | sonnet / gpt-5-pro / gpt-5 / gemini-pro | Complex reasoning or synthesis tasks |
| `inherited` | Parent workflow model | Default — use when the sub-agent needs the same capability as the parent |

Use `small` for any bounded retrieval, extraction, or one-shot summarization task. Reserve `large` or `inherited` for the orchestrator, which plans, synthesizes, and decides.

### ✏️ Quick Check — Model aliases

You are building a sub-agent that classifies issue labels (e.g., assigns `bug`, `enhancement`, or `question` based on the issue body). Which alias should you use and why?

<details>
<summary>Answer</summary>

Use **`small`** — label classification is a bounded, one-shot task: the sub-agent reads a short input and returns a single word. It does not require complex reasoning or multi-step synthesis, so a cheap, fast model is the right choice. Reserve `large` or `inherited` for the orchestrator that coordinates the overall workflow.

</details>

---

## ✅ Checkpoint

- [ ] You corrected at least one invalid sub-agent name in the Name rules Quick Check.
- [ ] You can explain why `engine:` fields inside a sub-agent block are stripped at compile time.
- [ ] You chose the correct model alias for a cheap classification task and justified the choice.
- [ ] You placed a sub-agent block correctly (after main content, at bottom of file) in the Block boundaries Quick Check.

---

Return to [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
