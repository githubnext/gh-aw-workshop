<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Using the `/agentic-workflows` Skill in Copilot

> _Optional: use this guide any time you want Copilot to create, update, debug, or upgrade your agentic workflows instead of editing them by hand._

## 🎯 What You'll Do

You'll learn what the `/agentic-workflows` Copilot skill is, how `gh aw init` installed it for you, and how to invoke it for the most common workflow tasks — creating, designing, debugging, updating, and upgrading agentic workflows.

## 📋 Before You Start

- You have run `gh aw init` and pushed `.github/skills/agentic-workflows/SKILL.md` to your practice repository (covered in [Install the gh-aw CLI Extension](06-install-gh-aw.md) or [Write Your First Agentic Workflow](07-your-first-workflow.md)).
- You have an active GitHub Copilot plan and can open your practice repository in the [GitHub Copilot app](side-quest-01-02-environment-reference.md#github-copilot-app) or Agents tab.

---

## Understand what the skill does

When you ran `gh aw init`, it created `.github/skills/agentic-workflows/SKILL.md` in your practice repository. That file is a **Copilot skill definition**: it tells Copilot exactly how to handle agentic workflow requests by routing them to the right upstream prompts from the `gh-aw` documentation.

The skill is a dispatcher. When you type `/agentic-workflows` in a Copilot chat, Copilot reads the skill file, identifies what you want to do (create, design, debug, update, or upgrade), loads the matching upstream prompt, and follows it. You get a purpose-built expert for agentic workflows without leaving the chat.

> [!TIP]
> The skill also checks for a `.github/aw/instructions.md` file in your repository. If that file exists, the skill loads it after the matched prompt so any repository-level conventions take precedence.

---

## Invoke the skill

In any Copilot chat that is connected to your practice repository, prefix your request with `/agentic-workflows`:

```text
/agentic-workflows <your request here>
```

Copilot reads the skill file, picks the right upstream prompt, and handles the rest. You do not need to know which internal prompt file maps to which task — the skill dispatches automatically based on what you ask for.

---

## Common tasks

### Create a new workflow

Use this when you have a brief in mind and want Copilot to write the `.md` workflow file and compile the `.lock.yml`:

```text
/agentic-workflows Create a workflow named "PR Review Digest" that runs on
pull_request (opened, synchronize) and posts a one-paragraph summary of
changed files as a pull request comment. Use contents: read,
pull-requests: write, and copilot-requests: write.
Run gh aw compile, fix any errors, commit both files, and open a pull request.
```

> [!TIP]
> Ask the agent to run `gh aw compile` and fix errors before committing. The skill knows the compile step, so you only need to ask once.

### Design a workflow from scratch (interview mode)

Use this when you are not sure yet what the workflow should do. The skill starts an interview to help you define the scenario, inputs, outputs, and guardrails before writing any code:

```text
/agentic-workflows Help me design a new agentic workflow. I want something
that monitors my repository but I haven't decided the details yet.
```

Answer the agent's questions about trigger, output surface, data sources, and permissions. Once the design is agreed, ask the agent to create the files.

### Debug a failing workflow

Use this when a run has produced unexpected output or an error. Paste the relevant section of the Actions log or your workflow file:

```text
/agentic-workflows Here is my workflow and the Actions log from a failing run.
The agent posted no output even though there were open issues.
What is wrong and how do I fix it?

<paste workflow file or log snippet>
```

The skill understands [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) rules, [safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/) constraints, and common failure patterns — so it can suggest the right fix rather than a generic answer.

### Update an existing workflow

Use this when you want to change a trigger, add a permission, or rewrite a task brief without breaking the rest of the file:

```text
/agentic-workflows Update .github/workflows/daily-status.md to also run on
workflow_dispatch so I can trigger it manually. Keep everything else the same,
recompile, and commit both files.
```

> [!TIP]
> Letting the agent compile and commit both the `.md` and the `.lock.yml` together prevents a stale lock file.

### Upgrade to fix deprecations

Use this when `gh aw compile --validate` warns that your workflow uses deprecated syntax:

```text
/agentic-workflows My workflow uses deprecated syntax. Here is the compile
output. Upgrade the workflow to the current syntax, recompile, and commit.

<paste compile output>
```

The skill loads the upgrade prompt, identifies the exact fields to change, and validates the result.

---

## What the skill is not

The `/agentic-workflows` skill is a prompt router — it does not run your workflow for you or have access to your Actions logs unless you paste them in. For live run logs, open the **Actions** tab, copy the relevant lines, and paste them into the chat with your `/agentic-workflows` request.

---

## ✅ Checkpoint

- [ ] You understand that `gh aw init` created `.github/skills/agentic-workflows/SKILL.md` in your repository
- [ ] You know how to invoke the skill with `/agentic-workflows <request>` in Copilot Chat
- [ ] You can name at least three tasks the skill can handle (create, debug, update, upgrade, design)
- [ ] You tried at least one `/agentic-workflows` request in your practice repository

---

<!-- journey: all -->
Return to [Write Your First Agentic Workflow](07-your-first-workflow.md) or continue to the next step in your journey.
<!-- /journey -->
