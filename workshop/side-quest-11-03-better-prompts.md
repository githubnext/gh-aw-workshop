---
journey: all
adventure: side-quest
---
# Side Quest: Write Better AI Task Briefs

> _Optional: work through this guide if you want to get more useful, consistent output from your agentic workflows — then return to [Step 11](11a-build-daily-status.md) or [Step 12](12-test-and-iterate.md)._

## 🎯 What You'll Do

Learn five practical techniques for writing AI task briefs that produce clearer, more actionable workflow output. By the end you'll have an improved task brief for your daily status workflow — one that gives the AI better context, tighter constraints, and a predictable output format.

## 📋 Before You Start

- You've written your first workflow task brief in [Step 11](11a-build-daily-status.md).
- You've run the workflow at least once in [Step 12](12-test-and-iterate.md) and seen its output.

---

## What Is a Task Brief?

The **task brief** is the Markdown body of your workflow file — everything below the closing `---` of the [YAML frontmatter](https://github.github.com/gh-aw/reference/frontmatter/). It's the natural-language instruction the AI agent reads before it acts.

Unlike a chat message, the task brief runs unattended. The AI can't ask clarifying questions, so everything it needs must be in the brief itself.

---

## Technique 1: State the Goal, Not Just the Action

❌ Vague:

```
Summarise the repository activity.
```

✅ Goal-oriented:

```
Produce a concise daily summary that helps a developer answer: "What changed
yesterday, and is there anything I need to act on today?"
```

Framing the _purpose_ helps the AI decide what to include and what to skip.

---

## Technique 2: Give the Output a Shape

Tell the AI exactly what format you want. Include section headings, list styles, or even a skeleton example.

```
Format your summary as follows:

## Daily Status — {date}

### 🔀 Recent Commits
- One bullet per commit with author and short message.

### 🐛 Open Issues
- List open issues by title. If there are none, say "No open issues."

### 📌 Action Items
- Highlight anything that looks urgent or blocked.
```

When the format is explicit, the output is predictable and easier to skim.

---

## Technique 3: Set Scope and Constraints

If you don't constrain the AI, it may go broad. Be specific:

- **Time window**: "Focus on activity from the last 24 hours only."
- **Depth**: "Keep each section to three bullet points maximum."
- **Tone**: "Write in plain English, not jargon. Assume the reader is a developer, not a manager."
- **What to omit**: "Skip merge commits and bot commits."

Short constraints pay dividends over hundreds of automated runs.

---

## Technique 4: Reference Step Outputs Explicitly

When your workflow fetches data in earlier steps (see [Step 16](16-connect-data-source.md)), point the AI at that data by name:

```
Use `${{ steps.recent.outputs.commit_log }}` as the source of commit activity.
Use `${{ steps.issues.outputs.open_issues }}` as the source of open issues.
Do not invent data — if a variable is empty, say so.
```

The last line — "do not invent data" — is especially important. Without it, AI models sometimes hallucinate plausible-sounding commits or issues.

---

## Technique 5: Add a "Done Means" Statement

Close every task brief with a single sentence that defines success:

```
You are done when you have posted one Markdown comment to the Actions run
summary that covers all three sections above and is under 300 words.
```

This acts as a stop condition. It reduces unnecessary tool calls and keeps the run fast.

---

## Putting It Together

Here is a before-and-after comparison of a daily status task brief:

**Before:**

```
Summarise what happened in this repository today and post it.
```

**After:**

```
Produce a concise daily summary that helps a developer answer:
"What changed yesterday, and is there anything I need to act on today?"

Use `${{ steps.recent.outputs.commit_log }}` for commits and
`${{ steps.issues.outputs.open_issues }}` for open issues.
Do not invent data — if a variable is empty, say "None."

Format:

## Daily Status — {date}

### 🔀 Recent Commits
- Up to five bullets: author, short message.

### 🐛 Open Issues
- Up to five bullets: issue number and title.

### 📌 Action Items
- Flag anything urgent or blocked. If nothing stands out, write "Nothing urgent."

Keep the whole summary under 300 words. You are done when the summary is
posted to the Actions run summary.
```

> [!TIP]
> Small changes to the task brief can have large effects on output quality. Treat it like code — version it, test it, iterate.

---

## ✅ Checkpoint

- [ ] You can name three techniques for improving a task brief
- [ ] You have updated your daily status workflow with at least one improvement from this guide
- [ ] You understand why "do not invent data" matters when referencing step outputs
- [ ] Your updated workflow still compiles and runs without errors

---

<!-- journey: all -->
Return to [Step 11: Build Your Daily Repo Status Workflow](11a-build-daily-status.md) or continue to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md).
<!-- /journey -->

For more details, see [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), and [About Workflows](https://github.github.com/gh-aw/introduction/overview/).

