# Lock Down Your Agent's Network Access

> _Controlling which domains your agent can reach is the single most effective defence against data exfiltration — and it is one line of YAML._

## 🎯 What You'll Do

You will add a `network:` block to your `daily-status` workflow to declare exactly which domains the agent is allowed to contact. By the end, your workflow will run inside a strict network boundary — requests to undeclared domains will be blocked — giving you and your team a clear audit trail of what the agent can and cannot touch.

## 📋 Before You Start

- You have a working `daily-status.md` workflow from [Step 11a: Build a Daily Status Workflow](11a-build-daily-status.md).
- You understand what the agent does during a run: read from [Step 9: Understand Your Workflow Output](09-understand-output.md) if you need a refresher.

## Steps

### Understand the network block

Every agentic workflow runs inside a sandbox. By default, the agent can reach a pre-approved set of GitHub and model endpoints called **`defaults`**.

You can extend or restrict that set with the `network:` frontmatter field:

```yaml
network:
  allowed:
    - defaults
```

The value `defaults` includes endpoints your workflow needs to function: the Copilot model API, the GitHub API, and supporting infrastructure. Adding extra entries (like `api.example.com`) opens additional domains. Listing **only** what your workflow genuinely needs keeps the blast radius small if the agent is misdirected by crafted input.

> [!TIP]
> Enterprise teams often have a security policy that says "workflows must declare all outbound domains". The `network:` block is how you satisfy that policy in a single, auditable YAML stanza.

### Add a network block to your workflow

Open `daily-status.md` (your workflow file) and add a `network:` block in the frontmatter, just before the closing `---`. Keep it to `defaults` unless your workflow explicitly fetches from an external API.

<details>
<summary>🖥️ GitHub UI path</summary>

1. In your repository, navigate to `.github/workflows/daily-status.md`.
2. Click the **pencil icon (✏️)** to edit the file.
3. Add the `network:` block directly above the closing `---` of the frontmatter:

```yaml
network:
  allowed:
    - defaults
```

1. Click **Commit changes**, add a short message such as `chore: add network block to daily-status`, and commit to your main branch.

</details>

<details>
<summary>💻 Terminal path</summary>

1. Open `daily-status.md` in your editor.
2. Add the `network:` block above the closing `---` of the frontmatter.
3. Save, then commit and push:

```bash
git add .github/workflows/daily-status.md
git commit -m "chore: add network block to daily-status"
git push
```

</details>

### (Optional) Pin to specific domains

If your workflow fetches from an external data source — for example, a REST API at `api.statuspage.io` — add that domain explicitly:

```yaml
network:
  allowed:
    - defaults
    - api.statuspage.io
```

Only include domains your workflow actually calls. Leaving out a domain means requests to it will be blocked and logged, which makes any unexpected outbound calls immediately visible in the run log.

### Recompile after editing frontmatter

If you are working locally, recompile to validate the change:

```bash
gh aw compile daily-status
```

UI-first learners can skip this step and rely on the GitHub Actions run to surface any syntax errors.

### Verify the network block is enforced

Run your workflow manually from the **Actions** tab. Open the run log and look for a line that mentions the network firewall — it confirms the allowed-domain list was applied before the agent started.

![Network firewall confirmation in the Actions run log](images/25-network-firewall-log.svg)

## ✅ Checkpoint

- [ ] Your `daily-status.md` frontmatter contains a `network:` block with at least `- defaults`
- [ ] You can explain what `defaults` includes and why listing only needed domains reduces risk
- [ ] The workflow run completed without network errors
- [ ] You know how to add an extra domain if your workflow calls an external API
- [ ] You can describe what happens to a request sent to a domain not in the `allowed:` list

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Side Quest: Agentic Workflow Security Architecture](side-quest-17-02-security-architecture.md)
- [Side Quest: Token and Secret Exfiltration in Agentic Workflows](side-quest-16-03-token-exfiltration.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Network reference documentation](https://github.github.com/gh-aw/reference/network/)
