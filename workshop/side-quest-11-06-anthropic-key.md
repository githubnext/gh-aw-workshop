<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Configure an Anthropic API Key

> _Optional: work through this guide when you want to use [Claude](side-quest-01-02-environment-reference.md#claude) (Anthropic's model family) as the AI engine for your [agentic workflow](https://github.github.com/gh-aw/introduction/overview/), then return to your main path._

By default, [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) run on the [GitHub Copilot engine](https://github.github.com/gh-aw/reference/engines/). If you prefer to use **[Claude](https://github.github.com/gh-aw/reference/auth/#claude)**, you'll need an Anthropic API key stored as a repository secret and a one-line change to your [workflow frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).

## :clipboard: Before You Start

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
> <details><summary>Key is shown only once — save it before closing this tab</summary>
>
> Anthropic shows the full key value **only once**. Copy it to your clipboard before you close the dialog or navigate away. If you miss this window, you must delete the key and generate a new one.
>
> Paste the key into GitHub Secrets (the next section) **before** closing the Anthropic console tab.
>
> </details>

<!-- -->

> [!NOTE]
> Anthropic API usage is billed per token. Review the [Anthropic pricing page](https://www.anthropic.com/pricing) and set a usage limit before running workflows to avoid surprise charges.

---

## Store the key as a repository secret

Keep the Anthropic console tab open until the secret is saved. In your Codespace terminal, run the following command from your practice repository. It prompts you to paste the key, so the key never lands in your shell history:

```bash
gh secret set ANTHROPIC_API_KEY
```

Expected output:

```text
? Paste your secret ********
✓ Set Actions secret ANTHROPIC_API_KEY for <your-account>/<your-repo>
```

Confirm the secret exists:

```bash
gh secret list
```

Expected output includes a row like `ANTHROPIC_API_KEY    less than a minute ago`.

> [!TIP]
> Prefer the browser? Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Either way, the name must be exactly `ANTHROPIC_API_KEY`.

<details>
<summary>Common mistakes with this secret</summary>

- **Wrong name**: any variation (`anthropic_api_key`, `CLAUDE_API_KEY`) causes a silent auth failure.
- **Extra whitespace**: delete and re-create the secret if you are unsure.
- **Closed the Anthropic tab before saving**: the key can't be shown again. Delete it in the console and generate a new one.
- **Missing network entry**: the `claude` engine needs `api.anthropic.com` in your [network.allowed](https://github.github.com/gh-aw/reference/network/) list (shown below).

</details>

---

## Update your workflow frontmatter

Open your workflow `.md` file and update the frontmatter:

```markdown
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

## Compile your workflow

After updating your frontmatter, compile the workflow to regenerate the lock file:

```bash
gh aw compile
```

Expected output ends with a line similar to:

```text
✓ Compiled my-workflow.md → my-workflow.lock.yml
```

Check that the lock file now uses the Claude engine:

```bash
grep -c "ANTHROPIC_API_KEY" .github/workflows/my-workflow.lock.yml
```

Any number greater than `0` means the compiled workflow reads your secret. Replace `my-workflow` with your workflow's file name.

---

## :white_check_mark: Checkpoint

- [ ] `gh secret list` shows `ANTHROPIC_API_KEY`
- [ ] Your workflow frontmatter has `engine: claude` and `api.anthropic.com` under `network.allowed`
- [ ] `gh aw compile` completes without errors
- [ ] `grep -c "ANTHROPIC_API_KEY"` on your lock file prints a number greater than `0`

<!-- journey: all -->
**Return to:** [Write Your First Agentic Workflow](07-your-first-workflow.md)
<!-- /journey -->
