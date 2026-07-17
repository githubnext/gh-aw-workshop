# Side Quest: Frontmatter Deep Dive — Part B

> _Optional continuation of [Part A](side-quest-11-01-frontmatter-deep-dive.md): practice `tools`, `outputs`, and write guardrails with a short hands-on lab._

## 📋 Before You Start

You have:

- Finished [Part A](side-quest-11-01-frontmatter-deep-dive.md)
- Reviewed [YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md)
- A draft workflow file from Step 11 open in your own practice repository

---

## What you'll build

In this side quest, you make three small edits and verify each one:

1. Add a `tools:` block, compile, and confirm the lock file changed.
2. Add an `outputs:` key, reference it in the brief, run the workflow, and observe the output.
3. Toggle one permission flag, then add a YAML comment that explains why that permission is needed.

---

## Task 1 — Add `tools:` and compile

Add this block to your frontmatter:

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

Verify the compile succeeded and your lock file changed (`git status` should show an updated `*.lock.yml`).

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

Trigger a manual run from **Actions → Run workflow**. Confirm the generated report includes your repository name.

---

## Task 3 — Toggle one permission and document why

Temporarily change one permission (for example `actions: read` to `actions: none`) and run the workflow again.

Observe what data the agent can no longer access. Then set it back and add a short YAML comment explaining why the restored permission is required.

Example:

```yaml
permissions:
  actions: read # Needed so the workflow can read the latest CI run status.
```

---

> [!NOTE]
> <details>
> <summary>Reference details (open only if you need a quick lookup)</summary>
>
> For full definitions, use the official references: [Tools](https://github.github.com/gh-aw/reference/tools/), [Safe Outputs](https://github.github.com/gh-aw/reference/safe-outputs/), and [Frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).
>
> | Key | Purpose |
> |---|---|
> | `tools.github.mode: gh-proxy` | Routes GitHub API calls through a proxy that respects `permissions:`. |
> | `tools.github.toolsets: [default]` | Enables the default GitHub MCP toolset. |
> | `outputs:` | Defines reusable values for the workflow brief. |
> | `safe-outputs:` | Defines the only write actions the agent can perform. |
>
> If this feels unfamiliar, revisit [Part A](side-quest-11-01-frontmatter-deep-dive.md) for triggers and permissions and [YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md) for indentation/debugging patterns.
>
> </details>

---

## ✅ Checkpoint

- [ ] You added `tools:` and confirmed `gh aw compile` updated the lock file.
- [ ] You added an `outputs:` key and referenced it in the workflow brief.
- [ ] You triggered a run and observed the output value in the generated report.
- [ ] You toggled one permission, saw the effect, and restored it with a clear YAML comment.

---

Return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).
