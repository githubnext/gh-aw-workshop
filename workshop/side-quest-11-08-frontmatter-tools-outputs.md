# Side Quest: Frontmatter Deep Dive — Part B

> _Optional continuation of [Part A](side-quest-11-01-frontmatter-deep-dive.md): covers tools, safe-outputs, the closing fence, and the agent body. Return to the main path when done._

## 📋 Before You Start

You have completed [Part A](side-quest-11-01-frontmatter-deep-dive.md) and your draft file already includes `emoji`, `on:`, and `permissions:`.

---

## Section 4 — `tools:`

**🔍 Predict:** To let the agent call GitHub APIs securely and stay within the permissions you declared, what configuration would you add? Write your answer before reading on.

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

**What this section does:** Configures which external tools the AI agent can call during its run.

| Field | Purpose |
|-------|---------|
| `tools:` | Parent key listing every tool integration the agent may use. |
| `github:` | Enables the [GitHub MCP tool](https://github.github.com/gh-aw/guides/mcps/#github-mcp-server) — the interface the agent uses to call GitHub APIs (list issues, list PRs, check CI runs, etc.). |
| `mode: gh-proxy` | Routes API calls through a secure proxy that enforces the `permissions` declared above, preventing calls beyond what you've allowed. |
| `toolsets: [default]` | Activates the standard set of GitHub tools (issues, PRs, commits, actions). Add `discussions` to expand later. |

**✏️ Try it:** Add the `tools:` block to your draft file. Double-check that `mode` and `toolsets` are indented under `github:`.

---

## Section 5 — `safe-outputs:`

**🔍 Predict:** You want the agent to post exactly one comment per run and nothing else. What would you write under `safe-outputs`?

```yaml
safe-outputs:
  add-comment:
    max: 1
```

**What this section does:** Defines the _only_ write actions the agent is permitted to take. This is the safety guardrail that prevents the agent from doing anything you haven't explicitly approved.

| Field | Purpose |
|-------|---------|
| `safe-outputs:` | Parent key listing approved write operations. |
| `add-comment:` | Allows the agent to post a comment on an issue or pull request. |
| `max: 1` | Hard limit — the agent can post at most one comment per run. Extra posts are silently dropped. |

> [!IMPORTANT]
> Without `safe-outputs`, the agent cannot write anything — even if you ask it to in the body. The YAML frontmatter is the source of truth for write access, not the prose instructions.

**✏️ Try it:** Add `safe-outputs` to your draft. Verify that `max: 1` is indented under `add-comment:`.

---

## Section 6 — Closing fence

**🔍 Predict:** How does the file parser know where the YAML configuration ends and the agent's instructions begin?

```yaml
---
```

**What this section does:** Closes the YAML frontmatter. Everything below this line is the Markdown body — the agent's instructions.

**✏️ Try it:** Add the closing `---` to your draft. Confirm the file now has exactly two `---` fences.

---

## Section 7 — The Markdown body (agent instructions)

**🔍 Predict:** The agent must collect four data points from the repository. What four things would you list in the task brief?

```markdown
# Daily Repo Status Report

You are an AI assistant that monitors this repository and posts a concise daily health report.

## Your Task

Collect and summarize:
1. **Open pull requests** — count, and flag any open longer than 7 days
2. **Open issues** — total count, how many are labeled "bug"
3. **CI status** — result of the most recent workflow run on the default branch
4. **Last commit** — message and time since it was pushed

## Guidelines

- Post only one comment. If you have already posted today, skip.
- Keep the report factual. Do not invent numbers.
- If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
```

**What this section does:** This is the plain-English brief you hand to the AI agent — a job description the agent reads at runtime.

Key things to note:

- **Section headers** (`##`) are for human readability; the agent treats the whole body as a single prompt.
- **Numbered lists** help the agent approach tasks in order.
- **An output format template** (not shown above, but part of the full workflow) pins the exact text the agent should generate.
- **Guidelines** handle edge cases (already posted today, no open issues) so the agent doesn't have to guess.

**✏️ Try it:** Add the body below the closing `---` in your draft file, then run `gh aw compile --validate` to check for errors.

---

## ✅ Checkpoint

- [ ] You can explain what `mode: gh-proxy` does and why it matters
- [ ] You understand that `safe-outputs` is the true source of write access
- [ ] Your draft file has two `---` fences with the agent body below the second
- [ ] The file compiles without errors

---

Return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).

## 📚 See Also

- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
- [Using MCPs](https://github.github.com/gh-aw/guides/mcps/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [About Workflows](https://github.github.com/gh-aw/introduction/overview/)
