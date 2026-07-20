<!-- journey: terminal -->
<!-- adventure: side-quest -->
# Side Quest: Using `gh aw compile` to Catch Errors Early

> _Optional: take this detour if you want a deeper walkthrough of `gh aw compile`, then return to the Terminal path for [Step 7](07a-your-first-workflow-terminal.md), [Step 11a](11a-build-daily-status-terminal.md), or [Step 13](13a-schedule-it-terminal.md)._

## 🎯 What You'll Do

You'll use `gh aw compile` as a fast feedback loop while you edit workflow files. By the end, you'll know when to use `--no-emit` for dry-run checks, when to use `--validate` for deeper validation, when to keep `--watch` running, and how to fix the most common compile errors.

## What `gh aw compile` does

`gh aw compile` checks your workflow source file, validates the [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) and Markdown body structure, and generates the compiled lock file GitHub Actions runs. It catches formatting and schema mistakes before you commit or trigger a workflow.

Run it any time you edit a workflow file:

```bash
gh aw compile
```

If it succeeds, you should see a green success message and an updated `.lock.yml` file beside your source file.

> [!NOTE]
> `gh aw compile` checks file structure, not whether the agent's reasoning or final output is good. You still test the workflow separately after it compiles cleanly.

## Use `--no-emit` for quick structure checks

When you only want a yes/no answer without generating a lock file, use `--no-emit`:

```bash
gh aw compile --no-emit
```

This is useful after each small edit because it confirms the file structure without writing or overwriting the generated lock file every time.

## Use `--validate` for deeper validation

When you want stricter checks on top of normal compilation, add `--validate`:

```bash
gh aw compile --validate
```

This enables GitHub Actions workflow schema validation, container image validation, and action SHA validation. It is more thorough than a plain compile but also slower, so it is best reserved for a pre-commit or CI check rather than every small edit.

## Use `--watch` while you iterate

If you're still editing by hand, keep the compiler running:

```bash
gh aw compile --watch
```

Each save triggers another compile, so you get immediate feedback instead of discovering YAML mistakes later.

> [!TIP]
> For the fastest feedback loop, keep `--watch` running in one terminal while you edit in another.

## How to read a compile error

When `gh aw compile` fails, start with the first line number it reports. YAML errors are often caused by the line above or below the reported line, especially when indentation is off.

The examples below show `gh-aw` source files before compilation, so values like `schedule: daily` and `schedule: daily on weekdays` are valid shorthand here. The error is the indentation, not the schedule value itself.

```yaml
# ❌ Broken — "workflow_dispatch" is not nested under "on:"
on:
  schedule: daily
workflow_dispatch: {}
```

```yaml
# ✅ Fixed
on:
  schedule: daily
  workflow_dispatch: {}
```

```yaml
# ❌ Broken — "schedule" is not indented under "on:"
on:
schedule: daily on weekdays
  workflow_dispatch: {}
```

```yaml
# ✅ Fixed
on:
  schedule: daily on weekdays
  workflow_dispatch: {}
```

## Quick fixes for common compile errors

| If you see this kind of error | Usually means | Check this first |
|-------------------------------|---------------|------------------|
| YAML parse error or `did not find expected key` | A key is indented at the wrong level | Make sure nested keys under `on:`, `permissions:`, `tools:`, or `safe-outputs:` are indented two more spaces than their parent |
| `found character that cannot start any token` | You pasted a tab character or stray YAML punctuation | Replace tabs with spaces and check for accidental special characters in unquoted values |
| `unexpected end of stream` or frontmatter/document errors | The frontmatter fences are incomplete | Confirm the file has both the opening `---` and the closing `---` |
| A section that worked before suddenly fails after one edit | The newest edit changed nearby YAML structure | Re-check the last block you touched before reading the rest of the file |

<!-- journey: terminal -->
## ✅ Checkpoint

- [ ] I know what `gh aw compile` checks before a workflow runs
- [ ] I can use `--no-emit` for quick structure checks without generating a lock file
- [ ] I can use `--watch` for live feedback while I edit
- [ ] I can spot indentation mistakes in a compile error example
- [ ] I know the first places to check when compilation fails

---

Return to the Terminal path for [Step 7](07a-your-first-workflow-terminal.md), [Step 11a](11a-build-daily-status-terminal.md), or [Step 13](13a-schedule-it-terminal.md).

<!-- /journey -->
For more details, see [Compilation Process](https://github.github.com/gh-aw/reference/compilation-process/), [Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/), [Workflow Structure](https://github.github.com/gh-aw/reference/workflow-structure/), and [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/).

