# Step 1: What You Need Before We Start

> _Starting with the right setup saves you from frustrating detours later._

## 🔀 Choose Your Setup Path

> [!IMPORTANT]
> **Not sure where to begin? Pick your path now:**
>
> | I am… | Go to… |
> |-------|--------|
> | New to coding or the terminal — or on a shared/school machine | ➡️ [Adventure A: Codespace (**recommended for beginners**)](02a-setup-codespace.md) — nothing to install, runs in your browser |
> | Comfortable with my terminal and local installs | ➡️ [Adventure B: Local Setup](02b-setup-local.md) |
>
> If you're unsure, **start with the Codespace path** — you can always switch later.

## 🎯 What You'll Do

You'll confirm that you have everything required before writing a single line of workflow code. By the end of this step you'll know which setup path to follow — Codespace or local terminal — and you'll be ready to move forward.

## Steps

> [!NOTE]
> **Already have a terminal open with `gh`, `git`, and `node` available?** Run this quick pre-flight check now. If you're starting fresh and haven't set up your environment yet, skip ahead to [Step 2a](02a-setup-codespace.md) or [Step 2b](02b-setup-local.md) and return here once your terminal is ready.
>
> ```bash
> # Pre-flight check -- run this once your terminal is open
> gh --version && echo "✅ gh CLI OK" || echo "❌ gh CLI missing — see install commands below"
> gh auth status && echo "✅ gh authenticated" || echo "❌ run: gh auth login"
> git --version && echo "✅ git OK" || echo "❌ git missing"
> node --version 2>/dev/null && echo "✅ node OK" || echo "ℹ️  node not required but useful"
> echo "Pre-flight complete."
> ```
>
> ![Terminal showing all pre-flight checks passing with green checkmarks](images/01-preflight-success.svg)
> _What success looks like: every line shows ✅ and the prompt returns without errors._

### 1. Confirm required vs optional prerequisites

- ✅ **Required:** `gh` CLI 2.x or newer (`gh --version`)
- ✅ **Required (local terminal path):** Git (`git --version`)
- ℹ️ **Optional:** Node.js (`node --version`) — not required for this workshop

If `gh` is missing, install it using one of these one-liners:

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

### 2. Check your GitHub account

You need a **free GitHub account**. If you don't have one yet, create it at [github.com/join](https://github.com/join).

> [!NOTE]
> You don't need a paid plan. Everything in this workshop works with a free GitHub account.

Authenticate your `gh` CLI now:

```bash
gh auth login
```

Expected output includes `✓ Logged in to github.com`.

### 3. Verify Git is available (local path only)

If you plan to work on your own computer, make sure Git is installed:

```bash
git --version
```

You should see something like `git version 2.x.x`. If you see an error, download Git from [git-scm.com](https://git-scm.com).

> [!TIP]
> If you'd rather skip Git setup entirely, use the Codespace path — it comes with Git, Node, and everything else pre-installed.

<!-- markdownlint-disable MD033 -->
<details>
<summary><strong>🆕 New to the terminal?</strong> Open this beginner primer — learn how to open a terminal and run your first commands.</summary>

![Annotated terminal window with callouts for prompt, command, and output](images/01-terminal-basics-annotated.svg)

- **Prompt**: where your terminal is currently "standing" (for example your user/computer name and folder).
- **Command**: what you type (`git --version`, `node --version`, etc.).
- **Output**: what the computer prints after running your command.

---

### How to open a terminal

#### macOS

1. Press **Command ⌘ + Space** to open Spotlight Search.
2. Type **Terminal** and press **Enter**.
3. A window opens showing a prompt like `yourname@MacBook ~ %`.

#### Windows

1. Press **Win + X**, then select **Windows Terminal** or **PowerShell**.
   - Alternatively, press **Win**, type **Terminal**, and press **Enter**.
2. A window opens showing a prompt like `C:\Users\yourname>`.
3. **Tip:** [Git for Windows](https://git-scm.com/download/win) installs **Git Bash**, which gives you `ls`, `pwd`, and other Unix-style commands that match the examples in this workshop.

#### Linux

1. Press **Ctrl + Alt + T** (works on Ubuntu and most desktop environments).
   - Or right-click the desktop and choose **Open Terminal**.
2. A window opens showing a prompt like `yourname@machine:~$`.

---

### Understanding file paths

A **path** is the address of a file or folder on your computer. On macOS/Linux, paths use `/`; on Windows they use `\`.

| Example | Platform | What it means |
|---------|----------|--------------|
| `/Users/alice/workshop` | macOS / Linux | Absolute path starting from the filesystem root |
| `C:\Users\alice\workshop` | Windows | Absolute path starting from drive C |
| `workshop/files` | Any | Relative path — relative to your current folder |
| `~` | macOS / Linux | Your home folder shorthand (`/Users/alice`, etc.) |

**Essential navigation commands:**

| What you want to do | macOS / Linux | Windows (cmd / PowerShell) |
|---------------------|--------------|---------------------------|
| See your current folder | `pwd` | `cd` (no argument) |
| List files in the current folder | `ls` | `dir` |
| Move into a sub-folder | `cd folder-name` | `cd folder-name` |
| Move up one level | `cd ..` | `cd ..` |
| Go to your home folder | `cd ~` | `cd %USERPROFILE%` |

---

### How to tell if a command succeeded

Most commands print output and then return you to the prompt. Watch for these signals:

| What you see | Meaning |
|-------------|---------|
| Prompt returns with no red text | ✅ Command succeeded (exit code 0) |
| A version number or confirmation message | ✅ Success |
| `command not found` | The tool is not installed or not on your PATH |
| `permission denied` | You need elevated rights — prefix with `sudo` on macOS/Linux |
| `No such file or directory` | The path you typed doesn't exist — check spelling |

---

### 🏃 Practice exercise

Try these three commands to confirm your terminal is working. Copy and paste them exactly:

```bash
mkdir test-dir && cd test-dir && echo "hello, terminal!"
```

You should see **`hello, terminal!`** printed. That means you successfully:

1. Created a folder (`mkdir test-dir`)
2. Moved into it (`cd test-dir`)
3. Printed a message to the screen (`echo`)

Clean up when you're done:

```bash
cd .. && rm -r test-dir
```

> **Windows cmd users:** Replace `rm -r test-dir` with `rmdir /s test-dir`.

---

### Quick beginner FAQ

| Error | What it means | What to try |
|------|------|------|
| `command not found` | The tool is not installed (or not available in this terminal) | Install the tool, then close and reopen the terminal |
| `permission denied` | Your account cannot run that command as written | Re-run with the documented `sudo` step (Linux/macOS) or open an elevated terminal when instructions require it |
| "No such file or directory" / path errors | You're in a different folder than the command expects | Run `pwd` (macOS/Linux) or `cd` to the expected folder, then try again |

---

When you're done here, scroll down to the [✅ Checkpoint](#-checkpoint) to confirm you're ready to move on.

</details>
<!-- markdownlint-enable MD033 -->

### 4. Know what's coming

Here's a quick summary of what you'll have installed and running by the end of the workshop:

| Tool | What it does |
|------|-------------|
| **GitHub Codespace** or **local terminal** | Your development environment |
| **GitHub Actions** | Runs your automated workflows in the cloud |
| **gh CLI** | GitHub's official command-line tool |
| **gh-aw extension** | Adds agentic workflow commands to the gh CLI |

### 5. Choose your path

Now decide how you want to work:

> [!IMPORTANT]
> **Not sure which setup to use?**
> - **No coding experience, new to the terminal, or on a school/work machine?** → Use [Codespace (Step 2a)](02a-setup-codespace.md) — nothing to install.
> - **Comfortable with your terminal and local installs?** → Use [Local Setup (Step 2b)](02b-setup-local.md).

- **Codespace** — Everything runs in the browser. No installs. Ideal if you're on a shared machine or just want the fastest start.
- **Local terminal** — You'll work in your own terminal. Good if you prefer a local environment you already know.

## 🔀 Choose Your Path

| If you… | Go to… |
|---------|--------|
| Want to use GitHub Codespaces (recommended for beginners) | ➡️ [Adventure A: Set Up a Codespace](02a-setup-codespace.md) |
| Prefer to work in your local terminal | ➡️ [Adventure B: Set Up Your Local Terminal](02b-setup-local.md) |

## ✅ Checkpoint

- [ ] You have a GitHub account and can sign in
- [ ] gh CLI version 2.x or newer installed — verify with `gh --version`
- [ ] gh CLI is authenticated — run `gh auth login`, then verify with `gh auth status`
- [ ] You've decided whether to use Codespaces or your local terminal
- [ ] You know which file to open next

**Next:** Follow the link above for your chosen path — [Adventure A](02a-setup-codespace.md) or [Adventure B](02b-setup-local.md).
