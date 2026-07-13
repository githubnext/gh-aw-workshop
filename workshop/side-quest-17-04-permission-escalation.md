# Side Quest: Permission Escalation in Agentic Workflows

> _Optional: work through this security primer to see how an over-scoped workflow can give a misdirected agent more authority than your task needs._

## 📋 Before You Start

You have completed Step 17 and have a working workflow file that uses `safe-outputs`.

---

## What is permission escalation?

Permission escalation means the agent ends up with **more authority than the task needs**. You might want a read-only summary. But if your workflow leaves broad write paths open, a bad prompt or sloppy inference can turn that summary job into an unexpected repository change.

---

## What it looks like in practice

Picture a workflow with one job: read open issues, read recent commits, and write a daily summary.

Now picture that same workflow allowing the agent to open a pull request touching any file. A malicious issue body or a prompt injection could push the agent to edit `README.md` or change workflow files. You never asked for that.

That is the problem. The workflow author requested one level of authority. The configuration exposed a wider one.

---

## Why agentic workflows need tighter scoping than classic CI/CD

A classic CI/CD pipeline runs a fixed script. If the script says "run tests," it runs tests. It does not invent extra steps.

An agentic workflow is different. You set boundaries up front. But the agent decides at runtime which tools to call and whether to use a write surface. Every extra permission is extra risk. If the task only needs read access, any open write path increases the blast radius of a misdirected agent.

---

## How gh-aw limits the blast radius

gh-aw gives you three layers of least-privilege control:

| Layer | What it limits |
|---|---|
| Minimal `permissions:` | Which GitHub APIs the workflow can call |
| Narrow `safe-outputs` | Which write operations the agent can perform |
| `protected-files` in a write-enabled output | Which files need extra review before a change lands |

For the full mental model behind these layers, read [Side Quest: Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md).

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

With this setup, the agent can read data and generate output. It has no path to create a PR, post a comment, or modify any file.

### 🛠️ Try it: audit your own workflow

Open your workflow file. Check the `permissions:` block and answer these three questions:

- [ ] Does every permission listed have a clear reason tied to your task?
- [ ] Are there any `write` permissions that your task does not actually use?
- [ ] Could you replace any `write` permission with `read` and the workflow would still work?

If you answered "yes" to the second or third question, remove or downgrade that permission now.

---

## Write-enabled pattern with protected files

When the agent needs to propose changes, keep the write surface narrow and protect sensitive files:

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

This does **not** give the agent open-ended write access. It gives the agent one constrained path: propose a pull request, limited to specific files, with extra review if the change reaches protected paths.

That is the key defence. A misdirected agent cannot silently turn a docs task into arbitrary repository mutation.

### 🛠️ Try it: add protected-files to your workflow

1. Open your workflow file and find the `safe-outputs` block.
2. Add a `protected-files` entry that excludes `.github/workflows/daily-status.md`.
3. Before you save, predict: what would happen if the agent tried to modify `.github/workflows/daily-status.md`?

Write your prediction here, then save and run the workflow to check it:

> _My prediction: …_

---

## Best practices for workflow authors

| Practice | Why it helps |
|---|---|
| Start with the smallest `permissions:` block | Removes capability before the agent ever runs |
| Add `safe-outputs` only when the task needs a write action | Prevents accidental write paths in read-only workflows |
| Use `allowed-files` to scope writes to one part of the repo | Stops a narrow task from spilling into unrelated files |
| Add `protected-files` for high-risk paths | Forces human review before sensitive files change |
| Treat task brief and capability scoping as one design problem | A clear brief helps, but boundaries must hold when the brief is ignored |

---

## ✅ Checkpoint

- [ ] You can explain permission escalation in plain English
- [ ] You audited your own `permissions:` block against the principle of least privilege
- [ ] You can describe how `permissions:`, `safe-outputs`, and `protected-files` work together
- [ ] You added `protected-files` to your workflow and predicted what it would block

---

Return to [Step 17: Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
