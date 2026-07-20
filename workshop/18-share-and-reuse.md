<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Share and Reuse Your Agentic Workflows

> _Your workflow is worth more than one repository — learn how to turn it into a reusable template your whole team can adopt._

## 🎯 What You'll Do

You'll copy your finished workflow file into a shared location so that teammates can add it to their own repositories with a single command. By the end of this step you'll have a reusable workflow template and know how to distribute it.

## 📋 Before You Start

- You have a working agentic workflow (completed [Schedule It to Run Every Day](13-schedule-it.md) or any of the build steps).
- You have push access to at least one repository where you want to share the workflow (this can be the same practice repo).

## Steps

### Understand how gh-aw templates work

When you run `gh aw add`, the extension fetches a workflow Markdown file directly from a GitHub repository. Any `.md` file in a `.github/workflows/` folder of a public (or accessible) repo can act as a template.

That means **your workflow is already a template** — you just need to point people at it.

### Choose a sharing destination

You have two options:

| Goal | Where to put the workflow |
|------|--------------------------|
| Share within your team | A shared "workflows" repo in your GitHub organization (e.g. `your-org/workflow-templates`) |
| Share publicly | Any public repository — even the one you've been working in |

For this step, you'll use your own practice repository. If you later want to move the template to a dedicated repo, the process is identical.

### Verify your workflow file is committed

Your workflow lives at `.github/workflows/<name>.md` in your repository. Make sure the latest version is committed and pushed.

#### Terminal path — verify with Git

```bash
git status
git log --oneline -3
```

If you see uncommitted changes, commit them now before sharing.

#### GitHub UI path — verify in the browser

1. Navigate to your repository on GitHub.
2. Browse to `.github/workflows/`.
3. Confirm your workflow `.md` file appears in the file list with your most recent changes.

### Share the `gh aw add` command

Once your workflow is pushed, give teammates this one-liner to add it to their own repository:

```bash
gh aw add <your-github-username>/<your-repo>/<workflow-name>
```

For example, if your username is `jsmith`, your repo is `my-workshop`, and your workflow file is `daily-status.md`:

```bash
gh aw add jsmith/my-workshop/daily-status
```

Your teammate runs this inside their repository. `gh aw add` copies the Markdown file into their `.github/workflows/` folder and they can then edit and compile it for their own context.

> [!TIP]
> You can also pin to a specific version using a tag or commit SHA: `gh aw add jsmith/my-workshop/daily-status@v1.0`. This is useful when you want to guarantee stability for a team-wide rollout.

### Document your template

Add a short comment at the top of your workflow's Markdown task brief so users know what to customise:

```markdown
<!-- TEMPLATE: Replace "my-repo" with your repository name.
     Adjust the schedule and permissions to match your needs. -->
```

This hint saves teammates guesswork when they first open the file.

> [!NOTE]
> The recipient still needs to compile the workflow (`gh aw compile`) and push it before GitHub Actions will run it. Remind your team of that step.

## ✅ Checkpoint

- [ ] Your workflow `.md` file is committed and pushed to a GitHub repository
- [ ] You can construct the `gh aw add` command for your workflow
- [ ] You've added a brief template comment explaining what to customise
- [ ] A teammate (or you in a second repo) has successfully imported the template with `gh aw add`

<!-- journey: all -->
**Next:** [What's Next? Keep Exploring](14-next-steps.md)
<!-- /journey -->

For more details, see [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/), [Reusing workflows guide](https://github.github.com/gh-aw/guides/reusing-workflows/), and [Triggers reference](https://github.github.com/gh-aw/reference/triggers/).

