# Step 4: GitHub Actions in 5 Minutes

> [!TIP]
> **Already use GitHub Actions?** You can skim this step.
> The only thing you need to know before Step 5 is:
> - Agentic workflows use `.md` files (not `.yml`) as the workflow definition.
> - The `gh-aw` CLI compiles them to standard GitHub Actions YAML at deploy time.
> - The agent body (plain English below `---`) is passed as a prompt to an LLM at runtime.
>
> If that makes sense, skip to [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md).

_You already have a repository — now anchor on the parts of Actions that matter for agentic workflows._

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: triggers, jobs, steps, and workflow files.

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
