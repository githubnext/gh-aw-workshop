<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: How the `agentic-workflows` Skill Dispatcher Works

> _Before you send another `/agentic-workflows` prompt, it helps to know what happens between your request and the diff you review._

## :dart: What You'll Do

You'll learn what the `agentic-workflows` Copilot skill actually is, how it recognizes edit, debug, and optimize requests, and what to do if you're working without a live Copilot session.

## :clipboard: Before You Start

- Completed [Interpret Your First Run](08b-interpret-your-run.md)
- `.github/skills/agentic-workflows/` exists in your practice repository (created during Step 7)

## Steps

### Understand what the skill is

The `agentic-workflows` skill is a Copilot skill installed in your practice repository. It acts as a dispatcher: when you describe a workflow task in plain English and mention the skill by name, it routes your request to the right editing, debugging, or optimizing prompt and makes changes directly in your repository.

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

The phrase you use matters less than the intent — the dispatcher matches against what you're trying to accomplish, not an exact keyword.

### Know the manual fallback

If you are working locally or in a Codespace without a Copilot session, you can still apply each of the skill's task types by hand: open the workflow's Markdown body directly, make the targeted change described in each task type above, then run `gh aw compile` to regenerate the lock file before committing.

## :white_check_mark: Checkpoint

- [ ] I can explain what the `agentic-workflows` skill does in one sentence
- [ ] I can name the three task types the skill recognizes: edit, debug, optimize
- [ ] I know the manual fallback if no Copilot session is available

**Return to the main adventure:** [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)
