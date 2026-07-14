# Side Quest: Writing a Clear Agent Brief

> _Optional: work through this guide if you want a deeper walkthrough of the five-step brief-writing framework — then return to [Step 10](10a-design-daily-status.md) or [Step 11](11a-build-daily-status.md)._

## 🎯 What You'll Do

Walk through a structured, five-step method for designing the brief that drives any agentic workflow. By the end you'll have a complete, ready-to-paste brief for your daily status report — and a reusable framework you can apply to any future workflow.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## At a Glance

Five steps, five minutes. Here's the complete framework — expand each step below for the detailed walkthrough.

| Step | What to write | Takes about |
|------|--------------|-------------|
| 1. Goal | One sentence: what should the agent do every day? | 1 min |
| 2. Inputs | Bullet list of the data the agent needs to collect | 1 min |
| 3. Output format | A literal skeleton the agent fills in | 1 min |
| 4. Guardrails | Rules that prevent unexpected behaviour | 1 min |
| 5. Review | Check every question is answered | 1 min |

<details>
<summary>Why a framework instead of just writing a prompt?</summary>

A brief is the natural-language instruction your AI agent reads before acting. Unlike a chat message, it runs unattended — the agent can't ask clarifying questions, so ambiguity becomes bugs. A five-minute structured exercise prevents hours of debugging later.

The framework also gives you **acceptance criteria**: once the workflow runs, you can compare the actual output against what you specified and know exactly which part of the brief to tighten if something looks wrong.

</details>

---

## Step 1: State the Goal in One Sentence

Open a scratch file and answer:

> _"Every day, I want the agent to…"_

For the daily status report:

> "Every day, I want the agent to read the current state of my repository and post a short health summary as a GitHub issue comment."

Write your own version. You can focus on a different repository section (e.g. pull requests only, or CI status only). **Keep it to one sentence.**

Try it now — complete this sentence in your scratch file before expanding the details below:

```
Every day, I want the agent to _____________________________.
```

<details>
<summary>Why one sentence?</summary>

One sentence forces a clear scope. If you need two sentences, you probably have two workflows — split them. A focused workflow is easier to test, cheaper to run, and simpler to debug.

When you ask Copilot to generate or update a workflow using the `agentic-workflows` skill, it reads this goal sentence first. The clearer it is, the less back-and-forth you need.

</details>

---

## Step 2: List the Inputs

What information does the agent need to produce the report? Think through each piece of data:

- **Open pull requests** — count and titles
- **Open issues** — count, and how many are labelled `bug`
- **CI status** — did the last workflow run pass or fail?
- **Last commit** — message and when it was made

Write these down as bullet points. If you're not sure whether a piece of data is available, add a `?` next to it — you can verify it later.

Draft your own inputs list before reading on (add a `?` if you are not sure):

- **___________** — ___________
- **___________** — ___________
- **___________** — ___________

<details>
<summary>How does the agent actually get this data?</summary>

GitHub's REST API exposes all of the above. The `gh aw` agent calls `gh api` commands automatically when you list the right permission scopes in your workflow's frontmatter. You'll add those scopes in [Step 11](11a-build-daily-status.md).

If you want to fetch external data (a dashboard, a metrics API), you can add an MCP tool server — see [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).

</details>

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

Copy the skeleton above into your scratch file and customise the section labels to match what you want to track before reading on.

<details>
<summary>Why a literal skeleton instead of a description?</summary>

When you tell the agent "post a summary", it decides the format. When you show it a skeleton, it fills in the blanks — and every run looks the same. Consistent output is easier to scan, easier to grep, and easier to notice when something changes.

It also makes it obvious when the agent has gone off-script. If a field is missing or in the wrong place, you know exactly which line of the brief to fix.

</details>

---

## Step 4: Write the Guardrails

Guardrails are rules that keep the agent from doing something unexpected. For this workflow, three rules matter:

1. **Post only one comment per day.** If a report already exists for today, skip the run.
2. **Never invent numbers.** If data is unavailable, write "unknown" — don't guess.
3. **If no issue exists to comment on, create one** titled `Daily Status Reports` and post there.

Write your guardrails as a short bulleted list in plain English. You'll paste this into the workflow body in the next step.

> [!WARNING]
> Skipping guardrails is the most common cause of runaway agents. One missing rule can result in the agent posting dozens of duplicate comments.

Before reading on, check that your guardrail list covers both:

- [ ] I have stated at least one thing the agent must NOT do.
- [ ] I have stated the maximum number of writes per run.

<details>
<summary>Default guardrails for any agentic workflow</summary>

Most agentic workflows need at least three types of guardrail:

| Type | What it does | Example |
|------|-------------|---------|
| **Deduplication** | Prevents the agent repeating the action | "If today's report already exists, stop." |
| **Data integrity** | Prevents the agent inventing missing data | "Write 'unknown' if data is unavailable." |
| **Error handling** | Defines behaviour when a prerequisite is missing | "Create the issue if it doesn't exist." |

Start from this list for every new workflow and add workflow-specific rules on top.

</details>

---

## Step 5: Review Your Brief

Work through each row below. Tick the "Before you build" column as you complete each item — then return and fill in the "After the first run" column once the workflow has run.

| Question | Before you build | After the first run |
|----------|-----------------|---------------------|
| What is the agent's one-sentence goal? | [ ] written | [ ] output matches? |
| What data does it need? | [ ] listed | [ ] all data present? |
| What does the output look like? | [ ] sketched | [ ] format matches? |
| What rules should it follow? | [ ] written | [ ] no unexpected actions? |

If any cell in the "before" column is blank, fill it in before moving on. If any "after" cell fails, the brief — not the agent — is the thing to fix.

---

## Your Completed Brief

Here is a starter brief that combines all five steps. Copy it into a scratch file and personalise it:

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
> Once you have a brief you're happy with, you can hand it to Copilot (using the `agentic-workflows` skill) and ask it to turn it into a complete workflow file. The skill knows the frontmatter syntax, permission scopes, and safe-output patterns — you focus on the goal, it handles the YAML.

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily status report
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules
- [ ] I've reviewed the brief against all four acceptance criteria

---

Return to [Step 10: Design Your Daily Repo Status Report](10a-design-daily-status.md) or continue to [Step 11: Build Your Daily Repo Status Workflow](11a-build-daily-status.md).
