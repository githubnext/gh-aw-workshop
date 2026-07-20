<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 09-01f: Debugging Checklist

## 🎯 What You'll Do

You will apply a repeatable seven-step triage flow whenever a run produces unexpected output.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

## Checklist

1. Open the live log in **Actions** and scan for `[error]` lines first.
2. Check `[plan]` density. More than four consecutive plan lines without a tool call usually means your brief is underspecified.
3. Inspect `[tool]` and `[result]` lines to confirm expected data is returned.
4. Look for `safe-output: BLOCKED` and decide whether to increase `max` or tighten "post once" guidance.
5. Read the run summary and compare it to your expected write behavior.
6. Open the [safe-output record](https://github.github.com/gh-aw/reference/safe-outputs/) in the job details and treat it as source of truth for writes.
7. If behavior is still unclear, ask the `agentic-workflows` skill to diagnose your workflow with a pasted snippet.

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can run this checklist in order without skipping steps
- [ ] I know where to find both live logs and safe-output records
- [ ] I can decide whether the root cause is prompt, data, permissions, or output limits
- [ ] I can gather a minimal log snippet to share for deeper diagnosis

<!-- /journey -->
For more details, see [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/), [Debugging Workflows](https://github.github.com/gh-aw/troubleshooting/debugging/), [Common Issues](https://github.github.com/gh-aw/troubleshooting/common-issues/), and [GitHub Tools Read Permissions](https://github.github.com/gh-aw/reference/permissions/).

