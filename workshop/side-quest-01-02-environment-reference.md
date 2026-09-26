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
| **GitHub Codespaces** | Cloud dev environment for the browser-based setup path. | Steps 2–14: writing, compiling, running workflows | [GitHub Codespaces docs](https://docs.github.com/en/codespaces) |
| **Visual Studio Code (VS Code)** | The editor inside Codespaces (or locally). | Editing workflow files and reading output | [Visual Studio Code docs](https://code.visualstudio.com/docs) |
| **Terminal (command line)** | Shell for running `gh`, `gh aw`, `git`, and more. | Any step showing a `bash` code block | [GitHub CLI manual](https://cli.github.com/manual/) |
| **GitHub CLI (`gh`)** | GitHub's official CLI, pre-installed in the Codespace. | Starting at Step 6 (install the extension) | [GitHub CLI docs](https://cli.github.com/manual/) |
| **`gh-aw` CLI extension** | Compiles agentic workflow files. | Step 6 onward | [Install `gh-aw`](https://github.com/github/gh-aw#readme) |
| **GitHub Copilot CLI** | AI help in the terminal; primary AI surface here. | Any step showing a `prompt` code block | [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **GitHub Copilot app** | Desktop/web app for repository sessions, coding tasks, and PR review. | Optional; side quests cover this surface | [GitHub Copilot app](https://github.com/features/ai/github-app) |
| **Claude** | Anthropic's model family, available in some Copilot contexts. | Steps using a non-default model | [Claude documentation](https://docs.anthropic.com/) |
| **OpenAI Codex** | OpenAI's coding model family. | Steps using a non-default model | [OpenAI Codex CLI repository](https://github.com/openai/codex#readme) |

> [!NOTE]
> **Enterprise (GHES/GHEC) users**: the same tools and commands apply — your Codespace and GitHub URLs use your enterprise hostname instead of `github.com`. See [Step 6](06-install-gh-aw.md) for self-hosted runner install notes.

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

Recognizing what each environment looks like on screen helps you orient yourself quickly when workshop instructions say "open a terminal" or "use the Copilot app." These visuals are simplified mental models, not literal product screenshots.

<details>
<summary><strong>Development environments</strong> — Codespaces, VS Code, Terminal</summary>

| | | |
|---|---|---|
| <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-github-codespaces-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-github-codespaces-light.svg"><img alt="Conceptual screenshot of GitHub Codespaces showing a browser-based editor, repository explorer, and integrated terminal" src="images/side-quest-01-02-github-codespaces-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-vscode-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-vscode-light.svg"><img alt="Conceptual screenshot of Visual Studio Code showing the Explorer, open editor tabs, and integrated terminal" src="images/side-quest-01-02-vscode-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-terminal-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-terminal-light.svg"><img alt="Conceptual screenshot of a terminal showing a prompt, commands, and command output" src="images/side-quest-01-02-terminal-light.svg" width="220"></picture> |
| **GitHub Codespaces** — ready-to-go dev environment in your browser | **VS Code** — browse files, edit workflows, keep a terminal alongside | **Terminal** — where you run `gh`, `gh aw`, and `git` |

</details>

<details>
<summary><strong>Workshop tools and model options</strong> — gh, gh-aw, Copilot CLI, Copilot app, Claude, Codex</summary>

| | | |
|---|---|---|
| <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-cli-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-cli-light.svg"><img alt="Conceptual screenshot of GitHub CLI showing authentication, repository, and workflow commands in a terminal" src="images/side-quest-01-02-gh-cli-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-gh-aw-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-gh-aw-light.svg"><img alt="Conceptual screenshot of the gh-aw CLI extension showing compile commands for an agentic workflow" src="images/side-quest-01-02-gh-aw-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-cli-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-cli-light.svg"><img alt="Conceptual screenshot of GitHub Copilot CLI showing a terminal prompt alongside AI-assisted command help" src="images/side-quest-01-02-copilot-cli-light.svg" width="220"></picture> |
| **`gh`** — GitHub auth, repo, and workflow commands | **`gh aw`** — compiles agentic workflow files | **Copilot CLI** — AI help inside the terminal |

| | | |
|---|---|---|
| <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-copilot-app-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-copilot-app-light.svg"><img alt="Conceptual screenshot of the GitHub Copilot app showing a repository session, agent chat, and pull request view" src="images/side-quest-01-02-copilot-app-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-claude-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-claude-light.svg"><img alt="Conceptual screenshot of a Claude-style workspace showing a prompt, reasoning path, and structured response" src="images/side-quest-01-02-claude-light.svg" width="220"></picture> | <picture><source media="(prefers-color-scheme: dark)" srcset="images/side-quest-01-02-openai-codex-dark.svg"><source media="(prefers-color-scheme: light)" srcset="images/side-quest-01-02-openai-codex-light.svg"><img alt="Conceptual screenshot of an OpenAI Codex-style coding workspace showing repository files and a suggested patch" src="images/side-quest-01-02-openai-codex-light.svg" width="220"></picture> |
| **Copilot app** — start/steer sessions, manage tasks, review PRs | **Claude** — one of the AI model options | **OpenAI Codex** — coding-focused model option |

</details>

### :bulb: Quick check: match the tool to its role

<details>
<summary>Which tool compiles your agentic workflow file? (click to reveal)</summary>

The `gh-aw` CLI extension — it compiles your `.md` workflow into a runnable `.lock.yml` file.
</details>

<details>
<summary>Where do you run <code>gh</code>, <code>gh aw</code>, and <code>git</code> commands? (click to reveal)</summary>

The terminal — any step showing a `bash` code block expects you to run it there.
</details>

<details>
<summary>Which environment is pre-launched for you in a golden-ticket workshop? (click to reveal)</summary>

GitHub Codespaces — your browser-based development environment.
</details>

<!-- journey: all -->
## :white_check_mark: Checkpoint

- [ ] You can name each environment and tool used in this workshop and describe its role
- [ ] You ran `gh --version` in your terminal and it returned a version number
- [ ] You ran `git --version` in your terminal and it returned a version number
- [ ] If you've completed [Install the `gh-aw` CLI Extension](06-install-gh-aw.md): you ran `gh aw --version` and it returned a version number
- [ ] You can match each item to its conceptual screenshot
- [ ] You answered the quick check questions above
- [ ] You know where to find official docs for each tool
- [ ] (Enterprise users) You know which URLs in workshop instructions map to your enterprise hostname

When you're done here, return to [What You Need Before We Start](01-prerequisites.md).
<!-- /journey -->
