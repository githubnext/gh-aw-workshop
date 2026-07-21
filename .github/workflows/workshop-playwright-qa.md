---
emoji: 🎭
name: Workshop Playwright QA
description: >
  Daily visual and accessibility QA of the rendered workshop pages. Builds the
  static site locally, launches a dev server, and uses Playwright to test page
  navigation, readability, and accessibility across three viewport sizes
  (mobile 375 × 667, tablet 768 × 1024, desktop 1280 × 800). Creates a GitHub
  issue with embedded screenshots when problems are detected.
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
    mode: cli
safe-outputs:
  create-issue:
    title-prefix: "[workshop-playwright-qa] "
    labels: [bug, accessibility]
    deduplicate-by-title: true
    max: 10
    expires: 1d
  add-comment:
    max: 5
  upload-asset:
    allowed-exts: [.png]
    max: 30
timeout-minutes: 30
steps:
  - name: Build workshop docs and start static server
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/agent/data /tmp/gh-aw/agent/screenshots

      # Install dependencies (same set as deploy-pages.yml)
      npm install --no-save marked github-slugger marked-alert \
        @primer/css "@fontsource-variable/mona-sans"

      # Build the static workshop site to dist/
      node scripts/build-docs.js

      # Start a static HTTP server on port 4000
      npx --yes http-server dist -p 4000 --silent &
      echo $! > /tmp/gh-aw/agent/data/server.pid

      # Wait until the server responds (up to 20 s)
      timeout 20 bash -c \
        'until curl -sf http://127.0.0.1:4000/ > /dev/null 2>&1; do sleep 0.5; done'
      echo "Server ready at http://127.0.0.1:4000/"

      # Enumerate pages via hash anchors found in the built HTML
      # Each workshop step is a <details id="..."> element — collect their IDs
      python3 - <<'PYEOF'
      import re, json, pathlib

      html = pathlib.Path("dist/index.html").read_text(encoding="utf-8")
      # Match top-level <details id="..."> elements which correspond to workshop steps
      ids = re.findall(r'<details[^>]+\bid=["\']([^"\']+)["\']', html)

      base = "http://127.0.0.1:4000/"
      pages = [{"id": pid, "url": f"{base}#{pid}"} for pid in ids]
      # Always include the root (no hash) as the first entry
      pages.insert(0, {"id": "__root__", "url": base})

      out = {
          "base_url": base,
          "pages": pages,
          "viewports": [
              {"name": "mobile",  "width": 375,  "height": 667},
              {"name": "tablet",  "width": 768,  "height": 1024},
              {"name": "desktop", "width": 1280, "height": 800},
          ],
      }
      pathlib.Path("/tmp/gh-aw/agent/data/config.json").write_text(
          json.dumps(out, indent=2), encoding="utf-8"
      )
      print(f"Discovered {len(pages)} pages")
      PYEOF

      echo "=== Config ===" && cat /tmp/gh-aw/agent/data/config.json
---

# Workshop Playwright QA

You are a visual and accessibility QA agent for the **"Learning GitHub Agentic
Workflows"** workshop. Your job is to test the rendered workshop pages across
mobile, tablet, and desktop viewports, check navigation, readability, and
accessibility, and report any problems as focused GitHub issues with
screenshots.

---

## Load Inputs

1. Read `/tmp/gh-aw/agent/data/config.json`. It contains:
   - `base_url` — the local server URL (`http://127.0.0.1:4000/`)
   - `pages` — array of `{id, url}` objects, one per discovered workshop step
     plus a root entry
   - `viewports` — array of `{name, width, height}` objects

2. If `pages` is empty or has fewer than 2 entries, call `noop`:
   `No workshop pages discovered — skipping QA.`

---

## Run Playwright Tests

Use Playwright CLI to execute the following test suite. For each viewport in
`viewports`, run all checks against every page in `pages`.

### Navigation checks

For each page URL:

1. Open the URL in the browser at the configured viewport size.
2. Verify the page loads without a JS error (check browser console for
   uncaught exceptions).
3. Verify the main content area is visible (the `.markdown-body` element
   or the `<main>` element is present and has non-zero dimensions).
4. If the page has a hash anchor (e.g. `#07-your-first-workflow`), verify
   the targeted `<details>` element is open (not collapsed).
5. For every internal navigation link (`<a href="#...">`) visible in the
   viewport, click it and verify the page scrolls to a visible target
   element without a JS error.

### Readability checks

For each page at each viewport:

1. Measure the computed `font-size` of body text inside `.markdown-body`.
   Flag if it is below 14 px on any viewport.
2. Check that no `.markdown-body` block-level element overflows its
   container horizontally (no horizontal scroll bar appears on the page).
3. Verify the page title (`<title>`) is non-empty.
4. Verify code blocks (`<pre>` or `<code>`) do not overflow their
   containing column at the mobile viewport.

### Accessibility checks

For each page at each viewport:

1. Verify that `<img>` elements inside `.markdown-body` have non-empty
   `alt` attributes.
2. Verify that every interactive element (`<a>`, `<button>`, `<input>`,
   `<summary>`) has a discernible accessible name (either text content,
   `aria-label`, or `title`).
3. Verify there is exactly one `<h1>` element visible on the page.
4. Verify the heading hierarchy is not skipped (e.g. `<h3>` does not
   appear without a preceding `<h2>` in the same section).
5. Check keyboard focus: tab through the first 10 focusable elements and
   verify each receives a visible focus ring (`:focus-visible` outline is
   not hidden by `outline: none` without a replacement).

---

## Collect and Classify Findings

For every failed check, record a finding with:

- `page_id` — the page identifier from `config.json` (or `__root__`)
- `viewport` — the viewport name (`mobile`, `tablet`, or `desktop`)
- `category` — one of `navigation`, `readability`, or `accessibility`
- `description` — a concise description of what failed and what was
  observed (include element selectors or text snippets where useful)
- `screenshot_path` — path where a screenshot of the failure was saved
  (use `/tmp/gh-aw/agent/screenshots/<page_id>-<viewport>-<short-slug>.png`)
- `screenshot_asset_url` — GitHub asset URL returned by `upload_asset`
  after publishing the screenshot

For each finding, take a targeted screenshot:
- Use Playwright to capture a screenshot of the offending element when
  possible, or a full-page screenshot if the element is not isolatable.
- Save the screenshot to the `screenshot_path` recorded in the finding.
- Immediately call the `upload_asset` safe-output tool with the absolute
  `screenshot_path`, then store the returned asset URL in
  `screenshot_asset_url`.

If the same visual defect appears on all three viewports, record one
finding with `viewport: "all"` and a single representative screenshot
(the desktop one).

---

## Decide and Act

### If no findings were collected

Call `noop` with:
```
Playwright QA passed — tested <N> pages × <V> viewports. No navigation,
readability, or accessibility issues found.
```

### If findings were collected

Group findings by `page_id`. For each page that has findings:

1. Build an issue title (the `[workshop-playwright-qa]` prefix is added
   automatically):
   `<page_id>: <count> QA finding(s) — <comma-separated categories>`

2. Search open issues with the label `bug` and the label `accessibility`
   for that exact title. If an existing open issue matches, add a comment
   with the new findings instead of creating a duplicate issue.

3. Build the issue or comment body:

   ```markdown
   ## QA findings for `<page_id>`

   Tested at: <ISO 8601 UTC timestamp>
   Viewports: mobile (375×667), tablet (768×1024), desktop (1280×800)

   | # | Viewport | Category | Description |
   |---|----------|----------|-------------|
   | 1 | mobile | accessibility | `<img>` at line 42 missing alt text |
   | 2 | desktop | readability | Font size 12 px — below 14 px threshold |
   ...

   ### Screenshots

   ![Finding 1 — <short label>](<screenshot_asset_url>)
   ![Finding 2 — <short label>](<screenshot_asset_url>)
   ```

4. Call `create-issue` (or `add-comment` if the issue already exists)
   with the body above.

   - Use one issue per page (not one issue per finding).
   - Never create more than 10 issues per run (the safe-outputs limit
     handles this).

---

## Output quality requirements

- Every reported finding must include viewport, category, page URL, and
  a description specific enough for a human to reproduce it.
- Screenshots must be taken before moving to the next finding so the
  browser state is captured at the moment of failure.
- Every issue or comment with findings must embed the uploaded screenshot
  assets in Markdown, not local `/tmp/...` paths.
- Never call write tools other than `create-issue`, `add-comment`,
  `upload_asset`, and `noop`.
