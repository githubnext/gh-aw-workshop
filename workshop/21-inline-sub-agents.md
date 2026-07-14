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

You'll add inline sub-agents to your daily-status workflow so that cheap, focused worker agents handle repetitive per-item tasks while a frontier model handles planning and synthesis. By the end of this step your workflow will run faster and cost less, without losing output quality.

## 📋 Before You Start

- You have a working agentic workflow from the build steps ([Step 11a](11a-build-daily-status.md) or equivalent).
- You understand YAML frontmatter from [Step 7: Write Your First Agentic Workflow](07-your-first-workflow.md).
- You know how to compile a workflow from [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Why Split Into Sub-Agents?

Every workflow you have built so far runs as a single agent prompt. That works well for small tasks, but as a workflow grows it develops two expensive habits:

- **The frontier model reads everything.** Even a simple "summarize this file" call uses frontier-model tokens when a `small` model would do it for roughly 10–20× less cost.
- **Context bloat.** A monolithic prompt that gathers data, classifies items, writes the summary, and posts the result carries all that context in one call chain. Errors at any stage contaminate the whole context window.

> 🤔 **Predict:** Look at your existing daily-status workflow brief. Identify which parts repeat across multiple items (issues, PRs, files). List them before reading the "Identify the repetitive tasks" step below — then compare your list.

Inline sub-agents solve both problems. You define specialised workers directly in the same Markdown file. At compile time, `gh-aw` extracts each sub-agent block and writes it to the engine-specific agents directory. The parent (orchestrator) agent then calls workers by name and receives compact, structured results.

## Sub-Agent Syntax

Define a sub-agent anywhere after the main workflow content using a level-2 heading of the form `## agent: \`name\``:

```markdown
## agent: `file-summarizer`
---
description: Summarizes the content of a file in a few concise sentences
model: small
---
You are a file summarization assistant. When given a file path, read the
file and return a brief summary (2–4 sentences) describing its purpose
and key contents. Be concise and factual.
```

Key rules at a glance:

- **Name:** backtick-wrapped, lowercase letters/digits/hyphens/underscores, starts with a letter
- **Block end:** the next `##` heading or end of file — no closing marker needed
- **Frontmatter:** only `description` and `model` are supported; all other fields are stripped
- **Model:** use `small` for cheap worker tasks, `large` for complex reasoning, `inherited` to match the parent

> [!TIP]
> For the full name rules, block boundary rules, supported frontmatter fields, and model alias table, see the [Side Quest: Sub-Agent Syntax Reference](side-quest-21-01-sub-agent-syntax.md).

## Steps

### Identify the repetitive tasks in your workflow

Open your existing workflow file and read through the task brief. Look for any action that:

- repeats across multiple items (issues, pull requests, files)
- does a single bounded thing (read and summarise, classify, extract)
- does not need to reason about the overall result

These are good candidates to delegate to a `small` sub-agent.

### Add sub-agent blocks at the bottom of the file

After all main workflow content, add one `## agent: \`name\`` block per worker. Example for a daily-status workflow:

```markdown
## agent: `issue-summarizer`
---
description: Summarizes a single open issue in one sentence
model: small
---
You receive the title and body of a GitHub issue. Return exactly one
sentence that captures what the issue is requesting and its current
status. Be factual and concise. Do not add opinions or formatting.
```

### Update the main task brief to call the workers by name

Revise the orchestrator brief so it delegates to the sub-agents by name:

```markdown
You produce a daily repository health digest.

1. Fetch all open issues (title, body, number).
2. For each issue, use the `issue-summarizer` agent to produce a
   one-sentence summary.
3. Compile the summaries into a numbered list, ordered by issue number.
4. Post the list as a comment on the repository's main tracking issue
   (the issue you created in [Step 11a](11a-build-daily-status.md) to
   receive daily status updates).
```

> [!TIP]
> Keep orchestrator instructions short and action-oriented. Move all detailed instructions, output formats, and edge-case handling into the sub-agent briefs where they belong.

### Add `cli-proxy` to your frontmatter

Sub-agents run in the parent's environment. If they need to call `gh` commands or read repository files, enable the CLI proxy on the parent workflow:

```yaml
---
name: Daily Status Report
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: write
tools:
  github:
    mode: gh-proxy
  cli-proxy: true
---
```

### Compile and validate

After editing the file, compile it to confirm the sub-agent blocks are valid:

```bash
gh aw compile .github/workflows/daily-status.md --validate
```

> [!TIP]
> Use `--watch` to recompile automatically as you edit: `gh aw compile .github/workflows/daily-status.md --watch`

Fix any errors before pushing. Common mistakes include:

- Using uppercase letters or spaces in the agent name
- Placing `engine:` or `tools:` inside a sub-agent block (not supported — those are stripped)
- Adding sub-agent blocks before the main workflow content

### Push and verify

Commit both the updated `.md` and the regenerated `.lock.yml`:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "feat: add issue-summarizer sub-agent to daily-status"
git push
```

Trigger a manual run and open the run log. You should see the orchestrator calling the `issue-summarizer` agent for each issue and then synthesising the results.

## Sub-Agent Capability Table

| Capability | Supported |
|------------|-----------|
| Custom `model:` per agent | ✅ |
| Custom `description:` | ✅ |
| Inherits parent tool access | ✅ |
| Own `engine:` field | ❌ (stripped) |
| Own `tools:` field | ❌ (stripped) |
| Own `safe-outputs:` | ❌ (not supported) |
| Nested sub-agents (sub-agent calls another sub-agent) | ❌ (keep delegation one level deep) |

## ✅ Checkpoint

- [ ] You identified at least one repetitive task in your workflow to delegate to a sub-agent
- [ ] Your workflow file has at least one `## agent: \`name\`` block with `model: small`
- [ ] The main task brief calls the sub-agent by name
- [ ] `gh aw compile --validate` passes with no errors
- [ ] You ran the workflow and confirmed the sub-agent is invoked in the run log

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md)
- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md)
- [Make Your Workflow Remember Across Runs](20-persistent-memory.md)
- [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
