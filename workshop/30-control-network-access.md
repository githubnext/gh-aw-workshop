<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Control Which Domains Your Agent Can Reach

> _An agent that can reach any website can leak data to any website — a short allowlist keeps it on a leash._

## :dart: What You'll Do

You'll add a `network:` allowlist to one of your workflows, then watch the firewall block a domain you did not list. By the end, you'll know how to open exactly the access your workflow needs and nothing more. This matters most in enterprise environments, where security teams ask for a written list of outbound domains.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You have a working workflow, such as `daily-status.md`, that you can edit and recompile.
- You know how to read a run summary from [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).

## Steps

### Understand the default

Every agentic workflow runs behind a **firewall**: a filter that decides which web addresses the agent may contact. If you don't set `network:`, gh-aw uses `network: defaults`, which allows only basic infrastructure such as certificate authorities and common package mirrors. GitHub domains are always allowed.

You choose one of three settings:

| Setting | Effect |
|---------|--------|
| `network: defaults` | Basic infrastructure only (the default) |
| `network: { allowed: [...] }` | Only the domains and ecosystems you list |
| `network: {}` | No network access at all |

Listed domains also match their subdomains. Learn more in the [network reference](https://github.github.com/gh-aw/reference/network/).

### Ask your agent to add an allowlist

Start Copilot CLI in your Codespace terminal:

```bash
gh copilot
```

Then paste this prompt:

```prompt
/agentic-workflows update daily-status to allow only the defaults and the node ecosystem on the network.
```

The agent edits the frontmatter. It should now include a block like this:

```yaml
network:
  allowed:
    - defaults
    - node
```

An **ecosystem identifier** such as `node` stands for all the domains that package manager needs, so you don't list them by hand.

### Compile the change

Run this in the terminal (not in the agent chat):

```bash
gh aw compile
```

Commit and push the `.md` and `.lock.yml` files.

### Trigger a blocked request

Ask the agent to make the workflow reach a domain you did not allow:

```prompt
/agentic-workflows add a step to daily-status that fetches https://example.com and summarizes it.
```

Compile, push, then run the workflow from the **Actions** tab (**Run workflow**).

### Find the block in the audit

After the run finishes, copy the run ID from the URL and run:

```bash
gh aw audit <run-id> --parse
```

Open `firewall.md`. You should see `example.com` listed as **blocked**. The firewall stopped the request before any data left the runner.

### Decide what to do with it

You have two honest choices: remove the step, or add `example.com` to `allowed` because you trust it. Never add a domain just to make an error disappear.

> [!TIP]
> After a clean run, share `firewall.md` with your security team. It's a ready-made list of every domain your workflow actually contacted.

## :twisted_rightwards_arrows: Choose Your Path

| If you… | Go to… |
|---------|--------|
| Run on self-hosted runners behind a proxy | ➡️ [Self-Hosted Runner Infrastructure Deep Dive](side-quest-24-01-runner-infrastructure.md) |
| Want to understand why the allowlist stops data theft | ➡️ [Token Exfiltration](side-quest-16-03-token-exfiltration.md) |
| Are ready to pick your next topic | ➡️ [What's Next? Keep Exploring](14-next-steps.md) |

## :white_check_mark: Checkpoint

- [ ] You can name the three `network:` settings and what each allows
- [ ] Your workflow frontmatter contains `network.allowed` with `defaults` and `node`
- [ ] `gh aw compile` succeeded and you pushed the updated `.lock.yml`
- [ ] `firewall.md` from `gh aw audit --parse` shows `example.com` as blocked
- [ ] You can explain why you shouldn't add a domain only to silence a blocked request
