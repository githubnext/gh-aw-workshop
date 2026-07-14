# Step 4: GitHub Actions in 5 Minutes

> [!TIP]
> <details>
> <summary><b>Already know GitHub Actions?</b> Check the three boxes below and skip ahead:</summary>
>
> - [ ] I know workflows live in `.github/workflows/` as YAML files
> - [ ] I can read `on`, `jobs`, and `steps` keys in a workflow file
> - [ ] I know each step runs on a GitHub-hosted runner
>
> **→ [Skip to Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)**
> (or [jump to Step 6: Install gh-aw](06-install-gh-aw.md) if you know both)
>
> </details>

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: [triggers](https://github.github.com/gh-aw/reference/triggers/), jobs, steps, and workflow files. After this step, you'll be able to read any classic GitHub Actions workflow file — a skill you'll build on immediately in Steps 5 and 6.

## 📋 Before You Start

- You've completed [Step 3: Create Your Practice Repository](03-create-your-repo.md)
- No credentials needed — works entirely in your browser

## Classic Actions vs [Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)

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

> [!TIP]
> Want hands-on practice labeling the five parts of a workflow file and testing your understanding with a short quiz? Take the optional [Side Quest: GitHub Actions Vocabulary Builder](side-quest-04-01-actions-vocabulary.md) — browser-only, no terminal needed.

## ✅ Checkpoint

- [ ] I can identify `on`, `jobs`, and `steps` in a workflow file
- [ ] I know workflows live in `.github/workflows/`
- [ ] I can continue to Step 5, or skip ahead to Step 6 if I already know this material

**Next:** [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
