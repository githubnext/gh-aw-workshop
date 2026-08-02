// @ts-check
'use strict';

const { after, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const checkerPath = path.join(__dirname, 'check-svg-visual-language.js');
const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-brand-check-'));

after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

/**
 * @param {string} name
 * @param {string} content
 */
function runChecker(name, content) {
  const fixturePath = path.join(fixtureDir, name);
  fs.writeFileSync(fixturePath, content);
  return spawnSync(process.execPath, [checkerPath], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, SVG_FILES: fixturePath },
  });
}

test('accepts single-quoted accessibility metadata', () => {
  const result = runChecker(
    'valid-light.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"
      role='img' aria-labelledby='title'>
      <title id='title'>Accessible diagram</title>
    </svg>`
  );

  assert.equal(result.status, 0, result.stderr);
});

test('rejects empty and dangling accessible names', () => {
  const empty = runChecker(
    'empty-label.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label=""></svg>'
  );
  assert.equal(empty.status, 1);
  assert.match(empty.stderr, /Missing non-empty accessible label/);

  const dangling = runChecker(
    'dangling-label.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="missing"></svg>'
  );
  assert.equal(dangling.status, 1);
  assert.match(dangling.stderr, /missing or empty element\(s\): missing/);
});

test('accepts declared diagram metadata and semantic state colors', () => {
  const result = runChecker(
    'metadata-light.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"
      role="img" aria-label="Status diagram"
      data-visual-kind="diagram" data-visual-id="status-diagram">
      <g data-node="status">
        <rect data-state="success" fill="#1a7f37" />
        <text>Done</text>
      </g>
    </svg>`
  );

  assert.equal(result.status, 0, result.stderr);
});

test('rejects incomplete metadata and gradients in technical diagrams', () => {
  const result = runChecker(
    'gradient-light.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"
      role="img" aria-label="Gradient diagram"
      data-visual-kind="diagram" data-visual-id="gradient-diagram">
      <defs><linearGradient id="fade"><stop offset="0" /></linearGradient></defs>
    </svg>`
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /has no data-node attributes/);
  assert.match(result.stderr, /uses a gradient/);
});

test('rejects malformed themed canvas metadata', () => {
  const result = runChecker(
    'bad-canvas-dark.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bad canvas"></svg>'
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing a root viewBox/);
});

test('rejects Unicode indicators and incorrect explicit state colors', () => {
  const result = runChecker(
    'bad-state-dark.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"
      role="img" aria-label="Bad state">
      <rect data-state="error" fill="#3fb950" />
      <text>✓</text>
      <text>⏰</text>
    </svg>`
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unicode icon character/);
  assert.match(result.stderr, /"⏰"/);
  assert.match(result.stderr, /data-state="error"/);
  assert.match(result.stderr, /Expected Primer dark-mode color: #f85149/);
});

test('rejects unknown explicit state values', () => {
  const result = runChecker(
    'unknown-state-light.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"
      role="img" aria-label="Unknown state">
      <rect data-state="opened" fill="#1a7f37" />
    </svg>`
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown data-state="opened"/);
});
