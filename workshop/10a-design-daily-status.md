---
journey: all
adventure: scenario-a
---
# Step 10a: Design — Daily Repo Status Report

> _Great agentic workflows start with a clear brief — writing down what you want before you code anything saves hours of debugging later._

## 🎯 What You'll Do

You'll design your first real-world [agentic workflow](https://github.github.com/gh-aw/introduction/overview/): a **Daily Repo Status Report**. Instead of jumping straight into YAML, you'll sketch the agent's goal, inputs, and expected output in plain English first. By the end you'll have a clear brief ready to translate into a workflow file in the next step.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Why Design Before You Build?

An agentic workflow is a set of **instructions for an AI agent**. Just like a junior colleague, the agent will do exactly what you ask — no more, no less. Vague instructions produce vague results.

Spending five minutes writing a brief makes your instructions concrete. It also gives you a checklist you can use to verify the output later.

---

## The Four Components of a Good Brief

Every effective agent brief covers these four things:

| Component | What to write | Example |
|-----------|--------------|---------|
| **Goal** | One sentence: what should the agent do? | "Post a daily health summary as a GitHub issue comment." |
| **Inputs** | Bullet list of the data the agent needs to collect | Open PRs, open issues, CI status, last commit |
| **Output format** | A concrete skeleton or template the agent should fill in | The comment template below |
| **Guardrails** | Short rules that prevent unexpected behaviour | Post once per day; never invent data |

---

## A Ready-to-Use Starter Brief

Copy this into a scratch file and personalise it:

```
Every day, read the current state of this repository and post a short health
summary as a comment on the issue titled "Daily Status Reports" (create the
issue if it doesn't exist).

Inputs to collect:
- Number of open pull requests (and their titles)
- Number of open issues (and how many are labelled "bug")
- Result of the most recent CI workflow run
- Message and timestamp of the most recent commit

Output format:
📊 Daily Repo Status — {today's date}
══════════════════════════════════
🔀 Open pull requests:  {count}
🐛 Open issues:         {count}  ({bug-count} labeled "bug")
✅ CI status:           {passing/failing/unknown}
📝 Last commit:         "{message}" — {time ago}

{One sentence of overall health. Flag anything that needs attention.}

Guardrails:
- Post only one comment per calendar day. If today's report already exists, stop.
- Never invent numbers. Write "unknown" if data is unavailable.
- If the "Daily Status Reports" issue doesn't exist, create it, then comment.
```

> [!TIP]
> Want a deeper walkthrough of the brief-writing process? [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md) walks through each component step by step with extra tips on why each decision matters.

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily status report
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules

<!-- journey: all -->
**Next:** [Step 11a: Build — Daily Repo Status Workflow](11a-build-daily-status.md)
<!-- /journey -->

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
