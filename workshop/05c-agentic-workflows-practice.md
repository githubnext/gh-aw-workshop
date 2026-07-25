<!-- page-journey: all -->
<!-- page-adventure: core -->
# Practice: Recognize Agentic Workflows

## 📋 Before You Start

- You've read [What Are Agentic Workflows?](05-agentic-workflows-intro.md)

These exercises help you apply what you just learned — deciding when to use an agentic workflow and drafting your first task brief.

## The classification rule in brief

Use this table to decide before you look at each answer:

| If the task… | Use |
|---|---|
| Runs the same fixed steps every time — no reading, no judgment, deterministic output | **Standard Actions workflow** |
| Reads live data, applies judgment to decide what matters, and produces output that varies each run | **Agentic workflow** |

The two signals to check first: **Does the task require judgment?** and **Can you predict the exact output before the run starts?** If judgment is required or output cannot be predetermined, it is agentic.

## Try it: agentic or standard?

For each task below, decide whether it calls for an **agentic workflow** or a **standard Actions workflow**, then reveal the answer.

**Task A:** Run lint and unit tests on every pull request, fail if any check exits non-zero.

- [ ] I've made my decision for Task A

<details>
<summary>Reveal Task A answer</summary>

**Standard Actions workflow.** Every run follows the same fixed steps: run lint, run tests, report the exit code. No judgment is required.

**If you chose agentic:** re-read the table above — can you predict the exact output (pass or fail) before the run? Yes, because the output depends only on fixed commands and exit codes, not on reading and reasoning about live data. Use the table's "judgment required" row as your primary signal.

</details>

**Task B:** Each morning, read all open issues, decide which ones look most urgent, and post a short triage summary.

- [ ] I've made my decision for Task B

<details>
<summary>Reveal Task B answer</summary>

**Agentic workflow.** The agent reads live issue data, applies judgment to assess urgency, and composes a summary that differs every run based on what it finds.

**If you chose standard:** the phrase "decide which ones look most urgent" is the signal — deciding requires reading real data and applying judgment, which cannot be encoded as a deterministic script.

</details>

> [!TIP]
> Want to go deeper? [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) covers more exercises, example output, the two-file structure, and concept checks.

## Try it: write a one-sentence task brief

Pick any routine task you do today that involves reading some data and writing a summary — a daily standup note, a weekly inbox digest, or a triage of support tickets. Write a one-sentence task brief for an agent to do it automatically.

Your brief should answer all three of these: *what data should the agent read (data source), what should it post when it's done (output format), and when or how often should it run (cadence)?*

Example:

```
Each Monday morning, read all pull requests opened in the past week,
identify the three with the most review comments, and post a summary
as an issue with the title "Weekly PR Digest".
```

- [ ] I've drafted a task brief for a real routine task
- [ ] My brief specifies what data the agent should read (data source)
- [ ] My brief specifies what the agent should post when done (output format)
- [ ] My brief specifies when or how often the agent should run (cadence)

> [!TIP]
> Struggling to think of a task? Browse the [gh-aw issue-ops pattern](https://github.github.com/gh-aw/patterns/issue-ops/) for inspiration. You will write a real version of your brief in Step 7. **Still unsure?** Pause here and work through [Side Quest: Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md). It gives you more classification practice, a vocabulary check, and a sample `.md` / `.lock.yml` pair before you continue to Step 6.

## ✅ Checkpoint

- [ ] I can decide whether a task calls for an agentic or a standard Actions workflow
- [ ] I have drafted a task brief that covers all three criteria: data source, output format, and cadence
- [ ] I can describe the three parts of an agentic workflow: [trigger](https://github.github.com/gh-aw/reference/triggers/) → agent → safe output

<!-- journey: all -->
**Next:** [Install the gh-aw CLI Extension](06-install-gh-aw.md)
<!-- /journey -->
