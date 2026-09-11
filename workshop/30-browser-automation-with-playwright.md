<!-- page-journey: all -->
<!-- page-adventure: advanced -->
<!--
<research-metadata>
  <focus>Built-in `playwright` tool for browser automation and visual verification — the `tools: playwright:` frontmatter key, `browsers:`/`version:` pinning, the `playwright` network ecosystem, and driving the CLI with `playwright-cli` (open, snapshot, click, fill, screenshot)</focus>
  <sources>
    <source>https://github.github.com/gh-aw/llms.txt</source>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/.github/aw/playwright.md</source>
    <source>https://github.github.com/gh-aw/reference/tools/#playwright-tool-playwright</source>
    <source>https://github.github.com/gh-aw/reference/network/</source>
  </sources>
  <rationale>Steps 1-29 teach frontmatter, safe-outputs, MCP tools, memory, sub-agents, evals, orchestration, and skills, but none give the agent eyes on a rendered page. The `playwright` tool is a first-class, compiler-provisioned capability (no `npx playwright install`, browsers pinned by the compiler) that closes a concrete learner gap: verifying that a live web surface — a docs site, a deployed preview, or the workshop's own rendered output — actually looks and behaves as intended, not just that text was generated. This node teaches the minimal `tools: playwright:` block, the `playwright` network ecosystem, and the core `playwright-cli` command loop (open, snapshot, click/fill, screenshot) so learners can add visual verification to any existing workflow.</rationale>
</research-metadata>
-->

# Verify Your Agent's Work with Browser Automation

> _Text output can lie about what a page actually looks like — a real browser can't._

## :dart: What You'll Do

You'll add the built-in [`playwright` tool](https://github.github.com/gh-aw/reference/tools/#playwright-tool-playwright) to a workflow's `tools:` block, then direct the agent to open a real browser, take a snapshot, and capture a screenshot as evidence. By the end, you'll know how to give an agent "eyes" on a rendered page instead of trusting text-only output.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You have at least one working agentic workflow you can edit and recompile.
- You can compile workflows with `gh aw compile` from [Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md).

## Steps

### Understand what the tool adds

The built-in `playwright` tool wraps `@playwright/cli` for browser automation, accessibility checks, and visual regression. It is CLI-only — it does not expose Playwright MCP tools — and the compiler installs the pinned CLI package and provisions Chromium automatically before your agent starts. You never need to add a step that runs `npx playwright install`; the compiler handles browser provisioning as part of [compilation](https://github.github.com/gh-aw/reference/compilation-process/).

### Add the tool to your workflow

Open an existing workflow file, such as `.github/workflows/daily-status.md`, and add a `playwright:` entry to the `tools:` block:

```yaml
tools:
  playwright:
```

If you need a specific rendering engine, list it explicitly in `browsers`:

```yaml
tools:
  playwright:
    browsers: [chromium]
```

### Allow network access for the browser

Playwright can already reach `localhost` and `127.0.0.1` without extra configuration, but any external site the browser visits needs to be allowed. Add the `playwright` ecosystem to your workflow's [`network:`](https://github.github.com/gh-aw/reference/network/) block alongside the domain you want to visit:

```yaml
network:
  allowed:
    - defaults
    - playwright
    - "github.github.com"
```

The `playwright` ecosystem permits the browser binary download; the explicit domain permits the page fetch and its subdomains.

### Tell the agent what to check

Update the task brief to describe a concrete visual check, using the `playwright-cli` command loop: open a page, take a snapshot to get element references, then capture a screenshot as evidence.

```markdown .github/workflows/daily-status.md
Use the playwright-cli tool to verify the gh-aw documentation homepage renders correctly:
1. Run `playwright-cli open --browser=chromium "https://github.github.com/gh-aw/"`
2. Run `playwright-cli snapshot` to confirm the page has a visible heading.
3. Run `playwright-cli screenshot --filename=/tmp/gh-aw-home.png` to capture evidence.
4. Run `playwright-cli close` when done.
Report whether the page loaded successfully and describe what you saw.
```

Prefer element refs from the latest `snapshot` output over brittle CSS selectors when the agent needs to click or fill fields on the page.

### Compile and run

```bash
gh aw compile
```

Confirm the compiled `.lock.yml` includes a step that provisions the Playwright CLI and Chromium, then commit both files and trigger a run.

```bash
git add .
git commit -m "feat: add playwright browser verification"
git push
```

### Read the evidence

Open the run log in **Actions**. You should see the agent issuing `playwright-cli` commands and reasoning about the snapshot output before reporting its findings — a stronger signal of correctness than text generated without ever looking at the page.

## :white_check_mark: Checkpoint

- [ ] Your workflow's `tools:` block includes a `playwright:` entry
- [ ] Your `network:` block allows the `playwright` ecosystem plus any external domain the browser visits
- [ ] Your task brief directs the agent through open, snapshot, and screenshot steps
- [ ] `gh aw compile` succeeds and the `.lock.yml` provisions the Playwright CLI
- [ ] A workflow run's log shows `playwright-cli` tool calls and a resulting screenshot or snapshot description

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
