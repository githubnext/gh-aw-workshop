# Step 1: What You Need Before We Start

_Starting with the right setup saves you from frustrating detours later._

## Enterprise users

> [!IMPORTANT]
> **Using GHEC, GHES, or EMU? Complete this check before you continue.**
>
> Agentic workflows will not run until all three Copilot Enterprise prerequisites are true for the organization that owns your workshop repository:
>
> - [ ] Copilot Enterprise is enabled for the organization
> - [ ] A Copilot Enterprise seat is assigned to your account
> - [ ] The Copilot policy is active for your account (**Settings → Copilot → Policies**)
>
> Next steps:
> - Complete the [Enterprise setup guide](side-quest-enterprise-setup.md) before you proceed
> - Run `gh copilot --version` to confirm Copilot CLI support is available in your environment
> - Check **Settings → Copilot** to confirm your Copilot access is enabled for this account
>
> **Blocked? Send your GitHub org admin this note:**
>
> > I'm taking the gh-aw workshop.
> >
> > Step 1 requires GitHub Copilot Enterprise to be enabled for the organization that owns my workshop repository.
> >
> > Please enable Copilot Enterprise, assign me a seat, and confirm the policy is active for my account.
>
> Review [About GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent) for current enterprise and GHES capability constraints.

<!-- -->

> [!TIP]
> **Using a Codespace (recommended for new users)?** The `gh` CLI and `gh-aw` extension come pre-installed. Your only prerequisite is a free GitHub account. → [Skip to Adventure A: Codespace Setup](02a-setup-codespace.md)

<!-- -->

> [!TIP]
> **Already have `gh` set up?** Run `gh auth status && gh extension list` — if `gh-aw` appears in the list, your CLI is ready. (Copilot access is verified later.) Skip to [Step 3](03-create-your-repo.md).

## ✅ Required pre-flight checks

Complete these checks before you choose a setup path:

- [ ] **Enterprise users:** You've reviewed [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) and confirmed your environment is ready
- [ ] You know where you'll run workshop commands: a local terminal or a GitHub Codespace
- [ ] If you're using your own terminal, run `gh --version` now and confirm `gh` CLI ≥ 2.40
- [ ] If you choose a Codespace, you'll run `gh --version` in [Adventure A](02a-setup-codespace.md) right after the Codespace opens
- [ ] If you're on GHEC, GHES, or EMU, you completed the enterprise prerequisite check above

> [!NOTE]
> **First time with GitHub Actions?**
> You do not need to understand GitHub Actions in depth to complete this workshop.
> The one thing to know now: you will trigger your workflow from the **GitHub Actions tab in your browser** — no terminal commands required.
> Steps 2 (Setup) and 8 (Run Your Workflow) will walk you through exactly what to click.
> If you want a 5-minute background, [Step 4](04-github-actions-intro.md) covers it.

<!-- -->

> [!NOTE]
> If you're using your own terminal and `gh` is not yet installed, skip to the [Install the gh CLI](#steps) section below, then return here. If you're planning to use a Codespace, skip the local install commands and continue to [Adventure A](02a-setup-codespace.md). Authentication (`gh auth login`) is handled in your chosen setup path.

<!-- -->

> [!TIP]
> **Advanced user fast-track**
> Already know GitHub Actions and the `gh` CLI? Jump to [Step 5: What Are Agentic Workflows?](05-agentic-workflows-intro.md) to skip environment setup.
>
> If you already have `gh` installed and authenticated in the environment you'll use for the workshop, you can skip Steps 1–4. Confirm these before jumping ahead:
> - [ ] `gh` CLI ≥ 2.40 is available — run `gh --version`
> - [ ] You have a GitHub repository to work in — create one at [github.com/new](https://github.com/new) if needed
> - [ ] `gh auth status` shows a logged-in account
> - [ ] Copilot license + model access are enabled for this account (`gh copilot --version` or **Settings → Copilot**)
> **What Steps 2–4 cover:** Step 2 sets up your development environment (Codespace or local terminal), Step 3 walks you through creating a practice repository, and Step 4 gives a short primer on GitHub Actions.
> After Step 5, continue to [Step 6: Install the `gh-aw` CLI Extension](06-install-gh-aw.md).

## 🔀 Choose Your Setup Path

![Setup path decision diagram: choose between Codespace and Local Terminal based on your environment](images/01-setup-path-decision.svg)

> [!IMPORTANT]
> **Not sure where to begin? Pick your path now:**
>
> | I am… | Go to… |
> |-------|--------|
> | New to coding or the terminal — or on a shared/school machine | ➡️ [Adventure A: Codespace (**recommended for beginners**)](02a-setup-codespace.md) — nothing to install, runs in your browser |
> | Comfortable with my terminal and local installs | ➡️ [Adventure B: Local Setup](02b-setup-local.md) |
> | Working entirely in the GitHub web UI | ➡️ [Step 3b: GitHub UI Path](03b-create-your-repo-ui.md) — skip terminal setup |
>
> If you're unsure, **start with the Codespace path** — you can always switch later.

### Which setup path is right for me?

> [!IMPORTANT]
> **Using GitHub Enterprise Server (GHES)?** Agentic workflows require GitHub Copilot cloud agent — the agentic execution feature behind these workflows — to be enabled by your GHES administrator. See [Enabling GitHub Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent). If it is not yet enabled, reach out to your platform team before continuing.

Use this profile guide to choose the fastest route:

| Learner profile | Recommended setup path |
|------|------|
| **New to GitHub / no coding background** | ➡️ **Adventure A**: [Set Up a Codespace](02a-setup-codespace.md) (**strongly recommended**) — your GitHub account is enough to get started |
| **Web/backend developer** | ➡️ **Adventure A** or **B**: [Set Up a Codespace](02a-setup-codespace.md) or [Set Up Your Local Terminal](02b-setup-local.md) — choose the environment you prefer |
| **DevOps / advanced** | ➡️ **Adventure B**: [Set Up Your Local Terminal](02b-setup-local.md) — recommended if you're already fluent with `gh` CLI workflows |

In [Step 8](08-run-your-workflow.md), you'll trigger a workflow from the GitHub Actions tab — you don't need a terminal for that step.

If you're taking the beginner-friendly Codespaces path, bookmark your repository's Actions URL as soon as you know it (for example, `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`) so it's easy to open again in Step 8.

## 🎯 What You'll Do

You'll confirm that you have everything required before writing a single line of workflow code. By the end of this step you'll know which setup path to follow — Codespace or local terminal — and you'll be ready to move forward.

## Steps

### Confirm required vs optional prerequisites

- ✅ **Required:** access to GitHub.com
- ✅ **Required for the Terminal path:** a local terminal or GitHub Codespace with `gh` CLI ≥ 2.40
- ✅ **Required (local terminal path):** Git (`git --version`)

If you chose the **local terminal path** and `gh` is missing there, install it using one of these one-liners:

> **Why this matters:** `gh-aw` is a `gh` CLI extension — it cannot run without `gh` installed. Skipping this step means the `gh aw` command in Step 6 will not exist and the workshop will stall there.

#### macOS (Homebrew)

```bash
brew install gh
```

#### Ubuntu/Debian

```bash
sudo apt install gh
```

#### Windows (winget)

```powershell
winget install GitHub.cli
```

Full installation docs: [cli.github.com](https://cli.github.com)

> [!NOTE]
> **Planning to use a Codespace?** Skip the local install commands entirely.
> Open a [GitHub Codespace](02a-setup-codespace.md) from your browser: it comes with `gh` ≥ 2.40 and Git pre-installed, and `gh` is often already authenticated. Still run `gh auth status` to verify before you continue.
> ➡️ **[Adventure A: Set Up a Codespace](02a-setup-codespace.md)**

### Check your GitHub account

You need a **free GitHub account**. If you don't have one yet, create it at [github.com/join](https://github.com/join).

> [!NOTE]
> You don't need a paid plan. Everything in this workshop works with a free GitHub account.

<!-- -->

> [!TIP]
> You'll authenticate `gh` with `gh auth login` as part of your chosen setup path — [Adventure A: Set Up a Codespace](02a-setup-codespace.md) or [Adventure B: Set Up Your Local Terminal](02b-setup-local.md). You don't need to do it here.

### Verify Git is available (local path only)

If you plan to work on your own computer, make sure Git is installed:

```bash
git --version
```

You should see something like `git version 2.x.x`. If you see an error, download Git from [git-scm.com](https://git-scm.com).

> [!TIP]
> If you'd rather skip Git setup entirely, use the Codespace path — it comes with Git and everything else pre-installed.

Need a quick terminal primer before continuing?

➡️ **[Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md)** — an optional walkthrough for opening a terminal, navigating folders, reading command output, and running your first practice commands.


### Know what's coming

Here's a quick summary of the environments and tools you'll use in this workshop:

| Environment or tool | What it does |
|------|-------------|
| **GitHub Codespaces** | Browser-based development environment with a ready-to-use terminal |
| **Visual Studio Code** | Editor interface you'll use in Codespaces (or locally if you prefer) |
| **Terminal + `gh` CLI** | Where you run GitHub commands during setup and workflow authoring |
| **`gh-aw` CLI extension** | Adds agentic workflow commands to the `gh` CLI — installed in [Step 6](06-install-gh-aw.md) |
| **GitHub Copilot CLI** | Optional AI assistant in your terminal for command and workflow help |
| **GitHub Actions** | Runs your automated workflows in the cloud |

Need a quick glossary with official docs links?
➡️ **[Side Quest: Environment Reference](side-quest-01-02-environment-reference.md)**

## ✅ Checkpoint

- [ ] **Enterprise users:** You've reviewed [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md) and confirmed your environment is ready
- [ ] You have a GitHub account and can sign in
- [ ] For the Terminal path, `gh` CLI ≥ 2.40 is available and authenticated
- [ ] Copilot license + model access are verified (`gh copilot --version` or **Settings → Copilot**)
- [ ] You've decided whether to use Codespaces, a local terminal, or the GitHub UI
- [ ] You know which file to open next

**Next:** Follow the link above for your chosen path — [Adventure A](02a-setup-codespace.md) or [Adventure B](02b-setup-local.md).

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Side Quest: Environment Reference](side-quest-01-02-environment-reference.md)
