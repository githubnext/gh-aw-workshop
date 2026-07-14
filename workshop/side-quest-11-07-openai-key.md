# Side Quest: Configure an OpenAI API Key

> _Optional: work through this guide when you want to use the `codex` engine (OpenAI-powered) for your agentic workflow, then return to your main path._

By default, agentic workflows use the GitHub Copilot engine. To use **OpenAI models**, store an OpenAI API key as a repository secret and add one frontmatter line.

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
3. Copy the key value — it starts with `sk-`.

> [!NOTE]
> OpenAI API keys are billed per token and are subject to account limits. Check the [OpenAI pricing page](https://openai.com/pricing) and your [OpenAI usage limits](https://platform.openai.com/settings/organization/limits) before running workflows to avoid surprise charges or throttling.

<details>
<summary>Key rotation best practices</summary>

- Save the key in GitHub right away because OpenAI only shows the full value once.
- Use a recognizable name so you can identify its workflow or repository later.
- Rotate the key immediately if you paste it into the wrong place or think it may have been exposed.
- Delete old or unused keys from the OpenAI dashboard after you confirm the replacement works.

</details>

---

## Store the key as a repository secret

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Set the name to `OPENAI_API_KEY` and paste the key value.
5. Click **Add secret**.

Secret names must use only uppercase letters, digits, and underscores. `OPENAI_API_KEY` is the exact name the `codex` engine looks for, so do not rename it.

---

## Update your workflow frontmatter

Open your workflow `.md` file and add the `engine` field to the frontmatter:

```yaml
---
name: My Workflow
on:
  workflow_dispatch:
permissions:
  contents: read
engine: codex
---
```

You can omit `copilot-requests: write` when using the `codex` engine. That permission is specific to the Copilot engine.

A more complete example with network access configured:

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

The `codex` engine needs outbound access to `api.openai.com`. If your workflow uses the default `network: defaults` setting, add `api.openai.com` to the allow-list as shown above.

---

## Optional: choose a specific OpenAI model

For most workshop workflows, `gpt-4o-mini` is the right choice — it is fast and cheap.

You can pin a specific model version using the extended engine syntax:

```yaml
engine:
  id: codex
  model: gpt-4o-mini
```

Leave the `model` field out to use the engine's current default model, which is kept up to date by the `gh-aw` team. For more advanced configuration details (including project-scoped keys, quotas, and model availability), use the [OpenAI API docs](https://platform.openai.com/docs/overview).

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
- [ ] `OPENAI_API_KEY` is stored as a repository secret
- [ ] Your workflow frontmatter has `engine: codex`
- [ ] `gh aw compile --validate` reports no errors
- [ ] (If using network isolation) `api.openai.com` is in the `network.allowed` list

**Return to:** [Build — Daily Repo Status Workflow](11a-build-daily-status.md) or [Adventure A: Build Daily Status with the Add Wizard](11a-build-daily-status-wizard.md)
