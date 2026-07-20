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

// Concatenate all markdown with horizontal rule separators
const combinedMarkdown = files
  .map(f => fs.readFileSync(path.join(workshopDir, f), 'utf8').trim())
  .join('\n\n---\n\n');

const htmlContent = marked(combinedMarkdown);

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

// Write single-page HTML
const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>gh-aw Workshop</title>
  <link rel="stylesheet" href="primer.css">
</head>
<body>
  <div class="container-xl px-3 py-5 markdown-body">
${htmlContent}</div>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), page);
console.log(`Built dist/index.html from ${files.length} files.`);
