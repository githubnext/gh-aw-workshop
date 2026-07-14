# Step 7: Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create `.github/workflows/hello-agent.md`, a small workflow that reads repository issues and posts one controlled response.

## 📋 Before You Start

- Completed [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command is available in your terminal (or you'll use the GitHub UI path)
- If you are using Terminal or Copilot paths, `gh aw init` has been run and pushed in your practice repository

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build the workflow incrementally in two short parts, compile after each meaningful change, then commit and push | [Write the workflow with the Terminal path](07a-your-first-workflow-terminal.md) |
| **GitHub UI path** | Paste the complete workflow into the web editor and commit it in the browser | [Write the workflow with the GitHub UI path](07b-your-first-workflow-ui.md) |
| **GitHub Copilot path** | Ask an agent to create and validate the workflow, then review and merge its pull request | [Write the workflow with GitHub Copilot](07c-your-first-workflow-copilot.md) |

The Terminal path gives you early compiler feedback. The GitHub UI path skips local compile checkpoints; GitHub Actions compiles the workflow when it runs. The GitHub Copilot path delegates `gh aw compile ... --validate` to the agent's session workspace.

## Before You Continue

In one sentence, where will you manually start the first `workflow_dispatch` run in your chosen path?

## ✅ Checkpoint

- [ ] You chose one path (Terminal, GitHub UI, or GitHub Copilot) and are ready to follow that step
- [ ] You can explain in one sentence how `hello-agent.md` differs from `hello-agent.lock.yml`
- [ ] You know the compile command for an agentic workflow file: `gh aw compile`
- [ ] You know the compiled file location: `.github/workflows/hello-agent.lock.yml`

**Next:** Continue with your chosen path above.
