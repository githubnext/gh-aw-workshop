---
journey: copilot
adventure: scenario-d
---
# Adventure D (Part 2): Monitor, Review, and Merge

> _Once the agent session ends, you'll review its pull request, ask for any revisions, and merge your workflow._

## 📋 Before You Start

- **Step 11d complete** — you have submitted the scenario prompt in [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
- **Agent session running or finished** — the session you started is in progress or has completed
- **Practice repository open** — your practice repository is open in the browser

---

## Monitor Your Session

After you submit the prompt, watch the activity feed until the session finishes — most sessions complete in two to five minutes. In the GitHub Copilot app, open **My work**, select your active session, and wait for it to reach a completed state. Once it finishes, open the pull request link and keep the pull request open in a browser tab for the exercises below. For a detailed walkthrough of each agent phase, see [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md).

---

## Review the Pull Request

When the session ends, locate the pull request using the method that matches where you started the session. In the **GitHub Copilot app**, open **My work**, select your session, and click its pull request link. In the **Agents tab**, open the session timeline and click the link there. Alternatively, from a **Terminal or Codespace**, run `gh pr list --state open` to find the PR number.

> [!NOTE]
> <details>
> <summary>Why does the PR need two workflow files?</summary>
>
> The PR must include both the task brief (`.md`) and the compiled lock file (`.lock.yml`). GitHub Actions executes the lock file — not the Markdown brief. An empty lock file means the workflow did not compile correctly and will not run.
>
> </details>

### ✏️ Exercise: confirm both files are present and validate the lock file

Open the **Files changed** tab and verify that both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml` appear in the diff. Then expand the lock file entry, scroll through it to confirm it is not empty, and post a PR comment that pastes the first 10 lines of the lock file in a fenced code block.

### ✏️ Exercise: request a revision with `@copilot`

Read `.github/workflows/<name>.md` in the diff and decide whether the workflow needs any changes — if it looks good, skip ahead to **Merge the Pull Request**. To request a revision, post a comment that begins with `@copilot` and describes what you want changed, for example:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> Comments directed at Copilot **must** begin with `@copilot`. Without the mention, the agent will not see your message.

After posting, wait for the agent to respond and review the updated file before merging.

---

## Merge the Pull Request

Once you are satisfied with the workflow, merge the pull request. Both the task brief and the compiled lock file must land on the default branch together — GitHub Actions reads the lock file on every trigger, so both files must be present for the workflow to run correctly. In the browser, click **Merge pull request** and then **Confirm merge**, or merge from the terminal using the command below (include `--delete-branch` if you want to remove the feature branch at the same time):

```bash
gh pr merge <pr-number> --merge --delete-branch
```

After merging, open your repository on the default branch and confirm both files appear under `.github/workflows/`. Then open the **Actions** tab and verify that your workflow appears by name — it is now live and GitHub Actions will pick it up on the next [scheduled](https://github.github.com/gh-aw/reference/triggers/#scheduled-triggers-schedule) trigger or when you click **Run workflow**.

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
