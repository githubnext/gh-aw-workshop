<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Observe and Reduce Token Costs

> _Use this activity when you want to move from “my workflow costs something” to “I know why it costs that much, and I can lower it on purpose.”_

## 📋 Before You Start

- You completed [Build Your First Event-Driven Workflow: PR Auto-Reviewer](13-pr-reviewer-workflow.md).
- You have a working PR reviewer workflow or another workflow with at least 5 completed runs so you can compare before-and-after usage.
- If you want extra background on AIC, audit artifacts, or budget guardrails, continue later to [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) and [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).

## Build a cost baseline

Start by measuring your current pattern before you change anything:

```bash
gh aw logs <your-workflow-id> --count 5
```

Record three things from the last five runs:

| Signal | What to record | Why it matters |
|---|---|---|
| AIC | Average and highest run | Shows your baseline and worst case |
| Conclusion | Success or failure | Failed runs still spend credits |
| Model | Which model ran | Helps explain differences between runs |

If one run is much higher than the others, audit it:

```bash
gh aw audit <run-id> --parse
```

Then inspect:

- `log.md` for long agent turns or repeated reasoning
- `agent_usage.json` for token totals
- `mcp-logs/` for repeated tool calls
- `firewall.md` for blocked domains that may have forced retries or fallback behavior

## Match cost symptoms to likely causes

Use your baseline to decide what to change first:

| If you observe this | Check for this cause | First fix to try |
|---|---|---|
| AIC grows after you add more repository data | Too much raw context in the brief | Pre-filter the data in a deterministic step before passing it to the agent |
| One run is much higher than the others | The agent explored too broadly or retried tool calls | Tighten the brief and remove tools the task does not need |
| Every run costs about the same and feels high | The brief is longer than it needs to be | Shorten instructions, examples, and repeated boilerplate |
| Costs spike after adding a new schedule | The workflow runs more often than the value it creates | Reduce the schedule frequency or add conditions so no-op runs skip the agent |
| The workflow keeps talking about the same items | The agent re-processes unchanged data every run | Add [persistent memory](20-persistent-memory.md) or a deterministic diff step |

## Use the highest-leverage reduction techniques

Apply one change at a time so you can see which technique helped.

### Pass less context to the model

The cheapest token is the one you never send.

- Replace raw issue or PR dumps with a deterministic summary step.
- Pass only the fields the agent needs.
- Limit history windows when a full backlog is unnecessary.

### Make the brief more specific

Vague prompts often cost more because the agent explores, retries, or writes too much.

- State the exact output shape you want.
- Tell the agent what not to do.
- Remove duplicate instructions and long examples once the pattern is clear.

### Reduce unnecessary runs

If the workflow does not need to run, the cheapest run is zero AIC.

- Lower the schedule frequency.
- Add `if:` conditions around setup steps so you only call the agent when new data exists.
- Use `workflow_dispatch` for occasional manual analysis instead of a frequent schedule.

### Avoid re-processing unchanged work

Repeated work is repeated cost.

- Use [cache-memory or repo-memory](20-persistent-memory.md) to remember what was already handled.
- Store identifiers, timestamps, or hashes so the agent can skip items it has already seen.
- Combine memory with a deterministic pre-filter for the biggest savings.

### Keep tool usage narrow

Extra tool calls can increase cost indirectly by extending the turn and adding more reasoning.

- Expose only the tools the workflow needs.
- Prefer one targeted MCP query over several broad ones.
- When possible, fetch structured data in a deterministic step and let the agent interpret it.

### Compare quality before choosing a more expensive setup

Higher cost is only justified when it improves the outcome enough to matter.

- Compare prompt variants with [A/B experiments](23-ab-experiments.md).
- If your organisation supports multiple models, compare a lower-cost option against your current workflow before standardising on the more expensive one.

## Add hard guardrails

After you reduce cost, keep it reduced:

- Use `max-ai-credits` to cap a single run.
- Use `max-daily-ai-credits` to cap 24-hour usage.
- Use `timeout-minutes` to stop unusually long runs.
- Use [gh aw forecast](side-quest-26-01-forecast-costs.md) to size the guardrails from real history instead of guessing.

## Try it yourself

### Run one optimization cycle

1. Pick your PR reviewer workflow (or another workflow) and copy the average AIC from your last five runs.
2. Choose one technique from this page.
3. Make exactly one change to your workflow.
4. Compile your workflow:

   ```bash
   gh aw compile
   ```

5. Run the workflow at least two more times.
6. Compare the new average AIC with your baseline.
7. Keep the change only if quality still meets your bar.

Use this quick notes table:

| Baseline average AIC | Change you made | New average AIC | Quality stayed acceptable? |
|---|---|---|---|
| | | | |

### Ask an agent to suggest the next optimization

Open Copilot Chat or the Agents tab in your practice repository and send:

```text
/agentic-workflows Review my workflow brief and this audit summary.
Identify the single change most likely to reduce AIC without hurting output quality.
Explain why that change is the best next step, then apply it and run gh aw compile.
```

Paste the relevant excerpt from your `gh aw audit --parse` output below the prompt.

## ✅ Checkpoint

- [ ] You collected a five-run AIC baseline for one workflow
- [ ] You audited at least one unusually expensive run
- [ ] You identified whether your biggest cost driver was context size, run frequency, repeated work, or tool usage
- [ ] You applied exactly one optimization technique and re-ran the workflow
- [ ] You compared the new AIC average with your baseline
- [ ] You added or confirmed `max-ai-credits`, `max-daily-ai-credits`, or `timeout-minutes`
- [ ] You can name the next optimization you would test if cost is still too high

<!-- journey: all -->
Return to [Build Your First Event-Driven Workflow: PR Auto-Reviewer](13-pr-reviewer-workflow.md).
<!-- /journey -->
