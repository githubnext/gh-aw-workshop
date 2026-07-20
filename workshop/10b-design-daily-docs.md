<!-- page-journey: all -->
<!-- page-adventure: scenario-b -->
# Design — Daily Documentation Updater

> _Great [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) start with a clear brief — writing down what you want before you code anything saves hours of debugging later._

## 🎯 What You'll Do

You'll design a **Daily Documentation Updater** workflow. Instead of jumping straight into YAML, you'll sketch the agent's goal, inputs, and expected output in plain English first. By the end you'll have a clear brief ready to translate into a workflow file in the next step.

## 📋 Before You Start

- You've completed [Choose Your Scenario](10-choose-your-scenario.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Why This Scenario?

Documentation tends to drift. Code changes, but the `README`, architecture docs, and API references don't always keep up. By the end of this path you'll have an agent that reads your docs directory every day, spots staleness and missing content, and posts a structured health report — before your users notice.

---

## The Four Components of a Good Brief

Every effective agent brief covers these four things:

| Component | What to write | Example |
|-----------|--------------|---------|
| **Goal** | One sentence: what should the agent do? | "Post a daily docs health summary as a GitHub issue comment." |
| **Inputs** | Bullet list of the data the agent needs to collect | Markdown files in `docs/`, `README.md`, last commit date per file |
| **Output format** | A concrete skeleton or template the agent should fill in | The comment template below |
| **Guardrails** | Short rules that prevent unexpected behaviour | Never modify docs; post once per day |

---

## A Ready-to-Use Starter Brief

Copy this into a scratch file and personalise it:

```
Every day, scan this repository's documentation files and post a short
health summary as a comment on the issue titled "Daily Docs Health" (create
the issue if it doesn't exist).

Inputs to collect:
- All Markdown files in the docs/ directory and the root README.md
- The date of the most recent commit that touched each file
- A rough word count or section count per file (to detect near-empty pages)
- Any internal links (to other docs files) that resolve to a missing file

Output format:
📚 Docs Health Report — {today's date}
═══════════════════════════════════
📄 Files scanned:       {count}
⏳ Stale (>30 days):    {count} ({file names})
🚧 Thin pages (<200w):  {count} ({file names})
🔗 Broken internal links: {count}

{One or two sentences of overall health. Call out the highest-priority item.}

Guardrails:
- Post only one comment per calendar day. If today's report already exists, stop.
- Never edit or commit changes to documentation files — read only.
- Write "unknown" for any field where data is unavailable.
- If the "Daily Docs Health" issue doesn't exist, create it, then comment.
```

> [!TIP]
> Want a deeper walkthrough of the brief-writing process? [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md) walks through each component step by step with extra tips on why each decision matters.

---

> [!TIP]
> Use the **`/agentic-workflows` Copilot skill** in Copilot Chat to design and build your workflow prompts interactively — describe what you want and the skill will guide you through goal, inputs, output format, and guardrails.

## Thinking Through the Design

Before moving on, ask yourself these questions:

**What counts as "stale"?**
The starter brief uses 30 days as the cutoff. Is that right for your project? A rapidly changing codebase might want 7 days; a stable library might tolerate 90.

**Which directory holds your docs?**
The brief scans `docs/` and `README.md`. If your project stores documentation elsewhere (for example `wiki/` or `.github/`), update the input list.

**What's "thin" enough to flag?**
200 words is a rough proxy for a page that hasn't been filled in yet. Adjust the threshold to match your project's conventions.

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily documentation updater
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules

<!-- journey: all -->
**Next:** [Step 11b: Build — Daily Documentation Updater](11b-build-daily-docs.md)
<!-- /journey -->


