<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Environment Reference

> _Optional: a quick glossary and visual reference for the environments and AI tools used in this workshop._

**What you'll learn:** name each tool and environment, match it to its role, and know when you'll use it.

## :clipboard: Before You Start

Read this page any time you want to clarify a term. No terminal required — jump to the [Checkpoint](#white_check_mark-checkpoint) when ready to verify your tools.

## Environment and tool glossary

| Term | What it means in this workshop | When you use it | Official documentation |
|------|------|------|------|
| **GitHub Codespaces** | Your cloud dev environment for the browser-based setup path. | Steps 2–14 | [Docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor inside Codespaces (or your local machine). | Editing and reading output | [Docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | The shell running `gh`, `gh aw`, `git`, and more. | Any `bash` code block | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, pre-installed in the Codespace. | Starting at Step 6 | [Docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | The Agentic Workflows extension you use to compile workflow files. | Step 6 onward | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | Copilot in the terminal; the primary AI surface in this workshop. | Any `prompt` code block | [Docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | Desktop/web app for repository sessions and pull requests. | Optional; side quests | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic's model family, available in some contexts. | Non-default-model steps | [Docs](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI's coding model family. | Non-default-model steps | [Codex CLI repo](https://github.com/openai/codex#readme) |

> [!NOTE]
> **Enterprise (GHES/GHEC):** same tools and commands apply — Codespace and GitHub URLs use your enterprise hostname instead of `github.com`. See [Step 6](06-install-gh-aw.md) for runner-specific install notes.

### :white_check_mark: Verify your tools are ready

Open a terminal in your Codespace and run:

```bash
gh --version
git --version
```

Both should print a version number. If either fails, see [Set Up a Codespace](02a-setup-codespace.md).

> [!NOTE]
> `gh aw --version` only works after [Step 6](06-install-gh-aw.md). Skip it until then.

After Step 6, also run:

```bash
gh aw --version
```

## Conceptual screenshots

Simplified mental models, not literal screenshots — use them to recognize each name later. Captions are short since the table above covers the role.

### Development environments

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg">
  <img alt="Conceptual screenshot of GitHub Codespaces with an editor, file explorer, and terminal" src="images/side-quest-01-02-github-codespaces-light.svg">
</picture>

**GitHub Codespaces** — your browser-based dev environment.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg">
  <img alt="Conceptual screenshot of VS Code with the Explorer, editor tabs, and terminal" src="images/side-quest-01-02-vscode-light.svg">
</picture>

**VS Code** — the editor inside Codespaces.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg">
  <img alt="Conceptual screenshot of a terminal with a prompt and command output" src="images/side-quest-01-02-terminal-light.svg">
</picture>

**Terminal** — where you run `gh`, `gh aw`, and `git` commands.

### Workshop tools and model options

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub CLI commands in a terminal" src="images/side-quest-01-02-gh-cli-light.svg">
</picture>

**`gh`** — GitHub's CLI for auth, repo, and workflow commands.

<picture>
   <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg">
   <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg">
   <img alt="Conceptual screenshot of gh-aw compile commands in a terminal" src="images/side-quest-01-02-gh-aw-light.svg">
</picture>

**`gh aw`** — the extension that compiles agentic workflow files.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg">
  <img alt="Conceptual screenshot of GitHub Copilot CLI giving AI help in a terminal" src="images/side-quest-01-02-copilot-cli-light.svg">
</picture>

**GitHub Copilot CLI** — AI help inside the terminal.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg">
  <img alt="Conceptual screenshot of the GitHub Copilot app with a session, chat, and pull request view" src="images/side-quest-01-02-copilot-app-light.svg">
</picture>

**GitHub Copilot app** — start sessions and review pull requests from a Copilot workspace.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg">
  <img alt="Conceptual screenshot of a Claude-style workspace with a prompt and response" src="images/side-quest-01-02-claude-light.svg">
</picture>

**Claude** — an alternate AI model option for some steps.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg">
  <img alt="Conceptual screenshot of an OpenAI Codex-style workspace with files and a suggested patch" src="images/side-quest-01-02-openai-codex-light.svg">
</picture>

**OpenAI Codex** — another alternate AI model option for some steps.

### Quick self-check

Before moving on, cover the table above and try to answer: which tool do you use to *compile* a workflow file, and which do you use to *run* `git` commands? (Answers: `gh aw`; the terminal.)

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
