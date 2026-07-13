# Side Quest: Agentic Workflows for GitHub Actions Power Users

> _Optional: read this quick-reference guide if you already know GitHub Actions and want a fast comparison before continuing with [Step 5](05-agentic-workflows-intro.md)._

## 📋 Before You Start

To get the most out of this fast-track guide, you should have already:

- Completed [Step 4: GitHub Actions in 5 Minutes](04-github-actions-intro.md) — or have hands-on experience authoring `.github/workflows/*.yml` files.
- Understood the core Actions concepts: triggers (`on:`), jobs, steps, and runners.
- Optionally reviewed [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md) for a beginner-friendly introduction before using this cheat sheet.

## 🎯 What You'll Do

Review the key shift from classic Actions to agentic workflows, scan a one-page comparison table, and keep a short list of what stays unchanged. By the end, you'll have a practical adoption lens for platform and DevOps use cases.

## The core mental model shift

You keep the same GitHub Actions foundations — triggers, permissions, runners, repo context, and pull-request review flow — but you stop hand-authoring fixed `jobs.steps` logic and instead define a goal in plain language that an agent executes at runtime.

## Advanced fast-track: What's new cheat sheet

Use this as a one-page reference for the shift from classic workflows to agentic workflows.

| Classic GitHub Actions | Agentic workflows |
|---|---|
| Classic workflows execute a predetermined, hard-coded sequence of steps that you define at authoring time — meaning every branch in logic must be written out explicitly in YAML. | Agentic workflows define a plain-language goal and let the agent decide which actions to take at runtime, so the flow adapts without you rewriting YAML for every new case. |
| All logic is encoded manually in YAML and shell scripts, which means every decision point and edge case must be anticipated and hardcoded by the author. | Logic can be delegated to an AI agent guided by a natural-language prompt and explicit constraints, so the agent reasons through ambiguity instead of failing on an unhandled branch. |
| Classic workflows handle known, explicit branches well because every outcome is predetermined — but they break or require updates when inputs fall outside the expected range. | Agentic workflows handle ambiguous or variable inputs by reasoning through them at runtime, which reduces the number of maintenance updates you need to ship. |
| Output is typically the stdout of commands and scripts, which is useful for structured pipelines but harder to consume when the result requires interpretation. | Output can include synthesized prose summaries, structured decisions, and follow-up action recommendations — making results easier to consume in review comments, Slack messages, or issue threads. |
| Extending coverage for a new scenario requires a human to update the workflow logic, test it, and merge a PR before the new case is handled. | Humans define guardrails once (for example, "only label issues, never close them"), and the agent handles variations in inputs automatically within those boundaries. |
| Classic workflows are the right choice for deterministic, well-scoped automation where every step is known and the output must be bit-for-bit reproducible. | Agentic workflows excel when tasks require interpretation, triage, or planning — for example, summarizing a pull request, triaging a bug report, or drafting a release note. |

## What stays the same

- Workflows still run in GitHub Actions runners
- Triggers, permissions, and repository context still matter
- You still version workflows in git and review them like code

The same authoring and review workflow applies everywhere — only the runner configuration differs.

## 🖊️ Quick reflection

> **Apply what you just read:** Think of the last GitHub Actions workflow you wrote or reviewed. Identify one step — for example, a `run:` command that parses issue labels or checks PR titles — that currently requires you to handle every case explicitly in script logic.
>
> Write a one-sentence plain-language goal that an agentic workflow could use instead. For example: _"Analyze the PR description and suggest up to three relevant labels from the repository's label list."_
>
> Post your one-sentence goal as a comment on your practice repository's open issue, or jot it in a text editor. You'll revisit it when you author your first agentic workflow in [Step 7](07-your-first-workflow.md).

## Why platform and DevOps teams adopt this model

For platform engineers and DevOps teams evaluating adoption, agentic workflows cut the cost of maintaining bespoke scripted automation. Engineers spend less time updating fragile scripts and more time on higher-value work. Every workflow definition is a versioned Markdown file that goes through a pull request, so teams retain full auditability, change history, and approval gates. This makes agentic automation compatible with enterprise compliance requirements and existing runner fleet investments.

## ✅ Checkpoint

- [ ] I can explain the mental model shift from scripted steps to goal-oriented execution
- [ ] I can identify what changes in agentic workflows and what stays the same from classic Actions
- [ ] I can explain why this model can reduce automation maintenance overhead for platform teams

---

Return to the main adventure: [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md).
