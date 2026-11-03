<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Cross-repository safe outputs with target-repo and allowed-repos</focus>
  <sources>
    <source>https://github.github.com/gh-aw/reference/cross-repository/</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
    <source>https://github.github.com/gh-aw/reference/auth/</source>
  </sources>
  <rationale>Steps 1-30 keep every write inside the learner's own repository. Teams, and especially enterprise learners with many repositories, often want one agent to report into a central tracking repository. gh-aw supports this with target-repo and allowed-repos on safe outputs plus an extra token. This step teaches the hub-and-spoke pattern and pairs it with staged mode from step 30.</rationale>
</research-metadata>
-->

# Send Agent Results to Another Repository

> _Let one workflow report into a central repository instead of cluttering the one it runs in._

## :dart: What You'll Do

You'll change a workflow so its safe output creates an issue in a different repository, such as a team tracking repo. You'll preview the result with staged mode before any real write happens.

By default, [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) only write to the repository where the workflow runs. Cross-repository settings widen that on purpose, so you choose exactly where the agent may write.

## :clipboard: Before You Start

- You completed [Preview Your Workflow's Writes with Staged Mode](30-preview-with-staged-mode.md).
- You have a second repository you can write to, such as `your-org/tracking-repo`.

## Steps

### Understand the two settings

- `target-repo` names the single repository where an output lands.
- `allowed-repos` lists extra repositories the agent may choose between at run time.

The built-in `GITHUB_TOKEN` can only write to the current repository. Cross-repository writes need an additional token stored as a repository secret.

> [!NOTE]
> Enterprise users (GHES, GHEC, EMU): your organization may restrict personal access tokens or require a GitHub App. Confirm which credential type your administrators allow before you create the secret. See the [authentication reference](https://github.github.com/gh-aw/reference/auth/).

### Create the secret

1. Create a fine-grained personal access token that is limited to the tracking repository, with **Issues: Read and write** permission.
1. In your practice repository, open **Settings** > **Secrets and variables** > **Actions**.
1. Select **New repository secret**, name it `CROSS_REPO_PAT`, and paste the token.

### Point the safe output at the other repository

Open your Copilot CLI in the Codespace terminal and paste this prompt after typing `/agentic-workflows`:

```prompt
Change daily-status to create its issue in your-org/tracking-repo using the CROSS_REPO_PAT secret, and stage it first.
```

The result should include a `safe-outputs:` block shaped like this:

```yaml
safe-outputs:
  staged: true
  github-token: ${{ secrets.CROSS_REPO_PAT }}
  create-issue:
    target-repo: "your-org/tracking-repo"
    title-prefix: "[status] "
```

Replace `your-org/tracking-repo` with your own repository.

### Compile and run

1. Recompile in the terminal:

   ```bash
   gh aw compile
   ```

1. Open the **Actions** tab, select your workflow, and choose **Run workflow**.
1. When the run finishes, open the run summary and find the 🎭 preview. It should name the tracking repository.

### Go live

Ask your agent to remove `staged: true`, recompile, and run again. The issue now appears in the tracking repository, not in your practice repository.

> [!TIP]
> Add `allowed-repos: ["your-org/repo-a", "your-org/repo-b"]` under `create-issue:` when the agent should pick a destination. Anything not on the list is rejected.

## :white_check_mark: Checkpoint

- [ ] You created a `CROSS_REPO_PAT` secret scoped to one repository
- [ ] Your compiled workflow sets `target-repo` under `create-issue:`
- [ ] The staged 🎭 preview named the tracking repository before any real write
- [ ] After removing staging, a new issue appeared in the tracking repository
- [ ] You can explain why `target-repo` is safer than letting the agent write anywhere

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
