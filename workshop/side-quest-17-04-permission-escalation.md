# Side Quest: Permission Escalation in Agentic Workflows

> _Optional: work through this security primer to see how an over-scoped workflow can give a misdirected agent more authority than your task actually requires._

Permission escalation in an agentic workflow means the agent ends up with **more practical authority than the task needs**. You might only want a read-only summary, but if your workflow also leaves broad write paths open, a bad instruction or bad judgment can turn that summary job into an unexpected repository change.

---

## What a permission escalation looks like

Imagine a workflow whose real job is simple: read open issues, read recent commits, and write a daily summary for a human to review.

Now imagine the workflow also allows the agent to open a pull request that can touch any file in the repository. A malicious issue body, prompt injection, or just a sloppy inference step could push the agent toward editing `README.md`, changing workflow files, or proposing a commit you never intended.

That is the practical security problem: the workflow author asked for one level of authority, but the configuration exposed a wider one.

---

## Why agentic workflows need tighter scoping than classic CI/CD

A classic CI/CD pipeline usually runs a fixed script. If the script says "run tests" and nothing else, it does not invent extra steps on its own.

An agentic workflow is different. You define the boundaries up front, but the agent decides at runtime which tool calls to make, which repository data to follow, and whether to use an allowed write surface.

That flexibility is useful, but it also means unnecessary capability becomes unnecessary risk. If the task only needs read access, every extra permission or write path increases the blast radius of a misdirected agent.

---

## How gh-aw limits the blast radius

gh-aw gives you a least-privilege model with three layers:

| Layer | What it limits |
|---|---|
| Minimal `permissions:` | Limits which repository data and GitHub APIs the workflow can use |
| Narrow `safe-outputs` | Limits which write operations the agent can perform at all |
| `protected-files` in a write-enabled output | Forces extra review when a change touches sensitive files |

If you want the bigger mental model behind those layers, read [Side Quest: Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md).

---

## Read-only pattern

If your workflow only needs to observe repository state, keep it read-only:

```yaml
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

With a configuration like this, the agent can inspect repository data and generate output, but it has no workflow-defined path to create a PR, post a comment, or modify repository content.

---

## Write-enabled pattern with protected files

If you do need the agent to prepare changes, keep the write surface narrow and protect sensitive files:

```yaml
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
    protected-files:
      policy: request_review
      exclude:
        - "README.md"
        - ".github/workflows/**"
    allowed-files:
      - "workshop/*.md"
      - "workshop/**/*.md"
---
```

This does **not** give the agent open-ended repository write access. It gives the agent one constrained write path: propose a pull request, limited to specific files, with extra scrutiny if the change reaches protected paths.

That is the key defence: if the agent is misdirected, it cannot silently turn a docs task into arbitrary repository mutation.

---

## What you can do as a workflow author

| Practice | Why it helps |
|---|---|
| Start with the smallest `permissions:` block that still lets the workflow read what it needs | Removes unnecessary capability before the agent ever runs |
| Add `safe-outputs` only when the task genuinely needs a write action | Prevents accidental write paths in read-only workflows |
| Use `allowed-files` to keep write-enabled outputs scoped to the smallest part of the repo | Stops a narrow task from spilling into unrelated files |
| Add `protected-files` for high-risk paths such as `README.md` or workflow files | Forces human scrutiny before sensitive files are changed |
| Treat task brief, prompt injection resistance, and capability scoping as one design problem | A clear brief helps, but boundaries still need to hold when the brief is ignored |

---

## ✅ Checkpoint

- [ ] You can explain permission escalation in plain English in the context of an agentic workflow
- [ ] You understand why agentic workflows need tighter capability scoping than fixed CI scripts
- [ ] You can describe how minimal `permissions:`, narrow `safe-outputs`, and `protected-files` work together
- [ ] You know when to keep a workflow fully read-only vs. when to allow a constrained pull-request output

---

Return to [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
