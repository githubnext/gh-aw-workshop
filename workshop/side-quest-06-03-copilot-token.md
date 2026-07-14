# Side Quest: Configure GitHub Copilot Authentication

> _Optional: work through this guide when you need to configure Copilot authentication for an agentic workflow, then return to your main path._

Agentic workflows that use the Copilot engine need to authenticate with GitHub Copilot at runtime. Choose the method that fits your situation:

| Method | Best for | Guide |
|---|---|---|
| **Copilot requests permission** (recommended) | Most workflows — active Copilot subscription, no secret needed | [Method 1 →](side-quest-06-03a-copilot-requests-permission.md) |
| **`COPILOT_GITHUB_TOKEN` secret** | Service accounts, older workflows, or org-level overrides | [Method 2 →](side-quest-06-03b-copilot-github-token.md) |

If you are unsure, start with **Method 1**. It requires no secrets and works for the vast majority of learners.

**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md)
