<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Control Which Websites Your Agent Can Reach

> _Your agent can only call the domains you list, so a bad prompt can't send your data somewhere you never approved._

## :dart: What You'll Do

You'll add a [`network:` allowlist](https://github.github.com/gh-aw/reference/network/) to one of your workflows, run it, and find the blocked request in the firewall log. When you finish, you'll know how to open up exactly the domains your agent needs and nothing more.

Why this matters: agents can fetch web pages and call APIs. Without limits, an injected instruction could ask the agent to send repository content to any website. The firewall turns that risk into a blocked request.

## :clipboard: Before You Start

- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md), or you have any workflow you can recompile and run.
- You can compile workflows with `gh aw compile`.

## Steps

### Understand the allowlist

The `network:` block in frontmatter lists the domains the agent's sandbox may contact. Everything else is blocked by the firewall (a filter that checks each outgoing request against your list).

| Entry | What it allows |
|-------|----------------|
| `defaults` | Basic infrastructure the engine needs to run |
| `github` | GitHub domains |
| `node`, `python` | Package registries for that ecosystem |
| `api.example.com` | One specific domain you name |

> [!NOTE]
> Enterprise learners: if your organization routes traffic through a proxy or uses GitHub Enterprise Cloud with a custom domain, add those hostnames here rather than loosening the whole list.

### Add a minimal allowlist

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
Use /agentic-workflows to restrict my daily-status workflow's network access to defaults and github only.
```

The frontmatter should now include a block like this:

```yaml
network:
  allowed:
    - defaults
    - github
```

### Compile and run

In the terminal, recompile so the lock file picks up the change:

```bash
gh aw compile
```

Commit and push both files, then open the **Actions** tab on GitHub.com, choose your workflow, and select **Run workflow**.

### Provoke a blocked request

Ask your agent to add one sentence to the brief:

```prompt
Add a step to my daily-status brief that fetches the page at https://example.com and mentions its title.
```

Recompile, push, and run again. Because `example.com` isn't on your list, the firewall blocks it.

### Read the firewall log

Open the finished run in the **Actions** tab and look in the run summary for the firewall section. You should see `example.com` listed as blocked. If you want the full detail, ask your agent:

```prompt
Use /agentic-workflows to audit my latest daily-status run and list any blocked network requests.
```

### Allow only what you need

If the request was legitimate, add that one domain to `allowed:` and recompile. Otherwise, remove the step you added. Prefer exact domains over broad ecosystems.

```yaml
network:
  allowed:
    - defaults
    - github
    - example.com
```

> [!TIP]
> Treat a new blocked domain as a question: "Do I trust this site with my workflow's context?" Add it only when the answer is yes.

## :white_check_mark: Checkpoint

- [ ] Your workflow has a `network:` block with `allowed:` listing `defaults` and `github`
- [ ] You ran `gh aw compile` and committed both the `.md` and `.lock.yml` files
- [ ] A run showed `example.com` as blocked in the firewall section of the run summary
- [ ] You either added exactly one domain to `allowed:` or removed the test step, then recompiled
- [ ] You can explain why a narrow allowlist limits the damage of a prompt injection

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
