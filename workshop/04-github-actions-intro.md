# Step 4: GitHub Actions in 5 Minutes

_You already have a repository — now anchor on the parts of Actions that matter for agentic workflows._

> [!TIP]
> Already comfortable with GitHub Actions workflows and YAML? You can skip this step and go straight to [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md).

## 🎯 What You'll Do

You'll do a fast refresher on the Actions primitives used in this workshop: triggers, jobs, steps, and workflow files.

If you want a quick preview of what changes with agentic workflows before installing `gh-aw`, continue to Step 5.

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

Step 5 is the key transition: _what changes when a workflow can reason and choose next actions_.

## ✅ Checkpoint

- [ ] I can identify `on`, `jobs`, and `steps` in a workflow file
- [ ] I know workflows live in `.github/workflows/`
- [ ] I can continue to Step 5 (or I skipped here as an advanced user)

**Next:** [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md)
