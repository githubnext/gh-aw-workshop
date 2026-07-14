# Step 7b: Write Your First Agentic Workflow — GitHub UI Path

> [!NOTE]
> Want compiler feedback while you work? Switch to the [Terminal path](07a-your-first-workflow-terminal.md).

## 🎯 What You'll Do

You'll create a complete `hello-agent.md` workflow in the GitHub web editor and commit it without using a terminal.

## 📋 Before You Start

- Your practice repository is open in your browser
- You can create files in the repository

## Understand the file

An agentic workflow source file is a Markdown task brief with YAML frontmatter. GitHub Actions runs the compiled `.lock.yml`; you only edit the `.md` source.

## Create the workflow

1. Click **Add file** → **Create new file**.
2. Enter `.github/workflows/hello-agent.md` as the filename.
3. Paste the complete content below:

   ```markdown
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

   ## Task

   Search the open issues in this repository.
   Find the issue with the most 👍 reactions.
   Post a comment on that issue saying:
   "This issue has the most community support! We'll prioritise it in our next planning session."

   If there are no open issues, create one titled "Community Voting Test" and post the same comment.
   ```

4. Select **Commit directly to the `main` branch**.
5. Click **Commit changes**.

![Workflow file committed in the GitHub UI](images/07-workflow-committed.svg)

> [!NOTE]
> This path skips `gh aw compile` checkpoints. GitHub Actions compiles the workflow when you run it in Step 8 and shows any errors in the run log.

<!-- Separate adjacent callouts -->

> [!TIP]
> You can ask Copilot to create or revise this file with the `agentic-workflows` skill. Review the proposed diff before you approve it.

## Verify Copilot access

1. Open [GitHub Copilot settings](https://github.com/settings/copilot).
2. Confirm an active Copilot plan is listed.

If Copilot is managed by your organization, ask your administrator to confirm that Copilot model access is enabled. Enterprise learners can also review [Enterprise Setup Considerations](side-quest-enterprise-setup.md).

## ✅ Checkpoint

- [ ] `.github/workflows/hello-agent.md` exists in the repository
- [ ] The file contains the complete frontmatter and task brief
- [ ] The file is committed to `main`
- [ ] Copilot model access is enabled for your account

**Next:** [Step 8: Run and Watch Your Workflow](08-run-your-workflow.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
