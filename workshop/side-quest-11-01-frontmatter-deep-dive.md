# Side Quest: Frontmatter Deep Dive — Part A

> _Optional: a section-by-section walkthrough of the opening three frontmatter sections in a `gh-aw` workflow file. Work through this before building Step 11, then continue to [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md) or return to the main path._

## 📋 Before You Start

You have read [Step 11](11a-build-daily-status.md) and have a draft frontmatter file open.

---

An agentic workflow file opens with a YAML **frontmatter** block between `---` fences. This block configures when the workflow runs and what it is allowed to do. This page covers the first three sections: metadata, triggers, and permissions.

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
| `schedule: daily` | Runs once per day at midnight UTC. Also available: `hourly`, `weekly`. |
| `workflow_dispatch: {}` | Adds a **Run workflow** button in the GitHub Actions UI. The `{}` means no custom inputs are required. |

> [!TIP]
> Keep `workflow_dispatch` even after going to production — it lets you re-run the report on demand without changing the schedule.

**✏️ Try it:** Add both trigger keys to your draft file and save.

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

| Field | Why it's needed |
|-------|----------------|
| `contents: read` | Lets the agent read files and commits. |
| `copilot-requests: write` | Required for the Copilot engine to authenticate with `${{ github.token }}`. |
| `issues: read` | Lets the agent list and read open issues. |
| `pull-requests: read` | Lets the agent list open pull requests. |
| `actions: read` | Lets the agent read recent workflow runs. |

> [!NOTE]
> There is no `issues: write` here. Write access is handled by `safe-outputs` — covered in [Part B](side-quest-11-08-frontmatter-tools-outputs.md).

**✏️ Try it:** Add the `permissions:` block to your draft. Verify that `copilot-requests: write` is included.

---

## ✅ Checkpoint

- [ ] You updated `emoji` and `description` in your draft
- [ ] You added both `schedule: daily` and `workflow_dispatch` triggers
- [ ] You can name all five permissions and explain why `copilot-requests: write` is required

---

Continue to [Part B: Tools, Outputs, and the Agent Body](side-quest-11-08-frontmatter-tools-outputs.md), or return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).
