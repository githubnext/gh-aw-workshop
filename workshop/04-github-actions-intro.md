# Step 4: GitHub Actions in 5 Minutes

<details>
<summary>⚡ Already know GitHub Actions? Skip to what's different →</summary>

If you can check all three boxes below, jump straight to Step 5 for just the agentic delta:

- [ ] I know that workflows are YAML files stored in `.github/workflows/`
- [ ] I can identify the `on`, `jobs`, and `steps` keys in a workflow file
- [ ] I understand that each step runs a command or calls an action on a GitHub-hosted runner

**→ [Skip to Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)**

Already know both GitHub Actions **and** agentic workflow concepts?

**→ [Jump straight to Step 6: Install gh-aw](06-install-gh-aw.md)**

</details>

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: triggers, jobs, steps, and workflow files. After this step, you'll be able to read any classic GitHub Actions workflow file — a skill you'll build on immediately in Steps 5 and 6.

## Classic Actions vs Agentic Workflows

If you already know Actions, here's the key shift at a glance:

| Dimension | Classic Actions | Agentic Workflows |
|-----------|-----------------|-------------------|
| **Task description** | You write YAML `steps` | You write a plain-English brief |
| **Execution model** | Deterministic — same inputs, same path | AI agent reasons and adapts at runtime |
| **Tool selection** | Fixed — you specify every `uses` and `run` | Agent selects and chains tools from declared toolsets |
| **File format** | `.github/workflows/*.yml` | `.github/workflows/*.md` (compiled to `.lock.yml`) |

## Quick Refresher

A GitHub Actions workflow is a YAML file in `.github/workflows/` that tells GitHub:

- _when_ to run (`on`)
- _what_ to run (`jobs`)
- _how_ each job executes (`steps`)

Minimal example:

```yaml
name: Hello Workflow

on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello from GitHub Actions"
```

## Why This Matters for Agentic Workflows

Traditional workflows execute a fixed script path. Agentic workflows still use the same Actions foundation, but introduce AI-driven decision making inside that runtime.

Step 5 is the optional transition if you want the conceptual delta before installing `gh-aw`: _what changes when a workflow can reason and choose next actions_.

## ✅ Checkpoint

- [ ] I can identify `on`, `jobs`, and `steps` in a workflow file
- [ ] I know workflows live in `.github/workflows/`
- [ ] I can continue to Step 5, or skip ahead to Step 6 if I already know this material

**Next:** [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
