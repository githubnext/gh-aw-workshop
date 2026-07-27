#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { setupBasePlugins } = require('./lib/marked-setup');
const { buildWorkshopContent, workshopDir, workshopImagesDir } = require('./lib/workshop');
const { generateAlertsCss, generateHljsCss, generateDocsCss } = require('./lib/docs-css');
const { generatePage } = require('./lib/page-template');

const distDir = path.join(__dirname, '..', 'dist');
const distImagesDir = path.join(distDir, 'images');
const monaSansDir = path.join(
  __dirname, '..', 'node_modules', '@fontsource-variable', 'mona-sans'
);
const distFontsDir = path.join(distDir, 'fonts');

// Set up marked plugins, then build all workshop content.
setupBasePlugins();
const { files, htmlContent, workshopMenu } = buildWorkshopContent();

// Set up output directory
fs.mkdirSync(distDir, { recursive: true });

// Copy workshop images for rendered markdown links
if (fs.existsSync(workshopImagesDir)) {
  fs.cpSync(workshopImagesDir, distImagesDir, { recursive: true });
}

// Copy favicon
const faviconSrc = path.join(__dirname, 'static', 'favicon.svg');
fs.copyFileSync(faviconSrc, path.join(distDir, 'favicon.svg'));

// Copy theme chooser script
const docsThemeSrc = path.join(__dirname, 'static', 'docs-theme.js');
fs.copyFileSync(docsThemeSrc, path.join(distDir, 'docs-theme.js'));

// Copy code copy button script
const docsCopyCodeSrc = path.join(__dirname, 'static', 'docs-copy-code.js');
fs.copyFileSync(docsCopyCodeSrc, path.join(distDir, 'docs-copy-code.js'));

// Copy checkbox interactivity script
const docsCheckboxesSrc = path.join(__dirname, 'static', 'docs-checkboxes.js');
fs.copyFileSync(docsCheckboxesSrc, path.join(distDir, 'docs-checkboxes.js'));

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

fs.writeFileSync(path.join(distDir, 'alerts.css'), generateAlertsCss());
fs.writeFileSync(path.join(distDir, 'hljs.css'), generateHljsCss());
fs.writeFileSync(path.join(distDir, 'docs.css'), generateDocsCss());

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

fs.writeFileSync(path.join(distDir, 'index.html'), generatePage(htmlContent, workshopMenu));
console.log(`Built dist/index.html from ${files.length} files.`);
