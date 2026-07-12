# Side Quest: Storing Credentials with GitHub Secrets

> _Optional: work through this guide when your workflow needs a token or API key that shouldn't appear in plain text, then return to your main path._

GitHub Actions workflows run in a shared environment where code, logs, and configuration are visible to collaborators. Hard-coding credentials is dangerous — they end up in version history and log output. **GitHub Secrets** gives you a secure vault for sensitive values that workflows can read without exposing.

---

## 1. What is a GitHub Secret?

A secret is a named, encrypted value stored in your repository (or organisation) settings. At runtime, GitHub injects it as an environment variable. Secrets:

- Are **never** shown in plain text in the UI after you save them.
- Are **masked** in workflow logs — if a secret's value appears in output, GitHub replaces it with `***`.
- Are **not** available to forked repositories by default (protecting against pull-request attacks).

---

## 2. When do you need a secret?

You need a secret whenever your workflow authenticates to an external service. Common cases:

| Scenario | Secret you'd store |
|---|---|
| Calling a third-party API (Slack, Jira, etc.) | API key or bearer token |
| Posting to an external webhook | Webhook URL (treat URLs with tokens as secrets) |
| Using a personal access token for broader GitHub access | PAT |
| Connecting an MCP server that requires auth | Server-specific token |

> [!NOTE]
> `GITHUB_TOKEN` is different — it's a **built-in secret** automatically created for every workflow run. You do not create it; you just reference it. It expires when the run ends.

---

## 3. Add a secret to your repository

### GitHub UI (recommended)

1. Open your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Enter a name (e.g. `SLACK_WEBHOOK_URL`) and the secret value.
5. Click **Add secret**.

![Repository secrets page](images/side-quest-secrets-settings.svg)

> [!TIP]
> Secret names must use only uppercase letters, digits, and underscores. By convention, use `SCREAMING_SNAKE_CASE`.

---

## 4. Reference a secret in your workflow

Inside any workflow step, reference a secret with `${{ secrets.SECRET_NAME }}`:

```yaml
- name: Notify Slack
  run: |
    curl -s -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{"text": "Daily status report is ready."}'
```

For environment variables, you can also declare them at the step level to keep the `run:` block readable:

```yaml
- name: Call external API
  env:
    API_TOKEN: ${{ secrets.MY_API_TOKEN }}
  run: |
    curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com/data
```

---

## 5. Using the built-in `GITHUB_TOKEN`

Most GitHub API calls (fetching issues, listing commits, posting comments) work with the automatically provided `GITHUB_TOKEN`:

```yaml
- name: List open pull requests
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: gh pr list --state open
```

The `gh` CLI reads `GH_TOKEN` automatically when it is set as an environment variable.

> [!WARNING]
> `GITHUB_TOKEN` has scoped permissions defined in your workflow's `permissions:` block. If an API call fails with a 403, check that the required permission (e.g. `pull-requests: read`) is listed in frontmatter.

---

## 6. Permissions frontmatter

gh-aw workflows declare required permissions in frontmatter. Only request what you need:

```yaml
---
permissions:
  contents: read
  issues: read
  pull-requests: read
---
```

Keeping permissions minimal reduces the blast radius if a workflow is ever misused.

---

## ✅ Checkpoint

- [ ] You can add a secret to your repository via the GitHub UI
- [ ] You know how to reference a secret with `${{ secrets.SECRET_NAME }}`
- [ ] You understand when to use `GITHUB_TOKEN` vs. a manually created PAT
- [ ] You can explain why hard-coding credentials in workflow files is risky

**Return to:** [Connect a Live Data Source to Your Workflow](16-connect-data-source.md) or [Give Your Agent More Tools with MCP](17-add-mcp-tools.md)
