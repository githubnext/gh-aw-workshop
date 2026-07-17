# Audit and Monitor Your Agentic Workflows

> _Knowing what your agent did — and proving it — is what turns a useful automation into a trustworthy one._

## 🎯 What You'll Do

You will learn to read the built-in artifacts that every agentic workflow run produces, understand token usage, and identify the audit trail your organisation needs for enterprise compliance. By the end you will know exactly where to look when a run behaves unexpectedly or when a compliance review asks what the agent did.

## 📋 Before You Start

- Your workflow runs successfully (see [Test and Iterate on Your Workflow](12-test-and-iterate.md)).
- You have visited the Actions tab in your repository at least once and seen a completed run.

## Steps

### Open the run artifacts

Every agentic workflow run automatically publishes artifacts alongside the standard job log.

1. Go to the **Actions** tab in your repository.
2. Click a completed workflow run.
3. Scroll to the **Artifacts** section at the bottom of the run summary page.

![Artifacts section of a completed Actions run](images/25-artifacts-section.png)

### Read the agent artifact

The `agent` artifact contains the full conversation the AI model had with the runner. Download it and open the JSON file inside.

Key fields to look for:

| Field | What it tells you |
|---|---|
| `tool_calls` | Every tool the agent invoked and the result — your most precise audit trail |
| `safe_outputs` | The write declarations the agent emitted before finishing |

### Understand the usage artifact

The `usage` artifact contains token consumption estimates. Download it and check `input_tokens`, `output_tokens`, and `model`.

Use this data to spot unexpectedly long runs, track cost trends, and set a budget baseline before enabling a scheduled trigger.

> [!NOTE]
> Token counts are estimates. Confirmed billing figures appear in your GitHub billing dashboard.

### Check the firewall log

The `firewall` artifact records every outbound domain the agent tried to reach and whether it was allowed or blocked.

Scan the `blocked_domains` list. A blocked domain that your workflow genuinely needs must be added to the `network.allow` list in your workflow frontmatter:

```yaml
network:
  allow:
    - api.example.com
```

> [!TIP]
> Share the `allowed_domains` list from a successful run with your enterprise security team as a ready-made firewall allowlist.

### Check the job log for a quick snapshot

For a fast compliance check without downloading artifacts:

1. Click the job name in the run summary (for example, **run**).
2. Expand the **Run agent** step.
3. Confirm the final status message and safe-output declaration.

### Retention policy

GitHub retains artifacts for **90 days** by default. For enterprise compliance, ask your GitHub administrator whether a global retention policy overrides this, or whether you need to copy artifacts to external storage for longer-term audit requirements.

> [!NOTE]
> On GitHub Enterprise Server, retention defaults may differ from github.com.

## ✅ Checkpoint

- [ ] You found the **Artifacts** section on a completed workflow run page
- [ ] You opened the `agent` artifact and located the `tool_calls` list
- [ ] You opened the `usage` artifact and noted `input_tokens` and `output_tokens`
- [ ] You checked the `firewall` artifact for blocked domains
- [ ] You can describe what a compliance reviewer would find in the `agent` artifact
- [ ] You know your organisation's artifact retention policy (or know who to ask)

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Network reference](https://github.github.com/gh-aw/reference/network/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md)
