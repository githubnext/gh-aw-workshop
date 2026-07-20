<!-- page-journey: all -->
<!-- page-adventure: core -->
# Choose Your Workflow Scenario

> _The workflow you build in the next step is yours to keep — pick a scenario that matches how you actually work so it delivers real value from day one._

## 🎯 What You'll Do

You'll choose a workflow scenario and a build path that fits your environment. By the end of this step, you'll have a clear plan for what you're building and which set of instructions to follow.

## 📋 Before You Start

- Completed [Refine Your Workflow with Agentic Editing](09-agentic-editing.md)
- Your practice repository is set up and at least one workflow run has succeeded

## Pick a Scenario

You've already written and run a simple agentic workflow. Now it's time to build something real.

The table below describes three scenarios, each suited to a different use case. Read through them and pick the one that fits your team or project.

| Scenario | Best for | What the workflow does |
|----------|----------|------------------------|
| **Daily Status Report** | Teams wanting regular async updates on repository activity | Posts a Markdown summary of recent commits, open PRs, and stale issues to a Discussions thread or a designated file every weekday |
| **PR Reviewer** | Teams that review code and want AI-generated context before human review | Triggers on pull request open/update, reads the diff and linked issue, and posts a structured pre-review comment on the PR |
| **Issue Triage** | Teams with a busy issue inbox who want to reduce noise before human triage | Triggers on new issues, evaluates urgency and category, and applies labels or posts a triage comment |

> [!TIP]
> Not sure which to pick? **Daily Status Report** is the most self-contained and makes the cleanest first "real workflow." You can add the other scenarios later as separate workflow files in the same repository.

## Pick a Build Path

Once you know your scenario, choose how you want to build it.

Each path produces the same outcome — a working `.md` workflow file committed to `.github/workflows/` — but the steps differ depending on your environment and preference.

| If you… | Pick this path |
|---------|----------------|
| Are working in a Codespace or local terminal and want step-by-step CLI guidance | **Adventure A** — Terminal path |
| Prefer to edit files in the GitHub UI without a terminal | **Adventure B** — GitHub UI path |
| Want to use GitHub Copilot agent to author and commit the file for you | **Adventure C** — Copilot agent path |
| Are in an enterprise environment (GHES / GHEC) and need proxy or runner guidance first | **Side Quest** — [Enterprise Setup Considerations](side-quest-enterprise-setup.md), then return here |
| Want a 100% browser-only flow with no terminal at any stage (Copilot app or Agents tab) | **Adventure E** — [Browser-only path](#adventure-e-browser-only-daily-status-workflow-for-cca-and-mobile) |

> [!NOTE]
> All paths arrive at the same next node — [Test and Improve Your Workflow](12-test-and-iterate.md) — after you have a working workflow committed and at least one run to evaluate.

---

## What Makes a Good Workflow Brief?

Before you start building, it helps to sketch your brief in plain English. A good brief answers four questions:

1. **What data does the agent need?** (repository events, PR diffs, issues, external API)
2. **What should the agent do with it?** (summarise, classify, recommend, comment)
3. **Who receives the output, and where?** (Discussion thread, PR comment, issue label, file commit)
4. **What should the agent skip or ignore?** (bot-generated events, drafts, closed items)

If you want a structured exercise before diving in, try [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md).

---

## Adventure E: Browser-Only Daily Status Workflow for CCA and Mobile {#adventure-e-browser-only-daily-status-workflow-for-cca-and-mobile}

This path is for learners who have no terminal access. You'll use the **Agentic Workflows** Copilot agent (or the Agents tab in Copilot Chat) to author, compile, and commit the workflow file entirely from the browser.

### Open the Copilot agent

1. Open your practice repository on GitHub.
2. Click **Copilot** in the repository toolbar (or open Copilot Chat in your browser and select the **Agents** tab).
3. If prompted, install the **Agentic Workflows** agent or skill into the repository.

### Ask the agent to create a daily status workflow

Paste the following prompt into the chat. Adjust the description to match your repository:

```text
Using the agentic-workflows skill, create a daily status workflow that:
- Runs on a weekday schedule
- Reads recent commits and open pull requests from this repository
- Posts a Markdown summary as a new Discussion in the "Status" category
- Uses the minimum permissions required
- Saves both the .md and compiled .lock.yml files to .github/workflows/
```

The agent will draft the workflow, compile it with `gh aw compile`, and open a PR or commit directly to the default branch (depending on your repository's branch protection settings).

### Review and merge

1. Open the PR or commit the agent created.
2. Check that `.github/workflows/daily-status.md` and `daily-status.lock.yml` are both present.
3. Merge or confirm the commit.

### Trigger a test run

1. Go to the **Actions** tab.
2. Find your new workflow and click **Run workflow**.
3. Confirm the run completes without errors.

Once the run succeeds, continue to [Test and Improve Your Workflow](12-test-and-iterate.md).

---

## ✅ Checkpoint

- [ ] You chose one of the three workflow scenarios (Daily Status Report, PR Reviewer, or Issue Triage)
- [ ] You chose a build path (Adventure A, B, C, or E)
- [ ] You can describe in one sentence what your workflow will do and where it will write its output
- [ ] (Optional) You drafted a brief using the four-question framework above

## 🔀 Choose Your Path

| If you chose… | Go to… |
|---------------|--------|
| Terminal path (Adventures A) | ➡️ [Build Your Workflow — Terminal Path](11a-build-daily-status.md) |
| GitHub UI path (Adventure B) | ➡️ [Test and Improve Your Workflow](12-test-and-iterate.md) _(follow the UI instructions in that step to create the file first)_ |
| Copilot agent path (Adventure C) | ➡️ [Test and Improve Your Workflow](12-test-and-iterate.md) _(use the Copilot agent to draft and commit the file, then return here to evaluate the run)_ |
| Browser-only path (Adventure E) | ➡️ Follow the [Adventure E steps above](#adventure-e-browser-only-daily-status-workflow-for-cca-and-mobile), then [Test and Improve Your Workflow](12-test-and-iterate.md) |
