# Learning GitHub Agentic Workflows

A hands-on workshop that takes you from zero to a fully automated, AI-powered workflow — running on a schedule or on events in GitHub Actions.

## Curriculum

| # | File | Title | Status |
|---|------|-------|--------|
| 0 | [00-welcome.md](00-welcome.md) | Welcome — What We'll Build | ✅ |
| 1 | [01-prerequisites.md](01-prerequisites.md) | What You Need Before We Start | ✅ |
| 2 | Choose one: [02a-setup-codespace.md](02a-setup-codespace.md) **or** [02b-setup-local.md](02b-setup-local.md) | Setup Adventure — A: Codespace or B: Local Terminal | ✅ |
| 3 | [03-create-your-repo.md](03-create-your-repo.md) | Open and Verify Your Practice Repository | ✅ |
| 4 | [04-github-actions-intro.md](04-github-actions-intro.md) | What Are GitHub Actions? | ✅ |
| 5 | [05-agentic-workflows-intro.md](05-agentic-workflows-intro.md) | What Are Agentic Workflows? | ✅ |
| 6 | [06-install-gh-aw.md](06-install-gh-aw.md) | Install the gh-aw CLI Extension | ✅ |
| 7 | [07-your-first-workflow.md](07-your-first-workflow.md) | Write Your First Agentic Workflow | ✅ |
| 8 | [08-run-your-workflow.md](08-run-your-workflow.md) | Run and Watch Your Workflow | ✅ |
| 9 | [09-understand-output.md](09-understand-output.md) | Reading Workflow Output | ✅ |
| 10 | [10-choose-your-scenario.md](10-choose-your-scenario.md) | Choose Your Scenario | ✅ |
| 10a | [10a-design-daily-status.md](10a-design-daily-status.md) | ➡️ Adventure A: Design — Daily Repo Status Report | ✅ |
| 10b | [10b-design-daily-docs.md](10b-design-daily-docs.md) | ➡️ Adventure B: Design — Daily Documentation Updater | ✅ |
| 10c | [10c-design-pr-reviewer.md](10c-design-pr-reviewer.md) | ➡️ Adventure C: Design — PR Code Reviewer | ✅ |
| 11a | [11a-build-daily-status.md](11a-build-daily-status.md) | ➡️ Adventure A: Build — Daily Repo Status Workflow | ✅ |
| 11a✨ | [11a-build-daily-status-wizard.md](11a-build-daily-status-wizard.md) | ➡️ Adventure A (wizard): Build Daily Status with the Add Wizard | ✅ |
| 11b | [11b-build-daily-docs.md](11b-build-daily-docs.md) | ➡️ Adventure B: Build — Daily Documentation Updater | ✅ |
| 11c | [11c-build-pr-reviewer.md](11c-build-pr-reviewer.md) | ➡️ Adventure C: Build — PR Code Reviewer | ✅ |
| 11d | [11d-build-copilot-agents.md](11d-build-copilot-agents.md) | ➡️ Adventure D: Build Any Workflow with the GitHub Copilot Agents Tab | ✅ |
| 12 | [12-test-and-iterate.md](12-test-and-iterate.md) | Test and Improve Your Workflow | ✅ |
| 13 | [13-schedule-it.md](13-schedule-it.md) | Schedule It to Run Every Day | ✅ |
| 14 | [14-next-steps.md](14-next-steps.md) | What's Next? Keep Exploring | ✅ |
| 15 | [15-conditional-logic.md](15-conditional-logic.md) | Make Your Workflow Smarter with Conditional Logic | ✅ |
| 16 | [16-connect-data-source.md](16-connect-data-source.md) | Connect a Live Data Source to Your Workflow | ✅ |
| 17 | [17-add-mcp-tools.md](17-add-mcp-tools.md) | Give Your Agent More Tools with MCP | ✅ |
| 18 | [18-share-and-reuse.md](18-share-and-reuse.md) | Share and Reuse Your Agentic Workflows | ✅ |
| 19 | [19-observe-running-workflows.md](19-observe-running-workflows.md) | Keep Your Workflows Healthy | ✅ |

## Optional Side Quests

- [Side Quest: Terminal Basics](side-quest-01-01-terminal-basics.md) — optional primer that branches from [Step 1](01-prerequisites.md).
- [Side Quest: Environment Reference](side-quest-01-02-environment-reference.md) — glossary of workshop environments and tool terms with official docs links; branches from [Step 1](01-prerequisites.md).
- [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) — optional install troubleshooting reference that branches from [Step 6](06-install-gh-aw.md).
- [Side Quest: Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md) — quick reference for `gh aw compile`, `--validate`, `--watch`, and common compile errors; branches from [Step 7](07-your-first-workflow.md), [Step 11a](11a-build-daily-status.md), or [Step 13](13-schedule-it.md).
- [Side Quest: Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md) — expanded troubleshooting guide for the five most common log patterns; branches from [Step 9](09-understand-output.md).
- [Side Quest: Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md) — five-step framework for designing any agentic workflow brief; branches from [Step 10](10-choose-your-scenario.md).
- [Side Quest: Frontmatter Deep Dive](side-quest-11-01-frontmatter-deep-dive.md) — section-by-section walkthrough of every frontmatter key; branches from [Step 11a](11a-build-daily-status.md).
- [Side Quest: Fuzzy Schedule Expressions](side-quest-13-01-schedule-expressions.md) — quick reference for choosing between `daily`, `hourly`, `weekly`, and other fuzzy schedule expressions; branches from [Step 13](13-schedule-it.md).
- [Side Quest: GitHub Actions Expressions and Contexts](side-quest-15-01-expressions-and-contexts.md) — deep dive into `${{ }}` syntax, available context objects, output references, and `if:` conditions; branches from [Step 15](15-conditional-logic.md).
- [Side Quest: YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md) — reference guide for the five most common YAML mistakes; branches from [Step 11a](11a-build-daily-status.md).
- [Side Quest: Write Better AI Task Briefs](side-quest-11-03-better-prompts.md) — five prompt-engineering techniques for getting clearer, more consistent AI output; branches from [Step 11a](11a-build-daily-status.md).
- [Side Quest: Reading an Annotated Agentic Workflow](side-quest-11-04-annotated-workflow.md) — fully annotated `daily-status.md` walkthrough explaining every design decision; branches from [Step 11a](11a-build-daily-status.md).
- [Side Quest: Event-Driven Triggers in Agentic Workflows](side-quest-11-05-event-triggers.md) — primer on choosing between `pull_request`, `push`, `issues`, and `schedule`, and on matching `safe-outputs` to the trigger; branches from [Step 11c](11c-build-pr-reviewer.md).
- [Side Quest: Passing Data Between Steps with $GITHUB_OUTPUT](side-quest-16-01-github-output.md) — deep-dive into how `$GITHUB_OUTPUT` works; branches from [Step 16](16-connect-data-source.md).
- [Side Quest: How MCP Tool Servers Work](side-quest-17-01-mcp-concepts.md) — conceptual primer explaining what MCP is, how the agentic loop changes, and how to read tool calls in the Actions log; branches from [Step 17](17-add-mcp-tools.md).
- [Side Quest: Storing Credentials with GitHub Secrets](side-quest-16-02-secrets-and-permissions.md) — guide to creating repository secrets, referencing them in workflow steps, using the built-in `GITHUB_TOKEN`, and scoping permissions; branches from [Step 16](16-connect-data-source.md) or [Step 17](17-add-mcp-tools.md).
- [Side Quest: Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md) — visual, beginner-friendly explanation of sandbox boundaries, where the agent runs, and what safe outputs look like; branches from [Step 17](17-add-mcp-tools.md).

## Getting Started

Start at [Step 0: Welcome](00-welcome.md) — it shows you what you'll build and sets you up for success.
