---
journey: all
adventure: side-quest
---
# Side Quest: Choosing Between Cache Memory and Repo Memory

> _Optional: work through this reference if you want to understand both `cache-memory` and `repo-memory` in depth before or after completing [Step 20](20-persistent-memory.md), then return to the main path._

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You have completed or are about to start [Step 20: Make Your Workflow Remember Across Runs](20-persistent-memory.md).
- You understand YAML frontmatter from [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md).

`gh-aw` gives you two primitives for persisting state between workflow runs. They behave differently, store data in different places, and suit different use cases. This side quest walks through both in detail so you can pick the right one for your workflow — and know how to switch if your needs change.

---

## Why Memory Matters

Every workflow run starts with a blank slate. That is fine for a daily summary, but it causes problems the moment you want to:

- **Deduplicate alerts** — alert only on _new_ open issues, not the same ones every morning.
- **Compare against a baseline** — "did the number of failing tests increase since yesterday?"
- **Scan incrementally** — skip pull requests you have already reviewed.

Both primitives solve this without you managing a database:

| Tool | Where state is stored | Lifetime | Best for |
|------|----------------------|----------|----------|
| `cache-memory` | GitHub Actions cache | Until cache eviction (typically 7 days of inactivity) | Short-lived deduplication; data that is fine to lose |
| `repo-memory` | A file committed to your repository | As long as the file exists | Durable baselines; data that must survive cache eviction |

---

## Choosing Between the Two

Ask yourself: _what happens if the memory is lost?_

> 🤔 **Predict:** For each scenario below, decide which primitive you'd use before reading the "Recommended" column. Cover the right column, make your choices, then reveal it to check.

| Scenario | Recommended primitive |
|----------|-----------------------|
| A few duplicate alerts on cache expiry is tolerable | `cache-memory` |
| Losing state would flood your team with false positives | `repo-memory` |
| You need a baseline that survives a repository clone or transfer | `repo-memory` |
| You want the simplest setup with no extra permissions | `cache-memory` |
| You need to inspect or edit the stored state manually | `repo-memory` |
| You expect the workflow to run infrequently (less than once a week) | `repo-memory` |

For most deduplication use cases, `cache-memory` is the right starting point. Switch to `repo-memory` only when the cost of losing state is too high — for example, when loss would flood your team with false-positive alerts or require manual cleanup before the workflow runs correctly again.

---

## `cache-memory` in Depth

`cache-memory` backs a memory slot with the [GitHub Actions cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows). The agent reads and writes a small JSON object keyed by the name you provide.

### `cache-memory` frontmatter

```yaml
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: write
tools:
  cache-memory:
    key: daily-status-seen-issues
    ttl: 7d
---
```

### `cache-memory` field reference

| Field | Purpose |
|-------|---------|
| `tools:` | Parent key that enables tool integrations for this workflow. |
| `cache-memory:` | Tells `gh-aw` to back this memory slot with the GitHub Actions cache. |
| `key:` | A unique name for this memory slot. Prefix it with your workflow name to avoid collisions if you have multiple workflows in the same repository. |
| `ttl: 7d` | How long to keep cached data without a refresh. After 7 days of no runs the cache expires and the agent starts fresh. Common values: `1d`, `7d`, `30d`. |

### `cache-memory` task brief example

```markdown
You monitor this repository for newly opened issues and post a daily digest.

Use your `daily-status-seen-issues` memory to track which issue numbers you
have already reported on. On each run:

1. Fetch all currently open issues.
2. Filter out any issue numbers that appear in your memory.
3. If there are new issues, post a comment on the tracking issue listing only
   the new ones.
4. Add the new issue numbers to your memory so you skip them next time.
5. If there are no new issues, post nothing.
```

> [!TIP]
> Be explicit in the brief about _reading_ and _writing_ the memory. The agent will not automatically persist anything unless you ask it to in the task brief.

---

## `repo-memory` in Depth

`repo-memory` backs a memory slot with a JSON file committed directly to your repository. The agent reads the file at the start of each run and commits an updated version at the end.

### `repo-memory` frontmatter

```yaml
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: write
  issues: write
tools:
  repo-memory: true
---
```

### `repo-memory` field reference

| Field | Purpose |
|-------|---------|
| `tools:` | Parent key that enables tool integrations for this workflow. |
| `repo-memory:` | Enables repository-backed memory for this workflow (`true` to enable). |

> [!IMPORTANT]
> `repo-memory` requires `contents: write` in your `permissions` block so the agent can commit the updated file. Add it alongside your existing permissions. This is a broader permission than `cache-memory` requires — keep the stored data small and review commits regularly.

Keep the stored data small — a list of IDs or a compact summary object — to avoid cluttering your commit history with large file changes.

### `repo-memory` task brief example

```markdown
You compare today's open issue count against a stored baseline.

Use your `daily-status-baseline.json` memory to store the issue count from the
previous run. On each run:

1. Fetch all currently open issues and count them.
2. Read the baseline from your memory. If no baseline exists, treat it as zero.
3. Calculate the delta: today's count minus the baseline.
4. Post a comment summarising the delta ("3 new issues since yesterday" or
   "no change").
5. Write today's count back to your memory as the new baseline.
```

---

## ✅ Checkpoint

- [ ] You can explain the difference between `cache-memory` and `repo-memory`
- [ ] You know when to choose each primitive based on your use case
- [ ] You understand what `contents: write` is needed for and when it is required
- [ ] You can write a task brief that explicitly reads and writes a named memory slot

---

<!-- journey: all -->
Return to [Step 20: Make Your Workflow Remember Across Runs](20-persistent-memory.md).
<!-- /journey -->

## 📚 See Also

- [Cache Memory reference](https://github.github.com/gh-aw/reference/cache-memory/)
- [Repo Memory reference](https://github.github.com/gh-aw/reference/repo-memory/)
- [MemoryOps pattern](https://github.github.com/gh-aw/patterns/memory-ops/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
