---
emoji: 🔍
name: Workshop Sync Check
description: >
  Daily scan of workshop content against the latest gh-aw documentation.
  Uses round-robin scheduling via cache-memory to review five workshop files
  per run using inline subagents, checks recent gh-aw releases for breaking
  changes, validates workflow examples with the gh-aw compiler, and opens an
  issue when the workshop content is out of date.
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read
  copilot-requests: write
strict: true
network:
  allowed:
    - defaults
    - github
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  cache-memory: true
  agentic-workflows:
  bash: true
safe-outputs:
  create-issue:
    title-prefix: "[workshop-sync] "
    labels: [documentation]
    deduplicate-by-title: true
    max: 5
timeout-minutes: 30
steps:
  - name: Capture gh aw CLI help output
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      # This snapshot describes the terminal `gh aw` CLI only.
      # It is not the same thing as the internal `agentic-workflows` MCP tool.
      gh_aw_help="$(gh aw --help 2>&1)"

      mapfile -t gh_aw_subcommands < <(
        printf '%s\n' "$gh_aw_help" |
          awk '/^[[:space:]]{2}[^[:space:]-][^[:space:]]*[[:space:]]{2,}/ { print $1 }' |
          grep -v '^gh$' |
          sort -u
      )

      subcommands_jsonl=/tmp/gh-aw/data/gh-aw-cli-subcommands.jsonl
      : > "$subcommands_jsonl"

      for subcommand in "${gh_aw_subcommands[@]}"; do
        jq -n \
          --arg key "$subcommand" \
          --arg value "$(gh aw "$subcommand" --help 2>&1)" \
          '{key: $key, value: $value}' \
          >> "$subcommands_jsonl"
      done

      jq -n \
        --arg gh_aw_help "$gh_aw_help" \
        --slurpfile subcommands "$subcommands_jsonl" \
        '{
          gh_aw_help: $gh_aw_help,
          subcommands: ($subcommands | from_entries)
        }' \
        > /tmp/gh-aw/data/gh-aw-cli-help.json

      echo "=== gh aw CLI help snapshot ==="
      cat /tmp/gh-aw/data/gh-aw-cli-help.json

  - name: Gather workshop files
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      # Collect workshop content files (sorted, exclude README)
      workshop_files=()
      if [ -d workshop ]; then
        while IFS= read -r f; do
          [[ "$(basename "$f")" != "README.md" ]] && workshop_files+=("$f")
        done < <(find workshop -name "*.md" | sort)
      fi

      # Collect agentic workflow source .md files (exclude lock files)
      workflow_files=()
      if [ -d .github/workflows ]; then
        while IFS= read -r f; do
          workflow_files+=("$f")
        done < <(find .github/workflows -maxdepth 1 -name "*.md" | sort)
      fi

      # Write JSON state consumed by the AI agent
      {
        printf '%s\n' "${workshop_files[@]:-}" | grep -v '^$' | jq -R . | jq -sc .
      } > /tmp/gh-aw/data/workshop_files.json

      {
        printf '%s\n' "${workflow_files[@]:-}" | grep -v '^$' | jq -R . | jq -sc .
      } > /tmp/gh-aw/data/workflow_files.json

      jq -n \
        --slurpfile wf /tmp/gh-aw/data/workshop_files.json \
        --slurpfile awf /tmp/gh-aw/data/workflow_files.json \
        '{workshop_files: $wf[0], workflow_files: $awf[0]}' \
        > /tmp/gh-aw/data/repo-state.json

      echo "=== Workshop files ===" && cat /tmp/gh-aw/data/workshop_files.json
      echo "=== Workflow files ===" && cat /tmp/gh-aw/data/workflow_files.json

  - name: Fetch gh-aw reference documentation
    env:
      GH_TOKEN: ${{ github.token }}
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data/ref

      # Pre-download reference docs to disk so the agent and subagents can
      # read them directly rather than passing the full text inline.
      # This avoids injecting ~300-400k tokens into every subagent context.
      # IMPORTANT: if you add or remove files here, update the comment in
      # "Confirm Reference Documentation Is Ready" in the prompt body below.
      docs=(github-agentic-workflows.md syntax-core.md syntax-agentic.md mcp-clis.md triggers.md)
      for doc in "${docs[@]}"; do
        gh api repos/github/gh-aw/contents/.github/aw/"${doc}" \
          --jq '.content' | base64 -d > /tmp/gh-aw/data/ref/"${doc}"
        echo "Fetched ${doc} ($(wc -c < /tmp/gh-aw/data/ref/"${doc}") bytes)"
      done

      echo "=== Reference docs ready at /tmp/gh-aw/data/ref/ ==="
      ls -lh /tmp/gh-aw/data/ref/
---

# Workshop Sync Check

You are a technical accuracy reviewer for the **"Learning GitHub Agentic Workflows"** workshop.
Your job is to verify that the workshop content stays accurate and up to date with the `github/gh-aw` project.

Each daily run reviews **three workshop files** (round-robin) and checks for outdated commands, screenshots, concepts, or version references. When problems are found you open a focused GitHub issue.

---

## Load State

1. Read `/tmp/gh-aw/data/repo-state.json`. It contains:
   - `workshop_files` — array of workshop markdown paths
   - `workflow_files` — array of `.github/workflows/*.md` source paths

2. Read `/tmp/gh-aw/data/gh-aw-cli-help.json` and use it as the authoritative source for valid `gh aw` subcommands and flags when reviewing workshop command examples.
   This snapshot comes from the terminal `gh aw` CLI, not the internal `agentic-workflows` MCP tool used by this workflow.
   If a workshop command or flag is missing from this live help snapshot, treat it as a drift finding for the installed CLI version and include the relevant help excerpt as evidence.

3. Load the cache-memory file `/tmp/gh-aw/cache-memory/sync-state.json` if it exists.
   It has this shape (create it with defaults when absent):

   ```json
   {
     "round_robin_index": 0,
     "files_reviewed": [],
     "last_gh_aw_release": "",
     "last_gh_aw_release_date": ""
   }
   ```

---

## Check for New gh-aw Releases

1. Fetch the latest gh-aw release:

   ```
   gh api repos/github/gh-aw/releases/latest
   ```

2. Compare `tag_name` against `last_gh_aw_release` in the cached state.

3. If a **new release** was published since the last check:
   - Extract the release body (changelog / release notes).
   - Identify any breaking changes, renamed commands, new syntax, or deprecations that could affect workshop content.
   - Flag these for consideration during the content review below.

4. Record the new release tag and `published_at` date in the updated cache state.

---

## Select Files to Review (Round-Robin)

1. Using `workshop_files` from the repo state and `round_robin_index` from the cache,
   select up to 3 files starting at the current index (pseudocode for illustration):

   ```
   n = min(3, total number of workshop files)
   target_files = [workshop_files[(round_robin_index + i) % total] for each i in 0..n-1]
   ```

2. Record `n` for use in Phase 8.

---

## Confirm Reference Documentation Is Ready

The setup step has already downloaded reference docs to `/tmp/gh-aw/data/ref/`. Confirm the files exist:

```bash
ls /tmp/gh-aw/data/ref/
```

Do **not** re-fetch or read these files into the agent's own context. Each file is large; they must be read by subagents one file at a time, only when needed for a specific check. Record only the directory path:

```
ref_dir = "/tmp/gh-aw/data/ref/"
```

If a new gh-aw release was found in Phase 2, record the release notes body in a compact variable — not the full GitHub API response.

---

## Valid External Documentation URLs

Workshop files may contain external links to the rendered gh-aw documentation site. The canonical URL format follows the [Astro Starlight](https://starlight.astro.build/) pattern:

```
https://github.github.com/gh-aw/<category>/<page-slug>/
```

The table below is the authoritative mapping from source reference files (in `github/gh-aw`) to their rendered URLs. When a workshop file links to one of these URLs, treat it as **verified** — do **not** flag these as unverified external links:

| Source file | Rendered URL |
|---|---|
| `.github/aw/github-agentic-workflows.md` | `https://github.github.com/gh-aw/introduction/overview/` |
| `.github/aw/syntax-core.md` | `https://github.github.com/gh-aw/reference/syntax/` |
| `.github/aw/syntax-agentic.md` | `https://github.github.com/gh-aw/reference/agentic/` |
| `.github/aw/syntax-tools-imports.md` | `https://github.github.com/gh-aw/reference/tools/` |
| `.github/aw/triggers.md` | `https://github.github.com/gh-aw/reference/triggers/` |
| `.github/aw/memory.md` | `https://github.github.com/gh-aw/reference/memory/` |
| `.github/aw/safe-outputs.md` | `https://github.github.com/gh-aw/reference/safe-outputs/` |
| `.github/aw/safe-outputs-content.md` | `https://github.github.com/gh-aw/reference/safe-outputs-content/` |
| `.github/aw/safe-outputs-automation.md` | `https://github.github.com/gh-aw/reference/safe-outputs-automation/` |
| `.github/aw/safe-outputs-management.md` | `https://github.github.com/gh-aw/reference/safe-outputs-management/` |
| `.github/aw/safe-outputs-runtime.md` | `https://github.github.com/gh-aw/reference/safe-outputs-runtime/` |
| `.github/aw/network.md` | `https://github.github.com/gh-aw/reference/network/` |
| `.github/aw/messages.md` | `https://github.github.com/gh-aw/reference/messages/` |
| `.github/aw/subagents.md` | `https://github.github.com/gh-aw/reference/subagents/` |
| `.github/aw/loop.md` | `https://github.github.com/gh-aw/reference/loop/` |
| `.github/aw/patterns.md` | `https://github.github.com/gh-aw/guides/patterns/` |
| `.github/aw/workflow-patterns.md` | `https://github.github.com/gh-aw/guides/workflow-patterns/` |
| `.github/aw/token-optimization.md` | `https://github.github.com/gh-aw/guides/token-optimization/` |
| `.github/aw/context.md` | `https://github.github.com/gh-aw/reference/context/` |
| `.github/aw/skills.md` | `https://github.github.com/gh-aw/reference/skills/` |
| `.github/aw/reuse.md` | `https://github.github.com/gh-aw/guides/reuse/` |
| `.github/aw/experiments.md` | `https://github.github.com/gh-aw/reference/experiments/` |
| `.github/aw/github-mcp-server.md` | `https://github.github.com/gh-aw/reference/github-mcp-server/` |
| `.github/aw/mcp-clis.md` | `https://github.github.com/gh-aw/reference/mcp-clis/` |
| `.github/aw/agentic-workflows-mcp.md` | `https://github.github.com/gh-aw/reference/agentic-workflows-mcp/` |
| `.github/aw/cli-commands.md` | `https://github.github.com/gh-aw/reference/cli-commands/` |
| `.github/aw/pr-reviewer.md` | `https://github.github.com/gh-aw/guides/pr-reviewer/` |
| `.github/aw/report.md` | `https://github.github.com/gh-aw/guides/report/` |
| `.github/aw/llms.md` | `https://github.github.com/gh-aw/reference/llms/` |
| `.github/aw/workflow-constraints.md` | `https://github.github.com/gh-aw/reference/workflow-constraints/` |
| `.github/aw/workflow-editing.md` | `https://github.github.com/gh-aw/guides/workflow-editing/` |

Pass this table to each `workshop-sync-reviewer` subagent as `doc_url_map` so it can validate external links without false positives.

---

## Compile-Validate Workshop Workflow Examples

Use the `agentic-workflows` compile tool to validate each workflow source file listed in `workflow_files`.

For every `.md` file in that list, run the compile tool with `--validate` to check for schema errors, deprecated fields, or incompatible settings. Record any warnings or errors.

---

## Evaluate Workshop Files Using Inline Subagents

For each file in `target_files`:

1. Read the full content of the file.

2. Invoke the `workshop-sync-reviewer` inline agent
   (`.github/agents/workshop-sync-reviewer.agent.md`) and pass an object containing:
   - `file_path` — the file path
   - `content` — the full file content
   - `ref_dir` — the path `/tmp/gh-aw/data/ref/` (the subagent reads individual reference files from this directory on demand — do **not** pass the file contents inline)
   - `release_notes` — release notes from Phase 2 (empty string if none)
   - `gh_aw_version` — the latest gh-aw release tag
   - `doc_url_map` — the rendered-URL mapping table from "Valid External Documentation URLs" above

3. Collect the structured JSON verdict returned by the subagent.

After all subagents have returned their verdicts, proceed to Phase 7.

---

## Decide and Act

Collect all verdicts returned by the `workshop-sync-reviewer` subagents in Phase 6.

### If no issues were found across all files

Call `noop` with:

```
Reviewed <n> files (<comma-separated file names>) — no issues found. gh-aw release: <tag>. Next index: <new_index>.
```

### If issues were found

Create one issue per file that has issues (max 5 total). Each issue must include:

- **Title**: `<target_file>: <short description of the problem>` (the `[workshop-sync]` prefix is added automatically)
- **Body** (minimum 20 characters):
  - Which file was reviewed
  - What is inaccurate or outdated (exact quote from the file)
  - What the correct current behaviour/syntax is (with reference to the gh-aw docs or release notes)
  - Suggested fix

Example issue body:

```
## Workshop file reviewed
`workshop/02b-setup-local.md`

## Problem
The install command on line 23 uses the deprecated `--pin` flag:
> `gh extension install github/gh-aw --pin v1.0.0`

## Current correct syntax
As of gh-aw v1.3.0, the `--pin` flag was replaced by `--version`:
> `gh extension install github/gh-aw --version v1.3.0`

## Suggested fix
Replace `--pin` with `--version` on line 23.
```

---

## Update Cache State

Write the updated state back to `/tmp/gh-aw/cache-memory/sync-state.json`:

```json
{
  "round_robin_index": <previous round_robin_index + n, where n is the number of files reviewed>,
  "files_reviewed": [<append all target_files if not already present>],
  "last_gh_aw_release": "<latest tag>",
  "last_gh_aw_release_date": "<published_at>"
}
```

The cache-memory tool will persist this across daily runs.
