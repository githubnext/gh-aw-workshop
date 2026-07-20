<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Long-Lived Credential Risks in Agentic Workflows

> _Optional: work through this security primer to understand why personal access tokens create a larger attack surface than the ephemeral `GITHUB_TOKEN` — especially in unattended agentic workflows._

## 📋 Before You Start

- You have started [Step 16: Connect a Live Data Source to Your Workflow](16-connect-data-source.md).
- You understand that `${{ secrets.GITHUB_TOKEN }}` is the built-in GitHub token provided automatically for each workflow run.
- You are familiar with [Side Quest: Storing Credentials with GitHub Secrets](side-quest-16-02-secrets-and-permissions.md).

---

## The core risk: credentials that never expire

A **personal access token (PAT)** is a credential you generate manually and store in a secret. It:

- Is valid for days, months, or indefinitely — depending on how it was configured.
- Carries whatever scopes you granted when you created it, across every repository those scopes touch.
- Remains valid unless you explicitly revoke it.

The built-in `GITHUB_TOKEN` is different. GitHub creates it at the start of each run and invalidates it the moment the run ends. No rotation. No revocation steps. No credential that persists after the job exits.

For a scheduled, unattended agentic workflow that runs every day, this distinction matters a great deal.

---

## Why unattended workflows amplify the risk

Classic CI/CD scripts are narrow and deterministic: they run a fixed set of commands. If a PAT leaks from a classic pipeline, the attacker gains whatever those specific commands needed.

An agentic workflow is broader. The agent decides at runtime which tools to call. If a wide-scoped PAT leaks, it can happen through:

- A compromised dependency
- A crafted issue or PR body that tricks the agent into printing it
- A misconfigured `safe-outputs` surface

When that happens, the attacker gains access to every repository and organisation the PAT covers — not just the one the workflow ran against. The PAT does not expire on its own. It persists until someone notices and revokes it manually.

Unattended workflows run without a human watching every log. The window between a leak and discovery can be hours or days.

---

## How gh-aw limits the blast radius

gh-aw gives you three design features that reduce long-lived credential risk:

### Prefer the ephemeral `GITHUB_TOKEN`

For any operation that touches only the current repository, use `${{ secrets.GITHUB_TOKEN }}` instead of a PAT. You do not need to create it, rotate it, or revoke it. The risk window is the duration of a single run.

```yaml
- name: Fetch open issues
  id: issues
  run: |
    gh issue list --state open --limit 10 --json number,title \
      --jq '.[] | "#\(.number) \(.title)"'
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Keep `permissions:` minimal

Even an ephemeral `GITHUB_TOKEN` carries risk if it is over-scoped. Declare only the permissions your task actually needs. Compare the two blocks below:

```yaml
# ❌ Risky: broad write scopes for a read-only task
---
permissions:
  contents: write
  issues: write
  pull-requests: write
---
```

```yaml
# ✅ Safe: minimal scopes matching actual needs
---
permissions:
  contents: read
  issues: read
---
```

With read-only permissions, a compromised or misdirected token cannot push code, open PRs, or modify secrets — even if an attacker gains access to it during the run window.

> [!TIP]
> If a `GITHUB_TOKEN` call fails with a 403, check that the required permission is listed. Adding the minimum permission that makes the call succeed is safer than widening to `write` by default.

### Use `network.allowed-domains` to block exfiltration

If a PAT is present in the workflow environment, the main concern is that it could be sent to an attacker-controlled endpoint. A `network` allowlist stops that at the network layer:

```yaml
---
network:
  allowed:
    - api.github.com
    - copilot-proxy.githubusercontent.com
---
```

Even if an injected instruction tells the agent to `curl` a PAT to an external server, the connection is rejected before any data leaves the runner.

---

## When a PAT is unavoidable

Sometimes your workflow genuinely needs access beyond what `GITHUB_TOKEN` can provide — for example, reading a private repository in a different organisation or calling an API that requires a service account token.

When you must use a PAT:

| Practice | Why it helps |
|---|---|
| Use a fine-grained PAT with the minimum scopes | Limits what an attacker gains if it leaks |
| Set the shortest practical expiry | Reduces the window during which a leaked token remains valid |
| Rotate the PAT on a schedule | A rotated PAT invalidates any copy an attacker already has |
| Inject the PAT at the step level, not globally | Keeps it out of other steps' environments, including the AI prompt step |
| Add `network.allowed-domains` | Prevents the token from being sent to attacker-controlled endpoints |

---

## ✏️ Exercise: Audit your current workflow

Open your workflow file (e.g., `.github/workflows/daily-report.md`) and answer the following questions:

- [ ] Verify that the workflow uses `GITHUB_TOKEN` rather than a PAT stored in a secret wherever possible.
- [ ] If a PAT is present, confirm that its scopes are limited to the minimum required and do not include write access to other repositories.
- [ ] Verify that the workflow declares a `permissions:` block limiting token scope to only what is needed.

Use the checklist below to record your findings in a comment or your workflow's issue log:

```markdown
## Credential audit — <workflow name>

- [ ] Uses `GITHUB_TOKEN` (ephemeral) rather than a PAT where possible
- [ ] PAT scopes are fine-grained and limited to the minimum required
- [ ] `permissions:` block is present and restricts to read-only where applicable
- [ ] `network.allowed-domains` is set to prevent outbound credential exfiltration
- [ ] Documented credential type used (PAT or `GITHUB_TOKEN`) and the reason for the choice
```

---

## Comparison at a glance

> 🤔 **Predict:** Before reading the table below, list from memory which properties of a PAT make it riskier than `GITHUB_TOKEN` in an unattended workflow. Then check your list against the table.

| Property | `GITHUB_TOKEN` | PAT |
|---|---|---|
| Created by | GitHub, automatically | You, manually |
| Expiry | End of the workflow run | Configurable — can be indefinite |
| Scope | Limited to the current repository | Any repository or organisation you granted |
| Rotation | Automatic (new token each run) | Manual or scripted |
| Revocation if leaked | Automatic at run end | Manual action required |
| Risk window | Seconds to minutes | Days to months (or indefinitely) |

---

## What you can do as a workflow author

| Practice | Why it helps |
|---|---|
| Use `GITHUB_TOKEN` whenever the task stays within the current repository | Eliminates long-lived credential entirely |
| Declare a minimal `permissions:` block | Caps what any token can authorize |
| Add `network.allowed-domains` | Blocks outbound exfiltration of any credential |
| Inject PATs at the step level with `env:` | Keeps the credential out of the AI prompt step |
| Use fine-grained PATs with short expiry when a PAT is necessary | Limits blast radius and persistence |

---

## ✅ Checkpoint

- [ ] You can explain in one sentence why a PAT is riskier than `GITHUB_TOKEN` in an unattended workflow
- [ ] You can describe the risk window difference between the two credential types
- [ ] You know how to keep `permissions:` minimal and can explain why it matters
- [ ] You know how to add `network.allowed-domains` to block credential exfiltration
- [ ] You can list two practices that reduce risk when a PAT is unavoidable
- [ ] You identified whether your workflow uses a PAT or the ephemeral `GITHUB_TOKEN` and noted the difference in your log or issue

---

<!-- journey: all -->
Return to [Step 16: Connect a Live Data Source to Your Workflow](16-connect-data-source.md).
<!-- /journey -->


