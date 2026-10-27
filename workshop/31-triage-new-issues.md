<!-- page-journey: all -->
<!-- page-adventure: advanced -->

# Triage New Issues Automatically

> _Let an agent read every new issue, apply the right label, and leave a friendly first reply — so your team starts from a sorted queue._

## :dart: What You'll Do

You'll build an `issue-triage` workflow that runs whenever someone opens an issue. The agent reads the issue, picks one label from a fixed list, and posts a short comment. When you finish, new issues in your practice repository will arrive already labelled.

This is an [IssueOps](https://github.github.com/gh-aw/patterns/issue-ops/) pattern: an issue event starts the work, and the result is written back to the issue.

## :clipboard: Before You Start

- You completed [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md), or you know how an event trigger starts a workflow.
- Your practice repository has the labels `bug`, `question`, and `enhancement`. The default GitHub labels include all three.

## Steps

### Create the workflow file

1. In your Codespace, create `.github/workflows/issue-triage.md` with this content:

```markdown .github/workflows/issue-triage.md
---
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: read
  copilot-requests: write
tools:
  github:
    toolsets: [issues]
safe-outputs:
  add-labels:
    allowed: [bug, question, enhancement]
    max: 1
  add-comment:
    max: 1
---

# Issue Triage

Read the newly opened issue and decide what kind of issue it is.

1. Choose exactly one label: `bug` (something is broken), `question` (the author needs help), or `enhancement` (a new idea).
2. Add that label to the issue.
3. Post a two-sentence comment that thanks the author and says which label you chose and why.

If the issue is empty or unclear, add no label and ask one clarifying question in the comment.
```

> [!NOTE]
> The `allowed` list is a guardrail. Even if the agent wants a different label, [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) reject anything not on the list. The agent itself only needs read access.

### Compile and commit

2. Compile the workflow so the lock file is generated:

```bash
gh aw compile
```

3. Commit both files and push them to your default branch:

```bash
git add .github/workflows/issue-triage.md .github/workflows/issue-triage.lock.yml
git commit -m "feat: add issue triage workflow"
git push
```

### Try it with a real issue

4. On GitHub.com, open the **Issues** tab and select **New issue**.
5. Use the title `The export button does nothing` and write one sentence describing the problem. Select **Submit new issue**.
6. Open the **Actions** tab and watch **Issue Triage** start. It usually finishes within a few minutes.
7. Return to the issue. You should see a label and a short comment from the workflow.
8. Open a second issue that asks a question, such as `How do I change the schedule?`, and confirm it gets the `question` label.

> [!TIP]
> If nothing happens, check that the workflow file is on your default branch. Issue events only run workflows from the default branch.

## :white_check_mark: Checkpoint

- [ ] `.github/workflows/issue-triage.md` and its `.lock.yml` file are committed to your default branch
- [ ] Opening a new issue starts an **Issue Triage** run in the **Actions** tab
- [ ] The bug-style issue received exactly one label and one comment
- [ ] The question-style issue received the `question` label
- [ ] You can explain what the `allowed` list in `add-labels` prevents

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
