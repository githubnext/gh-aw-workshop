# Side Quest: Passing Data Between Steps with $GITHUB_OUTPUT

> _Optional: work through this deep-dive if you want to understand how data flows between steps, then return to [Step 16](16-connect-data-source.md)._

GitHub Actions runs each step in its own shell process. That means a plain `export MY_VAR=value` in one step **is invisible** to the next step — the environment is thrown away when the step exits. `$GITHUB_OUTPUT` is the official mechanism for persisting data across steps.

---

## 1. Why `export` doesn't work across steps

```bash
# ❌ This looks reasonable but DOES NOT WORK
- name: Set a value
  run: export RESULT="hello"

- name: Use the value
  run: echo "$RESULT"   # prints nothing — RESULT is gone
```

Each step is a separate child process. Environment variables set with `export` only survive for the duration of that step.

---

## 2. Single-line values

Append a `key=value` pair to the file path stored in the `$GITHUB_OUTPUT` environment variable:

```bash
# ✅ Write a single-line value
echo "status=healthy" >> $GITHUB_OUTPUT
```

To read it back in a later step, reference `${{ steps.<id>.outputs.status }}` — but first you need to give the writing step an `id`.

---

## 3. Giving steps an `id`

A step `id` is how you refer to its outputs elsewhere in the workflow. Add `id:` at the same level as `name:` and `run:`:

```yaml
- name: Check health
  id: health_check
  run: |
    echo "status=healthy" >> $GITHUB_OUTPUT
```

Now any later step (or the AI prompt) can reference:

```
${{ steps.health_check.outputs.status }}
```

---

## 4. Multi-line values with the `<<EOF` heredoc syntax

A single `echo "key=value"` won't work for multi-line content because the newlines would break the `key=value` format. Use a heredoc delimiter instead:

```bash
# ✅ Write a multi-line value
echo "commit_log<<EOF" >> $GITHUB_OUTPUT
echo "$COMMIT_LOG" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT
```

The three lines together tell GitHub Actions:
1. `commit_log<<EOF` — start a multi-line value named `commit_log`, using `EOF` as the end marker.
2. `$COMMIT_LOG` — the actual content (can span many lines).
3. `EOF` — close the block.

You can use any unique string as the delimiter — `EOF` is just a convention.

---

## 5. Injecting outputs into an AI prompt

Once your data is in `$GITHUB_OUTPUT`, you can reference it anywhere in the workflow YAML — including inside an AI prompt step:

```yaml
- name: Generate summary
  uses: gh-aw/prompt@v1
  with:
    prompt: |
      Here are the recent commits:
      ${{ steps.recent.outputs.commit_log }}

      Write a one-paragraph summary of this activity.
```

The `${{ ... }}` expression is resolved by GitHub Actions **before** the step runs, so the model receives the fully expanded text.

---

## ✅ Checkpoint

- [ ] You can explain why `export` does not pass values between steps
- [ ] You can write a single-line value to `$GITHUB_OUTPUT`
- [ ] You know how to give a step an `id` and reference its outputs
- [ ] You can use the `<<EOF` heredoc syntax for multi-line values
- [ ] You can reference step outputs inside an AI prompt

---

Return to [Step 16: Connect a Live Data Source to Your Workflow](16-connect-data-source.md).
