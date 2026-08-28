<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 09-01g: Pattern — `tools_denials_exceeded`

## :dart: What You'll Do

You will distinguish a tool-denial limit from a timeout and adjust your workflow so the agent stops requesting tools it cannot use.

## :clipboard: Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

When the log reports `tools_denials_exceeded`, the run stopped because the agent made too many denied tool calls. It is not a timeout. Check the last denied tool call, then either allow the tool in the workflow policy or rewrite the prompt so the agent does not request it.

The message should make the cause clear:

```text
Too many tool calls were denied; the agent stopped before completing the task.
```

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
❌ tools_denials_exceeded
Too many tool calls were denied; this was not a timeout.
```

<details>
<summary>Show answer</summary>

Pattern: **Too many denied tool calls**. Inspect the denied tool and update the workflow policy or prompt instead of increasing the timeout.

</details>

<!-- journey: all -->
## :white_check_mark: Checkpoint

- [ ] I can distinguish `tools_denials_exceeded` from a timeout
- [ ] I can identify the denied tool call
- [ ] I know whether to update the tool policy or rewrite the prompt

<!-- /journey -->
