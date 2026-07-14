# Side Quest: Terminal Basics

> _Optional: complete this quick primer if you're new to the terminal, then return to Step 1._

## 📋 Before You Start

- A computer running macOS, Windows, or Linux with internet access

---

## How to open a terminal

**macOS:** Press **Command ⌘ + Space**, type **Terminal**, and press **Enter**. You'll see a prompt like `yourname@MacBook ~ %`.

**Windows:** Press **Win**, type **Terminal**, and press **Enter**. You'll see a prompt like `C:\Users\yourname>`.

**Linux:** Press **Ctrl + Alt + T**, or right-click the desktop and choose **Open Terminal**. You'll see a prompt like `yourname@machine:~$`.

The **prompt** is a short line of text ending in `$`, `%`, or `>`. When you see it, the terminal is ready for your **command**. Whatever the terminal prints back is the **output**.

---

## Practice 1: Confirm your terminal works

Type this command and press **Enter**:

```bash
echo "hello, terminal!"
```

You should see `hello, terminal!` printed as output. If you do, your terminal is working. ✅

---

## Practice 2: See where you are

Your terminal always has a **current directory** — the folder it is "standing" in. Run:

```bash
pwd
ls
```

- `pwd` prints your current directory path (for example `/Users/alice`).
- `ls` lists the files and folders inside it.

> [!TIP]
> On Windows Command Prompt, use `cd` (no argument) instead of `pwd`, and `dir` instead of `ls`.

---

## Practice 3: Navigate folders

To move into a folder and then back out, run each command one at a time:

```bash
cd Documents
```

```bash
cd ..
```

- `cd <folder>` moves into that folder.
- `cd ..` moves back to the parent folder.

---

## Practice 4: Create and remove a folder

Create a new folder:

```bash
mkdir test-dir
```

Then step inside it:

```bash
cd test-dir
```

Then step back out and remove it:

```bash
cd ..
rm -r test-dir
```

> [!TIP]
> `mkdir` works the same on all platforms. On Windows Command Prompt, use `rmdir /s test-dir` instead of `rm -r test-dir`.

---

## ✅ Checkpoint

- [ ] You opened a terminal and saw a prompt (`$`, `%`, or `>`)
- [ ] You ran `echo "hello, terminal!"` and saw the message printed
- [ ] You ran `pwd` and `ls` and saw your current directory and its contents
- [ ] You moved into a folder with `cd` and back out with `cd ..`
- [ ] You created a folder with `mkdir` and removed it with `rm -r`

---

When you're done here, return to [Step 1: What You Need Before We Start](01-prerequisites.md).

## 📚 See Also

- [Side Quest: Permission Errors](side-quest-01-03-permission-errors.md) — what to do when the terminal says `permission denied`
