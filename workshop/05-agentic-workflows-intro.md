# Step 5: What Are Agentic Workflows?

_If you already know Actions, this step is the delta: what's new when workflows can reason, decide, and act._

> [!TIP]
> Familiar with LLM-based automation tools? Review the Quick Summary below, then jump ahead to [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md) after you finish [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md).

## 🎯 What You'll Do

You'll connect what you already know about classic GitHub Actions to the agentic model used in this workshop.

This is not a re-introduction to Actions fundamentals — it's a focused view of what's different.

## Quick Summary

> **Key differences from classic Actions:**
>
> - A `gh-aw` workflow still starts with YAML frontmatter fenced by `---`, usually with `name`, `on`, and `permissions`.
> - Below that frontmatter, you write a Markdown task brief instead of a fixed `jobs.steps` script.
> - The agent uses that brief plus the declared permissions and safe outputs to decide how to complete the work at runtime.

## Advanced fast-track: What's New cheat sheet

Use this as a one-page reference for the shift from classic workflows to agentic workflows.

| Classic GitHub Actions | Agentic workflows |
|---|---|
| Predetermined sequence of steps | Goal-oriented flow where an agent can choose next actions |
| Logic is encoded manually in YAML and scripts | Logic can be delegated to an AI agent guided by prompts and constraints |
| Handles known, explicit branches well | Handles ambiguous inputs by reasoning and adapting |
| Output is usually command/script results | Output can include synthesized summaries, decisions, and follow-up actions |
| Human updates workflow logic for every new scenario | Human defines guardrails; agent handles more variation at runtime |
| Great for deterministic automation | Best when tasks require interpretation, triage, or planning |

## What Stays the Same

- Workflows still run in GitHub Actions runners
- Triggers, permissions, and repository context still matter
- You still version workflows in git and review them like code

> [!IMPORTANT]
> In this workshop, learn to iterate on agentic workflows by asking Copilot (or another capable agent) to use the `agentic-workflows` skill. Reading the workflow directly helps you understand it, but editing and debugging agentic workflows by hand is usually less effective. **Agents edit agents.**

## ✅ Checkpoint

- [ ] I can explain at least two differences between classic and agentic workflows
- [ ] I know where agentic workflows still rely on core Actions concepts
- [ ] I'm ready to install the `gh-aw` (GitHub Agentic Workflows) extension

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
