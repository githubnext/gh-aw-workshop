<!-- page-journey: ui -->
<!-- page-adventure: core -->
<!-- learning:false -->
# GitHub UI Path — No Installation Needed

> _The browser path skips the terminal entirely — your workflow compiles automatically through GitHub Actions, so you can go straight to writing._

## 🎯 What You'll Do

You'll confirm that `gh-aw` does **not** need to be installed on your machine for the GitHub UI path. Instead, GitHub Actions runs a compiled lock file that an agent produces for you. By the end of this step you'll understand exactly what happens behind the scenes and be ready to write your first workflow.

## 📋 Before You Start

- Completed [Set Up Your Environment — Browser Path](02c-setup-browser.md)
- You have a `my-agentic-workflows` repository on GitHub

## How the browser path works

Every agentic workflow is stored as a Markdown file (the **source**) and a compiled YAML lock file (the **runnable**). On the terminal path, you run `gh aw compile` locally to create the lock file. On the browser path, you skip that step: when you push or merge a workflow Markdown file, a GitHub Actions job compiles it automatically and commits the lock file back to your repository.

![Diagram showing a workflow .md file pushed via browser, compiled by a GitHub Actions job into a .lock.yml file, then executed by another Actions run](images/06c-ui-compile-flow.svg)

> [!NOTE]
> The auto-compile Actions job is added to your repository in the next step when you create your first workflow. You do not need to set it up manually.

## What you get instead of a CLI install

| Terminal path | Browser path (you are here) |
|---|---|
| Install `gh` and `gh-aw` extension | No installation needed |
| Run `gh aw compile` after each edit | GitHub Actions compiles on push |
| Push the `.lock.yml` file yourself | Actions commits the lock file for you |
| Immediate compiler feedback in the terminal | Compiler feedback appears in the Actions run log |

> [!TIP]
> If you ever want to try the terminal path later, you can install `gh-aw` at any point — it will work alongside your existing repository. See [Codespace Terminal Path — Install gh-aw](06a-install-terminal.md) or [Local Terminal Path — Install gh-aw](06b-install-local.md).

## One thing to keep in mind

Because compilation happens in Actions rather than immediately in your editor, you will see any syntax errors in the **Actions run log** rather than in your terminal. If a run shows a compile error:

1. Open the failing Actions run in your repository's **Actions** tab.
2. Expand the **Compile workflow** step.
3. Read the error message — it will name the line and property that needs fixing.
4. Click the pencil icon (✏️) on the workflow `.md` file, fix the error, and commit again.

The compile-in-Actions approach is reliable for the vast majority of edits. It is only slower to debug when you have a typo in the YAML frontmatter.

## ✅ Checkpoint

- [ ] You understand that the browser path skips local `gh aw compile`
- [ ] You know that GitHub Actions compiles and commits the lock file when you push a workflow Markdown file
- [ ] You know where to find compiler errors (Actions tab → Compile workflow step)
- [ ] You are ready to write your first workflow

**Next:** [Write Your First Agentic Workflow](07-your-first-workflow.md)
