<!-- page-journey: all -->
<!-- page-adventure: scenario-c -->
# Build — PR Code Reviewer

_You've designed the workflow on paper — now choose how you want to create it._

## Choose Your Path

| Path | What you'll do | Continue |
|---|---|---|
| **Terminal path** | Build each section incrementally and compile for feedback | [Build with the Terminal path](11c-build-pr-reviewer-terminal.md) |
| **GitHub UI path** | Paste the complete workflow and commit it in the browser | [Build with the GitHub UI path](11c-build-pr-reviewer-ui.md) |

Both paths produce `.github/workflows/pr-code-reviewer.md` and converge at Step 12.

## Annotated YAML Example

If you want to understand the workflow structure before choosing a build path, review this simplified PR reviewer workflow skeleton for `pr-code-reviewer.md`. It is a teaching example, so the full workflow you build later can include more detail.

```yaml
---
name: pr-reviewer # workflow name shown in the Actions sidebar
on:
  pull_request:
    types: [opened, synchronize] # run when a PR opens or receives new commits
engine:
  id: copilot
  model: gpt-5.4-mini   # LLM used for the review
tools: [github] # required so the agent can read PR diffs and post review comments
---
```

After this [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) block, add your workflow prompt body in Markdown (for example: "Read the diff, find security and reliability risks, and post sections for Findings, Suggested Fixes, and Final Verdict.").

This is intentionally small: just enough to understand what each top-level key controls before you write or paste the complete workflow in your chosen build path. Note that `model` is a sub-field of `engine:`, not a top-level key.

## Check your understanding

- Which line controls when this workflow runs?
- What would you change to make the agent focus only on security issues?

Hints:

- The trigger is defined under `on:`.
- You can tighten scope by changing the final prompt instructions.

Use this quick self-check before you move on:

- [ ] You can point to the exact trigger line in the YAML frontmatter
- [ ] You can describe one prompt change that narrows reviews to security findings
- [ ] You can explain why `tools: [github]` is required for PR-aware reviews
- [ ] You can describe one extra PR event type you might include and why

## ✅ Checkpoint

- [ ] You chose the path that matches how you want to work
- [ ] You know both paths produce the same workflow file

**Previous:** [Step 10c: Design — PR Code Reviewer](10c-design-pr-reviewer.md)
<!-- journey: all -->
**Next:** Continue with your chosen path above.
<!-- /journey -->


