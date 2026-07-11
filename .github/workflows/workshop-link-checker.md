---
emoji: 🔗
name: Workshop Link Checker
description: >
  Daily broken-link validator for workshop markdown files. Scans workshop/*.md,
  validates external URLs and internal anchors, and files or updates
  broken-link issues with exact file/line/URL details.
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
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
  bash: true
safe-outputs:
  create-issue:
    title-prefix: "[workshop-link-checker] "
    labels: [broken-link]
    deduplicate-by-title: true
    max: 50
  add-comment:
    max: 50
timeout-minutes: 30
steps:
  - name: Gather workshop markdown files
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      if [ -d workshop ]; then
        find workshop -type f -name "*.md" | sort | jq -R . | jq -sc '{workshop_files: .}' > /tmp/gh-aw/data/repo-state.json
      else
        jq -n '{workshop_files: []}' > /tmp/gh-aw/data/repo-state.json
      fi

      echo "=== Repo state ===" && cat /tmp/gh-aw/data/repo-state.json
---

# Workshop Link Checker

You are a QA automation agent for the **"Learning GitHub Agentic Workflows"** workshop.

Your job is to detect broken links in workshop markdown files and report actionable findings.

---

## Phase 1 — Load Inputs

1. Read `/tmp/gh-aw/data/repo-state.json`.
2. Extract `workshop_files`.
3. If `workshop_files` is empty, call `noop` with a short explanation.

---

## Phase 2 — Extract Links from Markdown

For each file in `workshop_files`, extract links with line numbers:

- Inline links: `[text](url)`
- Reference-style links: `[text][ref]` plus matching definitions `[ref]: url`

Rules:

- Ignore image links (`![alt](url)`).
- Ignore mailto links.
- Ignore links inside fenced code blocks.
- Resolve relative links against the source file location.
- Keep the original source line number for every discovered link.

Build a normalized list of records:

```json
[
  {
    "file": "workshop/11-build-daily-status.md",
    "line": 123,
    "raw_link": "../README.md#overview",
    "resolved_kind": "internal",
    "resolved_target": "README.md#overview"
  }
]
```

---

## Phase 3 — Validate Links

Validate each extracted link and collect only broken ones.

### External URLs (`http://` or `https://`)

1. Send an HTTP `HEAD` request first.
2. If `HEAD` is unsupported (405/501), retry with lightweight `GET`.
3. Treat as broken when response is:
   - network failure / DNS failure / TLS failure
   - any 4xx or 5xx status code

Record status code or error in `reason`.

### Internal / relative links

1. Resolve the path to a repository file.
2. If the target file does not exist, mark as broken (`missing file`).
3. If the link includes an anchor (`#...`):
   - Parse headings from the target markdown file.
   - Generate GitHub-style heading slugs.
   - If the anchor is missing, mark as broken (`missing anchor`).

For internal links to non-markdown files, only validate file existence.

---

## Phase 4 — Open or Update Broken-Link Issues

For each broken link record, create a deterministic issue key hash:

`bl-<sha256(file + \"|\" + line + \"|\" + raw_link)>`

Then:

1. Search open issues with label `broken-link` for an existing issue whose title contains that exact key hash.
2. If no matching issue exists, call `create-issue` with:
   - **Title**: `Broken link [<key-hash>] in <file>:<line>`
   - **Body** including:
     - file path
     - line number
     - raw link
     - resolved target
     - failure reason/status
     - checked-at timestamp (UTC)
3. If a matching issue exists, call `add-comment` on that issue with:
   - updated failure details
   - checked-at timestamp
   - note that the link is still broken

Do not create duplicate issues for the same key in one run.

---

## Phase 5 — No-op When Clean

If no broken links were found, call `noop` with a concise summary:

`Scanned <N> files and validated <M> links — no broken links found.`

---

## Output quality requirements

- Every broken-link report must include file, line, URL, and reason.
- Keep issue/comment text concise and actionable.
- Never call write tools other than `create-issue`, `add-comment`, and `noop`.
