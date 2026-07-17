# Step 7c: Write Your First Agentic Workflow — GitHub Copilot Path

## 🎯 What You'll Do

You'll ask an agent in the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or Agents tab to create and validate `daily-report-status.md`, then review and merge its pull request.

## 📋 Before You Start

- Your practice repository is connected to the GitHub Copilot app or available in the Agents tab
- You have an active GitHub Copilot plan

## Start a session

Open your practice repository in the GitHub Copilot app and start a session in **Interactive** mode so you can steer the work, or open the repository's **Copilot** or **Agents** tab and start a new session.

Paste this prompt:

```text
Initialize this repository for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/install.md

Then create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

The workflow must:
- Be named "Daily Report Status"
- Support manual runs with `workflow_dispatch`
- Use `contents: read`, `issues: read`, and `copilot-requests: write`
- Allow at most one comment and at most one new issue through [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)
- Search open issues for the issue with the most 👍 reactions and comment:
  "This issue has the most community support! We'll prioritise it in our next planning session."
- Create an issue titled "Community Voting Test" and post the same comment if no open issues exist

Run `gh aw compile --validate` in the session workspace, fix any errors, commit the source and generated lock file (plus any initialized skill files), and open a pull request. Show me the diff before merging.
```

The agent runs validation in its isolated session workspace. You do not need a terminal for this path.
Before you approve the merge, the agent presents the file changes in its session response for you to review.

> [!NOTE]
> To keep `gh aw compile --watch` running while you edit, use a local or Codespaces terminal instead.

## Review and merge

1. Confirm `.github/workflows/daily-report-status.md` contains the requested trigger, permissions, safe outputs, and task.
2. Confirm `.github/workflows/daily-report-status.lock.yml` exists.
3. Ask the agent to correct anything that does not match the prompt.
4. Merge the pull request into `main`.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-report-status.md` exists in the repository
- [ ] `.github/skills/agentic-workflows/` exists in the repository from `gh aw init`
- [ ] The agent validated the workflow in its session workspace
- [ ] You reviewed the source and generated lock file
- [ ] You merged the pull request into `main`
- [ ] You are ready to choose the workflow's billing and authentication method

**Next:** [Step 7d: Confirm Model Access](07d-confirm-model-access.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Compilation Process](https://github.github.com/gh-aw/reference/compilation-process/)
- [AI Engines reference](https://github.github.com/gh-aw/reference/engines/)
