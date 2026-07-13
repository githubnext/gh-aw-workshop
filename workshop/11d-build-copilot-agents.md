# Adventure D: Build Any Workflow with the GitHub Copilot Agents Tab

> _You don't need a terminal to add an agentic workflow. GitHub Copilot users with the Agents tab enabled can start an agent session from the GitHub UI, let the agent write and compile the workflow, and merge a pull request — all in the browser._

## 🎯 What You'll Do

You'll open the GitHub Copilot Agents tab in your repository, paste a ready-made prompt that bootstraps the agent with the agentic workflow format, and watch the agent create your workflow file and open a pull request. Then you'll review and merge that PR. No CLI installation required.

## 📋 What You Need

- A GitHub repository (see [Step 3: Open and Verify Your Practice Repository](03-create-your-repo.md) if you haven't created one yet)
- A GitHub Copilot subscription with the Copilot coding agent (Agents tab) enabled

> [!NOTE]
> The GitHub Copilot coding agent (sometimes shown as the **Agents** tab) is available to GitHub Copilot users on GitHub.com and GitHub Enterprise Cloud (GHEC). If you don't see the Agents tab in your repository, ask your organization administrator to enable it. See [Enabling GitHub Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent).

---

## Open the Copilot Agents Tab

1. Open your practice repository on GitHub.com.
2. In the repository navigation, click **Copilot** (or the **Agents** tab if your organization uses that label).
3. Click **New session** (or **Ask Copilot** / **Start agent task** — the exact label depends on your GitHub version).

A text input panel opens where you can describe the task for the agent.

> [!TIP]
> You can also start an agent session from any open issue by clicking **Assign to Copilot** in the issue sidebar. The issue body becomes the task description. Either entry point works for this adventure.

---

## Paste the Prompt

The prompt below tells the agent two things:
1. Where to learn the agentic workflow file format (the `create.md` reference guide from the `github/gh-aw` repository).
2. What workflow to create for your chosen scenario.

**Choose the prompt for the scenario you picked in [Step 10](10-choose-your-scenario.md).**

---

### Scenario A prompt — Daily Repo Status Report

Copy and paste the following prompt into the Agents session input:

```
Read the agentic workflow creation guide at:
https://github.com/github/gh-aw/blob/main/create.md

Then create a daily repository status report agentic workflow for this repository.

The workflow should:
- Trigger on a daily schedule and support manual triggering via workflow_dispatch
- Collect: count of open pull requests (flag any open longer than 7 days), count of open issues (with how many are labelled "bug"), most recent CI workflow run status, most recent commit message and timestamp
- Find the most recently updated open issue and post a concise health summary as a comment (create an issue titled "Daily Status Reports" if none exists)
- Post at most one comment per calendar day; skip if today's report already exists
- Use minimum required permissions: contents: read, copilot-requests: write, issues: read, pull-requests: read, actions: read
- Limit safe-outputs to add-comment with max: 1

Save the workflow as `.github/workflows/daily-status.md`.
Compile it with `gh aw compile .github/workflows/daily-status.md --validate`.
Commit the `.md` file and the generated `.lock.yml`, then open a pull request for review.
```

---

### Scenario B prompt — Daily Documentation Updater

Copy and paste the following prompt into the Agents session input:

```
Read the agentic workflow creation guide at:
https://github.com/github/gh-aw/blob/main/create.md

Then create a daily documentation health report agentic workflow for this repository.

The workflow should:
- Trigger on a daily schedule and support manual triggering via workflow_dispatch
- Scan documentation files (Markdown files under docs/ or in the repository root) for staleness, missing sections, and broken cross-references
- Post a structured health report as a comment on an issue titled "Daily Docs Health" (create the issue if it does not exist)
- Post at most one comment per calendar day
- Use minimum required permissions: contents: read, copilot-requests: write, issues: read
- Limit safe-outputs to add-comment with max: 1

Save the workflow as `.github/workflows/daily-docs.md`.
Compile it with `gh aw compile .github/workflows/daily-docs.md --validate`.
Commit the `.md` file and the generated `.lock.yml`, then open a pull request for review.
```

---

### Scenario C prompt — PR Code Reviewer

Copy and paste the following prompt into the Agents session input:

```
Read the agentic workflow creation guide at:
https://github.com/github/gh-aw/blob/main/create.md

Then create a pull request code reviewer agentic workflow for this repository.

The workflow should:
- Trigger on pull_request events (opened and synchronize) and support manual triggering via workflow_dispatch
- Review changed files in the pull request for duplicate code patterns, checking both the diff and the existing codebase
- Post a structured review comment listing findings (or a clean bill of health if none are found)
- Post at most five review comments per run
- Use minimum required permissions: contents: read, copilot-requests: write, pull-requests: write
- Use safe-outputs: add-pr-review-comment with max: 5

Save the workflow as `.github/workflows/pr-code-reviewer.md`.
Compile it with `gh aw compile .github/workflows/pr-code-reviewer.md --validate`.
Commit the `.md` file and the generated `.lock.yml`, then open a pull request for review.
```

---

## Monitor Your Session

After submitting the prompt, the Agents tab shows a live activity feed. You will see the agent working through several phases:

| Phase | What you see |
|---|---|
| **Reading** | The agent fetches the `create.md` reference and reads existing files in your repository |
| **Planning** | The agent decides what frontmatter keys, permissions, and task brief to use |
| **Writing** | The agent creates the workflow `.md` file in `.github/workflows/` |
| **Compiling** | The agent runs `gh aw compile --validate` and fixes any errors it finds |
| **Opening PR** | The agent commits both files and opens a pull request |

The session typically completes in two to five minutes. You do not need to stay on the page — GitHub sends a notification when the pull request is ready.

> [!TIP]
> You can follow along in the activity feed and expand individual steps to see exactly what the agent wrote, read, or ran. This is a good way to learn the agentic workflow format without writing it yourself.

---

## Review and Merge the Pull Request

When the session ends, the Agents tab shows a link to the pull request the agent created. Click it to open the PR.

### What to check in the PR diff

The PR adds two files:

| File | What to verify |
|---|---|
| `.github/workflows/<name>.md` | Frontmatter keys match the scenario; the task brief describes what you want; `safe-outputs` limits write actions |
| `.github/workflows/<name>.lock.yml` | Exists and is non-empty — this is the compiled GitHub Actions YAML that the runner executes |

Look through the workflow Markdown body. The agent should have written a clear task brief based on the prompt you provided. If anything looks wrong — wrong schedule, missing permission, overly broad task brief — leave a review comment and the agent can revise it. Start your comment with `@copilot` so the agent picks it up, for example:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> Comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message.

The agent will push an updated commit to the same branch.

### Merge the pull request

Once you are satisfied with the workflow:

1. Click **Merge pull request**.
2. Click **Confirm merge**.
3. Delete the branch (optional but recommended).

The workflow is now live on your default branch. GitHub Actions will pick it up on the next scheduled trigger or when you click **Run workflow** in the Actions tab.

---

## What Was Added

After merging, your repository contains:

| File | Purpose |
|---|---|
| `.github/workflows/<name>.md` | The Markdown task brief — the human-readable workflow definition the agent and you can edit |
| `.github/workflows/<name>.lock.yml` | The compiled GitHub Actions YAML — generated automatically, do not edit by hand |

> [!NOTE]
> You skipped the `gh aw` CLI install for this adventure. If you want to iterate on the workflow locally (for example, to recompile after edits), follow [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md) at any time. Alternatively, you can make further changes through another Copilot Agents session — describe what you want to change and let the agent handle the edits and recompilation.

---

## ✅ Checkpoint

- [ ] You opened a Copilot Agents session in your repository
- [ ] You pasted the scenario prompt (A, B, or C) and the agent created the workflow files
- [ ] The pull request was created, reviewed, and merged into your default branch
- [ ] `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml` exist in your repository

**Previous:** [Step 10: Choose Your Scenario](10-choose-your-scenario.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
