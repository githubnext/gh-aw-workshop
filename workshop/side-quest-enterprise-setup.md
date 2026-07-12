# Side Quest: Enterprise Setup Considerations

> _Optional: use this guide if you're running the workshop in GHES or a managed enterprise environment, then return to your current step._

Use this side quest before setup if your environment differs from standard `github.com` defaults.

## Confirm Codespaces availability on GHES or enterprise policies

Codespaces availability varies by platform and policy:

- **GHES:** Codespaces may be unavailable unless your deployment and version support it.
- **GHEC:** Org policies can restrict who can create Codespaces or which repositories are allowed.

Before continuing:

1. Ask your enterprise admin whether Codespaces is enabled for your organization and repository.
2. If Codespaces is unavailable, follow [Adventure B: Set Up Your Local Terminal](02b-setup-local.md).
3. Keep using your enterprise hostname in all `gh` auth and extension commands when required.

## Self-hosted runner prerequisites

If your enterprise requires self-hosted runners for GitHub Actions, confirm these before you continue:

- A runner is registered and online for your repository or org.
- The runner allows workflow jobs from your repository.
- Network egress allows access to the endpoints needed by your workflow (GitHub API, model providers, and any MCP tools you use).
- Required secrets and permissions are configured for runner-based execution.

If you do not have this access yet, ask your admin to provide a ready-to-use runner target before you build and run workflows.

## Model access and Copilot licensing requirements

Agentic workflows require both Actions execution and model access:

- Your account needs an active Copilot plan supported by your enterprise policy (Business or Enterprise where required).
- Your organization and repository must allow GitHub-hosted model usage for workflows.
- If model access is blocked by policy, workflow runs can start but fail when the agent step executes.

Before installing `gh-aw`, verify with your admin that your account and repository are permitted to run Copilot-powered workflow jobs.

## ✅ Checkpoint

- [ ] You know whether Codespaces is available in your enterprise environment
- [ ] You know whether you need a self-hosted runner and that it is ready
- [ ] You confirmed model access and required Copilot licensing with your admin
- [ ] You're ready to continue your current workshop step

Return to [Adventure A: Set Up a Codespace](02a-setup-codespace.md), [Adventure B: Set Up Your Local Terminal](02b-setup-local.md), or [Step 3: Open and Verify Your Practice Repository](03-create-your-repo.md).
