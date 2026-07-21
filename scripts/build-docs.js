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
      return `<h${depth} id="${id}">${text} <sub><a href="#${id}" class="anchor" aria-label="Link to this heading">#</a></sub></h${depth}>\n`;
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
const monaSansDir = path.join(
  __dirname, '..', 'node_modules', '@fontsource-variable', 'mona-sans'
);
const distFontsDir = path.join(distDir, 'fonts');
const headingRegex = /^#{1,6}\s+(.+)$/m;

// Collect and sort workshop markdown files (excludes non-md files; keeps README)
const files = fs.readdirSync(workshopDir)
  .filter(f => f.endsWith('.md'))
  .sort();

const sectionIdsByFile = new Map(
  files.map(f => [f, path.basename(f, '.md')])
);

const markdownByFile = new Map(
  files.map(f => [f, fs.readFileSync(path.join(workshopDir, f), 'utf8').trim()])
);
const pageTitleByFile = new Map(
  [...markdownByFile].map(([f, markdown]) => {
    const headingMatch = markdown.match(headingRegex);
    const slug = path.basename(f, '.md').replace(/^\d+-?/, '').replace(/-/g, ' ');
    const title = headingMatch
      ? headingMatch[1].trim()
      : slug.charAt(0).toUpperCase() + slug.slice(1);
    return [f, title];
  })
);
const adventureByFile = new Map(
  [...markdownByFile].map(([f, markdown]) => {
    const adventureMatch = markdown.match(/^<!-- page-adventure: ([^ ]+) -->/m);
    return [f, adventureMatch?.[1] ?? 'other'];
  })
);
const nextLinkRegex = /\*\*Next:\*\*\s*(?:Open\s+)?\[([^\]]+)\]\(([^)#?]+\.md)(?:#[^)]*)?\)\.?/g;
const previousFileByFile = new Map();

for (const [sourceFile, markdown] of markdownByFile) {
  for (const match of markdown.matchAll(nextLinkRegex)) {
    const targetFile = match[2];
    if (sectionIdsByFile.has(targetFile) && !previousFileByFile.has(targetFile)) {
      previousFileByFile.set(targetFile, sourceFile);
    }
  }
}

function renderWorkshopNavigation(markdown, currentFile) {
  const previousFile = previousFileByFile.get(currentFile);
  const previousSectionId = previousFile ? sectionIdsByFile.get(previousFile) : null;
  const previousLabel = previousFile ? marked.parseInline(pageTitleByFile.get(previousFile)) : '';

  return markdown.replace(nextLinkRegex, (_match, nextLabel, nextFile) => {
    const nextSectionId = sectionIdsByFile.get(nextFile);
    if (!nextSectionId) return _match;

    const previousLink = previousSectionId
      ? `<a href="#${previousSectionId}"><span aria-hidden="true">←</span> ${previousLabel}</a>`
      : '';

    return `<nav class="workshop-navigation" aria-label="Workshop navigation">
  <div class="workshop-navigation-previous">${previousLink}</div>
  <div class="workshop-navigation-next"><a href="#${nextSectionId}">${marked.parseInline(nextLabel)} <span aria-hidden="true">→</span></a></div>
</nav>`;
  });
}

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

// Render each file as a closed <details> section with the first heading as <summary>
const htmlContent = files.map((f, index) => {
  const markdown = markdownByFile.get(f);
  // Extract plain text of the first heading (strip leading # characters).
  // Workshop files use HTML comments (not YAML frontmatter), so the multiline
  // regex safely finds the first heading regardless of leading comment lines.
  const headingMatch = markdown.match(headingRegex);
  const title = pageTitleByFile.get(f);
  const sectionId = sectionIdsByFile.get(f);
  // Intentionally remove only the first heading because it is promoted to <summary>.
  const markdownWithoutTitle = headingMatch ? markdown.replace(headingRegex, '').trimStart() : markdown;
  const content = marked(renderWorkshopNavigation(markdownWithoutTitle, f));
  const detailsOpenAttr = index === 0 ? ' open' : '';
  return `<details id="${sectionId}"${detailsOpenAttr}>\n<summary><h4>${title}</h4></summary>\n${content}\n</details>`;
}).join('\n\n');

const menuGroups = [
  ['core', 'Main workshop'],
  ['setup', 'Setup paths'],
  ['advanced', 'Advanced topics'],
  ['side-quest', 'Side quests'],
  ['other', 'Other pages'],
];
const workshopMenu = menuGroups.map(([adventure, label]) => {
  const links = files
    .filter(f => adventureByFile.get(f) === adventure)
    .map(f => {
      const sectionId = sectionIdsByFile.get(f);
      const title = marked.parseInline(pageTitleByFile.get(f));
      return `<li><a href="#${sectionId}" data-workshop-page-link>${title}</a></li>`;
    })
    .join('\n');

  if (!links) return '';
  return `<section class="workshop-menu-group">
  <h3>${label}</h3>
  <ul>${links}</ul>
</section>`;
}).join('\n');

// Set up output directory
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

// Copy Mona Sans variable font CSS and the referenced normal/italic assets.
fs.mkdirSync(distFontsDir, { recursive: true });
const monaSansCss = [
  fs.readFileSync(path.join(monaSansDir, 'wght.css'), 'utf8'),
  fs.readFileSync(path.join(monaSansDir, 'wght-italic.css'), 'utf8'),
].join('\n').replaceAll('./files/', 'fonts/');
fs.writeFileSync(path.join(distDir, 'mona-sans.css'), monaSansCss);
for (const subset of ['vietnamese', 'latin-ext', 'latin']) {
  for (const style of ['normal', 'italic']) {
    const fontFile = `mona-sans-${subset}-wght-${style}.woff2`;
    fs.copyFileSync(
      path.join(monaSansDir, 'files', fontFile),
      path.join(distFontsDir, fontFile)
    );
  }
}

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
  border-color: var(--borderColor-accent-emphasis, #0969da);
  background-color: var(--bgColor-accent-muted, #ddf4ff);
}
.markdown-alert-note .markdown-alert-title { color: var(--fgColor-accent, #0969da); }
.markdown-alert-tip {
  border-color: var(--borderColor-success-emphasis, #1a7f37);
  background-color: var(--bgColor-success-muted, #dafbe1);
}
.markdown-alert-tip .markdown-alert-title { color: var(--fgColor-success, #1a7f37); }
.markdown-alert-important {
  border-color: var(--borderColor-done-emphasis, #8250df);
  background-color: var(--bgColor-done-muted, #fbefff);
}
.markdown-alert-important .markdown-alert-title { color: var(--fgColor-done, #8250df); }
.markdown-alert-warning {
  border-color: var(--borderColor-attention-emphasis, #9a6700);
  background-color: var(--bgColor-attention-muted, #fff8c5);
}
.markdown-alert-warning .markdown-alert-title { color: var(--fgColor-attention, #9a6700); }
.markdown-alert-caution {
  border-color: var(--borderColor-danger-emphasis, #d1242f);
  background-color: var(--bgColor-danger-muted, #ffebe9);
}
.markdown-alert-caution .markdown-alert-title { color: var(--fgColor-danger, #d1242f); }
`;
fs.writeFileSync(path.join(distDir, 'alerts.css'), alertsCss);

// Generate docs CSS – link discoverability + reveal.js scrollable slides
const docsCss = `/* Improve link discoverability in rendered workshop docs */
body,
.markdown-body {
  font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.site-header {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 56px;
  padding: 0 16px;
  color: var(--fgColor-default, #1f2328);
  background-color: var(--bgColor-default, #ffffff);
  border-bottom: 1px solid var(--borderColor-muted, #d0d7de);
}
.site-title {
  color: inherit;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}
.site-title:hover {
  color: var(--fgColor-accent, #0969da);
}
.menu-toggle,
.menu-close {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--fgColor-default, #1f2328);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
}
.menu-toggle:hover,
.menu-close:hover {
  background-color: var(--bgColor-muted, #f6f8fa);
}
.menu-toggle:focus-visible,
.menu-close:focus-visible {
  outline: 2px solid var(--fgColor-accent, #0969da);
  outline-offset: -2px;
}
.menu-icon,
.menu-icon::before,
.menu-icon::after {
  width: 18px;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
}
.menu-icon {
  position: relative;
}
.menu-icon::before,
.menu-icon::after {
  position: absolute;
  left: 0;
  content: '';
}
.menu-icon::before { top: -6px; }
.menu-icon::after { top: 6px; }

.workshop-menu {
  width: min(384px, calc(100vw - 32px));
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  color: var(--fgColor-default, #1f2328);
  background-color: var(--bgColor-default, #ffffff);
  border: 0;
  border-right: 1px solid var(--borderColor-muted, #d0d7de);
}
.workshop-menu::backdrop {
  background: rgba(0, 0, 0, 0.48);
}
.workshop-menu-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.workshop-menu-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 12px 0 20px;
  border-bottom: 1px solid var(--borderColor-muted, #d0d7de);
}
.workshop-menu-header h2 {
  margin: 0;
  font-size: 16px;
}
.menu-close {
  font-size: 26px;
  font-weight: 300;
  line-height: 1;
}
.workshop-menu-nav {
  flex: 1 1 auto;
  padding: 12px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.workshop-menu-group + .workshop-menu-group {
  margin-top: 20px;
}
.workshop-menu-group h3 {
  margin: 0 8px 6px;
  color: var(--fgColor-muted, #59636e);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}
.workshop-menu-group ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.workshop-menu-group a {
  display: block;
  padding: 8px;
  color: var(--fgColor-default, #1f2328);
  line-height: 1.35;
  text-decoration: none;
  border-radius: 6px;
}
.workshop-menu-group a:hover {
  color: var(--fgColor-accent, #0969da);
  background-color: var(--bgColor-muted, #f6f8fa);
}
.workshop-menu-group a[aria-current="page"] {
  color: var(--fgColor-accent, #0969da);
  font-weight: 600;
  background-color: var(--bgColor-accent-muted, #ddf4ff);
}

.markdown-body > details:not([open]) {
  display: none;
}
.markdown-body > details {
  scroll-margin-top: 72px;
}
.markdown-body > details > summary {
  cursor: default;
  list-style: none;
}
.markdown-body > details > summary > h4 {
  font-size: 32px;
  line-height: 1.25;
}
.markdown-body > details > summary::-webkit-details-marker {
  display: none;
}

@media (max-width: 543px) {
  .markdown-body > details > summary > h4 {
    font-size: 28px;
  }
}

.markdown-body a:not(.anchor) {
  text-decoration: underline;
  text-underline-offset: 0.08em;
}

.workshop-navigation {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  width: calc(100vw - 32px);
  margin-top: 32px;
  margin-left: calc(50% - 50vw + 16px);
  padding-top: 16px;
  border-top: 1px solid var(--borderColor-muted, #d0d7de);
}
.workshop-navigation-previous {
  justify-self: start;
}
.workshop-navigation-next {
  justify-self: end;
  text-align: right;
}
.workshop-navigation a {
  display: inline-flex;
  gap: 0.4em;
  align-items: center;
  font-weight: 600;
}

@media (max-width: 543px) {
  .workshop-navigation {
    gap: 8px;
  }
  .workshop-navigation a {
    align-items: flex-start;
    overflow-wrap: anywhere;
  }
}
`;
fs.writeFileSync(path.join(distDir, 'docs.css'), docsCss);

const parallaxBackgroundSvgEncoded = encodeURIComponent([
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="1">',
  '<stop offset="0%" stop-color="#0d1117" />',
  '<stop offset="45%" stop-color="#271449" />',
  '<stop offset="100%" stop-color="#8250df" />',
  '</linearGradient>',
  '<radialGradient id="topRadialGlow" cx="20%" cy="25%" r="40%">',
  '<stop offset="0%" stop-color="#a371f7" stop-opacity=".32" />',
  '<stop offset="100%" stop-color="#a371f7" stop-opacity="0" />',
  '</radialGradient>',
  '<radialGradient id="bottomRadialGlow" cx="82%" cy="78%" r="45%">',
  '<stop offset="0%" stop-color="#6f42c1" stop-opacity=".30" />',
  '<stop offset="100%" stop-color="#6f42c1" stop-opacity="0" />',
  '</radialGradient>',
  '</defs>',
  '<rect width="1920" height="1080" fill="url(#primaryGradient)" />',
  '<rect width="1920" height="1080" fill="url(#topRadialGlow)" />',
  '<rect width="1920" height="1080" fill="url(#bottomRadialGlow)" />',
  '</svg>',
].join(''));

// Generate docs runtime JavaScript
const docsJs = `const legacyHashMatch = window.location.hash.match(/^#\\/([^/]+)$/);
let legacySectionId = null;
if (legacyHashMatch) {
  try {
    legacySectionId = decodeURIComponent(legacyHashMatch[1]);
  } catch (_) {
    // Ignore malformed encoded hashes and leave default Reveal routing behavior.
    legacySectionId = null;
  }
}
const hasLegacySectionTarget = legacySectionId && !!document.getElementById(legacySectionId);

if (hasLegacySectionTarget) {
  window.history.replaceState(null, '', '#' + legacySectionId);
}

function enableImageLightbox() {
  const images = document.querySelectorAll('.slides section img');
  images.forEach((img) => {
    if (img.hasAttribute('data-preview-image') || img.hasAttribute('data-preview-video')) {
      return;
    }
    if (img.closest('a[href]')) {
      return;
    }
    const src = img.currentSrc || img.getAttribute('src');
    if (src) {
      img.setAttribute('data-preview-image', src);
    }
  });
}

const parallaxBackgroundImage = ${JSON.stringify(`data:image/svg+xml,${parallaxBackgroundSvgEncoded}`)};

Reveal.initialize({
  // URL hash reflects current slide by section id
  hash: true,
  // Show step/sub-step position as h.v (horizontal.vertical)
  slideNumber: 'h.v',
  // Start slides at the top rather than vertically centered
  center: false,
  // Push slide changes into the browser history
  history: true,
  // GitHub agentic-purple themed parallax background
  parallaxBackgroundImage: parallaxBackgroundImage,
  // Use a larger virtual canvas than the viewport so motion stays subtle.
  parallaxBackgroundSize: '3200px 1800px',
  // Horizontal movement is intentionally stronger than vertical to reduce jitter.
  parallaxBackgroundHorizontal: 180,
  parallaxBackgroundVertical: 70,
});

Reveal.on('ready', enableImageLightbox);

if (hasLegacySectionTarget) {
  const target = document.getElementById(legacySectionId);
  const indices = target ? Reveal.getIndices(target) : null;
  if (indices && typeof indices.h === 'number') {
    const v = typeof indices.v === 'number' ? indices.v : 0;
    Reveal.slide(indices.h, v);
  }
}

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

// Generate the single-page workshop reader.
const page = `<!DOCTYPE html>
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)">
  <title>GitHub Agentic Workflows Workshop</title>
  <link rel="stylesheet" href="mona-sans.css">
  <link rel="stylesheet" href="primer.css">
  <link rel="stylesheet" href="alerts.css">
  <link rel="stylesheet" href="docs.css">
</head>
<body>
  <header class="site-header">
    <button class="menu-toggle" type="button" aria-label="Open workshop pages" aria-controls="workshop-menu" title="Open workshop pages">
      <span class="menu-icon" aria-hidden="true"></span>
    </button>
    <a class="site-title" href="#00-welcome">GitHub Agentic Workflows Workshop</a>
  </header>
  <dialog class="workshop-menu" id="workshop-menu" aria-labelledby="workshop-menu-title">
    <div class="workshop-menu-panel">
      <header class="workshop-menu-header">
        <h2 id="workshop-menu-title">Workshop pages</h2>
        <button class="menu-close" type="button" aria-label="Close workshop pages" title="Close workshop pages">&times;</button>
      </header>
      <nav class="workshop-menu-nav" aria-label="All workshop pages">
${workshopMenu}
      </nav>
    </div>
  </dialog>
  <main class="container-xl px-3 py-5 markdown-body">
${htmlContent}</main>
  <script>
    const workshopPages = Array.from(document.querySelectorAll('.markdown-body > details'));
    const menuDialog = document.getElementById('workshop-menu');
    const menuLinks = Array.from(document.querySelectorAll('[data-workshop-page-link]'));

    function showWorkshopPage(target, focusPage) {
      const page = target?.matches('.markdown-body > details')
        ? target
        : target?.closest('.markdown-body > details');
      const activePage = page ?? workshopPages[0];
      if (!activePage) return;

      workshopPages.forEach(candidate => {
        candidate.open = candidate === activePage;
      });
      menuLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + activePage.id;
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      if (focusPage) {
        activePage.setAttribute('tabindex', '-1');
        activePage.focus();
      }
    }

    function findHashTarget(id) {
      const activePage = workshopPages.find(candidate => candidate.open);
      if (activePage?.id === id) return activePage;

      const localTarget = activePage
        ? Array.from(activePage.querySelectorAll('[id]')).find(candidate => candidate.id === id)
        : null;
      return localTarget ?? document.getElementById(id);
    }

    function showWorkshopPageForHash(focusPage) {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? findHashTarget(id) : null;
      showWorkshopPage(target, focusPage && target?.matches('.markdown-body > details'));
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('.menu-toggle')) {
        menuDialog.showModal();
        requestAnimationFrame(function () {
          menuDialog.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
        });
        return;
      }
      if (e.target.closest('.menu-close')) {
        menuDialog.close();
        return;
      }

      if (e.target.closest('.markdown-body > details > summary')) {
        e.preventDefault();
        return;
      }

      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!id) return;
      const target = findHashTarget(id);
      if (target) {
        if (menuDialog.open) menuDialog.close();
        const isPage = target.matches('.markdown-body > details');
        history.pushState(null, '', link.getAttribute('href'));
        showWorkshopPage(target, isPage);
        if (!isPage) target.scrollIntoView({ block: 'start' });
      }
    });

    menuDialog.addEventListener('click', function (e) {
      if (e.target === menuDialog) menuDialog.close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuDialog.open) {
        e.preventDefault();
        menuDialog.close();
      }
    });

    window.addEventListener('hashchange', function () {
      showWorkshopPageForHash(true);
    });

    showWorkshopPageForHash(false);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), page);
console.log(`Built dist/index.html from ${files.length} files.`);
