# Side Quest: Writing a Clear Agent Brief

> _Optional: use this quick exercise to shape your brief before you return to [Step 10](10a-design-daily-status.md) or move on to [Step 11](11a-build-daily-status.md)._

## 🎯 What You'll Do

Build your brief in a scratch file with five short steps. By the end, you'll have a clearer daily status brief that you can paste into your workflow and reuse later.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## At a Glance

Use the same loop for every step: **write first, check your draft, then expand the collapsible "Why this works" section to read the reasoning**.

| Step | Write first | Check before you move on |
|------|-------------|--------------------------|
| Goal | One sentence that starts with "Every day, I want the agent to..." | Describes one action with one outcome |
| Inputs | 3-5 bullets with the data you need | Every input supports a report field |
| Output | A literal report skeleton | Uses a consistent format with placeholders |
| Guardrails | Short rules for limits and fallbacks | Prevents duplicates and guessing |
| Review | A quick pass over the whole brief | Uses concrete, observable language |

---

## Step 1: State the Goal in One Sentence

Write one sentence in your scratch file.

```text
Every day, I want the agent to [summarize open pull requests and post a health report as an issue comment].
```

Quick check:

- [ ] My goal is one sentence.
- [ ] My goal describes one main action.
- [ ] My goal says where the result should appear.

<details>
<summary>Why this works</summary>

A one-sentence goal forces scope. If you need multiple outcomes, you probably need multiple workflows or a tighter brief.

</details>

---

## Step 2: List the Inputs

List the data the agent must collect before it can write the report. Mark uncertain items with a `?` so you can verify them later.

```md
- [input] — [why you need it]
- [input] — [why you need it]
- [input] — [why you need it]?
```

Quick check:

- [ ] I listed at least three inputs.
- [ ] Each input connects to a line in my report.
- [ ] I marked any uncertain data with a `?`.

<details>
<summary>Why this works</summary>

Inputs turn "summarize the repo" into a concrete data request. They also make it easier to spot missing permissions or tools when you build the workflow.

</details>

---

## Step 3: Sketch the Output

Show the agent the format you want instead of describing it loosely. Start with a simple skeleton and rename any lines you want to track.

```text
📊 Daily Repo Status — {date}
PRs: {count}
Issues: {count}
CI: {status}
Health check: {one sentence}
```

Quick check:

- [ ] My output has a title or heading.
- [ ] Every placeholder maps to one input.
- [ ] I could scan this report in a few seconds.

<details>
<summary>Why this works</summary>

A literal skeleton gives the agent fewer format decisions to make. Consistent output is easier to scan, compare, and debug after the first run.

</details>

---

## Step 4: Write the Guardrails

Add short rules that limit writes and tell the agent what to do when data is missing.

```md
- Do not [undesired action].
- Post at most [number of comments or writes].
- If [data is missing or a prerequisite is absent], then [fallback].
```

Quick check:

- [ ] I included something the agent must not do.
- [ ] I set a maximum number of writes.
- [ ] I told the agent what to do when data is missing.

<details>
<summary>Why this works</summary>

Guardrails prevent duplicate posts, made-up numbers, and unclear fallback behavior. They are the fastest way to reduce noisy runs.

</details>

---

## Step 5: Review the Brief

Read the full draft once. Replace vague words like "recent," "important," or "healthy" with something the agent can observe.

Quick check:

- [ ] My goal says exactly what happens every day.
- [ ] My inputs cover every field in the output.
- [ ] My output format matches what I want to read.
- [ ] My guardrails limit writes and guessing.
- [ ] I replaced at least one vague phrase.

<details>
<summary>Why this works</summary>

Most first-run problems come from ambiguity, not from the agent ignoring instructions. A final review usually reveals what still needs a concrete rule, field, or example.

</details>

---

## Put It Together

If you want a starter scaffold, paste this into your scratch file and fill in the blanks with your own choices.

```md
Goal:
Every day, I want the agent to [summarize open pull requests and post a health report as an issue comment].

Inputs:
- [input]
- [input]
- [input]

Output:
📊 Daily Repo Status — {date}
[line 1]
[line 2]
[line 3]

Guardrails:
- Do not [undesired action].
- Post at most [number of comments or writes].
- If [data is missing or a prerequisite is absent], then [fallback].
```

> [!TIP]
> Once your brief is clear, you can ask Copilot to turn it into a workflow with the `agentic-workflows` skill.

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my daily status report.
- [ ] I've listed at least three inputs the agent will need.
- [ ] I've sketched the report format with placeholders.
- [ ] I've written guardrails for limits and missing data.
- [ ] I've reviewed the full brief and removed vague wording.

---

Return to [Step 10: Design Your Daily Repo Status Report](10a-design-daily-status.md) or continue to [Step 11: Build Your Daily Repo Status Workflow](11a-build-daily-status.md).
