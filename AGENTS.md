# Agent Tips for gh-aw-workshop

## About this repository

This is a hands-on workshop that teaches developers how to build GitHub Agentic Workflows
using the `gh-aw` CLI extension. Learners follow numbered Markdown steps in the `workshop/`
folder and finish with a scheduled, AI-powered daily repository status report running in
GitHub Actions.

The repository also contains the agentic workflow files that power the workshop's own
automated tooling (author review, student simulation, order checks) under `.github/workflows/`.

## Repository layout

```text
README.md               # Workshop landing page (GitHub Skills style)
AGENTS.md               # This file — tips for AI agents
workshop/               # Step-by-step workshop content (00-welcome.md … 16-connect-data-source.md)
.github/
  workflows/            # Agentic workflow definition files (*.md) and compiled lock files (*.lock.yml)
  skills/               # Copilot skill definitions for agentic-workflows and agentic-workflow-designer
  agents/               # Agent instruction files (do not read or modify)
  mcp.json              # MCP server configuration for gh-aw
.markdownlint-cli2.yaml # Markdownlint rule overrides
```

IMPORT GUIDELINES TO FOLLLOW: .github/workflows/guidelines.md

## Content conventions

### Workshop tone and voice

- Write in **second person** ("you"), present tense, active voice.
- Keep steps short and outcome-focused. Each step should answer: _what will the learner do, and what will they have when they're done?_
- Use `> [!TIP]` and `> [!NOTE]` callouts sparingly — only when the information meaningfully changes what the learner should do. Cap alert severity at `[!NOTE]`/`[!TIP]` for regular content; use `[!IMPORTANT]` only when the learner **must** act before continuing, and reserve `[!WARNING]`/`[!CAUTION]` for major security issues only. Never use dramatic or alarmist language. For multi-line callouts, wrap content in a `<details>` element with a `<summary>` heading; for single-line callouts, put the text directly in the blockquote without `<details>` (see the "Alert callouts" section in `.github/workflows/guidelines.md`).
- End every workshop step with a `## ✅ Checkpoint` section containing a markdown checklist.
- Do **not** number Markdown headers inside a file. Use descriptive headings and keep step order in lists, filenames, tables, or checkpoints instead.
- Do **not** front-load prerequisite tool requirements in welcome or introductory steps — prerequisites belong in `01-prerequisites.md`.

### Markdown rules

All Markdown files are linted with [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2).

Run the linter from the repository root:

```bash
npx --yes markdownlint-cli2 "**/*.md"
```

The following rules are **disabled** in `.markdownlint-cli2.yaml` — do not add inline
`<!-- markdownlint-disable -->` comments for these:

| Rule | Description |
|------|-------------|
| MD009 | Trailing spaces |
| MD012 | Multiple blank lines |
| MD013 | Line length |
| MD022 | Headings surrounded by blank lines |
| MD031 | Fenced code blocks surrounded by blank lines |
| MD032 | Lists surrounded by blank lines |
| MD033 | Inline HTML |
| MD040 | Fenced code blocks with language specified |
| MD060 | Fenced code block style |

## Working with Codespaces

**Never configure Codespace badges or `devcontainer.json` to open from this (`gh-aw-workshop`) repository.** The workshop repository itself is not a suitable Codespace base — learners work in their own practice repositories, not a clone of this one. Any Codespace badge or devcontainer setup must point to the learner's own repository.

## Working with workshop content

- Workshop steps are numbered files in `workshop/` (e.g., `07-your-first-workflow.md`).
- Images referenced in workshop steps live in `workshop/images/`.
- Keep `workshop/README.md` in sync whenever you add or rename a step.
- Run the markdown linter before committing any workshop step edits.
- When adding a new step, follow the existing file naming pattern and update the curriculum table in both `workshop/README.md` and `workshop/00-welcome.md`.

## Working with agentic workflow files

Workflow definitions live in `.github/workflows/*.md`. Each file contains YAML frontmatter
(between `---` fences) followed by a Markdown task brief for the AI agent.

Position agentic workflows as an **Actions-compatible superset**: frontmatter stays compatible with standard Actions concepts, while the Markdown body adds agentic reasoning and templating capabilities. Favor a smooth transition story and call out hybrid deterministic + agentic patterns when relevant (for example, deterministic data-fetch steps plus agentic analysis in the brief).

Compiled lock files (`*.lock.yml`) are generated automatically — **do not edit them by hand**.
Regenerate a lock file with:

```bash
gh aw compile
```

Use `--validate` only when you are troubleshooting compile errors or running a targeted schema/deprecation check.

## gh-aw documentation site

The official gh-aw docs are published at `https://github.github.com/gh-aw/` from the
`github/gh-aw` repository (Astro Starlight layout). Source files live at:

```text
docs/src/content/docs/<section>/<slug>.md   (or .mdx)
```

URL scheme: `https://github.github.com/gh-aw/<section>/<slug>/`

**To validate a link**, search for the corresponding file in `github/gh-aw`:

```
filename:<slug>.md  repo:github/gh-aw
```

### Known doc sections and pages

| Section | Slug | URL |
|---------|------|-----|
| reference | artifacts | `https://github.github.com/gh-aw/reference/artifacts/` |
| reference | audit | `https://github.github.com/gh-aw/reference/audit/` |
| reference | auth | `https://github.github.com/gh-aw/reference/auth/` |
| reference | billing | `https://github.github.com/gh-aw/reference/billing/` |
| reference | cache-memory | `https://github.github.com/gh-aw/reference/cache-memory/` |
| reference | checkout | `https://github.github.com/gh-aw/reference/checkout/` |
| reference | compilation-process | `https://github.github.com/gh-aw/reference/compilation-process/` |
| reference | concurrency | `https://github.github.com/gh-aw/reference/concurrency/` |
| reference | copilot-cloud-agent | `https://github.github.com/gh-aw/reference/copilot-cloud-agent/` |
| reference | copilot-custom-agents | `https://github.github.com/gh-aw/reference/copilot-custom-agents/` |
| reference | cost-management | `https://github.github.com/gh-aw/reference/cost-management/` |
| reference | cross-repository | `https://github.github.com/gh-aw/reference/cross-repository/` |
| reference | engines | `https://github.github.com/gh-aw/reference/engines/` |
| reference | environment-variables | `https://github.github.com/gh-aw/reference/environment-variables/` |
| reference | ephemerals | `https://github.github.com/gh-aw/reference/ephemerals/` |
| reference | faq | `https://github.github.com/gh-aw/reference/faq/` |
| reference | footers | `https://github.github.com/gh-aw/reference/footers/` |
| reference | frontmatter | `https://github.github.com/gh-aw/reference/frontmatter/` |
| reference | github-tools | `https://github.github.com/gh-aw/reference/github-tools/` |
| reference | glossary | `https://github.github.com/gh-aw/reference/glossary/` |
| reference | imports | `https://github.github.com/gh-aw/reference/imports/` |
| reference | inline-sub-agents | `https://github.github.com/gh-aw/reference/inline-sub-agents/` |
| reference | markdown | `https://github.github.com/gh-aw/reference/markdown/` |
| reference | mcp-gateway | `https://github.github.com/gh-aw/reference/mcp-gateway/` |
| reference | mcp-scripts | `https://github.github.com/gh-aw/reference/mcp-scripts/` |
| reference | network | `https://github.github.com/gh-aw/reference/network/` |
| reference | outcomes | `https://github.github.com/gh-aw/reference/outcomes/` |
| reference | permissions | `https://github.github.com/gh-aw/reference/permissions/` |
| reference | qmd | `https://github.github.com/gh-aw/reference/qmd/` |
| reference | rate-limiting-controls | `https://github.github.com/gh-aw/reference/rate-limiting-controls/` |
| reference | releases | `https://github.github.com/gh-aw/reference/releases/` |
| reference | repo-memory | `https://github.github.com/gh-aw/reference/repo-memory/` |
| reference | safe-outputs | `https://github.github.com/gh-aw/reference/safe-outputs/` |
| reference | sandbox | `https://github.github.com/gh-aw/reference/sandbox/` |
| reference | self-hosted-runners | `https://github.github.com/gh-aw/reference/self-hosted-runners/` |
| reference | serena | `https://github.github.com/gh-aw/reference/serena/` |
| reference | staged-mode | `https://github.github.com/gh-aw/reference/staged-mode/` |
| reference | steps-jobs | `https://github.github.com/gh-aw/reference/steps-jobs/` |
| reference | templating | `https://github.github.com/gh-aw/reference/templating/` |
| reference | tools | `https://github.github.com/gh-aw/reference/tools/` |
| reference | triggers | `https://github.github.com/gh-aw/reference/triggers/` |
| reference | workflow-structure | `https://github.github.com/gh-aw/reference/workflow-structure/` |
| guides | agentic-authoring | `https://github.github.com/gh-aw/guides/agentic-authoring/` |
| guides | arc-dind-copilot-agent | `https://github.github.com/gh-aw/guides/arc-dind-copilot-agent/` |
| guides | governance | `https://github.github.com/gh-aw/guides/governance/` |
| guides | mcps | `https://github.github.com/gh-aw/guides/mcps/` |
| guides | open-telemetry | `https://github.github.com/gh-aw/guides/open-telemetry/` |
| guides | reusing-workflows | `https://github.github.com/gh-aw/guides/reusing-workflows/` |
| guides | third-party-agent | `https://github.github.com/gh-aw/guides/third-party-agent/` |
| guides | upgrading | `https://github.github.com/gh-aw/guides/upgrading/` |
| guides | using-at-scale | `https://github.github.com/gh-aw/guides/using-at-scale/` |
| setup | cli | `https://github.github.com/gh-aw/setup/cli/` |
| setup | creating-workflows | `https://github.github.com/gh-aw/setup/creating-workflows/` |
| setup | quick-start | `https://github.github.com/gh-aw/setup/quick-start/` |
| introduction | architecture | `https://github.github.com/gh-aw/introduction/architecture/` |
| introduction | how-they-work | `https://github.github.com/gh-aw/introduction/how-they-work/` |
| introduction | overview | `https://github.github.com/gh-aw/introduction/overview/` |
| patterns | batch-ops | `https://github.github.com/gh-aw/patterns/batch-ops/` |
| patterns | chat-ops | `https://github.github.com/gh-aw/patterns/chat-ops/` |
| patterns | issue-ops | `https://github.github.com/gh-aw/patterns/issue-ops/` |
| patterns | label-ops | `https://github.github.com/gh-aw/patterns/label-ops/` |
| patterns | memory-ops | `https://github.github.com/gh-aw/patterns/memory-ops/` |
| patterns | project-ops | `https://github.github.com/gh-aw/patterns/project-ops/` |
| patterns | spec-ops | `https://github.github.com/gh-aw/patterns/spec-ops/` |
| patterns | workqueue-ops | `https://github.github.com/gh-aw/patterns/workqueue-ops/` |
| experimental | experiments | `https://github.github.com/gh-aw/experimental/experiments/` |
| examples | multi-repo | `https://github.github.com/gh-aw/examples/multi-repo/` |

## Common tasks

### Edit a workshop step

1. Open the relevant file in `workshop/`.
2. Make your changes following the content conventions above.
3. Run `npx --yes markdownlint-cli2 "**/*.md"` and fix any errors.
4. If the step is new, update `workshop/README.md` and `workshop/00-welcome.md`.

### Update an agentic workflow definition

1. Edit the `.md` file in `.github/workflows/`.
2. Regenerate lock files: `gh aw compile`.
3. Commit both the `.md` and the updated `.lock.yml`.

### Add or update images

Place image files in `workshop/images/` and reference them with a relative path:

```markdown
![Alt text describing the image](images/filename.svg)
```
