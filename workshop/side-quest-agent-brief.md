# Side Quest: Writing a Clear Agent Brief

> _Optional: work through this guide if you want a deeper walkthrough of the five-step brief-writing framework — then return to [Step 10](10-design-daily-status.md) or [Step 11](11-build-daily-status.md)._

## 🎯 What You'll Do

Walk through a structured, five-step method for designing the brief that drives any agentic workflow. By the end you'll have a complete, ready-to-paste brief for your daily status report — and a reusable framework you can apply to any future workflow.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Why a Framework?

A brief is the natural-language instruction your AI agent reads before acting. Unlike a chat message, it runs unattended — the agent can't ask clarifying questions, so ambiguity becomes bugs. A five-minute structured exercise prevents hours of debugging later.

---

## Step 1: State the Goal in One Sentence

Open a scratch file (or grab a piece of paper) and answer:

> _"Every day, I want the agent to…"_

For the daily status report the answer is:

> "Every day, I want the agent to read the current state of my repository and post a short health summary as a GitHub issue comment."

Write your own version. You can focus on a different repository section (e.g. pull requests only, or CI status only). **Keep it to one sentence.**

> [!TIP]
> One sentence forces a clear scope. If you need two sentences, you probably have two workflows. Split them. A focused workflow is easier to test, cheaper to run, and simpler to debug.

---

## Step 2: List the Inputs

What information does the agent need to produce the report? Think through each piece of data:

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

> [!TIP]
> Include a literal skeleton — not just a description. Seeing the exact structure you want makes it far easier for the model to produce predictable output, and makes it far easier for you to spot when something is off.

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

> [!TIP]
> Most agentic workflows need at least these default guardrails: a **deduplication rule** (don't repeat the action if already done today), a **data-integrity rule** (don't invent missing data), and an **error-handling rule** (what to do if a prerequisite is missing). Start from this list and add workflow-specific rules on top.

---

## Step 5: Check Your Brief

Review what you've written. Your brief should answer each of these questions:

| Question | Answer |
|----------|--------|
| What is the agent's one-sentence goal? | ✅ |
| What data does it need? | ✅ |
| What does the output look like? | ✅ |
| What rules should it follow? | ✅ |

If any row is blank, fill it in before moving on.

> [!TIP]
> Treat this table as **acceptance criteria**. After you run the workflow for the first time, come back here and check whether the agent's actual output satisfies every row. If it doesn't, the brief — not the agent — is the thing to fix.

---

## Your Completed Brief

Here is a starter brief that combines all five steps for the daily status report:

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

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily status report
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules
- [ ] I've reviewed the brief against all four acceptance criteria

---

Return to [Step 10: Design Your Daily Repo Status Report](10-design-daily-status.md) or continue to [Step 11: Build Your Daily Repo Status Workflow](11-build-daily-status.md).
