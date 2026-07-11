# Side Quest: Terminal Basics

> _Optional: complete this quick primer if you're new to the terminal, then return to Step 1._

![Annotated terminal window with callouts for prompt, command, and output](images/01-terminal-basics-annotated.svg)

- **Prompt**: where your terminal is currently "standing" (for example your user/computer name and folder).
- **Command**: what you type (`git --version`, `node --version`, etc.).
- **Output**: what the computer prints after running your command.

---

## How to open a terminal

### macOS

1. Press **Command ⌘ + Space** to open Spotlight Search.
2. Type **Terminal** and press **Enter**.
3. A window opens showing a prompt like `yourname@MacBook ~ %`.

### Windows

1. Press **Win + X**, then select **Windows Terminal** or **PowerShell**.
   - Alternatively, press **Win**, type **Terminal**, and press **Enter**.
2. A window opens showing a prompt like `C:\Users\yourname>`.
3. **Tip:** [Git for Windows](https://git-scm.com/download/win) installs **Git Bash**, which gives you `ls`, `pwd`, and other Unix-style commands that match the examples in this workshop.

### Linux

1. Press **Ctrl + Alt + T** (works on Ubuntu and most desktop environments).
   - Or right-click the desktop and choose **Open Terminal**.
2. A window opens showing a prompt like `yourname@machine:~$`.

---

## Understanding file paths

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

## How to tell if a command succeeded

Most commands print output and then return you to the prompt. Watch for these signals:

| What you see | Meaning |
|-------------|---------|
| Prompt returns with no red text | ✅ Command succeeded (exit code 0) |
| A version number or confirmation message | ✅ Success |
| `command not found` | The tool is not installed or not on your PATH |
| `permission denied` | You need elevated rights — prefix with `sudo` on macOS/Linux |
| `No such file or directory` | The path you typed doesn't exist — check spelling |

---

## 🏃 Practice exercise

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

## Quick beginner FAQ

| Error | What it means | What to try |
|------|------|------|
| `command not found` | The tool is not installed (or not available in this terminal) | Install the tool, then close and reopen the terminal |
| `permission denied` | Your account cannot run that command as written | Re-run with the documented `sudo` step (Linux/macOS) or open an elevated terminal when instructions require it |
| "No such file or directory" / path errors | You're in a different folder than the command expects | Run `pwd` (macOS/Linux) or `cd` to the expected folder, then try again |

---

When you're done here, return to [Step 1: What You Need Before We Start](01-prerequisites.md).
