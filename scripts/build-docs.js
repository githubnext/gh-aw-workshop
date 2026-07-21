#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { default: GithubSlugger } = require('github-slugger');
const markedAlert = require('marked-alert');

// Plugin: clickable heading anchors with GitHub-compatible IDs
const slugger = new GithubSlugger();
marked.use({
  // Reset the slugger before each marked() call to avoid duplicate-ID drift
  hooks: {
    preprocess(src) { slugger.reset(); return src; },
  },
  useNewRenderer: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      // Extract plain text from tokens (avoids regex-based HTML stripping)
      const raw = tokens.map(function flattenTokenText(t) {
        return t.tokens ? t.tokens.map(flattenTokenText).join('') : (t.text || t.raw || '');
      }).join('').trim();
      // slugger.slug() always returns a URL-safe [a-z0-9-] string, safe for attribute interpolation
      const id = slugger.slug(raw);
      // text is the HTML output of parseInline(), which escapes user content
      return `<h${depth} id="${id}">${text} <a href="#${id}" class="anchor" aria-label="Link to this heading">#</a></h${depth}>\n`;
    },
    // Plugin: render GFM task list items with GitHub-compatible CSS classes
    listitem(item) {
      if (item.task) {
        // Extract inline tokens after the checkbox token. In tight lists the
        // item tokens are [checkbox, ...inline]; in loose lists they are
        // [paragraph{ tokens: [checkbox, ...inline] }, ...].
        const inlineTokens = item.loose && item.tokens[0]?.tokens
          ? item.tokens[0].tokens.slice(1)
          : item.tokens.slice(1);
        const text = this.parser.parseInline(inlineTokens);
        const baseAttrs = 'class="task-list-item-checkbox" disabled="" type="checkbox"';
        const attrs = item.checked ? `${baseAttrs} checked=""` : baseAttrs;
        return `<li class="task-list-item"><input ${attrs}> ${text}</li>\n`;
      }
      return false; // use default rendering for non-task items
    },
  },
});

// Plugin: render GitHub GFM alert callouts (> [!NOTE], > [!TIP], etc.)
marked.use(markedAlert());

const workshopDir = path.join(__dirname, '..', 'workshop');
const distDir = path.join(__dirname, '..', 'dist');
const workshopImagesDir = path.join(workshopDir, 'images');
const distImagesDir = path.join(distDir, 'images');

// Collect and sort workshop markdown files (excludes non-md files; keeps README)
const files = fs.readdirSync(workshopDir)
  .filter(f => f.endsWith('.md'))
  .sort();

const sectionIdsByFile = new Map(
  files.map(f => [f, path.basename(f, '.md')])
);

// Plugin: rewrite .md links to reveal.js section hash links
marked.use({
  useNewRenderer: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : '';
      if (href) {
        const markdownPageLink = href.match(/^(?<file>[^/?#]+\.md)(?<hash>#[^?]+)?$/);
        if (markdownPageLink) {
          const targetFile = markdownPageLink.groups?.file;
          const targetHash = markdownPageLink.groups?.hash;
          const targetSectionId = sectionIdsByFile.get(targetFile);
          if (targetSectionId) {
            const rewrittenHref = targetHash ?? `#${targetSectionId}`;
            return `<a href="${rewrittenHref}"${titleAttr}>${text}</a>`;
          }
        }
      }
      return false;
    },
  },
});

// ---------------------------------------------------------------------------
// Multi-dimensional slide grouping
//
// Horizontal axis  = numbered workshop steps (00, 01, 02, …)
// Vertical axis    = sub-steps (NNa, NNb, …) and side-quests for each step
//
// Grouping rules (evaluated in priority order):
//   README.md              → group 'readme'  (appears first)
//   side-quest-NN-…        → group 'NN'  (vertical under the matching numbered step)
//   NN-slug.md / NNx-*.md  → group 'NN'  (leading digit run)
//   other (e.g. side-quest-enterprise-setup.md) → own group keyed by basename
// ---------------------------------------------------------------------------

function getGroupKey(filename) {
  if (filename === 'README.md') return 'readme';
  // Check for numbered side-quest files first (side-quest-NN-…) so they are
  // grouped under their parent step rather than treated as a numbered step.
  const sideQuestNumMatch = filename.match(/^side-quest-(\d+)-/);
  if (sideQuestNumMatch) return sideQuestNumMatch[1];
  // Numbered step files: NN-slug.md or NNx-slug.md → group by leading digits.
  const stepMatch = filename.match(/^(\d+)/);
  if (stepMatch) return stepMatch[1];
  // Non-numeric files (e.g. side-quest-enterprise-setup.md) → own group.
  return path.basename(filename, '.md');
}

// Returns a numeric sort key so groups appear in step order.
// 'readme' sorts before all numeric steps; non-numeric keys sort last.
function groupSortKey(key) {
  if (key === 'readme') return -Infinity;
  const n = parseInt(key, 10);
  return isNaN(n) ? Infinity : n;
}

// Build ordered group map  (key → [filenames in sorted order])
const groups = new Map();
for (const f of files) {
  const key = getGroupKey(f);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(f);
}
const sortedGroupKeys = [...groups.keys()].sort(
  (a, b) => groupSortKey(a) - groupSortKey(b)
);

// Render a single workshop file as a reveal.js <section>
function renderSlide(filename) {
  const sectionId = sectionIdsByFile.get(filename);
  const markdown = fs.readFileSync(path.join(workshopDir, filename), 'utf8').trim();
  const isSideQuest = filename.startsWith('side-quest-');
  const content = marked(markdown);
  const slideClass = isSideQuest ? ' class="side-quest-slide"' : '';
  return `<section id="${sectionId}"${slideClass}>\n<div class="markdown-body slide-content">\n${content}\n</div>\n</section>`;
}

// Build reveal.js slides HTML
// - Groups with one file  → bare <section> (horizontal slide)
// - Groups with multiple  → outer <section id="groupKey"> wrapping vertical <section> elements
const slidesHtml = sortedGroupKeys.map(key => {
  const groupFiles = groups.get(key);
  if (groupFiles.length === 1) {
    return renderSlide(groupFiles[0]);
  }
  const innerSlides = groupFiles.map(renderSlide).join('\n');
  return `<section id="${key}">\n${innerSlides}\n</section>`;
}).join('\n\n');

// ---------------------------------------------------------------------------
// Write output files
// ---------------------------------------------------------------------------

fs.mkdirSync(distDir, { recursive: true });

// Copy workshop images for rendered markdown links
if (fs.existsSync(workshopImagesDir)) {
  fs.cpSync(workshopImagesDir, distImagesDir, { recursive: true });
}

// Copy Primer CSS
const primerCssSrc = path.join(
  __dirname, '..', 'node_modules', '@primer', 'css', 'dist', 'primer.css'
);
fs.copyFileSync(primerCssSrc, path.join(distDir, 'primer.css'));

// Copy reveal.js core files locally so the build is self-contained
const revealJsDir = path.join(__dirname, '..', 'node_modules', 'reveal.js');
fs.copyFileSync(path.join(revealJsDir, 'dist', 'reveal.js'),  path.join(distDir, 'reveal.js'));
fs.copyFileSync(path.join(revealJsDir, 'dist', 'reveal.css'), path.join(distDir, 'reveal.css'));
fs.mkdirSync(path.join(distDir, 'theme'), { recursive: true });
fs.copyFileSync(
  path.join(revealJsDir, 'dist', 'theme', 'white.css'),
  path.join(distDir, 'theme', 'white.css')
);

// Generate alert callout CSS for marked-alert GFM rendering
const alertsCss = `/* Alert callout styles for GitHub GFM > [!NOTE] / [!TIP] / etc. */
.markdown-alert {
  padding: 0.5rem 1rem;
  margin-bottom: 16px;
  border-left: 0.25em solid;
  border-radius: 6px;
}
.markdown-alert > :first-child { margin-top: 0; }
.markdown-alert > :last-child { margin-bottom: 0; }
.markdown-alert-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 4px;
}
.markdown-alert-title svg { margin-right: 8px; }
.markdown-alert-note {
  border-color: #0969da;
  background-color: #ddf4ff;
}
.markdown-alert-note .markdown-alert-title { color: #0969da; }
.markdown-alert-tip {
  border-color: #1a7f37;
  background-color: #dafbe1;
}
.markdown-alert-tip .markdown-alert-title { color: #1a7f37; }
.markdown-alert-important {
  border-color: #8250df;
  background-color: #fbefff;
}
.markdown-alert-important .markdown-alert-title { color: #8250df; }
.markdown-alert-warning {
  border-color: #9a6700;
  background-color: #fff8c5;
}
.markdown-alert-warning .markdown-alert-title { color: #9a6700; }
.markdown-alert-caution {
  border-color: #d1242f;
  background-color: #ffebe9;
}
.markdown-alert-caution .markdown-alert-title { color: #d1242f; }
`;
fs.writeFileSync(path.join(distDir, 'alerts.css'), alertsCss);

// Generate docs CSS – link discoverability + reveal.js scrollable slides
const docsCss = `/* Improve link discoverability in rendered workshop docs */
.markdown-body a:not(.anchor) {
  text-decoration: underline;
  text-underline-offset: 0.08em;
}

/* ----------------------------------------------------------------
 * Reveal.js overrides
 * ---------------------------------------------------------------- */

/* Align text left; with center:false slides already start at top,
 * so no top override is needed. */
.reveal .slides section {
  text-align: left;
}

/* Constrain and scroll the content wrapper inside each slide so that
 * long content does not get clipped. A single scroll container per
 * slide avoids nested-scrollbar confusion. */
.reveal .slides .slide-content {
  font-size: 0.8em;
  padding: 0 1.5em;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Visually distinguish side-quest slides with a left border */
.reveal .slides .side-quest-slide {
  border-left: 4px solid #0969da;
  padding-left: 1em;
}
`;
fs.writeFileSync(path.join(distDir, 'docs.css'), docsCss);

// Generate docs runtime JavaScript
const docsJs = `Reveal.initialize({
  // URL hash reflects current slide by section id
  hash: true,
  // Show step/sub-step position as h.v (horizontal.vertical)
  slideNumber: 'h.v',
  // Start slides at the top rather than vertically centered
  center: false,
  // Push slide changes into the browser history
  history: true,
});

// Navigate to named sections when an in-slide hash link is clicked.
// Reveal.js handles #/id hashes natively; this catches bare #id hrefs.
document.addEventListener('click', function (e) {
  function findHashLink(start) {
    let el = start && start.nodeType === Node.ELEMENT_NODE
      ? start
      : (start && start.parentElement) || null;
    while (el) {
      if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        if (href && href.startsWith('#')) return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  const link = findHashLink(e.target);
  if (!link) return;
  const href = link.getAttribute('href');
  const raw = href ? href.slice(1) : '';
  if (!raw) return;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch (_) {
    // Ignore malformed hash fragments and keep default browser behavior.
    return;
  }
  const target = document.getElementById(id);
  if (target && target.closest('.slides')) {
    const indices = Reveal.getIndices(target);
    if (indices && typeof indices.h === 'number') {
      const v = typeof indices.v === 'number' ? indices.v : 0;
      e.preventDefault();
      Reveal.slide(indices.h, v);
    }
  }
});
`;
fs.writeFileSync(path.join(distDir, 'docs.js'), docsJs);

// Generate single-page reveal.js presentation
const totalGroups = sortedGroupKeys.length;
const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>gh-aw Workshop</title>
  <link rel="stylesheet" href="reveal.css">
  <link rel="stylesheet" href="theme/white.css">
  <link rel="stylesheet" href="primer.css">
  <link rel="stylesheet" href="alerts.css">
  <link rel="stylesheet" href="docs.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
${slidesHtml}
    </div>
  </div>
  <script src="reveal.js"></script>
  <script src="docs.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), page);
console.log(`Built dist/index.html — ${files.length} files across ${totalGroups} slide columns.`);
