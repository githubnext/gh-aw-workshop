<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Network allowlists — controlling which domains an agentic workflow can reach</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/network/</source>
    <source>https://github.github.com/gh-aw/reference/sandbox/</source>
  </sources>
  <rationale>Steps 16 and 17 add data sources and MCP tools, and the security side quests mention network.allowed-domains, but no step shows learners how to configure and verify the allowlist. This step adds a hands-on exercise that allows one extra domain, then checks the firewall result in an audit. It also serves enterprise learners who must work with restricted egress.</rationale>
</research-metadata>
-->

# Control Which Websites Your Agent Can Reach

> _Give your agent the internet access it needs, and nothing more._

## :dart: What You'll Do

You'll add a `network:` allowlist to one of your workflows, compile it, and confirm in a run audit which domains were allowed or blocked. When you finish, you'll know how to open exactly one extra domain for your agent.

Why this matters: an agent that can reach any website could be tricked into sending data somewhere it shouldn't. A [network allowlist](https://github.github.com/gh-aw/reference/network/) keeps outbound traffic limited to domains you chose.

## :clipboard: Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md), or you know how to run `gh aw audit`.
- You have a workflow that has already run successfully, such as `daily-status.md`.

## Steps

### Understand the default

Agentic workflows run behind a firewall. By default, the agent can reach only a small set of trusted domains, such as the ones the AI engine and GitHub tools need. Everything else is blocked and logged.

### Add an allowlist

Open your workflow and add a `network:` block. Here, `defaults` keeps the trusted baseline and one extra domain is added:

```yaml
---
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: read
network:
  allowed:
    - defaults
    - api.github.com
safe-outputs:
  create-issue:
    title-prefix: "[status] "
---
```

> [!TIP]
> Allow the narrowest domain that works. `api.example.com` is safer than a wildcard for all of `example.com`.

### Compile and run

```bash
gh aw compile
```

Then trigger the workflow from the **Actions** tab, or run `gh aw run daily-status`.

### Read the firewall result

1. Find the run ID in the **Actions** tab.
2. Audit the run:

```bash
gh aw audit <run-id>
```

3. Open the firewall section of the report.
4. Find the domains listed as allowed and the ones listed as blocked.

A blocked domain isn't an error in your workflow. It shows the firewall doing its job. If your agent needs that domain, add it to `allowed:` and recompile.

### Try a blocked request

Add one sentence to the workflow brief that asks the agent to fetch a page from a domain you did *not* allow. Recompile, run again, and audit. The domain should appear in the blocked list. Remove the sentence afterward.

> [!NOTE]
> Enterprise learners often work behind a proxy or with restricted egress. The same `network:` block applies; see [Enterprise Setup Considerations](side-quest-enterprise-setup.md) for environment-specific guidance.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `network:` block that includes `defaults` and one extra domain
- [ ] You ran `gh aw compile` and the `.lock.yml` file updated
- [ ] A `gh aw audit` report shows at least one allowed domain in the firewall section
- [ ] You triggered a request to an unlisted domain and saw it in the blocked list
- [ ] You can explain why a narrow domain beats a wildcard

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
