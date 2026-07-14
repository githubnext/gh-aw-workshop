<!--
<research-metadata>
  <focus>A/B testing experiments in agentic workflows — the `experiments:` frontmatter field in gh-aw that lets you run controlled prompt-style, model, or strategy variants across real workflow executions and measure the winner with AI Credits (AIC)</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/experiments.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/token-optimization.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/syntax-agentic.md</source>
  </sources>
  <rationale>
    The full workshop curriculum through Step 22 covers workflow creation, triggers, scheduling, MCP tools, memory, sub-agents, reuse, and error handling — but no step teaches learners how to measure and improve workflow quality in a controlled way. The gh-aw `experiments:` field provides production-ready A/B testing that injects variants into prompts at runtime, tracks balanced assignment counts, and exposes AI Credits (AIC) for comparison — exactly the feedback loop practitioners need after "it works" but before "it's great". This step closes that gap.
  </rationale>
</research-metadata>
-->

# Test Prompt Variants with A/B Experiments

> _Writing a workflow that works is step one. Knowing which version works_ best _takes one experiment._

## Why This Matters

Once a workflow is running in production, the easiest improvements are often invisible: a shorter prompt, a different output structure, a more direct instruction. Without a controlled comparison, every tweak is a guess. The `experiments:` frontmatter field gives you a structured way to answer "is version B actually better?" — using your live workflow runs as the test bench.

## 🎯 What You'll Do

You'll add a two-variant A/B experiment to your daily-status workflow, observe how gh-aw assigns and tracks variants across runs, and learn to read the results using `gh aw audit`. By the end you'll have a repeatable pattern for improving any workflow with evidence.

## 📋 Before You Start

- You have a working scheduled workflow (see [Schedule Your Workflow](13-schedule-it.md)).
- You're comfortable editing YAML frontmatter and the task brief.
- You understand what AI Credits (AIC) are — they're a normalized cost metric where 1 AIC ≈ $0.01, accounting for model price differences and cache discounts.

## Steps

### Decide what to test

Pick one dimension to vary. Good first experiments:

| Dimension | Example variants |
|---|---|
| Output length / verbosity | `concise` vs `detailed` |
| Framing / tone | `formal` vs `friendly` |
| Structure | `bullets` vs `prose` |
| Prompt strategy | `step_by_step` vs `direct` |

> [!IMPORTANT]
> Test **one dimension at a time**. Two simultaneous changes make results impossible to interpret.

### Add the `experiments:` field

Open your workflow's `.md` file and add an `experiments:` block to the frontmatter. Here is an example that tests two output styles:

```yaml
---
name: Daily Status Report
on:
  schedule: daily
engine: copilot
permissions:
  issues: write
  contents: write
experiments:
  output_style: [concise, detailed]
safe-outputs:
  add_comment:
    item_number: 42
---
```

The `contents: write` permission is required because gh-aw commits experiment state to a branch named `experiments/<workflow-id>` on the first run.

### Reference the active variant in your task brief

Use `{{#if experiments.<name> }}` conditional blocks in the Markdown body of the workflow file to swap the prompt based on which variant was assigned:

```markdown
{{#if experiments.output_style == "concise" }}
Write a brief status update in no more than 5 bullet points. Skip items with no activity.
{{#else}}
Write a detailed status update with one section per category. Explain the significance of each finding.
{{#endif}}

Summarise open issues, recent pull requests, and CI status for ${{ github.repository }}.
```

gh-aw resolves these blocks at compile time, before the agent sees the prompt, so the agent always receives a clean, flat brief.

### Compile and run

After editing, recompile the workflow:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

Commit the updated `.md` and the new `.lock.yml`, then trigger the workflow manually from the **Actions** tab two or more times. Each run is assigned a variant in round-robin order — no sampling gaps.

### Read the results

After a few runs, use `gh aw audit` to compare AI Credit usage between variants:

```bash
# audit a single run (download artifacts and see token usage)
gh aw audit <run-id>

# compare two runs directly
gh aw audit <base-run-id> <comparison-run-id>
```

The diff output shows:
- **AIC delta** — did the variant cost more or less?
- **Token counts** — input/output/cache tokens per run.
- **Tool call changes** — did the variant cause the agent to make more or fewer tool calls?

Treat optimization as successful only if output quality stays acceptable — a cheaper but empty report is a regression.

### (Optional) Add a hypothesis and guardrails

For longer experiments, switch to the object form to document your hypothesis and add guardrail metrics that auto-abandon the experiment if quality drops:

```yaml
experiments:
  output_style:
    variants: [concise, detailed]
    description: "Does concise output reduce AIC without hurting reader value?"
    metric: "ai_credits"
    hypothesis: "H0: no AIC change. H1: concise reduces AIC by ≥15%."
    guardrail_metrics:
      - name: empty_output_rate
        direction: min
        threshold: 0.0
```

This metadata has no runtime effect on the first run, but it's invaluable when you revisit the experiment weeks later or share the workflow with teammates.

## ✅ Checkpoint

- [ ] Your workflow frontmatter includes an `experiments:` block with at least two variants
- [ ] Your task brief uses `{{#if experiments.<name> }}` blocks to swap behaviour by variant
- [ ] The workflow compiles without errors (`gh aw compile --validate`)
- [ ] At least two manual runs completed and each was assigned a different variant
- [ ] You have used `gh aw audit` to view token usage for at least one run
- [ ] You can explain what AIC measures and why a quality check matters alongside cost

## 📚 See Also

- [A/B Testing Experiments reference (gh-aw docs)](https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/experiments.md)
- [Token Consumption Optimization (gh-aw docs)](https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/token-optimization.md)
- [gh-aw CLI commands reference](https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/cli-commands.md)
- [Test and Improve Your Workflow](12-test-and-iterate.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
