# Test Your Prompt Ideas with A/B Experiments

> _Stop guessing which prompt works better — let alternating runs tell you._

## 🎯 What You'll Do

You'll add an A/B experiment using `experiments:` and compare outcomes across runs.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You are comfortable editing YAML frontmatter and task briefs.
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).
- Need internals? Jump to [Understand how the round-robin works](#understand-how-the-round-robin-works).

## Add an experiment to your workflow

> [!TIP]
> <details>
> <summary>Prefer asking an agent with the `/agentic-workflows` skill to add the experiment. Use agents to edit agent workflows.</summary>
>
> Terminal users can run `gh aw compile --watch` for continuous recompilation.
>
> </details>

### Choose one dimension to test

Start with one change to isolate its effect: output length (`concise` vs `detailed`). Add third variant later.

### Use an agent to add the experiment (recommended)

Open your practice repository in the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or Agents tab and paste this prompt:

```text
Add an A/B experiment to `.github/workflows/daily-status.md`.
Use the `/agentic-workflows` skill.
Set `experiments: { output_style: [concise, detailed] }`.
Add conditional prompt blocks for `concise` and `detailed`.
Run `gh aw compile daily-status` and fix any errors.
Commit both workflow files.
```

### Add the experiment manually (alternative)

If you prefer to edit directly, add this to the frontmatter in `.github/workflows/daily-status.md`:

```yaml
experiments:
  output_style: [concise, detailed]
```

Below the frontmatter, add conditional blocks that swap the prompt instructions based on the active variant:

```markdown
Summarise the activity in ${{ github.repository }} since yesterday.

{{#if experiments.output_style }}
Write according to the output_style: ${{ experiments.output_style }}.
- concise: maximum 5 bullet points, one sentence each.
- detailed: structured report with sections: open issues, merged pull requests,
  CI status, and a one-paragraph summary at the top.
{{#endif}}

Always call the safe output tool — even if there is no activity.
```

Compile and commit:

```bash
gh aw compile daily-status
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add output_style A/B experiment to daily-status"
```

## Run and inspect the experiment

### Trigger two manual runs

1. Go to **Actions → Daily Status Report → Run workflow** and click **Run workflow**.
2. Open the run log once it completes. In the activation job, find the assigned variant (for example, `experiment output_style: concise`).
3. Check your safe output surface — confirm the output matches the concise variant.
4. Trigger a second manual run. This time the `detailed` variant should be assigned.
5. Compare the two outputs side by side.

### Compare assignment counts from artifacts

1. Open your first run, scroll to **Artifacts**, and download `experiment`.
2. Open the JSON file and note the counts for `concise` and `detailed`.
3. Repeat for your second run and compare the two files.
4. Confirm both variants now have one assignment each.

## Add a third variant and predict the order

1. Update the frontmatter variants to include a third option:

   ```yaml
   experiments:
     output_style: [concise, detailed, executive]
   ```

2. Update the task brief so each variant has explicit instructions:

   ```markdown
   {{#if experiments.output_style }}
   Write a report according to the output_style: ${{ experiments.output_style }}.
   - concise: Write a maximum of 5 bullet points. Each bullet is one sentence.
   - detailed: Write a structured report with sections: open issues, merged pull requests,
     and CI status. Include a one-paragraph summary at the top.
   - executive: Write an executive summary with exactly 3 bullets and one "Watch next" line.
   {{#endif}}
   ```

3. Using your confirmed 1:1 counts for `concise` and `detailed`, predict the next three assignments.
4. Run the workflow three times and compare your prediction with activation logs and `experiment` counts.

## Understand how the round-robin works

<details>
<summary>Open for the mechanism details</summary>

On each run, gh-aw:

1. Loads state from `experiments/{workflow-id}` (created on first run).
2. Picks the variant with the lowest invocation count (ties are broken by first-in-array order).
3. Saves the updated counts.
4. Uploads the `experiment` artifact.
5. Injects the selected variant into your template conditionals.

</details>

## Analyse the results

After enough runs (10+ per variant reduces variation), compare usefulness and token cost. When one variant wins, keep it as baseline. Remove the `experiments:` frontmatter field and recompile.

> [!TIP]
> Keep the experiment running until your target sample size. Removing `experiments:` early resets counts.

## ✅ Checkpoint

- [ ] Your workflow frontmatter has an `experiments:` block with at least two variants
- [ ] Your task brief uses `{{#if experiments.<name> }}` blocks to swap instructions (the active variant is available as `${{ experiments.<name> }}`)
- [ ] `gh aw compile daily-status` passes with no errors
- [ ] The first manual run log shows the `concise` variant was assigned
- [ ] The second manual run log shows the `detailed` variant was assigned
- [ ] You can compare `experiment` artifact counts across runs
- [ ] You can predict and verify third-variant assignment order from lowest-count selection with first-in-array tie breaks
- [ ] You can explain what you would do once a winning variant is identified

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Side Quest: Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
