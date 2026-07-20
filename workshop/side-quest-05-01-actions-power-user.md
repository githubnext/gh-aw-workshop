<!-- journey: all -->
<!-- adventure: side-quest -->
# Side Quest: Agentic Workflows for GitHub Actions Power Users

> _Optional: read this quick-reference guide if you already know GitHub Actions and want a fast comparison before continuing with [Step 5](05-agentic-workflows-intro.md)._

## 📋 Before You Start

To get the most out of this fast-track guide, you should have already:

- Completed [Step 4: GitHub Actions in 5 Minutes](04-github-actions-intro.md) — or have hands-on experience authoring `.github/workflows/*.yml` files.
- Understood the core Actions concepts: triggers (`on:`), jobs, steps, and runners.
- Optionally reviewed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md) for a beginner-friendly introduction before using this cheat sheet.

## 🎯 What You'll Do

Review the key shift from classic Actions to agentic workflows, compare concrete code examples, and keep a short list of what stays unchanged. By the end, you'll have a practical adoption lens for platform and DevOps use cases.

## The core mental model shift

You keep the same GitHub Actions foundations — triggers, permissions, runners, repo context, and pull-request review flow — and add an agentic layer on top. In practice, this is a smooth transition: frontmatter stays Actions-compatible, while the Markdown body captures the goal and reasoning instructions for the agent.

## Before and After: Classic Actions vs. Agentic Workflows

The biggest shift is replacing imperative shell steps with a plain-language goal. Here is the same "triage an issue" task written both ways.

**Classic GitHub Actions** — every decision is hard-coded in shell (simplified for illustration):

```yaml
on: [issues]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - name: Apply bug label
        run: |
          # Must hard-code every label check
          if echo "${{ github.event.issue.body }}" | grep -qi "error\|exception"; then
            gh issue edit ${{ github.event.issue.number }} --add-label "bug"
          fi
          # Real workflows need more checks, error handling, and edge-case branches
```

**Agentic workflow** — a plain-language goal replaces the shell logic:

```yaml
---
on: [issues]
---
Read the opened issue body and apply the single most relevant label
from the repository label list. Do not close or comment on the issue.
```

Key differences at a glance:

| | Classic Actions | Agentic workflows |
|---|---|---|
| **Logic** | Hard-coded shell; every branch written by hand | Delegated to agent; handles new cases automatically |
| **Inputs** | Fixed; fails on unexpected values | Flexible; reasons through ambiguity at runtime |
| **Output** | Command stdout | Prose summaries, decisions, action recommendations |
| **Maintenance** | Update the workflow for each new case | Define guardrails once; agent handles variations |
| **Best for** | Deterministic, reproducible tasks | Triage, summarization, planning, interpretation |

## Superset, not replacement

Think of agentic workflows as a superset of Actions:

- Frontmatter remains compatible with the Actions model you already know.
- The Markdown body becomes the runtime prompt and can include templating and inline agent features.
- You can still keep deterministic logic when that is the right tool for the job.

## Hybrid pattern for real teams

A practical migration path is hybrid:

1. Keep deterministic jobs or steps for stable data operations (fetch, transform, validate).
2. Pass structured outputs into the workflow body.
3. Let the agent handle interpretation, prioritization, and communication.

This pattern works well for platform and DevOps teams because you preserve deterministic guardrails while reducing hand-written branching logic for context-heavy decisions.

## 🛠️ Try it

Open the workflow file you created in Step 4, or find a `run:` step in any `.github/workflows/*.yml` file. Pick one step that handles a decision — checking a label, parsing a PR title, or filtering by file path.

Add a comment above that step with a one-sentence plain-language goal. The step body below is just a stand-in — your real step keeps its existing logic unchanged:

```yaml
# Goal: suggest up to three relevant labels from the repo label list
- name: Check labels
  run: |
    # ... your existing logic stays here unchanged
```

Keep this goal statement handy — you will use it when authoring your first agentic workflow in [Step 7](07-your-first-workflow.md).

## What stays the same

- Workflows still run in GitHub Actions runners
- [Triggers](https://github.github.com/gh-aw/reference/triggers/), permissions, and repository context still matter
- You still version workflows in git and review them like code

The same authoring and review workflow applies everywhere — only the runner configuration differs.

## Why platform and DevOps teams adopt this model

For platform engineers and DevOps teams evaluating adoption, agentic workflows cut the cost of maintaining bespoke scripted automation:

- Less time updating fragile shell scripts; more time on higher-value work
- Every definition is a versioned Markdown file reviewed in a pull request
- Full auditability, change history, and approval gates stay intact
- Compatible with existing runner fleet investments and compliance requirements

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can explain the mental model shift from scripted steps to goal-oriented execution
- [ ] I can identify what changes in agentic workflows and what stays the same from classic Actions
- [ ] I can explain why agentic workflows are best described as an Actions-compatible superset
- [ ] I identified one specific `run:` step in an existing workflow that could be replaced with a goal statement
- [ ] I can describe one scenario where classic Actions is still the right choice
- [ ] I can explain why this model can reduce automation maintenance overhead for platform teams

---

Return to the main adventure: [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md).

<!-- /journey -->
For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/) and [Triggers reference](https://github.github.com/gh-aw/reference/triggers/).

