# Step 0: Welcome — What We'll Build

> _By the end of this workshop, you'll have a real AI-powered workflow running on GitHub — one that reports on your repository every single day, automatically._

## 🎯 What You'll Do

In this workshop, you'll learn how to build **agentic workflows** — GitHub Actions that use AI to think, decide, and act on your behalf. You'll start from scratch and finish with a working daily status report that summarises your repository's activity without you lifting a finger.

## A Peek at the Finish Line

Here's an example of what your workflow will produce every morning:

```
📊 Daily Repo Status — 2025-07-10
══════════════════════════════════
🔀 Open pull requests:  3
🐛 Open issues:         7  (2 labeled "bug")
✅ CI status:           passing
📝 Last commit:         "Fix login timeout" — 6 hours ago
💬 New discussion:      "RFC: Add dark mode" — 14 replies

Everything looks healthy. One PR has been open for 14 days
and might need a nudge. 👀
```

That report gets posted as a GitHub issue comment, a Slack message, or anywhere else you configure. It runs on a schedule — no clicks required.

## What You'll Learn

| Step | Skill |
|------|-------|
| Set up your environment | Codespace or local terminal |
| GitHub Actions basics | Triggers, jobs, and steps |
| Agentic workflows | How AI agents fit into CI/CD |
| `gh-aw` CLI | Write and run agentic workflows |
| A real-world workflow | Design → build → schedule |

## Who This Is For

You should be comfortable with:
- Creating a GitHub repository
- Making commits and pushing code
- Reading a little YAML (we'll explain everything line by line)

You do **not** need experience with GitHub Actions or AI tools. This workshop assumes none.

## How the Workshop Is Structured

Each step is short — most take **5–10 minutes**. Steps build on each other, but checkboxes at the end of each step tell you exactly what to verify before moving on.

At **Step 1**, the path splits into two options:
- **Adventure A** — set up a cloud environment with GitHub Codespaces (no local install needed)
- **Adventure B** — use your local terminal

Both paths converge at **Step 3** and stay together for the rest of the workshop.

> [!TIP]
> If you get stuck, every step links back to the previous one. You can always rewind.

## ✅ Checkpoint

- [ ] You've read what you'll build
- [ ] You know which setup path you'll take (Codespace or local)
- [ ] You're excited — let's go! 🚀

**Next:** [Step 1: What You Need Before We Start](01-prerequisites.md)
