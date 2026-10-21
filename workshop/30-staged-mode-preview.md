<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Staged mode — previewing safe output operations without applying their writes</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/staged-mode/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>Steps 1-29 teach learners to add safe outputs, but none show how to test a new write operation without creating real issues, comments, or pull requests. Step 30 closes that gap with the `staged: true` setting and the Actions step summary preview.</rationale>
</research-metadata>
-->

# Preview Safe Outputs with Staged Mode

> _See exactly what your agent would create before it creates anything._

## :dart: What You'll Do

You'll turn on staged mode for a workflow, run it, and read the preview the agent leaves in the Actions run summary. Then you'll scope staging to a single output type and switch it off when you trust the result.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md), or you have any workflow that uses `safe-outputs:`.
- You can compile with `gh aw compile` from [Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Understand staged mode

A **safe output** is a write your agent is allowed to request, such as creating an issue or adding a comment. **Staged mode** lets the agent run in full, but replaces each built-in write with a preview. Nothing is created in your repository.

> [!NOTE]
> Staging is not a sandbox. Custom jobs, external tools, memory, and caches still run, so they need their own controls.

## Steps

### Enable staged mode

1. Open a workflow that has `safe-outputs:`. This example uses an issue triage workflow:

   ```yaml
   ---
   on:
     workflow_dispatch:
   permissions:
     contents: read
     issues: read
   engine: copilot
   safe-outputs:
     staged: true
     create-issue:
       title-prefix: "[ai] "
       labels: [automation]
   ---

   # Issue Analyzer

   Review the three most recent open issues and suggest one follow-up task.
   ```

2. Compile the workflow:

   ```bash
   gh aw compile
   ```

### Run and read the preview

1. Run the workflow from the **Actions** tab on GitHub.com, or with the command from [Run and Watch Your Workflow](08-run-your-workflow.md).
2. When the run finishes, open it and scroll to the **Summary** page.
3. Find the heading that starts with the 🎭 emoji. It lists each operation the agent would have performed, including the title, body, and labels.
4. Open the **Issues** tab and confirm no new issue was created.

> :thinking: **Predict:** Before you read the preview, guess what title the agent will choose. How close was it?

### Stage only one output type

Global staging is all-or-nothing. When one output is new and the others are proven, stage just that one:

```yaml
safe-outputs:
  create-pull-request:
    staged: true
  add-comment:
```

Here, pull requests are previewed while comments run normally. A type-level `staged: false` cannot override global staging.

### Iterate, then go live

1. Adjust the prompt in the workflow body.
2. Run `gh aw compile`, then run the workflow again.
3. Repeat until the 🎭 preview looks right.
4. Remove `staged: true` (or set it to `false`), compile, and run once more to create real resources.

> [!TIP]
> Keep staging on whenever you change the prompt. Re-enable it for a single output type when you add a new safe output.

For the full list of supported outputs and preview messages, see [Staged Mode](https://github.github.com/gh-aw/reference/staged-mode/).

## :white_check_mark: Checkpoint

- [ ] You added `staged: true` under `safe-outputs:` and `gh aw compile` succeeded
- [ ] You ran the workflow and found the 🎭 preview in the run summary
- [ ] You confirmed no issue, comment, or pull request was created while staging was on
- [ ] You can show how to stage a single output type instead of all outputs
- [ ] You removed or disabled staging and saw the real output appear

Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
