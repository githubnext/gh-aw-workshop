---
emoji: 🖼️
name: Workshop UI Screenshot Generator
description: >
  Daily scanner that finds image references in workshop markdown files, checks
  existing images for broken links, and generates conceptual SVG illustrations
  for missing GitHub UI screenshots. Files a PR with new SVGs and updates
  markdown references. Reports remaining broken links as issues.
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
  create-pull-request:
    title-prefix: "[workshop-ui-screenshots] "
    labels: [workshop, ai-generated]
    draft: true
    allowed-files:
      - "workshop/images/*.svg"
      - "workshop/*.md"
    if-no-changes: warn
  create-issue:
    title-prefix: "[workshop-ui-screenshots] "
    labels: [broken-image]
    deduplicate-by-title: true
    max: 20
timeout-minutes: 30
steps:
  - name: Scan image references and existing files
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      # Build list of existing images in workshop/images/
      existing_images="[]"
      if [ -d workshop/images ]; then
        existing_images=$(find workshop/images -type f | sort | jq -R . | jq -sc .)
      fi

      # Extract all image references from workshop markdown files
      # Output format: JSON array of {file, line, alt, path, resolved, exists}
      refs="[]"
      if [ -d workshop ]; then
        while IFS= read -r md_file; do
          line_num=0
          while IFS= read -r line_content; do
            line_num=$((line_num + 1))
            # Extract image refs: ![alt](path) — skip http URLs and inside code blocks
            # Use { grep || true; } so grep's exit 1 (no match) doesn't abort the pipeline under set -euo pipefail
            echo "$line_content" | { grep -oP '!\[[^\]]*\]\([^)]+\)' || true; } | while IFS= read -r img_ref; do
              alt=$(echo "$img_ref" | sed 's/!\[\([^\]]*\)\].*/\1/')
              path=$(echo "$img_ref" | sed 's/!\[[^\]]*\](\([^)]*\))/\1/')
              # Skip external URLs
              case "$path" in http*|https*) continue ;; esac
              # Resolve relative to source file directory
              src_dir=$(dirname "$md_file")
              resolved=$(realpath -m "${src_dir}/${path}" 2>/dev/null || echo "${src_dir}/${path}")
              exists="false"
              [ -f "$resolved" ] && exists="true"
              printf '%s\n' "{\"file\":\"$md_file\",\"line\":$line_num,\"alt\":$(printf '%s' "$alt" | jq -Rs .),\"path\":$(printf '%s' "$path" | jq -Rs .),\"resolved\":$(printf '%s' "$resolved" | jq -Rs .),\"exists\":$exists}"
            done
          done < "$md_file"
        done < <(find workshop -maxdepth 1 -name "*.md" | sort) | jq -sc . > /tmp/gh-aw/data/image-refs.json
      else
        echo "[]" > /tmp/gh-aw/data/image-refs.json
      fi

      echo "$existing_images" > /tmp/gh-aw/data/existing-images.json

      echo "=== Existing images ===" && cat /tmp/gh-aw/data/existing-images.json
      echo "=== Image references ===" && cat /tmp/gh-aw/data/image-refs.json
---

# Workshop UI Screenshot Generator

You are an image-quality automation agent for the **"Learning GitHub Agentic
Workflows"** workshop. Your job is to find broken image references, generate
conceptual SVG screenshots for missing GitHub UI images, and report anything
that still needs attention.

---

## Load Inputs

1. Read `/tmp/gh-aw/data/image-refs.json` — the full list of image references
   found in workshop markdown files. Each record has:
   - `file` — source markdown file path
   - `line` — line number of the reference
   - `alt` — alt text of the image
   - `path` — original path as written in markdown (e.g. `images/08-run-summary.png`)
   - `resolved` — resolved filesystem path
   - `exists` — whether the file currently exists on disk

2. Read `/tmp/gh-aw/data/existing-images.json` — the list of existing files
   under `workshop/images/`.

3. Partition image references into two groups:
   - **broken** — records where `exists` is `false`
   - **ok** — records where `exists` is `true`

4. If **broken** is empty, call `noop` with:
   `Scanned N markdown files. All M image references are valid — no broken links found.`

---

## Classify Broken References

For each broken reference, determine whether it depicts a **GitHub UI element**
that can be illustrated with a conceptual SVG.

A reference is classifiable as a GitHub UI screenshot when:
- Its filename or alt text mentions common GitHub UI elements such as: Actions
  tab, workflow run, Run workflow button, Codespace, fork, commit, schedule
  badge, skipped step, summary panel, log view, or similar.

Classify each broken reference as:
- `generatable` — can be illustrated with a conceptual SVG
- `not-generatable` — too specific, a real screenshot is needed (e.g. a photo
  of a custom user screen or non-GitHub UI)

---

## Generate Conceptual SVGs

For each `generatable` broken reference, generate a conceptual SVG that
illustrates the described GitHub UI element.

### SVG design rules

- **Canvas**: 1200 x 560, `viewBox="0 0 1200 560"`.
- **Background**: `#f6f8fa` (GitHub light page background).
- Use a browser chrome header (`#ffffff`, height 44, with rounded top corners,
  subtle `#d0d7de` border) showing a mocked URL bar containing the workshop
  repo path.
- Represent GitHub's navigation tabs (Code, Issues, Pull requests, Actions,
  etc.) as a horizontal tab bar with the relevant tab underlined in `#0969da`.
- For Actions-tab screenshots: show a workflow list panel with a single row
  representing the relevant workflow, a status icon (green ✓ for success,
  yellow (in-progress hourglass) for in-progress), and the workflow name.
- For Run workflow button: render a blue button labelled "Run workflow" in the
  Actions sidebar.
- For Codespace/fork/commit dialogs: use a centered modal panel (`#ffffff`
  background, `#d0d7de` border, rounded corners).
- For schedule badge / workflow list badge: render the Actions sidebar list with
  a clock icon and "Scheduled" label.
- For skipped steps: render the job-step list with a grey `-` icon and
  "Skipped" label next to the step name.
- For summary/run log panels: render a dark panel (`#0d1117`) with monospace
  output lines in `#c9d1d9`, showing representative output from the described
  step.
- Add a short annotation label below the graphic (in `#57606a`, 24 px,
  `Arial, sans-serif`) echoing the alt text.
- Add `role="img"` and `aria-label` matching the alt text.

### Naming convention

For a broken reference `images/08-run-summary.png`:
- Generate the SVG as `workshop/images/08-run-summary.svg`.
- Do **not** create a PNG; always produce an SVG.

Write each SVG to the appropriate path using the `edit` tool (or create it
fresh if the path does not exist).

### Markdown reference update

After writing each new SVG file, update the corresponding line in the source
markdown file to reference `.svg` instead of the original extension.

Example: Replace `images/08-run-summary.png` with `images/08-run-summary.svg`
in the exact line where the reference appears.

---

## Report Remaining Broken References

For each `not-generatable` broken reference (real screenshot needed):

1. At the start of this phase, list open issues with label `broken-image` and
   cache them locally.
2. Build a deterministic title:
   `Missing image: <path> in <file>`
3. Search the cached list for an issue with that exact title.
4. If none exists, call `create-issue` with:
   - **Title**: `Missing image: <path> in <file>`
   - **Body** (minimum 20 chars) including:
     - File path and line number
     - Alt text
     - Original image path
     - Note that this image requires a real screenshot and cannot be
       auto-generated
     - Checked-at timestamp (UTC)
5. If a matching issue exists, skip (deduplicate-by-title handles this).

---

## Open a Pull Request

If any SVG files were generated in Phase 3:

Call `create-pull-request` with:
- **Title**: `Add conceptual SVG screenshots for N missing workshop images`
- **Body** summarising:
  - Which images were generated (list by filename)
  - Which markdown files were updated
  - A note that these are AI-generated conceptual illustrations; maintainers
    should replace them with real screenshots when available

If no SVGs were generated (only `not-generatable` references exist), skip
`create-pull-request`.

---

## Output quality requirements

- Every generated SVG must be valid, self-contained SVG markup (start with
  `<svg xmlns="http://www.w3.org/2000/svg" ...`).
- Markdown updates must be minimal line-precise replacements — do not reformat
  surrounding content.
- Never call write tools other than `create-pull-request`, `create-issue`, and
  `noop`.
