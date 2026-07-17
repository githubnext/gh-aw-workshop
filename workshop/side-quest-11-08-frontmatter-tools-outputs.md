# Side Quest: Frontmatter Deep Dive — Part B

> _Optional continuation of [Part A](side-quest-11-01-frontmatter-deep-dive.md): practice `tools`, `outputs`, and output guardrails with a short hands-on lab._

## 📋 Before You Start

You have:

- Finished [Part A](side-quest-11-01-frontmatter-deep-dive.md)
- Reviewed [YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md)
- Opened a draft workflow file from Step 11 in your own practice repository

---

## What you'll build

In this side quest, you make three small edits and verify each one:

1. Add a `tools:` block, compile, and confirm the lock file changed.
2. Add an `outputs:` key, reference it in the brief, run the workflow, and observe the output.
3. Toggle one permission flag, then add a YAML comment that explains why that permission is needed.

---

## Task 1 — Add `tools:` and compile

Add this block in frontmatter after `permissions:` (between the opening `---` and closing `---` fences). Use two-space indentation, with `github:` nested under `tools:`.

```yaml
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

Then run:

```bash
gh aw compile
```

You should see a successful compile message. Then verify the lock file for your workflow changed (`git status` should show an updated matching `*.lock.yml`).

---

## Task 2 — Add `outputs:` and use it in the brief

Add this key to frontmatter:

```yaml
outputs:
  repo_name: ${{ github.event.repository.name }}
```

Then add one line in your Markdown brief body:

```markdown
Repository: ${{ outputs.repo_name }}
```

Create the issue titled **Daily Status Reports** if it does not already exist.

Then:

1. Trigger a manual run from **Actions → Run workflow**.
2. Check the posted comment on **Daily Status Reports** (or review run logs if no comment appears).
3. Confirm the generated report includes your repository name.

---

## Task 3 — Toggle one permission and document why

Temporarily change `actions: read` to `actions: none` and trigger a manual run again from **Actions → Run workflow**.

Observe what data the agent can no longer access by checking workflow logs, error messages, or missing fields in the report/comment. Then restore the original permission value and add a short YAML comment explaining why that permission is required.

Example:

```yaml
permissions:
  actions: read # Allows the workflow to read the latest CI run status.
```

---

<details>
<summary>Reference details (open only if you need a quick lookup)</summary>

For full definitions, use the official references: [Tools](https://github.github.com/gh-aw/reference/tools/), [Safe Outputs](https://github.github.com/gh-aw/reference/safe-outputs/), and [Frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).

| Key | Purpose |
|---|---|
| `tools.github.mode: gh-proxy` | Routes GitHub API calls through a proxy that respects `permissions:`. |
| `tools.github.toolsets: [default]` | Enables the default GitHub MCP toolset. |
| `outputs:` | Defines reusable values for the workflow brief. |
| `safe-outputs:` | Defines the only write actions the agent can perform. |

If this feels unfamiliar, revisit [Part A](side-quest-11-01-frontmatter-deep-dive.md) for triggers and permissions. See [YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md) for indentation and debugging patterns.

</details>

---

## ✅ Checkpoint

- [ ] You added `tools:` and confirmed `gh aw compile` updated the lock file.
- [ ] You added an `outputs:` key and referenced it in the workflow brief.
- [ ] You triggered a run and observed the output value in the generated report.
- [ ] You toggled one permission, saw the effect, and restored it with a clear YAML comment.

---

Return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).
