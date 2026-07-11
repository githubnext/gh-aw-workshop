# Step 11: Build: Daily Repo Status Workflow

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write the complete `daily-status.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every line of the file so nothing is mysterious. By the end you'll have a working workflow ready to run.

## 📋 Before You Start

- You've completed [Step 10: Design: Your Daily Repo Status Report](10-design-daily-status.md)
- Your terminal is inside `my-agentic-workflows`
- `gh aw` is installed and authenticated (from Step 6)

---

## The Workflow File, Explained Line by Line

An agentic workflow file is a Markdown document with two parts:

1. **Frontmatter** — a YAML block between `---` fences at the very top of the file. This is machine-readable configuration: triggers, permissions, tools, and output rules.
2. **Body** — plain Markdown below the second `---`. This is the AI agent's instruction set — what you want it to do and how you want it to behave.

Let's build each section together.

---

### Section 1 — Opening fence and `description`

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

### Section 2 — `on:` triggers

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

### Section 3 — `permissions:`

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
| `copilot-requests: write` | Grants the agentic runtime permission to make AI calls on behalf of this workflow. **Required for any agentic workflow.** |
| `issues: read` | Lets the agent list and read open issues. The agent needs this to count issues and find the right one to post its report on. |
| `pull-requests: read` | Lets the agent list and read open pull requests. |
| `actions: read` | Lets the agent read recent workflow runs to report CI status. |

> [!NOTE]
> Notice there is no `issues: write` permission here. The workflow uses a `safe-outputs` block (explained below) to post comments — that mechanism handles write access in a controlled way without giving the agent free-write to all issues.

---

### Section 4 — `tools:`

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

### Section 5 — `safe-outputs:`

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

### Section 6 — Closing fence

```yaml
---
```

**What this section does:** Closes the YAML frontmatter. Everything below this line is the Markdown body — the agent's instructions.

---

### Section 7 — The Markdown body (agent instructions)

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

## Putting It All Together

Here's how to create the file:

```bash
mkdir -p .github/workflows
```

Then open your editor and create `.github/workflows/daily-status.md`.

### Build pass 1: frontmatter only

Copy Sections 1-6 from above so the file contains only the YAML frontmatter (`---` through closing `---`).

Compile to verify the YAML structure before adding the body:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

You should see `✅ Compiled successfully`. If you see errors, check the [Common Mistakes](#common-mistakes) section below.

### Build pass 2: add the Markdown body

Now append Section 7 (`# Daily Repo Status Report` and the instructions) below the closing `---`.

Compile again:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

If you prefer to paste everything at once, use the complete copy-paste block in the collapsible section below.

Commit and push:

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: add daily repo status agentic workflow"
git push
```

---

## Common Mistakes

YAML is unforgiving. Here are the five errors students hit most often:

### 1. Tabs instead of spaces

YAML does not allow tab characters for indentation. Every level of nesting must use **two spaces**.

```yaml
# ❌ Wrong — the line below "on:" is indented with a tab character,
#    not spaces. The tab is invisible in most editors, which makes
#    this bug hard to spot. YAML will reject it with a parse error.
on:
  schedule: daily  # <-- replace the leading whitespace with 2 spaces, not a tab

# ✅ Correct — uses exactly two spaces
on:
  schedule: daily
```

Most editors insert tabs by default for `.md` files. Check your editor's settings and switch indentation to **Spaces** with a size of **2**.

### 2. Missing quotes around strings that contain special characters

YAML treats certain characters (`:`, `#`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `?`, `|`, `>`, `!`, `'`, `"`) as syntax when they appear unquoted in values.

```yaml
# ❌ Wrong — the colon in the description breaks YAML parsing
description: Post a report: daily

# ✅ Correct — wrap the value in double quotes
description: "Post a report: daily"
```

### 3. Wrong indentation level for nested keys

YAML nesting is strictly positional. A key one level deeper must be indented exactly two more spaces than its parent.

```yaml
# ❌ Wrong — "mode" is at the same level as "github"
tools:
  github:
  mode: gh-proxy
  toolsets: [default]

# ✅ Correct — "mode" is indented under "github"
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

### 4. Forgetting the closing `---`

The frontmatter must have both an opening and a closing `---` fence. If you omit the closing fence, the entire file is treated as YAML and the agent body is lost.

```
# ❌ Wrong — no closing fence
---
emoji: 📊
description: ...
on:
  schedule: daily

# Daily Repo Status Report
You are an AI assistant...
```

```
# ✅ Correct — closing fence separates frontmatter from body
---
emoji: 📊
description: ...
on:
  schedule: daily
---

# Daily Repo Status Report
You are an AI assistant...
```

### 5. `copilot-requests: write` not listed under `permissions`

This is the single most common reason a workflow compiles but produces no output. The agent can't make AI calls without this permission.

```yaml
# ❌ Wrong — missing copilot-requests
permissions:
  contents: read
  issues: read

# ✅ Correct
permissions:
  contents: read
  copilot-requests: write
  issues: read
```

---

## Complete Workflow (Copy-Paste Version)

Use this block to copy the full, unannotated workflow into your editor:

<details>
<summary>Click to expand — <code>.github/workflows/daily-status.md</code></summary>

```markdown
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
safe-outputs:
  add-comment:
    max: 1
---

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

</details>

---

## ✅ Checkpoint

- [ ] `.github/workflows/daily-status.md` exists in your repository
- [ ] `gh aw compile .github/workflows/daily-status.md --validate` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

**Previous:** [Step 10: Design: Your Daily Repo Status Report](10-design-daily-status.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)
