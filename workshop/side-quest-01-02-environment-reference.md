<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Environment Reference

> _Optional: use this quick glossary and visual reference to understand the environments and AI tools used throughout the workshop._

**What you'll learn:** By the end of this page you can name each tool and environment used in the workshop, match it to its role, and know when you'll use it.

## :clipboard: Before You Start

This is a reference page — you can read it any time. Come back here whenever the workshop uses a term you want to clarify. No terminal required to read this page.

When you're ready to verify your tools are working, see the [Checkpoint](#white_check_mark-checkpoint) section at the bottom.

## Environment and tool glossary

| Term | What it means in this workshop | When you use it | Official documentation |
|------|------|------|------|
| **GitHub Codespaces** | Your cloud development environment for the browser-based setup path. | Steps 2–14: writing, compiling, and running workflows | [GitHub Codespaces docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor experience inside Codespaces. | Editing workflow files and reading output | [Visual Studio Code docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | Where you run workshop commands (`gh`, `gh aw`, `git`). | Any step that shows a `bash` code block | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, pre-installed in the Codespace. | Starting at Step 6 (install the extension) | [GitHub CLI docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | The Agentic Workflows extension that compiles workflow files. | Step 6 onward | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | The primary AI surface in this workshop, used in the terminal. | Any step that shows a `prompt` code block | [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | Desktop/web app for repository sessions and pull requests. | Optional; side quests cover this surface | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic's AI model family, an alternate model option. | Steps that use a non-default model | [Claude documentation](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI's coding model family, an alternate model option. | Steps that use a non-default model | [OpenAI Codex CLI repository](https://github.com/openai/codex#readme) |

> [!NOTE]
> **GitHub Enterprise (GHES/GHEC) users**: the same tools and commands apply in enterprise environments. Your Codespace URL and GitHub URLs will use your enterprise hostname instead of `github.com`. If your enterprise uses a self-hosted runner, the `gh aw compile` command still runs locally in your Codespace — see [Step 6](06-install-gh-aw.md) for any environment-specific install notes.

### :bulb: Quick check — match the term to its role

Match each term to what you use it for, then reveal the answers.

1. `gh-aw` CLI extension
2. GitHub Copilot CLI
3. Terminal (command line)

- A. Runs the `bash` commands the workshop shows you
- B. Compiles agentic workflow files
- C. Gives you AI help inside the terminal

<details>
<summary>Check your answers</summary>

1 → B, 2 → C, 3 → A

</details>

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

Recognizing what each environment looks like on screen helps you orient yourself quickly. These are simplified mental models, not literal product screenshots — expand a group below when you want a visual for a term.

<details>
<summary>Development environments (Codespaces, VS Code, terminal)</summary>

#### GitHub Codespaces

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg">
  <img alt="Conceptual screenshot of GitHub Codespaces with editor, file explorer, and terminal" src="images/side-quest-01-02-github-codespaces-light.svg">
</picture>

**Ready-to-go development environment in your browser.**

#### Visual Studio Code (VS Code)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg">
  <img alt="Conceptual screenshot of VS Code with Explorer, editor tabs, and terminal" src="images/side-quest-01-02-vscode-light.svg">
</picture>

**Browse files, edit workflows, keep a terminal open beside your work.**

#### Terminal (command line)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg">
  <img alt="Conceptual screenshot of a terminal with prompt and command output" src="images/side-quest-01-02-terminal-light.svg">
</picture>

**Where you run `gh`, `gh aw`, and `git` commands.**

</details>

<details>
<summary>Workshop tools and model options (gh, gh-aw, Copilot, Claude, Codex)</summary>

#### GitHub CLI (`gh`)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub CLI commands in a terminal" src="images/side-quest-01-02-gh-cli-light.svg">
</picture>

**Authentication checks, repository shortcuts, workflow commands.**

#### `gh-aw` CLI extension

<picture>
   <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg">
   <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg">
   <img alt="Conceptual screenshot of gh-aw CLI compile commands" src="images/side-quest-01-02-gh-aw-light.svg">
</picture>

**Compiles agentic workflow files.**

#### GitHub Copilot CLI

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub Copilot CLI with AI-assisted command help" src="images/side-quest-01-02-copilot-cli-light.svg">
</picture>

**AI help inside the terminal.**

#### GitHub Copilot app

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg">
  <img alt="Conceptual screenshot of GitHub Copilot app with agent chat and pull request view" src="images/side-quest-01-02-copilot-app-light.svg">
</picture>

**Start and steer repository sessions, manage tasks, review pull requests.**

#### Claude

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg">
  <img alt="Conceptual screenshot of a Claude-style workspace with prompt and response" src="images/side-quest-01-02-claude-light.svg">
</picture>

**One of the AI model options available in the workshop.**

#### OpenAI Codex

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg">
  <img alt="Conceptual screenshot of an OpenAI Codex-style workspace with a suggested patch" src="images/side-quest-01-02-openai-codex-light.svg">
</picture>

**A coding-focused model option that reads files and suggests edits.**

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
