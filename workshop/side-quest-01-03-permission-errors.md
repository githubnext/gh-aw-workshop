# Side Quest: Permission Errors

> _Optional: read this if you see a `permission denied` error and need help resolving it._

## 📋 Before You Start

- You have opened a terminal (see [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) if needed)
- You encountered a `permission denied` error during setup, or want to know what to do when you do

---

## What is a permission error?

When you see `permission denied`, your user account does not have the rights to run that command as written. This is a security feature — it prevents accidental changes to system files.

---

## How to fix it

### macOS and Linux

Re-run the command with `sudo` in front:

```bash
sudo <your-command>
```

You'll be prompted for your password. `sudo` stands for "superuser do" and temporarily grants elevated rights for that one command.

### Windows

Right-click **Windows Terminal** or **PowerShell** and choose **Run as administrator**, then retry the command.

---

> [!IMPORTANT]
> Only use elevated access when workshop instructions explicitly tell you to. Running everything as root or administrator is not recommended and can cause hard-to-reverse changes.

---

## Practice: Observe and fix a permission error

Run this command to deliberately trigger a `permission denied` message.

**macOS / Linux:**

```bash
cat /etc/sudoers
```

You should see output like `cat: /etc/sudoers: Permission denied`. Note the exact file path in the message.

Now re-run it with `sudo` and confirm the error disappears:

```bash
sudo cat /etc/sudoers
```

**Windows:** Open a standard (non-admin) PowerShell and run:

```powershell
Get-Content "$env:SystemRoot\System32\drivers\etc\hosts"
```

Then open an administrator PowerShell and run the same command — it should succeed.

---

## ✅ Checkpoint

- [ ] You ran the practice command and saw `permission denied` (or an equivalent access-denied message) in your terminal output
- [ ] You identified the exact file path shown in the error message
- [ ] You re-ran the command with elevated rights (`sudo` or Run as administrator) and confirmed it completed without an error
- [ ] You can explain in one sentence why your account lacked access — write it as a comment on your practice repo issue

---

When you're done here, return to [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md).
