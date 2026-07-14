---
emoji: 📦
name: Manual SemVer Release
description: Creates a GitHub release from the current ref by bumping patch, minor, or major and generating AI-polished release notes from a deterministic change list.
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
env:
  RELEASE_TRIGGER_PATH: /tmp/gh-aw/data/release-trigger.json
  RELEASE_PLAN_PATH: /tmp/gh-aw/data/release-plan.json
  RELEASE_DESCRIPTION_PATH: /tmp/gh-aw/data/release-description.md
strict: true
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
steps:
  - name: Capture trigger context
    env:
      BUMP: ${{ github.event.inputs.bump }}
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      jq -n \
        --arg repository "$GITHUB_REPOSITORY" \
        --arg ref_name "$GITHUB_REF_NAME" \
        --arg sha "$GITHUB_SHA" \
        --arg bump "$BUMP" \
        '{
          repository: $repository,
          ref_name: $ref_name,
          sha: $sha,
          bump: $bump
        }' > "$RELEASE_TRIGGER_PATH"
  - name: Compute release plan
    uses: actions/github-script@v7
    env:
      BUMP: ${{ github.event.inputs.bump }}
      TARGET_SHA: ${{ github.sha }}
    with:
      script: |
        const fs = require('fs');
        const path = require('path');
        const { execFileSync, spawnSync } = require('child_process');

        const planPath = process.env.RELEASE_PLAN_PATH;
        const descriptionPath = process.env.RELEASE_DESCRIPTION_PATH;
        const bump = process.env.BUMP;
        const target = process.env.TARGET_SHA;
        const owner = context.repo.owner;
        const repo = context.repo.repo;

        const runGitCommand = (...args) => {
          try {
            return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
          } catch (error) {
            const stdout = typeof error === 'object' && error !== null && 'stdout' in error ? error.stdout : '';
            const stderr = typeof error === 'object' && error !== null && 'stderr' in error ? error.stderr : '';
            const output = [stdout, stderr]
              .map(value => value && String(value).trim())
              .filter(Boolean)
              .join('\n');
            throw new Error(`Command failed: ${args.join(' ')}${output ? `\n${output}` : ''}`);
          }
        };
        const runGitCommandLines = (...args) => {
          const text = runGitCommand(...args);
          return text ? text.split(/\r?\n/).filter(line => line.trim()) : [];
        };
        const isMissingGitHubResource = async request => {
          try {
            await request();
            return false;
          } catch (error) {
            if (error.status === 404) {
              return true;
            }
            throw error;
          }
        };

        fs.mkdirSync(path.dirname(planPath), { recursive: true });
        fs.mkdirSync(path.dirname(descriptionPath), { recursive: true });
        runGitCommand('git', 'fetch', '--force', '--tags', 'origin');

        const semverPattern = /^v?(\d+)\.(\d+)\.(\d+)$/;
        const semverTags = new Map();
        const compareVersions = (left, right) => {
          for (let index = 0; index < 3; index += 1) {
            if (left[index] !== right[index]) {
              return left[index] - right[index];
            }
          }
          return 0;
        };
        // Prefer the conventional v-prefixed form, then the lexicographically earliest equivalent tag.
        const selectCanonicalTag = tags => {
          let best = null;
          let bestPriority = Number.POSITIVE_INFINITY;

          for (const candidate of tags) {
            const candidatePriority = candidate.startsWith('v') ? 0 : 1;
            if (
              best === null ||
              candidatePriority < bestPriority ||
              (candidatePriority === bestPriority && candidate.localeCompare(best) < 0)
            ) {
              best = candidate;
              bestPriority = candidatePriority;
            }
          }

          return best;
        };

        for (const tag of runGitCommandLines('git', 'tag', '--list')) {
          const match = tag.match(semverPattern);
          if (!match) continue;

          const key = match.slice(1).join('.');
          if (!semverTags.has(key)) {
            semverTags.set(key, []);
          }
          semverTags.get(key).push(tag);
        }

        let previousTag = null;
        let previousTagDisplay = 'start';
        let baseVersion = [0, 0, 0];

        if (semverTags.size > 0) {
          let latestVersion = null;
          let latestTags = [];
          for (const [versionKey, tags] of semverTags.entries()) {
            const version = versionKey.split('.').map(Number);
            if (!latestVersion || compareVersions(version, latestVersion) > 0) {
              latestVersion = version;
              latestTags = tags;
            }
          }

          previousTag = selectCanonicalTag(latestTags);
          previousTagDisplay = `v${latestVersion.join('.')}`;
          baseVersion = latestVersion;
        }

        const nextVersion = {
          patch: [baseVersion[0], baseVersion[1], baseVersion[2] + 1],
          minor: [baseVersion[0], baseVersion[1] + 1, 0],
          major: [baseVersion[0] + 1, 0, 0],
        }[bump];
        const nextTag = `v${nextVersion.join('.')}`;

        const plan = {
          bump,
          previous_tag: previousTag,
          previous_tag_display: previousTagDisplay,
          next_tag: nextTag,
          target,
          title: nextTag,
          has_changes: true,
        };

        if (!(await isMissingGitHubResource(() => github.rest.repos.getReleaseByTag({ owner, repo, tag: nextTag })))) {
          plan.has_changes = false;
          plan.noop_reason = `Target release ${nextTag} is already visible before publication.`;
        }

        if (
          plan.has_changes &&
          !(await isMissingGitHubResource(() => github.rest.git.getRef({ owner, repo, ref: `tags/${nextTag}` })))
        ) {
          plan.has_changes = false;
          plan.noop_reason = `Target tag ${nextTag} is already visible before publication.`;
        }

        let revspec = target;
        if (previousTag) {
          const ancestorResult = spawnSync('git', ['merge-base', '--is-ancestor', previousTag, target], { stdio: 'ignore' });
          if (ancestorResult.status !== 0) {
            plan.has_changes = false;
            plan.noop_reason = `Cannot safely compare ${previousTagDisplay} to ${target} because the tag is not an ancestor of the target commit.`;
            fs.writeFileSync(
              descriptionPath,
              `## Full change list since ${previousTagDisplay}\n- Unable to compute safely.\n`,
            );
            fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
            core.info('=== Release plan ===');
            core.info(fs.readFileSync(planPath, 'utf8'));
            core.info('=== Deterministic release description ===');
            core.info(fs.readFileSync(descriptionPath, 'utf8'));
            return;
          }
          revspec = `${previousTag}..${target}`;
        }

        let changeLines = runGitCommandLines(
          'git',
          'log',
          '--first-parent',
          '--reverse',
          '--pretty=format:- %s (%h)',
          revspec,
        );

        plan.commit_count = changeLines.length;
        if (previousTag && changeLines.length === 0) {
          plan.has_changes = false;
          plan.noop_reason = `No meaningful changes were found since ${previousTagDisplay}.`;
        }

        const heading = previousTag
          ? `## Full change list since ${previousTagDisplay}`
          : '## Full change list for the initial release';

        if (changeLines.length === 0) {
          changeLines = ['- No commits found in the selected release range.'];
        }

        fs.writeFileSync(descriptionPath, `${heading}\n${changeLines.join('\n')}\n`);
        fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);

        core.info('=== Release plan ===');
        core.info(fs.readFileSync(planPath, 'utf8'));
        core.info('=== Deterministic release description ===');
        core.info(fs.readFileSync(descriptionPath, 'utf8'));
jobs:
  create-release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
        with:
          persist-credentials: false
          fetch-depth: 0
      - name: Create GitHub release
        uses: actions/github-script@v7
        env:
          BUMP: ${{ github.event.inputs.bump }}
          TARGET_SHA: ${{ github.sha }}
        with:
          script: |
            const { execFileSync, spawnSync } = require('child_process');
            
            const bump = process.env.BUMP;
            const target = process.env.TARGET_SHA;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            
            const runGitCommand = (...args) => {
              try {
                return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
              } catch (error) {
                const stdout = typeof error === 'object' && error !== null && 'stdout' in error ? error.stdout : '';
                const stderr = typeof error === 'object' && error !== null && 'stderr' in error ? error.stderr : '';
                const output = [stdout, stderr]
                  .map(value => value && String(value).trim())
                  .filter(Boolean)
                  .join('\n');
                throw new Error(`Command failed: ${args.join(' ')}${output ? `\n${output}` : ''}`);
              }
            };
            const runGitCommandLines = (...args) => {
              const text = runGitCommand(...args);
              return text ? text.split(/\r?\n/).filter(line => line.trim()) : [];
            };
            
            runGitCommand('git', 'fetch', '--force', '--tags', 'origin');
            
            const semverPattern = /^v?(\d+)\.(\d+)\.(\d+)$/;
            const semverTags = new Map();
            const compareVersions = (left, right) => {
              for (let index = 0; index < 3; index += 1) {
                if (left[index] !== right[index]) {
                  return left[index] - right[index];
                }
              }
              return 0;
            };
            const selectCanonicalTag = tags => {
              let best = null;
              let bestPriority = Number.POSITIVE_INFINITY;
            
              for (const candidate of tags) {
                const candidatePriority = candidate.startsWith('v') ? 0 : 1;
                if (
                  best === null ||
                  candidatePriority < bestPriority ||
                  (candidatePriority === bestPriority && candidate.localeCompare(best) < 0)
                ) {
                  best = candidate;
                  bestPriority = candidatePriority;
                }
              }
            
              return best;
            };
            
            for (const tag of runGitCommandLines('git', 'tag', '--list')) {
              const match = tag.match(semverPattern);
              if (!match) continue;
            
              const key = match.slice(1).join('.');
              if (!semverTags.has(key)) {
                semverTags.set(key, []);
              }
              semverTags.get(key).push(tag);
            }
            
            let previousTag = null;
            let previousTagDisplay = 'start';
            let baseVersion = [0, 0, 0];
            
            if (semverTags.size > 0) {
              let latestVersion = null;
              let latestTags = [];
              for (const [versionKey, tags] of semverTags.entries()) {
                const version = versionKey.split('.').map(Number);
                if (!latestVersion || compareVersions(version, latestVersion) > 0) {
                  latestVersion = version;
                  latestTags = tags;
                }
              }
            
              previousTag = selectCanonicalTag(latestTags);
              previousTagDisplay = `v${latestVersion.join('.')}`;
              baseVersion = latestVersion;
            }
            
            const nextVersion = {
              patch: [baseVersion[0], baseVersion[1], baseVersion[2] + 1],
              minor: [baseVersion[0], baseVersion[1] + 1, 0],
              major: [baseVersion[0] + 1, 0, 0],
            }[bump];
            const nextTag = `v${nextVersion.join('.')}`;
            
            let revspec = target;
            if (previousTag) {
              const ancestorResult = spawnSync('git', ['merge-base', '--is-ancestor', previousTag, target], { stdio: 'ignore' });
              if (ancestorResult.status !== 0) {
                core.notice(`Skipping release creation: Cannot safely compare ${previousTagDisplay} to ${target} because the tag is not an ancestor of the target commit.`);
                return;
              }
              revspec = `${previousTag}..${target}`;
            }
            
            let changeLines = runGitCommandLines(
              'git',
              'log',
              '--first-parent',
              '--reverse',
              '--pretty=format:- %s (%h)',
              revspec,
            );
            
            if (previousTag && changeLines.length === 0) {
              core.notice(`Skipping release creation: No meaningful changes were found since ${previousTagDisplay}.`);
              return;
            }
            
            const heading = previousTag
              ? `## Full change list since ${previousTagDisplay}`
              : '## Full change list for the initial release';
            
            if (changeLines.length === 0) {
              changeLines = ['- No commits found in the selected release range.'];
            }
            
            const body = `${heading}\n${changeLines.join('\n')}\n`.trim();
            const title = nextTag;
            
            if (!/^v?\d+\.\d+\.\d+$/.test(nextTag)) {
              core.notice(`Skipping release creation: Invalid semver tag ${nextTag}.`);
              return;
            }
            
            try {
              await github.rest.repos.getReleaseByTag({ owner, repo, tag: nextTag });
              core.notice(`Skipping release creation: Release ${nextTag} already exists.`);
              return;
            } catch (error) {
              if (error.status !== 404) throw error;
            }
            
            try {
              await github.rest.git.getRef({ owner, repo, ref: `tags/${nextTag}` });
              core.notice(`Skipping release creation: Tag ${nextTag} already exists.`);
              return;
            } catch (error) {
              if (error.status !== 404) throw error;
            }
            
            await github.rest.git.createRef({
              owner,
              repo,
              ref: `refs/tags/${nextTag}`,
              sha: target,
            });
            
            const release = await github.rest.repos.createRelease({
              owner,
              repo,
              tag_name: nextTag,
              target_commitish: target,
              name: title,
              body,
              draft: false,
              prerelease: false,
              generate_release_notes: false,
            });
            core.notice(`Created release ${release.data.tag_name}`);
safe-outputs:
  needs:
    - create-release
  update-release:
network:
  allowed:
    - defaults
    - github
---

# Manual SemVer Release

## Current Context

The `Compute release plan` step creates these files before the agent starts. Read them before you do anything else:

- `/tmp/gh-aw/data/release-trigger.json` — repository, requested bump, triggering ref name, and triggering SHA
- `/tmp/gh-aw/data/release-plan.json` — deterministic release metadata including the previous semver tag, next semver tag, target SHA, and whether the release is publishable
- `/tmp/gh-aw/data/release-description.md` — the deterministic full change list that the workflow will publish unless you replace it with better release notes

A separate deterministic `create-release` job uses the same semver rules to create the GitHub release with the raw full change list. Your only write action is to replace that raw body with better release notes.

## Task

Rewrite the deterministic release description into polished release notes for the GitHub release created for the current ref.

1. Treat `/tmp/gh-aw/data/release-plan.json` as the source of truth for the version, title, target SHA, and previous release boundary.
2. Treat `/tmp/gh-aw/data/release-description.md` as the deterministic full change list. Read it closely and rewrite it into concise, human-friendly release notes.
3. Inspect commits, merged pull requests, and repository context as needed to improve the rewrite, but do not change the version or release target from the release plan.
4. If there is no prior semver release, use the full change list plus the repository context to explain the initial release clearly and concisely.
5. Keep the release notes concise, factual, and written in GitHub-flavored markdown.

## Required Release Notes Format

Use this structure for the release body:

```markdown
## Highlights
- ...

## Changes since <previous tag or start>
- ...
```

Call `noop` with a brief explanation instead of updating a release if:

- `/tmp/gh-aw/data/release-plan.json` says `has_changes` is false
- `/tmp/gh-aw/data/release-plan.json` is missing required fields or conflicts with what you can see in the repository

## Safe Output

When you are ready:

1. Call `update_release` exactly once with:
   - `tag` — read `/tmp/gh-aw/data/release-plan.json` first and extract `next_tag` directly from that file
   - `operation` — `replace`
   - `body` — the rewritten markdown release notes

Do not create releases directly with `gh` or any write-capable GitHub tool from the main agent job.
