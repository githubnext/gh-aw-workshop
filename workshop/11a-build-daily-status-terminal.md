# Step 11a: Build the Daily Repo Status Workflow — Terminal Path

_You've designed the workflow on paper — now let's turn it into real, running YAML._

> [!TIP]
> **Two paths through this step:**
> - **This page (manual build)** — write the file section by section so every line is clear.
> - **[Adventure A: Add Wizard](11a-build-daily-status-wizard.md)** — use `gh aw add-wizard` for a guided, interactive setup.
>
> Both paths produce the same workflow and converge at [Step 12](12-test-and-iterate.md). Prefer the browser? Switch to the [GitHub UI path](11a-build-daily-status-ui.md).

## 🎯 What You'll Do

You'll write the complete `daily-status.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every line so nothing is mysterious. When you're done, commit the file and continue to [Step 11a2](11a2-run-daily-status-terminal.md) to compile and run it.

## Before You Start

- You've completed [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- Your terminal is inside `my-agentic-workflows`
- [`gh aw` is installed and authenticated](06-install-gh-aw.md)

## The Workflow File at a Glance

An agentic workflow file has two parts: **frontmatter** (YAML between `---` fences) and a **Markdown body** (the agent's instructions below the closing `---`). The table below summarizes the five frontmatter sections you'll build.

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels shown in the `gh aw` dashboard and Actions UI. |
| Triggers | `on:` | Tells GitHub Actions when to run — `schedule: daily` plus a manual `workflow_dispatch` button. |
| Permissions | `permissions:` | Declares the minimum GitHub API scopes the workflow may use. |
| Tools | `tools:` | Enables the GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | The only write actions the agent may take — here, one issue comment per run. |

This file ends in `.md` instead of `.yml` because agentic workflows use Markdown — see the [Classic vs. Agentic comparison in Step 5](05-agentic-workflows-intro.md#classic-actions-vs-agentic-workflows). For deeper context on any key, see [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md) and [Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md).

## Create the workflow file

```bash
mkdir -p .github/workflows
```

Open your editor and create `.github/workflows/daily-status.md`. Build it section by section below, keeping `gh aw compile .github/workflows/daily-status.md --watch` running in a second terminal for continuous feedback as you save each change.

### Add the frontmatter basics

Start with the opening fence and the two metadata keys. `emoji` is a visual label in workflow lists; `description` is the plain-English summary shown in the `gh aw` dashboard and the Actions UI.

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
---
```

### Add the trigger block

Add the trigger block after the `description` line, before the closing `---`. `schedule: daily` is `gh-aw`'s shorthand for a daily cron schedule (compiles to `0 0 * * *`, midnight UTC). `workflow_dispatch: {}` adds a manual **Run workflow** button in the Actions UI so you can test on demand.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

### Add the permissions block

Add the minimum permissions the workflow needs. Keeping permissions narrow reduces the blast radius if you misconfigure the prompt.

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

> [!NOTE]
> `copilot-requests: write` is required for every agentic workflow — it grants the Actions runner permission to call the Copilot AI API on your behalf. Every other permission is read-only.

### Add the tools block

The `tools` block tells the agent how to talk to GitHub. `mode: gh-proxy` routes all GitHub API calls through a controlled proxy that enforces only the scopes in `permissions`.

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

### Add the safe-outputs guardrail

`safe-outputs.add-comment: max: 1` limits the agent to posting at most one issue comment per run — no other write actions are permitted.

```yaml
safe-outputs:
  add-comment:
    max: 1
```

### Add the agent instructions

Add the Markdown body below the closing `---`. This is the brief the AI agent follows at runtime.

```markdown
# Daily Repo Status Report

You are an AI assistant that monitors this repository and posts a concise daily health report.

## Your Task

Collect and summarize:
1. **Open pull requests** — count, and flag any open longer than 7 days
2. **Open issues** — total count, how many are labeled "bug"
3. **CI status** — result of the most recent workflow run on the default branch
4. **Last commit** — message and time since it was pushed

## Output Format

Find the most recently updated open issue and post a comment in this format:

```
📊 Daily Repo Status — {today's date}
══════════════════════════════════
🔀 Open pull requests:  {count}
🐛 Open issues:         {count}  ({bug-count} labeled "bug")
✅ CI status:           {passing/failing/unknown}
📝 Last commit:         "{message}" — {time ago}

{One sentence of overall health. Flag anything that needs attention.}
```

## Guidelines

- Post only one comment. If you have already posted today, skip.
- Keep the report factual. Do not invent numbers.
- If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
```

## Commit and push

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: add daily repo status agentic workflow"
git push
```

> [!TIP]
> When you need to modify this workflow later, prefer using an agent with the `/agentic-workflows` skill or run `gh aw compile .github/workflows/daily-status.md --watch` for continuous feedback as you edit. **Agents edit agents.**

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
**Next:** [Step 11a2: Compile and Run the Daily Status Workflow](11a2-run-daily-status-terminal.md)

## ✅ Checkpoint

Before moving on, confirm all of the following:

- [ ] `.github/workflows/daily-status.md` exists in my repository
- [ ] The workflow file contains all five frontmatter sections: `emoji`/`description`, `on:`, `permissions:`, `tools:`, and `safe-outputs:`
- [ ] `gh aw compile .github/workflows/daily-status.md --validate` exits with no errors
- [ ] `git log --oneline -1` shows my commit `feat: add daily repo status agentic workflow`
- [ ] `git push` completed successfully and the file is visible on GitHub

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
