# Govern Who Can Run Your Agentic Workflows

> _Controlling when and by whom a workflow runs is just as important as what it does — especially when AI agents can post comments, open PRs, or write to repositories._

## :dart: What You'll Do

Set organisation-level policies that control who can trigger your agentic workflows and what they are permitted to do. You will add a [required-reviewer](https://github.github.com/gh-aw/reference/permissions/) gate to your scheduled workflow, verify that the gate appears in the Actions UI, and confirm that only approved tokens and permissions reach the agent.

## :clipboard: Before You Start

- You completed [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have **Owner** or **Actions admin** access on the repository (individual learners always do).
- If you are on GitHub Enterprise Server or GitHub Enterprise Cloud, confirm with your admin that custom deployment environments are enabled.

## Steps

### Restrict which permissions the agent receives

Open your workflow source file in the Codespace editor. Locate the `permissions:` block in the frontmatter. Replace any broad `write-all` grant with the narrowest set your workflow actually needs.

For a scheduled report workflow, this is usually:

```yaml
permissions:
  issues: write
  contents: read
```

Save the file, then compile:

```bash
gh aw compile
```

> [!NOTE]
> On GitHub Enterprise Server 3.12 and later, fine-grained PATs and organisation permission policies let your admin enforce an upper bound — even if your frontmatter requests broader access, the effective permission is capped at what the policy allows.

### Add a manual-approval gate with a deployment environment

A deployment environment lets you require one or more reviewers to approve a workflow run before the agent job starts.

1. Open your repository on GitHub.com and go to **Settings → Environments**.
2. Click **New environment** and name it `agentic-gate`.
3. Under **Deployment protection rules**, enable **Required reviewers** and add yourself (or a team).
4. Click **Save protection rules**.

Now reference that environment in your workflow frontmatter:

```yaml
environment: agentic-gate
```

Compile again:

```bash
gh aw compile
```

Trigger a manual run from the **Actions** tab. You should see a yellow **Waiting for review** banner before the agent job starts.

> [!TIP]
> On GHEC or GHES, your admin can configure **organization-level environment policies** that apply to every repository. Ask your admin whether the `agentic-gate` name is already covered by a shared policy.

### Audit who approved recent runs

After a reviewer approves the pending run, check the run log for the approval event:

1. In the **Actions** tab, open the completed run.
2. Expand the **Set up job** section and look for the `Approved by` line.

> [!NOTE]
> Agentic workflow run logs include a standard GitHub Actions audit trail. On GHES, these events also flow into the organisation **Audit log** under `workflow_run.requested` and `deployment_review.approved`.

## :white_check_mark: Checkpoint

- [ ] Your workflow frontmatter uses a minimal `permissions:` block with only the grants your workflow needs
- [ ] You created an `agentic-gate` deployment environment with at least one required reviewer
- [ ] Your workflow frontmatter includes `environment: agentic-gate`
- [ ] A manual run showed the **Waiting for review** gate before the agent job started
- [ ] You located the **Approved by** field in the run log after approval
- [ ] You can explain why least-privilege permissions matter for agentic workflows that post to GitHub

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->
