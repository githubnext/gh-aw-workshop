# Roll Out Agentic Workflows Across Your Organisation

> _One workflow in one repository is a proof of concept — rolling it out across your org is where the real value lands._

## 🎯 What You'll Do

Set up shared secrets at the organisation level, apply a required-workflow policy so every team uses your proven template, and verify the rollout with a quick health check.

## 📋 Before You Start

- You have a working agentic workflow in at least one repository (see [Schedule It to Run Every Day](13-schedule-it.md)).
- You are an owner or security manager of a GitHub organisation.
- If you run self-hosted runners, complete [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) first.

## Steps

### Share credentials with organisation-level secrets

When the same Copilot token or external API key is needed across many repositories, store it once at the org level instead of repeating it in every repo.

1. Go to your organisation on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New organisation secret**.
4. Name the secret (for example, `COPILOT_GITHUB_TOKEN`) and paste the value.
5. Under **Repository access**, choose **Selected repositories** and pick the repos that should inherit this secret.

> [!NOTE]
> Organisation secrets appear in workflow runs exactly like repository secrets. You don't need to change any workflow frontmatter — the secret name resolves automatically.

### Enforce a baseline workflow with required workflows

GitHub Enterprise Cloud lets you designate one repository as a _policy source_. Any workflow file you mark as required runs automatically on every pull request across selected repositories — without contributors needing to add it themselves.

1. In your policy-source repository, ensure your compiled `.lock.yml` is committed (for example, `.github/workflows/pr-reviewer.lock.yml`).
2. Go to your organisation → **Settings** → **Actions** → **Required workflows**.
3. Click **Add workflow**, select the policy repository, and enter the lock file path.
4. Choose which repositories the policy applies to and save.
5. Open a test pull request in a target repository and confirm the required workflow appears under **Checks**.

> [!TIP]
> Required workflows are read from the policy repository at run time. Update the lock file there and all target repos pick up the change on the next PR.

### Audit workflow runs across the org

Check that agentic workflows are running successfully across your repositories.

```bash
gh run list --org <your-org> --workflow pr-reviewer.lock.yml --limit 20
```

Look for runs with a `failure` conclusion and open the job log to diagnose them. Common failures: missing secrets, runner label mismatches, blocked network egress to model endpoints.

<details>
<summary>🖥️ GitHub UI alternative</summary>

Go to your organisation → **Actions**, use the **Workflow** filter, and click any failed run to open its job log.

</details>

### Apply a minimum-permissions checklist before wide rollout

Before enabling a workflow for the entire org, confirm each template has:

- `permissions:` scoped to only what the workflow actually needs (avoid `write-all`).
- `network.allowed-domains` set so the agent only reaches expected endpoints.
- `safe-outputs` declared, limiting what the agent can write without human review.

See [Side Quest: Permission Escalation in Agentic Workflows](side-quest-17-04-permission-escalation.md) for the full checklist.

## ✅ Checkpoint

- [ ] At least one secret is stored at the organisation level and referenced in a workflow
- [ ] A required workflow is configured in an organisation policy repository
- [ ] You confirmed a required workflow check appears on a pull request in a target repository
- [ ] You ran `gh run list` (or used the UI) to review recent agentic workflow runs across repos
- [ ] Your template workflow's `permissions:` block is scoped to the minimum needed

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Organisation secrets documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-an-organization)
- [Required workflows documentation](https://docs.github.com/en/actions/using-workflows/required-workflows)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Side Quest: Permission Escalation in Agentic Workflows](side-quest-17-04-permission-escalation.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
