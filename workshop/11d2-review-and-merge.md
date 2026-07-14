# Adventure D (Part 2): Monitor, Review, and Merge

> _Once the agent session ends, you'll review its pull request, ask for any revisions, and merge your workflow._

## 📋 Before You Start

- **Step 11d complete** — you have submitted the scenario prompt in [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
- **Agent session running or finished** — the session you started is in progress or has completed
- **Practice repository open** — your practice repository is open in the browser so you can view the pull request

---

## Monitor Your Session

After you submit the prompt, watch the activity feed until the session finishes. Most sessions complete in two to five minutes, and you can steer the work with follow-up prompts if the agent needs more context or takes the wrong direction.

### ✏️ Exercise: monitor progress and open the PR

1. In the GitHub Copilot app, open your active session in **My work** so you can watch the agent's progress in one place.
2. Wait for the session to finish, then open the pull request link from the session so you can review the exact branch the agent created.
3. Keep the pull request open in a browser tab so the next exercises stay focused on the same change set.

> [!TIP]
> Want a detailed walkthrough of each agent phase? See [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md).

---

## Review the Pull Request

When the session ends, open the pull request it created. Choose the path that matches where you started the session so you land on the correct PR before reviewing the diff:

- **GitHub Copilot app:** Open **My work**, select your active session, and use its pull request link.
- **Agents tab:** Open the session in the **Agents** tab and use the pull request link in the session timeline.
- **Terminal or Codespace:** Run `gh pr list --state open` inside your practice repository so you can identify the PR by title or branch.

The PR should contain exactly two files: the human-readable task brief (`.md`) and the compiled lock file (`.lock.yml`). The lock file is the artifact that GitHub Actions actually executes — without it, your trigger will fire but nothing will run, because the runtime has no instructions to follow. Reviewing both files in the diff before merging ensures you have a working workflow rather than a broken deployment.

### ✏️ Exercise: inspect the diff and validate the lock file

1. Open the pull request the agent created so you can review the proposed workflow before it reaches your default branch.
2. In the **Files changed** tab, confirm the PR includes both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml`, because GitHub Actions needs both files to run the workflow.
3. Open `.github/workflows/<name>.lock.yml` in the diff and confirm it is not empty, because an empty lock file means the workflow did not compile into runnable instructions.
4. Add a PR comment that pastes the first 10 lines of `.github/workflows/<name>.lock.yml` in a fenced code block so you practice checking the compiled artifact directly.

### ✏️ Exercise: request a revision with `@copilot`

1. Read `.github/workflows/<name>.md` and decide whether you want any changes so you review the brief before approving it.
2. If you do not want any changes, skip the remaining steps in this exercise and proceed to the **Merge and Verify the Pull Request** section so you avoid unnecessary churn.
3. In the PR comment box, post a revision request that starts with `@copilot`, because the mention is what routes your instruction back to the agent:

   ```
   @copilot Please change the schedule to weekly instead of daily.
   ```

   > [!IMPORTANT]
   > Comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message. You can also start or continue a session for the PR in the GitHub Copilot app.

4. Wait for the agent response and review the update before you merge so you can confirm the revision solved the right problem.

## Merge and Verify the Pull Request

Merging makes the workflow your source of truth on the default branch. GitHub Actions reads the lock file every time the trigger fires, so both the `.md` and `.lock.yml` files must land on the default branch together. If the lock file is absent or mismatched, the workflow will be unrecognized or fail at runtime. That is why your final verification matters as much as the merge click itself.

Once you are satisfied with the workflow, complete the merge and verify the result:

### ✏️ Exercise: merge the PR and confirm the workflow is live

1. In the browser, click **Merge pull request** and **Confirm merge** so both workflow files land on the default branch together.
2. Open your repository on the default branch and confirm both workflow files appear under `.github/workflows/`, because GitHub Actions reads the merged `.md` and `.lock.yml` from there on the next trigger.
3. Open the **Actions** tab and confirm the workflow appears there by name in the workflow list so you know GitHub recognized the merged lock file.

> [!NOTE]
> Deleting the branch is optional. You can do it from the merged PR page whenever you want.

The workflow is now live on your default branch. GitHub Actions will pick it up on the next scheduled trigger or when you click **Run workflow** in the Actions tab.

---

## ✅ Checkpoint

- [ ] The agent session completed and the pull request is open in your practice repository
- [ ] The PR diff shows both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml`
- [ ] You posted a PR comment with the first 10 lines of `.github/workflows/<name>.lock.yml`
- [ ] You reviewed the task brief and posted a `@copilot` revision comment (or confirmed no changes were needed)
- [ ] You merged the pull request and both workflow files exist on your default branch
- [ ] The workflow appears in the GitHub Actions tab of your practice repository

**Previous:** [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md)
- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
- [Managing issues and pull requests with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
