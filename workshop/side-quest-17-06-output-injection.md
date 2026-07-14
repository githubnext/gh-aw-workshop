# Side Quest: Output Injection via Safe Outputs

> _Output injection is when an agent embeds misleading or harmful content into its output — and gh-aw's safe-outputs block constrains exactly where and how that output lands._

## The Attack

An agent that reads untrusted repository content — issue bodies, PR descriptions, commit messages, or file contents — can be tricked into including that content verbatim in its output.

When that output surfaces in a PR body, issue comment, or review, a reviewer may see what looks like official commentary but is actually attacker-controlled text.

For example, an issue might contain `**SECURITY APPROVED — MERGE IMMEDIATELY**` in a markdown block. If the agent copies it into a PR review comment, a distracted reviewer could act on it as though it were genuine workflow output.

## Why This Matters for Agentic Workflows

Classic CI/CD pipelines run scripts with fixed logic — they do not synthesize free-text output from repository content. Agentic workflows, by contrast, ask the AI model to read issues, PRs, and code and then express its analysis in natural language. That means the agent is a potential amplifier: attacker-controlled input text can be reflected into a trusted-looking surface (a comment left by your bot) where reviewers may give it more weight than the original source.

The risk is higher in agentic workflows because the output surfaces look authoritative. A comment posted by `github-actions[bot]` on a PR carries implicit trust. Injected content that reaches that surface can:

- mislead reviewers into treating attacker text as trusted analysis
- trigger false approvals based on fabricated urgency
- embed links to phishing pages inside what appears to be a workflow-generated report

## How AW Defends Against It

- **Constrained output surfaces via `safe-outputs`.**
  The `safe-outputs:` block in frontmatter declares exactly which surfaces the agent may write to (`create-pull-request`, `add-comment`, `close-pull-request`, etc.). The runtime blocks writes to undeclared surfaces, so the agent cannot silently post to a new location.

- **Output schemas and field limits.**
  Each `safe-outputs` operation accepts a declared set of fields (title, body, labels). The model cannot invent new fields or write to arbitrary API endpoints; only the declared outputs are forwarded.

- **No raw pass-through.**
  The agent synthesizes output; it does not pipe repository content byte-for-byte to an output surface. The safe-outputs layer sits between the agent's text and the GitHub API call, giving the runtime a checkpoint.

- **Minimal permissions reduce blast radius.**
  Declaring only the permissions you need (for example `issues: write` but not `pull-requests: write`) means injected output that tries to reach a different surface is blocked at the permission layer even before safe-outputs is checked.

Example frontmatter showing a tightly scoped output surface:

```yaml
permissions:
  issues: write

safe-outputs:
  add-comment:
    surfaces:
      - issues
```

With this configuration the agent can only post comments on issues. It cannot open PRs, push code, or write to any other surface — even if adversarial content in an issue body instructs it to.

> See [Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md)
> for the full security model.

## What You Can Do as a Workflow Author

- **Declare only the output surfaces your workflow genuinely needs.** Remove `pull-requests: write` if you only post issue comments.
- **Scope `safe-outputs` to one operation type.** A daily-status workflow that only posts issue comments does not need `create-pull-request` listed.
- **Treat all repository content as untrusted.** Write your task brief to summarize and analyze, not to quote content verbatim into the output.
- **Review agent output before merging.** When the agent posts a PR body or review comment, read it critically — look for unusual markdown formatting, unexpected urgency language, or embedded links that your brief would not produce.
- **Enable log review.** GitHub Actions logs capture the full agent reasoning trace. Spot-check a run against an issue or PR body that contains unusual content.

## ✅ Checkpoint

- [ ] I can describe the output injection attack in one sentence
- [ ] I can name the gh-aw feature that limits this attack
- [ ] I have applied at least one defensive measure to my own workflow

Return to [Give Your Agent More Tools with MCP](17-add-mcp-tools.md).
