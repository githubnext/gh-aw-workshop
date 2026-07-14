# Side Quest: Sub-Agent Syntax Reference

> _Optional: use this short repair exercise if you want one clean sub-agent pattern before you return to [Step 21](21-inline-sub-agents.md)._

## 🎯 What You'll Do

Repair one broken sub-agent block, then reuse the same pattern in your own workflow. By the end, you'll have one valid block that compiles cleanly and is easy to extend later.

## 📋 Before You Start

- You are starting or have started [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

---

## Start with one broken block

Copy this snippet into a scratch file or read it closely before you fix it:

```markdown
# Daily Issue Digest

## agent: `Issue Summarizer`
---
description: Summarizes one issue in one sentence
model: small
engine: openai
---

Read one issue and return exactly one sentence.

## How to use this workflow

Run it from GitHub Actions.
```

This block has three problems:

- the agent name is invalid
- one frontmatter field does not belong in a sub-agent
- the block is in the wrong place

Your job is to fix those three problems in order.

---

## Fix the heading first

Use this pattern for the heading:

```markdown
## agent: `name`
```

A valid name:

- starts with a letter
- stays lowercase
- uses only letters, digits, hyphens, or underscores

**Action:** Change `` `Issue Summarizer` `` to a valid name before you continue.

Quick check:

- [ ] My name starts with a letter
- [ ] My name is lowercase
- [ ] My name has no spaces

---

## Keep only the sub-agent fields

Inside a sub-agent block, keep the frontmatter small:

- `description` explains the sub-agent's job
- `model` is optional if you want to override the parent model

Everything else is stripped during compile. For a repeated worker task like "read one issue and return one sentence," `model: small` is a good default.

**Action:** Remove the unsupported field from the broken block.

> [!TIP]
> If the worker needs the same reasoning depth as the parent, you can omit `model` and let it inherit the parent model.

Quick check:

- [ ] I kept `description`
- [ ] I kept or intentionally removed `model`
- [ ] I removed unsupported fields such as `engine`

---

## Move the block to the bottom

The sub-agent block ends when the parser reaches the next `##` heading. That is why sub-agent blocks belong at the bottom of the file, after the main workflow content.

**Action:** Move the sub-agent block so `## How to use this workflow` stays part of the main workflow, not part of the sub-agent.

Quick check:

- [ ] All main workflow sections come first
- [ ] The sub-agent block is the last `##` section in the file

---

## Compare with one clean version

After your edits, your snippet should look like this:

```markdown
# Daily Issue Digest

## How to use this workflow

Run it from GitHub Actions.

## agent: `issue-summarizer`
---
description: Summarizes one issue in one sentence
model: small
---

Read one issue and return exactly one sentence.
```

If your version follows the same pattern, you are ready to reuse it in your own workflow.

---

## Try the pattern in your workflow

Open your Step 21 workflow and do one real edit:

1. Add or repair one ``## agent: `name` `` block at the bottom of the file.
2. Keep only `description` and, if needed, `model` in the sub-agent frontmatter.
3. Run this command from the repository root:

```bash
gh aw compile
```

> [!TIP]
> If you want faster feedback while editing, run `gh aw compile --watch` in a second terminal.

When the compile finishes, check that you do **not** see warnings about stripped sub-agent fields such as `engine` or `tools`.

---

## ✅ Checkpoint

- [ ] I fixed one invalid sub-agent name
- [ ] I kept only supported sub-agent frontmatter fields
- [ ] I placed the sub-agent block at the bottom of the file
- [ ] `gh aw compile` finished after I applied the same pattern to my own workflow
- [ ] I did not see warnings about stripped sub-agent fields in that compile

---

Return to [Step 21: Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md).
