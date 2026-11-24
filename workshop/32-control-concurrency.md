<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Concurrency control — keeping overlapping runs of an agentic workflow from colliding using `concurrency:`, `engine.concurrency`, and `safe-outputs.concurrency-group`</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt (downloaded to /tmp/gh-aw/data/llms.txt)</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
    <source>https://github.github.com/gh-aw/patterns/chat-ops/</source>
  </sources>
  <rationale>The existing curriculum (steps 1-31) covers triggers, safe outputs, staged mode, network allowlists, costs, and orchestration, but no step explains what happens when two runs of the same workflow start at once. Event-driven and slash-command workflows from steps 14b and 28 can fire several times in quick succession, causing duplicate issues, comments, or wasted AI credits. gh-aw already generates per-workflow and per-engine concurrency groups, and exposes `concurrency:` overrides, `queue`, `job-discriminator`, and `safe-outputs.concurrency-group`. This step teaches learners to read the generated defaults in a lock file, then override them deliberately for a slash-command workflow.</rationale>
</research-metadata>
-->

# Keep Overlapping Runs Apart with Concurrency Control

> _Decide what happens when your workflow is triggered twice before the first run finishes._

## :dart: What You'll Do

You'll read the concurrency groups that gh-aw generates for one of your workflows, then add a custom [`concurrency:`](https://github.github.com/gh-aw/reference/concurrency/) block and a serialized safe-output group. When you finish, you'll know how to stop duplicate comments, issues, and wasted AI credits from rapid triggers.

Why this matters: event-driven workflows such as the `/review` command in [Step 14b](14b-pr-reviewer-workflow.md) can fire many times in a row. Without a clear rule, two runs can post the same comment twice or burn credits on work that is already out of date.

## :clipboard: Before You Start

- You completed [Step 14b](14b-pr-reviewer-workflow.md), or you have any workflow with a `pull_request`, `issues`, or `slash_command` trigger.
- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md), or you are comfortable with a `safe-outputs:` block.
- You can compile workflows with `gh aw compile`.

## Steps

### Find the generated defaults

gh-aw adds concurrency groups for you. Compile your workflow, then search the lock file:

```bash
gh aw compile
grep -n -A3 "concurrency:" .github/workflows/pr-reviewer.lock.yml
```

Replace `pr-reviewer` with your own workflow name. You'll see a group that starts with `gh-aw-` and includes the workflow name. The group changes with the trigger: issues group by issue number, pull requests group by PR number and cancel outdated runs, and scheduled runs share one group.

> [!NOTE]
> Don't edit the `.lock.yml` file by hand. Change the `.md` file and recompile.

### Override the workflow group

Add your own `concurrency:` block to the frontmatter. This example makes new pushes to the same branch cancel the older run:

```markdown .github/workflows/pr-reviewer.md
---
on:
  push:
concurrency:
  group: pr-reviewer-${{ github.ref }}
  cancel-in-progress: true
---
```

Use `cancel-in-progress: true` when only the latest result matters. Leave it off when every trigger must finish, and GitHub Actions will [queue](https://github.github.com/gh-aw/reference/concurrency/) the runs in the same group. gh-aw emits `queue: max` for generated groups so back-to-back triggers run in order instead of being dropped.

### Limit the AI engine across workflows

Each engine also has its own group, `gh-aw-{engine-id}`, so only one agent job per engine runs at a time across all your workflows. Override it with `engine.concurrency` when you want a different scope:

```markdown .github/workflows/pr-reviewer.md
---
engine:
  id: copilot
  concurrency:
    group: "gh-aw-copilot-${{ github.workflow }}"
---
```

This lets two different workflows use Copilot at the same time while keeping runs of the same workflow in line.

### Serialize your safe outputs

The agent job and the [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) job run separately, so two runs can both decide to create the same issue. Add `concurrency-group` so those writes happen one at a time:

```markdown .github/workflows/pr-reviewer.md
---
safe-outputs:
  concurrency-group: "safe-outputs-${{ github.repository }}"
  add-comment:
---
```

Queued runs wait for the running one to finish instead of being cancelled.

### Handle fan-out dispatches

If you dispatch the same workflow many times with different inputs, the static job groups can cancel all but the latest run. Add a `job-discriminator` so each run gets its own group:

```markdown .github/workflows/pr-reviewer.md
---
concurrency:
  job-discriminator: ${{ inputs.finding_id || github.run_id }}
---
```

`job-discriminator` is a gh-aw extension. It does not appear in the compiled lock file.

### Compile and test

```bash
gh aw compile
```

Trigger the workflow twice in quick succession, for example by commenting `/review` twice on a pull request. Open the **Actions** tab and confirm the runs queue or cancel the way you configured.

## :white_check_mark: Checkpoint

- [ ] You found the generated `gh-aw-` concurrency group in a compiled lock file
- [ ] Your workflow has a `concurrency:` block with a `group` and a deliberate `cancel-in-progress` value
- [ ] Your safe outputs use `concurrency-group` where duplicate writes would cause problems
- [ ] You triggered the workflow twice and saw the runs queue or cancel as expected
- [ ] You can explain when to use `job-discriminator`

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
