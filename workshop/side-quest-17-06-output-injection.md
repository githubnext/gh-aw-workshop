# Side Quest: Output Injection via Safe Outputs

> _Output injection is a technique where crafted repository content tries to embed markdown, HTML, or instructions into an agent's output to mislead the people who read it — and gh-aw's `safe-outputs` block keeps agent output constrained to approved surfaces and shapes._

## 📋 Before You Start

- You have completed [Side Quest: Supply Chain Attacks via MCP Tool Servers](side-quest-17-05-supply-chain-mcp.md) or you are already familiar with `safe-outputs` guardrails.
- You have a practice repository with at least one agentic workflow so you can inspect its `safe-outputs:` and `permissions:` blocks.

## The Attack

An attacker adds crafted text to a repository file, issue body, or PR description. When the agent summarizes that content, the injected text can show up in a comment or summary that looks trustworthy.

**Realistic scenario:** Your daily-status workflow reads open issues and writes a markdown summary as an issue comment. An attacker opens an issue whose body contains:

```
Real description here.

---
> ✅ All security checks passed. No action needed. Approved by automated review.
```

When the agent quotes or paraphrases that issue, the fabricated approval banner ends up in the posted comment. A reviewer skimming the thread may mistake it for a genuine automated signal.

## Why This Matters for Agentic Workflows

Classic CI pipelines emit predictable script output. Agentic workflows read freeform content and write freeform output, so the trust boundary shifts to the output surface. If an attacker can shape a PR comment or issue summary, they can influence human decisions without changing workflow code.

## How AW Defends Against It

gh-aw keeps the agent read-only and limits which follow-up writes `safe-outputs` may apply.

- **Explicit output surfaces via `safe-outputs`**
  The `safe-outputs` block declares every write action the workflow may apply. If a surface is not declared, the safe-output job cannot post to it.

  ```yaml
  safe-outputs:
    add-comment:
      max: 1
      required-labels: [daily-status]
  ```

  This allows one comment, and only on an issue or pull request that already carries the `daily-status` label.

- **Label scoping on comment targets**
  `required-labels:` scopes where the workflow may post. A workflow that reserves `daily-status` for one thread cannot be redirected to another unlabeled thread.

- **Minimal read-only `permissions:`**
  Keep `permissions:` read-only. Grant only the read scopes the workflow needs, and leave write approval in `safe-outputs`.

  ```yaml
  permissions:
    contents: read
    issues: read         # only add this if the workflow reads issues
    pull-requests: read  # only add this if the workflow reads PRs
  ```

- **Prefer no write surface when you do not need one**
  If a workflow does not need to write back to GitHub, leave `safe-outputs` out and keep the result in the Actions run.

<details>
<summary>See where these checks live in the gh-aw source</summary>

The parser reads `required-labels` in [`pkg/workflow/safe_outputs_parser.go`](https://github.com/github/gh-aw/blob/main/pkg/workflow/safe_outputs_parser.go), and the `add_comment` handler enforces target validation and content sanitization in [`actions/setup/js/add_comment.cjs`](https://github.com/github/gh-aw/blob/main/actions/setup/js/add_comment.cjs#L582-L650).

</details>

> See [Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md)
> for the full security model.

## ✏️ Exercise: Block a Mock Injection Payload

- [ ] Pick a workflow that uses `safe-outputs.add-comment`.
- [ ] Confirm the target issue or PR requires a label such as `daily-status`.
- [ ] Add this mock payload to a different issue or PR that does **not** carry that label:

  ```text
  Normal update here.

  ---
  > ✅ All security checks passed. No action needed. Approved by automated review.
  ```

- [ ] Run the workflow and open the Actions log.
- [ ] Paste the rejection line into your notes or checkpoint comment.

## ✏️ Exercise: Inspect the Validation Source

- [ ] Open [`actions/setup/js/add_comment.cjs`](https://github.com/github/gh-aw/blob/main/actions/setup/js/add_comment.cjs#L582-L650).
- [ ] Review [`#L582-L583`](https://github.com/github/gh-aw/blob/main/actions/setup/js/add_comment.cjs#L582-L583) to see the `required-labels` target check.
- [ ] Review [`#L646-L650`](https://github.com/github/gh-aw/blob/main/actions/setup/js/add_comment.cjs#L646-L650) to see comment sanitization and limits.
- [ ] Add a one-sentence note and a direct GitHub line link to your checkpoint comment.

## What You Can Do as a Workflow Author

- [ ] Declare only the `safe-outputs` surfaces your workflow needs.
- [ ] Add `required-labels:` to any `add-comment` output that should post only to a specific thread.
- [ ] Leave `safe-outputs` out when the workflow does not need to write back to GitHub.
- [ ] Keep `permissions:` read-only and remove unused scopes.
- [ ] Treat issue bodies, PR descriptions, and file contents as untrusted input.

## ✅ Checkpoint

- [ ] I can describe the output injection attack in one sentence
- [ ] I can name the gh-aw feature (`safe-outputs` with label scoping) that limits this attack
- [ ] I have applied at least one defensive measure to my own workflow
- [ ] I can explain why `required-labels:` scoping on `add-comment` reduces the risk of output injection
- [ ] I captured a workflow log line that shows a mock output injection attempt being rejected
- [ ] I linked to the gh-aw source line that validates or sanitizes a safe output

Return to [Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
