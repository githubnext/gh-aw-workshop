<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Enterprise Setup Considerations

> _Required for GHES users before attempting to create or run [agentic workflows](https://github.github.com/gh-aw/introduction/overview/). Also useful if you are running any setup step in a managed enterprise environment — complete this guide, then return to your current step._

## 📋 Before You Start

- You have a GitHub account and know whether your environment is `github.com`, GitHub Enterprise Cloud (GHEC), or GitHub Enterprise Server (GHES).
- You can reach your GitHub Enterprise administrator to confirm GHES version and policy settings.
- You have started [Prerequisites](01-prerequisites.md) or an early setup step that directed you here.

Use this side quest if your environment differs from standard `github.com` defaults.

## Confirm GHES version and agentic workflow support

Agentic workflows require **GHES 3.12 or later**. On earlier versions, the Copilot cloud agent feature is unavailable regardless of licensing or policy settings.

| GitHub deployment | Agentic workflows supported? |
|---|---|
| **github.com** | ✅ Fully supported |
| **GitHub Enterprise Cloud (GHEC)** | ✅ Fully supported |
| **GitHub Enterprise Server (GHES) 3.12+** | ✅ Supported when Copilot Enterprise and network access are configured by admin |
| **GitHub Enterprise Server (GHES) < 3.12** | ❌ Not supported — upgrade required |

Before continuing:

1. Ask your GitHub Enterprise administrator to confirm the GHES version running in your environment.
2. If your instance is below 3.12, you cannot run agentic workflows hands-on — you can follow along in read-only mode or request a `github.com` account to complete the execution steps.
3. If your instance is 3.12+, continue with the sections below to confirm Codespaces, runner, and model access prerequisites.

## Confirm Codespaces availability on GHES or enterprise policies

Codespaces availability varies by platform and policy:

- **GHES:** Codespaces is only available on supported GHES versions and when enabled by admins.
  Verify support in the [Codespaces organization documentation](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-codespaces-for-your-organization/enabling-or-disabling-github-codespaces-for-your-organization).
- **GHEC:** Org policies can restrict who can create Codespaces or which repositories are allowed.

Before continuing:

1. Ask your enterprise admin whether Codespaces is enabled for your organization and repository.
2. If Codespaces is available, continue with [Adventure Codespace: Set Up a Codespace](02a-setup-codespace.md).
   If Codespaces is unavailable, switch to [Adventure Local: Set Up Your Local Terminal](02b-setup-local.md).
3. Use your enterprise hostname in all `gh` auth and extension commands when required (for example, `gh auth login --hostname ghes.example.com`).
   See [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) for a complete enterprise hostname command sequence.

> 🤔 **Predict:** Look up your enterprise hostname before continuing. After confirming it, run the following command and verify the output shows your GHES instance:
>
> ```bash
> gh auth login --hostname <your-ghes-hostname>
> gh auth status
> ```

## Self-hosted runner prerequisites

If your enterprise requires [self-hosted runners](https://github.github.com/gh-aw/reference/self-hosted-runners/) for GitHub Actions, confirm these before you continue:

- A runner is registered and online for your repository or org.
- The runner allows workflow jobs from your repository.
- If your network uses an outbound proxy, proxy settings are configured for runner jobs.
- Network egress allows access to required endpoints such as `github.com`, `api.github.com`, `raw.githubusercontent.com`, and any model or MCP endpoints your workflow uses.
- Required secrets and permissions are configured for runner-based execution.

If you do not have this access yet, ask your admin to provide a ready-to-use runner target before you build and run workflows.

## Model access and Copilot licensing requirements

Agentic workflows require both Actions execution and model access:

- You need an active Copilot plan supported by your enterprise policy (Business or Enterprise where required).
- Confirm your organization and repository allow Copilot model access in workflow runs.
- If model access is blocked by policy, workflow runs can start but fail when the agent step executes.

Before installing `gh-aw`, verify with your admin that your account and repository are permitted to run Copilot-powered workflow jobs.

<!-- journey: all -->
## ✅ Checkpoint

- [ ] Your GHES instance is version 3.12 or later (or you are on `github.com`/GHEC)
- [ ] You know whether Codespaces is available in your enterprise environment
- [ ] You know whether you need a self-hosted runner and that it is ready
- [ ] You confirmed Copilot Enterprise and model access are enabled with your admin
- [ ] You're ready to continue your current workshop step

Return to the workshop step where you opened this side quest.
Common return points are [Prerequisites](01-prerequisites.md), [Adventure Codespace: Set Up a Codespace](02a-setup-codespace.md), [Adventure Local: Set Up Your Local Terminal](02b-setup-local.md), [Step 3](03-create-your-repo.md), and [What Are Agentic Workflows?](05-agentic-workflows-intro.md).

<!-- /journey -->

