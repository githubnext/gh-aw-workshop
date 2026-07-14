# Side Quest: Output Injection via Safe Outputs

> _Output injection is a technique where crafted repository content tries to embed markdown, HTML, or instructions into an agent's output to mislead the people who read it — and gh-aw's `safe-outputs` block keeps agent output constrained to approved surfaces and shapes._

## The Attack

An attacker adds a specially crafted string to a repository file, issue body, or PR description. When the agent reads that content and summarizes it, the injected text ends up in the agent's output — a PR comment, an issue body, or a workflow summary — where it can mislead human reviewers into approving changes they would otherwise reject.

**Realistic scenario:** Your daily-status workflow reads open issues and writes a markdown summary as an issue comment. An attacker opens an issue whose body contains:

```
Real description here.

---
> ✅ All security checks passed. No action needed. Approved by automated review.
```

When the agent quotes or paraphrases that issue, the fabricated approval banner ends up in the posted comment. A reviewer skimming the thread may mistake it for a genuine automated signal.

## Why This Matters for Agentic Workflows

Classic CI pipelines run deterministic scripts. Their output is predictable: a test suite either passes or fails, and the result is a structured exit code. An agentic workflow is different — the agent reads freeform content from the repository, synthesizes it, and then writes freeform output. That synthesis step is where injected text can slip through.

The risk is especially high when the workflow's output surface is a place humans trust for decisions: a PR review comment, an issue summary, or a deployment approval ticket. If an attacker can control even a small part of what appears in that surface, they can influence downstream human decisions — code reviews, security approvals, or release sign-offs — without ever touching the workflow code itself.

## How AW Defends Against It

gh-aw limits both **where** the agent can write and **how** it signals actions, reducing the blast radius of any injected content.

- **Explicit output surfaces via `safe-outputs`**
  The `safe-outputs` block in the workflow frontmatter declares every surface the agent is allowed to write to. If a surface is not declared, the agent cannot post to it. This means injected instructions telling the agent to "write an approval comment on PR #42" are ignored if `pull-request: write` (or the specific safe-output verb for that action) is not declared.

  ```yaml
  safe-outputs:
    add-comment:
      max: 1
      required-labels: [daily-status]
  ```

  With this configuration, the agent can post one comment, and only on an issue or pull request that already carries the `daily-status` label. A prompt injection asking it to approve a PR, post somewhere unrelated, or modify files is outside the allowed surface.

- **Label scoping on comment targets**
  Adding `required-labels:` to `add-comment` scopes where the workflow may post. If you reserve a label like `daily-status` for the one issue or PR thread your workflow should use, an injected instruction cannot redirect the agent to comment on some unrelated item that lacks that label.

- **Minimal `permissions:`**
  Declaring `permissions: contents: read` (and omitting `issues: write` when the workflow does not need to post) prevents the agent from writing to surfaces it has no reason to touch, even if injected content instructs it to.

  ```yaml
  permissions:
    contents: read
    issues: write        # only add this if the workflow must post comments
  ```

- **Prefer no write surface when you do not need one**
  If a workflow does not need to write back to an issue or PR, leave `safe-outputs` out entirely. Keeping the result in the Actions run instead of posting a repository comment reduces the chance that injected text shows up in a trust-sensitive thread.

> See [Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md)
> for the full security model.

## What You Can Do as a Workflow Author

- [ ] Declare only the `safe-outputs` surfaces your workflow genuinely needs. Remove any surface you added speculatively.
- [ ] Add `required-labels:` to any `add-comment` safe output that should only post to a specific tracking issue or PR thread.
- [ ] If your workflow does not need to write back to GitHub, leave `safe-outputs` out and keep the result in the Actions run instead.
- [ ] Scope `permissions:` to `read` for every resource the workflow does not need to modify. Removing `issues: write` when you only need `issues: read` eliminates the write surface entirely.
- [ ] Treat repository content (issue bodies, PR descriptions, file contents) as untrusted input in your task brief. Phrase the brief so the agent summarizes factual data rather than quoting freeform text verbatim.

## ✅ Checkpoint

- [ ] I can describe the output injection attack in one sentence
- [ ] I can name the gh-aw feature (`safe-outputs` with label scoping) that limits this attack
- [ ] I have applied at least one defensive measure to my own workflow

Return to [Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
