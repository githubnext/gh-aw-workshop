'use strict';

const fs = require('fs');
const path = require('path');
const { prefixCssSelectors } = require('./utils');

// Generate alert callout CSS for marked-alert GFM rendering
function generateAlertsCss() {
  return fs.readFileSync(path.join(__dirname, 'alerts.css'), 'utf8');
}

// Generate highlight.js syntax highlighting CSS (GitHub light + dark themes).
// The dark theme rules are scoped to the data-color-mode="dark" attribute and
// to the prefers-color-scheme: dark media query for data-color-mode="auto".
function generateHljsCss() {
  const hljsStylesDir = path.join(__dirname, '..', '..', 'node_modules', 'highlight.js', 'styles');
  const hljsLightCss = fs.readFileSync(path.join(hljsStylesDir, 'github.min.css'), 'utf8');
  const hljsDarkCss = fs.readFileSync(path.join(hljsStylesDir, 'github-dark.min.css'), 'utf8');
  return [
    '/* highlight.js \u2013 GitHub light theme (default) */',
    hljsLightCss,
    '',
    '/* highlight.js \u2013 GitHub Dark theme (terminal blocks) */',
    prefixCssSelectors(hljsDarkCss, '.terminal-block'),
    '',
    '/* highlight.js \u2013 GitHub Dark theme (explicit dark mode) */',
    prefixCssSelectors(hljsDarkCss, 'html[data-color-mode="dark"]'),
    '',
    '/* highlight.js \u2013 GitHub Dark theme (system dark preference) */',
    '@media (prefers-color-scheme: dark) {',
    prefixCssSelectors(hljsDarkCss, 'html[data-color-mode="auto"]'),
    '}',
  ].join('\n');
}

// Generate docs CSS \u2013 link discoverability and workshop SPA styles
function generateDocsCss() {
  return fs.readFileSync(path.join(__dirname, 'docs.css'), 'utf8');
}

module.exports = { generateAlertsCss, generateHljsCss, generateDocsCss };
