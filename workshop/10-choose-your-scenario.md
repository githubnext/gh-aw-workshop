# Step 10: Choose Your Scenario

> _The best way to learn agentic workflows is to build one you'd actually use. Pick the scenario that matches what you want to automate._

## 🎯 What You'll Do

Choose one of three real-world [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) scenarios to design and build over the next two steps. Each scenario follows the same structure — design a brief, then build the workflow file — so you'll practice the same core skills whichever path you take.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Pick Your Adventure

Before you read the scenario descriptions, write one sentence describing a repository task you'd like to automate.
Put it in a note in your preferred editor, a GitHub issue draft, or a local text file.
Keep it nearby — this helps you compare your idea to the scenarios later in this step.

| Scenario | What it automates | Best for |
|---|---|---|
| [Daily Repo Status Report](#adventure-a-daily-repo-status-report) | Posts a daily health summary of open PRs, issues, CI status, and recent commits | Teams that want a zero-effort morning standup digest |
| [Daily Documentation Updater](#adventure-b-daily-documentation-updater) | Scans your docs files every day and posts a health report highlighting staleness, missing sections, and broken links | Projects where docs drift out of sync with the code |
| [PR Code Reviewer](#adventure-c-pr-code-reviewer) | Reviews every pull request for duplicate code — checking both the changes and the existing codebase — and posts a structured review comment | Teams that want automated duplication detection in code review |

> [!TIP]
> Not sure which to pick? Start with **Adventure A** — it's the most detailed and has the most supporting side quests. You can always come back and try the others.

<!-- -->

> [!NOTE]
> **Using the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or the Agents tab?** You can skip the design step and have an agent build any of these scenarios. Pick a scenario from the table above to understand what it does, then jump to [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md).

---

## Adventure A: Daily Repo Status Report

**What you'll build:** A scheduled workflow that posts a concise daily health summary as an issue comment — open PRs, issues, CI status, and the most recent commit.

**Trigger:** Runs once per day on a schedule.

**Key permissions:** `issues: read`, `pull-requests: read`, `actions: read`

**Safe output:** One issue comment per day.

➡️ [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)

---

## Adventure B: Daily Documentation Updater

**What you'll build:** A scheduled workflow that scans your repository's documentation files and posts a daily health report — flagging stale content, missing sections, and broken cross-references.

**Trigger:** Runs once per day on a schedule.

**Key permissions:** `contents: read`, `issues: read`

**Safe output:** One issue comment per day.

➡️ [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)

---

## Adventure C: PR Code Reviewer

**What you'll build:** A workflow that triggers on every pull request and checks the changed files for duplicate code patterns — both within the PR diff and against the existing codebase. It posts a structured review comment with its findings.

**Trigger:** Fires on `pull_request` events (open, synchronize).

**Key permissions:** `contents: read`, `pull-requests: read`

**Safe output:** Up to five review comments per PR (posted via `safe-outputs`).

➡️ [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)

---

## Commit to Your Choice

- In your note or draft from earlier, write the adventure you chose and one reason it matches the repository task you wrote down earlier.
- Open the matching design step — [Step 10a](10a-design-daily-status.md), [Step 10b](10b-design-daily-docs.md), or [Step 10c](10c-design-pr-reviewer.md) — and read the first paragraph to confirm the scenario matches what you want to automate.
- If you're using the GitHub Copilot app or the Agents tab, you'll skip the design step and jump to [Step 11d: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md).

---

## ✅ Checkpoint

- [ ] I've written one sentence describing a repository task I'd like to automate
- [ ] I've chosen an adventure and written down one reason it matches that task
- [ ] I can name the trigger my chosen scenario uses
- [ ] I've opened the next step for my chosen scenario and read the first paragraph
- [ ] I know whether I'll follow the design step path or jump to Step 11d with the GitHub Copilot app or Agents tab

**Next (pick one):**

- ➡️ Adventure A: [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- ➡️ Adventure B: [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
- ➡️ Adventure C: [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
- ➡️ Adventure D: [Step 11d: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)

> [!TIP]
> **Curious about security?** Before you build, explore how adversarial instructions in repository content can try to override your agent's task brief — and how gh-aw's layered architecture limits the impact. [Side Quest: Jailbreaking the Agent Brief](side-quest-10-02-jailbreak-brief.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
