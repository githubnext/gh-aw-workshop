<!-- page-journey: all -->
<!-- page-adventure: core -->
# Design Your Agent Brief

> _A well-shaped brief is the single biggest lever you have over the quality of your workflow's output._

## 🎯 What You'll Do

You'll write a focused task brief for your daily-status workflow using a four-part structure: **context**, **task**, **output format**, and **fallback**. By the end, your workflow will have a brief that produces consistent, readable output — and you'll know exactly which knob to turn when the output isn't quite right.

## 📋 Before You Start

- You have a workflow file from [Refine Your Workflow with Agentic Editing](09-agentic-editing.md).
- You can open and edit `.github/workflows/daily-status.md` in your Codespace, local terminal, or directly in GitHub.

---

## Understand the four parts of a brief

Every effective agent brief contains the same four building blocks.

| Part | What it does | Example |
|------|-------------|---------|
| **Context** | Tells the agent who it is and what data it has | "You are a daily-status reporter. The last 24 hours of commit history is in the `recent` step output." |
| **Task** | States the single concrete job | "Summarise what changed, why it matters, and whether any issues need attention." |
| **Output format** | Describes the shape of the result | "Write three short bullet points, each under 20 words." |
| **Fallback** | Handles empty or missing data | "If there are no commits, post: `✅ Quiet day — no changes in the last 24 hours.`" |

Without a fallback, a quiet repository day can cause the agent to produce a confusing or empty report.

---

## Write your brief

Open `.github/workflows/daily-status.md`. Find the Markdown body below the closing `---` of the frontmatter. Replace or rewrite it using the four-part structure.

Here is a starting template — adapt it to match the data your workflow already fetches:

```markdown
You are a daily repository status reporter.

**Context:** You have access to the last 24 hours of commits (from the `recent` step)
and any open issues flagged as urgent (from the `issues` step).

**Task:** Summarise what changed in the repository today. Focus on the most significant
commits and any issues that may need the team's attention.

**Output format:**
- Three bullet points maximum.
- Each bullet under 20 words.
- Use plain language — avoid jargon.

**Fallback:** If there are no commits and no urgent issues, post exactly:
> ✅ Quiet day — no changes or open issues in the last 24 hours.
```

> [!TIP]
> One idea per instruction. Long, multi-clause sentences confuse the agent. Break complex rules into separate lines or bullets.

---

## Commit your updated brief

After editing, save and commit the file.

<details>
<summary>🖥️ GitHub UI alternative</summary>

1. Navigate to `.github/workflows/daily-status.md` in your repository on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Update the Markdown body below the frontmatter with your four-part brief.
4. Click **Commit changes** and add a short commit message such as `refine agent brief`.

</details>

If you're working in a terminal or Codespace:

```bash
git add .github/workflows/daily-status.md
git commit -m "refine agent brief — four-part structure"
git push
```

> [!NOTE]
> You do not need to run `gh aw compile` after editing only the Markdown body of the brief. Compile is required when you change the YAML frontmatter. If you're unsure, compile anyway — it is always safe to run.

---

## Test your brief in one sentence

Read your brief aloud. Then answer: **If the agent follows this brief exactly, what will it post?**

If you can't answer that in one sentence, the brief is under-specified. Add one more concrete instruction before you move on.

> [!TIP]
> For a step-by-step writing workshop with predict-and-try exercises, see [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md). Return here when done.

---

## ✅ Checkpoint

- [ ] Your workflow brief has an explicit **context** section that names the step outputs the agent will use
- [ ] Your brief has a single, clear **task** statement
- [ ] Your brief specifies the **output format** (length, structure, or both)
- [ ] Your brief includes a **fallback** instruction for empty or missing data
- [ ] You committed the updated `.github/workflows/daily-status.md`
- [ ] You can predict what the workflow will post for a typical day and for a quiet day

<!-- journey: all -->
**Next:** [Test and Improve Your Workflow](12-test-and-iterate.md)
<!-- /journey -->
