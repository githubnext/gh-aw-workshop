<!-- page-journey: all -->
<!-- page-adventure: core -->
<!-- learning:false -->

# Before we start

## 🎯 What You'll Do

In this step, you confirm your account and tool prerequisites, then choose your setup path. After this, you continue directly to the matching setup instructions instead of doing setup work here.

## Confirm account access

Sign in at [github.com](https://github.com). If you do not have an account yet, use the **Sign up** option there first.

## Choose your development environment

Answer the two questions below to find your path — then follow the matching link.

**Are you on a phone or tablet right now?**

> If yes → use the **Browser path**. No terminal or local install needed.
> [Set Up Without a Terminal →](02c-setup-browser.md)

**Do you want to use your own local terminal and tools?**

> If yes → use the **Local terminal path**.
> [Set Up Your Local Terminal →](02b-setup-local.md)

**Otherwise** (browser with cloud terminal, or unsure) → use the **Codespace path**. It runs entirely in your browser with a ready-to-use terminal — no installs required.
[Set Up a Codespace →](02a-setup-codespace.md)

| Path | Best for | What you need |
|---|---|---|
| **Codespace** | Most learners — no local installs needed | A GitHub account with Codespaces access |
| **Local terminal** | Developers with an existing terminal setup | Git and the `gh` CLI installed locally |
| **Browser (no terminal)** | Phone, tablet, or shared-computer learners | A GitHub account and a browser |

![Setup path decision diagram: choose between Codespace, Local Terminal, and Browser based on your environment](images/01-setup-path-decision.svg)

> [!IMPORTANT]
> Pick exactly one path and follow only those instructions. The three paths diverge from here and rejoin at [Step 4](04-github-actions-intro.md).

## Verify AI engine access

Open [github.com/settings/copilot](https://github.com/settings/copilot) and confirm both show:

- **Copilot CLI is enabled**
- Some **Models are available**

This workshop uses GitHub Copilot, so you can continue without configuring external provider API keys.

> [!TIP]
> Agentic Workflows supports multiple agent and model providers (for example, Anthropic Claude Code, OpenAI Codex, and Google Gemini), but this workshop uses GitHub Copilot end-to-end so you can focus on workflow concepts.

<!-- journey: codespace -->
**Next:** Open [Set Up a Codespace](02a-setup-codespace.md).
<!-- /journey -->
<!-- journey: local -->
**Next:** Open [Set Up Your Local Terminal](02b-setup-local.md).
<!-- /journey -->
<!-- journey: ui,copilot -->
**Next:** Open [Set Up Without a Terminal](02c-setup-browser.md).
<!-- /journey -->
