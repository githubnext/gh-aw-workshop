<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Self-Hosted Runner Infrastructure Deep Dive

> _A companion to [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md). Use this side quest when your enterprise environment requires ephemeral runners, proxy configuration, or air-gapped network isolation._

## :clipboard: Before You Start

- You completed [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) or are actively working through it.
- You have access to your enterprise runner infrastructure or can consult your admin.

## Ephemeral and JIT runners

Ephemeral runners are destroyed after a single job — each run starts on a fresh machine,
preventing state from leaking between executions. Register one using the ephemeral flag
and target it with the same label strategy described in Step 24.

Just-in-time (JIT) runners are provisioned on demand and deregistered immediately after use.
They require a registration token scoped to your organisation or repository and are typically
managed by a runner controller such as actions-runner-controller.

> [!TIP]
> Ephemeral and JIT runners are the recommended pattern for agentic workflows in enterprise environments: they eliminate residual state and ensure each run begins in a known-clean environment.

## Proxy and network requirements

Self-hosted runners in enterprise environments often sit behind an outbound proxy.
The [agentic engine](https://github.github.com/gh-aw/reference/engines/) needs to reach model endpoints and GitHub APIs.

If your runner uses a proxy, set these environment variables in the runner's system
configuration **before** registering it, or ask your admin to confirm they are already set:

```bash
HTTPS_PROXY=https://proxy.example.com:3128
HTTP_PROXY=http://proxy.example.com:3128
NO_PROXY=localhost,127.0.0.1,github.example.com
```

You do **not** need to add these to the workflow file itself — the runner process
inherits them from the system environment automatically.

> [!NOTE]
> The exact proxy hostname and port come from your network team or enterprise admin. The values above are examples only.

## Network isolation

If your runner operates in an air-gapped or restricted environment, ensure it can reach
the GitHub API, your model endpoint, and any MCP tool servers your workflow calls.
Work with your network admin to allowlist these endpoints before running agentic workflows.

You can use the `network.allowed` frontmatter field to explicitly declare the domains your
workflow needs:

```markdown
---
network:
  allowed:
    - api.github.com
    - api.example.com
---
```

After a successful run, the `firewall.md` artifact provides a ready-made list of every
domain the agent contacted — share it with your security team as an allowlist baseline.
See [Audit Reference](side-quest-25-01-audit-reference.md) for details on reading firewall logs.

## :white_check_mark: Checkpoint

- [ ] You understand the difference between ephemeral runners and JIT runners
- [ ] You know where to set proxy environment variables for a self-hosted runner
- [ ] You can identify which endpoints an agentic workflow needs to reach (GitHub API, model endpoint, MCP servers)
- [ ] You know how to use `network.allowed` in frontmatter to declare required domains
- [ ] You know how to use the `firewall.md` artifact to build an allowlist for your security team

<!-- journey: all -->
Return to [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md).
<!-- /journey -->
