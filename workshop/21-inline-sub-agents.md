<!--
<research-metadata>
  <focus>Inline sub-agents — the `## agent: \`name\`` syntax in gh-aw that lets a workflow define specialised worker agents directly inside a single Markdown file, with per-agent `model:` overrides</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/subagents.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/token-optimization.md</source>
  </sources>
  <rationale>
    The existing curriculum covers MCP tools, shared workflow reuse, persistent memory, and conditional logic — but nothing on how to decompose a workflow into multiple agents within a single file. Learners who follow the full path end up with one monolithic prompt running on an expensive frontier model even for trivial per-item tasks. This step closes that gap by introducing the planner-worker pattern.
  </rationale>
</research-metadata>
-->

# Split Complex Workflows with Inline Sub-Agents

> _One workflow file, multiple specialised agents — each doing exactly one thing, at the right cost._

## 🎯 What You'll Do

You'll add an inline sub-agent to your daily-status workflow so the main agent can stay focused on planning and final writing while a smaller worker handles one repeated task. By the end of this step, your workflow will be easier to scale without turning the whole prompt into one long, repetitive brief.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You understand YAML frontmatter from [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md).
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Understand the planner-worker split

When your workflow repeats the same small job for many items, keep the main agent focused on the overall plan and final output. Move the repeated item-by-item work into a sub-agent.

A sub-agent is just a helper you define inside the same workflow file. In this step, you only need one syntax rule: start the helper with a level-2 heading that looks like `## agent: \`name\``. Put the helper brief under that heading, then call that helper by name from the main workflow brief.

> 🤔 **Predict:** Look at your current workflow. Which instruction repeats once per issue, pull request, or file?
>
> [!TIP]
> Want the full rules for names, frontmatter, model aliases, and block placement? Use the [Side Quest: Sub-Agent Syntax Reference](side-quest-21-01-sub-agent-syntax.md). Stay on this page if you only want the main path.

## Apply the pattern to your workflow

### Pick one repeated task

Open your workflow file and choose one bounded task that repeats for each item, such as summarizing one issue or classifying one pull request.

✏️ **Write down two things before you edit:**

- the worker name you want to use
- the one-sentence job that worker should do

### Add one sub-agent block

At the bottom of the file, add a worker block like this:

```markdown
## agent: `issue-summarizer`
---
description: Summarizes a single open issue in one sentence
model: small
---

Read the title and body of one GitHub issue. Return exactly one sentence
that explains what the issue is asking for and its current status.
```

Keep the worker brief narrow. If it can answer with one item at a time, it belongs here.

### Update the main task brief to call the worker

In the main workflow brief, tell the orchestrator when to use the worker:

```markdown
You produce a daily repository health digest.

1. Fetch all open issues (title, body, number).
2. For each issue, use the `issue-summarizer` agent to produce a
   one-sentence summary.
3. Compile the summaries into a numbered list, ordered by issue number.
4. Post the list as a comment on the repository's main tracking issue.
```

✏️ **Try it:** Change one vague instruction in the parent brief into a direct sub-agent call by name.

### Compile and check the result

From the repository root, run:

```bash
gh aw compile
```

> [!TIP]
> If you want faster feedback while editing, run `gh aw compile --watch` in a second terminal.

The compile should finish without errors and regenerate your workflow's `.lock.yml` file.

### Run and verify

Trigger a manual run. In the Actions log, confirm the parent agent calls your worker and then uses the worker result in the final summary.

## ✅ Checkpoint

- [ ] You identified one repeated task in your workflow that fits a sub-agent
- [ ] You wrote a worker name and one-sentence job before editing the file
- [ ] Your workflow file now includes at least one `## agent: \`name\`` block
- [ ] You updated the main brief to call the sub-agent by name
- [ ] `gh aw compile` completed without errors
- [ ] Your workflow's `.lock.yml` file was regenerated after the compile
- [ ] A manual run completed and the Actions log showed the sub-agent being called
- [ ] The final workflow output used the sub-agent result

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
