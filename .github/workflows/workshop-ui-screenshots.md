---
emoji: 🖼️
name: Workshop UI Screenshot Generator
description: >
  Daily scanner that finds image references in workshop markdown files, checks
  existing images for broken links, and generates paired light/dark conceptual
  SVG illustrations for missing or single-theme GitHub UI screenshots. Files a
  PR with new SVGs and theme-aware references. Reports remaining broken links.
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
    - local
    - playwright
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  bash: true
  playwright:
skills:
  - github/gh-aw-workshop/.github/skills/github-brand@56127b6381f0f1d976231bb924dadcbae18858de
safe-outputs:
  create-pull-request:
    title-prefix: "[workshop-ui-screenshots] "
    labels: [workshop, ai-generated]
    draft: true
    allowed-files:
      - "workshop/images/*.svg"
      - "workshop/*.md"
    if-no-changes: warn
    expires: 1d
  create-issue:
    title-prefix: "[workshop-ui-screenshots] "
    labels: [broken-image]
    deduplicate-by-title: true
    max: 20
    expires: 1d
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

      # Add local src/srcset references from HTML <picture> blocks. The Markdown
      # scanner above remains responsible for ![alt](path) references.
      python3 -c "$(printf '%s\n' \
      'import json' \
      'import pathlib' \
      'from html.parser import HTMLParser' \
      '' \
      'refs_path = pathlib.Path("/tmp/gh-aw/data/image-refs.json")' \
      'refs = json.loads(refs_path.read_text())' \
      'seen = {(record["file"], record["path"]) for record in refs}' \
      '' \
      'def add_ref(source_file, line, alt, image_path):' \
      '  image_path = image_path.strip()' \
      '  if not image_path or image_path.startswith(("http://", "https://", "data:")):' \
      '    return' \
      '  key = (str(source_file), image_path)' \
      '  if key in seen:' \
      '    return' \
      '  seen.add(key)' \
      '  resolved = (source_file.parent / image_path).resolve()' \
      '  refs.append({' \
      '    "file": str(source_file),' \
      '    "line": line,' \
      '    "alt": alt,' \
      '    "path": image_path,' \
      '    "resolved": str(resolved),' \
      '    "exists": resolved.is_file(),' \
      '  })' \
      '' \
      'class PictureParser(HTMLParser):' \
      '  def __init__(self, source_file):' \
      '    super().__init__()' \
      '    self.source_file = source_file' \
      '    self.picture_refs = None' \
      '' \
      '  def handle_starttag(self, tag, attrs):' \
      '    attrs = dict(attrs)' \
      '    if tag == "picture":' \
      '      self.picture_refs = []' \
      '    elif tag == "source" and self.picture_refs is not None:' \
      '      for candidate in attrs.get("srcset", "").split(","):' \
      '        candidate = candidate.strip().split()[0] if candidate.strip() else ""' \
      '        if candidate:' \
      '          self.picture_refs.append((self.getpos()[0], "", candidate))' \
      '    elif tag == "img" and self.picture_refs is not None and attrs.get("src"):' \
      '      self.picture_refs.append((self.getpos()[0], attrs.get("alt", ""), attrs["src"]))' \
      '' \
      '  def handle_endtag(self, tag):' \
      '    if tag != "picture" or self.picture_refs is None:' \
      '      return' \
      '    fallback_alt = next((alt for _, alt, _ in self.picture_refs if alt), "")' \
      '    for line, alt, image_path in self.picture_refs:' \
      '      add_ref(self.source_file, line, alt or fallback_alt, image_path)' \
      '    self.picture_refs = None' \
      '' \
      'for source_file in sorted(pathlib.Path("workshop").glob("*.md")):' \
      '  parser = PictureParser(source_file)' \
      '  parser.feed(source_file.read_text(encoding="utf-8"))' \
      '' \
      'refs_path.write_text(json.dumps(refs, indent=2), encoding="utf-8")'
      )"

      echo "$existing_images" > /tmp/gh-aw/data/existing-images.json

      echo "=== Existing images ===" && cat /tmp/gh-aw/data/existing-images.json
      echo "=== Image references ===" && cat /tmp/gh-aw/data/image-refs.json
---

# Workshop UI Screenshot Generator

You are an image-quality automation agent for the **"Learning GitHub Agentic
Workflows"** workshop. Your job is to find broken or single-theme image
references, generate paired light/dark conceptual SVG screenshots for GitHub UI
images, and report anything that still needs attention.

Before classifying, generating, or reviewing a visual, invoke `/github-brand`.
Preserve Primer product tokens and state colors when product fidelity conflicts
with the skill's palette for original workshop compositions.

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

3. Partition image references into three groups:
   - **broken** — records where `exists` is `false`
   - **theme-aware** — valid references already inside a `<picture>` block with
     both `-light` and `-dark` variants
   - **single-theme** — valid Markdown image references that do not have a
     corresponding light/dark `<picture>` pair

4. From **single-theme**, identify existing GitHub UI screenshots using the same
   filename/alt-text criteria as broken references. Sort them by workshop
   adventure priority: core, setup, advanced, then side quests. Select at most
   three migration candidates per run.

5. If **broken** and the selected migration candidates are both empty, call
   `noop` with:
   `Scanned N markdown files. No broken links or pending GitHub UI theme migrations found.`

---

## Classify References

For each broken reference and selected migration candidate, determine whether it
depicts a **GitHub UI element** that can be illustrated with a conceptual SVG.

A reference is classifiable as a GitHub UI screenshot when:
- Its filename or alt text mentions common GitHub UI elements such as: Actions
  tab, workflow run, Run workflow button, Codespace, fork, commit, schedule
  badge, skipped step, summary panel, log view, or similar.

Classify each reference as:
- `generatable` — can be illustrated with a conceptual SVG
- `not-generatable` — too specific, a real screenshot is needed (e.g. a photo
  of a custom user screen or non-GitHub UI)

---

## Generate Theme-Aware SVGs

For each `generatable` broken reference or migration candidate, generate a
light/dark SVG pair that illustrates the described GitHub UI element. If either
member of an existing pair is broken, repair or regenerate both variants as one
change set.

### SVG design rules

- **Canvas**: 1200 x 560, `viewBox="0 0 1200 560"` for both variants.
- Keep geometry, labels, and content identical across the pair; change only
  theme-dependent colors.
- Light palette: page `#f6f8fa`, panels `#ffffff`, border `#d0d7de`, primary
  text `#24292f`, muted text `#57606a`, and accent `#0969da`.
- Dark palette: page `#0d1117`, panels `#161b22`, border `#30363d`, primary
  text `#f0f6fc`, muted text `#8b949e`, and accent `#2f81f7`.
- Use a browser chrome header (height 44, rounded top corners, and the palette's
  panel and border colors) showing a mocked URL bar containing the workshop
  repo path.
- Represent GitHub's navigation tabs (Code, Issues, Pull requests, Actions,
  etc.) as a horizontal tab bar with the relevant tab underlined in the palette
  accent color.
- **Use GitHub visual language icons** (unmodified MIT-licensed Primer Octicon
  path geometry) for any GitHub entity that appears in the illustration. Follow
  the Octicon and Primer semantic state color tables in the GitHub visual
  language system section of `.github/workflows/guidelines.md`. Do not
  substitute plain rectangles or generic symbols for recognisable GitHub
  concepts.
- For Issues and Pull requests tabs/rows: include the applicable
  `issue-opened`, `issue-closed`, `git-pull-request`, `git-merge`, or
  `git-pull-request-draft` Octicon in the matching state color (open/green,
  closed/red, merged/purple, draft/grey) alongside each row.
- For Discussions: use a rounded speech-bubble outline in accent blue.
- For Actions-tab screenshots: show a workflow list panel with a single row
  representing the relevant workflow, a status icon (filled play-triangle in
  `#1a7f37` for success, hourglass or spinner in `#9a6700` for in-progress) and
  the workflow name. Apply Primer semantic state colors from the guidelines.
- For Run workflow button: render a blue button labelled "Run workflow" in the
  Actions sidebar.
- For Codespace/fork/commit dialogs: use a centered modal panel with the
  palette's panel background and border colors.
- For schedule badge / workflow list badge: render the Actions sidebar list with
  a clock-face icon (Octicon clock shape) and "Scheduled" label.
- For skipped steps: render the job-step list with a grey dash icon in the
  skipped/muted color and "Skipped" label next to the step name.
- For summary/run log panels: render a dark panel (`#0d1117`) with monospace
  output lines in `#c9d1d9`, showing representative output from the described
  step.
- Add a short annotation label below the graphic (using the palette's muted text
  color, 24 px, `"Mona Sans", system-ui, sans-serif`) echoing the alt text.
- Add `role="img"` and `aria-label` matching the alt text.
- Add `data-state` to every shape that carries a semantic GitHub state color.

### Naming convention

For a broken reference `images/08-run-summary.png`:
- Generate `workshop/images/08-run-summary-light.svg` and
  `workshop/images/08-run-summary-dark.svg`.
- Do **not** create a PNG; always produce an SVG.

For an existing single-theme SVG, preserve its stem when naming the pair. Do not
overwrite the original until all references have moved to the pair.

Write each SVG pair to the appropriate paths using the `edit` tool (or create
them fresh if the paths do not exist).

### Markdown reference update

After writing each pair, replace the corresponding Markdown image line with
GitHub's theme-aware `<picture>` pattern:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/08-run-summary-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="images/08-run-summary-light.svg">
  <img alt="Workflow run summary panel" src="images/08-run-summary-light.svg">
</picture>
```

Use the original alt text on the fallback `<img>`. Keep the light variant as the
fallback `src` and do not put alt text on `<source>` elements. When repairing an
existing `<picture>` block, update the whole block and preserve its fallback alt
text.

---

## Render and QA Generated SVGs

If you generated any SVG pairs:

1. Start a local static file server from the repository root so `workshop/images/`
   is reachable on `http://127.0.0.1`.
2. Use Playwright with `colorScheme: "light"` to render the exact `<picture>`
  block and confirm its `currentSrc` ends with `-light.svg`.
3. Repeat with `colorScheme: "dark"` and confirm `currentSrc` ends with
  `-dark.svg`.
4. Capture and inspect both rendered variants for text bleeding outside buttons,
  tabs, chips,
   dialogs, panels, annotations, or other bounding shapes.
5. If any text bleeds out of its box, fix both SVGs before continuing by
  widening the container, wrapping or shortening the label, moving nearby
  elements, or reducing font size only as much as needed.
6. Re-render both SVGs and repeat until each image is nonblank, visually
  contained, readable, and selected in the intended theme.
7. Run `scripts/check-svg-visual-language.js` with `SVG_FILES` set to the
  generated paths and fix every reported violation.

Treat the render check as required final QA, not an optional spot check.

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

If any SVG pairs were generated:

Call `create-pull-request` with:
- **Title**: `Add theme-aware SVG screenshots for N workshop images`
- **Body** summarising:
  - Which light/dark pairs were generated (list both filenames)
  - Which changes repair broken links and which migrate existing images
  - Which markdown files were updated
  - A note that these are AI-generated conceptual illustrations; maintainers
    should replace them with real screenshots when available

If no SVG pairs were generated (only `not-generatable` references exist), skip
`create-pull-request`.

---

## Output quality requirements

- Both generated SVGs must be valid, self-contained SVG markup (start with
  `<svg xmlns="http://www.w3.org/2000/svg" ...`).
- Every generated pair must pass Playwright checks in light and dark color
  schemes, including the expected `currentSrc`, nonblank pixels, and no text
  bleeding outside visual containers.
- Markdown must use the theme-aware `<picture>` block with a light fallback.
- Markdown updates must be minimal line-precise replacements — do not reformat
  surrounding content.
- Never call write tools other than `create-pull-request`, `create-issue`, and
  `noop`.