# Side Quest: Agentic Workflows for GitHub Actions Power Users

> _Optional: read this quick-reference guide if you already know GitHub Actions and want a fast comparison before continuing with [Step 5](05-agentic-workflows-intro.md)._

## 🎯 What You'll Do

Review the key shift from classic Actions to agentic workflows, scan a one-page comparison table, and keep a short list of what stays unchanged. By the end, you'll have a practical adoption lens for platform and DevOps use cases.

## The core mental model shift

You keep the same GitHub Actions foundations — triggers, permissions, runners, repo context, and pull-request review flow — but you stop hand-authoring fixed `jobs.steps` logic and instead define a goal in plain language that an agent executes at runtime.

## Advanced fast-track: What's new cheat sheet

Use this as a one-page reference for the shift from classic workflows to agentic workflows.

| Classic GitHub Actions | Agentic workflows |
|---|---|
| Predetermined sequence of steps | Goal-oriented flow where an agent can choose next actions |
| Logic is encoded manually in YAML and scripts | Logic can be delegated to an AI agent guided by prompts and constraints |
| Handles known, explicit branches well | Handles ambiguous inputs by reasoning and adapting |
| Output is usually command/script results | Output can include synthesized summaries, decisions, and follow-up actions |
| Human updates workflow logic for every new scenario | Human defines guardrails; agent handles more variation at runtime |
| Great for deterministic automation | Best when tasks require interpretation, triage, or planning |

## What stays the same

- Workflows still run in GitHub Actions runners
- Triggers, permissions, and repository context still matter
- You still version workflows in git and review them like code

The same authoring and review workflow applies everywhere — only the runner configuration differs.

## Why platform and DevOps teams adopt this model

For platform engineers and DevOps teams evaluating adoption, agentic workflows cut the cost of maintaining bespoke scripted automation. Engineers spend less time updating fragile scripts and more time on higher-value work. Every workflow definition is a versioned Markdown file that goes through a pull request, so teams retain full auditability, change history, and approval gates. This makes agentic automation compatible with enterprise compliance requirements and existing runner fleet investments.

## ✅ Checkpoint

- [ ] I can explain the mental model shift from scripted steps to goal-oriented execution
- [ ] I can identify what changes in agentic workflows and what stays the same from classic Actions
- [ ] I can explain why this model can reduce automation maintenance overhead for platform teams

---

Return to the main adventure: [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md).
