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

Open `.github/workflows/daily-status.md` in your editor. The agent instructions live in the **Markdown body** — the plain-English text below the closing `---` fence.

Pick the single highest-priority failure from the pass/fail check above. Make exactly one corresponding change. For example, if tone was the problem, you might update your Guidelines section like this:

```markdown
## Guidelines

- Post only one comment. If you have already posted today, skip.
- Keep the report factual. Do not invent numbers.
- Keep the report under 100 words.
- Include the age of the oldest open PR if any exist.
- Write in a friendly, conversational tone.
- If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
```

> [!NOTE]
> The agent instructions are **not** stored in the YAML frontmatter — they live in the Markdown body below the closing `---` fence. The frontmatter contains machine-readable configuration (triggers, permissions, tools, and safe-outputs).

<!-- Separate adjacent callouts -->

> [!TIP]
> **Using the GitHub Copilot app or Agents tab?** Ask the agent to make one focused improvement, run `gh aw compile .github/workflows/daily-status.md --validate` in its session workspace, and update the pull request. Review the diff before merging.

---

## The Iteration Loop

Repeat the following until you are satisfied:

1. Trigger a manual run.
2. Read the new comment against the pass/fail check.
3. If all rows pass — you are done. Move on to [Step 13: Schedule It to Run Every Day](13-schedule-it.md).
4. If a row still fails — find the matching row in the problem-to-fix table, make one change, commit, and go back to step 1.

> [!TIP]
> Keep your iterations small. A single-line change is much easier to attribute to a specific improvement (or regression) than a paragraph rewrite.

---

## ✅ Checkpoint

- [ ] You have read your output against all five pass/fail checks
- [ ] You have identified at least one row that fails (or confirmed all pass)
- [ ] You have made at most one prompt change per iteration
- [ ] After re-running, the previously failing check now passes
- [ ] You understand the difference between a format, data, and tone problem

---

Return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md).
