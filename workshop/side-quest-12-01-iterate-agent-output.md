<!-- journey: all -->
<!-- adventure: side-quest -->
# Side Quest: Evaluating and Iterating on Agent Output

> _Optional: use this side quest when you want a repeatable way to judge one workflow run, improve one sentence in the workflow brief, and compare the result — then return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)._

## 🎯 What You'll Do

Run your workflow once, score the output with a short rubric, change one sentence in the brief, recompile, and run it again. By the end, you will have a before/after comparison instead of a vague feeling that the prompt is "better."

## 📋 Before You Start

- You have completed [Step 12](12-test-and-iterate.md) and already have a workflow run to inspect.
- Your workflow posts to a [safe output surface](https://github.github.com/gh-aw/reference/safe-outputs/) such as the **Daily Status Reports** issue.

## Baseline run

Use the **Actions** tab to trigger your workflow one more time so you have a fresh example to score.

If you prefer to collect the latest run files from a terminal, these example `gh` commands pull the newest run ID and download any artifacts it uploaded:

```bash
RUN_ID=$(gh run list --workflow "Daily Repo Status" --limit 1 --json databaseId --jq '.[0].databaseId')
gh run download "$RUN_ID" --dir /tmp/daily-status-run
```

If your workflow does not upload an artifact, skip the download and score the latest issue comment directly.

## Score the output with a 3-row rubric

Open the latest issue comment or downloaded output and score each row from 0 to 2.

| Dimension | 2 points | 1 point | 0 points |
|-----------|----------|---------|----------|
| Accuracy | Every fact matches what you can verify in the repo | One fact is unclear or needs manual checking | A fact is wrong, missing, or obviously guessed |
| Completeness | Every field you asked for is present | One requested field is thin or partially missing | Multiple requested fields are missing |
| Tone | The wording sounds like the voice you asked for | The wording is usable but generic | The wording feels robotic or off-brand |

Record the baseline before you edit anything. For example:

```text
Before: Accuracy 2, Completeness 1, Tone 0
Lowest score: Tone
```

## Make one targeted change

Pick the lowest-scoring row and modify or add only **one sentence** in your workflow brief to address it.

| Lowest score | One sentence to modify or add |
|--------------|-------------------------------|
| Accuracy | Tell the agent not to invent numbers and to skip anything it cannot verify. |
| Completeness | Name the missing field, such as "Include the age of the oldest open PR." |
| Tone | Describe the voice you want, such as "Write in a friendly, conversational tone." |

If you use the GitHub Copilot **Agents** tab or the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app), ask for one focused update:

```text
Using the agentic-workflows skill, update .github/workflows/daily-status.md
by changing one sentence in the Markdown body to improve Tone.
Run gh aw compile after the edit.
```

If you are working in a browser-based environment without terminal access, use that agent path instead of the terminal path below.

If you have a terminal open, edit the Markdown body of `.github/workflows/daily-status.md`, then recompile:

```bash
gh aw compile
```

## Before and after comparison

Trigger the workflow again from **Actions** and score the new output with the same rubric.

Write your result in a short before/after comparison:

```text
Before: Accuracy 2, Completeness 1, Tone 0
After: Accuracy 2, Completeness 2, Tone 2
Changed sentence: "Write in a friendly, conversational tone."
```

If the lowest row did not improve, keep the first change in place, pick one different instruction to modify or add, and run the same loop again.

## Read the run log for errors

<details>
<summary>Need ideas for what to change or where to look for errors?</summary>

Quick problem-to-fix guide:

| Problem you see | One sentence to add or tighten |
|-----------------|--------------------------------|
| Facts look guessed | "Use only numbers you can verify from GitHub data or repository files." |
| A requested field is missing | "Include the age of the oldest open PR if one exists." |
| Tone feels stiff | "Write in a friendly, conversational tone." |
| The format drifts | "Follow this exact heading and bullet structure." |
| Duplicate comments appear | "If you have already posted today, skip." |

Quick run-log check:

- **Compile error** — run `gh aw compile` locally, or ask your Copilot agent to run it and fix the reported line.
- **Missing permissions** — re-check the workflow frontmatter and confirm the safe output surface is declared correctly.
- **Rate limits or transient failures** — wait a few minutes and re-run.

</details>

## ✅ Checkpoint

- [ ] You triggered a fresh workflow run and captured one real output to review
- [ ] You recorded a baseline score for accuracy, completeness, and tone
- [ ] You changed exactly one sentence in the workflow brief to target the lowest score
- [ ] You recompiled with `gh aw compile` or had a Copilot agent do it for you
- [ ] You triggered a second run and recorded a before/after comparison such as `Before: Accuracy 2, Completeness 1, Tone 0 → After: Accuracy 2, Completeness 2, Tone 2`

<!-- journey: all -->
Return to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md).
<!-- /journey -->

For more details, see [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/) and [About Workflows](https://github.github.com/gh-aw/introduction/overview/).

