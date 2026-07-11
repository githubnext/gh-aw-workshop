# Agent Tips for gh-aw-workshop

## What this repository is

This is a hands-on workshop that teaches developers how to build GitHub Agentic Workflows
using the `gh-aw` CLI extension. Learners follow numbered Markdown steps in the `workshop/`
folder and finish with a scheduled, AI-powered daily repository status report running in
GitHub Actions.

The repository also contains the agentic workflow files that power the workshop's own
automated tooling (author review, student simulation, order checks) under `.github/workflows/`.

## Repository structure

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

## Linting Markdown

All Markdown files are linted with [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
using the rules in `.markdownlint-cli2.yaml`.

Run the linter locally from the repository root:

```bash
npx --yes markdownlint-cli2 "**/*.md"
```

Lint is also enforced by the `Markdown Lint` GitHub Actions workflow on every pull request
that touches `*.md` files.

### Common rules that are disabled

The following rules are turned off in `.markdownlint-cli2.yaml` — do not add inline
`<!-- markdownlint-disable -->` comments for these:

- **MD009** — trailing spaces
- **MD012** — multiple blank lines
- **MD013** — line length
- **MD022** — headings surrounded by blank lines
- **MD031** — fenced code blocks surrounded by blank lines
- **MD032** — lists surrounded by blank lines
- **MD033** — inline HTML
- **MD040** — fenced code blocks with language specified
- **MD060** — fenced code block style

## Agentic workflow files

Workflow definitions live in `.github/workflows/*.md`. Each file contains YAML frontmatter
(between `---` fences) followed by a Markdown task brief for the AI agent.

Compiled lock files (`*.lock.yml`) are generated automatically — do not edit them by hand.
Regenerate a lock file with:

```bash
gh aw compile .github/workflows/<workflow>.md --validate
```

## Working with workshop content

- Workshop steps are numbered files in `workshop/` (e.g. `07-your-first-workflow.md`).
- Images referenced in workshop steps live in `workshop/images/`.
- The `workshop/README.md` file is the curriculum index — keep it in sync when adding or
  renaming steps.
- When editing workshop steps, run the markdown linter before committing.
