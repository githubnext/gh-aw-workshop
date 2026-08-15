<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _With great automation comes great responsibility — learn how to set guardrails so your agentic workflows stay safe at org scale._

## :dart: What You'll Do

Review the [governance controls](https://github.github.com/gh-aw/guides/governance/) available in gh-aw and apply a minimal policy to your practice repository — restrictive token defaults, explicit workflow permissions, and an allowed-actions list.

## :clipboard: Before You Start

- You have completed [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md).
- You have Owner or Admin access to an organisation (or a practice repository with settings access).

> [!NOTE]
> Enterprise Cloud (GHEC) and Enterprise Server (GHES) organisations have access to additional policy controls at the organisation and enterprise level. The steps below cover controls that work on both `github.com` and enterprise environments.

## Steps

### Understand the three governance layers

Think of governance in three layers:

| Layer | Controlled by | What it covers |
|---|---|---|
| **Enterprise policy** | Enterprise admin | Global model access; which orgs can run Copilot-powered workflows |
| **Organisation policy** | Org admin | Allowed actions, `GITHUB_TOKEN` defaults |
| **Repository policy** | Repo admin | Per-workflow `permissions:` blocks, `concurrency` limits |

For this step you will work at the repository layer.

### Set a restrictive default token permission

Open your practice repository on GitHub. Go to **Settings → Actions → General** and under **Workflow permissions** select **Read repository contents and packages permissions**.

Every workflow must then explicitly declare the permissions it needs. Workflows that omit a `permissions:` block get read-only access by default.

### Add an explicit permissions block to your orchestrator

Open `.github/workflows/repo-orchestrator.md` in your Codespace. Add a `permissions:` block to the frontmatter:

```yaml
---
name: repo-orchestrator
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
permissions:
  contents: read
  issues: write
  pull-requests: read
---
```

Declare only the permissions each workflow genuinely needs. The `issues: write` scope lets the orchestrator create daily-status issues; `pull-requests: read` lets it check open PR state. No `contents: write` is needed unless the workflow commits files.

After editing, compile and push:

```bash
gh aw compile repo-orchestrator
git add .github/workflows/repo-orchestrator.md .github/workflows/repo-orchestrator.lock.yml
git commit -m "feat: add explicit permissions block to orchestrator"
git push
```

### Review the allowed-actions policy

Go to **Settings → Actions → General → Actions permissions**. For agentic workflows the safest setting is **Allow select actions and reusable workflows**. Add the gh-aw action reference to the allowed list if your organisation restricts third-party actions.

> [!IMPORTANT]
> <details>
> <summary><b>Enterprise users: apply this control at org level.</b></summary>
>
> In GHEC and GHES, go to your organisation **Settings → Actions → General** to set the policy once for all repositories. Repository-level settings can only restrict further — they cannot expand beyond what the org policy permits.
>
> </details>

### Audit recent workflow runs

Open the most recent orchestrator run in **Actions** and click the **Set up job** step. Look for the `Permissions` section — it should list exactly the scopes you declared. If it shows more, confirm the organisation default is set to restrictive.

### Document your policy decisions

Create `AGENTIC_POLICY.md` in your repository root:

```bash
cat > AGENTIC_POLICY.md << 'EOF'
# Agentic Workflow Policy

- Default token permission: read-only.
- Allowed actions: restricted to GitHub-authored and approved third-party actions.
- Orchestrator dispatch: limited to workflows in this repository.
- Model access: reviewed quarterly by the repository owner.
EOF

git add AGENTIC_POLICY.md
git commit -m "docs: add agentic workflow policy"
git push
```

Update this file whenever you change a policy.

## :white_check_mark: Checkpoint

- [ ] The repository default token permission is set to **read-only** in Actions settings
- [ ] Your `repo-orchestrator.md` frontmatter includes a `permissions:` block with only the scopes it needs
- [ ] `gh aw compile repo-orchestrator` succeeded after the permissions change
- [ ] You verified the **Set up job** log in a recent Actions run shows your declared scopes
- [ ] `AGENTIC_POLICY.md` exists at the repository root and is committed
- [ ] You can explain why the restrictive default reduces blast radius if a workflow brief is manipulated

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
