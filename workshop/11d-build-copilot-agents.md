# Adventure D: Build Any Workflow with GitHub Copilot

> _You can use the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or the browser-based Agents tab to start an agent session, steer the work, review the changes, and land an agentic workflow._

## 📋 Before You Start

This adventure builds on:

- **Step 7** ([Your first workflow](07-your-first-workflow.md)): writing a Markdown task brief with YAML frontmatter
- **Compile guidance** ([Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)): using `gh aw compile` to generate and validate lock files
- **Step 10** ([Choose your scenario](10-choose-your-scenario.md)): the scenario (A, B, or C) you selected to build
- **Step 11 (any path)** ([11a](11a-build-daily-status.md), [11b](11b-build-daily-docs.md), or [11c](11c-build-pr-reviewer.md)): how frontmatter keys such as `triggers`, `permissions`, and `safe-outputs` shape what the workflow can do

You do not need the `gh-aw` CLI installed locally — the agent handles compilation in its own workspace.

## 🎯 What You'll Do

You'll choose the GitHub Copilot desktop app or the Agents tab, paste a ready-made prompt that bootstraps the agent with the agentic workflow format, and watch the agent create and validate your workflow. Then you'll review and merge its pull request.

## 📋 What You Need

- A GitHub repository (see [Step 3: Open and Verify Your Practice Repository](03-create-your-repo.md) if you haven't created one yet)
- A GitHub Copilot plan
- Either the [GitHub Copilot app](https://github.com/features/ai/github-app) installed or the Copilot coding agent (Agents tab) enabled

The GitHub Copilot app runs on macOS, Windows, and Linux. If you don't see the Agents tab in your repository, ask your organization administrator to enable the Copilot coding agent in [GitHub Copilot feature policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

---

## Choose Where to Start Your Session

### GitHub Copilot app

1. Open the GitHub Copilot app.
2. Next to **Sessions**, click **+**.
3. Choose your practice repository from GitHub, a local folder, or a repository URL.
4. Choose **Interactive** mode so you can review and steer the work as it progresses.

### GitHub Copilot Agents tab

1. Open your practice repository on GitHub.com.
2. In the repository navigation, click **Copilot** (or the **Agents** tab if your organization uses that label).
3. Click **New session** (or **Ask Copilot** / **Start agent task** — the exact label depends on your GitHub version).

You can also start a session from any open issue by clicking **Assign to Copilot** in the issue sidebar — the issue body becomes the task description.

---

## ✅ Ready to Start?

Before you paste the scenario prompt, confirm you have everything in place:

- [ ] You have opened a session for your practice repository (Copilot app or Agents tab)
- [ ] You know which scenario you are building (A, B, or C — see [Step 10](10-choose-your-scenario.md))

---

## Paste the Prompt

The prompt below tells the agent two things:
1. Where to learn the agentic workflow file format (the `create.md` reference guide from the `github/gh-aw` repository).
2. What workflow to create for your chosen scenario.

**Choose the prompt for the scenario you picked in [Step 10](10-choose-your-scenario.md).**

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
Compile it with `gh aw compile`.
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
Compile it with `gh aw compile`.
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
- Use safe-outputs: add-comment with max: 5

Save the workflow as `.github/workflows/pr-code-reviewer.md`.
Compile it with `gh aw compile`.
Commit the `.md` file and the generated `.lock.yml`, then open a pull request for review.
```

---

## ✅ Checkpoint

- [ ] You have opened a session for your practice repository in the GitHub Copilot app or Agents tab
- [ ] You confirmed the agent can reach the reference guide (probe returned Frontmatter schema, Triggers, Permissions, and Safe outputs)
- [ ] You submitted the scenario prompt (A, B, or C) to the agent

**Previous:** [Step 10: Choose Your Scenario](10-choose-your-scenario.md)
**Next:** [Adventure D (Part 2): Monitor, Review, and Merge](11d2-review-and-merge.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
