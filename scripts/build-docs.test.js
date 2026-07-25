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

function buildDocs() {
  execFileSync(process.execPath, [buildScript], { cwd: repoDir, stdio: "pipe" });
  return {
    html: fs.readFileSync(distIndex, "utf8"),
    css: fs.readFileSync(distCss, "utf8"),
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
