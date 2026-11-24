<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Repository Poisoning via Agentic Write Access

> _An agent granted `contents: write` can be tricked into committing backdoors or overwriting sensitive files — keeping the workflow read-only, and routing any genuine writes through a pull request, closes that door entirely._

## :dart: Learning Objectives

By the end of this side quest you will be able to:

- Explain what repository poisoning is and why agentic workflows are uniquely vulnerable to it.
- Spot dangerous `permissions:` and `toolsets:` values in a workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/#permissions-permissions).
- Harden a workflow so it cannot commit files directly.

## :clipboard: Before You Start

- You have completed [Give Your Agent More Tools with MCP](17-add-mcp-tools.md) and have a working workflow file.
- You know the `permissions:` and `safe-outputs:` blocks from earlier steps.

> [!NOTE]
> Enterprise environments (GHES/GHEC) may already enforce branch protection, reviewers, and CODEOWNERS; these defences work alongside them.

---

## The Attack

Repository poisoning happens when a misdirected agent with write access commits changes an attacker designed, not ones you intended.

**Scenario:** Your workflow reads issues and proposes docs updates for a matching label. An attacker opens an issue with a legitimate-looking request plus a hidden instruction to append a job to `.github/workflows/daily-status.md` that exfiltrates `${{ secrets.GITHUB_TOKEN }}`. With `contents: write` and no file restrictions, the agent may commit that backdoor — and the next scheduled run ships credentials.

---

## Why This Matters for [Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/#what-are-agentic-workflows)

Classic CI/CD runs deterministic scripts. An agentic workflow reads freeform repository content — issue bodies, PR text, files — and decides at runtime what to do, so the payload lives in data, not code.

Write access magnifies every read: an injection can skip human review and land on the default branch before anyone notices.

---

## How AW Defends Against It

gh-aw gives you two layers that stop direct commits.

### Declare [read-only permissions](https://github.github.com/gh-aw/reference/permissions/)

Remove write capability before the agent runs:

```markdown
---
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
---
```

With `contents: read`, the [GitHub MCP server](https://github.github.com/gh-aw/guides/mcps/#github-mcp-server) cannot create or modify repository content. Even a hijacked agent cannot commit a file.

### Route writes through a pull request

For genuine changes, `safe-outputs: create-pull-request` keeps every write behind a human gate. Expand for the full example:

<details>
<summary>Full frontmatter example: a pull-request gate with file restrictions</summary>

```markdown
---
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
safe-outputs:
  create-pull-request:
    allowed-files:
      - "docs/**/*.md"
---
```

The agent can propose `docs/` changes but never commit directly.

</details>

In short:

- Keep write access off the agent: `contents: read` makes direct commits impossible.
- Gate legitimate changes through a pull request scoped with `allowed-files`.
- Treat all repository content — issue bodies, PR descriptions, file text — as untrusted input.

---

## :pencil2: Exercise: Spot the Dangerous [Frontmatter](https://github.github.com/gh-aw/reference/frontmatter/)

Read this workflow frontmatter and identify every configuration that makes repository poisoning possible:

```markdown
---
name: Issue Responder
on:
  issues:
    types: [opened]
permissions:
  contents: write
  issues: write
tools:
  github:
    mode: gh-proxy
    toolsets: [everything]
---
```

- Which `permissions:` line enables direct file commits?
- Which `toolsets:` value expands the attack surface beyond what the task needs?
- What `safe-outputs:` configuration is missing?

<details>
<summary>Review your answers</summary>

- `contents: write` lets the agent commit files directly to any branch.
- `toolsets: [everything]` exposes every GitHub MCP tool, giving a hijacked agent far more reach than the task needs.
- No `safe-outputs:` block means no file restrictions and no pull-request gate for human review.

</details>

---

## :pencil2: Exercise: Harden Your Workflow

Open your workflow file from [Step 17](17-add-mcp-tools.md) and apply these changes:

1. If `permissions:` contains `contents: write` and your workflow does not commit files directly, change it to `contents: read`.
2. If your workflow needs to propose changes, add a `safe-outputs: create-pull-request` block with an `allowed-files` list scoped to the paths your task should touch.
3. Add a `protected-files` rule with `policy: request_review` and an `exclude` entry for `.github/workflows/**`. This pauses the PR for a human whenever a sensitive path is involved.
4. Add [`network.allowed-domains`](https://github.github.com/gh-aw/reference/network/#configuration) listing only the domains you genuinely need (for example `api.github.com`). This blocks exfiltration to an attacker-controlled server.
5. Compile and run the workflow. Confirm the agent still completes its task without direct write access.

<details>
<summary>Expected outcome</summary>

Your frontmatter should contain no `contents: write`, no `toolsets: [everything]`, and at least one safe-output or network restriction. The agent's output (issue comment, pull request, or summary) should be identical to before — only the write path changes.

</details>

---

## :white_check_mark: Checkpoint

- [ ] I can describe the repository poisoning attack in one sentence.
- [ ] I can name the two gh-aw features (`contents: read` and `safe-outputs: create-pull-request`) that remove the direct-commit path.
- [ ] I identified all dangerous fields in the exercise frontmatter.
- [ ] I applied at least one defensive measure to my own workflow.
- [ ] I can explain why `protected-files` adds a human review gate even when a PR is allowed.
- [ ] I added a `network.allowed-domains` restriction to limit outbound connections.

---

<!-- journey: all -->
Return to [Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
<!-- /journey -->
