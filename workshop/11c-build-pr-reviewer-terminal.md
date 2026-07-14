# Step 11c: Build the PR Code Reviewer — Terminal Path

> _You've designed the workflow on paper — now let's turn it into real, running YAML._

## 🎯 What You'll Do

You'll write the complete `pr-code-reviewer.md` agentic workflow file, placing it in `.github/workflows/`. This step walks through every section of the file so nothing is mysterious. By the end you'll have a working workflow that triggers on every [pull request](https://github.github.com/gh-aw/reference/triggers/).

## 📋 Before You Start

- You've completed [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
- Your terminal is inside your practice repository
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

> [!NOTE]
> Want to work in the browser? Switch to the [GitHub UI path](11c-build-pr-reviewer-ui.md).

---

## What's Different About This Workflow?

The daily-status and daily-docs workflows run on a schedule (`on: schedule: daily`). The PR code reviewer runs on a **pull request event** — it fires automatically when someone opens or updates a PR.

This changes two things:

| | Daily workflows | PR code reviewer |
|---|---|---|
| **Trigger** | `on: schedule: daily` | `on: pull_request: {}` |
| **Safe output** | `add-comment` (issue comment) | `add-comment` (PR comment) |

> [!TIP]
> Want a fuller primer on choosing between `pull_request`, `push`, `issues`, and `schedule`? Take [Side Quest: Event-Driven Triggers in Agentic Workflows](side-quest-11-05-event-triggers.md) before you build.

---

## The Workflow File at a Glance

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels in the Actions UI and `gh aw` dashboard. |
| Triggers | `on:` | Fires on `pull_request` events (open and update), plus a manual button. |
| Permissions | `permissions:` | Read repo contents; write PR review comments. |
| Tools | `tools:` | GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | Up to five PR review comments per run. |

---

## Putting It All Together

### Create the workflow file

```bash
mkdir -p .github/workflows
```

Then open your editor and create `.github/workflows/pr-code-reviewer.md`.

Build the file section by section and compile after each one to catch YAML errors early. After saving each section, run `gh aw compile .github/workflows/pr-code-reviewer.md` to validate — or keep `gh aw compile .github/workflows/pr-code-reviewer.md --watch` running in a second terminal for continuous feedback.

### Add the frontmatter basics

```yaml
---
emoji: 🔍 # Workflow icon
description: Review pull requests for duplicate code and post a structured review comment. # Workflow summary
---
```

### Add the trigger block

```yaml
on: # Run triggers
  pull_request: {} # Fires on PR open and update
  workflow_dispatch: {} # Manual run button for testing
```

> [!NOTE]
> `pull_request: {}` triggers the workflow whenever a pull request is opened, synchronized (new commits pushed), or reopened. The `workflow_dispatch: {}` button lets you trigger a manual run from the Actions UI — handy for testing the workflow without opening a real PR.
>

### Add the permissions block

This workflow needs to read the repository contents and write a review comment on the PR. That's the minimum required set of scopes.

```yaml
permissions: # Required GitHub scopes
  contents: read # Read repo files for comparison
  copilot-requests: write # Call Copilot APIs
  pull-requests: write # Post review comments on the PR
```

> [!NOTE]
> `pull-requests: write` is needed to post a review comment on the PR. Unlike the daily-status workflow, there is no `issues` permission here because this workflow only interacts with pull requests.
>

### Add tools and output guardrails

```yaml
tools: # Tool access
  github: # GitHub MCP
    mode: gh-proxy # Use scoped proxy
    toolsets: [default] # Default toolset

safe-outputs: # Write guardrails
  add-comment: # Allow PR comments
    max: 5 # Up to five comments per run
```

> [!NOTE]
> `safe-outputs.add-comment: max: 5` limits the agent to at most five PR comments per run. This prevents the agent from flooding a large PR with dozens of low-value findings. If the agent finds more than five issues, the task brief instructs it to list only the top five.
>

### Add the agent instructions

Finally, add the Markdown body below the closing `---`.

```markdown
# PR Code Review: Duplicate Code Detection

You are an AI code reviewer. When a pull request is opened or updated, check the changed files for duplicate code patterns — both within the PR diff and against the existing codebase.

## Your Task

1. **List changed files** — get the list of files modified in this pull request
2. **Read the diff** — retrieve the added and modified lines for each changed file
3. **Sample the codebase** — read existing source files in the same directories as the changed files (up to ten files per directory) to use as a comparison baseline
4. **Identify duplicates** — look for blocks of five or more lines in the diff that appear with minor variations elsewhere in the changed files or in the sampled existing files

## Output Format

Post a PR review comment with this structure:

```
🔍 Duplicate Code Review
════════════════════════
Files reviewed: {count changed files} changed, {count existing files} sampled
Findings: {count}

{For each finding, up to five:}
📋 **Possible duplicate** in `{file}` (lines {start}–{end})
   Similar to: `{other file or location}`
   Suggestion: {one sentence — e.g. extract to a shared helper, or confirm intentional copy}

{If no findings:}
✅ No significant code duplication detected in this PR.
```

## Guidelines

- Post at most five findings. If there are more, add a note: "Additional findings omitted — showing top 5 by similarity."
- Do not approve or request changes on the PR — only add a comment.
- Do not flag: comments, blank lines, import/require statements, licence headers, or boilerplate (e.g. `package main`, `if __name__ == "__main__"`).
- If the PR touches only documentation, configuration, or lock files, reply: "No source code changes to review."
- Keep each finding description under 50 words.
```

---

> [!TIP]
> This step has you assemble the workflow manually so you can see how the file is structured. After you understand the format, prefer modifying agentic workflows through an agent using the `/agentic-workflows` skill instead of changing workflow files by hand. **Agents edit agents.**

### Commit and push

```bash
git add .github/workflows/pr-code-reviewer.md
git commit -m "feat: add pr code reviewer agentic workflow"
git push
```

---

## Complete Workflow (Copy-Paste Version)

<details>
<summary>Complete workflow file (reference copy)</summary>

```markdown
---
emoji: 🔍
description: Review pull requests for duplicate code and post a structured review comment.

on:
  pull_request: {}
  workflow_dispatch: {}

permissions:
  contents: read
  copilot-requests: write
  pull-requests: write

tools:
  github:
    mode: gh-proxy
    toolsets: [default]

safe-outputs:
  add-comment:
    max: 5
---

# PR Code Review: Duplicate Code Detection

You are an AI code reviewer. When a pull request is opened or updated, check the changed files for duplicate code patterns — both within the PR diff and against the existing codebase.

## Your Task

1. **List changed files** — get the list of files modified in this pull request
2. **Read the diff** — retrieve the added and modified lines for each changed file
3. **Sample the codebase** — read existing source files in the same directories as the changed files (up to ten files per directory) to use as a comparison baseline
4. **Identify duplicates** — look for blocks of five or more lines in the diff that appear with minor variations elsewhere in the changed files or in the sampled existing files

## Output Format

Post a PR review comment with this structure:

```
🔍 Duplicate Code Review
════════════════════════
Files reviewed: {count changed files} changed, {count existing files} sampled
Findings: {count}

{For each finding, up to five:}
📋 **Possible duplicate** in `{file}` (lines {start}–{end})
   Similar to: `{other file or location}`
   Suggestion: {one sentence — e.g. extract to a shared helper, or confirm intentional copy}

{If no findings:}
✅ No significant code duplication detected in this PR.
```

## Guidelines

- Post at most five findings. If there are more, add a note: "Additional findings omitted — showing top 5 by similarity."
- Do not approve or request changes on the PR — only add a comment.
- Do not flag: comments, blank lines, import/require statements, licence headers, or boilerplate (e.g. `package main`, `if __name__ == "__main__"`).
- If the PR touches only documentation, configuration, or lock files, reply: "No source code changes to review."
- Keep each finding description under 50 words.
```

</details>

## ✅ Checkpoint

- [ ] `.github/workflows/pr-code-reviewer.md` exists in your repository
- [ ] `gh aw compile .github/workflows/pr-code-reviewer.md` reports no errors
- [ ] The file is committed and pushed to `main`
- [ ] Every top-level YAML key in the frontmatter makes sense to you

> [!NOTE]
> The PR reviewer uses `on: pull_request` rather than a daily schedule, so [Step 13: Schedule It to Run Every Day](13-schedule-it.md) does not apply to this workflow. Jump straight to [Step 14: What's Next?](14-next-steps.md) after this step, or continue to [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) to practice reading the run log.

**Previous:** [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools, Imports, and Permissions reference](https://github.github.com/gh-aw/reference/tools/)
