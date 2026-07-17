# Side Quest: Frontmatter Deep Dive — Part C: Token and Usage Metadata

> _Optional continuation of [Part B](side-quest-11-08-frontmatter-tools-outputs.md): covers how the model reports token counts, stop reasons, and model metadata after each run. Return to the main path when done._

## 📋 Before You Start

You have completed [Part B](side-quest-11-08-frontmatter-tools-outputs.md) and your workflow has run at least once successfully.

---

## Where usage metadata appears

After each agentic workflow run, the GitHub Actions log prints a usage summary produced by the model. Open a completed run in the Actions UI and look for a block like this near the end of the agent step:

```
model_metadata:
  model: claude-3-5-sonnet-20241022
  provider: anthropic
usage:
  input_tokens: 4821
  output_tokens: 312
  stop_reason: end_turn
```

You do not configure this output — the runtime writes it automatically so you can track cost and debug unexpected stops.

---

## Token counts

| Field | What it measures |
|-------|-----------------|
| `input_tokens` | Every token the model received — your task brief, injected context, and tool call results. A higher value usually means more data was passed into the model. |
| `output_tokens` | Every token the model generated — reasoning steps, tool calls it issued, and the final reply. Most billing is calculated from this number. |

Tracking `input_tokens` and `output_tokens` across runs tells you whether a prompt change actually reduced consumption or just moved tokens from one side to the other.

---

## `stop_reason`

The `stop_reason` field records why the model stopped generating text. The three values you are most likely to see are:

| Value | Meaning |
|-------|---------|
| `end_turn` | The model reached a natural stopping point and completed its task. This is the expected value for a successful run. |
| `max_tokens` | The model reached the output token limit before finishing. If you see this on a well-formed run, consider splitting the work into smaller steps or reducing the amount of context passed in. |
| `tool_use` | The model paused to issue a tool call. You typically see this mid-session in multi-step traces, not at the final summary. |

**✏️ Try it:** Open the Actions log for your latest run and find the usage block. Record the values of `input_tokens`, `output_tokens`, and `stop_reason`.

---

## `model_metadata`

The `model_metadata` block records which model served the request:

| Field | Purpose |
|-------|---------|
| `model` | The exact model identifier, for example `claude-3-5-sonnet-20241022`. Useful when you switch models and want to compare token counts side by side. |
| `provider` | The model provider, for example `anthropic` or `openai`. Matches the `engine:` value you set in frontmatter. |

---

## ✅ Checkpoint

- [ ] You can locate the usage summary block in a completed Actions run
- [ ] You can explain the difference between `input_tokens` and `output_tokens`
- [ ] You know what `stop_reason: end_turn` means and what `max_tokens` signals
- [ ] You can identify which model served the request using `model_metadata`

---

Return to [Step 11: Build — Daily Repo Status Workflow](11a-build-daily-status.md).

## 📚 See Also

- [Token optimization guide](https://github.github.com/gh-aw/guides/token-optimization/)
- [Engine and model configuration](https://github.github.com/gh-aw/reference/frontmatter/#engine)
- [About Workflows](https://github.github.com/gh-aw/introduction/overview/)
