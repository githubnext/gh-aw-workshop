"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoDir = path.resolve(__dirname, "..");
const buildScript = path.join(repoDir, "scripts", "build-docs.js");
const distIndex = path.join(repoDir, "dist", "index.html");

test("workshop SPA renders a single document h1", () => {
  execFileSync(process.execPath, [buildScript], { cwd: repoDir, stdio: "pipe" });

  const html = fs.readFileSync(distIndex, "utf8");

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes('<h1 class="site-title"><a href="#00-welcome">GitHub Agentic Workflows Workshop</a></h1>'));
  assert.equal((html.match(/<h1 id="[^"]+" class="workshop-page-title">/g) ?? []).length, 0);
  assert.ok((html.match(/<h2 id="[^"]+" class="workshop-page-title">/g) ?? []).length > 0);
});
