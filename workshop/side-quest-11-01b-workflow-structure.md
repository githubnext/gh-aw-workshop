<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Workflow File Structure at a Glance

> _Optional: read this before building Step 11 to understand what you are writing, then return to [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md)._

## 📋 Before You Start

- Keep [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md) open so you can map each section here to the workflow you build next.

---

An [agentic workflow](https://github.github.com/gh-aw/introduction/overview/) file has two parts:

- **Frontmatter** — YAML between `---` fences at the top of the file. This configures how and when the workflow runs.
- **Markdown body** — the agent's task brief, written below the closing `---`. The AI reads this at runtime.

The file ends in `.md` instead of `.yml` because the frontmatter is only the opening config block — the rest of the file is a Markdown brief that the agent reads at runtime. See the [Classic vs. Agentic comparison in Step 5](05-agentic-workflows-intro.md).

---

## Frontmatter sections at a glance

The five frontmatter sections you'll build in Step 11a:

| Section | Key(s) | What it does |
|---------|--------|--------------|
| Metadata | `emoji`, `description` | Human-readable labels shown in the `gh aw` dashboard and Actions UI. |
| Triggers | `on:` | Tells GitHub Actions when to run — `schedule: daily` plus a manual `workflow_dispatch` button. |
| Permissions | `permissions:` | Declares the minimum GitHub API scopes the workflow may use. |
| Tools | `tools:` | Enables the GitHub MCP tool via `gh-proxy`, scoped to the permissions above. |
| Write guardrail | `safe-outputs:` | The only write actions the agent may take — here, one issue comment per run. |

## ✏️ Try It: Label the Structure

Before you look at the answer, copy this snippet into your editor and add your own labels above each part.

```md
---
emoji: 📊
description: Daily repository status report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: read
tools:
  github:
    mode: gh-proxy
safe-outputs:
  add-comment:
    max: 1
---
Summarize the open issues, recent pull requests, and latest workflow runs.
```

<details>
<summary>Show the section labels</summary>

- `emoji` and `description` = **Metadata**
- `on:` = **Triggers**
- `permissions:` = **Permissions**
- `tools:` = **Tools**
- `safe-outputs:` = **Write guardrail**
- The sentence below the closing `---` = **Markdown body**

</details>

---

## ✅ Checkpoint

- [ ] You labeled the example snippet and matched all five frontmatter sections.
- [ ] You can point to the `on:` block and explain that it controls when the workflow runs.
- [ ] You can point to `safe-outputs:` and explain that it limits what the agent may write.
- [ ] You can point to the text below the closing `---` and identify it as the Markdown body.
- [ ] You can explain in one sentence why the file ends in `.md` instead of `.yml`.

---

<!-- journey: all -->
Return to [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md).
<!-- /journey -->


