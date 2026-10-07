<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Environment Reference

> _Optional: quick glossary and visual reference for the environments and AI tools used throughout the workshop._

**What you'll learn:** name each tool and environment used here, match it to its role, and know when you'll use it.

## :clipboard: Before You Start

A reference page — read it any time you want to clarify a term. No terminal required.

## Environment and tool glossary

| Term | What it is | When you use it | Official documentation |
|------|------|------|------|
| **GitHub Codespaces** | Your cloud dev environment for the browser-based path. | Steps 2–14 | [GitHub Codespaces docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor inside Codespaces (or locally). | Editing files, reading output | [Visual Studio Code docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | The shell for workshop commands. | Any `bash` code block | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, pre-installed. | From Step 6 onward | [GitHub CLI docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | Compiles agentic workflow files. | Step 6 onward | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | Terminal AI assistance; the primary AI surface here. | Any `prompt` code block | [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | Desktop/web app for sessions and PR management. | Optional; side quests | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic model family, an alternate engine option. | Steps using a non-default model | [Claude documentation](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI coding model family, an alternate engine option. | Steps using a non-default model | [OpenAI Codex CLI repository](https://github.com/openai/codex#readme) |

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

Simplified mental models (not literal screenshots) to recognize each name later.

### Development environments

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg">
  <img alt="Conceptual screenshot of GitHub Codespaces showing a browser-based editor, repository explorer, and integrated terminal" src="images/side-quest-01-02-github-codespaces-light.svg">
</picture>

**GitHub Codespaces** — ready-to-go dev environment in your browser.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg">
  <img alt="Conceptual screenshot of Visual Studio Code showing the Explorer, open editor tabs, and integrated terminal" src="images/side-quest-01-02-vscode-light.svg">
</picture>

**VS Code** — browse files, edit workflows, keep a terminal beside your work.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg">
  <img alt="Conceptual screenshot of a terminal showing a prompt, commands, and command output" src="images/side-quest-01-02-terminal-light.svg">
</picture>

**Terminal** — run `gh`, `gh aw`, and `git` commands.

<details>
<summary>Quick check: match the tool to the task</summary>

Which development environment would you use to edit a workflow file's YAML frontmatter directly? → **VS Code** (inside Codespaces).

Which one would you use to run `gh aw compile`? → **Terminal**.

</details>

### Workshop tools and model options

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub CLI showing authentication, repository, and workflow commands in a terminal" src="images/side-quest-01-02-gh-cli-light.svg">
</picture>

**GitHub CLI (`gh`)** — auth checks, repo shortcuts, workflow commands.

<picture>
   <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg">
   <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg">
   <img alt="Conceptual screenshot of the gh-aw CLI extension showing compile commands for an agentic workflow" src="images/side-quest-01-02-gh-aw-light.svg">
</picture>

**`gh-aw` CLI extension** — compiles agentic workflow files.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub Copilot CLI showing a terminal prompt alongside AI-assisted command help" src="images/side-quest-01-02-copilot-cli-light.svg">
</picture>

**GitHub Copilot CLI** — AI help inside the terminal.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg">
  <img alt="Conceptual screenshot of the GitHub Copilot app showing a repository session, agent chat, and pull request view" src="images/side-quest-01-02-copilot-app-light.svg">
</picture>

**GitHub Copilot app** — steer repo sessions and review pull requests.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg">
  <img alt="Conceptual screenshot of a Claude-style workspace showing a prompt, reasoning path, and structured response" src="images/side-quest-01-02-claude-light.svg">
</picture>

**Claude** — alternate AI model option.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg">
  <img alt="Conceptual screenshot of an OpenAI Codex-style coding workspace showing repository files and a suggested patch" src="images/side-quest-01-02-openai-codex-light.svg">
</picture>

**OpenAI Codex** — alternate coding-focused model option.

<details>
<summary>Quick check: which tool matches the role?</summary>

Which tool would you use if a step asks you to switch the AI model your workflow uses? → **Claude** or **OpenAI Codex**, depending on which model you pick.

Which surface lets you review and merge a pull request your workflow opened, without using the terminal? → **GitHub Copilot app**.

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
