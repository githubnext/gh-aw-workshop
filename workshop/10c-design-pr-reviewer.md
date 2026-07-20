---
journey: all
adventure: scenario-c
---
# Design — PR Code Reviewer

> _Great [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) start with a clear brief — writing down what you want before you code anything saves hours of debugging later._

## 🎯 What You'll Do

You'll design a **PR Code Reviewer** workflow that automatically checks every pull request for duplicate code — scanning both the incoming changes and the existing codebase. Instead of jumping straight into YAML, you'll sketch the agent's goal, inputs, and expected output in plain English first. By the end you'll have a clear brief ready to translate into a workflow file in the next step.

## 📋 Before You Start

- You've completed [Step 10: Choose Your Scenario](10-choose-your-scenario.md)
- You have a practice repository created in [Step 3](03-create-your-repo.md)

---

## Why This Scenario?

Duplicated code is one of the most common sources of long-term maintenance debt. It often slips through code review because reviewers focus on logic rather than patterns. An AI agent can scan both the diff and the broader codebase for similar code blocks — and post a structured review comment before any human reviewer has to.

---

## The Four Components of a Good Brief

Every effective agent brief covers these four things:

| Component | What to write | Example |
|-----------|--------------|---------|
| **Goal** | One sentence: what should the agent do? | "Review each pull request for duplicate code and post a structured review comment." |
| **Inputs** | Bullet list of the data the agent needs to collect | The PR diff, source files in the repo, language of changed files |
| **Output format** | A concrete skeleton or template the agent should fill in | The review comment template below |
| **Guardrails** | Short rules that prevent unexpected behaviour | Do not approve or request changes; only comment |

---

## A Ready-to-Use Starter Brief

Copy this into a scratch file and personalise it:

```
When a pull request is opened or updated, review the changed files for
duplicate code patterns. Check for similarity both within the PR diff itself
and against existing files in the codebase. Post a structured review comment
summarising any findings.

Inputs to collect:
- The list of files changed in this pull request
- The diff (added and modified lines) for each changed file
- A representative sample of existing source files in the same directories
  as the changed files (to compare against)

Output format — post a PR review comment with this structure:

🔍 Duplicate Code Review
════════════════════════
Files reviewed: {count changed files} changed, {count existing files sampled}
Findings: {count of issues found}

{For each finding:}
📋 **Possible duplicate** in `{file}` (lines {start}–{end})
   Similar to: `{other file or location}`
   Suggestion: {one sentence — extract to a shared function, or confirm intentional copy}

{If no findings:}
✅ No significant code duplication detected in this PR.

Guardrails:
- Post at most five findings. If there are more, note "additional findings omitted" and list only the top five by similarity score.
- Do not approve or request changes — only add a comment.
- Do not flag comments, blank lines, import statements, or boilerplate (e.g. licence headers).
- If the PR touches only documentation or configuration files, reply: "No source code changes to review."
```

> [!TIP]
> Want a deeper walkthrough of the brief-writing process? [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md) walks through each component step by step with extra tips on why each decision matters.

---

## Thinking Through the Design

Before moving on, ask yourself these questions:

**What counts as "duplicate"?**
The starter brief leaves the threshold to the AI model. You can make it more explicit — for example, "flag any block of five or more consecutive lines that appears with fewer than three differences elsewhere in the codebase."

**Which files should the agent scan?**
Scanning the entire codebase for every PR can be slow. Narrowing the scan to files in the same directory as the changed files keeps runtime short and findings relevant.

**Should findings block the PR?**
The starter brief tells the agent to comment only, not to request changes. Duplicate code is a suggestion, not a blocker — adjust this guardrail if your team has stricter standards.

**What about auto-generated or vendored code?**
If your repo has a `vendor/`, `generated/`, or `third_party/` directory, add a guardrail like _"Ignore files in `vendor/` and `generated/`."_

---

## ✅ Checkpoint

- [ ] I've written a one-sentence goal for my PR code reviewer
- [ ] I've listed at least three inputs the agent will need
- [ ] I've sketched the review comment format (even a rough draft counts)
- [ ] I've written at least two guardrail rules

<!-- journey: all -->
**Next:** [Step 11c: Build — PR Code Reviewer](11c-build-pr-reviewer.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/), [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), [Triggers reference](https://github.github.com/gh-aw/reference/triggers/), and [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/).

