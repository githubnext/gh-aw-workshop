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

### 3. Add the basic frontmatter (name + trigger)

Every `gh-aw` workflow starts with a YAML frontmatter block fenced by `---`. This tells the system what the workflow is called, when it runs, and what permissions it needs.

Paste the following at the very top of the file:

```yaml
---
name: Hello Agent
on:
  workflow_dispatch:
---
```

- `name`: a human-readable label shown in the GitHub Actions UI.
- `on: workflow_dispatch`: means you trigger it manually — great for testing.

Run validation now:

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

### 4. Add permissions to the frontmatter

Now add the `permissions` block before the closing `---`:

```yaml
permissions:
  contents: read
  issues: write
```

Re-run validation:

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

- `permissions`: the workflow can read your repository and write to issues.

### 5. Add the agent instructions

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
> You don't need to tell the agent _how_ to search issues or post comments — it knows how to use GitHub's APIs. You just describe the _goal_ and the _guardrails_.

### 6. Validate the file

Run the `gh-aw` validator to check your frontmatter and structure are correct.

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

If you're editing by hand, you can also keep the compiler running while you iterate:

```bash
gh aw compile .github/workflows/hello-agent.md --watch
```

You should see output like:

```
✔ hello-agent.md — valid
```

> [!NOTE]
> Validation only checks the file structure. The agent's reasoning happens at runtime, not compile time.

### 7. Commit and push

```bash
git add .github/workflows/hello-agent.md
git commit -m "Add hello-agent agentic workflow"
git push
```

![Workflow file committed in the GitHub UI](images/07-workflow-committed.png)

### Optional: Adventure A and B alternatives

<details>
<summary>Already comfortable editing less by hand? Expand for optional alternatives.</summary>

You can get your first workflow other ways:

- **Adventure A — Add an existing workflow:** run `gh aw add-wizard`, choose a workflow from `githubnext/agentics`, and add it to your repo.
- **Adventure B — Generate a new workflow with an agent:** use Copilot, Claude, or Codex and ask it to create a new agentic workflow using the `agentic-workflows` skill.

If you choose Adventure A or B, still run the validation step in this guide.

</details>

## ✅ Checkpoint

- [ ] `.github/workflows/hello-agent.md` exists in my repository
- [ ] The file has valid YAML frontmatter with `name`, `on`, and `permissions`
- [ ] `gh aw compile .github/workflows/hello-agent.md --validate` reports no errors
- [ ] The file is committed and pushed to `main`

**Next:** [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)
