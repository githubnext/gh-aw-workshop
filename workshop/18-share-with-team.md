# Share Your Workflow with Your Team

> _A workflow that only you can run is a script — a workflow your team can run is a product._

## 🎯 What You'll Do

Move your daily-status workflow into a shared repository and configure it so teammates can trigger it, customise the prompt, and fork it as the starting point for their own automations.
By the end you'll have a workflow that is discoverable, self-documenting, and easy for others to adopt.

## 📋 Before You Start

- You have a scheduled daily-status workflow from [Schedule It to Run Every Day](13-schedule-it.md).
- Your repository is on GitHub and you can edit files through the UI or a terminal.

## Steps

### 1. Make the workflow triggerable by anyone on the team

Open `.github/workflows/daily-status.md` and confirm (or add) the `workflow_dispatch` trigger in the frontmatter.
This lets teammates start a run from the **Actions** tab without touching code.

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * 1-5"
  workflow_dispatch: {}
---
```

<details>
<summary>🖥️ Edit via GitHub UI</summary>

1. Navigate to `.github/workflows/daily-status.md` in your repository.
2. Click the **pencil icon (✏️)** to open the editor.
3. Add or confirm `workflow_dispatch: {}` in the `on:` block.
4. Click **Commit changes** and commit directly to `main`.

</details>

> [!NOTE]
> `workflow_dispatch: {}` adds a **Run workflow** button in the Actions tab. No additional configuration is needed.

### 2. Document the workflow in a README

Good team tooling documents itself. Add a short `## Workflows` section to your repository's `README.md` so teammates know the workflow exists and how to use it.

Here is a template you can paste and adapt:

```markdown
## Workflows

### Daily Status Report

Runs every weekday at 09:00 UTC and posts an AI-generated summary of recent repository activity.

**To trigger manually:** Go to **Actions → Daily Status Report → Run workflow**.

**To customise the summary:** Edit the task brief in `.github/workflows/daily-status.md`.
```

<details>
<summary>🖥️ Edit README via GitHub UI</summary>

1. Click **README.md** in the repository file list.
2. Click the **pencil icon (✏️)**.
3. Paste the template above at a suitable point.
4. Click **Commit changes**.

</details>

### 3. Pin the required permissions

Before sharing, review the `permissions:` block in your workflow frontmatter.
Use the minimum permissions your workflow actually needs — this is good security hygiene and makes it easier for teammates to trust the workflow.

```yaml
permissions:
  contents: read
  actions: read
```

> [!TIP]
> If your workflow only reads repository data and posts to the Actions log, `contents: read` and `actions: read` are all you need. Remove any permission you are not using.

### 4. Invite teammates to fork or reuse the pattern

The `.github/workflows/` directory is the natural home for shared automation. Point teammates to the workflow file directly and encourage them to:

- Copy the `.md` file into their own repository as a starting template.
- Change the task brief (the Markdown section below the frontmatter) to match their project's context.
- Add their own data-fetching steps (see [Connect a Live Data Source](16-connect-data-source.md)).

> [!TIP]
> Consider adding a `## Customising this workflow` section to `daily-status.md` itself. Future readers will thank you.

### 5. Verify the workflow runs for another team member

Ask a teammate to go to **Actions → Daily Status Report → Run workflow** and start a run.
Watch the run together — this is a good moment to walk through the output and answer questions.

If you are working alone, trigger the workflow yourself and share a link to the run log as documentation.

## ✅ Checkpoint

- [ ] The `workflow_dispatch` trigger is present in your workflow frontmatter
- [ ] Your repository `README.md` describes the workflow and how to trigger it manually
- [ ] The `permissions:` block uses only the minimum permissions needed
- [ ] At least one person other than you (or your second trigger) has successfully run the workflow

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
