<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Environment Reference

> _Optional: use this quick glossary and visual reference to understand the environments and AI tools used throughout the workshop._

**What you'll learn:** By the end of this page you can name each tool and environment used in the workshop, match it to its role, and know when you'll use it.

## :clipboard: Before You Start

This is a reference page — you can read it any time. Come back here whenever the workshop uses a term you want to clarify. No terminal required to read this page.

When you're ready to verify your tools are working, see the [Checkpoint](#white_check_mark-checkpoint) section at the bottom.

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

### :bulb: Quick self-check

Before moving on, try to answer these from memory — check the glossary above if you get stuck:

1. Which tool do you run `gh aw compile` in? ___
2. Which environment is pre-launched for you in golden-ticket workshops? ___
3. Which tool would you use to browse and edit workflow files with tabs open? ___
4. Which surface lets you start and steer a repository session without opening a terminal? ___
5. Name one non-default model family you might see used in a workflow. ___

<details>
<summary>Answers</summary>

1. The terminal (using the `gh aw` CLI extension)
2. GitHub Codespaces
3. Visual Studio Code (VS Code)
4. The GitHub Copilot app
5. Claude or OpenAI Codex

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

These simplified mental models (not literal product screenshots) help you recognize each name when it appears later.

### Development environments

| Tool | Screenshot | What you use it for |
|------|------------|----------------------|
| GitHub Codespaces | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg"><img alt="Codespaces: browser editor with terminal" src="images/side-quest-01-02-github-codespaces-light.svg" width="220"></picture> | A ready-to-go development environment in your browser |
| VS Code | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg"><img alt="VS Code: Explorer and editor tabs" src="images/side-quest-01-02-vscode-light.svg" width="220"></picture> | Browsing files and editing workflows with a terminal beside your work |
| Terminal | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg"><img alt="Terminal: prompt and command output" src="images/side-quest-01-02-terminal-light.svg" width="220"></picture> | Running `gh`, `gh aw`, or `git` commands |

### Workshop tools and model options

| Tool | Screenshot | What you use it for |
|------|------------|----------------------|
| GitHub CLI (`gh`) | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg"><img alt="GitHub CLI: auth and workflow commands" src="images/side-quest-01-02-gh-cli-light.svg" width="220"></picture> | GitHub-specific terminal tasks: auth checks, repo shortcuts, workflow commands |
| `gh-aw` CLI extension | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg"><img alt="gh-aw: compile commands" src="images/side-quest-01-02-gh-aw-light.svg" width="220"></picture> | Compiling agentic workflow files |
| GitHub Copilot CLI | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg"><img alt="Copilot CLI: AI help in the terminal" src="images/side-quest-01-02-copilot-cli-light.svg" width="220"></picture> | AI help inside the terminal |
| GitHub Copilot app | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg"><img alt="Copilot app: repository session and PR view" src="images/side-quest-01-02-copilot-app-light.svg" width="220"></picture> | Starting/steering repository sessions and reviewing pull requests |
| Claude | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg"><img alt="Claude: prompt and structured response" src="images/side-quest-01-02-claude-light.svg" width="220"></picture> | An AI model option for non-default-model steps |
| OpenAI Codex | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg"><img alt="Codex: repository files and suggested patch" src="images/side-quest-01-02-openai-codex-light.svg" width="220"></picture> | A coding-focused model option for non-default-model steps |

<!-- journey: all -->
## :white_check_mark: Checkpoint

- [ ] You can name each environment and tool used in this workshop and describe its role
- [ ] You completed the quick self-check without looking at the answers
- [ ] You ran `gh --version` in your terminal and it returned a version number
- [ ] You ran `git --version` in your terminal and it returned a version number
- [ ] If you've completed [Install the `gh-aw` CLI Extension](06-install-gh-aw.md): you ran `gh aw --version` and it returned a version number
- [ ] You can match each item to its conceptual screenshot
- [ ] You know where to find official docs for each tool
- [ ] (Enterprise users) You know which URLs in workshop instructions map to your enterprise hostname

When you're done here, return to [What You Need Before We Start](01-prerequisites.md).
<!-- /journey -->
