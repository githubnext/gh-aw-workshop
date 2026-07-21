<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Frontmatter Deep Dive — Part A

> _Optional: configure each of the opening three frontmatter sections of an agentic workflow file — metadata, triggers, and permissions. Work through this before building Step 11, then continue to [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md) or return to the main path._

## 📋 Before You Start

You have a draft frontmatter file open.

---

An agentic workflow file opens with a YAML **[frontmatter](https://github.github.com/gh-aw/reference/frontmatter/)** block between two YAML fences. This block configures when the workflow runs and what it is allowed to do.

---

## Section 1 — Opening fence and `description`

**🔍 Predict:** What two things would you write at the top of a workflow file to identify it at a glance — before reading the explanation below?

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
```

**What this section does:** Declares the workflow's metadata.

| Field | Purpose |
|-------|---------|
| `emoji` | Decorative label in the `gh aw` dashboard. Pick any emoji that fits. |
| `description` | Summary shown in the Actions UI and in `gh aw list`. |

**✏️ Try it:** Update both fields in your draft, then run `gh aw compile` and confirm no errors appear.

```yaml
# Your turn
---
emoji: ???
description: ???
```

---

## Section 2 — `on:` triggers

**🔍 Predict:** How would you tell GitHub Actions to run the workflow every day _and_ allow manual triggering? Write the two keys before reading on.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

**What this section does:** Declares when the workflow runs.

| Field | Purpose |
|-------|---------|
| `on:` | Declares all triggers. |
| `schedule: daily` | Daily run at a compiler-assigned time. See the [triggers reference](https://github.github.com/gh-aw/reference/triggers/) for other intervals. |
| `workflow_dispatch: {}` | Adds a manual trigger button in the Actions UI. |

> [!TIP]
> Keep `workflow_dispatch: {}` even after going to production — it lets you re-run the report on demand.

**✏️ Try it:** Add both trigger keys to your draft and run `gh aw compile`. Then extend the block to also fire on pushes to the main branch:

```yaml
on:
  push:
    branches: [main]
  schedule: daily
  workflow_dispatch: {}
```

```yaml
# Your turn: configure schedule, push to main, and manual triggers
on:
  ???
```

**✅ Check:** Run `gh aw compile` — the compiled output should list all three triggers.

---

## Section 3 — `permissions:`

**🔍 Predict:** The agent needs to read issues and post a comment. Which permissions would you list? Write them down before reading the explanation.

```yaml
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
```

**What this section does:** Declares the GitHub API scopes this workflow may use — fewer scopes is safer.

| Field | Purpose |
|-------|---------|
| `permissions:` | Lists every scope the workflow may use; omitted scopes are denied. |
| `contents: read` | Read access to repository files and commits. |
| `copilot-requests: write` | Required by the Copilot engine. |
| `issues: read` | Read access to issue data. |
| `pull-requests: read` | Read access to pull request data. |
| `actions: read` | Read access to workflow run results. |

**✏️ Try it:** Add the `permissions:` block to your draft. Then fill in the correct permission value for each scope:

```yaml
# Your turn: fill in the correct value for each scope
permissions:
  contents: ???
  copilot-requests: ???
  issues: ???
  pull-requests: ???
  actions: ???
```

**✅ Check:** Run `gh aw compile` — the compile should complete with no permission errors.

---

## Mini-challenge

Write the `on:` block for schedule + push to main + manual trigger from memory, then validate with `gh aw compile`.

```yaml
# Complete the on: block
on:
  ???
```

<details><summary>Solution</summary>

```yaml
on:
  schedule: daily
  push:
    branches: [main]
  workflow_dispatch: {}
```

Run `gh aw compile` and confirm all three triggers appear in the compiled output.
</details>

Now combine all three sections into one complete frontmatter block and compile it:

```yaml
# Your turn: combine all three sections
---
emoji: ???
description: ???
on:
  ???
permissions:
  ???
---
```

---

## ✅ Checkpoint

- [ ] You updated `emoji` and `description` in your draft and `gh aw compile` produced no errors.
- [ ] You added `schedule: daily` and `workflow_dispatch: {}` triggers; both appear in the compiled output.
- [ ] You added a push trigger for the main branch and confirmed it compiles correctly.
- [ ] You can explain why keeping `workflow_dispatch: {}` alongside a schedule trigger is useful.
- [ ] You added the `permissions:` block with all five entries.
- [ ] `copilot-requests: write` is present in your permissions block.
- [ ] You completed the mini-challenge and all three triggers appear in the compiled output.
- [ ] You can explain what each permission scope in the block allows.
- [ ] You wrote a complete combined frontmatter block and it compiled without errors.
- [ ] The `workflow_dispatch: {}` trigger appears as a manual trigger button in your GitHub Actions UI after pushing.

---

<!-- journey: all -->
**Next:** [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md)

**Return to:** [Build — Daily Repo Status Workflow](07-your-first-workflow.md)
<!-- /journey -->

