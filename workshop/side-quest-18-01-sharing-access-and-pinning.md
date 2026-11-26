<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Sharing Workflows — Access, Visibility, and Version Pinning

> _Optional: take this detour to make sure the teammates you share a workflow with can actually add it, and that they get the version you intended._

## :dart: What You'll Do

You'll check who can read a shared workflow, decide whether it should be shareable at all, and learn how to pin teammates to a specific version.

## :clipboard: Before You Start

- You have completed or are working through [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md).
- You have a workflow file pushed to `.github/workflows/` in a repository you control.

## Steps

### Know who can run `gh aw add`

`gh aw add` fetches a workflow Markdown file from a GitHub repository. It works when the account running it can read that repository, whether the repository is public, private, or internal.

| Where the workflow lives | Who can add it |
|--------------------------|----------------|
| Public repository | Anyone |
| Private repository | Accounts with read access to that repository |
| Internal repository | Members of the owning enterprise or organization |

### Decide whether a workflow should be shareable

A workflow with `private: true` in its frontmatter cannot be added to another repository with `gh aw add`, even when the source repository is readable.

```markdown .github/workflows/repo-specific.md
---
private: true
---
```

Use `private: true` on workflows that contain repository-specific logic you don't want teammates copying elsewhere. Leave it unset (the default) on anything you intend to share as a template.

### Check enterprise access (GHES, GHEC, EMU)

On GitHub Enterprise Server or within an Enterprise Managed Users organization, the source and destination repositories often need to be in the same enterprise instance. Organization-level visibility rules (private, internal, outside collaborators) still apply.

Before you advertise a `gh aw add` command to a wider team:

1. Confirm which organizations can read your shared workflows repository.
2. Ask your administrator if cross-org forking or outside collaborators are restricted.
3. Test the command from a second account that represents a typical teammate.

For broader enterprise guidance, see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).

### Pin a version for a stable rollout

By default, `gh aw add` fetches the latest version of the file. Add `@<tag-or-sha>` to lock teammates to a specific release:

```bash
gh aw add jsmith/my-workshop/daily-status@v1.0
```

Use a tag when you want a readable release name. Use a commit SHA when you need an exact, immutable snapshot. Pinning is helpful for team-wide rollouts where an unexpected change to the source would surprise everyone.

## :white_check_mark: Checkpoint

- [ ] You can name who can run `gh aw add` for a public, private, and internal repository
- [ ] You know that `private: true` blocks `gh aw add` for that workflow
- [ ] You know the enterprise access checks to make before sharing
- [ ] You can write a `gh aw add` command pinned to a tag or commit SHA

**Return to the main adventure:** [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md)
