---
emoji: 📦
name: Manual SemVer Release
description: Creates a GitHub release from the current ref by bumping patch, minor, or major and generating an AI-written change summary.
on:
  workflow_dispatch:
    inputs:
      bump:
        description: Which semantic version segment to increment
        required: true
        type: choice
        options:
          - patch
          - minor
          - major
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
strict: true
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
steps:
  - name: Capture trigger context
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      jq -n \
        --arg repository "$GITHUB_REPOSITORY" \
        --arg ref_name "$GITHUB_REF_NAME" \
        --arg sha "$GITHUB_SHA" \
        --arg bump "${{ github.event.inputs.bump }}" \
        '{
          repository: $repository,
          ref_name: $ref_name,
          sha: $sha,
          bump: $bump
        }' > /tmp/gh-aw/data/release-trigger.json
safe-outputs:
  jobs:
    create-release:
      description: Create the GitHub tag and release from the version and notes computed by the agent.
      output: Release created successfully.
      inputs:
        tag:
          description: Semantic version tag to create, including the leading v.
          required: true
          type: string
        title:
          description: Release title shown in GitHub Releases.
          required: true
          type: string
        body:
          description: Markdown release notes body.
          required: true
          type: string
        target:
          description: Commit SHA or ref to tag. Defaults to the triggering SHA.
          required: true
          type: string
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        - name: Create GitHub release
          uses: actions/github-script@v7
          with:
            script: |
              const fs = require('fs');
              const outputPath = process.env.GH_AW_AGENT_OUTPUT;

              if (!outputPath) {
                core.setFailed('GH_AW_AGENT_OUTPUT is not set');
                return;
              }

              if (!fs.existsSync(outputPath)) {
                core.setFailed(`GH_AW_AGENT_OUTPUT file not found: ${outputPath}`);
                return;
              }

              const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
              const items = (payload.items || []).filter(item => item.type === 'create_release');

              if (items.length !== 1) {
                core.setFailed(`Expected exactly 1 create_release item, got ${items.length}`);
                return;
              }

              const item = items[0];
              const owner = context.repo.owner;
              const repo = context.repo.repo;
              const tag = String(item.tag || '').trim();
              const title = String(item.title || tag).trim();
              const body = String(item.body || '').trim();
              const target = String(item.target || context.sha).trim();

              if (!/^v?\d+\.\d+\.\d+$/.test(tag)) {
                core.setFailed(`Invalid semver tag: ${tag}`);
                return;
              }

              if (!body) {
                core.setFailed('Release body must not be empty');
                return;
              }

              const normalizedTag = tag.startsWith('v') ? tag : `v${tag}`;

              try {
                await github.rest.repos.getReleaseByTag({ owner, repo, tag: normalizedTag });
                core.setFailed(`Release ${normalizedTag} already exists`);
                return;
              } catch (error) {
                if (error.status !== 404) throw error;
              }

              try {
                await github.rest.git.getRef({ owner, repo, ref: `tags/${normalizedTag}` });
                core.setFailed(`Tag ${normalizedTag} already exists`);
                return;
              } catch (error) {
                if (error.status !== 404) throw error;
              }

              await github.rest.git.createRef({
                owner,
                repo,
                ref: `refs/tags/${normalizedTag}`,
                sha: target,
              });

              await github.rest.repos.createRelease({
                owner,
                repo,
                tag_name: normalizedTag,
                target_commitish: target,
                name: title,
                body,
                draft: false,
                prerelease: false,
                generate_release_notes: false,
              });
network:
  allowed:
    - defaults
    - github
---

# Manual SemVer Release

## Current Context

Read `/tmp/gh-aw/data/release-trigger.json` for the repository, requested bump, triggering ref name, and triggering SHA.

## Task

Create exactly one GitHub release for the current ref using semantic versioning.

1. Inspect the repository's existing tags or releases and find the latest stable tag that matches `vMAJOR.MINOR.PATCH` or `MAJOR.MINOR.PATCH`.
2. Ignore non-semver tags.
3. If no prior semver tag exists, use `v0.0.0` as the baseline.
4. Compute the next version from the `bump` value in `release-trigger.json`:
   - `patch` → increment patch only
   - `minor` → increment minor and reset patch to `0`
   - `major` → increment major and reset minor and patch to `0`
5. Use a leading `v` in the new tag name.
6. Semver-sort the matching tags and choose the highest stable version.
7. Summarize the most important changes since the previous semver release. Prefer merged pull requests, release-worthy commits, and notable documentation or workflow updates. If there is no previous semver release, summarize the repository's current state instead.
8. Keep the release notes concise, factual, and written in GitHub-flavored markdown.

## Required Release Notes Format

Use this structure for the release body:

```markdown
## Highlights
- ...

## Changes since <previous tag or start>
- ...
```

If there are no meaningful code or content changes since the latest semver release, if you cannot safely determine the next version, or if the computed tag already exists, call `noop` with a brief explanation instead of creating a duplicate release.

## Safe Output

When you are ready, call `create_release` exactly once with:

- `tag` — the new version tag, including the leading `v`
- `title` — usually the same as the tag
- `body` — the markdown release notes
- `target` — the commit SHA or ref to tag; use the triggering SHA from `release-trigger.json` unless you have a clear reason not to

Do not create releases directly with `gh` or any write-capable GitHub tool from the main agent job.
