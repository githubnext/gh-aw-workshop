# Govern Your Agentic Workflows at Scale

> _Enterprise teams need confidence that no workflow runs unreviewed — this step shows you how to make review mandatory._

## :dart: What You'll Do

You'll set up three overlapping controls: a `CODEOWNERS` rule so changes to workflow files require code-owner approval, a branch protection rule that blocks merging lock files without a passing status check, and an environment protection gate that requires a named reviewer before any production workflow triggers.

By the end, your repository enforces a consistent review process no matter who edits a workflow.

## :clipboard: Before You Start

- You have at least one compiled workflow in your repository (see [Orchestrate Multiple Agentic Workflows](28-orchestrate-workflows.md)).
- You have repository admin access (required to change branch protection and environment settings).
- Your repository is part of a GitHub organization (environment protection gates are an organization feature).

## Steps

### Add CODEOWNERS for workflow files

CODEOWNERS lets you declare who must review changes to specific paths. Adding your workflow folder means every pull request that touches a `.md` or `.lock.yml` workflow file must get at least one review from a designated owner.

Open a Copilot chat in your Codespace terminal:

```bash
gh copilot
```

Then paste this prompt:

```prompt
/agentic-workflows add a CODEOWNERS rule so that any change inside .github/workflows/ requires review from @my-org/workflow-owners
```

Copilot generates a `CODEOWNERS` file (or updates an existing one) and explains the change. Review the diff, then commit and push:

```bash
git add .github/CODEOWNERS
git commit -m "feat: require workflow-owners review for .github/workflows/"
git push
```

> [!NOTE]
> The team `@my-org/workflow-owners` must exist before the rule takes effect. Create it in your organization's **Teams** settings if it does not exist yet.

### Require status checks on the default branch

Lock files (`.lock.yml`) are generated from the workflow source (`.md`). Protecting the default branch ensures that only compiled, reviewed lock files land there.

Open your repository's **Settings** → **Branches** → the rule for your default branch. Enable the following options:

- **Require a pull request before merging** (at least one approving review)
- **Require status checks to pass** — add the check named `compile` if your CI runs `gh aw compile --validate`
- **Do not allow bypassing the above settings**

![Branch protection settings showing required status checks enabled](images/29-branch-protection.png)

> [!TIP]
> If you don't yet have a CI check that compiles workflows, see [Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md) for a short workflow you can add.

### Create an environment protection gate

An environment protection gate lets you require a named human reviewer before any job that targets that environment starts. This means even if a workflow is triggered automatically, the run pauses at the gate until someone approves.

Go to **Settings** → **Environments** → **New environment**. Name it `production-workflows`. Under **Deployment protection rules**, add:

- **Required reviewers**: add yourself or the `workflow-owners` team
- **Prevent self-review** if you want a second set of eyes

Update your most critical workflow's frontmatter to target this environment. In your Codespace, open the workflow file and add:

```yaml
jobs:
  run:
    runs-on: ubuntu-latest
    environment: production-workflows
```

Then recompile:

```bash
gh aw compile
```

Commit and push the updated `.md` and `.lock.yml` together:

```bash
git add .github/workflows/
git commit -m "feat: gate production workflow behind environment approval"
git push
```

### Verify the gate in action

Trigger the workflow manually from **Actions** → your workflow → **Run workflow**. The run should pause at the approval gate. Open the run log and click **Review deployments** → approve the run.

Confirm the workflow completes successfully after approval.

## :white_check_mark: Checkpoint

- [ ] A `CODEOWNERS` rule exists in `.github/CODEOWNERS` requiring review on `.github/workflows/`
- [ ] Your default branch requires at least one pull request approval before merging
- [ ] A `production-workflows` environment exists with at least one required reviewer
- [ ] Your workflow's compiled lock file targets the `production-workflows` environment
- [ ] You triggered the workflow and approved the environment gate in the Actions run log
- [ ] You can explain why CODEOWNERS, status checks, and environment gates each address a different layer of the review process

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

<!-- journey: enterprise -->
