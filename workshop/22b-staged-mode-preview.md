<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Preview Safe Outputs Before They Go Live with Staged Mode

> _Seeing exactly what your agent would write — before it writes anything — turns risky changes into confident ones._

## :dart: What You'll Do

When you tune a task brief or add a new [safe output](https://github.github.com/gh-aw/reference/safe-outputs/), you want to see what the agent *would* create without actually opening issues, posting comments, or raising pull requests. [Staged mode](https://github.github.com/gh-aw/reference/staged-mode/) runs your workflow end to end — the agent still reasons and calls tools — but replaces the real GitHub write with a detailed preview in the Actions step summary. By the end, you can safely rehearse changes to `daily-status.md` before trusting them in production.

## :clipboard: Before You Start

- You have a working scheduled workflow (see [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)).
- You applied resilience techniques in [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md).
- You're comfortable editing workflow [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).

## Steps

### Turn on staged mode for one output type

Add `staged: true` under the specific safe-output handler you want to preview — for example, scope it to `create-issue` so other outputs keep running normally:

```markdown .github/workflows/daily-status.md
---
safe-outputs:
  create-issue:
    staged: true
    title-prefix: "[daily-status] "
---
```

A built-in output is staged when either the global `safe-outputs.staged: true` setting or its type-level `staged:` setting is `true`. Scoping staged mode per output type lets you preview one risky change — like a new issue-creation rule — while letting proven outputs like comments continue to write for real.

### Recompile and run

```bash
gh aw compile
git add .
git commit -m "test: preview daily-status issue creation in staged mode"
git push
```

Trigger a manual run from the **Actions** tab (or `gh aw run daily-status`). The agent still completes its full analysis — it just doesn't call the GitHub API for the staged output type.

### Read the preview in the step summary

Open the completed run and scroll to the **Summary** tab. Instead of a link to a created issue, you'll see a preview block showing the exact title, labels, and body the agent would have written. This is your chance to catch a bad title prefix, a missing label, or an overly verbose body before any real write happens.

> [!NOTE]
> Staged mode is not a sandbox. Custom jobs, scripts, external MCP servers, custom credentials, and memory/cache persistence still run for real — only the compiler-managed safe-output writes are replaced with a preview. Treat it as a rehearsal for the final write step, not a guarantee of zero side effects.

### Turn staged mode off once you trust the change

When the preview matches what you want, remove `staged: true` (or set it to `false`) and recompile so the output type goes back to writing for real:

```markdown .github/workflows/daily-status.md
---
safe-outputs:
  create-issue:
    title-prefix: "[daily-status] "
---
```

```bash
gh aw compile
git add .
git commit -m "feat: enable live issue creation for daily-status"
git push
```

## :white_check_mark: Checkpoint

- [ ] You scoped `staged: true` to a single safe-output type in your workflow's frontmatter
- [ ] You recompiled and ran the workflow, confirming the agent completed its full analysis
- [ ] You located the staged preview in the Actions run's step summary
- [ ] You can explain why staged mode previews writes but does not sandbox custom jobs or scripts
- [ ] You turned staged mode off and confirmed the output type writes for real again

<!-- journey: all -->
**Next:** [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md)
<!-- /journey -->

<!--
<research-metadata>
  <focus>Staged mode preview for safe outputs — rehearsing risky workflow changes without live GitHub writes</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/reference/staged-mode/</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/safe-outputs-runtime.md</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/safe-outputs.md</source>
  </sources>
  <rationale>
    The workshop teaches resilience (timeouts, fallback briefs) and safe-output selection, but never shows learners how to
    rehearse a safe-output change before it writes to GitHub for real. Live gh-aw documentation highlights `staged:` as a
    per-output or global frontmatter modifier that replaces compiler-managed writes with a step-summary preview, which is
    exactly the missing bridge between "I edited my task brief" and "I trust this in production." This node fills that gap
    with a narrow, hands-on exercise: scope staged mode to one output type, run it, read the preview, then flip it back to
    live writes — reinforcing that staging previews compiler-managed safe outputs only and is not a full sandbox for custom
    jobs or scripts.
  </rationale>
</research-metadata>
-->
