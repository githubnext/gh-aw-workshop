# Side Quest: Prompt Iteration Patterns

> _Knowing _that_ your output is wrong is easy — knowing _where_ to look and _what_ to change is a skill. This side quest gives you a repeatable diagnostic loop._

## 🎯 What You'll Do

You'll learn four concrete patterns for diagnosing weak or inconsistent agent output and apply targeted fixes to your task brief. By the end you'll have a mental model for systematic prompt iteration instead of trial-and-error guessing.

## 📋 Before You Start

- You have completed [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) and triggered at least two manual runs.
- You have access to the Actions run log for those runs.

## Steps

### Understand the three-zone model

Every agentic workflow has three places where quality problems originate:

| Zone | What lives there | Signs of a problem |
|------|------------------|--------------------|
| __Frontmatter__ | triggers, permissions, tools, steps | Run errors, missing data, wrong tool calls |
| __Task brief header__ | What You Have, Your Task, Guidelines | Agent does the wrong thing or ignores instructions |
| __Guidelines / tone__ | Format rules, guardrails | Output is correct but poorly formatted or inconsistent |

Before changing anything, decide which zone the problem belongs to. This prevents you from tweaking the wrong part.

### Pattern 1 — Narrow the scope

__Symptom__: The agent produces verbose output that covers topics you didn't ask for, or skips the one thing you care about.

__Fix__: Add an explicit scope sentence to the __Your Task__ section of the brief.

```markdown
## Your Task

- Report __only__ on changes from the past 24 hours. Ignore older data.
- Mention open issues __only__ if there are three or more.
```

Explicit `only` and `if` clauses reduce hallucinated or off-topic content significantly.

### Pattern 2 — Anchor with examples

__Symptom__: The agent understands the task but the format varies between runs — sometimes a table, sometimes bullet points, sometimes prose.

__Fix__: Add a __one-sentence example__ or a short template to the brief.

```markdown
## Output Format

Use exactly this structure:

__Summary__: <one sentence>
__Commits today__: <number>
__Open issues__: <number>
__Action needed__: <yes/no — one sentence reason>
```

Agents follow structure examples more reliably than abstract descriptions. Provide the shape you want.

### Pattern 3 — Add a negative constraint

__Symptom__: The agent invents data, makes assumptions, or adds unsolicited opinions.

__Fix__: Add a __"Do not"__ section to the Guidelines block.

```markdown
## Guidelines

- Post only one comment per run. If a comment already exists for today, skip.
- Do not invent numbers. If data is unavailable, write "data unavailable".
- Do not give advice or opinions. Report facts only.
```

Negative constraints are especially effective at stopping confabulation (the agent filling gaps with plausible-sounding fiction).

### Pattern 4 — Isolate and compare

__Symptom__: You changed multiple things between runs and aren't sure which change fixed (or broke) the output.

__Fix__: Change __one thing at a time__ and keep a comment log in the brief.

```markdown
<!-- v1: initial draft — too verbose, missing PR count -->
<!-- v2: added "Keep report under 80 words." — better length, PR count still missing -->
<!-- v3: added fetch-prs step to frontmatter — now reports PR count correctly -->
```

HTML comments in Markdown are ignored by the agent but let you track your own iterations. This is your debugging history.

> [!TIP]
> After each run, copy the output to a note or scratch file before re-running. You can't retrieve old issue comments once the next run overwrites them.

### Read the log for intent signals

Open a completed run in __Actions__ and look for the agent's __reasoning steps__ — the lines before a tool call that start with something like `I need to…` or `Looking at…`.

These lines tell you what the agent _thinks_ you asked it to do. If the intent described there doesn't match what you wanted, the task brief isn't clear enough. Use that mismatch as your edit target.

![Agent reasoning in the run log](images/12-sq-reasoning-log.png)

## ✅ Checkpoint

- [ ] You can name the three zones where prompt problems originate
- [ ] You have applied at least one of the four patterns to your own workflow
- [ ] Your latest run produces output that matches the format you described in the brief
- [ ] You have added at least one negative constraint or scoping sentence to your task brief

---

Return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md).
