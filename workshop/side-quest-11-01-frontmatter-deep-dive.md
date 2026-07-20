<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Frontmatter Deep Dive — Part A

> _Optional: a section-by-section walkthrough of the opening three frontmatter sections in a `gh-aw` workflow file. Work through this before building Step 11, then continue to [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md) or return to the main path._

## 📋 Before You Start

You have read [Step 11](11a-build-daily-status.md) and have a draft frontmatter file open.

---

An agentic workflow file opens with a YAML **[frontmatter](https://github.github.com/gh-aw/reference/frontmatter/)** block between `---` fences. This block configures when the workflow runs and what it is allowed to do. This page covers the first three sections: metadata, triggers, and permissions.

---

## Section 1 — Opening fence and `description`

**🔍 Predict:** What two things would you write at the top of a workflow file to identify it at a glance — before reading the explanation below?

```yaml
---
emoji: 📊
description: Post a daily repository status summary as a GitHub issue comment.
```

**What this section does:** Opens the YAML frontmatter and declares human-readable metadata.

| Field | Purpose |
|-------|---------|
| `---` | Signals the start of YAML frontmatter. Everything until the next `---` is structured configuration. |
| `emoji` | A decorative label shown in the `gh aw` dashboard. Pick any emoji that fits. |
| `description` | A one-sentence summary shown in the GitHub Actions UI and in `gh aw list`. |

**✏️ Try it:** Update `emoji` and `description` in your draft file to match your workflow.

**✅ Check:** Run `gh aw compile` — the output should list your workflow with no errors.

---

## Section 2 — `on:` triggers

**🔍 Predict:** How would you tell GitHub Actions to run the workflow every day _and_ allow manual triggering? Write the two keys before reading on.

```yaml
on:
  schedule: daily
  workflow_dispatch: {}
```

**What this section does:** Tells GitHub Actions _when_ to run this workflow.

| Field | Purpose |
|-------|---------|
| `on:` | Declares all triggers. Every GitHub Actions workflow must have this key. |
| `schedule: daily` | Runs once per day at a compiler-assigned time (scattered to avoid load spikes). Also available: `hourly`, `weekly`. |
| `workflow_dispatch: {}` | Adds a **Run workflow** button in the GitHub Actions UI. The `{}` means no custom inputs are required. |

> [!TIP]
> Keep `workflow_dispatch` even after going to production — it lets you re-run the report on demand without changing the schedule.

**✏️ Try it:** Add both trigger keys to your draft file and save.

**✅ Check:** Run `gh aw compile` — the compile should succeed, and you should see both `schedule` and `workflow_dispatch` listed under triggers.

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

**What this section does:** Declares exactly which GitHub API scopes this workflow is allowed to use. Minimal permissions are a security best practice.

The five entries above cover reading repository content, issues, pull requests, and workflow runs, plus the `copilot-requests: write` scope that the Copilot engine requires to authenticate with `${{ github.token }}`. Full definitions for each field are in [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md).

> [!NOTE]
> There is no `issues: write` here. Write access is handled by `safe-outputs` — covered in [Part B](side-quest-11-08-frontmatter-tools-outputs.md).

**✏️ Try it:** Add the `permissions:` block to your draft. Verify that `copilot-requests: write` is included.

**✅ Check:** Run `gh aw compile` — the compile should complete with no permission errors.

---

## ✅ Checkpoint

- [ ] You updated `emoji` and `description` in your draft and `gh aw compile` produced no errors.
- [ ] You added both `schedule: daily` and `workflow_dispatch` triggers, and `gh aw compile` lists both with no errors.
- [ ] The `workflow_dispatch` trigger appears in your Actions UI after pushing the file.
- [ ] You added the `permissions:` block with all five entries and `copilot-requests: write` is present.
- [ ] You can explain why `copilot-requests: write` is required and where to find full field definitions.

---

<!-- journey: all -->
Continue to [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md), or return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).
<!-- /journey -->


