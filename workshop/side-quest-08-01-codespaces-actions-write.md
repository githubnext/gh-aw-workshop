# Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`

> _Optional: use this guide if Step 8 fails in a Codespace, then return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)._

## 🎯 What You'll Do

You'll identify the common Codespaces token error that blocks `gh aw run`, use the fastest recovery path, and optionally re-create your Codespace with the extra permissions needed for terminal-based workflow triggers.

---

## Symptom

When you run:

```bash
gh aw run hello-agent
```

you may see:

```text
HTTP 403: Resource not accessible by integration
```

Some versions of `gh aw` also show a follow-up message explaining that the default Codespaces token does not have `actions:write` and `workflows:write`.

---

## Cause

The default token inside a Codespace usually has enough access to work with your repository, but it may not have the workflow-trigger [permissions](https://github.github.com/gh-aw/reference/permissions/) that `gh aw run` needs. In practice, the missing permissions are usually `actions:write` and `workflows:write`.

---

## Fix A (recommended): use the GitHub Actions UI

Return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md#trigger-the-workflow-via-github-actions-ui) and trigger the workflow from the **Actions** tab instead.

This is the best path for the workshop because it works even when your Codespace terminal token is limited.

---

## Fix B (advanced): create a new Codespace with extra permissions

If you want `gh aw run` to work from the terminal, add a `.devcontainer/devcontainer.json` file to **your practice repository**, commit it, and then create a brand-new Codespace from that updated repository.

```json
{
  "customizations": {
    "codespaces": {
      "repositories": {
        "YOUR-USERNAME/YOUR-REPO": {
          "permissions": {
            "actions": "write",
            "workflows": "write"
          }
        }
      }
    }
  }
}
```

Existing Codespaces do not pick up new permissions after a rebuild, so you must create a new Codespace after the file is committed. For more detail, see [Managing access to other repositories within your codespace](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-repository-access-for-your-codespaces).

> [!IMPORTANT]
> Add this file to your **practice repository**, not to `githubnext/gh-aw-workshop`.

---

## Verify the fix

Before you retry `gh aw run hello-agent`, confirm one of these is true:

- A new **Hello Agent** run appears after you use the Actions tab
- A new **Hello Agent** run appears after you run `gh aw run hello-agent` from your newly created Codespace

If you still see the same 403 error and no new run appears in the **Actions** tab, go back to **Fix A** and use the UI path for this workshop.

---

## ✅ Checkpoint

- [ ] I know the exact error text that signals this Codespaces token problem
- [ ] I understand why `gh aw run` can fail in a Codespace even when other GitHub commands work
- [ ] I can use the GitHub Actions UI as the recommended path
- [ ] I know how to create a new Codespace with `actions:write` and `workflows:write` if I want the advanced terminal path
- [ ] I'm ready to return to Step 8

---

Return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md).

## 📚 See Also

- [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/)
- [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/)
