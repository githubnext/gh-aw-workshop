# Share Your Workflow with Your Team

> _A workflow that only runs on your fork helps only you — move it to a shared repository and let your whole team benefit._

## 🎯 What You'll Do

Copy your daily-status workflow into a shared team repository and configure it so teammates can trigger it manually, read its output, and customise the prompt without touching any code. By the end, the workflow is a team asset, not just a personal experiment.

## 📋 Before You Start

- You have a working, scheduled daily-status workflow from [Schedule It to Run Every Day](13-schedule-it.md).
- You have write access to a shared repository, or you can create one.

## Steps

### 1. Create (or choose) a shared repository

If you already have a team repository, skip to step 2.

Otherwise, create a new one on GitHub:

1. Go to [github.com/new](https://github.com/new).
2. Give it a name such as **team-workflows**.
3. Set visibility to **Private** (you can make it public later).
4. Click **Create repository**.

> [!TIP]
> If your team uses a GitHub Organisation, create the repository there so everyone can access it without needing individual invitations.

### 2. Copy your workflow file

You need to add two things to the shared repository: the workflow file itself and a GitHub Actions configuration file that enables it.

**Copy the workflow file using the GitHub UI:**

1. Open your practice repository and navigate to `.github/workflows/daily-status.md`.
2. Click the **Copy raw file** button (or select all and copy).
3. In the shared repository, click **Add file → Create new file**.
4. Set the path to `.github/workflows/daily-status.md`.
5. Paste the workflow content.
6. Click **Commit new file**.

Repeat for the compiled lock file `.github/workflows/daily-status.lock.yml` — your team repo needs both.

> [!NOTE]
> If your shared repo doesn't have a `.github/workflows/` folder yet, GitHub creates it automatically when you set the file path.

### 3. Verify the workflow appears in Actions

1. Click the **Actions** tab in the shared repository.
2. You should see **Daily Status Report** listed in the left sidebar.
3. If you don't see it, check that both files were committed to the default branch.

![Actions tab showing the workflow listed](images/18-actions-tab-workflow.png)

### 4. Add a manual trigger

Your workflow probably already has `on: workflow_dispatch` from step 13. If it does, teammates can run it immediately from the Actions tab without waiting for the schedule.

To verify:

1. Click **Daily Status Report** in the Actions sidebar.
2. Click **Run workflow** → **Run workflow** again to confirm the button is present.

If the button is missing, edit the workflow frontmatter to add the manual trigger:

```yaml
---
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
---
```

<details>
<summary>🖥️ Edit via GitHub UI</summary>

1. Navigate to `.github/workflows/daily-status.md` in the shared repository.
2. Click the **pencil icon (✏️)**.
3. Add `workflow_dispatch: {}` under the `on:` block.
4. Click **Commit changes**.

</details>

### 5. Invite your teammates

1. Go to **Settings → Collaborators and teams** (for a personal repo) or **Settings → Members** (for an org repo).
2. Add your teammates with at least **Write** access so they can trigger workflows manually.

> [!IMPORTANT]
> Teammates need **Write** access or higher to use the **Run workflow** button. Read access is enough to view run logs.

### 6. Personalise the prompt for your team

Open `daily-status.md` and update the task brief so it reflects your team's context. For example:

```markdown
---
# frontmatter above ...
---

Summarise today's activity in the **acme-api** repository for the backend team.
Focus on:
- Pull requests opened or merged today
- Any CI failures on the main branch
- Issues labelled `priority:high` that were updated

Write in plain English. Keep the summary under 200 words.
Use bullet points for each category.
```

The more specific your prompt, the more useful the output. Replace generic phrases like "summarise activity" with the exact questions your team wants answered each morning.

### 7. Run it and share the first result

1. Go to **Actions → Daily Status Report → Run workflow**.
2. Watch the run complete.
3. Copy the summary from the run log and paste it into your team chat.

> [!TIP]
> Once the team sees the first summary, they'll have concrete feedback on what to add or remove from the prompt. Iteration is the fastest path to a useful workflow.

## ✅ Checkpoint

- [ ] The workflow file is committed to the shared repository's `.github/workflows/` folder
- [ ] The workflow appears in the **Actions** tab of the shared repository
- [ ] The **Run workflow** button is present (manual trigger works)
- [ ] At least one teammate has been invited with Write access
- [ ] You have updated the prompt to reflect your team's context
- [ ] A manual run completes successfully and the log shows a relevant summary

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
