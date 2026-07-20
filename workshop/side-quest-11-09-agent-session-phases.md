<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Agent Session Phases Explained

> _Optional: take this detour for a full breakdown of what happens inside the agent session, then return to [Adventure D (Part 2): Monitor, Review, and Merge](11d2-review-and-merge.md)._

## 📋 Before You Start

- You've started [Adventure D: Build Any Workflow with GitHub Copilot](11d-build-copilot-agents.md) (or another Step 11 path) and have an active or recently completed agent session.
- You have [`gh aw` installed and authenticated](06-install-gh-aw.md) — completed in Step 6.
- You understand the purpose of [agentic workflows](https://github.github.com/gh-aw/introduction/overview/) from [What Are Agentic Workflows?](05-agentic-workflows-intro.md).

## 🎯 What You'll Learn

You'll learn what each phase of the agent session does, what to look for in the activity feed, and how to steer the session if it takes the wrong direction.

## The Five Phases

After you submit the scenario prompt, the session shows a live activity feed. The agent works through five phases:

| Phase | What you see | What to look for |
|---|---|---|
| **Reading** | The agent fetches the `create.md` reference and reads existing files in your repository | Confirm the agent fetched the reference guide and found your repository files |
| **Planning** | The agent decides what frontmatter keys, permissions, and task brief to use | The planning output should reflect your intended scenario |
| **Writing** | The agent creates the workflow `.md` file in `.github/workflows/` | The file should contain a YAML frontmatter block between `---` fences and a Markdown task brief |
| **Compiling** | The agent runs `gh aw compile --validate` and fixes any errors it finds | A green success message indicates the `.lock.yml` was generated without errors |
| **Opening PR** | The agent commits both files and opens a pull request | The pull request should list two changed files: the `.md` source and the `.lock.yml` |

> 🤔 **Predict:** Before you open the activity feed on your next run, guess which phase will take the longest. Then expand the individual steps to check — was it the Planning phase (deciding frontmatter), the Writing phase (generating the file), or the Compiling phase (fixing errors)?

## Steering the Session

The session typically completes in two to five minutes. If the agent takes the wrong direction, you can steer it with follow-up prompts. For example:

- If the agent is building the wrong scenario: _"Stop — I want Scenario A (daily status report), not Scenario B."_
- If the agent skips compilation: _"Please compile the workflow with `gh aw compile --validate` before opening the pull request."_
- If the agent opens a PR before the lock file is present: _"The lock file is missing. Please run `gh aw compile --validate` and add the generated `.lock.yml` to the pull request."_

## Expanding Activity Feed Steps

Expand individual steps in the activity feed to see exactly what the agent wrote, read, or ran. This is a good way to learn the agentic workflow format without writing it yourself. Look for:

- The full contents of the `.md` file the agent wrote
- The `gh aw compile` command it ran and any errors it fixed
- The commit message and branch name it used

## Advanced: Agent Merge

The GitHub Copilot app supports [**agent merge**](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests#merging-a-pull-request): enable it from the pull request view and the agent will fix any blockers and merge after required reviews and checks pass. This is an optional shortcut — you can always merge manually in the browser.

## Advanced: Continuous Compilation with `--watch`

If you want a live compile feedback loop while editing a workflow by hand, install the `gh-aw` CLI (see [Step 6](06-install-gh-aw.md)) and run:

```bash
gh aw compile --watch
```

Each save triggers another compile, so you get immediate feedback instead of discovering YAML mistakes later. See [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md) for a full walkthrough.

## ✅ Checkpoint

- [ ] I can name the five phases of an agent session in order
- [ ] I know what a successful Compiling phase looks like (green success message, `.lock.yml` generated)
- [ ] I know how to steer the session if it takes the wrong direction
- [ ] I can expand individual steps in the activity feed to inspect what the agent did

---

<!-- journey: all -->
Return to [Adventure D (Part 2): Monitor, Review, and Merge](11d2-review-and-merge.md).
<!-- /journey -->


