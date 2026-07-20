---
journey: terminal
adventure: scenario-a
---
# Step 11a: Build the Daily Repo Status Workflow — Terminal Path

_You've designed the workflow on paper — now let's turn it into real, running YAML._

> [!TIP]
> <details>
> <summary><b>Two paths through this step:</b></summary>
>
> - **This page (manual build)** — write the file section by section so every line is clear.
> - **[Adventure A: Add Wizard](11a-build-daily-status-wizard.md)** — use `gh aw add-wizard` for a guided, interactive setup.
>
> Both paths produce the same workflow and converge at [Step 12](12-test-and-iterate.md). Prefer the browser? Switch to the [GitHub UI path](11a-build-daily-status-ui.md).
>
> </details>

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
gh aw compile --watch
```

Leave the watcher running throughout this step.

New to workflow file structure? See [Workflow File Structure at a Glance](side-quest-11-01b-workflow-structure.md).

---

## Section 1 — Metadata

Start with the opening fence and the two metadata keys. `emoji` is the visual label shown in `gh aw list`; `description` is the one-sentence summary displayed in the GitHub Actions UI.

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
```

**✏️ Try it:** Paste the block above into your file and save. Check that the watcher shows no errors. Feel free to swap the emoji or reword the description. (See [Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md) for a section-by-section walkthrough.)

---

## Section 2 — Triggers

Add the trigger block after the `description` line. `schedule: daily` is `gh-aw`'s shorthand that compiles to a once-per-day cron schedule. The compiler automatically adds a **Run workflow** button for any scheduled workflow; you may include `workflow_dispatch: {}` explicitly here for clarity, but it is not required.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

**✏️ Try it:** Add the `on:` block and save. The watcher should still report no errors. (See [Side Quest: Schedule Expressions](side-quest-13-01-schedule-expressions.md) for custom schedule options.)

---

## Section 3 — Permissions

Add the minimum permissions the workflow needs. `copilot-requests: write` is required by every agentic workflow; the remaining entries are read-only. Write access for issue comments is declared via `safe-outputs` in Section 5.

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

**✏️ Try it:** Add `permissions:` and save. Confirm the watcher is still green.

---

## Section 4 — Tools

The `tools` block enables GitHub API access. `mode: gh-proxy` routes all API calls through a controlled proxy that enforces only the scopes declared in `permissions` above (see [Side Quest: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md) for details).

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

**✏️ Try it:** Add `tools:` and save.

---

## Section 5 — Write guardrail

`safe-outputs` declares the only write action allowed: one issue comment per run. Any other write actions the agent attempts are blocked.

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

**✏️ Try it:** Paste the agent body and save. The watcher should confirm the full workflow is valid. (See [Side Quest: Writing Better Prompts](side-quest-11-03-better-prompts.md) for tips on clearer agent instructions.)

---

## Commit and push

Once the watcher reports no errors:

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: add daily repo status agentic workflow"
git push
```

> [!TIP]
> When you need to modify this workflow later, prefer using an agent with the `/agentic-workflows` skill or run `gh aw compile --watch` for continuous feedback as you edit. **Agents edit agents.**

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
<!-- journey: terminal -->
**Next:** [Step 11a2: Compile and Run the Daily Status Workflow](11a2-run-daily-status-terminal.md)
<!-- /journey -->

## ✅ Checkpoint

Before moving on, confirm all of the following:

- [ ] `.github/workflows/daily-status.md` exists in my repository
- [ ] The workflow file contains all five frontmatter sections: `emoji`/`description`, `on:`, `permissions:`, `tools:`, and `safe-outputs:`
- [ ] `gh aw compile` exits with no errors
- [ ] `git log --oneline -1` shows my commit `feat: add daily repo status agentic workflow`
- [ ] `git push` completed successfully and the file is visible on GitHub
