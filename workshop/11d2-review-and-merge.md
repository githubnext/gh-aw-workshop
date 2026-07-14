# Adventure D (Part 2): Monitor, Review, and Merge

> _Once the agent session ends, you'll review its pull request, ask for any revisions, and merge your workflow._

## 📋 Before You Start

- **Step 11d complete** — you have submitted the scenario prompt in [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
- **Agent session running or finished** — the session you started is in progress or has completed
- **Practice repository open** — your practice repository is open in the browser

---

## Monitor Your Session

After you submit the prompt, watch the activity feed until the session finishes. Most sessions complete in two to five minutes.

### ✏️ Exercise: monitor progress and open the PR

1. In the GitHub Copilot app, open your active session in **My work**.
2. Wait for the session to finish.
3. Open the pull request link from the session.
4. Keep the pull request open in a browser tab for the exercises below.

> [!TIP]
> Want a walkthrough of each agent phase? See [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md).

---

## Review the Pull Request

When the session ends, locate the pull request. Choose the method that matches where you started the session:

- **GitHub Copilot app:** Open **My work**, select your session, and click its pull request link.
- **Agents tab:** Open the session timeline and click the pull request link there.
- **Terminal or Codespace:** Run this command to list open pull requests:

  ```bash
  gh pr list --state open
  ```

> [!NOTE]
> <details>
> <summary>Why does the PR need two workflow files?</summary>
>
> The PR must include both the task brief (`.md`) and the compiled lock file (`.lock.yml`). GitHub Actions executes the lock file — not the Markdown brief. An empty lock file means the workflow did not compile correctly and will not run.
>
> </details>

### ✏️ Exercise: confirm both files are present

1. Open the **Files changed** tab of the pull request.
2. Confirm `.github/workflows/<name>.md` appears in the diff.
3. Confirm `.github/workflows/<name>.lock.yml` also appears in the diff.

### ✏️ Exercise: validate the lock file

1. Click `.github/workflows/<name>.lock.yml` to expand it in the diff.
2. Scroll through the file to confirm it is not empty.
3. Add a PR comment that pastes the first 10 lines of the lock file in a fenced code block.

### ✏️ Exercise: request a revision with `@copilot`

1. Read `.github/workflows/<name>.md` in the diff.
2. Decide whether you want any changes. If not, skip to **Merge the Pull Request**.
3. Post a revision request starting with `@copilot`:

   ```
   @copilot Please change the schedule to weekly instead of daily.
   ```

   > [!IMPORTANT]
   > Comments directed at Copilot **must** begin with `@copilot`. Without the mention, the agent will not see your message.

4. Wait for the agent to respond. Review the updated file before merging.

---

## Merge the Pull Request

Once you are satisfied with the workflow, merge the pull request and confirm the result.

> [!NOTE]
> <details>
> <summary>Why do both files need to land on the default branch together?</summary>
>
> GitHub Actions reads the lock file on every trigger. If the lock file is missing or mismatched, the workflow will fail at runtime. Merging both files together ensures the workflow is immediately usable.
>
> </details>

### ✏️ Exercise: merge the PR and confirm the workflow is live

1. In the browser, click **Merge pull request** and then **Confirm merge**.
2. Alternatively, merge from the terminal:

   ```bash
   gh pr merge <pr-number> --merge --delete-branch
   ```

3. Open your repository on the default branch. Confirm both files appear under `.github/workflows/`.
4. Open the **Actions** tab. Confirm your workflow appears by name in the list.

> [!NOTE]
> Deleting the merged branch is optional. Use the merged PR page or pass `--delete-branch` in the command above.

The workflow is now live. GitHub Actions picks it up on the next scheduled trigger or when you click **Run workflow**.

---

## ✅ Checkpoint

- [ ] The agent session completed and the pull request is open in your practice repository
- [ ] The PR diff shows both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml`
- [ ] The lock file is not empty — you confirmed it contains valid YAML
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
