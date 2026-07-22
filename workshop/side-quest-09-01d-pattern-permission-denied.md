<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 09-01d: Pattern — `permission denied`

## 🎯 What You'll Do

You will map permission failures to the correct control: read access in `permissions:` and write allowlisting in `safe-outputs:`.

## Before You Start

- Complete [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md)

When a log shows `permission denied`, the agent tried an operation outside the workflow's allowed boundaries. Resolve this by identifying whether the denied action is read or write:

- **Read actions** (list issues, get PR data) require the matching [`permissions:`](https://github.github.com/gh-aw/reference/permissions/) scope at `read`.
- **Write actions** (create issue, add comment) require an allowlisted entry in [`safe-outputs:`](https://github.github.com/gh-aw/reference/safe-outputs/) with an appropriate `max`.

Do not treat `permissions:` as a write switch. In this framework, write intent is controlled by `safe-outputs:`. Keep both controls minimal: only scopes and outputs your workflow truly needs.

A quick check:

- If the failing call changes GitHub state, inspect `safe-outputs:` first.
- If the call only retrieves data, inspect `permissions:` first.
- If you want a second set of eyes, ask the `agentic-workflows` skill to validate your [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/).

## Hands-On Exercise

Identify the pattern before opening the answer.

```text
🔧 [tool] github.create_issue → {title: "Daily Status", body: "..."}
❌ [error] permission denied: safe-output create-issue not allowed
```

<details>
<summary>Show answer</summary>

Pattern: **Run fails with `permission denied`**. This is a write action, so you need a matching `safe-outputs` entry (and `permissions` if additional reads are required).

</details>

<!-- journey: all -->
## ✅ Checkpoint

- [ ] I can classify denied calls as read or write operations
- [ ] I can fix missing read access in `permissions:`
- [ ] I can fix missing write allowlisting in `safe-outputs:`
- [ ] I can keep scopes and allowed outputs to the minimum needed

<!-- /journey -->

