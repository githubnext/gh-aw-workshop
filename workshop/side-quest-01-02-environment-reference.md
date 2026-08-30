<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Environment Reference

> _Optional: use this quick glossary and visual reference to understand the environments and AI tools used throughout the workshop._

**What you'll learn:** By the end of this page you can name each tool and environment used in the workshop, match it to its role, and know when you'll use it.

## Before You Start

**What you need:** A Codespace already open (from [Step 2](02a-setup-codespace.md)) or access to any terminal where `gh` is installed. You do not need `gh-aw` installed yet.

This is a reference page — come back here any time you encounter an unfamiliar term. No terminal required to read; the terminal commands in the Checkpoint section are optional quick-checks.

## Environment and tool glossary

Knowing which name maps to which role helps you follow workshop instructions without stopping to wonder what "the terminal" or "Codespaces" means in context.

| Term | What it means in this workshop | When you use it | Official documentation |
|------|------|------|------|
| **GitHub Codespaces** | Your cloud development environment when you choose the browser-based setup path. Pre-launched in golden-ticket workshops. | Steps 2–14: writing, compiling, and running workflows | [GitHub Codespaces docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor experience inside Codespaces (and optionally on your local machine). | Editing workflow files and reading output | [Visual Studio Code docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | The shell where you run workshop commands (`gh`, `gh aw`, `git`, and more). | Any step that shows a `bash` code block | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, required for this workshop. Pre-installed in the Codespace. | Starting at Step 6 (install the extension) | [GitHub CLI docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | The GitHub Agentic Workflows extension you install and use in the terminal to compile workflow files. | Step 6 onward | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | Copilot in the terminal for AI-assisted command and development help. The primary AI surface in this workshop. | Any step that shows a `prompt` code block | [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | The GitHub Copilot desktop and web application where you can open repositories, start agent sessions, steer coding tasks, and manage pull requests. | Optional; side quests cover this surface | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic's AI model family available in some GitHub Copilot and agentic workflow contexts. | Steps that use a non-default model | [Claude documentation](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI coding model family that can be used in coding and agent workflows. | Steps that use a non-default model | [OpenAI Codex CLI repository](https://github.com/openai/codex#readme) |

> [!NOTE]
> **GitHub Enterprise (GHES/GHEC) users**: the same tools and commands apply in enterprise environments. Your Codespace URL and GitHub URLs will use your enterprise hostname instead of `github.com`. If your enterprise uses a self-hosted runner, the `gh aw compile` command still runs locally in your Codespace — see [Step 6](06-install-gh-aw.md) for any environment-specific install notes.

### :white_check_mark: Verify your tools are ready

Open a terminal in your Codespace and run:

```bash
gh --version
git --version
```

Both commands should print a version number. If either fails, see [Set Up a Codespace](02a-setup-codespace.md).

> [!NOTE]
> `gh aw --version` only works after you complete [Install the gh-aw CLI Extension](06-install-gh-aw.md). Skip that check until you reach Step 6.

After you complete Step 6, also run:

```bash
gh aw --version
```

## Conceptual screenshots

Recognizing what each environment looks like on screen helps you orient yourself quickly when workshop instructions say "open a terminal" or "use the Copilot app."

These visuals are simplified mental models, not literal product screenshots. Use them to recognize what each name refers to when it appears in later steps.

### Development environments

#### GitHub Codespaces

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg">
  <img alt="Conceptual screenshot of GitHub Codespaces showing a browser-based editor, repository explorer, and integrated terminal" src="images/side-quest-01-02-github-codespaces-light.svg">
</picture>

You use Codespaces when you want a ready-to-go development environment in your browser.

#### Visual Studio Code (VS Code)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg">
  <img alt="Conceptual screenshot of Visual Studio Code showing the Explorer, open editor tabs, and integrated terminal" src="images/side-quest-01-02-vscode-light.svg">
</picture>

You use VS Code to browse files, edit workflows, and keep a terminal open beside your work.

#### Terminal (command line)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg">
  <img alt="Conceptual screenshot of a terminal showing a prompt, commands, and command output" src="images/side-quest-01-02-terminal-light.svg">
</picture>

You use the terminal whenever the workshop asks you to run `gh`, `gh aw`, or `git` commands.

### Workshop tools and model options

#### GitHub CLI (`gh`)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub CLI showing authentication, repository, and workflow commands in a terminal" src="images/side-quest-01-02-gh-cli-light.svg">
</picture>

You use `gh` for GitHub-specific terminal tasks like authentication checks, repository shortcuts, and workflow commands.

#### `gh-aw` CLI extension

<picture>
   <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg">
   <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg">
   <img alt="Conceptual screenshot of the gh-aw CLI extension showing compile commands for an agentic workflow" src="images/side-quest-01-02-gh-aw-light.svg">
</picture>

You use `gh aw` to compile agentic workflow files.

#### GitHub Copilot CLI

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub Copilot CLI showing a terminal prompt alongside AI-assisted command help" src="images/side-quest-01-02-copilot-cli-light.svg">
</picture>

You use GitHub Copilot CLI when you want AI help inside the terminal.

#### GitHub Copilot app

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg">
  <img alt="Conceptual screenshot of the GitHub Copilot app showing a repository session, agent chat, and pull request view" src="images/side-quest-01-02-copilot-app-light.svg">
</picture>

You use the GitHub Copilot app when you want to start and steer repository sessions, manage coding tasks, and review pull requests from a Copilot workspace.

#### Claude

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg">
  <img alt="Conceptual screenshot of a Claude-style workspace showing a prompt, reasoning path, and structured response" src="images/side-quest-01-02-claude-light.svg">
</picture>

You may see Claude as one of the AI model options that can read a brief, reason through a task, and produce an output.

#### OpenAI Codex

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg">
  <img alt="Conceptual screenshot of an OpenAI Codex-style coding workspace showing repository files and a suggested patch" src="images/side-quest-01-02-openai-codex-light.svg">
</picture>

You may see OpenAI Codex as a coding-focused model option that reads files and suggests edits.

## Quick practice: match the tool to the task

Before you check off the checkpoint, try this self-test. For each task below, name the tool you'd use. Answers are in the collapsed section.

| Task | Which tool? |
|------|-------------|
| Open a file and edit it | ? |
| Run `gh aw compile` | ? |
| Trigger a workflow run from the command line | ? |
| Ask AI to explain a bash command | ? |
| Start a Codespace | ? |

<details>
<summary>Show answers</summary>

| Task | Tool |
|------|------|
| Open a file and edit it | VS Code (inside your Codespace) |
| Run `gh aw compile` | Terminal — type `gh aw compile` |
| Trigger a workflow run from the command line | Terminal — `gh workflow run` |
| Ask AI to explain a bash command | GitHub Copilot CLI — `gh copilot explain` |
| Start a Codespace | GitHub.com → your repository → **Code** → **Codespaces** |

</details>

<!-- journey: all -->
## :white_check_mark: Checkpoint

- [ ] You can name each environment and tool used in this workshop and describe its role
- [ ] You ran `gh --version` in your terminal and it returned a version number
- [ ] You ran `git --version` in your terminal and it returned a version number
- [ ] If you've completed [Install the `gh-aw` CLI Extension](06-install-gh-aw.md): you ran `gh aw --version` and it returned a version number
- [ ] You can match each item to its conceptual screenshot
- [ ] You know where to find official docs for each tool
- [ ] (Enterprise users) You know which URLs in workshop instructions map to your enterprise hostname

When you're done here, return to [What You Need Before We Start](01-prerequisites.md).
<!-- /journey -->
