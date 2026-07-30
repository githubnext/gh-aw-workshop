---
name: github-workshop-brand
description: Apply GitHub-inspired brand guidance to workshop experiences using measurable visual, editorial, accessibility, and trademark rules. Use when generating or reviewing workshop pages, screens, modules, exercises, diagrams, or presentation-like workshop surfaces. This skill defines brand outcomes and Playwright-verifiable acceptance criteria; it does not prescribe a renderer, file structure, or workshop technology.
---

# GitHub-Inspired Workshop Brand

## Purpose

Create workshops that feel precise, technical, confident, authentic, imaginative, and empathetic without turning them into rigid marketing documents. Treat GitHub's public Brand Toolkit as the visual and editorial reference. Adapt it for teaching, facilitation, exercises, live explanation, and participant wayfinding.

This is a workshop adaptation, not an official GitHub template. The exact palette values below come from GitHub's public toolkit. The numeric layout, typography, spacing, and interaction thresholds are operational defaults created for consistent automated review; do not describe those dimensions as official GitHub specifications.

## Priority order

When rules conflict, apply them in this order:

1. Accessibility and legibility.
2. Accurate and understandable workshop content.
3. Trademark and asset restrictions.
4. Clear hierarchy and participant wayfinding.
5. GitHub-inspired visual consistency.
6. Expressive or decorative styling.

## Brand character

Every workshop should express the following attributes through observable decisions:

- **Nerdy:** use exact terminology, clear systems, considered diagrams, visible logic, and code-inspired details where relevant.
- **Confident:** use decisive hierarchy, concise labels, and direct instructions. Avoid hype, vague superlatives, and decorative clutter.
- **Authentic:** show real constraints, honest tradeoffs, concrete examples, and credible outcomes.
- **Imaginative:** allow one or two distinctive visual moments per module, but keep them subordinate to comprehension.
- **Empathetic:** make next steps, timing, prerequisites, participation modes, and recovery paths obvious.

## Workshop adaptation

The workshop may be more flexible than a GitHub marketing asset.

Allowed:

- varied compositions across modules;
- full-width exercise areas;
- split layouts for explanation and practice;
- dark surfaces for high-focus moments;
- playful but restrained transitions or details;
- original instructional diagrams and geometric motifs;
- dense technical information when hierarchy remains clear.

Do not require:

- a marketing-style hero on every module;
- a fixed text-to-image ratio;
- GitHub Green as the dominant color on every screen;
- identical card layouts throughout;
- a rigid presentation template.

## Color system

### Core palette

Use these exact colors as the default GitHub-inspired palette:

| Role | Color |
|---|---:|
| GitHub Green | `#0FBF3E` |
| Gray 1 | `#F2F5F3` |
| Gray 2 | `#E4EBE6` |
| Gray 3 | `#B6BFB8` |
| Gray 4 | `#909692` |
| Gray 5 | `#232925` |
| Gray 6 | `#101411` |
| Green 1 | `#BFFFD1` |
| Green 2 | `#8CF2A6` |
| Green 3 | `#5FED83` |
| Green 5 | `#08872B` |
| Green 6 | `#0A241B` |
| White | `#FFFFFF` |
| Black | `#000000` |

### Required color behavior

- Neutral surfaces must visually dominate ordinary content screens.
- GitHub Green should act as a recurring anchor for emphasis, progress, separators, selected states, or key actions.
- Secondary colors are optional and must remain subordinate to the neutral-and-green system.
- Do not use color as the only indicator of status, category, order, success, failure, or selection.
- Do not place text directly over visually busy imagery.
- Do not use gradients in charts or technical diagrams.
- Avoid adjacent saturated colors in data visualizations.

### Enforceable color ratios

On screens without full-bleed photography or illustration, automated screenshot analysis should find:

- neutral colors occupying at least `65%` of sampled opaque pixels;
- `#0FBF3E` and other bright greens occupying no more than `20%` of ordinary content screens;
- bright greens occupying no more than `35%` of opening, transition, or exercise-start screens;
- any non-green secondary accent occupying no more than `10%` of sampled opaque pixels;
- no more than `2` saturated accent families on one screen.

Treat these as workshop consistency thresholds, not official GitHub color-percentage rules. Exclude photographs, videos, and supplied product screenshots from pixel-percentage calculations.

### Approved high-contrast pairings

Prefer these combinations:

| Foreground | Background | Approx. contrast |
|---|---|---:|
| `#101411` | `#F2F5F3` | `16.93:1` |
| `#232925` | `#F2F5F3` | `13.52:1` |
| `#101411` | `#E4EBE6` | `15.33:1` |
| `#101411` | `#0FBF3E` | `7.56:1` |
| `#FFFFFF` | `#08872B` | `4.66:1` |
| `#F2F5F3` | `#0A241B` | `14.93:1` |
| `#B6BFB8` | `#101411` | `9.85:1` |
| `#909692` | `#101411` | `6.16:1` |

Do not use these combinations for normal text:

- `#0FBF3E` on white or Gray 1;
- white on `#0FBF3E`;
- `#08872B` on Gray 1;
- Gray 3 or Gray 4 as body text on white or Gray 1.

`#0FBF3E` is a fill, divider, highlight, icon, progress, or focus color on dark surfaces—not a default text color on light surfaces.

## Contrast requirements

Playwright-based review must calculate contrast from computed foreground and effective background colors.

- Normal text: minimum `4.5:1`.
- Large text: minimum `3:1` only when computed size is at least `24px`, or at least `18.66px` with computed font weight `700` or greater.
- Icons, control outlines, selected-state boundaries, chart marks, and other meaningful non-text elements: minimum `3:1` against adjacent colors.
- Disabled controls may be exempt from text contrast but must remain identifiable and must not be the only representation of essential information.
- Every focus indicator must have at least `3:1` contrast against the immediately adjacent surface.

Fail the review when color alone communicates a state. A state must also have at least one of: visible text, an icon with accessible name, a shape change, a border change, a pattern, or a line-style change.

## Typography

### Typeface

- Prefer Mona Sans for titles, headings, body copy, labels, and navigation.
- Prefer Mona Sans Mono for code-like metadata, short technical labels, timestamps, commands, identifiers, and compact annotations.
- When Mona fonts are unavailable, use a high-quality system sans and system monospace fallback.
- Do not synthesize or imitate GitHub proprietary lettering.
- Do not redistribute font files unless their license and the delivery context permit it.

### Font behavior

- Use normal-width Mona Sans styles. Do not use expanded or condensed widths as the general workshop style.
- Disable discretionary and standard ligatures in headings and body copy.
- Do not manually track Mona Sans with positive or negative letter spacing. Computed `letter-spacing` should be `normal` or between `-0.01em` and `0.01em`.
- Do not set multiline uppercase text in monospace.
- Uppercase labels must be no longer than `24` characters and must occupy one rendered line.
- Use no more than `4` font weights on one screen. Preferred weights are `400`, `500`, `600`, and `700`.

### Enforceable workshop type scale

Computed sizes may interpolate responsively but must remain within these bounds:

| Role | Small viewport | Large viewport | Line-height ratio |
|---|---:|---:|---:|
| Display title | `44–56px` | `64–88px` | `0.95–1.08` |
| Primary heading | `36–48px` | `48–64px` | `1.00–1.12` |
| Section heading | `28–36px` | `36–48px` | `1.10–1.22` |
| Subheading | `22–28px` | `26–34px` | `1.18–1.32` |
| Lead text | `19–22px` | `20–24px` | `1.40–1.60` |
| Body text | `16–19px` | `18–20px` | `1.45–1.70` |
| Small text | `14–16px` | `14–16px` | `1.40–1.60` |
| Labels | `12–14px` | `12–14px` | `1.30–1.50` |

Small viewport means `<768px`. Large viewport means `>=1024px`.

Additional constraints:

- No essential text may be smaller than `14px`.
- Interactive control text must be at least `14px`.
- Diagram labels must be at least `16px` at their rendered size.
- Body paragraphs must have a rendered maximum line length of `72ch`.
- Lead paragraphs must have a rendered maximum line length of `60ch`.
- Headings must have a rendered maximum line length of `24ch`.
- A paragraph should not exceed `140` words without a subheading, list, diagram, example, or other visible break.

## Grid and layout

GitHub's public guidance emphasizes strict grid logic, consistent margins, selective visible borders, negative space, and separation between text and visuals. For workshops, use the following measurable grid while allowing purposeful composition changes.

### Base spacing unit

Use an `8px` base grid. Preferred spacing values are:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128px`

Playwright should fail unexplained margin, padding, gap, inset, or positional values that are not within `1px` of this set, except:

- `0px`;
- `1px` or `2px` borders;
- typographic line-height;
- responsive values produced by interpolation;
- intrinsic image dimensions;
- deliberate optical corrections no greater than `2px`.

### Viewport gutters

Minimum inline page padding:

| Viewport width | Minimum left/right padding |
|---|---:|
| `<480px` | `20px` |
| `480–767px` | `24px` |
| `768–1023px` | `32px` |
| `1024–1439px` | `48px` |
| `>=1440px` | `64px` |

- Maximum primary content width: `1280px`.
- Maximum reading-column width: `760px`.
- Primary content must be horizontally centered when the viewport is wider than `1280px` plus gutters.
- No ordinary content may touch the viewport edge.

### Columns and gaps

- `<768px`: `4` conceptual columns, minimum gap `16px`.
- `768–1023px`: `8` conceptual columns, minimum gap `20px`.
- `>=1024px`: `12` conceptual columns, minimum gap `24px`.
- Adjacent major regions must align to a common column edge or have an explicit full-bleed treatment.
- Two-column text layouts must collapse to one column before either column becomes narrower than `320px`.
- A text-and-visual split must preserve at least `40%` width for the text region unless the text contains fewer than `40` words.

### Vertical rhythm

- Ordinary section block padding: `48–80px` on large viewports and `32–56px` on small viewports.
- Opening and major transition block padding: `72–128px` on large viewports and `48–80px` on small viewports.
- Space between a heading and its first supporting paragraph: `16–24px`.
- Space between related paragraphs: `12–20px`.
- Space between unrelated content groups: at least `32px`.
- Space before a new major section: at least `64px` on large viewports and `48px` on small viewports.

### Borders and separation

- Standard border width: `1px`.
- Emphasis or focus border width: `2px`.
- Use visible parent-grid borders on no more than `35%` of major content regions on a screen.
- Remaining alignment should be expressed through negative space and shared edges.
- A GitHub Green divider may be `2–4px` thick.
- Do not surround every paragraph or content fragment with a card.
- No screen should contain more than `8` visually independent bordered containers.

### Corners and shadows

These are workshop operational defaults:

- Standard corner radius: `8–12px`.
- Maximum radius for ordinary panels: `16px`.
- Fully rounded shapes are reserved for compact tags, avatars, status dots, and circular controls.
- Use at most one subtle shadow level on a screen.
- Shadow blur must not exceed `24px`; vertical offset must not exceed `8px`; opacity must not exceed `0.18`.
- Do not add shadows, glows, gradients, or bevels to GitHub marks.

## Composition

- Each screen must have one dominant focal point.
- No more than `3` competing emphasis treatments may appear within the first viewport: for example, large type, saturated fill, oversized image, motion, or high-contrast panel.
- Text and visuals should normally occupy distinct regions, separated by space, a grid edge, or a `2–4px` green rule.
- Full-bleed visuals are allowed for openings and transitions, but instructional text must remain on a neutral high-contrast surface.
- Decorative content must not reduce the available text width below `320px`.
- Repeated cards in one group must use equal padding and gaps within `1px` tolerance.
- A single screen should use no more than `3` panel background colors.

## Controls and participant wayfinding

Even when the workshop is primarily presentational, participant actions and navigation must be obvious.

- Minimum interactive target: `44×44px`.
- Minimum gap between adjacent independent targets: `8px`.
- Standard button minimum height: `44px`.
- Standard button inline padding: `16–24px`.
- Standard button block padding: `10–14px`.
- Primary and secondary actions must differ by more than color alone; use fill, border, weight, icon, or position.
- Current module, current exercise, and completion state must include a text or icon indicator in addition to color.
- Focus outline: at least `2px` thick with at least `2px` offset.
- On light surfaces use a focus color at least as dark as `#08872B`.
- On dark surfaces use `#0FBF3E`, `#5FED83`, or another color meeting `3:1` non-text contrast.
- Focus indicators must not be clipped by overflow.

## Images, product UI, and photography

- Every meaningful image requires concise alternative text.
- Decorative images must be hidden from assistive technology.
- Never place essential text inside a raster image.
- Product screenshots must be simplified or cropped to one clear focal point.
- Remove unrelated browser chrome, sidebars, footers, and competing controls when they distract from the teaching point.
- Multiple screenshots in one group must have equal visible widths or heights and identical gaps within `1px`.
- Use grayscale photography only when color competes with diagrams, accents, or instructional overlays.
- Do not use photographic coverage so extensively that the neutral layout structure disappears.

## Diagrams, charts, and infographics

GitHub's diagram guidance distinguishes three related but different visual modes:

- **Charts and graphs** establish trust through accuracy, detail, legible text, and accessibility.
- **Diagrams** explain systems, relationships, and sequences in a clear, technical, instructional manner.
- **Infographics** combine icons, type, numbers, and simple composition to make a claim meaningful; they may be more expressive when a bold claim justifies it.

The rules below translate that guidance into workshop-specific, Playwright-verifiable acceptance criteria. Numeric thresholds are operational defaults, not official GitHub specifications.

### Automated inspection contract

To make diagram review deterministic without prescribing a renderer or file structure, each visual must expose one root element with:

- `data-visual-kind="chart"`, `data-visual-kind="diagram"`, or `data-visual-kind="infographic"`;
- an accessible name through `aria-label`, `aria-labelledby`, or a visible caption;
- `data-visual-id` with a value unique on the page;
- `data-series` on chart series, `data-node` on diagram nodes, and `data-claim` on infographic claims when those elements are represented in the DOM or SVG.

If a visual is rendered as a single image, it must provide equivalent alternative text and is exempt from internal geometry checks. It is not exempt from size, contrast, naming, or text-alternative requirements.

Decorative marks inside a visual must have `aria-hidden="true"`. Meaningful marks must be named directly or explained by a visible legend, annotation, caption, or text alternative.

### Shared requirements

- The visual must communicate an accurate relationship, sequence, comparison, distribution, or claim. Decorative diagrams that imply analysis without supporting information fail review.
- Every line, color, symbol, and label must have an informational or wayfinding purpose.
- Minimum rendered label size: `16px`.
- Minimum rendered annotation size: `14px`; annotations at `14px` must not contain essential standalone instructions.
- Minimum meaningful line or connector stroke: `2px`.
- Minimum data-mark diameter: `8px`.
- Minimum arrowhead length and width: `8px`.
- Minimum spacing between unrelated labels, nodes, or marks: `16px`; preferred spacing is `24px` or more.
- No label may overlap another label, line, node, data mark, legend key, or viewport edge by more than `1px`.
- Meaningful text must meet WCAG contrast requirements. Meaningful lines, boundaries, and marks must meet at least `3:1` contrast against adjacent colors.
- Color must never be the only means of identifying a series, category, node type, state, or direction.
- All complex visuals require an adjacent caption or text alternative that states the main relationship, sequence, or conclusion.
- Do not use decorative illustration, texture, shadows, glows, bevels, or photographic backgrounds inside technical visuals.
- Do not use CSS, SVG, or canvas gradients in charts, graphs, or technical diagrams.
- Do not animate data values, connectors, or claims continuously. Motion may reveal sequence once but must obey reduced-motion requirements.

### Charts and graphs

Charts and graphs must prioritize trust, legibility, accessibility, and attention to detail. They are not illustration surfaces.

#### Required chart behavior

- Every axis must have a visible title unless its meaning is explicit from direct labels and the caption.
- Every quantitative axis must expose its unit in the title, tick labels, direct labels, or caption.
- Every series must be directly labeled or represented in a legend.
- Every legend key must pair color with at least one non-color identifier: text, marker shape, line pattern, symbol, or direct label.
- Use no more than `6` simultaneous data series. More than `6` is a warning and requires direct labeling or small multiples.
- Use no more than `2` saturated accent families in one chart.
- Bright GitHub Green may identify one primary series or one highlighted interval; it must not color every series.
- Color may group complex data only when grouping cannot be expressed more clearly through position, labels, small multiples, line pattern, or marker shape.
- Gridlines must be visually subordinate to data marks. Their contrast against the plot background must be between `1.2:1` and `3:1`.
- Data marks must have at least `3:1` contrast against the plot background and remain distinguishable from neighboring series.
- Line charts must use a minimum `2px` series stroke. A highlighted series may use `3–4px`; no ordinary series may exceed `4px`.
- Bar, area, or block charts must preserve at least `2px` visible separation between adjacent categories unless a stacked relationship is intentional.
- A zero baseline is required for bar charts that encode magnitude by length. A truncated quantitative axis must be explicitly labeled as truncated.
- Three-dimensional chart effects, exploded perspective, decorative pseudo-depth, and pictorial bars are prohibited.
- Values displayed as text must match the represented data within the precision shown.

#### Adjacent-color rule

GitHub's guidance warns against adjacent color in charts. For automated review:

- Two touching categorical fills must not both have computed HSL saturation above `60%` unless a separating border of at least `2px` provides `3:1` contrast against both fills.
- Two overlapping or crossing series that rely on color must also differ by marker shape, line dash, direct label, or stroke width of at least `1px`.
- Sequential values should normally use one hue family with varying lightness rather than multiple unrelated saturated hues.

#### Chart Playwright failures

Fail when any of the following is detected:

- a `linearGradient`, `radialGradient`, or computed gradient is used inside a chart;
- a series has no accessible or visible identifier;
- color is the sole series identifier;
- an axis lacks a unit when values are not dimensionless;
- a bar chart omits zero without an explicit truncation label;
- chart text or marks violate contrast thresholds;
- decorative raster or vector illustration is placed inside the plot area;
- adjacent saturated fills violate the adjacent-color rule.

### Technical diagrams

Diagrams should feel clear, technical, and instructional. They explain how parts relate, how information moves, or how a sequence unfolds.

#### Required diagram behavior

- Each diagram must have one primary reading direction: left-to-right, top-to-bottom, radial, or explicitly numbered sequence.
- The reading direction must be inferable from arrows, numbering, labels, or spatial order without relying on color.
- Minimum node padding: `12px` vertically and `16px` horizontally.
- Minimum gap between unrelated nodes: `24px`.
- Minimum gap between a connector and an unrelated node or label: `12px`.
- Connector endpoints must visually touch or terminate within `2px` of the relevant node boundary or anchor.
- Arrowheads must point toward the destination and must not be used on undirected relationships.
- Parallel connectors must remain at least `8px` apart unless intentionally bundled and labeled.
- Connector crossings should be avoided. More than `2` crossings in a diagram with `12` or fewer nodes is a warning; crossings that obscure direction or labels fail review.
- Every node type must be directly labeled or explained in an adjacent legend.
- Repeated node types must use consistent fill, border, corner radius, padding, typography, and connector treatment within `1px` tolerance.
- A diagram with more than `12` nodes must be divided into labeled regions, stages, layers, or progressive views.
- A diagram with more than `20` nodes in one viewport is a warning unless search, zoom, filtering, or progressive disclosure is available.

#### Color blocking

GitHub allows occasional color blocking for key pillars such as Copilot or Security, or when color materially improves clarity.

Use color blocking only when it establishes a meaningful domain, stage, ownership boundary, trust boundary, or key pillar.

- Use no more than `3` colored regions in one technical diagram.
- Colored regions must occupy no more than `40%` of the diagram's opaque area unless the entire diagram represents one explicitly named pillar.
- At least `60%` of ordinary nodes should remain neutral when multiple node types are present.
- Every colored region requires a visible text label; color alone cannot name the region.
- Region fills must maintain text contrast and must not reduce connector contrast below `3:1`.
- Do not assign a distinct saturated color to every node.
- Do not use GitHub Green for both a region and an unrelated state in the same diagram.

#### Diagram Playwright failures

Fail when any of the following is detected:

- the diagram has no accessible name or text alternative;
- the primary reading direction is not discernible from non-color cues;
- a connector does not terminate at its intended node within the allowed tolerance;
- labels overlap connectors, nodes, or other labels;
- repeated node types use inconsistent geometry beyond tolerance;
- a colored region lacks a visible text label;
- more than `3` colored regions are used without an explicit documented exception;
- gradients, decorative illustration, or non-instructional visual effects are present.

### Infographics

Infographics may be more expressive than charts or technical diagrams. They use icons, type, numbers, and simple layout to explain why a claim matters. A bold claim may break the grid, but it must not break comprehension or accessibility.

#### Required infographic behavior

- Each infographic must have one dominant claim marked with `data-claim="primary"` or identified by the largest visible claim text.
- The primary claim must be at least `1.35×` the computed font size of supporting claim text.
- Use no more than `3` emphasized numeric claims in one viewport.
- Each emphasized number must include an adjacent visible unit, denominator, comparison basis, or explanatory label.
- Icons may reinforce a claim but must not replace its text label or unit.
- Use no more than `3` primary visual groups in one viewport.
- Use no more than `2` saturated accent families.
- Supporting decoration must occupy less than `25%` of the infographic's opaque area.
- A claim that extends outside the normal grid must remain fully visible, preserve minimum gutters, and not overlap other content.
- Comparative claims must identify the compared groups and basis of comparison.
- Statistical claims must include a source, footnote, or citation when the workshop presents them as factual evidence.
- Emotional or expressive composition must not imply a quantitative relationship that the data does not support.

#### Infographic Playwright failures

Fail when any of the following is detected:

- no dominant claim is identifiable;
- an emphasized number lacks a visible unit or explanatory label;
- more than `3` competing numeric claims appear in one viewport;
- icons are the only explanation of a claim;
- a bold claim overflows, clips, or violates minimum gutters;
- a comparative claim omits the comparison basis;
- decorative content visually outweighs the information hierarchy.

### Diagram review output

For each reviewed visual, report:

1. Visual kind: `chart`, `diagram`, or `infographic`.
2. Overall result: `PASS`, `PASS WITH WARNINGS`, or `FAIL`.
3. Accessible name and text-alternative status.
4. Label size, contrast, overlap, and clipping results.
5. Color count, saturated accent count, gradient usage, and color-only encodings.
6. Kind-specific checks: axes and series for charts; nodes, connectors, direction, and regions for diagrams; dominant claim and evidence labeling for infographics.
7. Each failure's observed value, required value, affected element, viewport, and proposed correction.

## Motion

Motion may guide attention, demonstrate change, or reinforce sequence. It must not resemble a generic presentation effect.

- Micro-interactions: `100–250ms`.
- Small entrance or state transitions: `150–350ms`.
- Major workshop transitions: maximum `500ms`.
- No continuously moving decorative element may run longer than `5s` without stopping or offering a pause mechanism.
- Avoid parallax, rapid zoom, flashing, and large-area looping animation.
- Under `prefers-reduced-motion: reduce`, all non-essential animation and smooth scrolling must have computed duration no greater than `10ms` and iteration count no greater than `1`.

## Voice and workshop copy

- Use exact language and correct punctuation.
- Prefer concrete verbs: build, compare, inspect, map, test, decide, explain.
- Address the participant as “you.”
- Keep labels short and literal.
- State timeboxes as explicit durations.
- State exercise success conditions as observable outcomes.
- Avoid campaign language such as “revolutionary,” “game-changing,” “unleash,” or “the future of” unless it is a direct quotation with context.
- Avoid unexplained insider jokes or references.
- Define specialized terms on first use.
- Do not fabricate product behavior, data, quotations, benchmarks, or workshop outcomes.

### Enforceable copy limits

- Navigation label: maximum `28` characters.
- Button label: maximum `24` characters.
- Eyebrow or category label: maximum `32` characters.
- Exercise title: maximum `8` words.
- Screen title: maximum `12` words.
- Subtitle or lead: maximum `32` words.
- Instruction step: maximum `35` words before a nested explanation or example.
- Avoid more than `2` consecutive sentences longer than `28` words.

## Logo, mascot, and trademark restrictions

- Use the name **GitHub** as one word with a capital G and H.
- Do not create, redraw, trace, approximate, animate, or modify the Invertocat, Octocat, GitHub wordmark, Mona, Copilot, Ducky, product lockups, or GitHub-owned illustration styles.
- Do not use a GitHub mark as the workshop's own logo.
- Do not imply that the workshop is produced, sponsored, approved, or endorsed by GitHub.
- Use an official GitHub asset only when the user supplies or authorizes it and the use is permitted.
- An authorized mark must preserve its intrinsic aspect ratio within `0.5%`.
- Do not crop, recolor, skew, rotate, distort, mask, combine, outline, shadow, glow, or place effects on a GitHub mark.
- Place an authorized mark only on a plain surface with adequate contrast.
- The GitHub mark must be less prominent than the workshop owner or organizer identity unless the workshop is officially GitHub-owned.

## Automated acceptance profile

Run visual and computed-style checks at these viewports:

- `360×800`
- `768×1024`
- `1280×800`
- `1440×900`
- `1920×1080`

The workshop passes only when all hard requirements below pass at every relevant viewport.

### Hard requirements

- No horizontal document overflow greater than `1px`.
- No visible text clipping, ellipsis, or overflow unless the element is explicitly a single-line compact label.
- No two visible text elements overlap by more than `1px`.
- No meaningful content is outside the viewport or unreachable by scrolling.
- All normal and large text meet the required contrast ratio.
- All meaningful non-text elements meet `3:1` contrast.
- All interactive targets meet `44×44px` minimum size.
- All visible focus states meet thickness, offset, contrast, and clipping rules.
- Heading levels do not skip from `h1` to `h3` or lower.
- Every meaningful image has alternative text.
- Every form control has an accessible name.
- Every state conveyed with color has an additional non-color cue.
- Every chart, diagram, and infographic exposes a unique visual identifier, a declared visual kind, and an accessible name or visible caption.
- Charts contain no gradients or decorative illustration, identify every series without color alone, and label quantitative units.
- Technical diagrams expose a non-color reading direction; connectors terminate at intended nodes; labeled color blocking stays within the defined limits.
- Infographics contain one dominant claim, label every emphasized number, and keep decorative content subordinate to the claim hierarchy.
- Body, heading, label, and diagram type sizes remain inside their allowed ranges.
- Page gutters meet the viewport-specific minimums.
- Primary content does not exceed `1280px`; reading columns do not exceed `760px`.
- Required gaps and paddings align to the approved spacing scale within tolerance.
- No ordinary panel exceeds `16px` radius.
- No screen exceeds `8` bordered containers or `3` panel background colors.
- Reduced-motion mode disables non-essential motion according to the motion thresholds.
- Authorized GitHub marks preserve aspect ratio and contain no CSS filters, transforms, shadows, gradients, masks, or recoloring.

### Review warnings

Warnings require a deliberate documented exception but do not automatically fail:

- green or secondary accent pixel ratios exceed the recommended range;
- more than `35%` of major regions expose visible parent-grid borders;
- a screen uses more than `3` emphasis treatments;
- a paragraph exceeds `140` words without a visual break;
- a screen uses more than `4` font weights;
- a chart uses more than `6` series colors;
- a technical diagram with `12` or fewer nodes contains more than `2` connector crossings;
- a technical diagram contains more than `20` nodes in one viewport without progressive disclosure;
- an infographic uses more than `3` emphasized numeric claims or more than `3` primary visual groups;
- a module repeats the same composition more than `3` times consecutively;
- photography or illustration occupies more than `60%` of an ordinary instructional screen.

## Required review report

When reviewing a workshop, return:

1. Overall result: `PASS`, `PASS WITH WARNINGS`, or `FAIL`.
2. Hard failures grouped by color, type, layout, accessibility, diagrams, interaction, and trademark.
3. Each failure's viewport, affected element, observed value, required value, and proposed correction.
4. Warnings and intentional exceptions.
5. A concise statement explaining whether the result is GitHub-inspired, officially authorized, or neither. Never imply official authorization without evidence.

## Source basis

This skill is based on the public GitHub Brand Toolkit, especially its guidance on:

- brand attributes;
- accessibility and WCAG AA contrast;
- the primary neutral-and-green palette;
- Mona Sans and Mona Sans Mono;
- strict grid logic, margins, selective borders, and negative space;
- separation between text and visuals;
- accurate, legible charts and diagrams without gradients, decorative illustration, adjacent saturated colors, or color-only meaning;
- restrained color grouping, occasional labeled color blocking for key pillars, and simple claim-led infographics;
- experiential work grounded in developer culture;
- consistent and legally permitted logo usage.

Primary references:

- <https://brand.github.com/>
- <https://brand.github.com/graphic-elements/diagrams>
