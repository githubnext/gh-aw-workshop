<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Skills in agentic workflows — the `skills:` frontmatter key, local `SKILL.md` knowledge files under `.github/skills/`, and the three authoring strategies (hint, fusion, inline) for injecting domain knowledge into a workflow prompt</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/frontmatter/#frontmatter-skills-skills</source>
    <source>https://github.github.com/gh-aw/reference/glossary/#frontmatter-skills-skills</source>
  </sources>
  <rationale>The existing curriculum (steps 1-28) teaches MCP tools, persistent memory, inline sub-agents, evals, cost controls, and orchestration — but no step introduces skills. Learners end up pasting the same domain conventions into every workflow brief instead of encoding them once in a reusable SKILL.md. Step 29 closes that gap with a concrete authoring exercise covering the frontmatter `skills:` key for installing external skills and the hint/fusion strategies for shaping how skill content reaches the prompt.</rationale>
</research-metadata>
-->

# Teach Your Agent Domain Knowledge with Skills

> _Write your domain conventions once in a `SKILL.md`, and every workflow that needs them can reuse it._

## :dart: What You'll Do

You'll write a local `SKILL.md` that encodes a repeatable domain convention — a naming rule, a review checklist, or a data format — and reference it from a workflow so the agent applies that knowledge without you repeating it in every brief. By the end of this step, you'll know when to let the agent discover skills itself (hint) versus when to paste in only the exact fragment it needs (fusion).

## :clipboard: Before You Start

- You completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have at least one working agentic workflow you can edit and recompile.
- You can compile workflows with `gh aw compile` from [Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Understand skills

A **skill** is a domain-specific knowledge file — `SKILL.md` — stored under `skills/` or `.github/skills/<name>/SKILL.md`. Unlike a one-off prompt tweak, a skill is written once and reused across any workflow that needs the same convention: an issue-labeling rule, a code review checklist, a data schema, or a house style guide.

Your repository already has skills in `.github/skills/` that power its own tooling. Look at one:

```bash
cat .github/skills/agentic-workflows/SKILL.md
```

Notice the shape: YAML frontmatter with `name` and `description`, followed by plain-language guidance the agent reads and applies.

> :thinking: **Predict:** Think of one convention you keep re-explaining to your agent across workflows — a commit message format, a labeling rule, a checklist. That's a skill candidate.

## Steps

### Install external skills with the frontmatter `skills:` key

To pull in a skill maintained elsewhere, add the top-level `skills:` array to your workflow frontmatter. The compiler installs it in the activation job before the agent runs — no manual `gh skill install` step needed:

```yaml
skills:
  # Local development path, installed with --from-local
  - .github/skills/my-skill

  # External skill pinned to a commit SHA
  - owner/repo/skills/some-skill@801dca688564c529fa84f247f64472520d9ebe28
```

External references must be pinned to a full 40-character commit SHA (or an unpinned `owner/repo@` ref, which the compiler warns about). Local paths like `.github/skills/my-skill` are for skills you author and maintain in this repository.

### Write a local SKILL.md

Pick one narrow convention from your own repository — for example, "how to classify an issue" or "what fields a status report must include." In your AI agent, run:

```prompt
/agentic-workflows create a skill at .github/skills/issue-triage/SKILL.md that
classifies incoming issues as bug, feature, or question, and lists the three
pieces of information a good bug report must include.
```

<details>
<summary>:desktop_computer: Terminal path — write the SKILL.md directly</summary>

Create `.github/skills/issue-triage/SKILL.md`:

```markdown .github/skills/issue-triage/SKILL.md
---
name: issue-triage
description: Classify incoming issues and flag missing bug-report details.
---

# Issue Triage

Classify each issue as `bug`, `feature`, or `question` based on its title and body.

For issues classified as `bug`, confirm the body includes:

- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, version, or browser)

If any of these are missing, note which ones in your response.
```

</details>

### Choose a strategy: hint or fusion

Once a skill exists, decide how your workflow prompt should point to it:

| Factor | Hint (generalist) | Fusion (targeted) |
|---|---|---|
| Task domain | Broad or unknown at authoring time | Narrow and well-defined |
| Skill set | Grows dynamically over time | Known and stable |
| Context budget | Generous | Tight |
| Determinism | Lower — agent chooses what applies | Higher — you specify the exact fragment |

Use **hint** when you want the agent to discover and self-select relevant skills:

```markdown
If the repository contains `SKILL.md` files under `skills/` or `.github/skills/`,
check which ones are relevant to this task. For each relevant skill, read its
content and apply the guidance it provides.
```

Use **fusion** when you know exactly which skill section the agent needs and want to keep the prompt compact — reference only the relevant fragment, never the whole file:

```markdown
<!-- gh-skill-fusion: .github/skills/issue-triage/SKILL.md#issue-triage -->

Classify this issue as bug, feature, or question. If it is a bug, confirm the
body includes reproduction steps, expected vs. actual behavior, and environment
details.
```

> :bulb: A third option, **inline skills**, lets you embed a skill fragment directly in the workflow file under a `## skill: \`name\`` heading. gh-aw extracts it to the right location at setup time. Use this when the skill is small and specific to a single workflow — you don't need it anywhere else.

### Wire the skill into a workflow and validate

Add your chosen strategy to a real workflow brief, then compile to confirm the skill installs and the frontmatter is valid:

```bash
gh aw compile
```

Check the compiled `.lock.yml` for the activation step that installs your skill, and confirm no compile warnings mention an unpinned or missing skill reference.

## :white_check_mark: Checkpoint

- [ ] You located an existing `SKILL.md` in this repository and identified its `name` and `description`
- [ ] You wrote a local `SKILL.md` encoding one concrete domain convention
- [ ] You can explain the difference between the hint and fusion strategies, and when to use each
- [ ] You referenced your skill from a workflow (via `skills:`, a hint instruction, or a fusion comment)
- [ ] `gh aw compile` succeeded with no unpinned-skill warnings

<!-- journey: all -->
**Next:** [Govern Agentic Workflows Across Your Organisation](30-enterprise-governance.md)
<!-- /journey -->
