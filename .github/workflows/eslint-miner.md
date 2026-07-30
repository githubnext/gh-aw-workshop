---
name: ESLint Miner
description: Daily workflow that mines JavaScript/TypeScript patterns in actions/setup/js and creates new TypeScript-based ESLint rules in eslint-factory
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  discussions: read
  pull-requests: read
  actions: read
  copilot-requests: write

sandbox:
  agent:
    sudo: false

tracker-id: eslint-miner
engine:
  id: copilot
  copilot-sdk: true
max-tool-denials: 3
lsp:
  typescript:
    command: typescript-language-server
    args: ["--stdio"]
    fileExtensions:
      ".ts": typescript
      ".js": javascript
      ".cjs": javascript
      ".mjs": javascript
network:
  allowed:
    - defaults
    - node
tools:
  cli-proxy: true
  github:
    mode: gh-proxy
    toolsets: [default, discussions, issues, repos]
  cache-memory:
    key: eslint-miner-state-${{ github.workflow }}
  bash:
    - "*"
  edit:
safe-outputs:
  create-pull-request:
    title-prefix: "[eslint-miner] "
    labels: [automation, eslint, cookie]
    reviewers: [copilot]
    draft: true
    expires: 7d
    if-no-changes: warn
    allowed-files:
      - "eslint-factory/**"
    protected-files: fallback-to-issue
  noop:
timeout-minutes: 120
max-turns: 1000
evals:
  - id: eslint_patterns_mined
    question: Did the agent analyze JavaScript or TypeScript patterns to identify a useful ESLint rule?
  - id: rule_pr_created_or_noop
    question: Did the agent create a pull request for a new ESLint rule, or use noop when no suitable rule was found?
---

# ESLint Miner

You are the daily **ESLint Miner** for `github/gh-aw`.

## Mission

Each day, produce at most one high-signal custom ESLint rule that improves code quality in:

- `actions/setup/js/**/*.cjs`
- `actions/setup/js/**/*.js`
- `actions/setup/js/**/*.ts`

Out of scope:

- Go code
- Documentation-only improvements
- JavaScript outside `actions/setup/js`

## Required flow

1. Mine issues/discussions from the last 14 days for recurring JavaScript/TypeScript failures in `actions/setup/js`.
2. Scan `actions/setup/js` for recurring patterns that should be enforced automatically.
3. Build an evidence list from repository code with at least one concrete linting violation candidate (include file path and snippet summary). If zero evidence items are found, call `noop`.
4. Read existing rules in `eslint-factory/src/rules`.
5. Choose one net-new rule idea with low false-positive risk and direct support from the evidence list.
6. Implement the rule in TypeScript under `eslint-factory/src/rules` and register it in `src/index.ts`.
7. Update `eslint-factory/eslint.config.cjs` only if needed to enable the new rule.
8. Validate with:
   - `cd eslint-factory && npm install`
   - `cd eslint-factory && npm run build`
   - `cd eslint-factory && npm run lint:setup-js`
9. Open one draft PR with evidence and rationale, explicitly citing at least one repository violation from step 3.

## Rule quality bar

- Must be specific and actionable.
- Must include a clear diagnostic message.
- Must target behavior observed in `actions/setup/js`.
- Must avoid stylistic-only opinions.
- Must not require changing files outside `actions/setup/js` and `eslint-factory`.
- Must be backed by at least one repository evidence item showing a concrete violation candidate.

## Final action

Call exactly one safe output (`create_pull_request` or `noop`) as the last action.
