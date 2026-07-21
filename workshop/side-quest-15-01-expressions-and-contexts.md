<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: GitHub Actions Expressions and Contexts

> _The `${{ }}` syntax unlocks a whole language inside your workflow — learn to read it and you can make workflows that adapt to anything._

## 🎯 What You'll Do

Explore the expression and context system that powers GitHub Actions conditions, output references, and dynamic values. By the end, the `${{ steps.recent.outputs.commit_count }}` style syntax in your conditional workflow will feel natural.

## 📋 Before You Start

- You have completed [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md).

## Steps

### Understand the expression syntax

Anywhere in a [GitHub Actions](https://github.github.com/gh-aw/introduction/how-they-work/) YAML file, you can embed a dynamic value using double curly braces:

```yaml
${{ <expression> }}
```

An **expression** is a mini-language. It can reference context objects, compare values, call built-in functions, and combine them with operators. GitHub evaluates the expression at runtime and substitutes the result before running the step.

### Know your contexts

A **context** is a named object that GitHub Actions populates automatically. The ones you'll use most often:

| Context | What it holds |
|---------|--------------|
| `github` | Event metadata — repo name, branch, commit SHA, actor |
| `steps.<id>.outputs` | Outputs written by a previous step using `$GITHUB_OUTPUT` |
| `env` | Environment variables set in the workflow or step |
| `secrets` | Repository or organisation secrets |
| `runner` | Information about the runner OS and temp directory |
| `job` | Current job status |

You can read a context value anywhere an expression is allowed:

```yaml
run: echo "Running on ${{ runner.os }}"
```

```yaml
if: github.event_name == 'workflow_dispatch'
```

> [!TIP]
> <details>
> <summary>You can see the full contents of every context by adding a debug step:</summary>
>
> ```yaml
> - name: Dump contexts
>   run: echo '${{ toJSON(github) }}'
> ```
>
> </details>

### Use outputs between steps

When a step writes a value to `$GITHUB_OUTPUT`, later steps can read it via the `steps` context:

```yaml
steps:
  - name: Produce a value
    id: my-step
    run: echo "result=hello" >> $GITHUB_OUTPUT

  - name: Use that value
    run: echo "Got ${{ steps.my-step.outputs.result }}"
```

The `id:` field is the key. Without it, the `steps` context has no name to look up.

### Write readable conditions

The `if:` key accepts any expression. It evaluates to a boolean — if false, the step (or job) is skipped.

Common patterns:

```yaml
# Run only on push to main
if: github.ref == 'refs/heads/main'

# Run only when a previous step succeeded
if: steps.build.outputs.exit_code == '0'

# Skip on pull requests from forks
if: github.event.pull_request.head.repo.full_name == github.repository

# Combine with AND / OR
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

> [!NOTE]
> Values from `$GITHUB_OUTPUT` are always strings. Compare them with quotes: `== '0'`, not `== 0`.

### Use built-in functions

GitHub Actions provides a small set of helper functions inside expressions:

| Function | What it does |
|----------|-------------|
| `toJSON(value)` | Serialise any context to a JSON string |
| `fromJSON(string)` | Parse a JSON string into an object |
| `contains(haystack, needle)` | True if string/array includes the value |
| `startsWith(string, prefix)` | True if string starts with prefix |
| `endsWith(string, suffix)` | True if string ends with suffix |
| `format(template, …)` | String interpolation |

Example — check whether a commit message contains a keyword:

```yaml
if: contains(github.event.head_commit.message, '[skip ci]')
```

> [!NOTE]
> Expressions are evaluated on the GitHub Actions runner, not inside the AI agent. Use them for workflow control flow, not for shaping the AI prompt at runtime — pass values to the prompt via environment variables in your brief instead.

### Combine multiple conditions

The `&&` (AND) and `||` (OR) operators let you build composite conditions that express more nuanced rules than a single comparison allows. When combining multiple shell-derived outputs, keep in mind that all values written to `$GITHUB_OUTPUT` arrive as strings, so always compare them against quoted literals.

```yaml
# Run only when there are commits AND the branch is main
if: steps.recent.outputs.commit_count != '0' && github.ref == 'refs/heads/main'

# Run when triggered manually OR there are recent commits
if: github.event_name == 'workflow_dispatch' || steps.recent.outputs.commit_count != '0'

# Skip weekends by combining day-of-week outputs from a shell step
if: steps.day.outputs.day != 'Saturday' && steps.day.outputs.day != 'Sunday'
```

### Gather time-based context with shell steps

Some conditions require information that is not available in any context object — for example, the current day of the week or the number of commits since a given timestamp. You can capture this data in a dedicated shell step and then reference it like any other output.

A step that exposes the current day name:

```yaml
- name: Check day of week
  id: day
  run: echo "day=$(date +%A)" >> $GITHUB_OUTPUT
```

Once this step runs, `steps.day.outputs.day` holds a value like `Monday` or `Saturday`. Combine it with a commit-count check to build a condition that skips the agent job on both quiet days and weekends:

```yaml
if: steps.recent.outputs.commit_count != '0' && steps.day.outputs.day != 'Saturday' && steps.day.outputs.day != 'Sunday'
```

This pattern — deterministic shell step produces a string output, `if:` expression reads that output — applies broadly wherever you need workflow control flow based on data that is not already in a GitHub Actions context object.

## ✅ Checkpoint

- [ ] You can explain what `${{ }}` does and when GitHub evaluates it
- [ ] You can name at least three context objects and what they contain
- [ ] You understand how `id:` connects a step's output to the `steps` context
- [ ] You can write an `if:` condition that skips a step based on a previous output
- [ ] You can combine two or more conditions using `&&` and `||`
- [ ] You can write a shell step that captures time-based data (day of week, date) as a step output

<!-- journey: all -->
**Next:** [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)
<!-- /journey -->


