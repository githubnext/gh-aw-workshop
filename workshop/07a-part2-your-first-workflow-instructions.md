# Step 7a (Part 2): Add Instructions and Finish the Workflow — Terminal Path

_You now have a valid starter file. In this part, you complete it and push it._

## 🎯 What You'll Do

You'll finish `.github/workflows/hello-agent.md` by adding:

- `permissions` and `safe-outputs` in frontmatter
- a `## Task` instructions block below frontmatter
- a final compile check, commit, and push

## 📋 Before You Start

- Completed [Part 1](07a-your-first-workflow-terminal.md)
- `gh aw compile .github/workflows/hello-agent.md --validate` already passes once

## Steps

### Add `permissions` and `safe-outputs`

In `.github/workflows/hello-agent.md`, update frontmatter so it looks like this:

```yaml
---
name: Hello Agent
on:
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  copilot-requests: write
safe-outputs:
  add-comment:
    max: 1
  create-issue:
    max: 1
---
```

### Add your task instructions

Below the closing `---`, add:

```markdown
## Task

Search the open issues in this repository.
Find the issue with the most 👍 reactions.
Post a comment on that issue saying:
"This issue has the most community support! We'll prioritise it in our next planning session."

If there are no open issues, create one titled "Community Voting Test" and post the same comment.
```

### Validate, then commit and push

Run:

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

Optional while editing: `gh aw compile .github/workflows/hello-agent.md --watch`.

Then commit and push:

```bash
git add .github/workflows/hello-agent.md
git commit -m "Add hello-agent agentic workflow"
git push
```

For follow-up edits, prefer asking an agent to update workflows with the `agentic-workflows` skill instead of hand-editing every line.

## Checkpoint

- [ ] `.github/workflows/hello-agent.md` includes `permissions` with `copilot-requests: write`
- [ ] `.github/workflows/hello-agent.md` includes `safe-outputs` for `add-comment` and `create-issue`
- [ ] The file includes a `## Task` instructions block below frontmatter
- [ ] `gh aw compile .github/workflows/hello-agent.md --validate` reports valid
- [ ] The file is committed and pushed to `main`
- [ ] I'm ready for [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
