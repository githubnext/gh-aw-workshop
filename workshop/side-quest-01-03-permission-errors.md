# Side Quest: Permission Errors

> _Optional: read this if you see a `permission denied` error and need help resolving it._

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

## ✅ Checkpoint

- [ ] You understand what `permission denied` means
- [ ] You know how to re-run a command with elevated rights on your OS

---

When you're done here, return to [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) or [Step 1: What You Need Before We Start](01-prerequisites.md).
