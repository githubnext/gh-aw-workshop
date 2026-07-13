# Get Reliable Data Out of Your Agent with Structured Outputs

> _When your workflow needs to pass results to the next step — or to another system — unstructured prose isn't enough. Structured outputs let you extract clean, consistent data every time._

## 🎯 What You'll Do

You'll update your agentic workflow to produce a machine-readable JSON object alongside (or instead of) a prose summary. By the end of this step your workflow will write structured data to a workflow output variable, which a later job or an external tool can consume reliably.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You are comfortable with the frontmatter basics from [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md).
- (Optional) You've read [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md) — structured outputs pair especially well with sub-agents.

## Why Structured Outputs?

A prose summary is useful for humans reading a GitHub issue comment. But the moment you want to:

- pass a count or a list to a **later job** in the same workflow,
- feed results into another tool or webhook,
- build a dashboard over time, or
- write conditional logic that branches on a specific field value,

…you need data your code can parse, not sentences your eyes have to scan.

gh-aw lets you instruct the agent to write a JSON block to a **named safe output** or to `$GITHUB_OUTPUT`, giving you both a human-readable summary and a structured payload in one run.

## Steps

### Design the output schema

Decide what fields matter for your use case. Keep schemas narrow — every extra field the agent must fill in is another source of hallucination.

A minimal example for the daily-status scenario:

```yaml
# What the agent should return
{
  "open_issues": 3,
  "merged_prs": 1,
  "has_activity": true,
  "summary": "Three issues opened; one PR merged."
}
```

Write the schema down as a comment at the top of your task brief so the agent has it in context.

### Update the task brief

Open your workflow `.md` file for editing.

**GitHub UI path:** Navigate to your workflow file in the repository and click the pencil icon (✏️) to edit it.

In the task brief section (the Markdown body below the frontmatter), add an explicit output instruction:

```
## Output format

Return a single JSON code block before your prose summary. The block must contain exactly these fields:
- `open_issues` (integer): number of issues opened in the last 24 hours
- `merged_prs` (integer): number of pull requests merged in the last 24 hours
- `has_activity` (boolean): true if either count is greater than zero
- `summary` (string, max 100 chars): one-sentence human-readable summary

Example:
```json
{
  "open_issues": 2,
  "merged_prs": 0,
  "has_activity": true,
  "summary": "Two issues opened; no PRs merged."
}
```

Do not include any text before the JSON block.
```

> [!TIP]
> Giving the agent a concrete example is the single most effective way to improve output consistency. Copy the exact field names from your schema into the example — the agent will match them.

### Capture the output in a workflow step

To make the structured data available to later jobs, add a `run:` step after the agent step that extracts the JSON from the agent's output and writes it to `$GITHUB_OUTPUT`.

```yaml
- name: Parse agent output
  run: |
    # Extract the first JSON code block from the agent output
    JSON=$(echo "$AGENT_OUTPUT" | awk '/^```json/{flag=1;next}/^```/{flag=0}flag')
    echo "report=$JSON" >> "$GITHUB_OUTPUT"
  env:
    AGENT_OUTPUT: ${{ steps.agent.outputs.result }}
```

> [!NOTE]
> The variable name `steps.agent.outputs.result` assumes your agent job step has `id: agent`. Adjust to match your actual step id.

You can then reference `${{ steps.parse-agent-output.outputs.report }}` in subsequent steps or jobs.

### Commit your changes

<details>
<summary>🖥️ GitHub UI path</summary>

1. After editing in the web editor, scroll to the bottom and click **Commit changes**.
2. Add a commit message such as `Add structured output to daily-status workflow`.
3. Click **Commit changes** to save directly to your branch.

</details>

For Terminal-path learners, compile after editing:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

Fix any errors reported, then commit and push:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "Add structured output to daily-status workflow"
git push
```

### Run the workflow and inspect the output

Trigger a manual run from the **Actions** tab:

1. Open your repository on GitHub.
2. Click **Actions** in the top navigation.
3. Select your workflow from the left sidebar.
4. Click **Run workflow** → **Run workflow**.

When the run completes, open the job log and search for the JSON block. You should see the agent's output followed by the extracted JSON that was written to `$GITHUB_OUTPUT`.

![Structured JSON output in Actions log](images/22-structured-output-log.png)

> [!TIP]
> If the JSON block is missing or malformed, refine the output instruction in your task brief. Adding phrases like "you MUST return valid JSON" or "the JSON block MUST be the very first thing in your response" improves consistency across models.

## Combining structured outputs with sub-agents

If you've completed [Step 21](21-inline-sub-agents.md), consider assigning the parsing task to a small sub-agent:

- The **worker sub-agent** analyses each item and produces a mini-JSON for that item.
- The **main agent** aggregates the mini-JSONs into a final structured summary.

This pattern scales well when you have dozens of items to process — each worker produces a clean record, and the main agent only has to combine them.

## ✅ Checkpoint

- [ ] Your task brief includes an explicit JSON output instruction with a concrete example
- [ ] Your workflow file has a `run:` step that extracts the JSON and writes it to `$GITHUB_OUTPUT`
- [ ] A manual run completes and the JSON block appears in the job log
- [ ] The extracted JSON contains all the fields you defined in your schema
- [ ] (Optional) You've wired the output to a later step or job that consumes the structured data

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Side Quest: Write Better AI Task Briefs](side-quest-11-03-better-prompts.md)
- [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
