# Adventure D: Build Any Workflow with GitHub Copilot

> _You can use the GitHub Copilot app or the browser-based Agents tab to start an agent session, steer the work, review the changes, and land an agentic workflow._

## 📋 Before You Start

This adventure builds on:

- **Step 7** ([Your first workflow](07-your-first-workflow.md)): writing a Markdown task brief with YAML frontmatter
- **Step 9** ([Compile and validate](09-compile-and-validate.md)): using `gh aw compile` to generate and validate lock files
- **Step 10** ([Choose your scenario](10-choose-your-scenario.md)): the scenario (A, B, or C) you selected to build
- **Step 11 (any path)** ([11a](11a-build-daily-status.md), [11b](11b-build-daily-docs.md), or [11c](11c-build-pr-reviewer.md)): how frontmatter keys such as `triggers`, `permissions`, and `safe-outputs` shape what the workflow can do

You do not need the `gh-aw` CLI installed locally — the agent handles compilation in its own workspace.

## 🎯 What You'll Do

You'll choose the GitHub Copilot desktop app or the Agents tab, paste a ready-made prompt that bootstraps the agent with the agentic workflow format, and watch the agent create and validate your workflow. Then you'll review and merge its pull request.

## 📋 What You Need

- A GitHub repository (see [Step 3: Open and Verify Your Practice Repository](03-create-your-repo.md) if you haven't created one yet)
- A GitHub Copilot plan
- Either the [GitHub Copilot app](https://github.com/github/app) installed or the Copilot coding agent (Agents tab) enabled

The GitHub Copilot app runs on macOS, Windows, and Linux and is built on Copilot CLI. Copilot Business and Enterprise users may need an administrator to enable Copilot CLI in the organization's [GitHub Copilot feature policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies). If you use the browser path and don't see the Agents tab, ask your organization administrator to enable the Copilot coding agent.

---

## Choose Where to Start Your Session

### GitHub Copilot app

1. Open the GitHub Copilot app.
2. Next to **Sessions**, click **+**.
3. Choose your practice repository from GitHub, a local folder, or a repository URL.
4. Choose **Interactive** mode so you can review and steer the work as it progresses.

The app creates an isolated workspace for the session. You can inspect the agent's changes, give follow-up instructions, and manage the resulting pull request without switching to an editor.

### GitHub Copilot Agents tab

1. Open your practice repository on GitHub.com.
2. In the repository navigation, click **Copilot** (or the **Agents** tab if your organization uses that label).
3. Click **New session** (or **Ask Copilot** / **Start agent task** — the exact label depends on your GitHub version).

A text input panel opens where you can describe the task for the agent.

You can also start an agent session from any open issue by clicking **Assign to Copilot** in the issue sidebar — the issue body becomes the task description. Either entry point works for this adventure.

---

## Paste the Prompt

The prompt below tells the agent two things:
1. Where to learn the agentic workflow file format (the `create.md` reference guide from the `github/gh-aw` repository).
2. What workflow to create for your chosen scenario.

**Choose the prompt for the scenario you picked in [Step 10](10-choose-your-scenario.md).**

### ✏️ Exercise: probe the agent before the full prompt

Before submitting the full scenario prompt, test that your agent session is working by sending this short probe:

```
Fetch the file at https://github.com/github/gh-aw/blob/main/create.md and tell me the top-level sections in that document.
```

The agent should reply with a list that includes sections such as **Frontmatter schema**, **Triggers**, **Permissions**, and **Safe outputs**. If you see those headings in the response, the agent can reach the reference guide and you are ready to proceed.

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

After submitting the prompt, the session shows a live activity feed. You will see the agent working through several phases:

| Phase | What you see |
|---|---|
| **Reading** | The agent fetches the `create.md` reference and reads existing files in your repository |
| **Planning** | The agent decides what frontmatter keys, permissions, and task brief to use |
| **Writing** | The agent creates the workflow `.md` file in `.github/workflows/` |
| **Compiling** | The agent runs `gh aw compile --validate` and fixes any errors it finds |
| **Opening PR** | The agent commits both files and opens a pull request |

The session typically completes in two to five minutes. You can steer it with follow-up prompts if it needs more context or takes the wrong direction. Follow along in the activity feed and expand individual steps to see exactly what the agent wrote, read, or ran — this is a good way to learn the agentic workflow format without writing it yourself.

> [!IMPORTANT]
> - The agent runs `gh aw compile ... --validate` in its session workspace and can install `gh-aw` there if needed.
> - For manual validation or to run `gh aw compile ... --watch` yourself, install `gh-aw` locally or in Codespaces by following [Step 6](06-install-gh-aw.md).
> - Use the GitHub **Actions tab** in [Step 12](12-test-and-iterate.md) to trigger the workflow and inspect its runtime logs.

---

## Review and Merge the Pull Request

When the session ends, open the pull request it created. In the GitHub Copilot app, find it in **My work**. In the Agents tab, use the pull request link in the session.

### What to check in the PR diff

The PR adds two files:

| File | What to verify |
|---|---|
| `.github/workflows/<name>.md` | Frontmatter keys match the scenario; the task brief describes what you want; `safe-outputs` limits write actions |
| `.github/workflows/<name>.lock.yml` | Exists and is non-empty — this is the compiled GitHub Actions YAML that the runner executes |

Look through the workflow Markdown body. The agent should have written a clear task brief based on the prompt you provided. If anything looks wrong — wrong schedule, missing permission, overly broad task brief — ask the agent to revise it:

- **GitHub Copilot app:** start or continue a session for the pull request and describe the change.
- **Agents tab:** leave a review comment that starts with `@copilot`, for example:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> In the browser PR flow, comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message.

The agent will push an updated commit to the same branch.

### Merge the pull request

Once you are satisfied with the workflow:

1. In the browser, click **Merge pull request** and **Confirm merge**. In the GitHub Copilot app, merge from the pull request view or enable [**agent merge**](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests#merging-a-pull-request), which asks the agent to fix blockers and merge after required reviews and checks pass.
2. Confirm that the pull request is merged.
3. Delete the branch (optional but recommended).

The workflow is now live on your default branch. GitHub Actions will pick it up on the next scheduled trigger or when you click **Run workflow** in the Actions tab.

---

## What Was Added

After merging, your repository contains:

| File | Purpose |
|---|---|
| `.github/workflows/<name>.md` | The Markdown task brief — the human-readable workflow definition the agent and you can edit |
| `.github/workflows/<name>.lock.yml` | The compiled GitHub Actions YAML — generated automatically, do not edit by hand |

You can continue iterating through a GitHub Copilot app or Agents-tab session and let the agent handle edits and recompilation. If you want a persistent validation loop or direct CLI control, follow [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md) and use `gh aw compile --watch` in a local or Codespaces terminal.

---

## ✅ Checkpoint

- [ ] You opened a session for your repository in the GitHub Copilot app or Agents tab
- [ ] You pasted the scenario prompt (A, B, or C) and the agent created the workflow files
- [ ] The agent ran `gh aw compile .github/workflows/<name>.md --validate` successfully
- [ ] The pull request was created, reviewed, and merged into your default branch
- [ ] `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml` exist in your repository

**Previous:** [Step 10: Choose Your Scenario](10-choose-your-scenario.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
- [Managing issues and pull requests with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
