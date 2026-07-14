# Step 11a2: Compile and Run the Daily Status Workflow — Terminal Path

> _The workflow file is written — now let's validate it and see it run._

## 🎯 What You'll Do

You'll compile and validate `daily-status.md` using `gh aw compile`, then trigger the workflow manually from the GitHub Actions UI and read the output report.

## Before You Start

- You've completed [Step 11a](11a-build-daily-status-terminal.md) and pushed `daily-status.md` to `main`

## Compile and validate

Run a full compile-and-validate to confirm the workflow file is error-free:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

A successful run produces green output and writes a `.lock.yml` file next to your workflow file. That lock file is what GitHub Actions actually executes.

If you see a red error, the message names the key and the line that failed. Check indentation — two-space indentation is required throughout, and tabs are not valid. For a quick-fix table covering the five most common YAML mistakes, see [Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md).

> [!NOTE]
> If `gh aw compile` throws a YAML parse error, start by checking indentation under nested keys (`on:`, `permissions:`, `tools:`, `safe-outputs:`) — that is the most common culprit. See [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md) for broken ❌ and correct ✅ examples.

## Commit the lock file

After a successful compile, commit the generated `.lock.yml`:

```bash
git add .github/workflows/daily-status.lock.yml
git commit -m "chore: add compiled lock file for daily-status workflow"
git push
```

## Run the workflow

Open your repository on GitHub, go to **Actions → Daily Repo Status**, and click **Run workflow**. The workflow runs and posts a comment on your most recently updated open issue.

> [!TIP]
> You can also trigger the workflow from the terminal with `gh aw run daily-status`. The `workflow_dispatch` trigger in the frontmatter is what creates the **Run workflow** button in the UI.

## Read the output report

After the run completes (usually under a minute), find the comment on your issue. It should look something like:

```
📊 Daily Repo Status — 2025-01-15
══════════════════════════════════
🔀 Open pull requests:  2
🐛 Open issues:         5  (1 labeled "bug")
✅ CI status:           passing
📝 Last commit:         "feat: add daily status workflow" — 3 minutes ago

Repository looks healthy. The open PR from 3 days ago may need a review.
```

If the run failed or the output looks wrong, see [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md) for debugging guidance.

## Troubleshooting

| Common issue | What you see | How to fix it |
|---------|--------------|---------------|
| Wrong indentation under nested keys | `gh aw compile` fails with a YAML parse error | Use spaces only (no tabs), and indent child keys by exactly two spaces. |
| Missing `copilot-requests: write` | Compile succeeds but runtime fails when calling Copilot APIs | Add `copilot-requests: write` to your `permissions:` block. |
| No comment posted | Run completes but no issue comment appears | Check that at least one open issue exists; the agent will create one if none are found. |

## ✅ Checkpoint

- [ ] `gh aw compile .github/workflows/daily-status.md` reports no errors
- [ ] The `.lock.yml` file is committed and pushed to `main`
- [ ] A workflow run completed successfully in the Actions tab
- [ ] A status comment appears on an open issue in your repository

Want to use a different AI engine? These side quests walk you through switching from Copilot to [Claude](side-quest-01-02-environment-reference.md#claude) or Codex:

- ➡️ [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md) — use `engine: claude`
- ➡️ [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md) — use `engine: codex`

**Previous:** [Step 11a: Build the Daily Repo Status Workflow](11a-build-daily-status-terminal.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
