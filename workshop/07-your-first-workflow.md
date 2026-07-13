# Step 7: Write Your First Agentic Workflow

_Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create `.github/workflows/hello-agent.md`, a small workflow that reads repository issues and posts one controlled response.

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build the workflow incrementally in two short parts, compile after each meaningful change, then commit and push | [Write the workflow with the Terminal path](07a-your-first-workflow-terminal.md) |
| **GitHub UI path** | Paste the complete workflow into the web editor and commit it in the browser | [Write the workflow with the GitHub UI path](07b-your-first-workflow-ui.md) |
| **GitHub Copilot path** | Ask an agent to create and validate the workflow, then review and merge its pull request | [Write the workflow with GitHub Copilot](07c-your-first-workflow-copilot.md) |

The Terminal path gives you early compiler feedback. The GitHub UI path skips local compile checkpoints; GitHub Actions compiles the workflow when it runs. The GitHub Copilot path delegates `gh aw compile ... --validate` to the agent's session workspace.

## ✅ Checkpoint

- [ ] You chose the path that matches how you want to work
- [ ] You understand that all paths create the same `hello-agent.md` workflow

**Next:** Continue with your chosen path above.
