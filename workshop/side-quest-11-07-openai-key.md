# Side Quest: Configure an OpenAI API Key

> _Optional: work through this guide when you want to use Codex (OpenAI's coding engine) as the AI engine for your agentic workflow, then return to your main path._

By default, agentic workflows run on the GitHub Copilot engine. If you prefer to use **Codex** (OpenAI), you'll need an OpenAI API key stored as a repository secret and a one-line change to your workflow frontmatter.

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
3. Copy the key value — it starts with `sk-`. You won't be able to view it again after closing the dialog.

> [!NOTE]
> OpenAI API keys are billed per token. Check the [OpenAI pricing page](https://openai.com/pricing) for current model costs and configure a usage limit in your OpenAI account settings to avoid unexpected charges.

---

## Store the key as a repository secret

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Set the name to `OPENAI_API_KEY` and paste the key value.
5. Click **Add secret**.

> [!TIP]
> Secret names must use only uppercase letters, digits, and underscores. `OPENAI_API_KEY` is the exact name the `codex` engine looks for — do not rename it.

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

> [!NOTE]
> You can omit `copilot-requests: write` when using the `codex` engine — that permission is specific to the Copilot engine. Leave it out to keep permissions minimal.

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

> [!TIP]
> The `codex` engine requires outbound access to `api.openai.com`. If your workflow uses the default `network: defaults` setting, add `api.openai.com` to the allow-list as shown above.

---

## Optional: choose a specific OpenAI model

You can pin a specific model version using the extended engine syntax:

```yaml
engine:
  id: codex
  model: o4-mini
```

Leave the `model` field out to use the engine's current default model, which is kept up to date by the `gh-aw` team.

---

## Compile and validate

After updating your frontmatter, recompile the workflow to check for errors:

```bash
gh aw compile .github/workflows/<your-workflow>.md --validate
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
