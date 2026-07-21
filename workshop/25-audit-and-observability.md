<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Audit and Monitor Your Agentic Workflows

> _Knowing what your agent did — and proving it — is what turns a useful automation into a trustworthy one._

## 🎯 What You'll Do

You will use `gh aw logs` and `gh aw audit` to review the built-in artifacts that every agentic workflow run produces, understand token usage, and debug unexpected behavior. By the end you will know where to look when a run behaves unexpectedly or when a compliance review asks what the agent did.

## 📋 Before You Start

- Your workflow runs successfully (see [Test and Iterate on Your Workflow](12-test-and-iterate.md)).
- `gh aw` is installed and authenticated (see [Install the gh-aw CLI Extension](06-install-gh-aw.md)).

## Steps

### Review recent runs with gh aw logs

`gh aw logs` downloads artifacts from your workflow's recent runs and prints a summary table showing duration, token usage, and cost in [AI Credits (AIC)](https://github.github.com/gh-aw/reference/cost-management/#ai-credits-aic).

Run it from inside your repository:

```bash
gh aw logs <your-workflow-id>
```

Replace `<your-workflow-id>` with the basename of your workflow file (for example, `daily-status` for `daily-status.md`).

The summary table shows one row per run. Key columns:

| Column | What it tells you |
|---|---|
| AIC | Total AI Credits consumed by the agent |
| Model | The AI model that ran the agent |
| Conclusion | Whether the run succeeded |

To download all artifacts for further inspection, add `--artifacts all`:

```bash
gh aw logs <your-workflow-id> --artifacts all
```

Downloaded files land in `.github/aw/logs/<run-id>/` by default.

### Audit a specific run with gh aw audit

When you need a deeper look at one run — for debugging or compliance evidence — use `gh aw audit` with the run ID or URL from the Actions tab (both numeric IDs and full GitHub Actions URLs are accepted):

```bash
gh aw audit <run-id>
```

This downloads all artifacts for that run and generates a concise Markdown report covering run metadata, AIC, and any flagged issues.

To also parse the raw agent and firewall logs into readable Markdown, add `--parse`:

```bash
gh aw audit <run-id> --parse
```

For a full breakdown of report contents and artifact files, see [Side Quest: Audit Reference](side-quest-25-01-audit-reference.md).

### Debug with an agent

Once you have an audit report, bring it to GitHub Copilot Chat with the **`/agentic-workflows` skill** and describe what puzzled you:

```text
/agentic-workflows Here is my audit report. The agent called github.list_issues
three times and AIC was higher than expected. Help me understand why and
suggest how to reduce it.

<paste report here>
```

The skill understands agentic workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) and safe-output rules. It can suggest a more efficient prompt, validate your changes, or walk you through a fix — all without leaving the chat. Ask the agent to make edits directly so it can run `gh aw compile` to validate before committing.

### Browse artifacts in the GitHub UI

Every artifact is also available in the browser without the CLI:

1. Go to the **Actions** tab in your repository.
2. Click a completed workflow run.
3. Scroll to the **Artifacts** section and download the archive you need.

### Retention policy

GitHub retains artifacts for **90 days** by default. Ask your GitHub administrator whether a policy overrides this and whether you need to copy artifacts to external storage for longer-term audit requirements.

> [!NOTE]
> Retention defaults may differ on GitHub Enterprise Server. Check with your admin before relying on the default 90-day window.

## ✅ Checkpoint

- [ ] You ran `gh aw logs <your-workflow-id>` and read the AIC summary for your workflow
- [ ] You ran `gh aw audit <run-id>` and reviewed the generated report
- [ ] You brought an audit report to Copilot Chat with the `/agentic-workflows` skill and got actionable feedback
- [ ] You can browse artifacts in the GitHub Actions UI
- [ ] You know your organisation's artifact retention policy (or know who to ask)

<!-- journey: all -->
**Next:** [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)
<!-- /journey -->


