<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Staged mode for safe outputs — previewing what a workflow would write before enabling real GitHub writes</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/staged-mode/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
    <source>https://github.github.com/gh-aw/reference/compilation-process/</source>
  </sources>
  <rationale>The existing curriculum (steps 1-29) teaches safe outputs, error handling, evals, and cost controls, but no step shows how to safely trial a new or changed write operation. Learners either enable real writes immediately or avoid safe outputs while iterating. gh-aw staged mode lets the agent run fully while built-in safe outputs are replaced by a preview in the step summary, supporting both a global `safe-outputs.staged` setting and per-output-type overrides. This step fills that gap with a hands-on exercise that stages one output, reads the preview, and then promotes it to production, while noting that staging is not a sandbox for custom jobs or external effects.</rationale>
</research-metadata>
-->

# Preview Your Workflow's Writes with Staged Mode

> _Review what your agent would create before you let it create anything._

## :dart: What You'll Do

You'll turn on [staged mode](https://github.github.com/gh-aw/reference/staged-mode/) for one of your workflows, run it, read the 🎭 preview in the Actions run summary, and then promote the output to real writes. When you finish, you'll have a safe way to trial any new or changed write operation.

Why this matters: a prompt change can quietly change what your agent posts, labels, or opens. Staged mode lets the agent do its full analysis while you check the proposed [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) first, so mistakes never reach your issues or pull requests.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md), or you have any workflow with a `safe-outputs:` block.
- You can compile workflows with `gh aw compile`.

## Steps

### Stage all safe outputs

Open a workflow that writes something, such as `daily-status.md`, and add `staged: true` inside its `safe-outputs:` block:

```markdown .github/workflows/daily-status.md
---
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  issues: read
safe-outputs:
  staged: true
  create-issue:
    title-prefix: "[status] "
    labels: [report]
---
```

Recompile so the change takes effect:

```bash
gh aw compile
```

### Run it and read the preview

1. Trigger the workflow from the **Actions** tab (or run `gh aw run daily-status`).
2. Open the finished run and scroll to the **step summary**.
3. Find the headings marked with 🎭, such as **Staged Mode: Issue Creation Preview**.

The preview lists every populated field — title, body, labels — and ends with a line confirming that no GitHub resources were created. Check your **Issues** tab to confirm nothing new appeared.

### Stage only one output type

When a workflow has several outputs, preview just the risky one. Set `staged: true` on that type and leave the rest active:

```markdown .github/workflows/daily-status.md
safe-outputs:
  create-issue:
    title-prefix: "[status] "
    staged: true
  add-comment:
```

A built-in output is staged when either the global setting or its own type-level setting is `true`, so a type-level `staged: false` can't override a global `staged: true`.

### Promote to production

Once the previews look right, remove `staged: true`, recompile, and commit both files:

```bash
gh aw compile
git add .
git commit -m "feat: promote daily-status safe outputs out of staged mode"
git push
```

> [!NOTE]
> Staged mode isn't a sandbox. Custom jobs, external MCP servers, custom credentials, and memory persistence aren't blocked. [Custom safe output jobs](https://github.github.com/gh-aw/reference/custom-safe-outputs/) receive `GH_AW_SAFE_OUTPUTS_STAGED=true` and must honor it themselves.

## :white_check_mark: Checkpoint

- [ ] Your workflow sets `staged: true` under `safe-outputs:` and the lock file was recompiled
- [ ] A run produced a 🎭 preview in the step summary and created no real issue, comment, or pull request
- [ ] You can explain how per-type `staged: true` differs from the global setting
- [ ] You removed staging, recompiled, and committed both the `.md` and `.lock.yml` files

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
