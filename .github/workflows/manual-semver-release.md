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
        }' > /tmp/gh-aw/data/release-trigger.json
  - name: Compute release plan
    env:
      BUMP: ${{ github.event.inputs.bump }}
      TARGET_SHA: ${{ github.sha }}
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data
      git fetch --force --tags origin

      python3 <<'PY'
      import json
      import os
      import pathlib
      import re
      import subprocess

      plan_path = pathlib.Path("/tmp/gh-aw/data/release-plan.json")
      description_path = pathlib.Path("/tmp/gh-aw/data/release-description.md")
      bump = os.environ["BUMP"]
      target = os.environ["TARGET_SHA"]

      def run(*args):
          return subprocess.check_output(args, text=True).strip()

      def run_lines(*args):
          text = run(*args)
          return [line for line in text.splitlines() if line.strip()]

      tags = run_lines("git", "tag", "--list")
      stable = {}
      for tag in tags:
          match = re.fullmatch(r"v?(\d+)\.(\d+)\.(\d+)", tag)
          if not match:
              continue
          version = tuple(int(part) for part in match.groups())
          stable.setdefault(version, []).append(tag)

      previous_tag = None
      previous_tag_display = "start"
      base_version = (0, 0, 0)

      if stable:
          version = max(stable)
          candidates = sorted(stable[version], key=lambda tag: (not tag.startswith("v"), tag))
          previous_tag = candidates[0]
          previous_tag_display = f"v{version[0]}.{version[1]}.{version[2]}"
          base_version = version

      next_version = {
          "patch": (base_version[0], base_version[1], base_version[2] + 1),
          "minor": (base_version[0], base_version[1] + 1, 0),
          "major": (base_version[0] + 1, 0, 0),
      }[bump]
      next_tag = f"v{next_version[0]}.{next_version[1]}.{next_version[2]}"

      plan = {
          "bump": bump,
          "previous_tag": previous_tag,
          "previous_tag_display": previous_tag_display,
          "next_tag": next_tag,
          "target": target,
          "title": next_tag,
          "has_changes": True,
      }

      if previous_tag:
          merge_base = subprocess.run(
              ["git", "merge-base", "--is-ancestor", previous_tag, target],
              check=False,
          )
          if merge_base.returncode != 0:
              plan["has_changes"] = False
              plan["noop_reason"] = (
                  f"Cannot safely compare {previous_tag_display} to {target} because the tag is not an ancestor of the target commit."
              )
              description_path.write_text(
                  f"## Full change list since {previous_tag_display}\n- Unable to compute safely.\n"
              )
              plan_path.write_text(json.dumps(plan, indent=2))
              raise SystemExit(0)
          revspec = f"{previous_tag}..{target}"
      else:
          revspec = target

      change_lines = run_lines(
          "git",
          "log",
          "--first-parent",
          "--reverse",
          "--pretty=format:- %s (%h)",
          revspec,
      )

      plan["commit_count"] = len(change_lines)
      if previous_tag and not change_lines:
          plan["has_changes"] = False
          plan["noop_reason"] = f"No meaningful changes were found since {previous_tag_display}."

      heading = (
          f"## Full change list since {previous_tag_display}"
          if previous_tag
          else "## Full change list for the initial release"
      )
      if not change_lines:
          change_lines = ["- No commits found in the selected release range."]

      description_path.write_text(heading + "\n" + "\n".join(change_lines) + "\n")
      plan_path.write_text(json.dumps(plan, indent=2))
      PY

      echo "=== Release plan ==="
      cat /tmp/gh-aw/data/release-plan.json
      echo
      echo "=== Deterministic release description ==="
      cat /tmp/gh-aw/data/release-description.md
safe-outputs:
  jobs:
    create-release:
      description: Create the GitHub tag and release from the deterministic release plan and full change list prepared before the agent ran.
      output: Release created successfully.
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        - name: Create GitHub release
          uses: actions/github-script@v7
          with:
            script: |
              const fs = require('fs');
              const planPath = '/tmp/gh-aw/data/release-plan.json';
              const descriptionPath = '/tmp/gh-aw/data/release-description.md';
              const outputPath = process.env.GH_AW_AGENT_OUTPUT;

              if (!outputPath) {
                core.setFailed('GH_AW_AGENT_OUTPUT is not set');
                return;
              }

              if (!fs.existsSync(outputPath)) {
                core.setFailed(`GH_AW_AGENT_OUTPUT file not found: ${outputPath}`);
                return;
              }

              if (!fs.existsSync(planPath)) {
                core.setFailed(`Release plan file not found: ${planPath}`);
                return;
              }

              if (!fs.existsSync(descriptionPath)) {
                core.setFailed(`Release description file not found: ${descriptionPath}`);
                return;
              }

              const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
              const items = (payload.items || []).filter(item => item.type === 'create_release');

              if (items.length !== 1) {
                core.setFailed(`Expected exactly 1 create_release item, got ${items.length}`);
                return;
              }

              const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
              const owner = context.repo.owner;
              const repo = context.repo.repo;
              const tag = String(plan.next_tag || '').trim();
              const title = String(plan.title || tag).trim();
              const body = String(fs.readFileSync(descriptionPath, 'utf8') || '').trim();
              const target = String(plan.target || context.sha).trim();

              if (plan.has_changes !== true) {
                core.setFailed(`Release plan is not publishable: ${plan.noop_reason || 'no meaningful changes'}`);
                return;
              }

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
    update-release:
      needs: create-release
      description: Replace the deterministic full change list with concise, human-friendly release notes.
      output: Release notes updated successfully.
      inputs:
        body:
          description: Markdown release notes body that rewrites the full change list into a concise human summary.
          required: true
          type: string
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        - name: Update GitHub release notes
          uses: actions/github-script@v7
          with:
            script: |
              const fs = require('fs');
              const planPath = '/tmp/gh-aw/data/release-plan.json';
              const outputPath = process.env.GH_AW_AGENT_OUTPUT;

              if (!outputPath) {
                core.setFailed('GH_AW_AGENT_OUTPUT is not set');
                return;
              }

              if (!fs.existsSync(outputPath)) {
                core.setFailed(`GH_AW_AGENT_OUTPUT file not found: ${outputPath}`);
                return;
              }

              if (!fs.existsSync(planPath)) {
                core.setFailed(`Release plan file not found: ${planPath}`);
                return;
              }

              const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
              const items = (payload.items || []).filter(item => item.type === 'update_release');

              if (items.length !== 1) {
                core.setFailed(`Expected exactly 1 update_release item, got ${items.length}`);
                return;
              }

              const item = items[0];
              const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
              const owner = context.repo.owner;
              const repo = context.repo.repo;
              const body = String(item.body || '').trim();
              const plannedTag = String(plan.next_tag || '').trim();

              if (!/^v?\d+\.\d+\.\d+$/.test(plannedTag)) {
                core.setFailed(`Invalid semver tag in release plan: ${plannedTag}`);
                return;
              }

              if (!body) {
                core.setFailed('Release body must not be empty');
                return;
              }

              const tag = plannedTag.startsWith('v') ? plannedTag : `v${plannedTag}`;
              const release = await github.rest.repos.getReleaseByTag({ owner, repo, tag });

              await github.rest.repos.updateRelease({
                owner,
                repo,
                release_id: release.data.id,
                tag_name: tag,
                name: String(plan.title || tag).trim(),
                body,
                draft: false,
                prerelease: false,
              });
network:
  allowed:
    - defaults
    - github
---

# Manual SemVer Release

## Current Context

Read these files before you do anything else:

- `/tmp/gh-aw/data/release-trigger.json` — repository, requested bump, triggering ref name, and triggering SHA
- `/tmp/gh-aw/data/release-plan.json` — deterministic release metadata including the previous semver tag, next semver tag, target SHA, and whether the release is publishable
- `/tmp/gh-aw/data/release-description.md` — the deterministic full change list that the workflow will publish unless you replace it with better release notes

## Task

Create exactly one GitHub release for the current ref using semantic versioning.

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

Call `noop` with a brief explanation instead of creating or updating a release if:

- `release-plan.json` says `has_changes` is false
- you cannot verify the release plan safely
- you can already see that the computed tag or release exists before attempting the safe outputs

## Safe Output

When you are ready:

1. Call `create_release` exactly once. It will create the tag and release from the deterministic release plan and full change list.
2. Call `update_release` exactly once with:
   - `body` — the rewritten markdown release notes

Do not create releases directly with `gh` or any write-capable GitHub tool from the main agent job.
