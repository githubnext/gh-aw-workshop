# Test and Improve Your Workflow

> _Running a workflow once is good; understanding why it did what it did — and making it better — is where the real learning happens._

## 🎯 What You'll Do

You'll trigger your daily-status workflow manually, read the resulting issue comment, and make at least one targeted improvement to the prompt or YAML. By the end of this step your workflow will feel like yours, not a template you copied.

## 📋 Before You Start

- You have installed the `gh-aw` extension in [Step 6](06-install-gh-aw.md), or your GitHub Copilot agent compiled the workflow for you.
- You have completed one of the scenario build steps: [Step 11a](11a-build-daily-status.md), [Step 11b](11b-build-daily-docs.md), [Step 11c](11c-build-pr-reviewer.md), or [Step 11d](11d-build-copilot-agents.md).
- Your workflow file is committed and pushed to `main`.

## Steps

### Trigger the workflow manually

Choose the path that matches how you want to trigger the run.

#### Terminal path — trigger with `gh aw`

If you already have CLI trigger permissions configured, you can trigger the same run from the terminal:

```bash
gh aw run daily-status
```

#### GitHub UI path — trigger from Actions (recommended)

Open your repository's **Actions** tab, select **Daily Repo Status**, then click **Run workflow** → **Run workflow**.

### Watch the run live

Click the run that just appeared. You will see a job named something like **run** or **agent**. Click it to watch the live log stream.

Look for two things:
- The step where the agent reads your repository data
- The step where the agent posts (or skips) the comment

![Workflow run log](images/12-workflow-run-log.svg)

### Check the output

Once the run finishes (green ✅), open an issue in your repository titled **Daily Status Reports**. The agent should have posted a comment in the format you defined in the prompt.

Use this rubric to evaluate what you see:

| Check | Pass | Fail |
|-------|------|------|
| Accuracy | Numbers match what you can verify in your repo | Numbers are wrong, missing, or suspiciously round |
| Format | Output matches the skeleton you defined in the prompt | Agent chose its own section headings or layout |
| Tone | Language sounds the way you wanted | Too formal, too casual, or robotic bullet-point lists |
| Completeness | All requested fields are present | One or more fields from your brief are absent |

**Your turn:** Paste the first three lines of the comment into a code block on your **Daily Status Reports** issue, and note which rubric row fails first (or confirm all rows pass).

Review each rubric row in order. If a row fails, that is your target for the next run.

If you are not satisfied, make one targeted prompt change and run the workflow again. Small, focused changes are easier to evaluate than large rewrites.

> [!TIP]
> <details>
> <summary>**Optional Side Quest:** For a five-row problem-to-fix reference table, a repeatable iteration loop, and help reading the run log for errors, see [Side Quest: Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md).</summary>
> </details>

### Improve the agent instructions

Open `.github/workflows/daily-status.md` in your editor. The agent instructions live in the **Markdown body** — the plain-English text below the closing `---` fence. This is the section that starts with `# Daily Repo Status Report`.

Make one concrete change to the body. Common fixes include adding a word-count limit, including the age of the oldest open PR, or adding a tone instruction. For a full five-row problem-to-fix reference, see the [Optional Side Quest: Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md).

For example, your updated Guidelines section might look like:

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
> <details>
> <summary>The agent instructions are **not** stored in the YAML frontmatter — they live in the Markdown body below the closing `---` fence. The frontmatter only contains machine-readable configuration (triggers, permissions, tools, and [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/)).</summary>
>
> **Using the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or Agents tab?** Ask the agent to make one focused improvement, run `gh aw compile --validate` in its session workspace, and update the pull request.
>
> </details>

### Commit your change

#### Terminal path

```bash
git add .github/workflows/daily-status.md
git commit -m "refine: tighten daily status prompt"
git push
```

#### GitHub UI path

Navigate to `.github/workflows/daily-status.md` in your repository, click the **pencil icon (✏️)**, make your changes, then click **Commit changes**.

Trigger another manual run and compare the new comment against the rubric. Repeat until all four rows pass.

For troubleshooting run failures, see [Side Quest: Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md#read-the-run-log-for-errors).

## ✅ Checkpoint

- [ ] You have triggered at least two manual runs
- [ ] The workflow posts a correctly formatted status comment on your issue
- [ ] You have pasted the first three lines of the comment into a code block on your issue
- [ ] You have made at least one improvement to the prompt targeting a specific rubric row
- [ ] Your improved workflow has run at least once and produced output that matches your formatting expectations

**Next:** [Step 13: Schedule It to Run Every Day](13-schedule-it.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
