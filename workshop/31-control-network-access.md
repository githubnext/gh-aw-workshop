<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Network allowlists — controlling which domains an agentic workflow can reach with the `network:` frontmatter key</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/network/</source>
    <source>https://github.github.com/gh-aw/reference/sandbox/</source>
  </sources>
  <rationale>Steps 17, 24, and 25 mention `network.allowed` and the firewall in passing, but no step teaches learners to set an allowlist deliberately. Enterprise learners behind proxies and security teams reviewing workflows need a hands-on step that starts from default access, adds one domain, and reads the blocked-request evidence in an audit.</rationale>
</research-metadata>
-->

# Control Network Access with the Firewall

> _Decide exactly which websites your agent can talk to, so a surprise request never leaves your workflow._

## :dart: What You'll Do

You'll add a `network:` section to one of your workflows so the agent can reach only the domains you name. Then you'll run it and confirm that a request to an unlisted domain is blocked. When you finish, you'll be able to hand your security team a precise allowlist.

## :clipboard: Before You Start

- A compiled workflow from [Step 7](07-your-first-workflow.md) in your Codespace
- Familiarity with reading a run summary from [Step 8b](08b-interpret-your-run.md)

## Steps

### Understand the default

Agentic workflows run behind a [firewall](https://github.github.com/gh-aw/reference/network/). By default the agent can reach a small set of trusted infrastructure domains, such as the ones needed for its AI engine and GitHub. Everything else is blocked. The `network:` key in your frontmatter widens or narrows that list.

### Ask your agent to add an allowlist

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
/agentic-workflows Update my daily-status workflow so it can only reach github.com and api.github.com, and nothing else.
```

### Review the frontmatter

The agent should produce a section like this one. Ecosystem names such as `defaults` expand to a curated domain list, and plain domains are matched exactly.

```yaml
---
on:
  workflow_dispatch:
permissions:
  contents: read
engine: copilot
network:
  allowed:
    - defaults
    - contoso.com
---

# Network demo

Summarize the repository, then try to fetch https://example.org and report what happened.
```

> [!NOTE]
> Setting `network: {}` blocks all outbound access beyond what the engine itself needs. Use it for workflows that only read repository data.

### Recompile and run

Compile in the terminal, then commit both files:

```bash
gh aw compile
```

Dispatch the workflow from the **Actions** tab on GitHub.com, as you did in [Step 8](08-run-your-workflow.md).

### Find the blocked request

Open the finished run and read the firewall section of the summary. The request to `example.org` should appear as blocked. If you want the full report, follow the audit walkthrough in [Step 25](25-audit-and-observability.md).

> [!TIP]
> When a legitimate request is blocked, copy that domain from the report into `network.allowed`, recompile, and run again. Add one domain at a time so the list stays reviewable.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `network:` section listing only the domains it needs
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] A run showed the request to an unlisted domain as blocked
- [ ] You can explain why `defaults` plus a short list is easier to review than a long one

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
