<!-- page-journey: all -->
<!-- page-adventure: core -->
# Refine Your Workflow with Agentic Editing

_The fastest way to improve a workflow is to describe what you want in plain English and let the skill do the editing._

## 🎯 What You'll Do

You'll use the `agentic-workflows` Copilot skill — installed in your practice repository during Step 7 — to edit, debug, and optimize `daily-report-status.md` without manually hunting through the frontmatter or Markdown body.

By the end of this step, your workflow will produce more useful output, and you'll know the three prompting patterns that cover most day-to-day workflow maintenance.

## 📋 Before You Start

- Completed [Interpret Your First Run](08b-interpret-your-run.md)
- Your `daily-report-status` workflow has at least one completed run
- `.github/skills/agentic-workflows/` exists in your practice repository (created during Step 7)

## What is the agentic-workflows skill?

The `agentic-workflows` skill is a Copilot skill installed in your practice repository. It acts as a dispatcher: when you describe a workflow task in plain English and mention the skill by name, it routes your request to the right editing, debugging, or optimizing prompt and makes changes directly in your repository.

You invoke it in the GitHub Copilot **Chat** or **Agents** tab:

```text
Using the agentic-workflows skill, [your request here]
```

The skill recognizes three core task types for day-to-day workflow maintenance:

| Task type | When to use it | Example trigger phrase |
|-----------|---------------|------------------------|
| **Edit** | Improve the agent brief or frontmatter | "update the workflow to …" |
| **Debug** | Investigate unexpected output or a failed run | "debug the workflow — it ran but …" |
| **Optimize** | Reduce token usage or tighten permissions | "optimize the workflow to reduce AI Credit cost" |

If you are working locally or in a Codespace without a Copilot session, the terminal path in each section below shows the equivalent manual change.

## Edit: improve the workflow brief

After running your workflow in Step 8, you may have noticed the agent's comment was generic. You'll now make the brief more specific so the agent explains _why_ the most-reacted issue matters, not just which one it is.

Open the GitHub Copilot **Chat** or **Agents** tab in your practice repository and paste:

```text
Using the agentic-workflows skill, update .github/workflows/daily-report-status.md
so that the agent adds one sentence explaining why resolving the most-reacted issue
would benefit the team. Keep the existing safe-output constraint (at most one comment).
Run gh aw compile after the edit.
```

The skill loads the update prompt, makes the targeted change to the Markdown body, recompiles the workflow, and shows you the diff. Review the updated Markdown body and confirm the new instruction is clear and specific before committing.

<details>
<summary>🖥️ Terminal path</summary>

Open `.github/workflows/daily-report-status.md` and add one sentence to the Markdown body, such as:

```text
After identifying the most-reacted issue, write one sentence explaining why resolving it
would benefit the team, based on the issue title and description.
```

Recompile and push:

```bash
gh aw compile
git add .github/workflows/daily-report-status.md \
        .github/workflows/daily-report-status.lock.yml
git commit -m "feat: add team-benefit sentence to daily-report-status brief"
git push
```

</details>

## Debug: investigate unexpected output

If your run from Step 8 finished but the output was empty, vague, or missing entirely, use the skill to diagnose the most likely cause and propose a fix.

Paste this prompt in the GitHub Copilot **Chat** or **Agents** tab, replacing the bracketed text with what you actually observed:

```text
Using the agentic-workflows skill, debug .github/workflows/daily-report-status.md.
The last run [describe the problem — for example: "posted a comment but left the
summary blank" or "finished without posting anything"].
Suggest the most likely cause and propose one change to the workflow brief to fix it.
```

The skill reads the workflow file, identifies likely causes — such as a vague brief, a missing fallback instruction, or an over-broad safe-output surface — and proposes a targeted, minimal fix.

<details>
<summary>🖥️ Terminal path</summary>

Open the run log from the **Actions** tab and find the first `Tool call` the agent made. Then open `.github/workflows/daily-report-status.md` and add one fallback instruction to the Markdown body, such as:

```text
If no open issues have 👍 reactions, post a comment on the most recently updated
open issue instead.
```

Recompile and push the change.

</details>

## Optimize: reduce token usage

Once the workflow produces correct output, you can reduce how much AI Credit it uses per run. This matters especially for workflows that run on a schedule.

In the GitHub Copilot **Chat** or **Agents** tab, paste:

```text
Using the agentic-workflows skill, optimize .github/workflows/daily-report-status.md
to reduce token usage. Apply only changes that do not change the workflow's outcome.
Run gh aw compile after the edit.
```

The skill applies techniques such as removing redundant instructions, consolidating repeated constraints, and trimming unused safe-output declarations.

<details>
<summary>🖥️ Terminal path</summary>

Review the Markdown body of your workflow and remove any sentences that repeat the same constraint or restate something already enforced by frontmatter (for example, "post only one comment" if `safe-outputs` already limits you to one comment). Recompile after each removal so you can verify nothing breaks.

</details>

## ✅ Checkpoint

- [ ] I used the `agentic-workflows` skill or edited the file directly to improve the workflow brief
- [ ] `gh aw compile` completed without errors after the edit
- [ ] Both `daily-report-status.md` and `daily-report-status.lock.yml` are committed and pushed
- [ ] I re-ran the workflow from **Actions** and confirmed the updated output matches my intent

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
