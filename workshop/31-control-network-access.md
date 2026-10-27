<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Network egress control in agentic workflows — the top-level `network:` frontmatter field, ecosystem identifiers, custom domain allowlists, and `blocked` entries</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt (downloaded to /tmp/gh-aw/data/llms.txt)</source>
    <source>https://github.github.com/gh-aw/reference/network/</source>
    <source>https://github.github.com/gh-aw/reference/sandbox/</source>
    <source>https://github.github.com/gh-aw/reference/frontmatter/</source>
  </sources>
  <rationale>The existing curriculum (steps 1-30) explains the firewall conceptually in the security step and mentions `network.allowed` in side quests, but no step has learners configure it. Learners who add a data source, an MCP server, or a package install hit blocked requests or `(redacted)` URLs and have no hands-on model for fixing them safely. The gh-aw network reference documents `network: defaults`, selective `allowed` lists, ecosystem identifiers such as `python` and `node`, `blocked` entries that take precedence, and the fact that the same allowlist also drives content sanitization. This step turns those concepts into one concrete exercise: start from least privilege, add exactly the domains a workflow needs, and verify the result.</rationale>
</research-metadata>
-->

# Control Which Domains Your Agent Can Reach

> _Give your agent the internet access it needs, and nothing more._

## :dart: What You'll Do

You'll configure the [`network:` field](https://github.github.com/gh-aw/reference/network/) on one of your workflows so it can reach only the domains you list. When you finish, you'll have a least-privilege allowlist and know how to fix a blocked request without opening everything up.

Why this matters: the agent runs inside the [sandbox firewall](https://github.github.com/gh-aw/reference/sandbox/), so any request to an unlisted domain is blocked. That protects you from data exfiltration, but it also means every new data source or tool needs a deliberate allowlist entry.

## :clipboard: Before You Start

- You completed [Connect a Live Data Source to Your Workflow](16-connect-data-source.md) or have any workflow that calls an external service.
- You can compile workflows with `gh aw compile`.

## Steps

### Check your current default

If a workflow has no `network:` field, it uses `network: defaults`, which allows only basic infrastructure such as certificates, JSON schema, and common package mirrors. Open your workflow and confirm whether it sets `network:` already.

### Allow only what the workflow needs

Add a `network:` block to the frontmatter. Mix ecosystem identifiers with specific domains:

```markdown .github/workflows/daily-status.md
---
on:
  schedule: daily
permissions:
  contents: read
network:
  allowed:
    - defaults
    - github
    - "api.example.com"
---
```

Listed domains also match their subdomains. Identifiers such as `python` or `node` allow a whole package ecosystem, so prefer a specific domain when the workflow only calls one API.

Recompile:

```bash
gh aw compile
```

### Block a domain explicitly

Use `blocked` to exclude an ecosystem or domain. Blocked entries take precedence over `allowed`:

```markdown .github/workflows/daily-status.md
network:
  allowed:
    - defaults
    - github
    - node
  blocked:
    - "cdn.example.com"
```

### Fix a blocked request

1. Run the workflow with `gh aw run daily-status`.
2. If the agent reports a failed request or a URL shows as `(redacted)` in its output, note the domain.
3. Add only that domain to `network.allowed`, recompile, and run again.

The same allowlist controls network egress and which URLs survive content sanitization, so one entry fixes both.

### Lock it down completely

For a workflow that only reads repository data through GitHub tools, you can block all network access:

```markdown .github/workflows/daily-status.md
network: {}
```

> [!NOTE]
> Hosted web search and fetch tools from Claude and Codex run on provider infrastructure, so `network.allowed` doesn't constrain them. See the [network reference](https://github.github.com/gh-aw/reference/network/) for the separate `hosted-web` policy.

## :white_check_mark: Checkpoint

- [ ] Your workflow has an explicit `network:` block and the lock file was recompiled
- [ ] You can explain the difference between `defaults`, `allowed`, `blocked`, and `network: {}`
- [ ] You fixed or deliberately avoided a blocked request by adding only the specific domain needed
- [ ] You committed both the `.md` and `.lock.yml` files

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
