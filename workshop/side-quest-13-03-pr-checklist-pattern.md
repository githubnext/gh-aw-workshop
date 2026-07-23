<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 13-03: Pattern — PR Review Checklist

## 🎯 What You'll Do

Build a workflow that evaluates every new pull request against a short review checklist and posts a pass/fail summary. Reviewers can see at a glance which criteria are already met before they open the diff.

## Before You Start

- Complete [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md).

## Why a Checklist Workflow?

Review checklists enforce team standards consistently. Instead of relying on every reviewer to remember to check the same things, you automate the inspection and surface the results as a comment. Reviewers can then focus their time on the things that require human judgment.

The pattern is a structured evaluation loop: for each item on the checklist, the agent decides whether the PR satisfies the criterion, explains its reasoning in one sentence, and marks it with ✅ (pass) or ⚠️ (needs attention).

## The Checklist Workflow

Create `.github/workflows/pr-checklist.md`:

```markdown
---
name: PR Review Checklist
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  pull-requests: write
  contents: read
safe-outputs:
  create-issue-comment:
    limit: 1
---

You are a code review assistant. When a pull request is opened or updated, evaluate it
against the checklist below. For each item, write one sentence of evidence and mark it
✅ (criterion clearly met) or ⚠️ (cannot confirm from available context).

Checklist:

- **Description**: The PR description explains *what* changed and *why*.
- **Scope**: The PR is focused on a single concern (not a mix of features, fixes, and refactors).
- **Tests**: At least one test file is included or updated (based on file names).
- **Documentation**: If any public interface or user-facing file changed, a `.md` file is also present.
- **Size**: The PR touches fewer than 20 files.

Post the results as a comment on the pull request using this format:

## Review Checklist

| Criterion | Result | Evidence |
|-----------|--------|----------|
| Description | ✅ / ⚠️ | _one sentence_ |
| Scope | ✅ / ⚠️ | _one sentence_ |
| Tests | ✅ / ⚠️ | _one sentence_ |
| Documentation | ✅ / ⚠️ | _one sentence_ |
| Size | ✅ / ⚠️ | _one sentence_ |

Do not add any text outside the table and heading.
```

Compile and push:

```bash
gh aw compile
git add .github/workflows/pr-checklist.md .github/workflows/pr-checklist.lock.yml
git commit -m "feat: add PR review checklist workflow"
git push
```

## Test It

Open a test pull request with no description and no test files. The workflow should post a checklist with **Description** and **Tests** marked ⚠️. Then update the PR description and push a new commit — the workflow fires again (on `synchronize`) and the checklist should re-evaluate.

## Hands-On Exercise: Add a Team-Specific Criterion

The five criteria above are generic. Replace one with something meaningful for your practice repository.

Ideas:
- **Changelog**: A `CHANGELOG.md` entry was added or updated.
- **Screenshot**: If any UI file changed, a screenshot is linked in the PR description.
- **Ticket link**: The PR title or description contains a reference to an issue number (`#NNN`).

Update the checklist in the workflow brief, recompile, and open a fresh PR to verify the new criterion appears in the table.

## ✅ Checkpoint

- [ ] I created `.github/workflows/pr-checklist.md` with a `pull_request` trigger
- [ ] `gh aw compile` completed without errors and `.lock.yml` is committed and pushed
- [ ] I opened a test PR without a description and confirmed **Description** was marked ⚠️
- [ ] I updated the PR description and confirmed the checklist refreshed on the next push
- [ ] I added at least one team-specific criterion to the checklist
- [ ] I can explain why using ✅ / ⚠️ instead of pass/fail makes the output more constructive

<!-- journey: all -->
<!-- /journey -->
