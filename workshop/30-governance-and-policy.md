<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Governing agentic workflows at scale — organization policy, allowlisted engines/domains, and enterprise controls for who can author and run workflows</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://github.github.com/gh-aw/guides/governance/</source>
    <source>https://github.github.com/gh-aw/guides/using-at-scale/</source>
    <source>https://github.github.com/gh-aw/reference/permissions/</source>
  </sources>
  <rationale>Step 29 (skills) is currently an open leaf with no successor. The curriculum already teaches individual-workflow controls (permissions, safe-outputs, cost budgets, self-hosted runners) but nothing addresses organization-wide governance: who can approve new workflows, how to enforce a shared policy across many repositories, and how enterprise admins keep agentic workflows compliant at scale. This closes that gap and, per the enterprise tie-break rule, is prioritized because it serves GHEC/GHES admins directly.</rationale>
</research-metadata>
-->

# Govern Agentic Workflows Across Your Organization

> _One workflow is easy to review by hand — a hundred repositories running agentic workflows need a shared policy instead._

## :dart: What You'll Do

You'll learn how organizations enforce consistent rules across every agentic workflow — required reviewers, allowed engines, and mandatory `safe-outputs` — using repository rulesets and a shared policy checklist. By the end, you'll know what to ask your GitHub admin for before rolling out agentic workflows to a whole team.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You understand how `permissions:` and `safe-outputs:` scope a single workflow's authority.

## Steps

### Understand why individual review doesn't scale

So far, you've reviewed each workflow's frontmatter yourself: minimal `permissions:`, an explicit `safe-outputs:` list, `network.allowed`. That works for one repository. Once dozens of teams each maintain their own `daily-status.md`, a single reviewer can't check every compiled `.lock.yml` by hand.

**Governance** replaces manual, per-file review with organization-level rules every workflow must satisfy before it can run — enforced automatically, not just recommended in a doc.

> [!NOTE]
> Governance sits on top of the per-workflow controls you already learned. It doesn't replace `permissions:` or `safe-outputs:` — it makes sure every repository actually uses them.

### Identify the three governance levers

1. **Required review** — a branch protection rule or CODEOWNERS entry requiring approval before a `.github/workflows/*.lock.yml` change merges.
2. **Approved engine and model list** — an org policy restricting which `engine:` values (`copilot`, `claude`, `codex`) workflows may use, so spend and data-handling stay predictable.
3. **Mandatory safe-outputs and network allowlists** — a CI check that fails a pull request if a workflow grants write permissions directly instead of routing through `safe-outputs:`, or omits `network.allowed`.

### Add a lightweight policy check

Add a check to your own repository that fails if a compiled lock file grants raw write permissions instead of using `safe-outputs`:

```bash
grep -L "safe-outputs:" .github/workflows/*.md
```

Any file listed by this command has no `safe-outputs:` block — flag it for review before merging.

> [!TIP]
> For a full enterprise rollout, wire this same check into a required status check on your branch protection rule, so it runs on every pull request automatically instead of manually.

### Confirm required reviewers are in place

Check whether your repository already requires a review before workflow changes merge:

```bash
gh api repos/{owner}/{repo}/branches/main/protection --jq '.required_pull_request_reviews'
```

If this returns `null` or an error, no branch protection rule exists yet. Ask your GitHub admin to add one that requires at least one approval for changes under `.github/workflows/`.

> [!NOTE]
> _(Enterprise users)_ GHEC and GHES organizations can enforce these same rules — required reviewers, approved engines, and mandatory `safe-outputs` — across every repository at once with an organization ruleset, instead of configuring each repository individually.

### Draft your own workflow policy checklist

Write down the three rules your team will enforce, in plain language, before you scale past one repository:

- [ ] Every `.github/workflows/*.lock.yml` change requires one approval.
- [ ] Only these engines are approved: _(list yours, e.g. `copilot`)_.
- [ ] Every workflow must declare `safe-outputs:` and `network.allowed` — no exceptions.

## :white_check_mark: Checkpoint

- [ ] You can explain why per-file manual review doesn't scale to many repositories
- [ ] You identified the three governance levers: required review, approved engines, mandatory safe-outputs
- [ ] You ran a check that flags workflows missing a `safe-outputs:` block
- [ ] You checked whether your repository has a required-reviewer branch protection rule
- [ ] You drafted a three-item policy checklist for your team
- [ ] You know that enterprise organizations can enforce these rules with an organization-wide ruleset

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
