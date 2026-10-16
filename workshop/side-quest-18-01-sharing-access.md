<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Who Can Use Your Shared Workflow Template?

> _Know exactly who can run `gh aw add` against your workflow — and how to keep a repository-specific workflow from being copied._

## :dart: What You'll Do

You'll learn the access rules that decide whether a teammate can add your workflow as a template, choose where to host it, and decide when to block reuse with `private: true`.

## :clipboard: Before You Start

- You are working through [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md), or have a workflow you plan to share.

## Steps

### Understand what makes a workflow a template

When you run `gh aw add`, the extension fetches a workflow Markdown file directly from a GitHub repository. Any `.md` file in a `.github/workflows/` folder of a repository you have read access to can act as a template — public, private, or internal all work the same way, as long as the person running `gh aw add` can read that repository (including on GHES or within an internal-visibility organization).

That means **your workflow is already a template** — you just need to point people at it.

### Choose a sharing destination

| Goal | Where to put the workflow |
|------|--------------------------|
| Share within your team | A shared "workflows" repo in your GitHub organization (e.g. `your-org/workflow-templates`) — private or internal visibility both work |
| Share publicly | Any public repository — even the one you've been working in |

If you later move the template to a dedicated repository, the `gh aw add` process is identical — only the repository path in the command changes.

### Block reuse when a workflow is repository-specific

One frontmatter field blocks reuse on purpose: a workflow with `private: true` in its frontmatter cannot be added to another repository with `gh aw add`, even if the source repository itself is readable.

```markdown .github/workflows/internal-report.md
---
private: true
---
```

Use `private: true` on workflows that contain repository-specific logic you don't want teammates copying elsewhere. Leave it unset (the default) on anything you intend to share as a template.

### Check access in enterprise environments

`gh aw add` only works if the account running it has read access to the source repository. On GHES or within an EMU organization, that often means:

- the source and destination repositories must be in the same enterprise instance
- org-level repository visibility restrictions (private, internal, or outside-collaborator policies) still apply
- if your admin restricts cross-org forking or outside collaborators, confirm with them which organizations can read your shared "workflows" repository before you advertise the `gh aw add` command to a wider team

For more setup guidance, see [Enterprise Setup Considerations](side-quest-enterprise-setup.md).

## :white_check_mark: Checkpoint

- [ ] You know any readable `.github/workflows/*.md` file can act as a template
- [ ] You can choose between a team "workflows" repository and a public repository
- [ ] You know `private: true` blocks `gh aw add` for repository-specific workflows
- [ ] You know to confirm cross-org read access before sharing in an enterprise

**Return to the main adventure:** [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md)
