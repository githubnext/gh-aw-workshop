# Enforce Organisation-Wide Workflow Policies

> _Governance isn't a barrier to agility — it's what lets you say "yes" to AI automation at scale._

## 🎯 What You'll Do

You'll configure organisation-level controls for agentic workflows: restrict which AI models are permitted, centralise secrets so individual repositories don't need direct credentials, and optionally enforce a required workflow that adds an audit step to every run.

## 📋 Before You Start

- You have completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You are an **organisation owner** or have **enterprise admin** access on GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server (GHES) 3.12 +.
- If you are working in a personal repository, you can follow along in read-only mode — the UI paths still illustrate the controls even if you cannot save changes.

## Steps

### Review the policy surface

Agentic workflows run as GitHub Actions jobs. The same organisation-level policy knobs that govern classic Actions apply here, plus a few new ones specific to AI model access.

Open your organisation settings in the GitHub UI:

1. Go to **github.com/organizations/YOUR-ORG/settings/actions**.
2. Under **Policies**, review the **Allow** options for Actions. Agentic workflows respect whatever scope you set (e.g. "Allow select actions and reusable workflows").

> [!TIP]
> If your organisation already restricts third-party Actions to verified creators or SHA-pinned refs, those rules apply to the compiled `.lock.yml` files that `gh aw compile` generates. The compile step pins Actions to SHAs by default — so your policies and the compiler work together automatically.

### Centralise AI model credentials with organisation secrets

Storing the Copilot or model API token at the organisation level means repositories inherit it automatically, without each team managing their own secret.

1. Navigate to **github.com/organizations/YOUR-ORG/settings/secrets/actions**.
2. Click **New organisation secret**.
3. Name it `COPILOT_TOKEN` (or `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` if you use those models).
4. Set the **Repository access** policy to the repositories that should be allowed to use it (e.g. **Selected repositories** or **All repositories**).
5. Click **Add secret**.

Repositories that are granted access can now reference `${{ secrets.COPILOT_TOKEN }}` in their workflow frontmatter without owning the credential directly.

### Restrict AI model access with a Copilot policy (GHEC)

GitHub Enterprise Cloud lets you control which AI providers Copilot can call on behalf of workflows.

1. Go to **github.com/enterprises/YOUR-ENTERPRISE/settings/copilot**.
2. Under **Model access**, review which third-party models are enabled.
3. To limit workflows to only GitHub-hosted Copilot models, disable third-party model integrations here.

> [!NOTE]
> This policy applies to all Copilot usage across the enterprise, including agentic workflows and Copilot Chat. Coordinate with your security team before restricting providers that other teams depend on.

### Add a required workflow for mandatory audit steps (optional)

Required workflows run on every pull request in selected repositories, regardless of what each repository defines. You can use this to inject a standard audit or compliance check into every project.

1. Author a shared agentic workflow file in a central repository (e.g. `your-org/shared-workflows/.github/workflows/agentic-audit.md`).
2. In your organisation settings, go to **Actions → Required workflows**.
3. Click **Add required workflow**, select your central repository and the compiled `.lock.yml` file, and apply it to the target repositories.

The required workflow runs as an additional check — it cannot be skipped by individual repository owners.

<details>
<summary>🖥️ GitHub UI path for required workflows</summary>

1. Open **github.com/organizations/YOUR-ORG/settings/actions**.
2. Scroll to **Required workflows** and click **Add required workflow**.
3. Choose the source repository and compiled workflow file.
4. Select which repositories the requirement applies to.
5. Click **Add workflow**.

</details>

## ✅ Checkpoint

- [ ] You have reviewed your organisation's Actions policy settings
- [ ] A model credential (Copilot or third-party API key) is stored as an **organisation secret** scoped to the appropriate repositories
- [ ] You can describe how `gh aw compile` SHA-pinning aligns with your organisation's Actions allow-list policy
- [ ] If on GHEC, you have reviewed the Copilot model access settings for your enterprise
- [ ] You know how to create a required workflow and which repositories it would apply to
- [ ] You can explain the difference between repository-level and organisation-level secret scoping

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Managing organisation secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-an-organization)
- [Required workflows documentation](https://docs.github.com/en/actions/using-workflows/required-workflows)
- [Managing Copilot policies for your enterprise](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-for-your-enterprise)
- [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md)
- [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
