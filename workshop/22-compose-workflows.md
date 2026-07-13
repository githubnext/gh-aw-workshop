# Chain Agentic Workflows Together

> _One workflow should do one thing well — use `workflow_run` to pipe the output of one agent into the next._

## 🎯 What You'll Do

You'll split a complex automation into two cooperating agentic workflows: a **collector** that gathers data and writes a snapshot, and a **reporter** that reads the snapshot and posts a stale-issue summary. By the end of this step you'll have a two-stage pipeline where each workflow has a single, well-defined responsibility.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You understand persistent memory from [Step 20: Make Your Workflow Remember Across Runs](20-persistent-memory.md).
- You know how to compile and validate a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Why Chain Workflows?

Every workflow you have built so far is a single file that does everything — fetching data, reasoning over it, and writing output — all in one agent run. That works well for small tasks, but two problems emerge as complexity grows:

- **Context bloat.** A single agent that gathers data, classifies items, and writes a report carries all that context in one prompt. The more context, the more expensive the run and the more room for error.
- **Tight coupling.** If you want to change how data is collected (for example, by adding a new data source), you have to edit the same file that controls how output is formatted — two unrelated concerns in one place.

Chaining workflows separates concerns cleanly. The **collector** is fast and cheap: it runs shell steps, calls APIs, and writes structured data to a file. The **reporter** is the reasoning step: it reads that file and decides what to say. Each can evolve independently.

## The `workflow_run` Trigger

The `workflow_run` event fires whenever a named workflow completes. This makes it the right trigger for the reporter: it waits for the collector to finish before it starts reasoning.

```yaml
on:
  workflow_run:
    workflows: ["Stale Issue Collector"]
    types: [completed]
```

The reporter only starts when `Stale Issue Collector` finishes successfully. If the collector fails, the reporter does not run.

> [!NOTE]
> `workflow_run` triggers the reporter on a fresh runner. Files written by the collector to `$GITHUB_WORKSPACE` are not available. You must pass data between the two workflows using a persistent store — `repo-memory` is the right choice here.

## Steps

### Create the collector workflow

Create a new file `.github/workflows/stale-collector.md`. This workflow runs on a daily schedule, identifies issues that have had no activity in the last 14 days, and saves the list to `repo-memory`.

```yaml
---
name: Stale Issue Collector
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: write
  issues: read
memory:
  repo-memory:
    path: .github/aw-data/stale-snapshot.json
---
```

Write a brief task that instructs the agent to collect the data and store it:

```markdown
You collect open issues that have had no activity in the last 14 days.

1. Fetch all open issues in this repository.
2. Filter to issues with no comments or label updates in the last 14 days.
3. Write the filtered list to your `stale-snapshot.json` memory as a JSON array.
   Each item should include: `number`, `title`, `created_at`, `days_stale`.
4. Do not post any comments or open any issues — this workflow only collects.
```

> [!TIP]
> Keep the collector brief focused entirely on data collection. The simpler the brief, the cheaper and faster the collector run.

### Create the reporter workflow

Create a second file `.github/workflows/stale-reporter.md`. This workflow triggers when the collector finishes and posts the stale-issue summary.

```yaml
---
name: Stale Issue Reporter
on:
  workflow_run:
    workflows: ["Stale Issue Collector"]
    types: [completed]
permissions:
  contents: read
  issues: write
memory:
  repo-memory:
    path: .github/aw-data/stale-snapshot.json
---
```

Write a brief that instructs the reporter to reason over the snapshot and post a summary:

```markdown
You summarise open issues that have gone stale and alert the team.

1. Read the stale issue list from your `stale-snapshot.json` memory.
2. If the list is empty, do nothing.
3. If there are stale issues, open a new issue titled "Stale Issue Digest — {date}"
   with a markdown table listing each stale issue: number, title, and days stale.
4. Sort the table from most stale to least stale.
5. Close any previously opened "Stale Issue Digest" issues that are still open.
```

> [!TIP]
> Give the reporter explicit instructions for the empty-list case. Without them, the agent may post an unnecessary "nothing to report" comment on every run.

### Compile and validate both workflows

Compile each workflow file and confirm both pass validation:

```bash
gh aw compile .github/workflows/stale-collector.md --validate
gh aw compile .github/workflows/stale-reporter.md --validate
```

> [!TIP]
> Use `--watch` to recompile automatically as you edit: `gh aw compile .github/workflows/stale-collector.md --watch`

Fix any errors before pushing. Common mistakes in a chained setup include:

- Mismatched `workflows:` name — the name in the reporter's `workflow_run` trigger must match the `name:` field in the collector's frontmatter exactly (case-sensitive).
- Forgetting `contents: write` on the collector — `repo-memory` needs write access to commit the snapshot file.
- Setting `contents: write` on the reporter — the reporter only reads the snapshot, so `contents: read` is sufficient and safer.

### Push and test

Commit both workflow files and their lock files:

```bash
git add .github/workflows/stale-collector.md .github/workflows/stale-collector.lock.yml
git add .github/workflows/stale-reporter.md .github/workflows/stale-reporter.lock.yml
git commit -m "feat: add stale-issue collector/reporter pipeline"
git push
```

Test the pipeline end-to-end:

1. Trigger the collector manually: **Actions → Stale Issue Collector → Run workflow**.
2. Wait for the collector to finish.
3. Confirm the reporter starts automatically in the Actions tab.
4. Open the newly created "Stale Issue Digest" issue in your repository.

> [!TIP]
> If the reporter does not start automatically, check that the `workflow_run` trigger name matches the collector's `name:` field exactly.

### Adapt the pattern to other pipelines

The collector/reporter pattern works for any automation where data gathering and reasoning are separate concerns:

| Collector gathers… | Reporter reasons over… |
|--------------------|------------------------|
| Nightly test failures | Root-cause analysis and ticket creation |
| New pull requests since last run | Triage suggestions and label assignments |
| Dependency vulnerability scan output | Prioritised remediation plan |
| Repository star/fork growth metrics | Weekly community health digest |

To adapt: keep the `repo-memory` path consistent between the two workflow files and match the `workflow_run` trigger name to the collector's `name:` field.

## ✅ Checkpoint

- [ ] You have two separate workflow files: a collector and a reporter
- [ ] The reporter's `workflow_run` trigger names the collector exactly
- [ ] The collector uses `repo-memory` with `contents: write` to save its snapshot
- [ ] The reporter reads the same `repo-memory` path with `contents: read`
- [ ] Both workflow files pass `gh aw compile --validate` with no errors
- [ ] You triggered the collector manually and the reporter ran automatically afterwards

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Side Quest: Choosing Between Cache Memory and Repo Memory](side-quest-20-01-memory-patterns.md)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md)
