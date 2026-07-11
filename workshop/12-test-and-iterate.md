# Test and Improve Your Workflow

> _Running a workflow once is good; understanding why it did what it did — and making it better — is where the real learning happens._

## 🎯 What You'll Do

You'll trigger your daily-status workflow manually, read the resulting issue comment, and make at least one targeted improvement to the prompt or YAML. By the end of this step your workflow will feel like yours, not a template you copied.

## 📋 Before You Start

- You have completed [Step 11: Build: Daily Repo Status Workflow](11-build-daily-status.md).
- Your workflow file `.github/workflows/daily-status.md` is committed and pushed to `main`.

## Steps

### 1. Trigger the workflow manually

Open a browser, navigate to your repository, and click the **Actions** tab.

Find your **Daily Repo Status** workflow in the left sidebar and click it. Then click **Run workflow** → **Run workflow** (green button) to launch a manual run.

> [!TIP]
> You can also trigger it from the terminal:
> ```bash
> gh workflow run daily-status.md
> ```

### 2. Watch the run live

Click the run that just appeared. You will see a job named something like **run** or **agent**. Click it to watch the live log stream.

Look for two things:
- The step where the agent reads your repository data
- The step where the agent posts (or skips) the comment

![Workflow run log](images/12-workflow-run-log.png)

### 3. Check the output

Once the run finishes (green ✅), open an issue in your repository titled **Daily Status Reports**. The agent should have posted a comment in the format you defined in the prompt.

Read it critically. Ask yourself:
- Did the numbers look correct?
- Is the tone right — too formal, too casual?
- Is anything missing (e.g., no mention of stale PRs)?

### 4. Improve the prompt

Open `.github/workflows/daily-status.md` in your editor and find the `prompt:` block in the frontmatter.

Make one concrete change. Some ideas:

| Problem noticed | Suggested fix |
|-----------------|---------------|
| Report is too verbose | Add _"Keep the report under 100 words."_ to the prompt |
| Missing PR age info | Add _"Include the age of the oldest open PR."_ |
| Tone feels robotic | Add _"Write in a friendly, conversational tone."_ |

```yaml
prompt: |
  Post a daily health check comment on the "Daily Status Reports" issue.
  Keep the report under 100 words.
  Include the age of the oldest open PR if any exist.
  Write in a friendly, conversational tone.
  ...
```

### 5. Commit, push, and re-run

```bash
git add .github/workflows/daily-status.md
git commit -m "refine: tighten daily status prompt"
git push
```

Trigger another manual run and compare the new comment with the old one. Repeat until you are happy.

> [!NOTE]
> Every iteration teaches you something about prompt engineering. Small, focused changes are easier to evaluate than large rewrites.

### 6. Read the run log for errors

If a run shows a red ❌, click the failed step to see the raw log. Common causes:

- **Missing permissions** — make sure your workflow YAML includes `issues: write` under `permissions`.
- **Compile error** — run `gh aw compile .github/workflows/daily-status.md --validate` locally.
- **API rate limit** — wait a few minutes and try again.

> [!WARNING]
> If the agent posts duplicate comments, check that your prompt contains the line _"If you have already posted today, skip."_

## ✅ Checkpoint

- [ ] You have triggered at least two manual runs
- [ ] The workflow posts a correctly formatted status comment on your issue
- [ ] You have made at least one improvement to the prompt
- [ ] You understand how to read the Actions log to diagnose failures

**Next:** [Step 13: Schedule It to Run Every Day](13-schedule-it.md)
