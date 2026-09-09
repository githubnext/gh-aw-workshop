<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: How the `agentic-workflows` Skill Dispatcher Works

> _One skill, three jobs — knowing which trigger phrase to use saves you from writing prompts from scratch every time._

## :dart: What You'll Do

Learn how the `agentic-workflows` Copilot skill routes your plain-English request to the right editing, debugging, or optimizing prompt, and practice choosing the right trigger phrase for a given situation.

## :clipboard: Before You Start

- You have `.github/skills/agentic-workflows/` in your practice repository (created during [Step 7](07-your-first-workflow.md)).
- You can open Copilot CLI with `gh copilot` in your Codespace terminal.

## Steps

### Understand the dispatcher model

The `agentic-workflows` skill acts as a dispatcher: when you describe a workflow task in plain English and mention the skill by name, it routes your request to the right editing, debugging, or optimizing prompt and makes changes directly in your repository.

You invoke it in Copilot CLI in your Codespace terminal:

```bash
gh copilot
```

Then send:

```prompt
/agentic-workflows [your request here]
```

### Learn the three task types

The skill recognizes three core task types for day-to-day workflow maintenance:

| Task type | When to use it | Example trigger phrase |
|-----------|---------------|------------------------|
| **Edit** | Improve the agent brief or [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) | "update the workflow to …" |
| **Debug** | Investigate unexpected output or a failed run | "debug the workflow — it ran but …" |
| **Optimize** | Reduce token usage or tighten [permissions](https://github.github.com/gh-aw/reference/permissions/) | "optimize the workflow to reduce [AI Credit](https://github.github.com/gh-aw/reference/cost-management/) cost" |

If you are working locally or in a Codespace without a Copilot session, you can still make each type of change manually — open the workflow file, make the targeted edit, then run `gh aw compile` before committing.

### Practice matching a request to a task type

For each scenario below, decide which task type (Edit, Debug, or Optimize) fits best before revealing the answer.

**Scenario A:** Your workflow's daily comment is too generic and you want it to explain *why* something matters, not just *what* happened.

<details>
<summary>Reveal answer</summary>

**Edit.** You're improving the task brief's content, not fixing a failure or reducing cost.

</details>

**Scenario B:** Your last run finished green, but no comment or issue appeared anywhere in the repository.

<details>
<summary>Reveal answer</summary>

**Debug.** Something went wrong between "the agent decided to write" and "the write actually happened" — that's an investigation, not a content edit.

</details>

**Scenario C:** Your workflow works correctly, but you noticed it consumes more AI Credits than you'd like on a workflow that runs daily.

<details>
<summary>Reveal answer</summary>

**Optimize.** The behavior is correct; you're tuning for lower token cost.

</details>

### Try writing your own trigger phrase

Pick one real observation about your own workflow (from a recent run) and write a one-sentence trigger phrase using the task-type table above. Send it to the skill in Copilot CLI and review the diff it proposes before accepting.

## :white_check_mark: Checkpoint

- [ ] You can explain what the `agentic-workflows` skill dispatcher does in one sentence
- [ ] You can name the three task types and one trigger phrase for each
- [ ] You correctly matched all three practice scenarios to a task type
- [ ] You sent one real request to the skill and reviewed its proposed diff

**Return to the main adventure:** [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)
