# Side Quest: Evaluating and Iterating on Agent Output

> _Optional: work through this guide when you want a structured way to evaluate your workflow's output and make focused improvements — then return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)._

## 🎯 What You'll Do

Learn a repeatable pattern for judging whether your agent's output is "good enough," diagnosing what is wrong when it isn't, and making targeted one-change-at-a-time improvements. By the end you'll have a clear rubric you can apply to any agentic workflow — not just the daily status report.

## 📋 Before You Start

- You have run your daily status workflow at least once in [Step 12](12-test-and-iterate.md).
- The workflow has posted a comment on your **Daily Status Reports** issue.

---

## What "Good Enough" Looks Like

Not all output problems are equal. Before you start tweaking, read the output once and decide: is this a _format_ problem, a _data_ problem, or a _tone_ problem? Mixing all three into one prompt change usually makes things harder to diagnose.

### Needs improvement

```markdown
### Daily Repo Status

- 7 open issues
- 2 open PRs
- 1 PR needs review
```

Why this still needs work:

- It is technically correct, but it sounds robotic.
- It does not include the age of the oldest open PR, so you cannot spot stale work at a glance.
- It gives you counts, but no help interpreting what those counts mean for today's work.
- The heading matches nothing in your prompt skeleton — the agent chose its own format.

### Good output after one iteration

```markdown
### Daily Repo Status

Good morning! You have 7 open issues and 2 open PRs.

- Oldest open PR: #42, open for 6 days
- 1 PR is waiting for review
- No stale issues need attention today

Your queue looks manageable today — one review pass would keep things moving.
```

What improved:

- The greeting signals a conversational tone was added to the brief.
- The oldest PR's age is now present because the brief asked for it explicitly.
- The final sentence helps you decide what to do — not just what is there.
- The format matches the skeleton defined in the prompt.

---

## Pass/Fail Check

Use this rubric on your own output before deciding whether to iterate:

| Check | Pass | Fail |
|-------|------|------|
| Facts | Numbers match what you can verify in your repo | Numbers are wrong, missing, or suspiciously round |
| Format | Output matches the skeleton you defined in the prompt | Agent chose its own section headings or layout |
| Tone | Language sounds the way you wanted | Too formal, too casual, or robotic bullet-point lists |
| Completeness | All requested fields are present | One or more fields from your brief are absent |
| Deduplication | Only one comment was posted today | Multiple identical or near-identical comments exist |

If any row fails, make exactly **one** change to address it, then re-run.

---

## Problem-to-Fix Reference

| Problem noticed | Why it happens | Suggested fix |
|-----------------|----------------|---------------|
| Report is too verbose | The brief does not cap length | Add _"Keep the report under 100 words."_ to the Guidelines section |
| Missing PR age info | The brief never asks for it | Add _"Include the age of the oldest open PR."_ to the Your Task list |
| Tone feels robotic | No tone instruction in the brief | Add _"Write in a friendly, conversational tone."_ to the Guidelines section |
| Format does not match your sketch | No skeleton in the brief | Add an explicit output template with section headings and placeholders |
| Duplicate comments appearing | No deduplication guardrail | Add _"If you have already posted today, skip."_ to the Guidelines section |

---

## Making One Focused Change

Once you know what to fix, use the `agentic-workflows` skill to make the change. Open the GitHub Copilot **Agents** tab (or the GitHub Copilot app) in your practice repository and describe the single improvement you want:

```
Using the agentic-workflows skill, update .github/workflows/daily-status.md
to add a friendly, conversational tone instruction to the Guidelines section.
Run gh aw compile to validate after the change.
```

The skill can also **optimize or debug your prompt automatically** by reading previous workflow run logs. Instead of diagnosing the problem yourself, ask the skill to do it:

```
Using the agentic-workflows skill, debug .github/workflows/daily-status.md.
Look at the recent run history to identify why the output format is inconsistent,
then optimize the agent instructions to fix it.
```

The skill will examine the historical run data — including past outputs and any errors — to pinpoint what is driving the problem and propose a targeted fix.

Tailor the prompt to the problem row you identified:

| Problem row that failed | Example prompt for the skill |
|-------------------------|------------------------------|
| Tone feels robotic | "Add a tone instruction: _Write in a friendly, conversational tone._" |
| Missing PR age info | "Add to the Your Task list: _Include the age of the oldest open PR._" |
| Report is too verbose | "Add a length cap: _Keep the report under 100 words._" |
| Format does not match sketch | "Add an explicit output skeleton with the section headings I care about." |
| Duplicate comments appearing | "Add the deduplication guardrail: _If you have already posted today, skip._" |

Review the diff the skill proposes before merging. One clear instruction per session keeps the change easy to evaluate.

> [!TIP]
> Prefer using an agent with the `/agentic-workflows` skill over hand-editing workflow files. **Agents edit agents.** For terminal users, run `gh aw compile .github/workflows/daily-status.md --watch` for continuous feedback while the agent edits.

<!-- Separate adjacent callouts -->

> [!NOTE]
> The agent instructions are **not** stored in the YAML frontmatter — they live in the Markdown body below the closing `---` fence. The frontmatter contains machine-readable configuration (triggers, permissions, tools, and safe-outputs).

---

## The Iteration Loop

Repeat the following until you are satisfied:

1. Trigger a manual run from the **Actions** tab.
2. Read the new comment against the pass/fail check.
3. If all rows pass — you are done. Move on to [Step 13: Schedule It to Run Every Day](13-schedule-it.md).
4. If a row still fails — find the matching row in the problem-to-fix table, ask the `agentic-workflows` skill to make that one change, review its diff, merge, and go back to step 1.

> [!TIP]
> Keep your iterations small. A single-line change is much easier to attribute to a specific improvement (or regression) than a paragraph rewrite.

---

## ✅ Checkpoint

- [ ] You have read your output against all five pass/fail checks
- [ ] You have identified at least one row that fails (or confirmed all pass)
- [ ] You have asked the `agentic-workflows` skill to make the targeted fix
- [ ] After re-running, the previously failing check now passes
- [ ] You understand the difference between a format, data, and tone problem

---

Return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md).
