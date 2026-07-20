---
journey: all
adventure: side-quest
---
# Side Quest: Configure GitHub Copilot Authentication

> _Optional: work through this guide when you need to configure Copilot authentication for an agentic workflow, then return to your main path._

## 📋 Before You Start

- You have completed [Install the gh-aw CLI Extension](06-install-gh-aw.md).
- You have access to your repository's settings (needed if you choose Method 2).

## Why authentication matters

Agentic workflows call the GitHub Copilot API at runtime to run AI reasoning steps. Without a valid credential, every call returns `401 Unauthorized` and the workflow fails immediately. Configuring authentication once, before you run a workflow, ensures your agent can reach Copilot reliably on every future run.

If you are using a terminal, prefer the guided `gh-aw` setup flows where possible:

- `gh aw secrets bootstrap --engine copilot` after you choose personal billing
- `gh aw add-wizard ...` when you are installing a curated workflow and want setup prompts inline

Use the manual guides below when you need or prefer the step-by-step browser procedure.

## Choose your method

Choose the method that fits your situation:

| Method | Best for | Guide |
|---|---|---|
| **Copilot requests permission** (recommended) | Organizations with centralized Copilot billing enabled for Actions | [Method 1 →](side-quest-06-03a-copilot-requests-permission.md) |
| **`COPILOT_GITHUB_TOKEN` secret** | Personal billing, or organizations without centralized Copilot billing | [Method 2 →](side-quest-06-03b-copilot-github-token.md) |
| **`COPILOT_GITHUB_TOKEN` secret (UI-only)** | Same as Method 2, but using only GitHub web UI steps | [Method 2 (UI-only) →](side-quest-06-03c-copilot-github-token-ui-only.md) |

If you are unsure, check who owns your practice repository first:

- Organization with centralized Copilot billing → use **Method 1**
- Personal repository or organization without centralized billing → use **Method 2**

> [!IMPORTANT]
> Choose one method. When `copilot-requests: write` is present, `COPILOT_GITHUB_TOKEN` is ignored for inference. Remove the permission and recompile when switching to personal billing.

## ✅ Checkpoint

- [ ] I have identified which authentication method fits my situation.
- [ ] I have completed either Method 1 or Method 2 (followed the linked guide to the end).
- [ ] My workflow source and compiled lock file use only the selected method.
- [ ] I have returned to my main workshop path.

<!-- journey: all -->
**Return to:** [Install the gh-aw CLI Extension](06-install-gh-aw.md) | [Write Your First Agentic Workflow](07-your-first-workflow.md)
<!-- /journey -->
