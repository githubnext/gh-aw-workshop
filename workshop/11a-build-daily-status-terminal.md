# Step 11a: Build the Daily Repo Status Workflow — Terminal Path

> _You've designed the workflow on paper — now let's turn it into real, running YAML._
>
> [!TIP]
> **Two paths through this step:**
> - **This page (manual build)** — write the file section by section so every line is clear.
> - **[Adventure A: Add Wizard](11a-build-daily-status-wizard.md)** — use `gh aw add-wizard` for a guided, interactive setup that handles engine selection, secrets, and the pull request for you.
>
> Both paths produce the same workflow and converge at [Step 12](12-test-and-iterate.md).

> [!NOTE]
> Want to work in the browser? Switch to the [GitHub UI path](11a-build-daily-status-ui.md).

## 🎯 What You'll Do

You'll write the complete `daily-status.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every line of the file so nothing is mysterious. By the end you'll have a working workflow ready to run.

## 📋 Before You Start

- You've completed [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- Your terminal is inside `my-agentic-workflows`
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

## What a compile error looks like

If `gh aw compile` throws a YAML parse error, start by checking indentation in the section you just edited — nested keys under `on:` are a common culprit. Want broken/fixed examples plus a quick-fix table? See [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

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
> Reminder: if you're confused about why this file ends in `.md` instead of `.yml`, see the [Classic vs. Agentic comparison table in Step 5](05-agentic-workflows-intro.md#classic-actions-vs-agentic-workflows).

Before diving in, there are optional side quests if you want more detail first:

> [!TIP]
> **Optional side quests — read before you build if you want deeper context:**
> - **[Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)** — section-by-section walkthrough of every frontmatter key with tables and examples.
> - **[Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md)** — the five most common YAML mistakes with broken ❌ and correct ✅ examples. Bookmark this as a quick reference card while you build.

<details>
<summary>📋 Annotated YAML reference — expand for a line-by-line explanation of every frontmatter key</summary>

```yaml
---
emoji: 📊                      # Decorative icon shown in the gh aw dashboard and Actions UI.
                               # Any emoji works — choose one that reflects the workflow's purpose.
description: Post a daily repository status summary as a GitHub issue comment.
                               # One-sentence summary shown in gh aw list and the GitHub Actions UI.

on:                            # Trigger block — controls when GitHub Actions starts this workflow.
  schedule: daily              # gh-aw shorthand that compiles to cron "0 0 * * *" (midnight UTC).
                               # Also valid: "hourly", "weekly".
  workflow_dispatch: {}        # Adds a manual "Run workflow" button in the Actions UI.
                               # The "{}" means no custom inputs are needed to trigger it.

permissions:                   # Declares the minimum GitHub API scopes this workflow may use.
                               # Only list what the agent actually needs — keep the blast radius small.
  contents: read               # Read access to files, commits, and branches.
  copilot-requests: write      # REQUIRED for every agentic workflow — grants the Actions runner
                               # permission to call the Copilot AI API on your behalf.
  issues: read                 # Read open issues (used to count them and find the target thread).
  pull-requests: read          # Read open pull requests (used to report PR count and age).
  actions: read                # Read recent workflow runs (used to report CI status).

tools:                         # Configures which external tools the AI agent can call at runtime.
  github:                      # Enables the GitHub MCP (Model Context Protocol) integration.
    mode: gh-proxy             # Routes all GitHub API calls through a controlled proxy that
                               # enforces the scopes declared in "permissions" above.
                               # The agent cannot exceed what those scopes allow.
    toolsets: [default]        # Activates the standard GitHub toolset: issues, PRs, commits,
                               # and actions. Add more toolsets later if the workflow needs them.

safe-outputs:                  # Write guardrails — the ONLY write actions the agent may take.
                               # Without this block the agent cannot write anything, regardless
                               # of what the Markdown body asks it to do.
  add-comment:                 # Permits the agent to post a comment on an issue or pull request.
    max: 1                     # Hard limit: the agent may post at most one comment per run.
                               # Extra posts are silently dropped.
---
```

</details>

## Quick Start: Copy-and-Run

> [!TIP]
> **In a hurry?** Paste the minimal workflow below, compile it to confirm your setup is valid, then jump to [Step 12: Test and Improve](12-test-and-iterate.md). Come back here anytime to learn what each line does.

<details>
<summary>⚡ Minimal working workflow — copy, paste, and compile before customizing</summary>

Create `.github/workflows/daily-status.md` and paste the content below exactly as shown:

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

You are an AI assistant. Collect the count of open pull requests, open issues, the most recent CI run status, and the last commit message, then post one formatted summary comment on the most recently updated open issue.
```

Then validate:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

A green ✔ means the file is valid. Commit and push, then proceed to [Step 12](12-test-and-iterate.md).

</details>

<details>
<summary>⚠️ Common YAML mistakes — expand if <code>gh aw compile</code> fails</summary>

- **Wrong indentation** — YAML requires exactly two spaces per nesting level; tabs are not valid.
- **Missing `---` fences** — the frontmatter must be wrapped by an opening `---` and a closing `---`; omitting either causes a parse error.
- **Unquoted special characters** — values that contain `:`, `#`, or `{` must be wrapped in double quotes, for example `description: "Post a report: daily"`.

For broken ❌ and correct ✅ examples of each, see [Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md).

</details>

---

## Putting It All Together

### Create the workflow file

```bash
mkdir -p .github/workflows
```

Then open your editor and create `.github/workflows/daily-status.md` (the filename should be exactly `daily-status.md`; agentic workflows in this workshop use Markdown files, not `.yml`).

Build the file in small sections and compile after each one to catch YAML errors early. After saving each section, run `gh aw compile .github/workflows/daily-status.md` to validate — or keep `gh aw compile .github/workflows/daily-status.md --watch` running in a second terminal for continuous feedback.

### Add the frontmatter basics

Start with the opening fence and the two metadata keys. `emoji` is just a visual label in workflow lists, while `description` is the plain-English summary that shows people what this workflow does before they open it.

```yaml
---
emoji: 📊 # Workflow icon
description: Post a daily repository status summary as a GitHub issue comment. # Workflow summary
---
```

> [!NOTE]
> The `emoji` and `description` fields are metadata only — they appear in the `gh aw` dashboard and the Actions UI to help you identify the workflow at a glance. They have no effect on how the agent runs.

### Add the trigger block

Now add the trigger block after the `description` line and before the closing `---`. `workflow_dispatch` gives you a manual **Run workflow** button, and `schedule: daily` is the source-format shorthand for a cron-style daily schedule — in plain English, "run this once every day around midnight UTC."

```yaml
on: # Run triggers
  schedule: daily # Daily run
  workflow_dispatch: {} # Manual run button
```

> [!NOTE]
> `schedule: daily` is `gh-aw`'s plain-English shorthand for a daily cron schedule — it compiles to `0 0 * * *`, triggering the agent once every day around midnight UTC.
> `workflow_dispatch: {}` adds a manual **Run workflow** button in the Actions UI so you can test on demand without waiting for the next scheduled run.

### Add the permissions block

Next add the minimum permissions the workflow needs. This workflow only needs to read repository state and make AI requests; keeping permissions narrow reduces the blast radius if you misconfigure the prompt later.

```yaml
permissions: # Required GitHub scopes
  contents: read # Read repo
  copilot-requests: write # Call Copilot APIs
  issues: read # Read issues
  pull-requests: read # Read pull requests
  actions: read # Read workflow runs
```

> [!NOTE]
> `copilot-requests: write` is the permission that allows the Actions runner to call the Copilot AI API on your behalf — it is required for any agentic workflow. Every other permission here is read-only, which means the workflow can observe repository state but cannot modify it. The only write action is gated behind the `safe-outputs` guardrail configured in the next section.

### Add tools and output guardrails

Add the tool configuration and the `safe-outputs` guardrail next. The `tools` block tells the agent how to talk to GitHub, and `safe-outputs` limits the workflow to posting a single comment instead of giving it broad write access.

```yaml
tools: # Tool access
  github: # GitHub MCP
    mode: gh-proxy # Use scoped proxy
    toolsets: [default] # Default toolset

safe-outputs: # Write guardrails
  add-comment: # Allow comments
    max: 1 # One comment max
```

> [!NOTE]
> `mode: gh-proxy` routes all GitHub API calls through a controlled proxy rather than giving the agent a raw token — the proxy enforces that only the scopes declared in `permissions` are used. `safe-outputs.add-comment: max: 1` is the write guardrail: the agent is permitted to post at most one issue comment per run and nothing else, no matter what the task brief says.

### Add the agent instructions

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

### Final validation

With all five sections in place, run a full compile-and-validate to confirm the complete workflow file is error-free before committing:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

A successful run produces green output and writes a `.lock.yml` file next to your workflow file. That lock file is what GitHub Actions actually executes.

If you see a red error, the message names the key and the line that failed. Compare it against the relevant build section above and check indentation — two-space indentation is required throughout.

> [!TIP]
> If the error message isn't clear, **[Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md)** shows broken ❌ and correct ✅ examples for the five most common mistakes.

## Troubleshooting

| Common issue | What you see | How to fix it |
|---------|--------------|---------------|
| Wrong indentation under nested keys | `gh aw compile` fails with a YAML parse error near `permissions`, `tools`, or `safe-outputs` | Use spaces only (no tabs), and indent child keys by exactly two spaces. |
| Missing `permissions:` key or missing `copilot-requests: write` | Compile succeeds but runtime fails when the workflow tries to call Copilot APIs | Add the full `permissions:` block shown in this step, including `copilot-requests: write`. |
| Incorrect `on:` trigger block | The daily run does not trigger, or the manual **Run workflow** button is missing | Set `on.schedule: daily` and `on.workflow_dispatch: {}` exactly as shown. |

> [!NOTE]
> If you hit a compile error, the optional **[Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md)** walks through each of these mistakes with broken ❌ and correct ✅ examples.
> **Optional Side Quest:** Want to get better AI output from your task brief? See **[Side Quest: Write Better AI Task Briefs](side-quest-11-03-better-prompts.md)** for five prompt-engineering techniques you can apply right now.

---

> [!TIP]
> This step has you assemble the workflow manually so you can see how the file is structured. After you understand the format, prefer modifying [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) through an agent using the `/agentic-workflows` skill instead of changing workflow files by hand. **Agents edit agents.**

If you prefer to paste everything at once, use the complete copy-paste block in the **Complete Workflow (Copy-Paste Version)** section below.

### Commit and push

```bash
git add .github/workflows/daily-status.md
git commit -m "feat: add daily repo status agentic workflow"
git push
```

---

## Complete Workflow (Copy-Paste Version)

If you prefer to paste the complete workflow at once rather than building it section by section, expand the reference copy below.

> [!TIP]
> **Optional Side Quest:** Want to understand the reasoning behind each design choice — why permissions are scoped the way they are, what `gh-proxy` actually prevents, and why the output format is fixed? See [Side Quest: Reading an Annotated Agentic Workflow](side-quest-11-04-annotated-workflow.md) for a fully annotated walkthrough before adapting this workflow.

<details>
<summary>Complete workflow file (reference copy)</summary>

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

## ✅ Checkpoint

- [ ] `.github/workflows/daily-status.md` exists in your repository
- [ ] `gh aw compile .github/workflows/daily-status.md` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

Want to use a different AI engine? These side quests walk you through switching from Copilot to Claude or Codex:

- ➡️ [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md) — use `engine: claude`
- ➡️ [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md) — use `engine: codex`

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
