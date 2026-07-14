# Adventure D (Part 2): Monitor, Review, and Merge

> _Once the agent session ends, you'll review its pull request, ask for any revisions, and merge your workflow._

## 📋 Before You Start

- **Step 11d complete** — you have submitted the scenario prompt in [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
- **Agent session running or finished** — the session you started is in progress or has completed
- **Practice repository open** — your practice repository is open in the browser so you can view the pull request

---

## Monitor Your Session

After submitting the prompt, watch the activity feed. The agent works through five phases: **Reading** → **Planning** → **Writing** → **Compiling** → **Opening PR**. The session typically completes in two to five minutes. You can steer it with follow-up prompts if it needs more context or takes the wrong direction.

> [!TIP]
> For a full breakdown of each phase, what to look for, and how to steer the session, see [Side Quest: Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md).

---

## Review and Merge the Pull Request

When the session ends, open the pull request it created. In the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app), find it in **My work**. In the Agents tab, use the pull request link in the session.

### What to check in the PR diff

The PR adds two files:

| File | What to verify |
|---|---|
| `.github/workflows/<name>.md` | Frontmatter keys match the scenario; the task brief describes what you want; `safe-outputs` limits write actions |
| `.github/workflows/<name>.lock.yml` | Exists and is non-empty — this is the compiled GitHub Actions YAML that the runner executes |

### ✏️ Exercise: inspect the diff and request a revision

1. Open the pull request the agent created.
2. In the **Files changed** tab, click `.github/workflows/<name>.lock.yml` and confirm the file is non-empty — you are looking at the compiled YAML the runner will execute.
3. Read the task brief in `.github/workflows/<name>.md`. Check that the schedule, permission scope, and `safe-outputs` action match your intended scenario.
4. If anything looks wrong, post a revision request in the PR comment box. Start the comment with `@copilot`:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> Comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message. You can also start or continue a session for the PR in the GitHub Copilot app.

The agent will push an updated commit to the same branch. If everything looks correct, skip step 4 and proceed to merge.

### Merge the pull request

Once you are satisfied with the workflow:

1. In the browser, click **Merge pull request** and **Confirm merge**.
2. Confirm that both workflow files are on your default branch.
3. Delete the branch (optional but recommended).

The workflow is now live on your default branch. GitHub Actions will pick it up on the next scheduled trigger or when you click **Run workflow** in the Actions tab.

---

## What Was Added

After merging, your repository contains:

| File | Purpose |
|---|---|
| `.github/workflows/<name>.md` | The Markdown task brief — the human-readable workflow definition you and the agent can edit |
| `.github/workflows/<name>.lock.yml` | The compiled GitHub Actions YAML — generated automatically, do not edit by hand |

You can continue iterating through a GitHub Copilot app or Agents-tab session and let the agent handle edits and recompilation.

---

## ✅ Checkpoint

- [ ] The agent session completed and the pull request is open in your practice repository
- [ ] The PR diff shows both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml`
- [ ] You opened `.github/workflows/<name>.lock.yml` in the PR diff and confirmed it is non-empty
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
