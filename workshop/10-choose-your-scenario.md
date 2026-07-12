# Step 10: Choose Your Scenario

> _The best way to learn agentic workflows is to build one you'd actually use. Pick the scenario that matches what you want to automate._

## 🎯 What You'll Do

Choose one of three real-world agentic workflow scenarios to design and build over the next two steps. Each scenario follows the same structure — design a brief, then build the workflow file — so you'll practice the same core skills whichever path you take.

## 📋 Before You Start

- You've completed [Step 9: Reading Workflow Output](09-understand-output.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Pick Your Adventure

| Scenario | What it automates | Best for |
|---|---|---|
| [Daily Repo Status Report](#adventure-a-daily-repo-status-report) | Posts a daily health summary of open PRs, issues, CI status, and recent commits | Teams that want a zero-effort morning standup digest |
| [Daily Documentation Updater](#adventure-b-daily-documentation-updater) | Scans your docs files every day and posts a health report highlighting staleness, missing sections, and broken links | Projects where docs drift out of sync with the code |
| [PR Code Reviewer](#adventure-c-pr-code-reviewer) | Reviews every pull request for duplicate code — checking both the changes and the existing codebase — and posts a structured review comment | Teams that want automated duplication detection in code review |

> [!TIP]
> Not sure which to pick? Start with **Adventure A** — it's the most detailed and has the most supporting side quests. You can always come back and try the others.

<!-- -->

> [!NOTE]
> **Using GitHub Copilot with the Agents tab enabled?** You can skip the design step and build any of these scenarios directly from the GitHub UI — no CLI installation required. Pick a scenario from the table above to understand what it does, then jump to [Adventure D: Build Any Workflow with the GitHub Copilot Agents Tab](11d-build-copilot-agents.md).

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

**Key permissions:** `contents: read`, `pull-requests: write`

**Safe output:** Up to five review comments per PR.

➡️ [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)

---

## ✅ Checkpoint

- [ ] I've read all three scenario descriptions
- [ ] I've picked the scenario I want to build
- [ ] I'm ready to start the design step for my chosen adventure

**Next (pick one):**

- ➡️ Adventure A: [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- ➡️ Adventure B: [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
- ➡️ Adventure C: [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
- ➡️ Adventure D: [Step 11d: Build Any Workflow with the GitHub Copilot Agents Tab](11d-build-copilot-agents.md)
