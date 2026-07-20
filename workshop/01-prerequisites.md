---
journey: all
adventure: core
---
# Step 1: What You Need Before We Start

_Starting with the right setup saves you from frustrating detours later._

## 📋 Before You Start

This step checks that all the tools and accounts you need are in place before you start building workflows.

## Enterprise users

> [!IMPORTANT]
> <details>
> <summary><b>Using GHEC, GHES, or EMU? Complete this check before you continue.</b></summary>
>
> [Agentic workflows](https://github.github.com/gh-aw/introduction/overview/) will not run until all three Copilot Enterprise prerequisites are true for the organization that owns your workshop repository:
>
> - [ ] Copilot Enterprise is enabled for the organization
> - [ ] A Copilot Enterprise seat is assigned to your account
> - [ ] The Copilot policy is active for your account (**Settings → Copilot → Policies**)
>
> Next steps:
> - Complete the [Enterprise setup guide](side-quest-enterprise-setup.md) before you proceed
> - Run `gh copilot --version` to confirm Copilot CLI support is available in your environment
> - Check **Settings → Copilot** to confirm your Copilot access is enabled for this account
>
> **Blocked? Send your GitHub org admin this note:**
>
> > I'm taking the gh-aw workshop.
> >
> > Step 1 requires GitHub Copilot Enterprise to be enabled for the organization that owns my workshop repository.
> >
> > Please enable Copilot Enterprise, assign me a seat, and confirm the policy is active for my account.
>
> Review [About GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent) for current enterprise and GHES capability constraints.
>
> </details>

<!-- -->

<!-- journey: codespace -->
> [!TIP]
> **Using a Codespace (recommended for new users)?** The `gh` CLI and `gh-aw` extension come pre-installed. A free GitHub account is enough to begin. → [Skip to Adventure A: Codespace Setup](02a-setup-codespace.md)
<!-- /journey -->

## ✅ Required pre-flight checks

Complete these checks before you continue:

**Action:** Open [github.com](https://github.com) and confirm your account menu appears. Review the three development environment options now: Codespace, local terminal, and GitHub UI.

- [ ] You can sign in to GitHub with the account you'll use for the workshop
- [ ] You have chosen which development environment you'll use: Codespace, local terminal, or GitHub UI
- [ ] If you chose a local terminal path, `gh --version` reports [GitHub CLI](side-quest-01-02-environment-reference.md#github-cli-gh) 2.40+
- [ ] If you chose a local terminal path, `git --version` works
- [ ] If you're on GHEC, GHES, or EMU, you reviewed [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) and confirmed your environment is ready
- [ ] Open [github.com/settings/copilot](https://github.com/settings/copilot) and confirm both **Copilot is enabled** and **Models: available**

## 🔀 Choose Your Setup Path

Pick one path now, then follow that file:

| If you are... | Continue with... |
|---|---|
| New to coding, using a school/shared machine, or want the quickest start | [Adventure A: Set Up a Codespace](02a-setup-codespace.md) |
| Comfortable with local tooling and terminal setup | [Adventure B: Set Up Your Local Terminal](02b-setup-local.md) |
| Working entirely in the GitHub web UI | [Step 3b: GitHub UI Path](03b-create-your-repo-ui.md) |

If you are unsure, start with a Codespace. It gives you a ready-to-use environment, and you can switch later by returning to [Step 1](01-prerequisites.md) and following another path link.

If you choose the GitHub UI path, you can complete the main workshop steps in your browser and still run a real workflow from the Actions tab in [Step 8](08-run-your-workflow.md).

If you are new to GitHub Actions, that is fine. You will trigger runs from the **Actions** tab with guided steps in this workshop. [Step 4](04-github-actions-intro.md) gives a short background when you want it.

![Setup path decision diagram: choose between Codespace and Local Terminal based on your environment](images/01-setup-path-decision.svg)

## 🎯 What You'll Do

In this step, you confirm your account and tool prerequisites, then choose your setup path. After this, you continue directly to the matching setup instructions instead of doing setup work here.

## Steps

### Confirm account access

Sign in at [github.com](https://github.com). If you do not have an account yet, create one at github.com/signup.

### Confirm local tools (only if using Adventure B)

If you plan to use your own computer, run `gh --version` to verify GitHub CLI and `git --version` to verify Git.

```bash
gh --version
git --version
```

If `gh` is missing, install it from [cli.github.com](https://cli.github.com), re-run `gh --version`, then continue in [Adventure B](02b-setup-local.md) for full local setup.
If both commands work, continue in [Adventure B](02b-setup-local.md).

Need extra help before Step 2?

- [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md)
- [Side Quest: Environment Reference](side-quest-01-02-environment-reference.md)

### Verify AI engine access

Open [github.com/settings/copilot](https://github.com/settings/copilot) and confirm both show:

- **Copilot is enabled**
- **Models: available**

Claude, Codex, or Gemini? Confirm your API key.

> [!IMPORTANT]
> Complete this check now — Step 7 will not work without it.

### Continue to your path file

Continue with exactly one of these paths:

<!-- journey: codespace -->
- **Adventure A (Codespace):** open a Codespace and verify preinstalled tools in [02a-setup-codespace.md](02a-setup-codespace.md).
<!-- /journey -->
<!-- journey: local -->
- **Adventure B (Local):** install or verify local prerequisites and authentication in [02b-setup-local.md](02b-setup-local.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
- **GitHub UI path:** skip terminal setup and continue in [03b-create-your-repo-ui.md](03b-create-your-repo-ui.md).
<!-- /journey -->

## ✅ Checkpoint

- [ ] **If you're on GHEC, GHES, or EMU:** You reviewed [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) and confirmed your environment meets the enterprise requirements
- [ ] You can sign in to GitHub with the account you'll use for the workshop
- [ ] You chose one path: Codespace (02a), Local (02b), or GitHub UI (03b)
- [ ] If using Local (02b), `gh` CLI 2.40+ and Git are available
- [ ] You confirmed Copilot is enabled and Models: available at [github.com/settings/copilot](https://github.com/settings/copilot)
- [ ] You know which file you will open next

<!-- journey: codespace -->
**Next:** Open [Adventure A: Set Up a Codespace](02a-setup-codespace.md).
<!-- /journey -->
<!-- journey: local -->
**Next:** Open [Adventure B: Set Up Your Local Terminal](02b-setup-local.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
**Next:** Open [Step 3b: Create Your Repository — GitHub UI Path](03b-create-your-repo-ui.md).
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/) and [Side Quest: Environment Reference](side-quest-01-02-environment-reference.md).

