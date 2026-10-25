<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Network egress allowlists for agentic workflows, with an enterprise firewall emphasis</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/network/</source>
    <source>https://github.github.com/gh-aw/reference/sandbox/</source>
    <source>https://github.github.com/gh-aw/reference/audit/</source>
  </sources>
  <rationale>Steps 1-30 mention `network.allowed` only in passing (self-hosted runners, MCP supply chain). No step teaches learners to build an allowlist from evidence, which enterprise security teams require. This step uses the audit firewall report to tighten egress and confirm the result.</rationale>
</research-metadata>
-->

# Control Network Access with an Allowlist

> _Decide exactly which internet domains your agent may reach, and prove it._

## :dart: What You'll Do

You'll add a [`network:` allowlist](https://github.github.com/gh-aw/reference/network/) to a workflow, run it, and read the firewall report to see which domains were allowed or blocked. When you finish, your agent can only reach the domains you chose.

This matters most in enterprise environments, where security teams ask for a named list of outbound destinations before approving any automation.

## :clipboard: Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md), or you can run `gh aw audit` on a run.
- You have a workflow that already runs successfully, such as `daily-status.md`.

## Steps

### Read what the agent contacted

Pick a recent successful run ID from the **Actions** tab, then audit it in the Codespace terminal:

```bash
gh aw audit <run-id>
```

Find the firewall section. It lists every domain the agent requested and whether the [firewall](https://github.github.com/gh-aw/reference/sandbox/) allowed it.

### Declare an allowlist

Open your workflow and add a `network:` block. Keep `defaults` for the basic domains gh-aw needs, then add only what your task requires:

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
    - api.example.com
safe-outputs:
  create-issue:
    title-prefix: "[status] "
---
```

Replace `api.example.com` with a domain from your audit that the task truly needs. Remove any domain you can't justify.

### Compile and run

```bash
gh aw compile
```

Then trigger the workflow from the **Actions** tab with **Run workflow**.

### Confirm the result

Audit the new run and compare the firewall section with your list:

```bash
gh aw audit <new-run-id>
```

Domains on your list show as allowed. Anything else the agent tried shows as blocked.

> [!TIP]
> Share the firewall section with your security team. It's a ready-made evidence trail for an allowlist review.

### Decide what to do with blocked domains

For each blocked domain, ask: _does the task need it?_ If yes, add it and recompile. If no, leave it blocked. That is the firewall doing its job.

> [!NOTE]
> On self-hosted runners behind a corporate proxy, the runner's proxy rules apply in addition to this allowlist. See [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md).

## :white_check_mark: Checkpoint

- [ ] You listed the domains from a real run using `gh aw audit`
- [ ] Your workflow has a `network.allowed` block that starts with `defaults`
- [ ] You ran `gh aw compile` and committed both the `.md` and `.lock.yml` files
- [ ] A new run completed and the firewall section matched your allowlist
- [ ] You can explain why a blocked domain isn't always a bug

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
