<!-- page-journey: terminal -->
<!-- page-adventure: scenario-b -->
# Build the Daily Documentation Updater — Terminal Path

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write the complete `daily-docs.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every section of the file so nothing is mysterious. By the end you'll have a working workflow ready to run.

## 📋 Before You Start

- You've completed [Design — Daily Documentation Updater](10b-design-daily-docs.md)
- Your terminal is inside your practice repository
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

> [!NOTE]
> Want to work in the browser? Switch to the [GitHub UI path](11b-build-daily-docs-ui.md).

---

## The Workflow File at a Glance

An agentic workflow file has two parts: **frontmatter** (YAML between `---` fences) and a **Markdown body** (the agent's instructions below the closing `---`). The table below summarises the frontmatter sections you'll build in this step.

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels shown in the `gh aw` dashboard and Actions UI. |
| Triggers | `on:` | `schedule: daily` for the automated run plus `workflow_dispatch` for manual testing. |
| Permissions | `permissions:` | Minimum scopes needed — read-only for repo content and issues. |
| Tools | `tools:` | Enables the GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | One issue comment per run — the only write action allowed. |

---

## Putting It All Together

### Create the workflow file

```bash
mkdir -p .github/workflows
```

Then open your editor and create `.github/workflows/daily-docs.md`.

Build the file section by section and compile after each one to catch YAML errors early. After saving each section, run `gh aw compile` to validate — or keep `gh aw compile --watch` running in a second terminal for continuous feedback.

### Add the frontmatter basics

```yaml
---
emoji: 📚 # Workflow icon
description: Post a daily documentation health report as a GitHub issue comment. # Workflow summary
---
```

### Add the trigger block

```yaml
on: # Run triggers
  schedule: daily # Daily run
  workflow_dispatch: {} # Manual run button
```

### Add the permissions block

This workflow only reads files and issues — it never writes to code. Keeping permissions narrow limits what the agent can do if the task brief is ever misconfigured.

```yaml
permissions: # Required GitHub scopes
  contents: read # Read files in the repo
  copilot-requests: write # Call Copilot APIs
  issues: read # Read issues
```

> [!NOTE]
> `copilot-requests: write` is required for every agentic workflow — it allows the runner to call the Copilot AI API. The other permissions here are read-only. The only write action is the issue comment, which is gated by the `safe-outputs` guardrail below.

### Add tools and output guardrails

```yaml
tools: # Tool access
  github: # GitHub MCP
    mode: gh-proxy # Use scoped proxy
    toolsets: [default] # Default toolset

safe-outputs: # Write guardrails
  add-comment: # Allow comments
    max: 1 # One comment max
```

### Add the agent instructions

Finally, add the Markdown body below the closing `---`. This is the brief the AI agent follows at runtime.

```markdown
# Daily Documentation Health Report

You are an AI assistant that monitors this repository's documentation and posts a concise daily health report.

## Your Task

Collect and summarise:
1. **Documentation files** — list all Markdown files in `docs/` and the root `README.md`
2. **Staleness** — for each file, find the date of the most recent commit that touched it; flag files not updated in the last 30 days
3. **Thin pages** — flag files that appear to have fewer than 200 words of content
4. **Broken internal links** — identify any links between documentation files that point to a file that does not exist

## Output Format

Find the issue titled "Daily Docs Health" and post a comment in this format:

```
📚 Docs Health Report — {today's date}
═══════════════════════════════════
📄 Files scanned:          {count}
⏳ Stale (>30 days):       {count} ({list of filenames, or "none"})
🚧 Thin pages (<200 words): {count} ({list of filenames, or "none"})
🔗 Broken internal links:  {count} ({list of filenames and anchors, or "none"})

{One or two sentences of overall health. Highlight the single highest-priority item.}
```

## Guidelines

- Post only one comment per calendar day. If today's report already exists, stop.
- Never edit or commit changes to any file — read only.
- Write "unknown" for any field where data is unavailable.
```

---

> [!TIP]
> This step has you assemble the workflow manually so you can see how the file is structured. After you understand the format, prefer modifying [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) through an agent using the `/agentic-workflows` skill instead of changing workflow files by hand. **Agents edit agents.**

### Commit and push

```bash
git add .github/workflows/daily-docs.md
git commit -m "feat: add daily documentation updater agentic workflow"
git push
```

---

## Complete Workflow (Copy-Paste Version)

<details>
<summary>Complete workflow file (reference copy)</summary>

```markdown
---
emoji: 📚
description: Post a daily documentation health report as a GitHub issue comment.

on:
  schedule: daily
  workflow_dispatch: {}

permissions:
  contents: read
  copilot-requests: write
  issues: read

tools:
  github:
    mode: gh-proxy
    toolsets: [default]

safe-outputs:
  add-comment:
    max: 1
---

# Daily Documentation Health Report

You are an AI assistant that monitors this repository's documentation and posts a concise daily health report.

## Your Task

Collect and summarise:
1. **Documentation files** — list all Markdown files in `docs/` and the root `README.md`
2. **Staleness** — for each file, find the date of the most recent commit that touched it; flag files not updated in the last 30 days
3. **Thin pages** — flag files that appear to have fewer than 200 words of content
4. **Broken internal links** — identify any links between documentation files that point to a file that does not exist

## Output Format

Find the issue titled "Daily Docs Health" and post a comment in this format:

```
📚 Docs Health Report — {today's date}
═══════════════════════════════════
📄 Files scanned:          {count}
⏳ Stale (>30 days):       {count} ({list of filenames, or "none"})
🚧 Thin pages (<200 words): {count} ({list of filenames, or "none"})
🔗 Broken internal links:  {count} ({list of filenames and anchors, or "none"})

{One or two sentences of overall health. Highlight the single highest-priority item.}
```

## Guidelines

- Post only one comment per calendar day. If today's report already exists, stop.
- Never edit or commit changes to any file — read only.
- Write "unknown" for any field where data is unavailable.
```

</details>

## ✅ Checkpoint

- [ ] `.github/workflows/daily-docs.md` exists in your repository
- [ ] `gh aw compile` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

**Previous:** [Design — Daily Documentation Updater](10b-design-daily-docs.md)
<!-- journey: terminal -->
**Next:** [Test and Improve Your Workflow](12-test-and-iterate.md)
<!-- /journey -->


