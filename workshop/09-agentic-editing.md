<!-- page-journey: all -->
<!-- page-adventure: core -->
# Refine, Test, and Improve Your Workflow

_The fastest path to a better workflow is a tight loop: describe what you want, review the diff, test, and compare the result._

## :dart: What You'll Do

You'll use the `agentic-workflows` Copilot skill — installed in your practice repository during Step 7 — to edit, debug, and optimize `daily-report-status.md`, then trigger a fresh run and compare the output against the previous one.

By the end of this step, your workflow will produce more useful output, and you'll have a repeatable iteration loop you can use any time the workflow output is vague, incorrect, or missing something important.

## :clipboard: Before You Start

- Completed [Interpret Your First Run](08b-interpret-your-run.md)
- Your `daily-report-status` workflow has at least one completed run
- `.github/skills/agentic-workflows/` exists in your practice repository (created during Step 7)

## What is the agentic-workflows skill?

The `agentic-workflows` skill is a Copilot skill installed in your practice repository. It acts as a dispatcher: when you describe a workflow task in plain English and mention the skill by name, it routes your request to the right editing, debugging, or optimizing prompt and makes changes directly in your repository.

You invoke it in Copilot CLI in your Codespace terminal:

```bash
gh copilot
```

Then send:

```prompt
/agentic-workflows [your request here]
```

The skill recognizes three core task types for day-to-day workflow maintenance:

| Task type | When to use it | Example trigger phrase |
|-----------|---------------|------------------------|
| **Edit** | Improve the agent brief or [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) | "update the workflow to …" |
| **Debug** | Investigate unexpected output or a failed run | "debug the workflow — it ran but …" |
| **Optimize** | Reduce token usage or tighten [permissions](https://github.github.com/gh-aw/reference/permissions/) | "optimize the workflow to reduce [AI Credit](https://github.github.com/gh-aw/reference/cost-management/) cost" |

If you are working locally or in a Codespace without a Copilot session, the terminal path in each section below shows the equivalent manual change.

## Start With One Concrete Observation

Open the latest run in the **Actions** tab and look for one thing you want to improve.

Good examples:

- The summary is too generic.
- An important detail is missing.
- The tone feels too stiff.
- The formatting is inconsistent.

Pick only one problem for this round. Small, isolated changes make it much easier to tell what actually improved the result.

## Edit: improve the workflow brief

After reviewing the run output, you may have noticed the agent's comment was generic. You'll now make the brief more specific so the agent explains _why_ the most-reacted issue matters, not just which one it is.

In your Codespace terminal, run `gh copilot` and paste:

```prompt
/agentic-workflows update .github/workflows/daily-report-status.md
so that the agent adds one sentence explaining why resolving the most-reacted issue
would benefit the team. Keep the existing [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) constraint (at most one comment).
```

The skill loads the update prompt, makes the targeted change to the Markdown body, recompiles the workflow, and shows you the diff. Review the updated Markdown body and confirm the new instruction is clear and specific before committing.

<details>
<summary>:desktop_computer: Terminal path</summary>

Open `.github/workflows/daily-report-status.md` and add one sentence to the Markdown body, such as:

```text
After identifying the most-reacted issue, write one sentence explaining why resolving it
would benefit the team, based on the issue title and description.
```

Recompile and push:

```bash
gh aw compile
git add .
git commit -m "feat: add team-benefit sentence to daily-report-status brief"
git push
```

</details>

## Debug: investigate unexpected output

If your run from Step 8 finished but the output was empty, vague, or missing entirely, use the skill to diagnose the most likely cause and propose a fix.

In your Codespace terminal, run `gh copilot`, then paste this prompt, replacing the bracketed text with what you actually observed:

```prompt
/agentic-workflows debug .github/workflows/daily-report-status.md.
The last run [describe the problem — for example: "posted a comment but left the
summary blank" or "finished without posting anything"].
Suggest the most likely cause and propose one change to the workflow brief to fix it.
```

The skill reads the workflow file, identifies likely causes — such as a vague brief, a missing fallback instruction, or an over-broad safe-output surface — and proposes a targeted, minimal fix.

<details>
<summary>:desktop_computer: Terminal path</summary>

Open the run log from the **Actions** tab and find the first `Tool call` the agent made. Then open `.github/workflows/daily-report-status.md` and add one fallback instruction to the Markdown body, such as:

```text
If no open issues have 👍 reactions, post a comment on the most recently updated
open issue instead.
```

Recompile and push the change.

</details>

## Optimize: reduce token usage

Once the workflow produces correct output, you can reduce how much [AI Credit](https://github.github.com/gh-aw/reference/cost-management/#ai-credits-aic) it uses per run. This matters especially for workflows that run on a [schedule](https://github.github.com/gh-aw/reference/triggers/#scheduled-triggers-schedule).

In your Codespace terminal, run `gh copilot`, then paste:

```prompt
/agentic-workflows optimize .github/workflows/daily-report-status.md
to reduce token usage. Apply only changes that do not change the workflow's outcome.
```

The skill applies techniques such as removing redundant instructions, consolidating repeated constraints, and trimming unused safe-output declarations.

<details>
<summary>:desktop_computer: Terminal path</summary>

Review the Markdown body of your workflow and remove any sentences that repeat the same constraint or restate something already enforced by frontmatter (for example, "post only one comment" if `safe-outputs` already limits you to one comment). Recompile after each removal so you can verify nothing breaks.

</details>

## Commit Both Workflow Files

Commit both the source workflow and the recompiled lock file:

```bash
git add .
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

## :white_check_mark: Checkpoint

- [ ] I identified one specific problem from a real workflow run
- [ ] I used the `/agentic-workflows` skill (or made a manual edit) to address it
- [ ] The compiled lock file was updated and committed alongside the workflow source
- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed and pushed
- [ ] I compared the new run with the previous run and decided what to change next

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
