# Step 7a: Write Your First Agentic Workflow — Terminal Path

_Writing your first workflow is the moment theory becomes practice — let's make something real._

Want to work without a terminal? Switch to the [GitHub UI path](07b-your-first-workflow-ui.md).

## 🎯 What You'll Do

You'll create the first version of `.github/workflows/hello-agent.md` with just two frontmatter fields:

- `name` (workflow label)
- `on.workflow_dispatch` (manual trigger)

Then you'll run your first compile check.

## 📋 Before You Start

- Completed [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md)
- The `gh aw` command works in your terminal
- Your practice repository is open (from [Step 3](03-create-your-repo.md))

## Steps

### Create the workflows directory

```bash
mkdir -p .github/workflows
```

### Create your first workflow file

```bash
touch .github/workflows/hello-agent.md
```

Open `.github/workflows/hello-agent.md` in your editor.

<details>
<summary>Using VS Code? Quick setup for cleaner YAML editing</summary>

- Install the [YAML extension for VS Code](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
- Set `editor.tabSize` to `2`
- Enable `editor.formatOnSave`

</details>

> [!IMPORTANT]
> This `.md` file is your agent task brief. GitHub Actions runs the compiled `.lock.yml` file created by `gh aw compile`.

### Add the starter frontmatter

Paste this at the top of the file:

```yaml
---
name: Hello Agent
on:
  workflow_dispatch:
---
```

- `name` is what you see in the Actions UI.
- `workflow_dispatch` means you can run it manually while testing.

<details>
<summary>Terminal tip (VS Code + Copilot)</summary>

In VS Code, open the integrated terminal with ``Ctrl+` `` (macOS: ``Cmd+` ``) and run `gh aw` commands there.

If you're unsure about a command, you can ask:

```bash
gh copilot suggest "how do I install a gh extension"
```

</details>

### Run your first compile check

```bash
gh aw compile .github/workflows/hello-agent.md --validate
```

Expected result:

```text
✔ hello-agent.md — valid
```

If you hit an error, use [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

Continue to [Part 2: Add instructions, safe outputs, and finish](07a-part2-your-first-workflow-instructions.md).

## Checkpoint

- [ ] `.github/workflows/hello-agent.md` exists
- [ ] The file starts with valid frontmatter fences (`---` ... `---`)
- [ ] The frontmatter includes `name` and `on.workflow_dispatch`
- [ ] `gh aw compile .github/workflows/hello-agent.md --validate` reports valid
- [ ] I'm ready to continue to [Part 2](07a-part2-your-first-workflow-instructions.md)
