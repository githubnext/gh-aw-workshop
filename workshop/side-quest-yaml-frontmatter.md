# Side Quest: YAML Frontmatter Pitfalls

> _Optional: work through these common YAML mistakes if you hit a compile error in Step 11, then return to the main path._

YAML is unforgiving. Here are the five errors learners hit most often when building agentic workflow frontmatter, each with a broken ❌ and correct ✅ example.

---

## 1. Tabs instead of spaces

YAML does not allow tab characters for indentation. Every level of nesting must use **two spaces**.

```yaml
# ❌ Wrong — the line below "on:" is indented with a tab character,
#    not spaces. The tab is invisible in most editors, which makes
#    this bug hard to spot. YAML will reject it with a parse error.
on:
  schedule: daily  # <-- replace leading whitespace with 2 spaces, not a tab

# ✅ Correct — uses exactly two spaces
on:
  schedule: daily
```

Most editors insert tabs by default for `.md` files. Check your editor's settings and switch indentation to **Spaces** with a size of **2**.

---

## 2. Missing quotes around strings with special characters

YAML treats certain characters (`:`, `#`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `?`, `|`, `>`, `!`, `'`, `"`) as syntax when they appear unquoted in values.

```yaml
# ❌ Wrong — the colon in the description breaks YAML parsing
description: Post a report: daily

# ✅ Correct — wrap the value in double quotes
description: "Post a report: daily"
```

---

## 3. Wrong indentation level for nested keys

YAML nesting is strictly positional. A key one level deeper must be indented exactly two more spaces than its parent.

```yaml
# ❌ Wrong — "mode" is at the same level as "github"
tools:
  github:
  mode: gh-proxy
  toolsets: [default]

# ✅ Correct — "mode" is indented under "github"
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
```

---

## 4. Forgetting the closing `---`

The frontmatter must have both an opening and a closing `---` fence. If you omit the closing fence, the entire file is treated as YAML and the agent body is lost.

```
# ❌ Wrong — no closing fence
---
emoji: 📊
description: ...
on:
  schedule: daily

# Daily Repo Status Report
You are an AI assistant...
```

```
# ✅ Correct — closing fence separates frontmatter from body
---
emoji: 📊
description: ...
on:
  schedule: daily
---

# Daily Repo Status Report
You are an AI assistant...
```

---

## 5. `copilot-requests: write` not listed under `permissions`

This is the single most common reason a workflow compiles but produces no output. The agent can't make AI calls without this permission.

```yaml
# ❌ Wrong — missing copilot-requests
permissions:
  contents: read
  issues: read

# ✅ Correct
permissions:
  contents: read
  copilot-requests: write
  issues: read
```

---

## ✅ Checkpoint

- [ ] You can identify all five YAML pitfall patterns
- [ ] Your `daily-status.md` compiles without errors after checking each section
- [ ] You understand why `copilot-requests: write` is required

> [!TIP]
> Bookmark this page as a quick reference card whenever you write new agentic workflow frontmatter.

---

Return to [Step 11: Build: Daily Repo Status Workflow](11-build-daily-status.md).
