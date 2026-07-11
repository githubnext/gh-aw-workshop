# Step 10: Design Your Daily Repo Status Report

> _Great agentic workflows start with a clear brief — writing down what you want before you code anything saves hours of debugging later._

## 🎯 What You'll Do

You'll design your first real-world agentic workflow: a **Daily Repo Status Report**. Instead of jumping straight into YAML, you'll sketch the agent's goal, inputs, and expected output in plain English first. By the end you'll have a clear brief ready to translate into a workflow file in the next step.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Why Design Before You Build?

An agentic workflow is a set of **instructions for an AI agent**. Just like a junior colleague, the agent will do exactly what you ask — no more, no less. Vague instructions produce vague results.

Spending five minutes writing a brief makes your instructions concrete. It also gives you a checklist you can use to verify the output later.

---

## Step 1: State the Goal in One Sentence

Open a scratch file (or grab a piece of paper) and answer:

> _"Every day, I want the agent to…"_

For this workshop the answer is:

> "Every day, I want the agent to read the current state of my repository and post a short health summary as a GitHub issue comment."

Write your own version. You can use a different repository section (e.g. focus on pull requests only, or on CI status). Keep it to one sentence.

---

## Step 2: List the Inputs

What information does the agent need to produce the report?

Think through each piece of data:

- **Open pull requests** — count and titles
- **Open issues** — count, and how many are labelled `bug`
- **CI status** — did the last workflow run pass or fail?
- **Last commit** — message and when it was made

Write these down as bullet points. If you're not sure whether a piece of data is available, add a `?` next to it — you can verify it later.

> [!TIP]
> GitHub's REST API exposes all of the above. The `gh aw` agent can call `gh api` commands automatically when you list the right scopes in your workflow's frontmatter.

---

## Step 3: Describe the Output Format

Decide what the comment should look like. A consistent format makes the report easy to scan at a glance. Here is a simple template to start with:

```
📊 Daily Repo Status — {today's date}
══════════════════════════════════
🔀 Open pull requests:  {count}
🐛 Open issues:         {count}  ({bug-count} labeled "bug")
✅ CI status:           {passing/failing/unknown}
📝 Last commit:         "{message}" — {time ago}

{One sentence of overall health. Flag anything that needs attention.}
```

Adjust the emoji, wording, or sections to suit your taste. The agent will fill in the `{placeholders}` from real data.

---

## Step 4: Write the Guardrails

Guardrails are rules that keep the agent from doing something unexpected. For this workflow, three rules matter:

1. **Post only one comment per day.** If a report already exists for today, skip the run.
2. **Never invent numbers.** If data is unavailable, write "unknown" — don't guess.
3. **If no issue exists to comment on, create one** titled `Daily Status Reports` and post there.

Write your guardrails as a short bulleted list in plain English. You'll paste this into the workflow body in the next step.

> [!WARNING]
> Skipping guardrails is the most common cause of runaway agents. One missing rule can result in the agent posting dozens of duplicate comments.

---

## Step 5: Check Your Brief

Review what you've written. Your brief should answer:

| Question | Answer |
|---------|--------|
| What is the agent's one-sentence goal? | ✅ |
| What data does it need? | ✅ |
| What does the output look like? | ✅ |
| What rules should it follow? | ✅ |

If any row is blank, fill it in before moving on.

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily status report
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules

**Next:** [Step 11: Build — Daily Repo Status Workflow](11-build-daily-status.md)
