<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need more than working workflows — they need confidence that every workflow runs within approved boundaries._

## 🎯 What You'll Do

You will apply organisation-level governance controls to your agentic workflows: restricting which models and tools are permitted, scoping workflow permissions to least privilege, and using policy files to enforce consistent guardrails across all repositories in your organisation.
By the end of this step, your workflows will be ready for an enterprise security review.

## 📋 Before You Start

- Your agentic workflow runs successfully on a self-hosted runner or GitHub-hosted runner (see [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) or [Test and Iterate](12-test-and-iterate.md)).
- You have **admin or owner** access to the GitHub organisation where your workflows run.

> [!NOTE]
> On GitHub Enterprise Server (GHES), some UI settings shown below may be in the **Admin Console** or a **Site Admin** panel rather than the organisation settings page. Ask your GitHub administrator for the equivalent path.

## Understand the governance layers

Agentic workflow governance works at three levels:

| Layer | Where to configure | What it controls |
|-------|-------------------|-----------------|
| Organisation policy | Organisation **Settings → Copilot** | Which models are allowed; whether Copilot is enabled at all |
| Workflow frontmatter | `.github/workflows/<name>.md` | Permissions, allowed tools, network access, AI credit caps |
| Repository ruleset | Organisation or repo **Settings → Rules** | Which branches can contain compiled `.lock.yml` files |

Each layer narrows the space of what a workflow can do. Together they form a defence-in-depth that limits blast radius if a workflow misbehaves.

## Restrict model access at the organisation level

By default, workflows can request any model available to your Copilot plan. You can narrow this.

### In the GitHub UI

1. Go to your organisation on GitHub.
2. Click **Settings → Copilot → Policies**.
3. Under **Model access**, select **Restrict to approved models only**.
4. Check the models your team has evaluated and approved.

> [!TIP]
> Start with a single approved model (for example `gpt-4o`) and add others only after evaluating cost and output quality.

Any workflow that requests a non-approved model will fail at queue time with a clear error. This prevents surprise costs from expensive models being added without review.

## Apply least-privilege permissions in frontmatter

Each workflow should declare only the GitHub token permissions it actually needs.

Open your workflow `.md` file and review the `permissions:` block in the frontmatter:

```yaml
---
on:
  schedule:
    - cron: "0 8 * * *"
permissions:
  contents: read
  issues: write
  pull-requests: read
---
```

Key principles:

- **`contents: read`** is sufficient for workflows that only read repository files.
- **`issues: write`** or **`pull-requests: write`** should appear only when the workflow actually creates or updates issues or PRs.
- Omit `contents: write` unless your workflow commits files. Committing back to the repository is a high-risk operation; review it carefully before enabling.

After editing, compile to check the frontmatter is valid:

```bash
gh aw compile
```

<details>
<summary>🖥️ GitHub UI alternative</summary>

If you're working in the GitHub UI, open the workflow `.md` file, click the **pencil icon (✏️)** to edit, and adjust the `permissions:` block directly. Commit the change. The compiled `.lock.yml` will be regenerated on the next Actions run that includes a compile step, or you can trigger a manual compile run.

</details>

## Lock down network access

Agentic workflows can make outbound HTTP requests through [MCP servers](https://github.github.com/gh-aw/reference/mcp-gateway/) and tool calls. Use the `network.allowed` field to restrict which hosts a workflow may contact:

```yaml
---
network:
  allowed:
    - api.github.com
    - github.com
---
```

An empty `allowed` list disables all outbound connections. Listing specific hosts creates an explicit allowlist. This is especially important for workflows that process untrusted content (issues, PRs, user comments) where prompt-injection attacks could attempt to exfiltrate data.

> [!NOTE]
> `network.allowed` is enforced at the gh-aw runtime layer. It does not replace network-level firewall rules on self-hosted runners — use both for defence in depth.

## Enforce policies with a repo ruleset

To prevent developers from pushing compiled lock files that skip policy checks, add a branch protection rule or repository ruleset that requires a code-review approval on changes to `*.lock.yml` files.

1. In your repository, go to **Settings → Rules → Rulesets**.
2. Click **New ruleset → New branch ruleset**.
3. Set **Target branches** to `main` (or your default branch).
4. Under **Rules**, enable **Require a pull request before merging**.
5. Optionally, add a **Required review from code owners** rule and create a `CODEOWNERS` file that assigns ownership of `*.lock.yml` to your security team.

This ensures that every compiled workflow change gets at least one human review before it runs in production.

## ✅ Checkpoint

- [ ] Your organisation's Copilot policy restricts workflows to approved models only
- [ ] Your workflow frontmatter declares only the `permissions:` it genuinely needs
- [ ] You removed any permissions that were included by default but aren't used
- [ ] Your workflow frontmatter includes a `network.allowed` list (or you've documented why it's not needed)
- [ ] `gh aw compile` completed without errors after your frontmatter changes
- [ ] Your default branch has a ruleset requiring review of `.lock.yml` changes
- [ ] You can explain the difference between org-level model policy and workflow-level permissions

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
