# Side Quest: Frontmatter Deep Dive

> _Optional: a section-by-section walkthrough of every frontmatter key in a `gh-aw` workflow file. Work through this if you want to understand what each line does before building Step 11, then return to the main path._

An agentic workflow file is a Markdown document with two parts:

1. **Frontmatter** — a YAML block between `---` fences at the very top of the file. This is machine-readable configuration: triggers, permissions, tools, and output rules.
2. **Body** — plain Markdown below the second `---`. This is the AI agent's instruction set — what you want it to do and how you want it to behave.

---

## Section 1 — Opening fence and `description`

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
```

**What this section does:** Opens the YAML frontmatter and declares human-readable metadata.

| Field | Purpose |
|-------|---------|
| `---` | Signals the start of YAML frontmatter. The file parser reads everything until the next `---` as structured configuration. |
| `emoji` | A decorative label shown in the `gh aw` dashboard. Pick any emoji that fits. |
| `description` | A one-sentence summary of what this workflow does. It appears in the GitHub Actions UI and in `gh aw list`. |

---

## Section 2 — `on:` triggers

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

**What this section does:** Tells GitHub Actions _when_ to run this workflow.

| Field | Purpose |
|-------|---------|
| `on:` | The top-level YAML key that declares all triggers. Every GitHub Actions workflow must have this key. |
| `schedule: daily` | An agentic-workflow shorthand that expands to a cron expression running once per day at midnight UTC. You can also write `schedule: hourly` or `schedule: weekly`. |
| `workflow_dispatch: {}` | Adds a **Run workflow** button in the GitHub Actions UI so you can trigger it manually at any time. The `{}` means no custom inputs are required. |

> [!TIP]
> You can keep `workflow_dispatch` in the file even after you go to production. It lets you re-run the report on demand without changing the schedule.

---

## Section 3 — `permissions:`

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

**What this section does:** Declares exactly which GitHub API scopes this workflow is allowed to use. Keeping permissions minimal is a security best practice — if the workflow is ever misconfigured, it can't accidentally overwrite code or close issues.

| Field | Why it's needed |
|-------|----------------|
| `contents: read` | Lets the agent read files and commits in the repository. |
| `copilot-requests: write` | Recommended when using the Copilot coding agent engine so it can authenticate with `${{ github.token }}`. Not required for all agentic workflows. |
| `issues: read` | Lets the agent list and read open issues. The agent needs this to count issues and find the right one to post its report on. |
| `pull-requests: read` | Lets the agent list and read open pull requests. |
| `actions: read` | Lets the agent read recent workflow runs to report CI status. |

> [!NOTE]
> Notice there is no `issues: write` permission here. The workflow uses a `safe-outputs` block (explained below) to post comments — that mechanism handles write access in a controlled way without giving the agent free-write to all issues.

---

## Section 4 — `tools:`

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

**What this section does:** Configures which external tools the AI agent can call during its run.

| Field | Purpose |
|-------|---------|
| `tools:` | Parent key listing every tool integration the agent may use. |
| `github:` | Enables the GitHub MCP tool — a structured interface the agent uses to call GitHub APIs (list issues, list PRs, check CI runs, etc.). |
| `mode: gh-proxy` | Routes GitHub API calls through a secure proxy that enforces the `permissions` declared above. This prevents the agent from making calls beyond what you've allowed. |
| `toolsets: [default]` | Activates the standard set of GitHub tools (issues, PRs, commits, actions). You can add more toolsets later, for example `[default, discussions]`. |

---

## Section 5 — `safe-outputs:`

```yaml
safe-outputs:
  add-comment:
    max: 1
```

**What this section does:** Defines the _only_ write actions the agent is permitted to take. This is the safety guardrail that prevents the agent from doing anything you haven't explicitly approved.

| Field | Purpose |
|-------|---------|
| `safe-outputs:` | Parent key listing approved write operations. |
| `add-comment:` | Allows the agent to post a comment on an issue or pull request. |
| `max: 1` | Hard limit — the agent can post at most one comment per run. If the agent tries to post more than one, the extra posts are silently dropped. |

> [!IMPORTANT]
> **Why `safe-outputs` matters:** Without this block the agent cannot write anything, no matter what you ask it to do in the body. The YAML frontmatter is the source of truth for write access, not the prose instructions.

---

## Section 6 — Closing fence

```yaml
---
```

**What this section does:** Closes the YAML frontmatter. Everything below this line is the Markdown body — the agent's instructions.

---

## Section 7 — The Markdown body (agent instructions)

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

**What this section does:** This is the plain-English brief you hand to the AI agent. Think of it as a job description — the agent reads it at runtime and follows the instructions.

Key things to note:

- **Section headers** (`##`) are just for human readability. The agent treats the whole body as a single prompt.
- **Numbered lists** help the agent approach tasks in order. The agent follows structure you provide.
- **The output format template** pins the exact text the agent should generate, making the comment predictable and easy to read.
- **The guidelines** handle edge cases (already posted today, no open issues) so the agent doesn't have to guess.

---

## ✅ Checkpoint

- [ ] You can explain what each of the six frontmatter sections does
- [ ] You understand when `copilot-requests: write` is needed under `permissions`
- [ ] You understand why `safe-outputs` is the true source of write access
- [ ] You understand the difference between the frontmatter and the Markdown body

---

Return to [Step 11: Build: Daily Repo Status Workflow](11a-build-daily-status.md).
