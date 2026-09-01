// @ts-check
'use strict';

/**
 * SVG Color Contrast Check
 *
 * Uses the Playwright CLI to render each SVG file in a headless browser and
 * verify that every text element has sufficient WCAG contrast against its
 * effective background color. Brand-declared visuals use WCAG AA text
 * thresholds; unannotated legacy files retain the previous 3:1 baseline until
 * they are migrated to the visual metadata contract.
 *
 * Run directly:
 *   npx playwright test --config=playwright.svg-contrast.config.js
 *
 * To check a specific subset of files, set the SVG_FILES environment variable
 * to a whitespace- or newline-separated list of paths relative to the repo root:
 *   SVG_FILES="workshop/images/foo.svg workshop/images/bar.svg" \
 *     npx playwright test --config=playwright.svg-contrast.config.js
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const LEGACY_TEXT_CONTRAST = 3.0;
const NORMAL_TEXT_CONTRAST = 4.5;
const LARGE_TEXT_CONTRAST = 3.0;

function requiredTextContrast(fontSize, fontWeight, enforcesBrandContrast) {
  if (!enforcesBrandContrast) return LEGACY_TEXT_CONTRAST;
  const isLargeText =
    fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
  return isLargeText ? LARGE_TEXT_CONTRAST : NORMAL_TEXT_CONTRAST;
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

const repoRoot = path.resolve(__dirname, '..');

/** Recursively collect *.svg files under `dir`. */
function findSvgFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findSvgFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      result.push(full);
    }
  }
  return result;
}

const envFiles = process.env.SVG_FILES;
const svgFiles = envFiles !== undefined
  ? envFiles
      .split(/[\n\r\s]+/)
      .map((f) => f.trim())
      .filter((f) => f.endsWith('.svg'))
      .map((f) => path.resolve(repoRoot, f))
      .filter((f) => fs.existsSync(f))
  : findSvgFiles(path.join(repoRoot, 'workshop', 'images'));

// ---------------------------------------------------------------------------
// Dynamic test generation — one test per SVG file
// ---------------------------------------------------------------------------

if (svgFiles.length === 0) {
  test('no SVG files found', () => {
    // Nothing to check — pass silently.
  });
}

test('applies WCAG text thresholds to brand-declared visuals', () => {
  expect(requiredTextContrast(16, 400, true)).toBe(4.5);
  expect(requiredTextContrast(18.66, 700, true)).toBe(3.0);
  expect(requiredTextContrast(24, 400, true)).toBe(3.0);
  expect(requiredTextContrast(16, 400, false)).toBe(3.0);
});

for (const svgPath of svgFiles) {
  const relPath = path.relative(repoRoot, svgPath);

  test(`color contrast: ${relPath}`, async ({ page }) => {
    const svgContent = fs.readFileSync(svgPath, 'utf-8');

    // Embed the SVG in a plain HTML page with a white background — this
    // simulates how GitHub renders SVG images in README files.
    await page.setContent(
      `<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  svg { display: block; }
</style>
</head>
<body>${svgContent}</body>
</html>`,
      { waitUntil: 'load' }
    );

    // ---------------------------------------------------------------------------
    // In-browser analysis: extract text elements and their effective colors
    // ---------------------------------------------------------------------------
    const enforcesBrandContrast = await page
      .locator('svg')
      .first()
      .evaluate((svg) => svg.hasAttribute('data-visual-kind'));

    const measurements = await page.evaluate(() => {
      // --- Color helpers (must be self-contained inside evaluate) ---

      function parseColorStr(s) {
        if (!s || s === 'none' || s === 'transparent') return null;
        s = s.trim();
        if (s.startsWith('#')) {
          let hex = s.slice(1);
          if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
          if (hex.length === 6) {
            return {
              r: parseInt(hex.slice(0, 2), 16),
              g: parseInt(hex.slice(2, 4), 16),
              b: parseInt(hex.slice(4, 6), 16),
            };
          }
          return null;
        }
        const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (m) return { r: +m[1], g: +m[2], b: +m[3] };
        if (s === 'white') return { r: 255, g: 255, b: 255 };
        if (s === 'black') return { r: 0, g: 0, b: 0 };
        return null;
      }

      function toLinear(c) {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      }

      function relativeLuminance(c) {
        return 0.2126 * toLinear(c.r) + 0.7152 * toLinear(c.g) + 0.0722 * toLinear(c.b);
      }

      function contrastRatio(c1, c2) {
        const l1 = relativeLuminance(c1);
        const l2 = relativeLuminance(c2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      // --- SVG attribute helpers ---

      function numericFontWeight(value) {
        if (value === 'bold' || value === 'bolder') return 700;
        if (value === 'normal' || value === 'lighter') return 400;
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 400;
      }

      // --- Main analysis ---

      const measurements = [];

      // Flat list of all elements in DOM order (used for z-order comparisons).
      const allEls = Array.from(document.querySelectorAll('*'));

      const textEls = Array.from(document.querySelectorAll('svg text, svg tspan'));

      for (const textEl of textEls) {
        const content = textEl.textContent.trim();
        if (!content) continue;

        const bbox = textEl.getBoundingClientRect();
        // Skip invisible / zero-size elements.
        if (bbox.width === 0 || bbox.height === 0) continue;

        const computedStyle = window.getComputedStyle(textEl);
        const fillStr = computedStyle.fill || '#000000';
        const textColor = parseColorStr(fillStr);
        if (!textColor) continue;
        const fontSize = Number.parseFloat(computedStyle.fontSize);
        const fontWeight = numericFontWeight(computedStyle.fontWeight);

        const textIdx = allEls.indexOf(textEl);

        // Default background: white page background.
        let bgColor = { r: 255, g: 255, b: 255 };
        let bgSource = 'page default (white)';

        // Accumulate background by processing shapes in DOM/paint order (earliest =
        // bottommost). Each opaque shape resets the background; semi-transparent
        // shapes are alpha-composited over the current accumulator.
        //
        // Use the text element's CENTER POINT for containment tests so that
        // circular badges (e.g. numbered step circles) are detected correctly —
        // checking whether the entire text bbox fits inside a circle's bbox
        // would miss cases where the circle is just slightly smaller.
        const textCx = (bbox.left + bbox.right) / 2;
        const textCy = (bbox.top + bbox.bottom) / 2;

        const candidates = Array.from(
          document.querySelectorAll('svg rect, svg circle, svg ellipse, svg path, svg polygon')
        );

        for (const bg of candidates) {
          const bgIdx = allEls.indexOf(bg);
          // Only consider shapes painted *before* (under) the text element.
          if (bgIdx >= textIdx) continue;

          const fillAttr =
            bg.getAttribute('fill') || window.getComputedStyle(bg).fill || '';
          if (!fillAttr || fillAttr === 'none' || fillAttr === 'transparent') continue;

          const bgBbox = bg.getBoundingClientRect();
          if (bgBbox.width === 0 || bgBbox.height === 0) continue;

          // Accept if the text center point is inside the shape's bounding box.
          const contains =
            textCx >= bgBbox.left &&
            textCx <= bgBbox.right &&
            textCy >= bgBbox.top &&
            textCy <= bgBbox.bottom;

          if (!contains) continue;

          const parsed = parseColorStr(fillAttr);
          if (!parsed) continue;

          // Composite fill over the accumulated background when the element has
          // opacity < 1 (e.g. fill="#8250df" opacity="0.1" produces a near-white
          // tint rather than the solid fill color).
          const opacity = parseFloat(
            bg.getAttribute('opacity') || bg.getAttribute('fill-opacity') || '1'
          );
          if (opacity >= 1) {
            bgColor = parsed; // opaque: replace current accumulator
          } else {
            bgColor = {
              r: Math.round(parsed.r * opacity + bgColor.r * (1 - opacity)),
              g: Math.round(parsed.g * opacity + bgColor.g * (1 - opacity)),
              b: Math.round(parsed.b * opacity + bgColor.b * (1 - opacity)),
            };
          }
          bgSource = fillAttr + (opacity < 1 ? ` (opacity ${opacity})` : '');
        }

        const ratio = contrastRatio(textColor, bgColor);
        measurements.push({
          text: content.substring(0, 80),
          fill: fillStr,
          background: bgSource,
          ratio,
          fontSize: Math.round(fontSize * 100) / 100,
          fontWeight,
        });
      }

      return measurements;
    });

    const violations = measurements
      .map((measurement) => ({
        ...measurement,
        threshold: requiredTextContrast(
          measurement.fontSize,
          measurement.fontWeight,
          enforcesBrandContrast
        ),
      }))
      .filter((measurement) => measurement.ratio < measurement.threshold);

    if (violations.length > 0) {
      const report = violations
        .map(
          (v) =>
            `  text: "${v.text}"\n  fill: ${v.fill}  background: ${v.background}\n  contrast: ${Math.round(v.ratio * 100) / 100}:1  (minimum: ${v.threshold}:1; font: ${v.fontSize}px/${v.fontWeight})`
        )
        .join('\n\n');
      expect(
        violations,
        `${violations.length} color contrast violation(s) found in ${relPath}:\n\n${report}`
      ).toHaveLength(0);
    }
  });
}
