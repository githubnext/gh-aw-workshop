# Side Quest: Configure an Anthropic API Key

> _Optional: work through this guide when you want to use [Claude](side-quest-01-02-environment-reference.md#claude) (Anthropic's model family) as the AI engine for your agentic workflow, then return to your main path._

By default, agentic workflows run on the GitHub Copilot engine. If you prefer to use **Claude**, you'll need an Anthropic API key stored as a repository secret and a one-line change to your workflow frontmatter.

---

## What you'll set up

| Item | Value |
|---|---|
| Repository secret name | `ANTHROPIC_API_KEY` |
| Frontmatter engine field | `engine: claude` |
| Anthropic API domain | `api.anthropic.com` |

---

## Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/) and sign in (or create an account).
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create Key**, give it a name (for example `gh-aw-workshop`), and click **Create Key**.
4. Copy the key value — it starts with `sk-ant-`. You won't be able to view it again after closing the dialog.

> [!NOTE]
> Anthropic API keys are billed per token. Check the [Anthropic pricing page](https://www.anthropic.com/pricing) for current model costs and set a usage limit in the console to avoid unexpected charges.

---

## Store the key as a repository secret

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Set the name to `ANTHROPIC_API_KEY` and paste the key value.
5. Click **Add secret**.

> [!TIP]
> Secret names must use only uppercase letters, digits, and underscores. `ANTHROPIC_API_KEY` is the exact name the `claude` engine looks for — do not rename it.

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
engine: claude
---
```

> [!NOTE]
> You can omit `copilot-requests: write` when using the `claude` engine — that permission is specific to the Copilot engine. Leave it out to keep permissions minimal.

A more complete example with network access configured:

```yaml
---
name: My Workflow
on:
  workflow_dispatch:
permissions:
  contents: read
engine: claude
network:
  allowed:
    - defaults
    - api.anthropic.com
---
```

> [!TIP]
> The `claude` engine requires outbound access to `api.anthropic.com`. If your workflow uses the default `network: defaults` setting, add `api.anthropic.com` to the allow-list as shown above.

---

## Optional: choose a specific Claude model

You can pin a specific Claude model version using the extended engine syntax:

```yaml
engine:
  id: claude
  model: claude-opus-4-5
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

- [ ] You have an Anthropic account and have generated an API key
- [ ] `ANTHROPIC_API_KEY` is stored as a repository secret
- [ ] Your workflow frontmatter has `engine: claude`
- [ ] `gh aw compile --validate` reports no errors
- [ ] (If using network isolation) `api.anthropic.com` is in the `network.allowed` list

**Return to:** [Build — Daily Repo Status Workflow](11a-build-daily-status.md) or [Adventure A: Build Daily Status with the Add Wizard](11a-build-daily-status-wizard.md)
