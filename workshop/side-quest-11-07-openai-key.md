# Side Quest: Configure an OpenAI API Key

> _Optional: work through this guide when you want to use the `codex` engine (OpenAI-powered) for your agentic workflow, then return to your main path._

By default, [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) use the GitHub Copilot engine. To use **OpenAI models**, store an OpenAI API key as a repository secret and add one frontmatter line.

## 📋 Before You Start

- You have completed [Step 6: Install `gh-aw`](06-install-gh-aw.md) and have a working agentic workflow.
- You are familiar with YAML frontmatter `env:` blocks. If frontmatter is new, skim [Side Quest: Frontmatter Deep Dive — Part A](side-quest-11-01-frontmatter-deep-dive.md) before continuing.
- You have an OpenAI account or access to an OpenAI API key from your organization.

> [!NOTE]
> In `gh-aw`, `codex` is the engine identifier for OpenAI-powered execution. It does not refer to the discontinued [OpenAI Codex](side-quest-01-02-environment-reference.md#openai-codex) model family.

---

## What you'll set up

| Item | Value |
|---|---|
| Repository secret name | `OPENAI_API_KEY` |
| Frontmatter engine field | `engine: codex` |
| OpenAI API domain | `api.openai.com` |

---

## Get an OpenAI API key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and sign in (or create an account).
2. Click **Create new secret key**, give it a name (for example `gh-aw-workshop`), and click **Create secret key**.
3. Copy the key value immediately — it starts with `sk-` and OpenAI shows it **only once**.

> [!IMPORTANT]
> Paste the key into GitHub Secrets (the next section) **before** closing the OpenAI platform tab. If you close it first, you must delete the key and generate a new one.

**✏️ Verify:** Confirm your new key appears in the list at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) before continuing.

---

## Store the key as a repository secret

Open your repository in a **new tab** so you keep the OpenAI platform tab open.

1. Click **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Set the name to `OPENAI_API_KEY` and paste the key value (no extra whitespace).
4. Click **Add secret**.

> [!IMPORTANT]
> The name must be exactly `OPENAI_API_KEY`. Any variation (`openai_api_key`, `OPENAI-API-KEY`) causes a silent authentication failure.

**✏️ Verify:** Run this command and confirm `OPENAI_API_KEY` appears in the output:

```bash
gh secret list
```

---

## Update your workflow frontmatter

Add `engine: codex` and the `network.allowed` entry to your workflow's frontmatter. You can omit `copilot-requests: write` — it is specific to the Copilot engine.

```yaml
---
name: My Workflow
on:
  workflow_dispatch:
permissions:
  contents: read
engine: codex
network:
  allowed:
    - defaults
    - api.openai.com
---
```

**✏️ Verify:** Confirm your frontmatter includes `engine: codex` and the secret reference:

```yaml
engine: codex
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## Optional: choose a specific OpenAI model

To pin a model version, use the extended engine syntax:

```yaml
engine:
  id: codex
  model: gpt-4o-mini
```

Leave `model` out to use the engine's current default, which the `gh-aw` team keeps up to date.

---

## Compile and validate

After updating your frontmatter, recompile the workflow to check for errors:

```bash
gh aw compile --validate
```

You should see:

```
✔ <your-workflow>.md — valid
```

---

## ✅ Checkpoint

- [ ] You have an OpenAI account and have generated an API key
- [ ] My new key is listed at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [ ] `OPENAI_API_KEY` is stored as a repository secret (`gh secret list` confirms it)
- [ ] My workflow frontmatter has `engine: codex` and `api.openai.com` in `network.allowed`
- [ ] `gh aw compile --validate` reports no errors

**Return to:** [Build — Daily Repo Status Workflow](11a-build-daily-status.md) or [Adventure A: Build Daily Status with the Add Wizard](11a-build-daily-status-wizard.md)

## 📚 See Also

- [About Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Authentication reference](https://github.github.com/gh-aw/reference/auth/#codex)
- [Network Permissions](https://github.github.com/gh-aw/reference/network/)
