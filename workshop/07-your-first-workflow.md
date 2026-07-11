# Step 7: Write Your First Agentic Workflow

> _Writing your first workflow is the moment theory becomes practice — let's make something real._

## 🎯 What You'll Do

You'll create a simple agentic workflow file in your repository using the `gh-aw` format. By the end of this step you'll have a working workflow definition that an AI agent can understand and act on.

## 📋 Before You Start

- Completed [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command is available in your terminal
- Your practice repository is open (from [Step 3](03-create-your-repo.md))

## Steps

### 1. Create the workflows directory

Agentic workflow files live alongside regular GitHub Actions workflows inside `.github/workflows/`.

```bash
mkdir -p .github/workflows
```

### 2. Create your first workflow file

Create a new file called `.github/workflows/hello-agent.md`.

```bash
touch .github/workflows/hello-agent.md
```

Open the file in your editor.

### 3. Add the frontmatter

Every `gh-aw` workflow starts with a YAML frontmatter block fenced by `---`. This tells the system what the workflow is called, when it runs, and what permissions it needs.

Paste the following at the very top of the file:

```yaml
---
name: Hello Agent
on:
  workflow_dispatch:
permissions:
  contents: read
  issues: write
---
```

- `name`: a human-readable label shown in the GitHub Actions UI.
- `on: workflow_dispatch`: means you trigger it manually — great for testing.
- `permissions`: the workflow can read your repository and write to issues.

### 4. Add the agent instructions

Below the closing `---`, write a plain-English description of what you want the agent to do. Think of it as a task brief for a capable colleague.

```markdown
## Task

Search the open issues in this repository.
Find the issue with the most 👍 reactions.
Post a comment on that issue saying:
"This issue has the most community support! We'll prioritise it in our next planning session."

If there are no open issues, create one titled "Community Voting Test" and post the same comment.
```

> [!TIP]
> You don't need to tell the agent *how* to search issues or post comments — it knows how to use GitHub's APIs. You just describe the *goal* and the *guardrails*.

### 5. Validate the file

Run the `gh-aw` validator to check your frontmatter and structure are correct.

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

You should see output like:

```
✔ hello-agent.md — valid
```

> [!NOTE]
> Validation only checks the file structure. The agent's reasoning happens at runtime, not compile time.

### 6. Commit and push

```bash
git add .github/workflows/hello-agent.md
git commit -m "Add hello-agent agentic workflow"
git push
```

![Workflow file committed in the GitHub UI](images/07-workflow-committed.png)

## ✅ Checkpoint

- [ ] `.github/workflows/hello-agent.md` exists in my repository
- [ ] The file has valid YAML frontmatter with `name`, `on`, and `permissions`
- [ ] `gh aw compile .github/workflows/hello-agent.md --validate` reports no errors
- [ ] The file is committed and pushed to `main`

**Next:** [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
