<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Control Network Access with the Firewall

> _Decide exactly which internet domains your agent may reach — so a surprise link or a poisoned tool can't send data anywhere you didn't approve._

## :dart: What You'll Do

You'll add a [`network:`](https://github.github.com/gh-aw/reference/network/) allowlist to a workflow, recompile it, and read the firewall results from a run. When you finish, your agent will reach only the domains you named.

This matters most in enterprise environments, where security teams ask "what can this workflow talk to?" before approving it.

## :clipboard: Before You Start

- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md), or you have any workflow that has run at least once.
- You can compile workflows with `gh aw compile`.

## Steps

### Understand the default

Agentic workflows run behind a [network firewall](https://github.github.com/gh-aw/reference/sandbox/). The agent can only reach domains on an allowlist. If you don't set `network:`, a small default set applies, which covers the AI engine and GitHub.

### Ask your agent to add an allowlist

In your Codespace, start Copilot CLI:

```bash
gh copilot
```

Then paste this prompt:

```prompt
/agentic-workflows Restrict daily-status.md so the agent can only reach the defaults plus api.example.com.
```

### Review the frontmatter

Your agent should produce frontmatter like this:

```markdown .github/workflows/daily-status.md
---
network:
  allowed:
    - defaults
    - api.example.com
---
```

`defaults` keeps the baseline domains your engine needs. Each extra line adds one domain you approve.

> [!NOTE]
> Replace `api.example.com` with a domain your workflow really needs. Remove anything it doesn't call.

### Recompile

Network rules are baked into the lock file, so compile after every change:

```bash
gh aw compile
```

Commit both the `.md` and the `.lock.yml` files.

### Run it and read the firewall report

1. Open the **Actions** tab on GitHub.com and select your workflow.
2. Choose **Run workflow** and wait for it to finish.
3. Open the run summary and look for the firewall section. It lists each domain as allowed or blocked.

### Fix a blocked domain

If a legitimate domain shows as blocked, the agent probably failed or skipped a step. Add that domain to `allowed:`, recompile, and run again.

If an unexpected domain is blocked, leave it blocked. The firewall did its job. Check your prompt and tools to see why the agent tried to reach it.

> [!TIP]
> Start with `defaults` only, run once, and add domains one at a time. A small allowlist is easier to review than a large one trimmed later.

## :white_check_mark: Checkpoint

- [ ] Your workflow's frontmatter has a `network:` block with `allowed:` and `defaults`
- [ ] You ran `gh aw compile` and committed both the `.md` and `.lock.yml` files
- [ ] A run completed and you found the allowed and blocked domains in its summary
- [ ] You can explain why a blocked, unexpected domain is a good result
- [ ] You can name one domain you added and why the workflow needs it

Running behind a corporate proxy or air-gapped runner? See [Side Quest: Self-Hosted Runner Infrastructure Deep Dive](side-quest-24-01-runner-infrastructure.md). To read firewall logs in detail, see [Audit Reference](side-quest-25-01-audit-reference.md).

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
