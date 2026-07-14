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
- Use `> [!TIP]`, `> [!NOTE]`, and `> [!IMPORTANT]` callouts sparingly — only when the information meaningfully changes what the learner should do. Always wrap callout content in a `<details>` element (see the "Alert callouts" section in `.github/workflows/guidelines.md`).
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

Compiled lock files (`*.lock.yml`) are generated automatically — **do not edit them by hand**.
Regenerate a lock file with:

```bash
gh aw compile
```

Use `--validate` only when you are troubleshooting compile errors or running a targeted schema/deprecation check.

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
