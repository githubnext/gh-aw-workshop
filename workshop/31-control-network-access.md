<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Network permissions — controlling which domains an agentic workflow can reach with the top-level network: field</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/network/</source>
    <source>https://github.github.com/gh-aw/guides/network-configuration/</source>
    <source>https://github.github.com/gh-aw/reference/sandbox/</source>
  </sources>
  <rationale>The curriculum mentions the firewall and egress allowlist conceptually (steps 5b and the security side quests) but no step has learners actually configure the top-level `network:` field. Research of the gh-aw network reference shows the default is `network: defaults`, ecosystem identifiers such as `python` and `node` expand to package registries, `blocked` takes precedence over `allowed`, and the same allowlist drives content sanitization, so non-allowed URLs are replaced with `(redacted)` in outputs. Learners hit these behaviors as soon as their workflows install packages or call external APIs, so this step gives a hands-on exercise: trigger a block, read it in the firewall audit, and fix it with the narrowest allowlist entry.</rationale>
</research-metadata>
-->

# Control Network Access with Allowlists

> _Decide exactly which domains your agent can reach._

## :dart: What You'll Do

You'll add a top-level [`network:` allowlist](https://github.github.com/gh-aw/reference/network/) to a workflow, watch the firewall block a domain you didn't list, and then fix it with the narrowest entry that works. When you finish, you'll be able to give any workflow least-privilege network access.

Why this matters: your agent runs inside a [sandbox](https://github.github.com/gh-aw/reference/sandbox/) that blocks outbound traffic by default. The allowlist is the control that limits where a prompt-injected or misbehaving agent can send data, and it's also the first place to look when a workflow fails to fetch something it needs.

## :clipboard: Before You Start

- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md), or you have any workflow that compiles with `gh aw compile`.
- You can open the Actions run page for a workflow run.

## Steps

### Check what you get by default

If your workflow has no `network:` field, it behaves as if you wrote `network: defaults`. That allows only certificate validation, JSON schema, and Ubuntu archive hosts. GitHub API access for the agent's GitHub tools doesn't go through this list.

Open a workflow such as `daily-status.md` and make the default explicit:

```markdown .github/workflows/daily-status.md
---
on:
  schedule: daily
network: defaults
---
```

### Ask the agent to reach an unlisted domain

Add one sentence to the Markdown body that needs an outside host, for example:

```markdown
Fetch https://api.example.com/status and include the HTTP status code in the report.
```

Recompile and run the workflow:

```bash
gh aw compile
gh aw run daily-status
```

The request fails because `api.example.com` isn't allowed.

### Read the firewall result

Use the [audit command](https://github.github.com/gh-aw/reference/audit/) on the finished run to see which domains were allowed and which were blocked:

```bash
gh aw audit <run-id>
```

Look for `api.example.com` in the blocked domains of the firewall analysis. You can also open the run's logs in the Actions tab.

> [!TIP]
> If a URL shows up as `(redacted)` in an issue or comment, the same allowlist is the cause: links to domains you haven't allowed are replaced during content sanitization.

### Allow only what you need

Replace the default with an explicit list. Combine ecosystem identifiers with specific domains:

```markdown .github/workflows/daily-status.md
network:
  allowed:
    - defaults
    - api.example.com
```

Ecosystem identifiers such as `python` or `node` expand to package registries, so use them only when the workflow installs those packages. Listed domains also match their subdomains, and you can use wildcards like `*.example.com`. For more patterns, including protocol-specific entries such as `https://api.example.com`, see the [network configuration guide](https://github.github.com/gh-aw/guides/network-configuration/).

### Block a domain explicitly

When you allow an ecosystem but want to exclude part of it, add `blocked:`. Blocked entries take precedence over allowed ones:

```markdown .github/workflows/daily-status.md
network:
  allowed:
    - defaults
    - node
  blocked:
    - cdn.example.com
```

Recompile with `gh aw compile`, rerun the workflow, and confirm the audit now lists `api.example.com` as allowed.

> [!NOTE]
> Use `network: {}` to block all network access for workflows that only analyze data your steps already fetched.

## :white_check_mark: Checkpoint

- [ ] Your workflow sets a top-level `network:` field and the lock file was recompiled
- [ ] You saw a domain blocked in the firewall results of `gh aw audit`
- [ ] You fixed the failure by adding the narrowest domain or ecosystem identifier
- [ ] You can explain why `blocked:` wins over `allowed:`, and why a URL can appear as `(redacted)`

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
