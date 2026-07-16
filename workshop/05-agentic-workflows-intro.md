# Step 5: What Are Agentic Workflows?

**Already familiar with both GitHub Actions and AI agent execution environments?**

Before skipping, confirm you already know both of these:

- You can describe what an Actions workflow [trigger](https://github.github.com/gh-aw/reference/triggers/) does
- You have worked with AI agent execution environments in a production or CI/CD context

If both apply, [Skip to Step 6: Install gh-aw](06-install-gh-aw.md).

## 📋 Before You Start

- You've completed [Step 3: Create Your Practice Repository](03-create-your-repo.md)
- You've read [Step 4: What Are GitHub Actions?](04-github-actions-intro.md)

An [**agentic workflow**](https://github.github.com/gh-aw/introduction/overview/) is a plain-English task brief that an AI agent executes inside GitHub Actions. You write what you want — "summarize open issues and post a daily digest" — and the agent reads your repo, calls tools, reasons about the results, and posts the output automatically. The frontmatter is fully Actions-compatible — triggers, permissions, and runners all apply.

![Animated GitHub Actions run showing four security jobs: activation validates the agent is authorized to run, agent runs with sandbox, firewall, and integrity filter enabled, detection scans for malicious code, and safe-outputs applies changes within guardrails](images/05-agent-run-log.svg)

## Three things to know

![Agentic workflow lifecycle: a Markdown file with YAML frontmatter and a task brief is compiled by gh aw compile into a lock.yml file, which GitHub Actions triggers, runs the AI agent that reads repository data and calls tools, and produces a structured output posted back to GitHub](images/05-workflow-lifecycle.svg)

- **What it is:** A Markdown file (`.md`) with YAML frontmatter and a plain-language brief. `gh aw compile` converts it into a standard Actions workflow (`.lock.yml`) that runs the agent.
- **What it produces:** A synthesized report or action the agent composes from live repository data — different every run based on what it finds.
- **Why it exists:** Classic Actions handles deterministic CI/CD. Agentic workflows fill the gap for tasks that need judgment — or you can mix both in a single hybrid workflow.

If you already trust GitHub Actions, the trust model stays the same here. The opening animation in this step shows the same permissions, firewall controls, and isolated execution environment that agentic workflows use in the standard GitHub Actions sandbox. You are not creating a new trust boundary.

## Classify these tasks

For each task below: classify it as **agentic workflow** or **standard Actions workflow**, check the box, then reveal the answer before the next task:

**Task A:** Run unit tests on every pull request, fail if any test exits non-zero, and upload coverage.

- [ ] I have classified Task A

<details>
<summary>Check Task A answer</summary>

**Task A — Standard Actions workflow:** every run follows the same fixed steps: start the test job, fail on a non-zero exit code, and upload the coverage artifact. No judgment required.

</details>

**Task B:** Review newly opened issues each morning, group them by theme, flag the urgent ones, and post a short triage summary.

- [ ] I have classified Task B

<details>
<summary>Check Task B answer</summary>

**Task B — Agentic workflow:** the agent has to inspect live repo context, group similar issues, and decide what looks urgent before it writes the summary.

</details>

> [!IMPORTANT]
> On GHEC, GHES, or EMU, the **Actions** tab may be restricted by organization policy. If it is, complete [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) first.

## Reflection

Before you check the reflection item in the checkpoint below, write one sentence describing what you would want _your_ agentic workflow to do. Put it wherever you keep workshop notes: your editor, a scratch file, or a notes app. Example: summarize new issues and flag urgent ones. Focus on a task that needs judgment, not a test or deploy script. You'll use this idea in Step 7.

## What the agent decided

A scheduled agentic workflow generates a report like this:

```markdown
## Daily Repository Status — July 12

- ✅ CI health: 18 workflows succeeded, 1 failed (`docs-link-check`)
- 🔄 Pull requests: 7 open (2 need review, 1 stale > 14 days)
- 🐛 Issues: 4 new, 3 closed, 2 high-priority still open
- 🚀 Releases: No new tags in the last 24 hours

### Recommended next actions
1. Re-run `docs-link-check` and update broken external URLs.
2. Review PR #412 and PR #415 before noon.
3. Triage high-priority issue #398 with the platform team.
```

**Your turn:** Answer in your own words — _what did the agent decide on its own?_ Identify at least two lines where the agent made a judgment call rather than just reading a number.

## The two files

An agentic workflow has two files. Here is the `.md` source you write:

```markdown
---
on:
  schedule: daily
permissions:
  issues: read
---

Review all open issues, summarize the key themes, and post a short digest as a new issue.
```

> [!NOTE]
> `schedule: daily` is fuzzy shorthand that `gh aw compile` converts into a standard Actions cron expression. You never write raw cron syntax in an agentic workflow `.md` file.

And here is the `.lock.yml` `gh aw compile` generates — what GitHub Actions actually runs:

```yaml
# Auto-generated by gh aw compile. Do not edit by hand.
name: Review open issues
on:
  schedule:
    - cron: "0 8 * * *"
permissions:
  issues: read
```

Both files live in `.github/workflows/`. Look at them and answer: which part of the `.md` is the **task brief**, and which part tells GitHub Actions when to run?

## Classify more tasks

**Task C:** Each Friday, scan all open issues and pull requests, summarize recent activity by contributor, and post a weekly team progress digest.

- [ ] I have classified Task C

<details>
<summary>Check Task C answer</summary>

**Task C — Agentic workflow:** the agent has to read contributor activity across issues and pull requests, decide what counts as meaningful progress, and compose a digest that differs every week.

</details>

**Task D:** On every pull request, run ESLint (fail on errors), then have an AI read the diff and post a summary comment.

- [ ] I have classified Task D

<details>
<summary>Check Task D answer</summary>

**Task D — Agentic (hybrid) workflow:** ESLint is deterministic — same result every run. The AI summary requires judgment: reading the diff and deciding how to describe the change. Combining fixed and AI steps makes a workflow agentic.

- [ ] The ESLint step produces the same pass-or-fail result every run
- [ ] The AI step produces different output based on what it reads in the diff
- [ ] A workflow mixing deterministic and AI steps is still agentic overall

</details>

## Self-check

What makes a workflow agentic rather than standard? Write your answer in your notes.

- [ ] I wrote my self-check answer in my notes

<details>
<summary>Show model answer</summary>

A workflow is agentic when an AI agent makes judgment calls — reading context, deciding what matters, and producing output that differs each run. Standard workflows follow fixed steps.

Does your answer include:
- [ ] AI making judgment calls on live context
- [ ] Output that varies each run
- [ ] Contrast with standard fixed-step workflows

</details>

> [!TIP]
> If this still feels fuzzy, Step 7 makes the distinction concrete. Return here after Step 7.

## ✅ Checkpoint

- [ ] I described what an agentic workflow is in one sentence
- [ ] I understand that agentic workflows use the same trust model as GitHub Actions
- [ ] I classified all four tasks and verified my reasoning in the reveal
- [ ] I can explain why Task D is agentic despite its deterministic ESLint step
- [ ] I answered the self-check and compared my answer to the model
- [ ] I wrote one sentence describing what I want my own agentic workflow to do
- [ ] I recorded my workflow idea in my workshop notes
- [ ] My workflow idea needs judgment, not a fixed script
- [ ] I identified at least two agent judgment calls in the sample daily-status report
- [ ] I can point to the task brief and the trigger in the sample `.md` file
- [ ] I can describe the difference between the `.md` source file and the compiled `.lock.yml`

**Next:** [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [How Agentic Workflows Work](https://github.github.com/gh-aw/introduction/how-they-work/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Compilation Process](https://github.github.com/gh-aw/reference/compilation-process/)
- [Schedule Syntax](https://github.github.com/gh-aw/reference/schedule-syntax/)
