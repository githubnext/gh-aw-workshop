<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Concurrency control — keeping overlapping runs of the same agentic workflow from colliding</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/concurrency/</source>
  </sources>
  <rationale>Steps 14b, 22, 26, and 28 trigger workflows on busy events, but no step explains what happens when two runs start at once. Enterprise teams with busy repositories and shared runner pools need a hands-on step that shows the default grouping, then overrides it deliberately.</rationale>
</research-metadata>
-->

# Control Overlapping Runs with Concurrency

> _Stop two runs of the same workflow from stepping on each other, wasting tokens, or posting duplicate comments._

## :dart: What You'll Do

You'll read the concurrency group that `gh aw compile` generates for one of your workflows. Then you'll override it so newer runs replace outdated ones. When you finish, you'll know how to keep busy repositories calm and your AI credit usage predictable.

## :clipboard: Before You Start

- An event-driven workflow from [Step 14b](14b-pr-reviewer-workflow.md) in your Codespace
- Familiarity with `gh aw compile` from [Step 7](07-your-first-workflow.md)

## Steps

### Understand concurrency groups

A **concurrency group** is a name that GitHub Actions uses to decide which runs belong together. Runs in the same group wait in line or cancel each other. Runs in different groups happen side by side.

`gh-aw` builds a [default group](https://github.github.com/gh-aw/reference/concurrency/) for you from the workflow name plus the trigger context:

| Trigger | Group is based on | Cancels older runs? |
|---------|-------------------|---------------------|
| Issues | Workflow and issue number | No |
| Pull requests | Workflow and PR number | Yes |
| Push | Workflow and branch | No |
| Schedule or manual | Workflow only | No |

That means your PR reviewer from Step 14b already cancels an outdated review when you push a new commit. Two different PRs still run at the same time.

### Find the group in your lock file

Open `.github/workflows/pr-reviewer.lock.yml` (use your own workflow's name if it differs) and search for `concurrency:`. You'll see a group name that starts with `gh-aw-`. Every run that shares that name shares a slot.

### Override the group

Open your workflow's `.md` file and add a `concurrency:` section to the frontmatter:

```yaml
concurrency:
  group: pr-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

This says: for each pull request, keep only the newest run. The older one stops, so you don't pay for a review nobody will read.

> [!TIP]
> Use `cancel-in-progress: true` for work that is only useful for the latest input, such as reviews. Leave it off for work that must finish, such as a run that creates an issue.

### Queue instead of dropping runs

When back-to-back triggers must all be processed, queue them. Setting `queue: max` runs every pending trigger in arrival order:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  queue: max
```

> [!NOTE]
> GitHub Actions rejects `queue: max` together with `cancel-in-progress: true`. Pick one behavior per group.

### Serialize your writes

If two runs could create the same issue or pull request, serialize the safe-outputs job. Add this key at the top of your `safe-outputs:` section, then keep your existing outputs below it:

```yaml
safe-outputs:
  concurrency-group: "safe-outputs-${{ github.repository }}"
```

### Recompile and test

Compile, then commit both files:

```bash
gh aw compile
```

Open a pull request, push two quick commits, and watch the **Actions** tab. The first run should show **Cancelled** once the second one starts.

## :white_check_mark: Checkpoint

- [ ] You found the generated `gh-aw-` concurrency group in a `.lock.yml` file
- [ ] Your workflow's frontmatter has a `concurrency:` section with a group name
- [ ] `gh aw compile` succeeded and you committed the `.md` and `.lock.yml` files
- [ ] Two quick pushes showed an older run cancelled in the **Actions** tab
- [ ] You can explain when to cancel older runs and when to queue them

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
