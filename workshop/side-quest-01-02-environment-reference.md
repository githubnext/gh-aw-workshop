# Side Quest: Environment Reference

> _Optional: use this quick glossary and visual reference to understand the environments and AI tools used throughout the workshop._

## 📋 Before You Start

You have a terminal open inside your practice repository (see [Step 2a](02a-setup-codespace.md) or [Step 2b](02b-setup-local.md)).

## Environment and tool glossary

Knowing which name maps to which role helps you follow workshop instructions without stopping to wonder what "the terminal" or "Codespaces" means in context.

| Term | What it means in this workshop | Official documentation |
|------|------|------|
| **GitHub Codespaces** | Your cloud development environment when you choose the browser-based setup path. | [GitHub Codespaces docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor experience used inside Codespaces (and optionally on your local machine). | [Visual Studio Code docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | The shell where you run workshop commands (`gh`, `gh aw`, `git`, and more). | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, required for this workshop. | [GitHub CLI docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | The GitHub Agentic Workflows extension you install and use in the terminal. | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | Copilot in the terminal for AI-assisted command and development help. | [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | The GitHub Copilot desktop and web application where you can open repositories, start agent sessions, steer coding tasks, and manage pull requests. | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic's AI model family available in some GitHub Copilot and agentic workflow contexts. | [Claude documentation](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI coding model family that can be used in coding and agent workflows. | [OpenAI Codex](https://openai.com/codex/) |

### ✅ Verify your tools are ready

Run these commands in your terminal to confirm the required tools are installed and accessible:

```bash
gh --version
gh aw --version
git --version
```

## Conceptual screenshots

Recognizing what each environment looks like on screen helps you orient yourself quickly when workshop instructions say "open a terminal" or "use the Copilot app."

These visuals are simplified mental models, not literal product screenshots. Use them to recognize what each name refers to when it appears in later steps.

### Development environments

#### GitHub Codespaces

![Conceptual screenshot of GitHub Codespaces showing a browser-based editor, repository explorer, and integrated terminal](images/side-quest-01-02-github-codespaces.svg)

You use Codespaces when you want a ready-to-go development environment in your browser.

#### Visual Studio Code (VS Code)

![Conceptual screenshot of Visual Studio Code showing the Explorer, open editor tabs, and integrated terminal](images/side-quest-01-02-vscode.svg)

You use VS Code to browse files, edit workflows, and keep a terminal open beside your work.

#### Terminal (command line)

![Conceptual screenshot of a terminal showing a prompt, commands, and command output](images/side-quest-01-02-terminal.svg)

You use the terminal whenever the workshop asks you to run `gh`, `gh aw`, or `git` commands.

### Workshop tools and model options

#### GitHub CLI (`gh`)

![Conceptual screenshot of GitHub CLI showing authentication, repository, and workflow commands in a terminal](images/side-quest-01-02-gh-cli.svg)

You use `gh` for GitHub-specific terminal tasks like authentication checks, repository shortcuts, and workflow commands.

#### `gh-aw` CLI extension

![Conceptual screenshot of the gh-aw CLI extension showing compile and run commands for an agentic workflow](images/side-quest-01-02-gh-aw.svg)

You use `gh aw` to compile, validate, and run agentic workflow files.

#### GitHub Copilot CLI

![Conceptual screenshot of GitHub Copilot CLI showing a terminal prompt alongside AI-assisted command help](images/side-quest-01-02-copilot-cli.svg)

You use GitHub Copilot CLI when you want AI help inside the terminal.

#### GitHub Copilot app

![Conceptual screenshot of the GitHub Copilot app showing a repository session, agent chat, and pull request view](images/side-quest-01-02-copilot-app.svg)

You use the GitHub Copilot app when you want to start and steer repository sessions, manage coding tasks, and review pull requests from a Copilot workspace.

#### Claude

![Conceptual screenshot of a Claude-style workspace showing a prompt, reasoning path, and structured response](images/side-quest-01-02-claude.svg)

You may see Claude as one of the AI model options that can read a brief, reason through a task, and produce an output.

#### OpenAI Codex

![Conceptual screenshot of an OpenAI Codex-style coding workspace showing repository files and a suggested patch](images/side-quest-01-02-openai-codex.svg)

You may see OpenAI Codex as a coding-focused model option that reads files and suggests edits.

## ✅ Checkpoint

- [ ] You ran `gh --version` in your terminal and it returned a version number
- [ ] You ran `gh aw --version` in your terminal and it returned a version number
- [ ] You ran `git --version` in your terminal and it returned a version number
- [ ] You can identify each environment and tool name used in the tutorial
- [ ] You can match each item to its conceptual screenshot
- [ ] You know where to find official docs for each item
- [ ] You're ready to continue with setup or return to your current workshop step

When you're done here, return to [Step 1: What You Need Before We Start](01-prerequisites.md).
