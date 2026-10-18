<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Control Who Can Reuse Your Workflow Template

> _Before you hand teammates a `gh aw add` command, make sure they can actually read it, get the version you intend, and know what to customise._

## :dart: What You'll Do

You'll learn the four things that decide whether a shared workflow template works for other people: repository access, the `private: true` frontmatter field, version pinning, and a short template hint at the top of the file.

## :clipboard: Before You Start

- You have a workflow committed in a GitHub repository, as in [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md).

## Steps

### Confirm teammates can read the source repository

`gh aw add` fetches a workflow Markdown file from a GitHub repository. Any `.md` file in a `.github/workflows/` folder can act as a template — public, private, or internal all work the same way, as long as the person running `gh aw add` can read that repository (including on GHES or within an internal-visibility organization).

> [!TIP]
> <details>
> <summary><b>Enterprise users (GHES, GHEC, EMU): confirm cross-repository and cross-org access before sharing.</b></summary>
>
> `gh aw add` only works if the account running it has read access to the source repository. On GHES or within an EMU organization, that often means the source and destination repositories must be in the same enterprise instance, and any org-level repository visibility restrictions (private, internal, or outside-collaborator policies) still apply. If your admin restricts cross-org forking or outside collaborators, confirm with them which organizations can read your shared "workflows" repo before advertising the `gh aw add` command to a wider team.
>
> </details>

### Block reuse on purpose with `private: true`

A workflow with `private: true` in its frontmatter cannot be added to another repository with `gh aw add`, even if the source repository itself is readable.

```markdown .github/workflows/internal-report.md
---
private: true
---
```

Use it on workflows that contain repository-specific logic you don't want teammates copying elsewhere. Leave it unset (the default) on anything you intend to share as a template.

### Pin a version for stable rollouts

Add a tag or commit SHA after `@` so teammates get exactly the version you tested:

```bash
gh aw add jsmith/my-workshop/daily-status@v1.0
```

This is useful when you want to guarantee stability for a team-wide rollout.

### Add a template hint

Add a short comment at the top of the workflow's Markdown task brief so users know what to customise:

```markdown .github/workflows/daily-status.md
<!-- TEMPLATE: Replace "my-repo" with your repository name.
     Adjust the schedule and permissions to match your needs. -->
```

> [!NOTE]
> The recipient still needs to compile the workflow (`gh aw compile`) and push it before GitHub Actions will run it. Remind your team of that step.

## :white_check_mark: Checkpoint

- [ ] You know the person running `gh aw add` must be able to read the source repository
- [ ] You can explain what `private: true` does and when to leave it unset
- [ ] You know how to pin a template with `@<tag-or-sha>`
- [ ] Your template has a short hint listing what to customise

<!-- journey: all -->
**Return to the main adventure:** [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md)
<!-- /journey -->
