<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Configure an Anthropic API Key

> _Optional: work through this guide when you want to use [Claude](side-quest-01-02-environment-reference.md#claude) (Anthropic's model family) as the AI engine for your agentic workflow, then return to your main path._

By default, [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) run on the GitHub Copilot engine. If you prefer to use **Claude**, you'll need an Anthropic API key stored as a repository secret and a one-line change to your workflow frontmatter.

## 📋 Before You Start

- You have an Anthropic account at [console.anthropic.com](https://console.anthropic.com/).
- You have a practice repository with at least one agentic workflow `.md` file.

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
2. Click **Create Key**, give it a name (for example `gh-aw-workshop`), and click **Create Key**.
3. Copy the key value — it starts with `sk-ant-`.

> [!IMPORTANT]
> Anthropic shows the full key value **only once**. Copy it to your clipboard before you close the dialog or navigate away. If you miss this window, you must delete the key and generate a new one.
>
> Paste the key into GitHub Secrets (the next section) **before** closing the Anthropic console tab.

<!-- -->

> [!NOTE]
> Anthropic API usage is billed per token. Review the [Anthropic pricing page](https://www.anthropic.com/pricing) and set a usage limit before running workflows to avoid surprise charges.

---

## Store the key as a repository secret

Open your repository in a **new tab** so you keep the Anthropic console tab open until the secret is saved.

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Set the name to `ANTHROPIC_API_KEY` and paste the key value. Check there is no extra whitespace at the start or end.
5. Click **Add secret**.
6. Confirm the secret appears in the list as `ANTHROPIC_API_KEY`.

> [!TIP]
> Secret names must use only uppercase letters, digits, and underscores. `ANTHROPIC_API_KEY` is the exact name the `claude` engine looks for — do not rename it or add hyphens.

<details>
<summary>Common mistakes with this secret</summary>

- **Wrong name**: any variation (`anthropic_api_key`, `ANTHROPIC-API-KEY`, `CLAUDE_API_KEY`) will cause a silent auth failure. The name must be exactly `ANTHROPIC_API_KEY`.
- **Copied with extra whitespace**: pasting from some tools adds a leading space. Delete and re-create the secret if you are unsure.
- **Closed the Anthropic tab before saving**: you cannot retrieve the key again. Delete the key at [console.anthropic.com](https://console.anthropic.com/) and generate a new one.
- **Network allow-list missing**: the `claude` engine needs outbound access to `api.anthropic.com`. Make sure it is in your `network.allowed` list (shown in the frontmatter example below).

</details>

---

## Update your workflow frontmatter

Open your workflow `.md` file and update the frontmatter:

```yaml
---
name: My Workflow
on:
  workflow_dispatch:
permissions:
  contents: read        # keep only the scopes your workflow needs
engine: claude          # switch from the default Copilot engine to Claude
network:
  allowed:
    - defaults
    - api.anthropic.com # required so the workflow can reach Anthropic
---
```

If you previously added `copilot-requests: write` for the Copilot engine, you can remove it when switching to `claude`.

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

- [ ] You have an Anthropic account and have generated an API key
- [ ] `ANTHROPIC_API_KEY` is stored as a repository secret
- [ ] Your workflow frontmatter has `engine: claude`
- [ ] `gh aw compile --validate` reports no errors
- [ ] (If using network isolation) `api.anthropic.com` is in the `network.allowed` list

<!-- journey: all -->
**Return to:** [Build — Daily Repo Status Workflow](07-your-first-workflow.md) or [Adventure Codespace: Build Daily Status with the Add Wizard](07c-your-first-workflow-copilot.md)
<!-- /journey -->


