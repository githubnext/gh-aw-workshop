# Charts, diagrams, and infographics

GitHub's diagram guidance distinguishes three related but different visual modes:

- **Charts and graphs** establish trust through accuracy, detail, legible text,
  and accessibility.
- **Diagrams** explain systems, relationships, and sequences in a clear,
  technical, instructional manner.
- **Infographics** combine icons, type, numbers, and simple composition to make
  a claim meaningful; they may be more expressive when a bold claim justifies it.

The rules below translate that guidance into workshop-specific,
Playwright-verifiable acceptance criteria. Numeric thresholds are operational
defaults, not official GitHub specifications.

## Automated inspection contract

To make diagram review deterministic without prescribing a renderer or file
structure, each visual must expose one root element with:

- `data-visual-kind="chart"`, `data-visual-kind="diagram"`, or
  `data-visual-kind="infographic"`;
- an accessible name through `aria-label`, `aria-labelledby`, or a visible
  caption;
- `data-visual-id` with a value unique on the page;
- `data-series` on chart series, `data-node` on diagram nodes, and `data-claim`
  on infographic claims when those elements are represented in the DOM or SVG.

If a visual is rendered as a single image, it must provide equivalent
alternative text and is exempt from internal geometry checks. It is not exempt
from size, contrast, naming, or text-alternative requirements.

Decorative marks inside a visual must have `aria-hidden="true"`. Meaningful
marks must be named directly or explained by a visible legend, annotation,
caption, or text alternative.

## Shared requirements

- The visual must communicate an accurate relationship, sequence, comparison,
  distribution, or claim. Decorative diagrams that imply analysis without
  supporting information fail review.
- Every line, color, symbol, and label must have an informational or wayfinding
  purpose.
- Minimum rendered label size: `16px`.
- Minimum rendered annotation size: `14px`; annotations at `14px` must not
  contain essential standalone instructions.
- Minimum meaningful line or connector stroke: `2px`.
- Minimum data-mark diameter: `8px`.
- Minimum arrowhead length and width: `8px`.
- Minimum spacing between unrelated labels, nodes, or marks: `16px`; preferred
  spacing is `24px` or more.
- No label may overlap another label, line, node, data mark, legend key, or
  viewport edge by more than `1px`.
- Meaningful text must meet WCAG contrast requirements. Meaningful lines,
  boundaries, and marks must meet at least `3:1` contrast against adjacent
  colors.
- Color must never be the only means of identifying a series, category, node
  type, state, or direction.
- All complex visuals require an adjacent caption or text alternative that
  states the main relationship, sequence, or conclusion.
- Do not use decorative illustration, texture, shadows, glows, bevels, or
  photographic backgrounds inside technical visuals.
- Do not use CSS, SVG, or canvas gradients in charts, graphs, or technical
  diagrams.
- Do not animate data values, connectors, or claims continuously. Motion may
  reveal sequence once but must obey reduced-motion requirements.

## Charts and graphs

Charts and graphs must prioritize trust, legibility, accessibility, and
attention to detail. They are not illustration surfaces.

### Required chart behavior

- Every axis must have a visible title unless its meaning is explicit from
  direct labels and the caption.
- Every quantitative axis must expose its unit in the title, tick labels,
  direct labels, or caption.
- Every series must be directly labeled or represented in a legend.
- Every legend key must pair color with at least one non-color identifier:
  text, marker shape, line pattern, symbol, or direct label.
- Use no more than `6` simultaneous data series. More than `6` is a warning and
  requires direct labeling or small multiples.
- Use no more than `2` saturated accent families in one chart.
- Bright GitHub Green may identify one primary series or one highlighted
  interval; it must not color every series.
- Color may group complex data only when grouping cannot be expressed more
  clearly through position, labels, small multiples, line pattern, or marker
  shape.
- Gridlines must be visually subordinate to data marks. Their contrast against
  the plot background must be between `1.2:1` and `3:1`.
- Data marks must have at least `3:1` contrast against the plot background and
  remain distinguishable from neighboring series.
- Line charts must use a minimum `2px` series stroke. A highlighted series may
  use `3–4px`; no ordinary series may exceed `4px`.
- Bar, area, or block charts must preserve at least `2px` visible separation
  between adjacent categories unless a stacked relationship is intentional.
- A zero baseline is required for bar charts that encode magnitude by length. A
  truncated quantitative axis must be explicitly labeled as truncated.
- Three-dimensional chart effects, exploded perspective, decorative
  pseudo-depth, and pictorial bars are prohibited.
- Values displayed as text must match the represented data within the precision
  shown.

### Adjacent-color rule

GitHub's guidance warns against adjacent color in charts. For automated review:

- Two touching categorical fills must not both have computed HSL saturation
  above `60%` unless a separating border of at least `2px` provides `3:1`
  contrast against both fills.
- Two overlapping or crossing series that rely on color must also differ by
  marker shape, line dash, direct label, or stroke width of at least `1px`.
- Sequential values should normally use one hue family with varying lightness
  rather than multiple unrelated saturated hues.

### Chart Playwright failures

Fail when any of the following is detected:

- a `linearGradient`, `radialGradient`, or computed gradient is used inside a
  chart;
- a series has no accessible or visible identifier;
- color is the sole series identifier;
- an axis lacks a unit when values are not dimensionless;
- a bar chart omits zero without an explicit truncation label;
- chart text or marks violate contrast thresholds;
- decorative raster or vector illustration is placed inside the plot area;
- adjacent saturated fills violate the adjacent-color rule.

## Technical diagrams

Diagrams should feel clear, technical, and instructional. They explain how
parts relate, how information moves, or how a sequence unfolds.

### Required diagram behavior

- Each diagram must have one primary reading direction: left-to-right,
  top-to-bottom, radial, or explicitly numbered sequence.
- The reading direction must be inferable from arrows, numbering, labels, or
  spatial order without relying on color.
- Minimum node padding: `12px` vertically and `16px` horizontally.
- Minimum gap between unrelated nodes: `24px`.
- Minimum gap between a connector and an unrelated node or label: `12px`.
- Connector endpoints must visually touch or terminate within `2px` of the
  relevant node boundary or anchor.
- Arrowheads must point toward the destination and must not be used on
  undirected relationships.
- Parallel connectors must remain at least `8px` apart unless intentionally
  bundled and labeled.
- Connector crossings should be avoided. More than `2` crossings in a diagram
  with `12` or fewer nodes is a warning; crossings that obscure direction or
  labels fail review.
- Every node type must be directly labeled or explained in an adjacent legend.
- Repeated node types must use consistent fill, border, corner radius, padding,
  typography, and connector treatment within `1px` tolerance.
- A diagram with more than `12` nodes must be divided into labeled regions,
  stages, layers, or progressive views.
- A diagram with more than `20` nodes in one viewport is a warning unless
  search, zoom, filtering, or progressive disclosure is available.

### Color blocking

GitHub allows occasional color blocking for key pillars such as Copilot or
Security, or when color materially improves clarity.

Use color blocking only when it establishes a meaningful domain, stage,
ownership boundary, trust boundary, or key pillar.

- Use no more than `3` colored regions in one technical diagram.
- Colored regions must occupy no more than `40%` of the diagram's opaque area
  unless the entire diagram represents one explicitly named pillar.
- At least `60%` of ordinary nodes should remain neutral when multiple node
  types are present.
- Every colored region requires a visible text label; color alone cannot name
  the region.
- Region fills must maintain text contrast and must not reduce connector
  contrast below `3:1`.
- Do not assign a distinct saturated color to every node.
- Do not use GitHub Green for both a region and an unrelated state in the same
  diagram.

### Diagram Playwright failures

Fail when any of the following is detected:

- the diagram has no accessible name or text alternative;
- the primary reading direction is not discernible from non-color cues;
- a connector does not terminate at its intended node within the allowed
  tolerance;
- labels overlap connectors, nodes, or other labels;
- repeated node types use inconsistent geometry beyond tolerance;
- a colored region lacks a visible text label;
- more than `3` colored regions are used without an explicit documented
  exception;
- gradients, decorative illustration, or non-instructional visual effects are
  present.

## Infographics

Infographics may be more expressive than charts or technical diagrams. They use
icons, type, numbers, and simple layout to explain why a claim matters. A bold
claim may break the grid, but it must not break comprehension or accessibility.

### Required infographic behavior

- Each infographic must have one dominant claim marked with
  `data-claim="primary"` or identified by the largest visible claim text.
- The primary claim must be at least `1.35×` the computed font size of
  supporting claim text.
- Use no more than `3` emphasized numeric claims in one viewport.
- Each emphasized number must include an adjacent visible unit, denominator,
  comparison basis, or explanatory label.
- Icons may reinforce a claim but must not replace its text label or unit.
- Use no more than `3` primary visual groups in one viewport.
- Use no more than `2` saturated accent families.
- Supporting decoration must occupy less than `25%` of the infographic's
  opaque area.
- A claim that extends outside the normal grid must remain fully visible,
  preserve minimum gutters, and not overlap other content.
- Comparative claims must identify the compared groups and basis of comparison.
- Statistical claims must include a source, footnote, or citation when the
  workshop presents them as factual evidence.
- Emotional or expressive composition must not imply a quantitative
  relationship that the data does not support.

### Infographic Playwright failures

Fail when any of the following is detected:

- no dominant claim is identifiable;
- an emphasized number lacks a visible unit or explanatory label;
- more than `3` competing numeric claims appear in one viewport;
- icons are the only explanation of a claim;
- a bold claim overflows, clips, or violates minimum gutters;
- a comparative claim omits the comparison basis;
- decorative content visually outweighs the information hierarchy.

## Review output

For each reviewed visual, report:

1. Visual kind: `chart`, `diagram`, or `infographic`.
2. Overall result: `PASS`, `PASS WITH WARNINGS`, or `FAIL`.
3. Accessible name and text-alternative status.
4. Label size, contrast, overlap, and clipping results.
5. Color count, saturated accent count, gradient usage, and color-only
   encodings.
6. Kind-specific checks: axes and series for charts; nodes, connectors,
   direction, and regions for diagrams; dominant claim and evidence labeling
   for infographics.
7. Each failure's observed value, required value, affected element, viewport,
   and proposed correction.
