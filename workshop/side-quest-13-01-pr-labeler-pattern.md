<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 13-01: Pattern — Auto-Label PRs by Content

## 🎯 What You'll Do

Extend your PR reviewer workflow to automatically apply GitHub labels based on the files that changed in a pull request.

## Before You Start

- Complete [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md).
- Your practice repository has at least one label already created. If not, go to **Issues → Labels** in your repository and create labels like `documentation`, `tests`, and `bug-fix`.

## Why Auto-Labelling?

Labels help teams filter and prioritise pull requests at a glance. Applying them manually is easy to forget, especially on busy repositories. An agentic labeller reads the list of changed files and applies the right labels before a human reviewer opens the PR.

The pattern is simple: map file path patterns to label names in your workflow brief, then instruct the agent to pick and apply the matching labels.

## The Labeller Workflow

Create `.github/workflows/pr-labeler.md`:

```markdown
---
name: PR Labeler
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  pull-requests: write
  contents: read
safe-outputs:
  add-labels-to-pull-request:
    limit: 5
---

You are a pull request labeller. When a pull request is opened or updated:

1. Read the list of changed files from the pull request context.
2. Apply labels to the pull request using these rules:
   - If any changed file is under `docs/` or has a `.md` extension → apply `documentation`
   - If any changed file is under `tests/` or has a `.test.` or `.spec.` pattern → apply `tests`
   - If the PR title or description contains the word "fix" or "bug" (case-insensitive) → apply `bug-fix`
3. Apply only the labels that match. Do not remove labels already present.
4. If no rule matches, do not apply any label and do not post a comment.
```

Compile and push:

```bash
gh aw compile
git add .github/workflows/pr-labeler.md .github/workflows/pr-labeler.lock.yml
git commit -m "feat: add PR labeller workflow"
git push
```

## Test It

Open a test pull request that touches a Markdown file. After the workflow runs, check the pull request sidebar — the `documentation` label should appear automatically.

Then open another PR that touches a test file and verify the `tests` label is applied.

## Hands-On Exercise

The current rules use simple path patterns. Extend the labeller to also apply a `config-change` label when any file under `.github/` or named `*.yaml` / `*.yml` changes.

<details>
<summary>Show one way to add this rule</summary>

Add this rule to the workflow brief:

```text
- If any changed file is under `.github/` or has a `.yaml` or `.yml` extension → apply `config-change`
```

Compile, push, and test with a PR that changes a workflow file.

</details>

## ✅ Checkpoint

- [ ] I created `.github/workflows/pr-labeler.md` with a `pull_request` trigger
- [ ] `gh aw compile` completed without errors and `.lock.yml` is committed and pushed
- [ ] I opened a test PR and the workflow applied the correct label automatically
- [ ] I can explain why `safe-outputs: add-labels-to-pull-request` is the right surface for this pattern
- [ ] I extended the labeller to handle at least one additional file-path rule

<!-- journey: all -->
<!-- /journey -->
