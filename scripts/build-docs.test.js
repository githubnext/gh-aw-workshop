"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoDir = path.resolve(__dirname, "..");
const buildScript = path.join(repoDir, "scripts", "build-docs.js");
const distIndex = path.join(repoDir, "dist", "index.html");
const distAlertsCss = path.join(repoDir, "dist", "alerts.css");
const distCss = path.join(repoDir, "dist", "docs.css");
const distCheckboxesJs = path.join(repoDir, "dist", "docs-checkboxes.js");
const distHighlightCss = path.join(repoDir, "dist", "hljs.css");
const workshopDir = path.join(repoDir, "workshop");

function buildDocs() {
  execFileSync(process.execPath, [buildScript], { cwd: repoDir, stdio: "pipe" });
  return {
    html: fs.readFileSync(distIndex, "utf8"),
    alertsCss: fs.readFileSync(distAlertsCss, "utf8"),
    css: fs.readFileSync(distCss, "utf8"),
    checkboxesJs: fs.readFileSync(distCheckboxesJs, "utf8"),
    highlightCss: fs.readFileSync(distHighlightCss, "utf8"),
  };
}

function renderSnippet(markdown) {
  return execFileSync(
    process.execPath,
    [
      "-e",
      `
        const { marked } = require("marked");
        const { setupBasePlugins } = require("./scripts/lib/marked-setup");
        setupBasePlugins();
        process.stdout.write(marked.parse(${JSON.stringify(markdown)}));
      `,
    ],
    { cwd: repoDir, encoding: "utf8" }
  );
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

test("workshop page navigation does not animate page changes", () => {
  const { html, css } = buildDocs();

  assert.ok(!html.includes("startViewTransition"));
  assert.ok(!css.includes("view-transition"));
});

test("current page checkpoint progress renders in the sticky header", () => {
  const { html, css, checkboxesJs } = buildDocs();

  assert.ok(html.includes('<div class="site-header-progress" data-current-page-progress hidden>'));
  assert.ok(html.includes("document.dispatchEvent(new CustomEvent('workshoppagechange'"));
  assert.ok(checkboxesJs.includes("renderCurrentPageProgress(event.detail && event.detail.pageId);"));
  assert.ok(checkboxesJs.includes("window.matchMedia('(max-width: 543px)').matches"));
  assert.ok(css.includes(".site-header-progress-bar {\n  flex: 0 0 auto;\n  width: min(132px, 22vw);"));
  assert.ok(css.includes(".site-header-progress-bar {\n    width: min(84px, 24vw);"));
});

test("mobile docs keep accessible gutters and menu target sizes", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".menu-toggle,\n.menu-close {\n  display: inline-grid;\n  flex: 0 0 auto;\n  place-items: center;\n  width: 44px;\n  height: 44px;"));
  assert.ok(css.includes(".markdown-body {\n    padding-inline: 20px !important;\n  }"));
});

test("shared header and code copy controls meet 44px target sizes", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".site-title a {\n  display: block;\n  min-height: 44px;\n  box-sizing: border-box;\n  padding-block: 10px;\n  line-height: 24px;"));
  assert.ok(css.includes(".code-copy-btn {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 44px;\n  min-height: 44px;"));
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

test("alert titles use a consistent font size", () => {
  const { alertsCss } = buildDocs();

  assert.ok(alertsCss.includes(".markdown-alert-title {\n  display: flex;\n  align-items: center;\n  font-size: 1em;"));
  assert.ok(alertsCss.includes("  line-height: 1.5;\n  margin-bottom: 4px;\n}"));
});

test("markdown, md, yaml, and yml code blocks use compact icon-only editor chrome", () => {
  const { html, css } = buildDocs();

  assert.ok(html.includes('<div class="markdown-editor-block" role="region" aria-label="Markdown">'), "expected markdown-editor-block wrapper in HTML");
  assert.ok(html.includes('<div class="markdown-editor-bar">'), "expected markdown-editor-bar in HTML");
  assert.ok(html.includes('<span class="markdown-editor-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z"></path></svg></span>'), "expected markdown-editor-icon in HTML");
  assert.ok(!html.includes('class="markdown-editor-label"'), "expected markdown language label to be hidden");
  assert.ok(html.includes('<pre class="markdown-editor-pre">'), "expected markdown-editor-pre element");
  assert.ok(html.includes('<div class="yaml-editor-block" role="region" aria-label="YAML">'), "expected yaml-editor-block wrapper in HTML");
  assert.ok(html.includes('<div class="yaml-editor-bar">'), "expected yaml-editor-bar in HTML");
  assert.ok(html.includes('<span class="yaml-editor-icon" aria-hidden="true">≡</span>'), "expected yaml-editor-icon in HTML");
  assert.ok(!html.includes('class="yaml-editor-label"'), "expected YAML language label to be hidden");
  assert.ok(html.includes('<pre class="yaml-editor-pre">'), "expected yaml-editor-pre element");

  assert.ok(css.includes(".markdown-editor-block"), "expected .markdown-editor-block in CSS");
  assert.ok(css.includes(".markdown-editor-bar"), "expected .markdown-editor-bar in CSS");
  assert.ok(css.includes(".markdown-editor-pre"), "expected .markdown-editor-pre in CSS");
  assert.ok(css.includes("padding: 12px 12px 12px 16px;"), "expected compact Markdown code padding");
  assert.ok(css.includes(".yaml-editor-block"), "expected .yaml-editor-block in CSS");
  assert.ok(css.includes(".yaml-editor-bar"), "expected .yaml-editor-bar in CSS");
  assert.ok(css.includes(".yaml-editor-pre"), "expected .yaml-editor-pre in CSS");
  assert.ok(css.includes("padding: 12px;"), "expected compact YAML code padding");
});

test("code blocks wrap long lines without relying on mobile-only styles", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".markdown-body pre {\n  position: relative;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}"));
  assert.ok(css.includes(".markdown-body pre > code {\n  font-size: 1em;\n  white-space: inherit;\n}"));
});

test("code block headers can render filenames from fence metadata", () => {
  const html = renderSnippet("```yaml .github/workflows/hello.yml\nname: Hello\n```\n\n```markdown title=\"README.md\"\n# Hello\n```");

  assert.ok(html.includes('<span class="code-block-filename">.github/workflows/hello.yml</span>'));
  assert.ok(html.includes('<span class="code-block-filename">README.md</span>'));
  assert.ok(html.includes('<pre class="markdown-editor-pre"><code class="hljs language-yaml">'));
});

test("rendered workshop images use GitHub-like rounded corners", () => {
  const { css } = buildDocs();

  assert.ok(css.includes(".markdown-body img {\n  display: block;\n  width: min(100%, 720px);\n  height: auto;\n  margin-inline: auto;\n  border-radius: 6px;\n}"));
  assert.ok(css.includes(".image-inspector-image {\n  display: block;\n  max-width: min(88vw, 1120px);\n  max-height: calc(96vh - 96px);\n  width: auto;\n  height: auto;\n  margin: 0 auto;\n  border-radius: 6px;\n}"));
});

test("checkpoint task lists render distinct markers for pending and complete states", () => {
  const { html, css } = buildDocs();

  assert.ok(html.includes('<g-emoji class="g-emoji" alias="white_check_mark"'), "expected checkpoint emoji shortcode to render as g-emoji");
  // Pending items: Primer octicon circle (16px SVG)
  assert.ok(html.includes('class="task-list-item-marker is-pending" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"'), "expected Primer octicon SVG marker for pending items");
  assert.ok(!html.includes('<input class="task-list-item-checkbox"'), "expected checkbox inputs to be removed");
  assert.ok(css.includes(".markdown-body li.task-list-item {\n  list-style: none;\n}"), "expected task-list bullet removal styles");
  assert.ok(css.includes(".markdown-body li.task-list-item > .task-list-item-marker.is-pending {"), "expected pending marker style rule");
  assert.ok(!css.includes("opacity: 0.45"), "expected pending marker to use color instead of opacity");
});

test("workshop Markdown uses GitHub emoji shortcodes", () => {
  const markdownFiles = [
    path.join(repoDir, "README.md"),
    path.join(repoDir, "AGENTS.md"),
    path.join(repoDir, ".github", "workflows", "guidelines.md"),
    ...fs.readdirSync(workshopDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.join(workshopDir, file)),
  ];
  const nativeEmoji = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;

  for (const file of markdownFiles) {
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), nativeEmoji, `expected GitHub emoji shortcodes in ${path.relative(repoDir, file)}`);
  }
});

test("hash navigation opens details ancestors after the destination page switches", () => {
  const { html } = buildDocs();

  assert.match(
    html,
    /function openDetailsAncestors\(target\) \{[\s\S]*detail\.open = true;[\s\S]*\}/
  );
  assert.match(
    html,
    /showWorkshopPage\(target, scrollPage && isPageTarget\);\s*if \(!isPageTarget\) \{\s*openDetailsAncestors\(target\);/
  );
  assert.match(
    html,
    /showWorkshopPage\(target, isPage\);\s*if \(!isPage\) \{\s*openDetailsAncestors\(target\);/
  );
});
