"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoDir = path.resolve(__dirname, "..");
const buildScript = path.join(repoDir, "scripts", "build-docs.js");
const distIndex = path.join(repoDir, "dist", "index.html");
const distCss = path.join(repoDir, "dist", "docs.css");
const distHighlightCss = path.join(repoDir, "dist", "hljs.css");

function buildDocs() {
  execFileSync(process.execPath, [buildScript], { cwd: repoDir, stdio: "pipe" });
  return {
    html: fs.readFileSync(distIndex, "utf8"),
    css: fs.readFileSync(distCss, "utf8"),
    highlightCss: fs.readFileSync(distHighlightCss, "utf8"),
  };
}

test("workshop SPA renders a single document h1", () => {
  const { html } = buildDocs();

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes('<h1 class="site-title"><a href="#00-welcome">GitHub Agentic Workflows Workshop</a></h1>'));
  assert.equal((html.match(/<h1 id="[^"]+" class="workshop-page-title">/g) ?? []).length, 0);
  assert.ok((html.match(/<h2 id="[^"]+" class="workshop-page-title">/g) ?? []).length > 0);
});

test("workshop navigation constrains long buttons on small screens", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".workshop-navigation-previous,\n  .workshop-navigation-next {\n    align-items: stretch;\n    width: 100%;\n  }"));
  assert.ok(css.includes(".workshop-nav-btn {\n    box-sizing: border-box;\n    max-width: 100%;\n    width: 100%;"));
});

test("shell code blocks are wrapped in a terminal-block UI", () => {
  const { html, css, highlightCss } = buildDocs();

  // HTML: at least one terminal-block with the macOS-style dot bar
  assert.ok(html.includes('<div class="terminal-block">'), "expected terminal-block wrapper in HTML");
  assert.ok(html.includes('<div class="terminal-bar" aria-hidden="true">'), "expected terminal-bar in HTML");
  assert.ok(html.includes('<span class="terminal-dot"></span>'), "expected terminal-dot spans");
  assert.ok(html.includes('<pre class="terminal-pre">'), "expected terminal-pre element");

  // CSS: terminal styles are emitted
  assert.ok(css.includes(".terminal-block"), "expected .terminal-block in CSS");
  assert.ok(css.includes(".terminal-bar"), "expected .terminal-bar in CSS");
  assert.ok(css.includes(".terminal-dot"), "expected .terminal-dot in CSS");
  assert.ok(css.includes(".terminal-pre"), "expected .terminal-pre in CSS");
  assert.ok(highlightCss.includes(".terminal-block .hljs-string"), "expected dark syntax colors in terminal blocks");
});

test("terminal output code blocks are wrapped in a terminal-block UI", () => {
  const { html } = buildDocs();

  assert.match(
    html,
    /<div class="terminal-block">\s*<div class="terminal-bar" aria-hidden="true"><span class="terminal-dot"><\/span><span class="terminal-dot"><\/span><span class="terminal-dot"><\/span><span class="terminal-label">output<\/span><\/div>\s*<pre class="terminal-pre"><code class="language-text">/
  );
});

test("prompt code blocks are wrapped in a distinct agent UI", () => {
  const { html, css } = buildDocs();

  assert.ok(html.includes('<div class="agent-prompt-block" role="region" aria-label="Agent prompt">'));
  assert.ok(html.includes('<div class="agent-prompt-bar">'));
  assert.ok(html.includes('<span class="agent-prompt-icon" aria-hidden="true">✦</span>'));
  assert.ok(html.includes('<span class="agent-prompt-label">Agent prompt</span>'));
  assert.ok(html.includes('<pre class="agent-prompt-pre"><code class="language-prompt">'));

  assert.ok(css.includes(".agent-prompt-block"));
  assert.ok(css.includes(".agent-prompt-bar"));
  assert.ok(css.includes(".agent-prompt-icon"));
  assert.ok(css.includes(".agent-prompt-pre"));
});

test("rendered workshop images use GitHub-like rounded corners", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".markdown-body img {\n  display: block;\n  width: min(100%, 720px);\n  height: auto;\n  margin-inline: auto;\n  border-radius: 6px;\n}"));
  assert.ok(css.includes(".image-inspector-image {\n  display: block;\n  max-width: min(88vw, 1120px);\n  max-height: calc(96vh - 96px);\n  width: auto;\n  height: auto;\n  margin: 0 auto;\n  border-radius: 6px;\n}"));
});

test("checkpoint task lists render ✓ markers instead of checkbox inputs", () => {
  const { html, css } = buildDocs();

  assert.ok(html.includes('<span class="task-list-item-marker" aria-hidden="true">✓</span>'), "expected checkmark marker spans");
  assert.ok(!html.includes('<input class="task-list-item-checkbox"'), "expected checkbox inputs to be removed");
  assert.ok(css.includes(".markdown-body li.task-list-item {\n  list-style: none;\n}"), "expected task-list bullet removal styles");
});
