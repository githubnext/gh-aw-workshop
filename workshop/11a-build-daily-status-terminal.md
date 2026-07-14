# Step 11a: Build the Daily Repo Status Workflow — Terminal Path

_You've designed the workflow on paper — now let's turn it into real, running YAML._

> [!TIP]
> **Two paths through this step:**
> - **This page (manual build)** — write the file section by section so every line is clear.
> - **[Adventure A: Add Wizard](11a-build-daily-status-wizard.md)** — use `gh aw add-wizard` for a guided, interactive setup.
>
> Both paths produce the same workflow and converge at [Step 12](12-test-and-iterate.md). Prefer the browser? Switch to the [GitHub UI path](11a-build-daily-status-ui.md).

## 🎯 What You'll Do

You'll write the `daily-status.md` agentic workflow file in `.github/workflows/`, one section at a time. Each section ends with a short **✏️ Try it** activity so you can compile and check your work before moving on. When you're done, commit the file and continue to [Step 11a2](11a2-run-daily-status-terminal.md) to run it.

## 📋 Before You Start

- You've completed [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md) and have your agent brief ready
- Your terminal is open inside `my-agentic-workflows`
- [`gh aw` is installed and authenticated](06-install-gh-aw.md)

## Create the file and start the watcher

Run these commands once before you begin writing:

```bash
mkdir -p .github/workflows
touch .github/workflows/daily-status.md
```

In a **second terminal**, start the compiler in watch mode so it reports errors as you save:

```bash
gh aw compile .github/workflows/daily-status.md --watch
```

Leave the watcher running throughout this step.

<details>
<summary>📖 Workflow file structure at a glance (expand if you want the overview first)</summary>

An agentic workflow file has two parts: **frontmatter** (YAML between `---` fences) and a **Markdown body** (the agent's instructions below the closing `---`). The table below summarizes the five frontmatter sections you'll add.

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels shown in the `gh aw` dashboard and Actions UI. |
| Triggers | `on:` | Tells GitHub Actions when to run — `schedule: daily` plus a manual `workflow_dispatch` button. |
| Permissions | `permissions:` | Declares the minimum GitHub API scopes the workflow may use. |
| Tools | `tools:` | Enables the GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | The only write actions the agent may take — here, one issue comment per run. |

This file ends in `.md` instead of `.yml` because agentic workflows use Markdown — see the [Classic vs. Agentic comparison in Step 5](05-agentic-workflows-intro.md).

</details>

---

## Section 1 — Metadata

Start with the opening fence and the two metadata keys. `emoji` is the visual label shown in `gh aw list`; `description` is the one-sentence summary displayed in the GitHub Actions UI.

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
```

**✏️ Try it:** Paste the block above into your file and save. Check that the watcher shows no errors. Feel free to swap the emoji or reword the description.

> [!TIP]
> For a detailed walkthrough of metadata and the other opening sections, see [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md).

---

## Section 2 — Triggers

Add the trigger block after the `description` line. `schedule: daily` is `gh-aw`'s shorthand that compiles to a once-per-day cron schedule. `workflow_dispatch: {}` adds a **Run workflow** button in the Actions UI so you can test on demand without waiting for the schedule.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

**✏️ Try it:** Add the `on:` block and save. The watcher should still report no errors.

> [!TIP]
> Curious how `schedule: daily` maps to a cron expression, or want to use a custom schedule? See [Side Quest: Schedule Expressions](side-quest-13-01-schedule-expressions.md).

---

## Section 3 — Permissions

Add the minimum permissions the workflow needs. Narrow permissions reduce the blast radius if you misconfigure the prompt.

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

> [!NOTE]
> `copilot-requests: write` is required for every agentic workflow — it lets the Actions runner call the Copilot AI API. Every other permission here is read-only. Write access for issue comments is handled by `safe-outputs` (Section 5 below).

**✏️ Try it:** Add `permissions:` and save. Confirm the watcher is still green.

---

## Section 4 — Tools

The `tools` block tells the agent which GitHub APIs it can call. `mode: gh-proxy` routes all API calls through a controlled proxy that enforces only the scopes you declared in `permissions`.

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

**✏️ Try it:** Add `tools:` and save.

> [!TIP]
> Want to understand how `gh-proxy` scoping works? See [Side Quest: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md).

---

## Section 5 — Write guardrail

`safe-outputs` is the only place write actions are declared. `add-comment: max: 1` limits the agent to posting at most one issue comment per run — no other write actions are allowed.

```yaml
safe-outputs:
  add-comment:
    max: 1
---
```

**✏️ Try it:** Add `safe-outputs:` and the closing `---` fence, then save. The watcher should now show a valid (though bodyless) workflow.

---

## Section 6 — Agent instructions

Add the Markdown body **below** the closing `---`. This is the brief the AI agent reads and follows at runtime.

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

**✏️ Try it:** Paste the agent body and save. The watcher should confirm the full workflow is valid.

> [!TIP]
> Want tips on writing clearer agent prompts? See [Side Quest: Writing Better Prompts](side-quest-11-03-better-prompts.md).

---

## Commit and push

Once the watcher reports no errors:

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
- [Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md)
- [Schedule Expressions](side-quest-13-01-schedule-expressions.md)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
