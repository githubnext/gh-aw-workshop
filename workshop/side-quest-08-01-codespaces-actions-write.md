# Side Quest: Fix Codespaces `actions:write` Errors When Running `gh aw run`

> _Optional: use this guide if Step 8 fails in a Codespace, then return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)._

## 📋 Before You Start

This side quest applies to you if **both** of the following are true:

- You are running `gh aw run` inside a GitHub Codespace (not a local environment).
- You see an `actions:write` permission error (HTTP 403) in your terminal run log.

If you are not in a Codespace or you do not see the 403 error, return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md) and use the GitHub Actions UI path instead.

---

## 🎯 What You'll Do

You'll identify the Codespaces token error that blocks `gh aw run` and use the fastest recovery path. Optionally, you can re-create your Codespace with the extra permissions needed for terminal-based workflow triggers.

---

## Symptom

When you run:

```bash
gh aw run daily-report-status
```

you may see:

```text
HTTP 403: Resource not accessible by integration
```

Some versions of `gh aw` also show a follow-up message explaining that the default Codespaces token does not have `actions:write` and `workflows:write`.

---

## Cause

The default token inside a Codespace usually has enough access to work with your repository. However, it may not have the [permissions](https://github.github.com/gh-aw/reference/permissions/) that `gh aw run` needs. In practice, the missing permissions are usually `actions:write` and `workflows:write`.

---

## Fix A (recommended): use the GitHub Actions UI

Return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md#trigger-the-workflow-via-github-actions-ui) and trigger the workflow from the **Actions** tab instead.

This is the best path for the workshop because it works even when your Codespace terminal token is limited.

---

## Fix B (advanced): create a new Codespace with extra permissions

If you want `gh aw run` to work from the terminal, add a `.devcontainer/devcontainer.json` file to **your practice repository** and commit it. Then create a brand-new Codespace from that updated repository.

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

Before you retry `gh aw run daily-report-status`, confirm one of these is true:

- A new **Daily Report Status** run appears after you use the Actions tab
- A new **Daily Report Status** run appears after you run `gh aw run daily-report-status` from your newly created Codespace

If you still see the same 403 error and no new run appears in the **Actions** tab, go back to **Fix A** and use the UI path for this workshop.

---

## ✅ Checkpoint

- [ ] I can see `HTTP 403: Resource not accessible by integration` in my terminal when running `gh aw run daily-report-status`
- [ ] A new **Daily Report Status** run appears in the **Actions** tab after I trigger it from the UI
- [ ] If I used Fix B: running `gh aw run daily-report-status` in my new Codespace completes without a 403 error and a new run appears in the **Actions** tab
- [ ] I'm ready to return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)

---

Return to [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md).

## 📚 See Also

- [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/)
- [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/)
