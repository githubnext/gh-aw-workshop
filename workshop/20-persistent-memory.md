<!--
<research-metadata>
  <focus>Persistent memory in agentic workflows — cache-memory and repo-memory frontmatter tools</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/memory.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/memory-stateful-patterns.md</source>
  </sources>
  <rationale>
    Every existing step produces stateless workflows that start fresh on each run. Real automation needs
    cross-run state: deduplication, baseline comparison, and incremental scanning. The gh-aw docs describe
    two production-ready primitives for this — cache-memory and repo-memory — but nothing in the workshop
    covered them. This step closes that gap.
  </rationale>
</research-metadata>
-->

# Make Your Workflow Remember Across Runs

> _A workflow that forgets everything after each run will repeat itself. Give it memory and it can act only on what's new._

## 🎯 What You'll Do

You'll add persistent memory to your agentic workflow so it can carry state between runs. By the end of this step, your workflow will remember what it has already reported on and skip duplicates — so your team never gets the same alert twice.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You are comfortable editing YAML frontmatter from [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
- You understand how `safe-outputs` controls write access (see [Side Quest: Frontmatter Deep Dive — Part B](side-quest-11-08-frontmatter-tools-outputs.md) if you need a refresher).

## Why Memory Matters

Every workflow run you have built so far starts with a blank slate. That is fine for a daily summary, but it causes problems the moment you want to:

- **Deduplicate alerts** — alert only on _new_ open issues, not the same ones every morning.
- **Compare against a baseline** — "did the number of failing tests increase since yesterday?"
- **Scan incrementally** — skip pull requests you have already reviewed.

`gh-aw` provides two memory primitives: **`cache-memory`** (backed by the GitHub Actions cache, ideal for short-lived deduplication) and **`repo-memory`** (backed by a committed file, ideal for durable baselines). This step focuses on `cache-memory` — the simpler and more common choice.

> [!TIP]
> **Optional Side Quest:** Want a deeper comparison of both primitives, a decision guide, and full field-by-field references for each? See [Side Quest: Choosing Between Cache Memory and Repo Memory](side-quest-20-01-memory-patterns.md).

## Steps

### Choose the right memory tool

For a deduplication use case (the example in this step), `cache-memory` is the right choice. A few repeated alerts on cache expiry is tolerable. If you need state that must survive cache eviction — for example, a baseline comparison where losing state would trigger a flood of false positives — use `repo-memory` instead (see the side quest above).

### Add `cache-memory` to your frontmatter

Open your workflow file at `.github/workflows/daily-status.md`. Add `cache-memory` inside the `tools:` block in the frontmatter:

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

What each field does:

| Field | Purpose |
|-------|---------|
| `tools:` | Parent key that enables tool integrations for this workflow. Memory primitives are nested under this key. |
| `cache-memory:` | Tells `gh-aw` to back this memory slot with the GitHub Actions cache. Nested under `tools:`. |
| `key:` | A unique name for this memory slot. Prefix it with your workflow name to avoid collisions if you have multiple workflows in the same repository. |
| `ttl: 7d` | How long to keep cached data without a refresh. After 7 days of no runs the cache expires and the agent starts fresh. |

### Update your task brief to use the memory

Below the frontmatter, tell the agent how to use its memory. The agent reads and writes the memory slot by name:

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

### Use `repo-memory` for durable baselines

When you need state that survives cache eviction, switch to `repo-memory`. It stores a JSON file directly in your repository and requires `contents: write` in your `permissions` block. For a full field reference, example task brief, and guidance on when to choose `repo-memory`, see [Side Quest: Choosing Between Cache Memory and Repo Memory](side-quest-20-01-memory-patterns.md).

### Compile and validate

After editing the frontmatter, compile the workflow to confirm the memory block is valid:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

Fix any errors before pushing. Common mistakes include putting `cache-memory:` at the top level instead of nesting it under `tools:`, and omitting the `key:` field for `cache-memory`.

> [!TIP]
> Use `--watch` to recompile automatically as you edit: `gh aw compile .github/workflows/daily-status.md --watch`

### Test the memory across two runs

Push your changes and run the workflow twice in a row:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add cache-memory deduplication to daily-status"
git push
```

1. Trigger the first run manually in **Actions → Daily Status Report → Run workflow**.
2. Open a new issue in your practice repository.
3. Trigger a second run.

The first run reports all currently open issues and writes them to memory. The second run reads the memory, finds only the new issue you just opened, and reports only that one.

> [!TIP]
> Open the run log for the second run and look for a line where the agent reads its memory. You will see the stored issue numbers that it filters against — that's your workflow remembering across runs.

## ✅ Checkpoint

- [ ] Your workflow frontmatter has `cache-memory:` or `repo-memory:` nested under `tools:`
- [ ] Your task brief explicitly tells the agent to read and write the named memory slot
- [ ] `gh aw compile --validate` passes with no errors
- [ ] You ran the workflow twice and confirmed the second run skips previously seen items
- [ ] You can explain the difference between `cache-memory` and `repo-memory` and when to use each

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Side Quest: Choosing Between Cache Memory and Repo Memory](side-quest-20-01-memory-patterns.md)
- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)
