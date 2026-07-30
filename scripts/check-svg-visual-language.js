// @ts-check
'use strict';

/**
 * SVG Visual Language Check
 *
 * Validates the static, markup-level subset of the GitHub brand skill in
 * .github/skills/github-brand/SKILL.md, plus the repository-specific GitHub
 * product visual language in .github/workflows/guidelines.md.
 *
 * Checks:
 *   1. Accessibility — root <svg> must have role="img" and a non-empty,
 *      resolvable accessible name.
 *   2. Icon characters — Unicode status/icon characters (✓ ✗ ✕ ⚡ 🕐 ▶ ►)
 *      must not appear in SVG <text> nodes used as visual indicators.
 *      Use Octicon-inspired inline SVG paths instead (see guidelines).
 *   3. Canvas dimensions — light/dark variant files (*-light.svg, *-dark.svg)
 *      must use an approved 960px or 1200px canvas width.
 *   4. State-color parity — labeled state badges/pills ("Open", "Closed",
 *      "Merged", "Draft", "In progress", and aliases) must use the correct
 *      Primer semantic fill color from the guidelines palette.
 *   5. Brand metadata — visuals that declare data-visual-kind must also expose
 *      a stable ID and the kind-specific semantic child attributes.
 *   6. Technical effects — declared charts and diagrams must not use gradients.
 *
 * Run directly (checks all SVGs in workshop/images/):
 *   node scripts/check-svg-visual-language.js
 *
 * Check specific files via SVG_FILES env var:
 *   SVG_FILES="workshop/images/foo.svg workshop/images/bar.svg" \
 *     node scripts/check-svg-visual-language.js
 *
 * Exit 0 when all files pass; exit 1 when violations are found.
 */

const fs = require('fs');
const path = require('path');

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
const svgFiles = envFiles
  ? envFiles
      .split(/[\n\r\s]+/)
      .map((f) => f.trim())
      .filter((f) => f.endsWith('.svg'))
      .map((f) => path.resolve(repoRoot, f))
      .filter((f) => fs.existsSync(f))
  : findSvgFiles(path.join(repoRoot, 'workshop', 'images'));

// ---------------------------------------------------------------------------
// Primer semantic state color palette (from guidelines.md)
// Light and dark hex values, lowercased.
// ---------------------------------------------------------------------------

/** @type {Record<string, {light: string[], dark: string[]}>} */
const STATE_COLORS = {
  open: { light: ['#1a7f37'], dark: ['#3fb950'] },
  closed: { light: ['#cf222e'], dark: ['#f85149'] },
  merged: { light: ['#8250df'], dark: ['#a371f7'] },
  draft: { light: ['#57606a'], dark: ['#8b949e'] },
  // "In progress" maps to the attention/warning palette.
  'in progress': { light: ['#9a6700'], dark: ['#e3b341'] },
};

/**
 * State keywords used in diagram text labels that indicate a Primer state.
 * Maps the lowercase text label to the state key in STATE_COLORS.
 *
 * Labels are matched only when the label text is SHORT (≤ STATE_LABEL_MAX_LEN
 * characters) and the keyword appears as the COMPLETE label or as the label's
 * leading word. This avoids false positives from content strings like
 * "Draft summaries & comments" where "draft" is a modifier, not a state tag.
 * @type {Record<string, string>}
 */
const LABEL_TO_STATE = {
  open: 'open',
  closed: 'closed',
  merged: 'merged',
  draft: 'draft',
  'in progress': 'in progress',
  'in-progress': 'in progress',
  done: 'open',
  success: 'open',
  successful: 'open',
  passed: 'open',
  passing: 'open',
  complete: 'open',
  completed: 'open',
  skipped: 'draft',
  pending: 'draft',
  danger: 'closed',
  error: 'closed',
  failed: 'closed',
  failure: 'closed',
};

/**
 * Maximum length (characters) of a label hint for it to be treated as a
 * state badge/pill. Labels longer than this are assumed to be content, not
 * a status indicator.
 */
const STATE_LABEL_MAX_LEN = 15;

/**
 * Unicode characters that should be replaced with Octicon-style inline SVG
 * paths per the GitHub visual language guidelines.
 *
 * Keys are the Unicode characters; values are human-readable descriptions of
 * the recommended replacement shape.
 *
 * These are flagged only when used as standalone icon indicators (short text
 * nodes ≤ ICON_CHAR_MAX_LEN characters), not when they appear inside longer
 * terminal output strings where the character is part of the content itself.
 */
const ICON_CHARS = {
  '✓': 'Octicon check path inside a circle',
  '✔': 'Octicon check path inside a circle',
  '✗': 'Octicon X path inside a circle',
  '✕': 'Octicon X path inside a circle',
  '✘': 'Octicon X path inside a circle',
  '⚡': 'Octicon play-triangle (workflow trigger icon)',
  '🕐': 'Octicon clock-face shape (circle + hand segments)',
  '🕛': 'Octicon clock-face shape (circle + hand segments)',
  '▶': 'Octicon play-triangle inside a rounded square',
  '►': 'Octicon play-triangle inside a rounded square',
};

/**
 * Maximum length of a text node for it to be treated as a standalone icon
 * indicator. Text nodes longer than this are assumed to be content/output
 * strings (e.g. terminal output) where the character is part of the text.
 */
const ICON_CHAR_MAX_LEN = 20;

const ICON_CHARS_RE = new RegExp(
  Object.keys(ICON_CHARS)
    .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
);

// ---------------------------------------------------------------------------
// Standard canvas
// ---------------------------------------------------------------------------

/**
 * Approved canvas widths for workshop SVG files.
 * 1200px is the standard for most diagrams; 960px is used for tool-card images
 * (side-quest-01-02-*) that display in a 2-column grid layout.
 */
const APPROVED_WIDTHS = new Set([960, 1200]);

/** Regex that matches the root <svg …> opening tag. */
const SVG_OPEN_TAG_RE = /<svg\b([^>]*)>/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the value of an attribute from an SVG tag string.
 * @param {string} tag - Raw HTML/SVG tag string.
 * @param {string} name - Attribute name.
 * @returns {string | null}
 */
function attrValue(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const m = re.exec(tag);
  if (!m) return null;
  return m[1] !== undefined ? m[1] : m[2];
}

/**
 * Strip all XML/HTML tags from a string, returning only the plain text
 * content between tags. Uses a character-level scanner that provably removes
 * every `<` and `>` character (and everything between them) from the output,
 * regardless of whether tags are well-formed.
 * @param {string} str
 * @returns {string}
 */
function stripTags(str) {
  let result = '';
  let inTag = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '<') {
      inTag = true;
    } else if (c === '>') {
      inTag = false;
    } else if (!inTag) {
      result += c;
    }
  }
  return result;
}

/**
 * Resolve the non-empty text content of an element by ID.
 * @param {string} svg
 * @param {string} id
 * @returns {string | null}
 */
function textContentById(svg, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `<([\\w:-]+)\\b[^>]*\\bid\\s*=\\s*(?:"${escapedId}"|'${escapedId}')[^>]*>` +
      `([\\s\\S]*?)<\\/\\1\\s*>`,
    'i'
  );
  const match = re.exec(svg);
  if (!match) return null;
  const text = stripTags(match[2]).trim();
  return text || null;
}

/**
 * Extract all text content from SVG <text> and <tspan> elements.
 * Returns each non-empty trimmed text string found.
 * @param {string} svg
 * @returns {string[]}
 */
function extractTextContent(svg) {
  const results = [];
  const textRe = /<(?:text|tspan)\b[^>]*>([\s\S]*?)<\/(?:text|tspan)>/gi;
  let m;
  while ((m = textRe.exec(svg)) !== null) {
    const inner = stripTags(m[1]).trim();
    if (inner) results.push(inner);
  }
  return results;
}

/**
 * Find all <text>/<tspan> blocks with their fill and content.
 * Returns objects { fill, content } for every text element that has a
 * non-empty text content.
 * @param {string} svg
 * @returns {Array<{fill: string, content: string}>}
 */
function extractTextNodes(svg) {
  const results = [];
  // Match full <text …>…</text> blocks (including nested tspan).
  const textRe = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  let m;
  while ((m = textRe.exec(svg)) !== null) {
    const attrs = m[1];
    const body = m[2];
    const fill = (attrValue(attrs, 'fill') || '').toLowerCase();
    // Strip inner tags and whitespace — use the character-level scanner.
    const content = stripTags(body).trim();
    if (content) results.push({ fill, content });
  }
  return results;
}

/**
 * Find all shape elements (rect/circle/ellipse/path/polygon) and their fill
 * attribute values, along with any adjacent or nearby sibling text that might
 * label them.
 *
 * This is a heuristic. It returns {fill, labelHint, dataState} where labelHint
 * is the content of a <text> element that appears right after the shape inside
 * the same group, if present. New SVGs should prefer data-state because it is
 * deterministic; labelHint remains a compatibility fallback for older files.
 *
 * @param {string} svg
 * @returns {Array<{fill: string, labelHint: string, dataState: string}>}
 */
function extractShapeFills(svg) {
  const results = [];
  // Match shapes + their trailing text siblings within the same group.
  const shapeRe =
    /<(rect|circle|ellipse|path|polygon)\b([^>]*?)(?:\/>|>[\s\S]*?<\/\1\s*>)/gi;
  let m;
  while ((m = shapeRe.exec(svg)) !== null) {
    const attrs = m[2];
    const fill = (attrValue(attrs, 'fill') || '').toLowerCase();
    if (!fill || fill === 'none' || fill === 'transparent') continue;
    const dataState = (attrValue(attrs, 'data-state') || '').toLowerCase().trim();
    // Look for a text element within the next 800 characters (same group heuristic).
    const nearby = svg.slice(m.index + m[0].length, m.index + m[0].length + 800);
    const textM = /<text\b[^>]*>([\s\S]*?)<\/text>/i.exec(nearby);
    const labelHint = textM ? stripTags(textM[1]).trim() : '';
    results.push({ fill, labelHint, dataState });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Check functions
// ---------------------------------------------------------------------------

/**
 * @param {string} svgContent
 * @param {string} relPath
 * @returns {string[]} violation messages
 */
function checkAccessibility(svgContent, relPath) {
  const violations = [];
  const openM = SVG_OPEN_TAG_RE.exec(svgContent);
  if (!openM) {
    violations.push('No root <svg> element found.');
    return violations;
  }
  const rootAttrs = openM[1];
  const role = attrValue(rootAttrs, 'role');
  if (!role || role.trim().toLowerCase() !== 'img') {
    violations.push('Missing role="img" on root <svg> element.');
  }

  const ariaLabel = attrValue(rootAttrs, 'aria-label');
  const labelledBy = attrValue(rootAttrs, 'aria-labelledby');
  if (ariaLabel && ariaLabel.trim()) {
    return violations;
  }

  if (labelledBy && labelledBy.trim()) {
    const referencedIds = labelledBy.trim().split(/\s+/);
    const unresolvedIds = referencedIds.filter(
      (id) => textContentById(svgContent, id) === null
    );
    if (unresolvedIds.length > 0) {
      violations.push(
        `aria-labelledby references missing or empty element(s): ${unresolvedIds.join(', ')}.`
      );
    }
  } else {
    violations.push(
      'Missing non-empty accessible label on root <svg> element. ' +
        'Add aria-label="..." or aria-labelledby="..." referencing non-empty text.'
    );
  }
  return violations;
}

/**
 * @param {string} svgContent
 * @param {string} relPath
 * @returns {string[]} violation messages
 */
function checkIconCharacters(svgContent, relPath) {
  const violations = [];
  const textNodes = extractTextContent(svgContent);
  for (const text of textNodes) {
    // Skip long text nodes — these are content strings (terminal output, prose)
    // where a ✓ or similar character is part of the text itself, not an icon.
    if (text.length > ICON_CHAR_MAX_LEN) continue;
    const m = ICON_CHARS_RE.exec(text);
    if (m) {
      const char = m[0];
      const replacement = ICON_CHARS[char] || 'an Octicon-inspired inline SVG path';
      violations.push(
        `Unicode icon character ${JSON.stringify(char)} found in text node ` +
          `${JSON.stringify(text.substring(0, 60))}. ` +
          `Replace with ${replacement} per the GitHub visual language guidelines.`
      );
    }
  }
  return violations;
}

/**
 * Validate the semantic metadata contract for SVGs that opt into complex-visual
 * inspection. Existing SVGs without data-visual-kind retain compatibility while
 * newly generated charts, diagrams, and infographics receive stricter checks.
 *
 * @param {string} svgContent
 * @param {string} relPath
 * @returns {string[]} violation messages
 */
function checkBrandMetadata(svgContent, relPath) {
  const violations = [];
  const openM = SVG_OPEN_TAG_RE.exec(svgContent);
  if (!openM) return violations;

  const rootAttrs = openM[1];
  const visualKind = (attrValue(rootAttrs, 'data-visual-kind') || '')
    .toLowerCase()
    .trim();
  const visualId = (attrValue(rootAttrs, 'data-visual-id') || '').trim();
  if (!visualKind && !visualId) return violations;

  const requiredChildAttributes = {
    chart: 'data-series',
    diagram: 'data-node',
    infographic: 'data-claim',
  };
  if (!Object.hasOwn(requiredChildAttributes, visualKind)) {
    violations.push(
      'data-visual-kind must be "chart", "diagram", or "infographic".'
    );
    return violations;
  }
  if (!visualId) {
    violations.push('Missing non-empty data-visual-id on declared complex visual.');
  }

  const childAttribute = requiredChildAttributes[visualKind];
  const childAttributeRe = new RegExp(`\\b${childAttribute}\\s*=`, 'i');
  if (!childAttributeRe.test(svgContent)) {
    violations.push(
      `Declared ${visualKind} has no ${childAttribute} attributes for its semantic elements.`
    );
  }

  if (
    (visualKind === 'chart' || visualKind === 'diagram') &&
    (/<(?:linearGradient|radialGradient)\b/i.test(svgContent) ||
      /(?:linear|radial)-gradient\s*\(/i.test(svgContent))
  ) {
    violations.push(
      `Declared ${visualKind} uses a gradient. Technical charts and diagrams must use flat colors.`
    );
  }

  return violations;
}

/**
 * @param {string} svgContent
 * @param {string} relPath
 * @returns {string[]} violation messages
 */
function checkCanvasDimensions(svgContent, relPath) {
  const violations = [];
  const isThemed = /-(?:light|dark)\.svg$/i.test(relPath);
  if (!isThemed) return violations; // single-theme files are exempt

  const openM = SVG_OPEN_TAG_RE.exec(svgContent);
  if (!openM) return violations;
  const rootAttrs = openM[1];
  const viewBox = (attrValue(rootAttrs, 'viewBox') || '').trim();
  if (!viewBox) {
    violations.push('Themed variant is missing a root viewBox.');
    return violations;
  }

  // Extract dimensions from viewBox="0 0 W H".
  const vbM = viewBox.match(/^0(?:\.0+)?\s+0(?:\.0+)?\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (!vbM) {
    violations.push(
      `Themed variant uses malformed viewBox="${viewBox}". Expected "0 0 <width> <height>".`
    );
    return violations;
  }

  const width = Number(vbM[1]);
  const height = Number(vbM[2]);
  if (height <= 0) {
    violations.push(`Themed variant uses a non-positive canvas height of ${height}px.`);
  }
  if (!APPROVED_WIDTHS.has(width)) {
    violations.push(
      `Themed variant uses a non-standard canvas width of ${width}px ` +
        `(viewBox="${viewBox}"). ` +
        `Standard widths are: ${[...APPROVED_WIDTHS].join(', ')}. ` +
        'Use viewBox="0 0 1200 <height>" for full-width diagrams.'
    );
  }
  return violations;
}

/**
 * Check that state-labeled shape nodes use the correct Primer semantic color.
 *
 * Prefer explicit data-state metadata. For legacy SVGs, find shapes whose
 * nearest text sibling contains a known state label as a standalone word.
 *
 * @param {string} svgContent
 * @param {string} relPath
 * @returns {string[]} violation messages
 */
function checkStateColors(svgContent, relPath) {
  const violations = [];
  const isDark = /-dark\.svg$/i.test(relPath);
  const isLight = /-light\.svg$/i.test(relPath);
  if (!isDark && !isLight) return violations; // skip single-theme files

  const theme = isDark ? 'dark' : 'light';
  const shapes = extractShapeFills(svgContent);

  for (const { fill, labelHint, dataState } of shapes) {
    let stateKey = LABEL_TO_STATE[dataState] || null;
    let stateDescription = dataState
      ? `data-state=${JSON.stringify(dataState)}`
      : '';

    // Use the raw label for comparison (no HTML entity decoding needed since
    // state keywords like "open", "closed", "merged" contain no entities).
    const lowerLabel = labelHint.toLowerCase().trim();
    if (!stateKey && lowerLabel.length <= STATE_LABEL_MAX_LEN) {
      for (const [keyword, candidateStateKey] of Object.entries(LABEL_TO_STATE)) {
        // Match only when the label IS the state keyword (possibly with a
        // numeric count like "Open (3)" or "Closed 2"), not when the keyword
        // modifies a noun like "Draft result".
        const exactRe = new RegExp(
          `^${keyword}(?:\\s*\\(\\d+\\)|\\s+\\d+)?\\s*$`
        );
        if (!exactRe.test(lowerLabel)) continue;
        stateKey = candidateStateKey;
        stateDescription = `label ${JSON.stringify(labelHint.substring(0, 40))}`;
        break;
      }
    }
    if (!stateKey) continue;

    const expectedColors = STATE_COLORS[stateKey][theme];
    if (!expectedColors.includes(fill)) {
      violations.push(
        `Shape with ${stateDescription} suggests state "${stateKey}" but uses ` +
          `fill="${fill}". Expected Primer ${theme}-mode color: ` +
          `${expectedColors.join(' or ')}.`
      );
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let totalViolations = 0;
const errorFiles = [];

for (const svgPath of svgFiles) {
  const relPath = path.relative(repoRoot, svgPath);
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const violations = [
    ...checkAccessibility(svgContent, relPath),
    ...checkIconCharacters(svgContent, relPath),
    ...checkBrandMetadata(svgContent, relPath),
    ...checkCanvasDimensions(svgContent, relPath),
    ...checkStateColors(svgContent, relPath),
  ];

  if (violations.length > 0) {
    totalViolations += violations.length;
    errorFiles.push(relPath);
    process.stderr.write(`\n${relPath}\n`);
    for (const v of violations) {
      process.stderr.write(`  - ${v}\n`);
    }
  }
}

if (totalViolations > 0) {
  process.stderr.write(
    `\n${totalViolations} visual language violation(s) found in ${errorFiles.length} file(s).\n`
  );
  process.stderr.write(
    'See .github/skills/github-brand/SKILL.md and ' +
      '.github/workflows/guidelines.md § "GitHub visual language system".\n'
  );
  process.exit(1);
} else {
  const count = svgFiles.length;
  process.stdout.write(
    `${count} SVG file(s) checked — no visual language violations found.\n`
  );
  process.exit(0);
}
