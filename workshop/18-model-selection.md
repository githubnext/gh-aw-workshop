# Step 18: Choose and Configure Your AI Model

> _The model powering your agent is a first-class configuration choice — picking the right one changes what your workflow can do._

## 🎯 What You'll Do

You'll learn how to specify a particular AI model in your workflow's frontmatter, understand the tradeoffs between different models, and browse the GitHub Models marketplace to find models suited to your use case.

## 📋 Before You Start

- Completed [Step 13: Schedule Your Workflow](13-schedule-it.md) (or at minimum [Step 12: Test and Iterate](12-test-and-iterate.md))
- Your daily-status workflow runs successfully

## Steps

### 1. Understand the default

When you omit an `engine:` block in your workflow frontmatter, `gh-aw` uses a default model chosen by the platform. That's fine for getting started, but as your workflows grow more complex you may want a model that is faster, cheaper, more capable, or specialised for a certain type of task.

### 2. Browse available models

Visit the [GitHub Models marketplace](https://github.com/marketplace/models) to see which models are available. Each model listing shows:

- **Context window** — how much text the model can process in one request. Larger windows handle longer `$GITHUB_OUTPUT` outputs and bigger data payloads.
- **Strengths** — some models excel at code generation, others at summarisation or reasoning.
- **Rate limits** — free-tier limits vary by model; pick one that fits your workflow frequency.

> [!TIP]
> For a scheduled daily-summary workflow, a mid-size model (8 B–70 B parameters) is usually the best balance of quality, speed, and cost.

### 3. Specify a model in your workflow

Open your workflow file (e.g., `.github/workflows/daily-status.md`).

<details>
<summary>🖥️ GitHub UI — edit in your browser</summary>

1. Navigate to `.github/workflows/daily-status.md` in your repository on GitHub.
2. Click the **pencil icon (✏️)** to open the editor.
3. Add the `engine:` block shown below to the frontmatter.
4. Click **Commit changes**.

</details>

Inside the opening `---` / `---` frontmatter block, add an `engine:` block with a `model:` field:

```yaml
---
name: Daily Status Report
on:
  schedule:
    - cron: "0 9 * * *"
  workflow_dispatch:
permissions:
  contents: read
engine:
  model: openai/gpt-4o-mini
---
```

> [!NOTE]
> Model identifiers follow the format `<provider>/<model-name>`. You can find the exact string on each model's page in the [GitHub Models marketplace](https://github.com/marketplace/models) — look for the **Use this model** button or the **API** tab.

### 4. Validate the change

If you have the `gh aw` CLI available, validate your frontmatter before committing:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

A clean compile means the frontmatter is syntactically correct. UI-first learners can skip this step and let GitHub Actions surface any errors on the next run.

### 5. Trigger a manual run

1. Go to **Actions** in your repository.
2. Select **Daily Status Report** from the left sidebar.
3. Click **Run workflow → Run workflow**.
4. Open the run log and look at the model used in the agent step — it should now reflect your chosen model.

### 6. Compare outputs (optional)

Run the workflow twice with two different `engine: model:` values and compare the summaries. Notice differences in:

- **Tone** — some models are more concise, others more verbose.
- **Speed** — lighter models complete faster.
- **Accuracy** — larger models catch subtle patterns in the commit log.

> [!WARNING]
> Switching to a very large model may exhaust free-tier rate limits quickly if your workflow runs on a tight schedule. Check the marketplace rate-limit card for your chosen model before committing to it.

## ✅ Checkpoint

- [ ] Your frontmatter includes an `engine:` block with a `model:` field pointing to your chosen model
- [ ] `gh aw compile --validate` (or a successful Actions run) confirms no errors
- [ ] A manual run completes and the log shows the agent using your chosen model
- [ ] You can explain in one sentence why context-window size matters for data-heavy workflows

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
