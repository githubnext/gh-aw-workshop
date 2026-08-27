<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>BinEval evaluations (`evals:` frontmatter) for automated workflow quality verification</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/evals.md</source>
    <source>https://github.github.com/gh-aw/reference/artifacts/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>This node closes a curriculum gap between prompt experimentation and cost controls by adding a repeatable quality gate. Learners already know how to run workflows and compare variants, but they still need an automated way to verify whether a run achieved its intended outcome without manual review. Introducing `evals:` gives each run durable YES/NO quality signals through the `evals` artifact (`evals.jsonl`) and persisted eval state, which supports regression detection and evidence-based iteration over time.</rationale>
</research-metadata>
-->
# Verify Your Workflow Quality with Evals

> _Add automated YES/NO checks so every run tells you whether your workflow actually met its goal._

## :dart: What You'll Do

You'll add an `evals:` block to your workflow, define binary quality questions, run the workflow, and verify that results are recorded in the [`evals` artifact](https://github.github.com/gh-aw/reference/artifacts/#evals) and persisted for historical comparison.

## :clipboard: Before You Start

- You completed [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md).
- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You can run and inspect a workflow from [Run and Watch Your Workflow](08-run-your-workflow.md).

## Steps

### Add an `evals:` block with the skill

In your Copilot CLI session in the terminal, paste:

```prompt
/agentic-workflows add three binary eval questions to daily-status.md: one checking that a status issue was created, one checking the output includes a summary of repository activity, and one checking that no writes happened outside declared safe outputs.
```

The skill adds the `evals:` block to your frontmatter, compiles the [lock file](https://github.github.com/gh-aw/reference/compilation-process/), and shows you the diff.

<details>
<summary>:desktop_computer: Terminal path — add the evals block directly</summary>

Open `.github/workflows/daily-status.md` and add binary questions to frontmatter:

```markdown .github/workflows/daily-status.md
---
safe-outputs:
  create-issue:
    title-prefix: "Daily Repository Status"

evals:
  - id: issue_created
    question: Does the agent output confirm that a status issue was created?
  - id: includes_summary
    question: Does the agent output include a summary of repository activity from the last 24 hours?
  - id: no_unapproved_writes
    question: Does the agent output show no writes outside declared safe outputs?
---
```

Each question should test one observable claim and be answerable from agent output alone. Compile after editing:

```bash
gh aw compile daily-status
```

</details>

### Commit and trigger a run

Commit both the workflow source and the recompiled lock file, then trigger a run from the Actions UI:

```bash
git add .
git commit -m "feat: add evals to daily-status workflow"
git push
```

Go to **Actions → Daily Status Report → Run workflow** and click **Run workflow**.

### Inspect evaluation results

After the run completes:

1. Open the run's **Artifacts** section.
2. Download the `evals` artifact.
3. Open `evals.jsonl` and confirm each question has a YES/NO answer.

Example record:

```json
{"id":"issue_created","question":"Does the agent output confirm that a status issue was created?","answer":"YES","model":"small"}
```

### Use evals to catch regressions

When you update your prompt or tools, rerun the workflow and compare answers across runs. A question that flips from `YES` to `NO` is a fast signal that quality regressed and needs investigation.

To refine your questions, return to Copilot CLI and describe what you observed:

```prompt
/agentic-workflows the eval question "includes_summary" is too broad — update it to check that the output includes at least one open issue or pull request from the last 24 hours.
```

> [!TIP]
> Use `gh aw compile --watch` while iterating on eval questions to get instant feedback on compile errors.

## :white_check_mark: Checkpoint

- [ ] Your workflow frontmatter includes an `evals:` block with at least three binary questions
- [ ] `gh aw compile daily-status` succeeds after your eval changes
- [ ] You ran the workflow and downloaded the `evals` artifact
- [ ] You verified `evals.jsonl` contains YES/NO answers for each question
- [ ] You can explain how eval answer changes help detect regressions

<!-- journey: all -->
**Next:** [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md)
<!-- /journey -->
