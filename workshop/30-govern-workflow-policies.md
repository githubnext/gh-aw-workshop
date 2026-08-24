# Govern AI Workflow Policies Across Your Organisation

> _Centrally control which models, domains, and operations your agentic workflows can use — before they reach production._

## :dart: What You'll Do

You will apply three practical governance controls to your agentic workflow: limit which AI model it can call, lock down the external domains it can reach, and add a rate-limit guard to keep costs predictable. By the end, your workflow frontmatter will encode your organisation's policy in code — reviewable, auditable, and reproducible.

## :clipboard: Before You Start

- You have a compiled agentic workflow from [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You can open the `.md` file and run `gh aw compile` in your Codespace terminal.

## Steps

### Lock in your model choice

Open your workflow `.md` file in the Codespace editor. Inside the frontmatter (`---` block), add or update the `model` field:

```yaml
model: gpt-4o
```

This pins the workflow to a specific model version. The AI running the workflow will refuse to use a different model even if the caller's default changes. Replace `gpt-4o` with whatever model your organisation approves.

> [!TIP]
> Pinning the model prevents drift when a new model rolls out. Your workflow's tested behaviour stays stable until you deliberately upgrade.

### Restrict external network access

Still in the frontmatter, add a `network` block to allowlist only the domains your workflow legitimately calls:

```yaml
network:
  allowed-domains:
    - api.github.com
    - uploads.github.com
```

Any domain not in this list is blocked at runtime. The agent cannot exfiltrate data or call unexpected third-party APIs — even if adversarial content in your repository tries to redirect it.

> [!NOTE]
> If your workflow imports an MCP server that calls an additional domain, add that domain to the list too. A compile-time warning appears for any MCP server whose host is not covered by `allowed-domains`.

### Add a rate-limit guard

Below the `network` block, add a `rate-limiting` section to cap how many AI credits a single run can spend:

```yaml
rate-limiting:
  max-tokens-per-run: 50000
```

Choose a limit that fits your organisation's per-workflow budget. Runs that would exceed the cap are stopped cleanly, and the workflow reports a budget-exceeded outcome rather than failing silently.

For cost context, revisit [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) if you need a baseline before setting the number.

### Compile and inspect the lock file

Save the workflow file, then compile:

```bash
gh aw compile
```

Open the generated `.lock.yml` and look for:

- The `model:` field echoed in the compiled output.
- A `network-policy` step that enforces your `allowed-domains`.
- A `rate-limit` step configured with your token cap.

These become verifiable artifacts you can review in pull requests and audit logs.

### Commit the policy to your repository

Add and commit both files:

```bash
git add .github/workflows/your-workflow.md .github/workflows/your-workflow.lock.yml
git commit -m "feat: add governance policy controls to workflow"
git push
```

Your policy is now under version control. Any change to the model, domains, or rate limit goes through the normal PR and review process — the same as any other code change.

## :white_check_mark: Checkpoint

- [ ] Your workflow frontmatter includes a `model:` field pinned to a specific model
- [ ] Your frontmatter includes a `network.allowed-domains:` allowlist with at least one domain
- [ ] Your frontmatter includes a `rate-limiting.max-tokens-per-run:` cap
- [ ] `gh aw compile` runs without errors or warnings
- [ ] The compiled `.lock.yml` includes a network-policy step and a rate-limit step
- [ ] Both files are committed and pushed to your repository

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
