# Step 11b: Build the Daily Documentation Updater — GitHub UI Path

> [!NOTE]
> Want incremental compiler feedback? Switch to the [Terminal path](11b-build-daily-docs-terminal.md).

## 🎯 What You'll Do

You'll paste a complete documentation health workflow into the GitHub web editor and commit it in your browser.

## 📋 Before You Start

- You've completed [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
- Your practice repository is open on GitHub

## Create the workflow

1. Click **Add file** → **Create new file**.
2. Enter `.github/workflows/daily-docs.md` as the filename.
3. Paste the complete file:

   ```markdown
   ---
   emoji: 📚
   description: Post a daily documentation health report as a GitHub issue comment.

   on:
     schedule: daily
     workflow_dispatch: {}

   permissions:
     contents: read
     copilot-requests: write
     issues: read

   tools:
     github:
       mode: gh-proxy
       toolsets: [default]

   safe-outputs:
     add-comment:
       max: 1
   ---

   # Daily Documentation Health Report

   You are an AI assistant that monitors this repository's documentation and posts a concise daily health report.

   ## Your Task

   Collect and summarise:

   1. **Documentation files** — list all Markdown files in `docs/` and the root `README.md`
   2. **Staleness** — for each file, find the date of the most recent commit that touched it; flag files not updated in the last 30 days
   3. **Thin pages** — flag files that appear to have fewer than 200 words of content
   4. **Broken internal links** — identify any links between documentation files that point to a file that does not exist

   ## Output Format

   Find the issue titled "Daily Docs Health" (create it if it doesn't exist) and post a comment in this format:

   ```
   📚 Docs Health Report — {today's date}
   ═══════════════════════════════════
   📄 Files scanned:          {count}
   ⏳ Stale (>30 days):       {count} ({list of filenames, or "none"})
   🚧 Thin pages (<200 words): {count} ({list of filenames, or "none"})
   🔗 Broken internal links:  {count} ({list of filenames and anchors, or "none"})

   {One or two sentences of overall health. Highlight the single highest-priority item.}
   ```

   ## Guidelines

   - Post only one comment per calendar day. If today's report already exists, stop.
   - Never edit or commit changes to any file — read only.
   - Write "unknown" for any field where data is unavailable.
   - If the "Daily Docs Health" issue doesn't exist, create it, then post the first comment.
   ```

4. Select **Commit directly to the `main` branch**.
5. Click **Commit changes**.

> [!NOTE]
> The GitHub UI path skips local compile checkpoints. GitHub Actions compiles the workflow when it runs and reports errors in the run log.

## Understand the guardrails

- Read-only permissions let the agent inspect documentation and issues.
- The GitHub tool uses the scoped proxy.
- `safe-outputs` limits the workflow to one issue comment.

## ✅ Checkpoint

- [ ] `.github/workflows/daily-docs.md` exists
- [ ] The complete workflow is committed to `main`
- [ ] You understand that compilation occurs when GitHub Actions runs the workflow
- [ ] You understand the workflow's read-only scope and output guardrail

**Previous:** [Step 10b: Design — Daily Documentation Updater](10b-design-daily-docs.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)
