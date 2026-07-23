<!-- page-journey: all -->
<!-- page-adventure: core -->
# Test and Improve Your Workflow

_The fastest path to a better workflow is a tight loop: change one thing, compile, test, and compare the result._

## 🎯 What You'll Do

You'll make one small improvement to your workflow, recompile it before testing, trigger a fresh run, and compare the new output against the previous one.

By the end of this step, you'll have a repeatable iteration loop you can use any time the workflow output is vague, incorrect, or missing something important.

## 📋 Before You Start

- You have a working workflow draft from [Refine Your Workflow with Agentic Editing](09-agentic-editing.md) or an equivalent earlier build step in your chosen path.
- You have at least one completed workflow run to inspect.
- You can edit the workflow in a terminal, Codespace, or Copilot agent session.

## Start With One Concrete Observation

Open the latest run in the **Actions** tab and look for one thing you want to improve.

Good examples:

- The summary is too generic.
- An important detail is missing.
- The tone feels too stiff.
- The formatting is inconsistent.

Pick only one problem for this round. Small, isolated changes make it much easier to tell what actually improved the result.

## Make One Targeted Change

Open your workflow source file, such as `.github/workflows/daily-report-status.md`, and change only one instruction in the Markdown body or the [YAML frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) at the top of the file.

Examples of focused changes:

- ask for a shorter or more structured output format
- name one missing field the agent should include
- add a fallback instruction for empty results
- tighten one permission or safe-output rule

If you are using a Copilot agent to edit the file, tell it to make the change, review the diff, and then run `gh aw compile` before testing.

> [!IMPORTANT]
> Compile after every workflow edit before you test it. GitHub Actions runs the compiled `.lock.yml` file, not the source `.md` file, so skipping `gh aw compile` means you are testing stale workflow logic.

## Compile Before You Test

From your repository root, run:

```bash
gh aw compile
```

This updates the compiled lock file that GitHub Actions actually executes.

If the compiler reports an error, fix that first. Do not start a new test run until compilation succeeds.

> [!TIP]
> If you expect to make several small edits in a row, `gh aw compile --watch` can speed up the loop by recompiling after each save.

## Commit Both Workflow Files

After `gh aw compile` succeeds, commit both the source workflow and the regenerated lock file:

```bash
git add .github/workflows/daily-report-status.md .github/workflows/daily-report-status.lock.yml
git commit -m "refine daily-report-status workflow output"
git push
```

If your workflow uses a different filename, stage that `.md` file and its matching `.lock.yml` file instead.

## Trigger a Fresh Run and Compare

Use [**workflow_dispatch**](https://github.github.com/gh-aw/reference/triggers/) from the **Actions** tab to trigger a new run. Then compare the latest result with the previous one.

Ask yourself:

- Did the new run reflect the change you made?
- Is the output more useful than before?
- Did you improve the original problem without creating a new one?

If yes, keep the change. If not, revert the change and try a different adjustment.

If you want a stricter review loop, score each run for accuracy, completeness, and tone before you decide what to change next.

## ✅ Checkpoint

- [ ] I identified one specific problem from a real workflow run
- [ ] I changed only one instruction or configuration detail before testing again
- [ ] I ran `gh aw compile` after the edit and before triggering the next run
- [ ] I committed both the workflow `.md` file and the regenerated `.lock.yml` file
- [ ] I compared the new run with the previous run and decided what to change next

<!-- journey: all -->
**Next:** [Build Your First Event-Driven Workflow: PR Auto-Reviewer](13-pr-reviewer-workflow.md)
<!-- /journey -->
