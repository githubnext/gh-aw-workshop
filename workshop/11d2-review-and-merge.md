# Adventure D (Part 2): Monitor, Review, and Merge

> _Once the agent session ends, you'll review its pull request, ask for any revisions, and merge your workflow._

## 📋 Before You Start

- **Step 11d complete** — you have submitted the scenario prompt in [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
- **Agent session running or finished** — the session you started is in progress or has completed
- **Practice repository open** — your practice repository is open in the browser so you can view the pull request

---

## Monitor Your Session

After submitting the prompt, watch the activity feed. The session typically completes in two to five minutes. You can steer it with follow-up prompts if it needs more context or takes the wrong direction.

### ✏️ Exercise: monitor progress and open the PR

1. In the GitHub Copilot app, open your active session in **My work**.
2. Wait for the session to finish, then open the pull request link from the session.
3. Keep the pull request open in a browser tab for the next exercises.

> [!TIP]
> Want a detailed walkthrough of each agent phase? See [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md).

---

## Review the Pull Request

When the session ends, open the pull request it created. In the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app), find it in **My work**. In the Agents tab, use the pull request link in the session.

### ✏️ Exercise: inspect the diff and validate the lock file

1. Open the pull request the agent created.
2. In the **Files changed** tab, confirm the PR includes both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml`.
3. Open `.github/workflows/<name>.lock.yml` in the diff and confirm it is not empty.
4. Add a PR comment that pastes the first 10 lines of `.github/workflows/<name>.lock.yml` in a fenced code block.

### ✏️ Exercise: request a revision with `@copilot`

1. Read `.github/workflows/<name>.md` and decide on one change you want.
2. In the PR comment box, post a revision request that starts with `@copilot`:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> Comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message. You can also start or continue a session for the PR in the GitHub Copilot app.

1. Wait for the agent response. If everything already looks correct, skip this exercise and proceed to merge.

## Merge the Pull Request

Once you are satisfied with the workflow:

1. In the browser, click **Merge pull request** and **Confirm merge**.
2. Confirm that both workflow files are on your default branch.

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
