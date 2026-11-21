<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Rate limiting and concurrency controls — stopping runaway or overlapping agentic runs with `on.cooldown` and `concurrency:`</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/rate-limiting-controls/</source>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Steps 22 and 26 cover timeouts, but no step teaches learners to stop an event-driven workflow from firing too often or overlapping with itself. Enterprise teams with shared runners and AI credit budgets need this guardrail before rolling workflows out widely.</rationale>
</research-metadata>
-->

# Limit How Often Your Workflow Runs

> _Keep a busy repository from triggering a flood of agent runs that burn credits and queue up on your runners._

## :dart: What You'll Do

You'll add two guardrails to an event-driven workflow: a **cooldown** that spaces out runs, and a **concurrency group** that stops overlapping runs. Then you'll compile and confirm both appear in the generated lock file.

## :clipboard: Before You Start

- The PR reviewer workflow from [Step 14b](14b-pr-reviewer-workflow.md), or any workflow with an event trigger
- Budget basics from [Step 26](26-manage-costs-and-budgets.md)

## Steps

### Understand the two problems

An event trigger such as `pull_request` fires every time someone pushes. Ten quick pushes can start ten agent runs. Each run costs AI credits, and each one holds a runner.

- A **cooldown** makes the trigger wait a set time before it can start another run.
- A **concurrency group** lets only one run in a named group go at a time.

### Ask your agent to add both

Start your AI agent in the Codespace terminal:

```bash
gh copilot
```

Then pass it this prompt:

```prompt
/agentic-workflows Update my PR reviewer workflow so it waits at least 10 minutes between runs, and only one review runs per pull request at a time.
```

### Review the frontmatter

Your agent should produce something close to this:

```yaml
---
on:
  pull_request:
    types: [opened, synchronize]
  cooldown: 10m
permissions:
  contents: read
  pull-requests: read
engine: copilot
concurrency:
  group: pr-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true
safe-outputs:
  add-comment:
    max: 1
---

# PR Reviewer

Review the pull request and post one short comment.
```

Here is what each part does:

- `cooldown: 10m` tells the trigger to wait ten minutes before starting another run.
- `concurrency.group` names the queue. Using the pull request number gives each PR its own queue.
- `cancel-in-progress: true` cancels the older review when a newer push arrives, so you only pay for the latest commit.

> [!TIP]
> Use `cancel-in-progress: true` for reviews, where only the newest result matters. Leave it `false` for jobs that must finish, such as a report that writes to a file.

### Compile and inspect

Compile in the terminal:

```bash
gh aw compile
```

Then search the lock file for your concurrency group:

```bash
grep -n "pr-review" .github/workflows/pr-reviewer.lock.yml
```

Replace `pr-reviewer` with your workflow's file name. You should see the group name in the compiled output.

### Test the overlap

Commit both files and push. Then push two small commits to a pull request in quick succession. Open the **Actions** tab on GitHub.com and look at the first run. It should show as cancelled once the second run starts.

> [!NOTE]
> If your repository has a lot of traffic, start with a short `cooldown` and lengthen it once you see real usage in the [audit report](25-audit-and-observability.md).

## :white_check_mark: Checkpoint

- [ ] Your workflow frontmatter has both a `cooldown:` and a `concurrency:` section
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] You found your concurrency group name in the `.lock.yml` file
- [ ] You saw an older run cancelled after pushing a second commit
- [ ] You can explain the difference between a cooldown and a concurrency group

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
