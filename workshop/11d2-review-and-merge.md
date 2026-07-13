# Adventure D (Part 2): Monitor, Review, and Merge

> _Once you have submitted the scenario prompt, you'll monitor the agent session, steer it if needed, review its pull request, and merge your workflow._

**Previous:** [Adventure D (Part 1): Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)

---

## Monitor Your Session

After submitting the prompt, the session shows a live activity feed. You will see the agent working through several phases:

| Phase | What you see |
|---|---|
| **Reading** | The agent fetches the `create.md` reference and reads existing files in your repository |
| **Planning** | The agent decides what frontmatter keys, permissions, and task brief to use |
| **Writing** | The agent creates the workflow `.md` file in `.github/workflows/` |
| **Compiling** | The agent runs `gh aw compile --validate` and fixes any errors it finds |
| **Opening PR** | The agent commits both files and opens a pull request |

The session typically completes in two to five minutes. You can steer it with follow-up prompts if it needs more context or takes the wrong direction. Follow along in the activity feed and expand individual steps to see exactly what the agent wrote, read, or ran — this is a good way to learn the agentic workflow format without writing it yourself.

> [!IMPORTANT]
> - The agent runs `gh aw compile ... --validate` in its session workspace and can install `gh-aw` there if needed.
> - For manual validation or to run `gh aw compile ... --watch` yourself, install `gh-aw` locally or in Codespaces by following [Step 6](06-install-gh-aw.md).
> - Use the GitHub **Actions tab** in [Step 12](12-test-and-iterate.md) to trigger the workflow and inspect its runtime logs.

---

## Review and Merge the Pull Request

When the session ends, open the pull request it created. In the GitHub Copilot app, find it in **My work**. In the Agents tab, use the pull request link in the session.

### What to check in the PR diff

The PR adds two files:

| File | What to verify |
|---|---|
| `.github/workflows/<name>.md` | Frontmatter keys match the scenario; the task brief describes what you want; `safe-outputs` limits write actions |
| `.github/workflows/<name>.lock.yml` | Exists and is non-empty — this is the compiled GitHub Actions YAML that the runner executes |

Look through the workflow Markdown body. The agent should have written a clear task brief based on the prompt you provided. If anything looks wrong — wrong schedule, missing permission, overly broad task brief — ask the agent to revise it:

- **GitHub Copilot app:** start or continue a session for the pull request and describe the change.
- **Agents tab:** leave a review comment that starts with `@copilot`, for example:

```
@copilot Please change the schedule to weekly instead of daily.
```

> [!IMPORTANT]
> In the browser PR flow, comments directed at the Copilot agent **must** begin with `@copilot`. Without it, the agent will not see or act on your message.

The agent will push an updated commit to the same branch.

### Merge the pull request

Once you are satisfied with the workflow:

1. In the browser, click **Merge pull request** and **Confirm merge**. In the GitHub Copilot app, merge from the pull request view or enable [**agent merge**](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests#merging-a-pull-request), which asks the agent to fix blockers and merge after required reviews and checks pass.
2. Confirm that the pull request is merged.
3. Delete the branch (optional but recommended).

The workflow is now live on your default branch. GitHub Actions will pick it up on the next scheduled trigger or when you click **Run workflow** in the Actions tab.

---

## What Was Added

After merging, your repository contains:

| File | Purpose |
|---|---|
| `.github/workflows/<name>.md` | The Markdown task brief — the human-readable workflow definition the agent and you can edit |
| `.github/workflows/<name>.lock.yml` | The compiled GitHub Actions YAML — generated automatically, do not edit by hand |

You can continue iterating through a GitHub Copilot app or Agents-tab session and let the agent handle edits and recompilation. If you want a persistent validation loop or direct CLI control, follow [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md) and use `gh aw compile --watch` in a local or Codespaces terminal.

---

## ✅ Checkpoint

- [ ] The agent session completed and the activity feed shows all five phases (Reading, Planning, Writing, Compiling, Opening PR)
- [ ] You opened the pull request and confirmed both `.github/workflows/<name>.md` and `.github/workflows/<name>.lock.yml` are present in the diff
- [ ] You reviewed the workflow task brief and used `@copilot` feedback (or an app session) to correct anything that looked wrong before merging
- [ ] You merged the pull request into your default branch
- [ ] Both workflow files exist in your repository after merging
- [ ] The workflow is visible in the GitHub Actions tab

**Previous:** [Adventure D (Part 1): Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
- [Managing issues and pull requests with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
