# Side Quest: Workflow File Structure at a Glance

> _Optional: read this before building Step 11 to understand what you are writing, then return to [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md)._

An agentic workflow file has two parts:

- **Frontmatter** — YAML between `---` fences at the top of the file. This configures how and when the workflow runs.
- **Markdown body** — the agent's task brief, written below the closing `---`. The AI reads this at runtime.

The file ends in `.md` instead of `.yml` because agentic workflows use Markdown — see the [Classic vs. Agentic comparison in Step 5](05-agentic-workflows-intro.md).

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

---

## ✅ Checkpoint

- [ ] You can name the two structural parts of an agentic workflow file.
- [ ] You can describe what each of the five frontmatter sections controls.

---

Return to [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md).
