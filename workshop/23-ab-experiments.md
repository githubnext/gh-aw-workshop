<!--
<research-metadata>
  <focus>The `experiments:` frontmatter field in gh-aw — a built-in A/B testing primitive that
round-robins prompt variants across runs, records assignment counts as workflow artifacts,
and lets authors compare outcomes with `gh aw audit`.</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/experiments.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/token-optimization.md</source>
  </sources>
  <rationale>
    The existing curriculum (steps 1–22) teaches learners to build, schedule, add memory, decompose
    into sub-agents, and handle errors — but never shows them how to measure whether a prompt
    change actually helps. Learners iterate on task briefs by feel, with no data. This step closes
    that gap by introducing the `experiments:` field as the principled path from "I think this
    prompt is better" to "I have alternating-run data showing this prompt is better."
  </rationale>
</research-metadata>
-->

# Test Your Prompt Ideas with A/B Experiments

> _Stop guessing which prompt works better — let alternating runs tell you._

## 🎯 What You'll Do

You'll add an A/B experiment to your agentic workflow using the `experiments:` frontmatter field. By the end of this step, your workflow will automatically alternate between two prompt variants on successive runs, track assignment counts as a workflow artifact, and give you the data you need to decide which variant to keep.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You are comfortable editing YAML frontmatter and task briefs.
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Why Measure Instead of Guessing

Every time you rewrite a task brief you are running an experiment — you just have no data from it. Two rewrites later you have no idea whether the last change helped or hurt, and you cannot go back. The `experiments:` field turns that loop into a measured one:

| Without experiments | With experiments |
|---|---|
| Pick one version, push it, hope | Both versions run on alternating runs |
| No baseline to compare against | Assignment counts stored as artifact |
| Guessing which is better | Compare run outputs side by side with real counts |

## Understand how the round-robin works

Each run, gh-aw:

1. Loads experiment state from the `experiments/{workflow-id}` git branch (created automatically on first run).
2. Picks the variant with the lowest invocation count — ties broken by array order.
3. Saves the updated counter back.
4. Uploads state as a workflow artifact named `experiment` (30-day retention).
5. Injects the variant name so you can use `{{#if experiments.<name> == "<variant>" }}` in your task brief.

The first run gets the first variant in your array. The second run gets the second. They alternate until you stop the experiment.

> [!NOTE]
> The experiment branch (`experiments/{workflow-id}`) is created automatically. You do not need to create it yourself. gh-aw needs `contents: write` permission to save state — you already have this if your workflow writes any safe output.

## Add an experiment to your workflow

### Choose one dimension to test

A good experiment changes exactly one thing. Pick a single dimension from your task brief — for example:

- **Output length** — concise bullets vs. a detailed prose report
- **Reasoning depth** — scan only recent activity vs. scan all open items
- **Tone** — formal vs. casual language

> [!TIP]
> Resist the urge to test two things at once. If you change both output length and tone in the same experiment, you cannot tell which change drove any difference you see.

### Add the `experiments:` block to your frontmatter

Open your workflow file at `.github/workflows/daily-status.md` and add `experiments:` at the top level of the frontmatter:

```yaml
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: write
  issues: write
experiments:
  output_style: [concise, detailed]
---
```

What each part does:

| Part | Purpose |
|---|---|
| `experiments:` | Top-level key that enables the A/B testing primitive. |
| `output_style` | The experiment name. Must match `[a-zA-Z_][a-zA-Z0-9_]*` — `lowercase_with_underscores` is the recommended convention. Names that don't match this pattern are silently skipped at compile time. |
| `[concise, detailed]` | The two variants. First variant runs first; they alternate each run. |

### Update your task brief to use the variant

Below the frontmatter, add conditional blocks that swap the prompt instructions based on the active variant:

```markdown
Summarise the activity in ${{ github.repository }} since yesterday.

{{#if experiments.output_style == "concise" }}
Write a maximum of 5 bullet points. Each bullet is one sentence.
{{#else}}
Write a structured report with sections: open issues, merged pull requests,
and CI status. Include a one-paragraph summary at the top.
{{#endif}}

Always call the safe output tool — even if there is no activity.
```

The `{{#if experiments.output_style == "concise" }}` block is resolved before the agent sees the prompt. From the agent's perspective, only one set of instructions exists on any given run.

### Compile and push

Compile the workflow to regenerate the lock file:

```bash
gh aw compile daily-status
```

Push the changes:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add output_style A/B experiment to daily-status"
git push
```

> [!TIP]
> Use `gh aw compile --watch` to recompile automatically as you edit the workflow file.

## Run and inspect the experiment

### Trigger two manual runs

1. Go to **Actions → Daily Status Report → Run workflow** and click **Run workflow**.
2. Open the run log once it completes. In the activation job, find the step summary that says which variant was assigned (for example, `experiment output_style: concise`).
3. Check your safe output surface — confirm the output matches the concise variant.
4. Trigger a second manual run. This time the `detailed` variant should be assigned.
5. Compare the two outputs side by side.

### Check the experiment artifact

Each run uploads its assignment data as a workflow artifact:

1. Open a completed run in **Actions**.
2. Scroll to **Artifacts** and download `experiment`.
3. The JSON file inside shows the current assignment counts for each variant.

## Analyse the results

After enough runs, compare the outputs side by side:

- **Output quality** — do your teammates find one format more useful?
- **Run duration** — does one variant take longer?
- **Token cost** — the detailed variant almost certainly uses more AI credits; is the extra quality worth it?

There is no universal rule for how many runs to collect before deciding, because it depends on how much the outputs vary and how confident you need to be. A practical starting point: wait until each variant has run at least 10 times and you can see a consistent pattern rather than random fluctuation. For high-stakes changes, collect more.

When one variant clearly wins, rewrite your baseline to use it, remove the `experiments:` block, and recompile.

> [!TIP]
> Do not remove the `experiments:` block until you have reached your target sample size. Removing it early resets the state and invalidates your counts.

## ✅ Checkpoint

- [ ] Your workflow frontmatter has an `experiments:` block with at least two variants
- [ ] Your task brief uses `{{#if experiments.<name> == "<variant>" }}` blocks to swap instructions
- [ ] `gh aw compile daily-status` passes with no errors
- [ ] The first manual run log shows the `concise` variant was assigned
- [ ] The second manual run log shows the `detailed` variant was assigned
- [ ] You can download the `experiment` artifact and see assignment counts in the JSON file
- [ ] You can explain what you would do once a winning variant is identified

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Experiments reference](https://github.github.com/gh-aw/reference/experiments/)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Side Quest: Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
