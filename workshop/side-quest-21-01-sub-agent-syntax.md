# Side Quest: Sub-Agent Syntax Reference

> _Optional: work through this reference if you want to understand sub-agent name rules, block boundaries, and supported frontmatter fields in depth before or after completing [Step 21](21-inline-sub-agents.md), then return to the main path._

This reference covers everything you need to write correct inline sub-agent blocks — names, boundaries, frontmatter fields, and model aliases.

---

## Name rules

A sub-agent heading looks like `## agent: \`name\``. The name must:

- Be enclosed in backticks: `` `name` ``
- Contain only lowercase letters, digits, hyphens, and underscores
- Start with a letter

Valid examples: `` `planner` ``, `` `file-summarizer` ``, `` `code-reviewer` ``

Invalid examples: `` `File Summarizer` `` (spaces and uppercase), `` `1st-agent` `` (starts with a digit)

---

## Block boundary rules

- The sub-agent block starts immediately after the `` ## agent: `name` `` heading.
- The block ends at the next level-2 heading (`##`) or at end of file.
- No closing marker is needed.
- Always place sub-agent blocks **at the bottom** of the file, after all main workflow content.

---

## Supported frontmatter fields

Each sub-agent block may have its own YAML frontmatter fence. Only two fields are meaningful:

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `description` | No | — | Human-readable summary of the sub-agent's role |
| `model` | No | `inherited` | Model override. Use aliases (see table below) for portability. |

All other fields (`engine:`, `tools:`, `network:`, etc.) are **stripped at compile time with a warning**. Sub-agents inherit the parent workflow's engine, tool access, and network configuration.

---

## Model aliases

| Alias | Resolves to | When to use |
|-------|-------------|-------------|
| `small` | mini / haiku / gpt-5-mini / gpt-5-nano / gemini-flash | Cheap, fast tasks: extraction, classification, formatting |
| `large` | sonnet / gpt-5-pro / gpt-5 / gemini-pro | Complex reasoning or synthesis tasks |
| `inherited` | Parent workflow model | Default — use when the sub-agent needs the same capability as the parent |

Use `small` for any bounded retrieval, extraction, or one-shot summarization task. Reserve `large` or `inherited` for the orchestrator, which plans, synthesizes, and decides.

---

## ✅ Checkpoint

- [ ] You understand the naming rules for inline sub-agents
- [ ] You know how and where to place sub-agent blocks in a workflow file
- [ ] You can identify which frontmatter fields are supported inside a sub-agent block
- [ ] You know which model alias to choose for cheap worker tasks vs complex reasoning

---

Return to [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
