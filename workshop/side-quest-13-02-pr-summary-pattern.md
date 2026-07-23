<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest 13-02: Pattern — Generate a PR Summary Comment

## 🎯 What You'll Do

Build a PR summary workflow that posts a structured, human-readable summary comment when a pull request is opened. The summary is written in a format that can be copied directly into a changelog or release note.

## Before You Start

- Complete [Build Your First Event-Driven Workflow: PR Auto-Reviewer](13-pr-reviewer-workflow.md).

## Why a Structured Summary?

A free-form review comment is useful, but a structured summary is re-usable. When every PR gets a summary in the same format, teams can scrape those comments to generate changelogs automatically, hand them to release managers as draft notes, or include them in sprint retrospectives.

The key design choice here is the output template: you define the structure in the workflow brief, and the agent fills in the blanks.

## The Summary Workflow

Create `.github/workflows/pr-summary.md`:

```markdown
---
name: PR Summary Generator
on:
  pull_request:
    types: [opened]
permissions:
  pull-requests: write
  contents: read
safe-outputs:
  create-issue-comment:
    limit: 1
---

You are a changelog assistant. When a pull request is opened:

1. Read the PR title, description, and list of changed files.
2. Write a summary using exactly this template:

   ## Summary
   <!-- One sentence describing what this PR does. -->

   ## Changes
   <!-- Bullet list of the main areas touched, based on file paths. One bullet per distinct area. Maximum five bullets. -->

   ## Notes for reviewers
   <!-- One or two sentences flagging anything that needs special attention. If nothing stands out, write "No special concerns." -->

3. Post the summary as a comment on the pull request.
4. Do not add any text outside the template structure.
```

Compile and push:

```bash
gh aw compile
git add .github/workflows/pr-summary.md .github/workflows/pr-summary.lock.yml
git commit -m "feat: add PR summary generator workflow"
git push
```

## Test It

Open a test pull request. The workflow fires on `opened` only (not on every push), so you will see exactly one comment per new PR. Check that the output matches the three-section template.

## Hands-On Exercise: Customise the Template

The template above is generic. Adapt it to your team's actual workflow by changing one section.

Ideas:
- Replace **Notes for reviewers** with **Testing instructions** — ask the agent to suggest one manual test based on the changed file names.
- Add a **Breaking changes** section — ask the agent to flag any file deletion or rename that might indicate a breaking change.
- Replace **Summary** with **Ticket reference** — ask the agent to extract a ticket number from the PR title (for example `[PROJ-123]`) or write "No ticket found" if none is present.

After making your change, recompile and open a fresh PR to see the updated output.

## ✅ Checkpoint

- [ ] I created `.github/workflows/pr-summary.md` with an `opened`-only `pull_request` trigger
- [ ] `gh aw compile` completed without errors and `.lock.yml` is committed and pushed
- [ ] I opened a test PR and the workflow posted a comment matching the three-section template
- [ ] I customised at least one section of the template to fit a real use case
- [ ] I can explain why triggering only on `opened` (not `synchronize`) is the right choice for a summary workflow

<!-- journey: all -->
<!-- /journey -->
