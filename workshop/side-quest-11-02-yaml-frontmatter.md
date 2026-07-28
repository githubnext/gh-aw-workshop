<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: YAML Frontmatter Pitfalls

> _Optional: work through these common YAML mistakes if you hit a [compile error](https://github.github.com/gh-aw/reference/compilation-process/) in Step 11, then return to the main path._

YAML is unforgiving. Here are the five errors learners hit most often when building agentic workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/), each with a broken :x: and correct :white_check_mark: example.

---

## Tabs instead of spaces

YAML does not allow tab characters for indentation. Every level of nesting must use **two spaces**.

```markdown
---
# :x: Wrong — the line below "on:" is indented with a tab character,
#    not spaces. The tab is invisible in most editors, which makes
#    this bug hard to spot. YAML will reject it with a parse error.
on:
  schedule: daily  # <-- replace leading whitespace with 2 spaces, not a tab

# :white_check_mark: Correct — uses exactly two spaces
on:
  schedule: daily
---
```

Most editors insert tabs by default for `.md` files. Check your editor's settings and switch indentation to **Spaces** with a size of **2**.

---

## Missing quotes around strings with special characters

YAML treats certain characters (`:`, `#`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `?`, `|`, `>`, `!`, `'`, `"`) as syntax when they appear unquoted in values.

```markdown
---
# :x: Wrong — the colon in the description breaks YAML parsing
description: Post a report: daily

# :white_check_mark: Correct — wrap the value in double quotes
description: "Post a report: daily"
---
```

---

## Wrong indentation level for nested keys

YAML nesting is strictly positional. A key one level deeper must be indented exactly two more spaces than its parent.

```markdown
---
# :x: Wrong — "mode" is at the same level as "github"
tools:
  github:
  mode: gh-proxy
  toolsets: [default]

# :white_check_mark: Correct — "mode" is indented under "github"
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
---
```

---

## Forgetting the closing `---`

The frontmatter must have both an opening and a closing `---` fence. If you omit the closing fence, the entire file is treated as YAML and the agent body is lost.

```
# :x: Wrong — no closing fence
---
emoji: :bar_chart:
description: ...
on:
  schedule: daily

# Daily Repo Status Report
You are an AI assistant...
```

```
# :white_check_mark: Correct — closing fence separates frontmatter from body
---
emoji: :bar_chart:
description: ...
on:
  schedule: daily
---

# Daily Repo Status Report
You are an AI assistant...
```

---

## `copilot-requests: write` not listed under `permissions`

This is the single most common reason a workflow compiles but produces no output. The agent can't make AI calls without this permission.

```markdown
---
# :x: Wrong — missing copilot-requests
permissions:
  contents: read
  issues: read

# :white_check_mark: Correct
permissions:
  contents: read
  copilot-requests: write
  issues: read
---
```

---

## :white_check_mark: Checkpoint

- [ ] You can identify all five YAML pitfall patterns
- [ ] Your `daily-status.md` compiles without errors after checking each section
- [ ] You understand why `copilot-requests: write` is required

> [!TIP]
> Bookmark this page as a quick reference card whenever you write new agentic workflow frontmatter.

---

<!-- journey: all -->
Return to [Build: Daily Repo Status Workflow](07-your-first-workflow.md).
<!-- /journey -->


