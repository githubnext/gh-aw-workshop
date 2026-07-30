<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _When your team ships multiple agentic workflows, you need policy, visibility, and guard-rails — not just great prompts._

## :dart: What You'll Do

You will apply [governance](https://github.github.com/gh-aw/guides/governance/) techniques to keep agentic workflows safe and auditable as they spread across repositories and teams. By the end of this step you will have a reusable policy checklist, a required-workflow pattern, and a clear escalation path for findings that need human review.

## :clipboard: Before You Start

- You completed [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md).
- You have admin or organisation-owner access to at least one GitHub organisation (or you are following along in read-only mode).

## Steps

### Understand the governance problem

Individual agentic workflows are easy to reason about. Dozens of them across many repositories are not. Common problems include overly broad `permissions`, prompts that have drifted since review, and no central record of which repositories run AI automation.

[Using workflows at scale](https://github.github.com/gh-aw/guides/using-at-scale/) covers the three governance pillars: **visibility**, **policy**, and **response**.

### Inventory your organisation's agentic workflows

Before you can govern, you need to see what exists. In the Codespace terminal, run:

```bash
gh api /repos/{owner}/{repo}/actions/workflows \
  --jq '.workflows[] | select(.name | test("aw-")) | {name, path, state}'
```

> [!TIP]
> For a multi-repository scan, replace with `/orgs/{org}/actions/workflows` (requires `read:org` scope).

Record the output in a new issue titled **Workflow Inventory** — one row per workflow with name, repository, and state (`active` / `disabled`).

### Apply minimum-permission standards

Open each workflow file you own. For every workflow, confirm the `permissions:` block follows least privilege:

```yaml
---
permissions:
  issues: write       # only if the workflow creates or updates issues
  contents: read      # default for most read-only workflows
---
```

Remove any scope not directly required by the task brief. If you are unsure which scope is needed, check the [permissions reference](https://github.github.com/gh-aw/reference/permissions/).

Compile after editing:

```bash
gh aw compile
```

### Add a required-workflow gate (enterprise orgs)

On GitHub Enterprise Cloud, a **required workflow** runs on every pull request in every matching repository — PRs cannot merge without it passing.

To enable one:

1. In your organisation settings, go to **Actions** → **Required workflows**.
2. Click **Add workflow** and point it at the workflow file in your `.github` repository.
3. Set the **Repository filter**, then save.

> [!NOTE]
> Required workflows only support the `push`, `pull_request`, and `pull_request_target` triggers.

### Define a human-escalation path

Not every finding should be auto-fixed. Add a `human-review` label to your repository and update your audit workflow brief to apply it when the agent detects:

- A permission scope broader than required.
- A prompt modified without a corresponding review comment.
- A token-usage spike above your P90 baseline (from [Step 26](26-manage-costs-and-budgets.md)).

Add this instruction to your task brief:

```
If you find any of the conditions above, apply the "human-review" label and stop —
do not attempt to auto-fix.
```

Human eyes should always review sensitive findings, especially on scheduled overnight runs.

### Document your governance policy

Create `.github/WORKFLOW_POLICY.md` in your practice repository. Include:

- The minimum permissions standard you defined above.
- The escalation criteria for `human-review`.
- A link to your **Workflow Inventory** issue.
- Who owns workflow governance reviews.

Commit the file:

```bash
git add .github/WORKFLOW_POLICY.md
git commit -m "docs: add workflow governance policy"
git push
```

## :white_check_mark: Checkpoint

- [ ] You ran `gh api` to list workflows in at least one repository and recorded the results in a **Workflow Inventory** issue
- [ ] You reviewed the `permissions:` blocks in your own workflows and removed any unnecessary scopes
- [ ] You can describe the three governance pillars (visibility, policy, response) in your own words
- [ ] You defined at least two escalation criteria that trigger the `human-review` label
- [ ] You created `WORKFLOW_POLICY.md` in `.github/` and committed it to your practice repository
- [ ] (Enterprise) You located the **Required workflows** setting in your organisation and understand when to use it

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
