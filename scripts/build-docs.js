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
      return `<h${depth} id="${id}"><a href="#${id}" class="anchor" aria-label="Link to this heading">#</a> ${text}</h${depth}>\n`;
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
const headingRegex = /^#{1,6}\s+(.+)$/m;

// Collect and sort workshop markdown files (excludes non-md files; keeps README)
const files = fs.readdirSync(workshopDir)
  .filter(f => f.endsWith('.md'))
  .sort();

const sectionIdsByFile = new Map(
  files.map(f => [f, path.basename(f, '.md')])
);

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
  const markdown = fs.readFileSync(path.join(workshopDir, f), 'utf8').trim();
  // Extract plain text of the first heading (strip leading # characters).
  // Workshop files use HTML comments (not YAML frontmatter), so the multiline
  // regex safely finds the first heading regardless of leading comment lines.
  const headingMatch = markdown.match(headingRegex);
  const slug = path.basename(f, '.md').replace(/^\d+-?/, '').replace(/-/g, ' ');
  const title = headingMatch
    ? headingMatch[1].trim()
    : slug.charAt(0).toUpperCase() + slug.slice(1);
  const sectionId = sectionIdsByFile.get(f);
  // Intentionally remove only the first heading because it is promoted to <summary>.
  const markdownWithoutTitle = headingMatch ? markdown.replace(headingRegex, '').trimStart() : markdown;
  const content = marked(markdownWithoutTitle);
  const detailsOpenAttr = index === 0 ? ' open' : '';
  return `<details id="${sectionId}"${detailsOpenAttr}>\n<summary><h4>${title}</h4></summary>\n${content}\n</details>`;
}).join('\n\n');

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

// Generate docs CSS overrides for rendered markdown
const docsCss = `/* Improve link discoverability in rendered workshop docs */
.markdown-body a:not(.anchor) {
  text-decoration: underline;
  text-underline-offset: 0.08em;
}
`;
fs.writeFileSync(path.join(distDir, 'docs.css'), docsCss);

// Write single-page HTML
const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>gh-aw Workshop</title>
  <link rel="stylesheet" href="primer.css">
  <link rel="stylesheet" href="alerts.css">
  <link rel="stylesheet" href="docs.css">
</head>
<body>
  <div class="container-xl px-3 py-5 markdown-body">
${htmlContent}</div>
  <script>
    // When a page link is clicked, open the target <details> element so its content is visible.
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target && target.tagName === 'DETAILS') {
        target.open = true;
        target.focus();
      }
    });

    // Also open the target <details> if the page is loaded with a hash in the URL.
    (function openDetailsForHash() {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target && target.tagName === 'DETAILS') {
        target.open = true;
        target.focus();
      }
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), page);
console.log(`Built dist/index.html from ${files.length} files.`);
