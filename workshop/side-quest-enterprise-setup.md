# Side Quest: Enterprise Setup Considerations

> _Optional: use this guide if you're running the workshop in GHES or a managed enterprise environment, then return to your current step._

Use this side quest before setup if your environment differs from standard `github.com` defaults.

## Confirm Codespaces availability on GHES or enterprise policies

Codespaces availability varies by platform and policy:

- **GHES:** Codespaces is only available on supported GHES versions and when enabled by admins.
  Verify support in the [GHES Codespaces documentation](https://docs.github.com/en/enterprise-server@latest/codespaces/getting-started/enabling-github-codespaces-for-your-enterprise).
- **GHEC:** Org policies can restrict who can create Codespaces or which repositories are allowed.

Before continuing:

1. Ask your enterprise admin whether Codespaces is enabled for your organization and repository.
2. If Codespaces is available, continue with [Adventure A: Set Up a Codespace](02a-setup-codespace.md).
   If Codespaces is unavailable, switch to [Adventure B: Set Up Your Local Terminal](02b-setup-local.md).
3. Use your enterprise hostname in all `gh` auth and extension commands when required (for example, `gh auth login --hostname ghes.example.com`).
   See [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) for a complete enterprise hostname command sequence.

## Self-hosted runner prerequisites

If your enterprise requires self-hosted runners for GitHub Actions, confirm these before you continue:

- A runner is registered and online for your repository or org.
- The runner allows workflow jobs from your repository.
- Network egress allows access to required endpoints such as `github.com`, `api.github.com`, `raw.githubusercontent.com`, and any model or MCP endpoints your workflow uses.
- Required secrets and permissions are configured for runner-based execution.

If you do not have this access yet, ask your admin to provide a ready-to-use runner target before you build and run workflows.

## Model access and Copilot licensing requirements

Agentic workflows require both Actions execution and model access:

- You need an active Copilot plan supported by your enterprise policy (Business or Enterprise where required).
- Confirm your organization and repository allow Copilot model access in workflow runs.
- If model access is blocked by policy, workflow runs can start but fail when the agent step executes.

Before installing `gh-aw`, verify with your admin that your account and repository are permitted to run Copilot-powered workflow jobs.

## ✅ Checkpoint

- [ ] You know whether Codespaces is available in your enterprise environment
- [ ] You know whether you need a self-hosted runner and that it is ready
- [ ] You confirmed model access and required Copilot licensing with your admin
- [ ] You're ready to continue your current workshop step

Return to the workshop step where you opened this side quest.
Common return points are [Adventure A: Set Up a Codespace](02a-setup-codespace.md), [Adventure B: Set Up Your Local Terminal](02b-setup-local.md), and [Step 3](03-create-your-repo.md).
