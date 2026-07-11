# Step 11: Build: Daily Repo Status Workflow

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write the complete `daily-status.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every line of the file so nothing is mysterious. By the end you'll have a working workflow ready to run.

## 📋 Before You Start

- You've completed [Step 10: Design: Your Daily Repo Status Report](10-design-daily-status.md)
- Your terminal is inside `my-agentic-workflows`
- `gh aw` is installed and authenticated (from Step 6)

---

## The Workflow File at a Glance

An agentic workflow file has two parts: **frontmatter** (YAML between `---` fences) and a **Markdown body** (the agent's instructions below the closing `---`). The table below summarizes the five frontmatter sections you'll build in this step.

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels shown in the `gh aw` dashboard and Actions UI. |
| Triggers | `on:` | Tells GitHub Actions when to run — `schedule: daily` plus a manual `workflow_dispatch` button. |
| Permissions | `permissions:` | Declares the minimum GitHub API scopes the workflow may use. |
| Tools | `tools:` | Enables the GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | The only write actions the agent may take — here, one issue comment per run. |

> [!NOTE]
> Reminder: if you're confused about why this file ends in `.md` instead of `.yml`, see the [Classic vs. Agentic comparison table in Step 5](05-agentic-workflows-intro.md#side-by-side-classic-actions-vs-agentic-workflows).

Before diving in, there is an optional side quest if you want more detail first:

> [!TIP]
> **Optional Side Quest:** Want a section-by-section explanation of every key with tables and examples before you build? See [Side Quest: Frontmatter Deep Dive](side-quest-frontmatter-deep-dive.md). It's fully optional — everything you need to complete this step is in the build sections below.

---

## Putting It All Together

Here's how to create the file:

**Terminal:**

```bash
mkdir -p .github/workflows
```

Then open your editor and create `.github/workflows/daily-status.md` (the filename should be exactly `daily-status.md`; agentic workflows in this workshop use Markdown files, not `.yml`).

<details>
<summary>🖥️ GitHub UI alternative — create the file in your browser</summary>

1. In your repository on GitHub, click **Add file** → **Create new file**.
2. In the filename box, type: `.github/workflows/daily-status.md`
3. Paste the complete workflow content from the **Complete Workflow (Copy-Paste Version)** section below directly into the editor.
4. Click **Commit new file**.

> [!NOTE]
> The `gh aw compile --validate` checkpoints below require a terminal or Codespace. UI path users can skip them — GitHub Actions will surface any errors when the workflow first runs. If you want early validation, open the repository in a Codespace later and run `gh aw compile .github/workflows/daily-status.md --validate`.

</details>

Instead of pasting one giant block, build the file in small sections and compile after each one. That makes YAML mistakes much easier to spot.

### Build section 1: frontmatter basics

Start with the opening fence and the two metadata keys. `emoji` is just a visual label in workflow lists, while `description` is the plain-English summary that shows people what this workflow does before they open it.

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
---
```

Compile after saving:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

### Build section 2: trigger block

Now add the trigger block after the `description` line and before the closing `---`. `workflow_dispatch` gives you a manual **Run workflow** button, and `schedule: daily` is the source-format shorthand for a cron-style daily schedule — in plain English, "run this once every day around midnight UTC."

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

Compile again:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

### Build section 3: permissions block

Next add the minimum permissions the workflow needs. This workflow only needs to read repository state and make AI requests; keeping permissions narrow reduces the blast radius if you misconfigure the prompt later.

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

Compile again:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

### Build section 4: tools and output guardrails

Add the tool configuration and the `safe-outputs` guardrail next. The `tools` block tells the agent how to talk to GitHub, and `safe-outputs` limits the workflow to posting a single comment instead of giving it broad write access.

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]

safe-outputs:
  add-comment:
    max: 1
```

Compile again:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

### Build section 5: agent instructions block

Finally, add the Markdown body below the closing `---`. This is the brief the AI agent follows at runtime: what signals to collect, how to format the report, and which edge cases to handle so the output stays predictable.

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

Compile one more time:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

## Common Mistakes

YAML is unforgiving. The most frequent pitfalls are tabs instead of spaces, missing quotes around values with special characters, wrong indentation for nested keys, a missing closing `---` fence, and forgetting `copilot-requests: write` in `permissions`.

> [!NOTE]
> If you hit a compile error, the optional **[Side Quest: YAML Frontmatter Pitfalls](side-quest-yaml-frontmatter.md)** walks through each of these mistakes with broken ❌ and correct ✅ examples.
> **Optional Side Quest:** Want to get better AI output from your task brief? See **[Side Quest: Write Better AI Task Briefs](side-quest-better-prompts.md)** for five prompt-engineering techniques you can apply right now.

---

> [!TIP]
> This step has you assemble the workflow manually so you can see how the file is structured. After you understand the format, prefer modifying agentic workflows through an agent using the `/agentic-workflows` skill instead of changing workflow files by hand. **Agents edit agents.**

If you prefer to paste everything at once, use the complete copy-paste block in the **Complete Workflow (Copy-Paste Version)** section below.

Commit and push:

**Terminal:**

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: add daily repo status agentic workflow"
git push
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

If you created the file via the GitHub UI, it was already committed when you clicked **Commit new file**. No additional push is needed.

</details>

---

## Complete Workflow (Copy-Paste Version)

### How it works

This workflow makes four practical decisions so it stays reliable and easy to debug:

- It uses a short, task-focused prompt so the agent gathers only the repo signals you care about (PRs, issues, CI, and last commit).
- `permissions` are explicitly scoped so the agent can read repository state and write exactly one issue comment, but nothing broader.
- The `tools` block routes GitHub access through `gh-proxy` with the default toolset, matching workshop conventions.
- The output format is fixed, so each daily report is consistent and easy to scan over time.

The guidelines then cover edge cases (already posted today, no existing issue) so the agent does not guess.

Use this block to copy the full workflow into your editor. Inline comments explain key sections in both the frontmatter and the instruction body:

<details>
<summary>Line-by-line walkthrough</summary>

````markdown
---
# 1) Workshop metadata used by the simulator and workflow listings
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.

# 2) Triggers: run on schedule and allow manual runs for testing
on:
  schedule: daily
  workflow_dispatch: {}

# 3) Least-privilege access needed to read signals and post one report
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read

# 4) Tooling setup: use GitHub tools via gh-proxy
tools:
  github:
    mode: gh-proxy
    toolsets: [default]

# 5) Guardrail: limit side effects to a single comment
safe-outputs:
  add-comment:
    max: 1
---

<!-- 6) Title shown to humans reading the prompt and to the model at runtime -->
# Daily Repo Status Report

<!-- 7) One-sentence role framing so the agent keeps the right scope -->
You are an AI assistant that monitors this repository and posts a concise daily health report.

<!-- 8) Task section: tells the agent exactly what signals to collect -->
## Your Task

Collect and summarize:
1. **Open pull requests** — count, and flag any open longer than 7 days
2. **Open issues** — total count, how many are labeled "bug"
3. **CI status** — result of the most recent workflow run on the default branch
4. **Last commit** — message and time since it was pushed

<!-- 9) Output contract: keeps reports consistent and easy to scan -->
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

<!-- 10) Guardrails for behavior in common edge cases -->
## Guidelines

- Post only one comment. If you have already posted today, skip.
- Keep the report factual. Do not invent numbers.
- If no open issue exists, create one titled "Daily Status Reports" and post the first comment there.
````

</details>

---

## ✅ Checkpoint

- [ ] `.github/workflows/daily-status.md` exists in your repository
- [ ] `gh aw compile .github/workflows/daily-status.md --validate` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

**Previous:** [Step 10: Design: Your Daily Repo Status Report](10-design-daily-status.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)
