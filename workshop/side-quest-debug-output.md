# Side Quest: Diagnosing Common Agent Output Patterns

> _Optional: work through this guide when a run behaves unexpectedly and you're not sure where to start — then return to [Step 9: Reading Workflow Output](09-understand-output.md)._

## 🎯 What You'll Do

Learn to recognize five common agent output patterns, understand what causes each one, and apply a specific fix. You'll also get a reusable debugging checklist you can work through whenever a run doesn't behave as expected.

---

## Quick Log Anatomy Refresher

Before diving into patterns, here's a reminder of what each log line type means:

| Line type | What it signals | Example |
|-----------|----------------|---------|
| `[plan]` | The agent is reasoning — no API call yet | `🤔 [plan] Deciding which issue to comment on` |
| `[tool]` | The agent is calling an external API | `🔧 [tool] github.list_issues → {state: open}` |
| `[result]` | Data returned from the last tool call | `📥 [result] 3 issues returned` |
| `[output]` | A write operation is about to be committed (or blocked) | `📤 [output] safe-output: add-comment (1 of 1 allowed)` |
| `[done]` | The agent finished its task | `✅ [done] Task complete` |

---

## Pattern 1: Long `[plan]` Chains with No `[tool]` Calls

**Example log:**

```
🤔 [plan]   I need to find the most-voted issue
🤔 [plan]   I should look at issues with high engagement
🤔 [plan]   I need to determine which issue has the most reactions
🤔 [plan]   Let me think about how to rank issues by reactions
🤔 [plan]   I should probably start by listing the open issues
🤔 [plan]   I'll need to compare reaction counts across issues
```

**What it means:**

The agent is stuck in a reasoning loop. It keeps planning without committing to an action. This usually happens when the task brief is ambiguous — the agent can't determine a clear starting point or doesn't know which tool to call first.

**What to do:**

Ask the `agentic-workflows` skill to simplify or clarify the task in your workflow body. Concretely:

- Replace vague goals ("find the most important issue") with specific, measurable instructions ("list open issues sorted by `reactions` and pick the first result").
- Add an explicit first step, for example: "Start by calling `github.list_issues` with `{state: open, sort: reactions}`."
- See [Side Quest: Write Better AI Task Briefs](side-quest-better-prompts.md) for prompt-engineering techniques that reduce planning loops.

---

## Pattern 2: `[tool]` Calls That Return Empty Results

**Example log:**

```
🔧 [tool]   github.list_issues  → {state: open, labels: "bug"}
📥 [result] 0 issues returned
🤔 [plan]   No issues found — nothing to do
✅ [done]   Task complete
```

**What it means:**

The tool call succeeded, but the API returned no data. The most common causes are:

- A missing or insufficient `permissions:` scope in your workflow frontmatter.
- A filter that's too narrow (for example, a label that doesn't exist in this repository).
- The repository genuinely has no matching data (zero open issues, no recent workflow runs, etc.).

**What to do:**

1. Check `permissions:` in your workflow frontmatter. If the tool needs to read issues, you need at least `issues: read`. Confirm the required scope against the tool documentation.
2. Try removing or broadening filters to rule out a data problem — for example, drop the `labels` filter and see whether issues are returned at all.
3. If permissions look correct and data exists, ask the `agentic-workflows` skill to review the tool call parameters in your workflow body.

---

## Pattern 3: `safe-output: BLOCKED (limit reached)`

**Example log:**

```
🔧 [tool]   github.add_comment  → {issue_number: 4, body: "..."}
📤 [output] safe-output: add-comment  BLOCKED (limit reached: 1 / 1)
🤔 [plan]   I have more comments to post but safe-output limit is reached
✅ [done]   Task complete (1 output blocked)
```

**What it means:**

The agent tried to write more than the `max:` value in your `safe-outputs` block allows. The extra write was silently dropped — nothing was posted for that blocked call.

**What to do:**

- If the extra write was **intentional** (you genuinely want the agent to post multiple comments), increase `max:` in your frontmatter: change `max: 1` to `max: 2` (or whatever the correct limit is).
- If the extra write was **unintentional** (the agent is posting duplicate comments), check your guidelines section. Add a rule like "Post only one comment per run. If you have already posted today, skip." to constrain the agent's behavior.

> [!TIP]
> Keep `max:` as low as possible. A lower limit means a smaller blast radius if the agent misunderstands your instructions.

---

## Pattern 4: Run Fails with `permission denied`

**Example log:**

```
🔧 [tool]   github.create_issue → {title: "Daily Status Reports", body: "..."}
❌ [error]  permission denied: issues: write is not in the workflow's permissions
```

**What it means:**

The agent attempted a write operation (creating an issue, posting a comment, updating a label, etc.) for a GitHub API scope that isn't declared in `permissions:`. The `gh-proxy` tool layer enforces this at the network level, so the call is rejected before it reaches GitHub's API.

**What to do:**

Add the missing scope to `permissions:` in your workflow frontmatter. For example, if the agent needs to create issues:

```yaml
permissions:
  issues: write
```

Then also add a corresponding entry in `safe-outputs:` to control exactly how many writes of that type are allowed:

```yaml
safe-outputs:
  create-issue:
    max: 1
```

> [!NOTE]
> `permissions:` declares the scopes the workflow _may_ use. `safe-outputs:` then constrains which write operations the agent can actually perform and how many times. Both blocks work together — a scope in `permissions:` without a matching `safe-outputs:` entry won't let the agent write anything.

---

## Pattern 5: Summary Says "Done" but Nothing Was Written

**Example log:**

```
🤔 [plan]   All instructions are satisfied — no write needed
✅ [done]   Task complete

### Summary

I reviewed the repository. No action was required this run.
```

**What it means:**

The agent ran successfully but concluded there was nothing to write. There are two common causes:

- **The instructions were satisfied without a write.** For example, if your guidelines say "post only if there are open issues labeled 'bug'" and there are none, the agent correctly skips the write.
- **The instructions were ambiguous.** The agent interpreted a condition as "not met" when you expected it to be met.

**What to do:**

Ask the `agentic-workflows` skill to review and tighten the guidelines in your workflow body:

1. Make the write condition explicit: "If X is true, always post a comment — even if the result is 'everything looks healthy'."
2. Add a fallback: "If no condition is met, post a comment summarising that no action was needed."
3. Check whether your `safe-outputs` block is missing altogether — without it, the agent cannot write anything, and the run will silently complete with no output.

---

## Debugging Checklist

Work through these steps in order when a run behaves unexpectedly:

1. **Open the live log.** Go to **Actions → your run → job name**. Look for `[error]` lines first — these are the clearest signal.
2. **Check `[plan]` density.** More than four consecutive `[plan]` lines without a `[tool]` call usually means the task brief is ambiguous.
3. **Check `[tool]` results.** If a tool call returns empty or unexpected data, verify the `permissions:` scope and narrow or broaden your filters.
4. **Check for `BLOCKED` output lines.** If you see `safe-output: BLOCKED`, decide whether to increase `max:` or add a guideline to prevent duplicate writes.
5. **Check the run summary.** Scroll past the logs to the **Summary** section. If it says "done" but nothing was written, check whether your write condition is too narrow or your `safe-outputs` block is missing.
6. **Compare the summary to the safe-output record.** Go to **Actions → your run → Details → safe-outputs step**. The safe-output record is ground truth — if the summary and the record disagree, the agent described an action it didn't actually take.
7. **Ask the `agentic-workflows` skill.** If you've worked through all six steps and the run still behaves unexpectedly, paste your workflow body and the relevant log snippet into a chat with the skill and ask it to diagnose the issue.

---

## ✅ Checkpoint

- [ ] I can recognize the five patterns in an Actions log
- [ ] I know how to fix a `[plan]`-loop by clarifying the task brief
- [ ] I know what `safe-output: BLOCKED` means and how to fix it
- [ ] I know the difference between a missing `permissions:` scope and a missing `safe-outputs:` entry
- [ ] I have the debugging checklist bookmarked for future runs

---

Return to [Step 9: Reading Workflow Output](09-understand-output.md).
