# Side Quest: Sub-Agent Syntax Reference

> _Optional: work through this reference if you want to understand sub-agent name rules, block boundaries, and supported frontmatter fields in depth before or after completing [Step 21](21-inline-sub-agents.md), then return to the main path._

Work through this reference to practice writing correct sub-agent blocks — then return to Step 21 to apply these rules in your own workflow.

## 📋 Before You Start

- You are starting or have started [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md) and want a deeper reference on sub-agent syntax rules.
- You are familiar with YAML frontmatter from [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md).
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

---

## Name rules

**🔍 Predict:** Which naming mistakes usually break a sub-agent heading — invalid characters, missing backticks, or the wrong starting character? Make a quick guess before reading the rules.

A sub-agent heading looks like `## agent: \`name\``. The name must:

- Be enclosed in backticks: `` `name` ``
- Contain only lowercase letters, digits, hyphens, and underscores
- Start with a letter

Valid examples: `` `planner` ``, `` `file-summarizer` ``, `` `code-reviewer` ``

Invalid examples: `` `File Summarizer` `` (spaces and uppercase), `` `1st-agent` `` (starts with a digit)

<details>
<summary>Answer</summary>

The most common problems in that list are **missing backticks**, **invalid characters** (such as spaces or uppercase letters), and **the wrong starting character**. A valid name must be wrapped in backticks, use only lowercase letters/digits/hyphens/underscores, and start with a letter.

</details>

### ✏️ Try it: fix the broken names

Which of these headings are invalid? Fix each one before reading the answer.

- `` ## agent: `File Summarizer` ``
- `` ## agent: `1st-agent` ``
- `` ## agent: `code-reviewer` ``

<details>
<summary>Answer</summary>

- `` ## agent: `File Summarizer` `` — **Invalid**: contains spaces and uppercase letters. Fix: `` ## agent: `file-summarizer` ``
- `` ## agent: `1st-agent` `` — **Invalid**: starts with a digit. Fix: `` ## agent: `first-agent` `` or choose a name that starts with a letter.
- `` ## agent: `code-reviewer` `` — **Valid**: all lowercase, starts with a letter, only letters and a hyphen.

</details>

---

## Block boundary rules

**🔍 Predict:** If you add another `##` heading after a sub-agent, does that new heading stay inside the sub-agent block or end it?

- The sub-agent block starts immediately after the `` ## agent: `name` `` heading.
- The block ends at the next level-2 heading (`##`) or at end of file.
- No closing marker is needed.
- Always place sub-agent blocks **at the bottom** of the file, after all main workflow content.

<details>
<summary>Answer</summary>

Another `##` heading **ends** the sub-agent block. The parser treats the next level-2 heading as the start of a new top-level section.

</details>

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

**Incorrect** — the sub-agent block appears before the "How to use this workflow" section. Sub-agent blocks must be placed **at the bottom** of the file, after all main workflow content. Move the `` ## agent: `summarizer` `` block to the end of the file.

</details>

---

## Supported frontmatter fields

**🔍 Predict:** If a sub-agent could only override the fields most specific to its own role and cost, which fields would you expect those to be?

Each sub-agent block may have its own YAML frontmatter fence. Only two fields are meaningful:

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `description` | No | — | Human-readable summary of the sub-agent's role |
| `model` | No | `inherited` | Model override. Use aliases (see table below) for portability. |

All other fields (`engine:`, `tools:`, `network:`, etc.) are **stripped at compile time with a warning**. Sub-agents inherit the parent workflow's engine, tool access, and network configuration.

Here is a complete sub-agent block showing both supported fields in use:

```markdown
## agent: `issue-classifier`

---
description: Classifies each issue by severity and assigns the right label
model: small
---

Read the issue body and reply with exactly one label: `bug`, `enhancement`, or `question`.
```

In this example, `description` documents the sub-agent's role for readers and tooling, and `model: small` keeps costs low for this bounded classification task.

### ✏️ Try it: keep or strip?

Before reading on, sort these four fields into two buckets: **kept** or **stripped**.

- `description`
- `model`
- `engine`
- `tools`

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

**🔍 Predict:** Which alias would you reach for first when a worker does one small, repetitive task hundreds of times?

| Alias | Resolves to | When to use |
|-------|-------------|-------------|
| `small` | mini / haiku / gpt-5-mini / gpt-5-nano / gemini-flash | Cheap, fast tasks: extraction, classification, formatting |
| `large` | sonnet / gpt-5-pro / gpt-5 / gemini-pro | Complex reasoning or synthesis tasks |
| `inherited` | Parent workflow model | Default — use when the sub-agent needs the same capability as the parent |

Use `small` for any bounded retrieval, extraction, or one-shot summarization task. Reserve `large` or `inherited` for the orchestrator, which plans, synthesizes, and decides.

<details>
<summary>Answer</summary>

Start with **`small`**. Repetitive worker tasks usually benefit most from the cheapest bounded model, while the parent agent keeps the heavier planning and synthesis work.

</details>

### ✏️ Try it: match the task to the alias

Choose the best alias for each task before opening the answer.

- Read one issue and return `bug`, `docs`, or `question`
- Plan the full workflow, choose which workers to call, and write the final report
- Use the same model as the parent because the worker needs the same reasoning depth

<details>
<summary>Answer</summary>

- Issue classifier → **`small`**
- Orchestrator/planner → **`large`**
- Match the parent model → **`inherited`**

</details>

### ✏️ Quick Check — Model aliases

You're writing a sub-agent that reads 500 files and summarises each one. Which alias should you use, and why?

<details>
<summary>Answer</summary>

Use **`small`** — summarizing a single file is a bounded, one-shot task that does not require complex reasoning. Using `small` across 500 sub-agent invocations keeps costs low and latency short. Reserve `large` or `inherited` for the orchestrating agent that plans, coordinates the sub-agents, and synthesizes the final output.

</details>

---

## ✅ Checkpoint

- [ ] You corrected at least one invalid sub-agent name in the Name rules Quick Check.
- [ ] You can explain why `engine:` fields inside a sub-agent block are stripped at compile time.
- [ ] You chose the correct model alias for a cheap classification task and justified the choice.
- [ ] You placed a sub-agent block correctly (after main content, at bottom of file) in the Block boundaries Quick Check.

---

Return to [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
