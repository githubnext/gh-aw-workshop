---
emoji: 🏗️
name: Workshop Builder
description: >
  Hourly loop orchestrator that drives continuous incremental improvement of the
  "Learning GitHub Agentic Workflows" workshop. Each run selects exactly one
  action: dispatch an existing workflow, open a draft PR to improve an existing
  workflow, or file a new automation idea as an issue.
on:
  schedule: hourly
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional hint (e.g. 'add content', 'fix sync', 'improve quality', 'status')"
        required: false
        type: string
permissions:
  contents: read
  actions: read
  copilot-requests: write
  issues: read
  pull-requests: read
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
safe-outputs:
  dispatch-workflow:
    workflows:
      - workshop-author
      - workshop-order-review
      - workshop-skill-activity-author
      - workshop-student-simulator
      - workshop-sync-check
    max: 1
  create-pull-request:
    title-prefix: "[workshop-builder] "
    labels: [workshop, orchestrator]
    draft: true
    allowed-files:
      - ".github/workflows/*.md"
    if-no-changes: warn
  create-issue:
    title-prefix: "[workshop-builder] "
    labels: [workshop, automation]
    deduplicate-by-title: true
    max: 1
timeout-minutes: 20
steps:
  - name: Gather repository state
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      # Count workshop content nodes (excluding README.md)
      workshop_count=0
      if [ -d workshop ]; then
        workshop_count=$(find workshop -name "*.md" ! -name "README.md" | wc -l | tr -d ' ')
      fi

      # List agentic workflow source files (.md only, no lock files)
      workflow_sources="[]"
      if [ -d .github/workflows ]; then
        workflow_sources=$(
          find .github/workflows -maxdepth 1 -name "*.md" | sort | jq -R . | jq -sc .
        )
      fi

      NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)

      jq -n \
        --argjson workshop_count "$workshop_count" \
        --argjson workflow_sources "$workflow_sources" \
        --arg now "$NOW" \
        '{
          workshop_node_count: $workshop_count,
          workflow_sources: $workflow_sources,
          timestamp: $now
        }' > /tmp/gh-aw/data/repo-state.json

      echo "=== Repository state ===" && cat /tmp/gh-aw/data/repo-state.json
---

# Workshop Builder: Loop Orchestrator

## Role

You are the **Workshop Builder**, a loop orchestrator that drives continuous
incremental improvement of the "Learning GitHub Agentic Workflows" workshop.

Your mission on every run: **select exactly one action** that advances workshop
quality, execute it, and record your reasoning in persistent state so the next
run can pick up where you left off.

---

## Phase 1 — Load State

### 1a. Read repository state

Load `/tmp/gh-aw/data/repo-state.json`. It contains:

- `workshop_node_count` — number of workshop content files (excluding README)
- `workflow_sources` — list of `.md` source files in `.github/workflows/`
- `timestamp` — current run timestamp

### 1b. Load persistent orchestrator state from cache-memory

Read `/tmp/gh-aw/cache-memory/builder-state.json`. Create it with defaults when
absent:

```json
{
  "last_dispatch": {},
  "last_modification_pr": null,
  "last_suggestion_issue": null,
  "run_history": []
}
```

Fields:

- `last_dispatch` — map of workflow name → ISO timestamp of last dispatch by
  this orchestrator
- `last_modification_pr` — ISO timestamp of the last workflow-modification PR
  opened
- `last_suggestion_issue` — ISO timestamp of the last new-workflow suggestion
  issue filed
- `run_history` — last 20 run summaries (newest first), each with: `timestamp`,
  `action` (`"dispatch"` | `"modify"` | `"suggest"` | `"noop"`), `target`, and
  `reason`

### 1c. Handle `focus = "status"`

If `${{ inputs.focus }}` equals `"status"`, call `noop` with a summary that
includes:

- Workshop node count
- Last dispatch timestamps per workflow
- Last modification PR and suggestion issue timestamps
- The 5 most recent run history entries

Do **not** take any other action.

---

## Phase 2 — Assess Workshop Health

Gather signals from three sources:

### 2a. Workflow run status

Use the `agentic-workflows` `status` tool to check the latest run status for
each workshop workflow:

- `workshop-author`
- `workshop-order-review`
- `workshop-skill-activity-author`
- `workshop-student-simulator`
- `workshop-sync-check`

Note: which workflows are failing, skipping, or have not run recently.

### 2b. Open PRs and issues

Use `gh` to query open workshop-related work:

```bash
gh search prs --repo "$GITHUB_REPOSITORY" --state open \
  --label workshop --json number,title,labels --limit 10
gh search issues --repo "$GITHUB_REPOSITORY" --state open \
  --label workshop --json number,title,labels --limit 20
```

Record:

- Whether an open PR with label `workshop` exists (blocks `workshop-author`)
- Whether an open PR with label `skill-activity` exists (blocks
  `workshop-skill-activity-author`)
- Any open issues suggesting improvements or reporting errors

### 2c. Derive dispatch eligibility

For each workflow, compute whether it is **eligible** for dispatch:

| Workflow | Eligible when |
|---|---|
| `workshop-author` | nodes < 15, no open `workshop` PR, last dispatch > 5 h ago or never |
| `workshop-student-simulator` | nodes ≥ 5, last dispatch > 20 h ago or never |
| `workshop-sync-check` | nodes ≥ 3, last dispatch > 22 h ago or never |
| `workshop-order-review` | nodes ≥ 3, last dispatch > 22 h ago or never |
| `workshop-skill-activity-author` | nodes ≥ 8, no open `skill-activity` PR, last dispatch > 20 h ago or never |

Use the timestamps from `last_dispatch` in the loaded state and the current
`timestamp` from the repo state to evaluate "last dispatch > N h ago". If a
workflow has never been dispatched (`last_dispatch` has no entry for it), treat
it as always eligible.

---

## Phase 3 — Select Exactly One Action

Apply the following priority tiers in order. Take the first action whose
conditions are met.

### Tier A — Dispatch an existing workflow

Select the highest-priority **eligible** workflow (most urgent first):

1. `workshop-author` — highest priority when the workshop is still growing
2. `workshop-student-simulator` — ensures quality feedback exists
3. `workshop-sync-check` — keeps content accurate against gh-aw changes
4. `workshop-order-review` — detects ordering problems early
5. `workshop-skill-activity-author` — adds Skills-style activities

If `${{ inputs.focus }}` is provided (and not `"status"`), treat it as a hint
that may shift priority toward a specific workflow (e.g. "add content" → prefer
`workshop-author`; "fix sync" → prefer `workshop-sync-check`).

When dispatching `workshop-author` or `workshop-skill-activity-author`, pass the
`focus` input through if it is set and relevant.

→ If at least one workflow is eligible, **dispatch the highest-priority one** and
skip Tiers B and C.

### Tier B — Propose a modification to an existing workflow

Consider this tier only when **no workflow is eligible for dispatch**.

Conditions for opening a modification PR:

- No modification PR was opened by this orchestrator in the last 24 hours
  (`last_modification_pr` is null or > 24 h ago)
- You identify a **concrete, specific, bounded** improvement to one of the
  `.md` files listed in `workflow_sources`

Steps to evaluate:

1. Read each workflow source file
2. Use the `agentic-workflows` compile tool with `--validate` on each file to
   surface any schema errors or deprecated fields
3. Look for actionable improvements: missing `strict: true`, missing `noop`
   criteria, unclear prompt sections, overly broad `allowed-files`, deprecated
   syntax flagged by the compiler, or gaps revealed by open issues
4. Pick the single most impactful improvement

If a concrete improvement is found:

1. Make the targeted edit to the workflow `.md` file using the `edit` tool
2. Re-run `agentic-workflows` compile with `--validate` on the modified file to
   confirm the change is valid; fix any errors before proceeding
3. Open a draft PR via `create-pull-request`:
   - **Title**: `Improve <workflow-id>: <short description>`
   - **Body**: problem statement, change made, why it helps

→ If a modification PR is created, skip Tier C.

### Tier C — Suggest a new workflow

Consider this tier only when **Tiers A and B both yield no action**.

Conditions:

- No suggestion issue was filed in the last 48 hours (`last_suggestion_issue`
  is null or > 48 h ago)
- You identify a genuine automation capability gap not covered by any existing
  workflow

Before filing, search open issues to avoid duplicates:

```bash
gh search issues --repo "$GITHUB_REPOSITORY" --state open \
  --label automation --json number,title --limit 50
```

Example capability gaps to consider:

- No broken-link validator for workshop markdown files
- No automated accessibility checker for workshop content
- No weekly digest for workshop maintainers summarising open issues and PRs
- No PR reviewer that checks new workshop nodes follow the required template
- No automated stale-issue cleanup for aged workshop issues
- No check for consistent tone/voice across workshop step files
- No generator for a workshop contributor guide

File a suggestion issue via `create-issue`:

- **Title**: `New workflow idea: <short description>`
- **Body** (minimum 20 chars): capability gap, proposed workflow name and
  trigger, tools and safe outputs needed, why it improves the workshop

### No-op rule

If none of the three tiers produce an action, call `noop` with a concise
explanation covering what was checked and why nothing was needed.

---

## Phase 4 — Update Persistent State

Write the updated state back to `/tmp/gh-aw/cache-memory/builder-state.json`:

- If a dispatch was made: set `last_dispatch[workflow_name]` to the current
  timestamp
- If a modification PR was opened: set `last_modification_pr` to the current
  timestamp
- If a suggestion issue was filed: set `last_suggestion_issue` to the current
  timestamp
- Prepend a new entry to `run_history` and keep only the 20 most recent
  entries. Each entry must include:
  - `timestamp` — current run timestamp
  - `action` — `"dispatch"` | `"modify"` | `"suggest"` | `"noop"`
  - `target` — workflow name, file name, or short description
  - `reason` — one-sentence rationale

---

## Safe Outputs Summary

| Situation | Output to use |
|---|---|
| Dispatching an existing workflow | `dispatch-workflow` |
| Proposing a workflow improvement | `create-pull-request` |
| Suggesting a new workflow | `create-issue` |
| No action needed or `focus = "status"` | `noop` with a clear reason |
