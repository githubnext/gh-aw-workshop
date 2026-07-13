# Side Quest: Terminal Basics

> _Optional: complete this quick primer if you're new to the terminal, then return to Step 1._

## 📋 Before You Start

- A computer running macOS, Windows, or Linux with internet access

---

## How to open a terminal

**macOS:** Press **Command ⌘ + Space**, type **Terminal**, and press **Enter**. You'll see a prompt like `yourname@MacBook ~ %`.

**Windows:** Press **Win**, type **Terminal**, and press **Enter**. You'll see a prompt like `C:\Users\yourname>`. Installing [Git for Windows](https://git-scm.com/download/win) also gives you **Git Bash**, which understands the `ls` and `pwd` commands used in this guide.

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

## Practice 2: Navigate folders

Your terminal always has a **current directory** — the folder it is "standing" in. Run these two commands to see where you are and what's there:

```bash
pwd
ls
```

- `pwd` prints your current directory path (for example `/Users/alice`).
- `ls` lists the files and folders inside it.

To move into a folder and then back out, run:

```bash
cd Documents
cd ..
```

> [!TIP]
> On Windows Command Prompt, use `dir` instead of `ls`, and `cd` (no argument) instead of `pwd`.

---

## Practice 3: Create, use, and remove a folder

```bash
mkdir test-dir && cd test-dir && echo "inside test-dir"
```

Then clean up:

```bash
cd .. && rm -r test-dir
```

> [!TIP]
> On Windows Command Prompt, use `rmdir /s test-dir` instead of `rm -r test-dir`. Git Bash users can use `rm -r` as shown above.

You created a folder (`mkdir`), moved into it (`cd`), printed a message (`echo`), and deleted the folder (`rm -r`). ✅

---

## Practice 4: See a deliberate error

Type a command that doesn't exist:

```bash
notacommand
```

You'll see `command not found` or `notacommand: not found`. That's the terminal telling you it doesn't recognise the command — nothing is broken. You'll see this any time a tool isn't installed or you mistype a name.

> [!TIP]
> The three most common errors beginners encounter:
>
> - **`command not found`** — the tool isn't installed or the name is misspelled.
> - **`No such file or directory`** — the path you typed doesn't exist; run `pwd` to check where you are.
> - **`permission denied`** — your account needs elevated rights. See [Side Quest: Permission Errors](side-quest-01-03-permission-errors.md) for help.

---

## ✅ Checkpoint

- [ ] You opened a terminal and saw a prompt (`$`, `%`, or `>`)
- [ ] You ran `echo "hello, terminal!"` and saw the message printed
- [ ] You ran `pwd` and `ls` and saw your current directory and its contents
- [ ] You ran the folder exercise and cleaned up successfully
- [ ] You ran `notacommand` and saw a `command not found` error

---

When you're done here, return to [Step 1: What You Need Before We Start](01-prerequisites.md).
