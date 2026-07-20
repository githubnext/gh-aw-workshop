---
journey: all
adventure: core
---

# Before we start

## 🎯 What You'll Do

In this step, you confirm your account and tool prerequisites, then choose your setup path. After this, you continue directly to the matching setup instructions instead of doing setup work here.

## Confirm account access

Sign in at [github.com](https://github.com). If you do not have an account yet, create one at github.com/signup.

## Choose your development environment

If you are unsure, start with a Codespace. It gives you a ready-to-use environment hosted in the cloud.

If you are familiar with terminals, use your usual setup. We will go over the requirements.

If you choose the GitHub UI path, you can complete the main workshop steps in your browser and still run a real workflow from the Actions tab.

![Setup path decision diagram: choose between Codespace and Local Terminal based on your environment](images/01-setup-path-decision.svg)


### Confirm local tools (only if using local terminal)

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

## Verify AI engine access

Open [github.com/settings/copilot](https://github.com/settings/copilot) and confirm both show:

- **Copilot is enabled**
- **Models: available**

Claude, Codex, or Gemini? Confirm your API key.


## Let's get started!

Choose your adventure.

<!-- journey: codespace -->
**Next:** Open [Set Up a Codespace](02a-setup-codespace.md).
<!-- /journey -->
<!-- journey: local -->
**Next:** Open [Set Up Your Local Terminal](02b-setup-local.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
**Next:** Open [Use GitHub Web or Copilot App](03b-create-your-repo-ui.md).
<!-- /journey -->

