# GitHub Agentic Workflows Factory Tour

A hands-on workshop that takes you from zero to a fully automated, AI-powered workflow — running on a schedule or on events in GitHub Actions.

## Curriculum — Part 1: Build Your First Workflow

| # | Step |
|---|------|
| 0 | [Welcome — What We'll Build](00-welcome.md) |
| 1 | [What You Need Before We Start](01-prerequisites.md) |
| 2 | Setup Adventure — Choose one: [A: Codespace](02a-setup-codespace.md), [B: Local Terminal](02b-setup-local.md), **or** [C: Browser (no terminal)](02c-setup-browser.md) |
| 4 | [What Are GitHub Actions?](04-github-actions-intro.md) |
| 5 | [What Are Agentic Workflows?](05-agentic-workflows-intro.md) |
| 5b | [How Agentic Workflows Stay Safe](05b-agentic-workflows-security.md) |
| 5c | [Practice: Recognize Agentic Workflows](05c-agentic-workflows-practice.md) |
| 6 | [Install the gh-aw CLI Extension](06-install-gh-aw.md) |
| 6a | [Codespace Terminal Path — Install gh-aw](06a-install-terminal.md) |
| 6b | [Local Terminal Path — Install gh-aw](06b-install-local.md) |
| 6c | [GitHub UI Path — No Installation Needed](06c-install-ui.md) |
| 7 | [Write Your First Agentic Workflow](07-your-first-workflow.md) |
| 7a | [Terminal Path — Write Your First Agentic Workflow](07a-your-first-workflow-terminal.md) |
| 7a-part2 | [Terminal Path (Part 2) — Add Instructions and Finish Your First Workflow](07a-part2-your-first-workflow-instructions.md) |
| 7c | [GitHub Copilot Path — Write Your First Agentic Workflow](07c-your-first-workflow-copilot.md) |
| 7d | [Confirm Model Access](07d-confirm-model-access.md) |
| 8 | [Run and Watch Your Workflow](08-run-your-workflow.md) |
| 8b | [Interpret Your First Run](08b-interpret-your-run.md) |
| 9 | [Refine Your Workflow with Agentic Editing](09-agentic-editing.md) |
| 12 | [Test and Improve Your Workflow](12-test-and-iterate.md) |
| 14 | [What's Next? Keep Exploring](14-next-steps.md) |
| 14b | [Build Your First Event-Driven Workflow: PR Auto-Reviewer](14b-pr-reviewer-workflow.md) |

## Curriculum — Part 2: Go Deeper

| # | Step |
|---|------|
| 15 | [Make Your Workflow Smarter with Conditional Logic](15-conditional-logic.md) |
| 16 | [Connect a Live Data Source to Your Workflow](16-connect-data-source.md) |
| 17 | [Give Your Agent More Tools with MCP](17-add-mcp-tools.md) |
| 18 | [Share and Reuse Your Agentic Workflows](18-share-and-reuse.md) |
| 19 | [Build a Research-Driven Next Training Node](19-research-driven-training-node.md) |
| 20 | [Make Your Workflow Remember Across Runs](20-persistent-memory.md) |
| 21 | [Split Complex Workflows with Inline Sub-Agents](21-inline-sub-agents.md) |
| 22 | [Make Your Workflows Resilient to Failure](22-error-handling-and-resilience.md) |
| 23 | [Test Your Prompt Ideas with A/B Experiments](23-ab-experiments.md) |
| 24 | [Run Your Agentic Workflow on a Self-Hosted Runner](24-self-hosted-runners.md) |
| 25 | [Audit and Monitor Your Agentic Workflows](25-audit-and-observability.md) |
| 26 | [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md) |
| 27 | [Enforce Workflow Governance with Reusable Policies](27-workflow-governance.md) |

## Optional Side Quests

- [Agentic Workflows for GitHub Actions Power Users](side-quest-05-01-actions-power-user.md) — one-page cheat sheet for what changes vs what stays the same in agentic workflows; branches from [Step 5](05-agentic-workflows-intro.md).
- [Agentic Workflows Deep Dive](side-quest-05-02-aw-deep-dive.md) — classification exercises, example agent output, the two-file structure, and concept checks; branches from [Step 5](05-agentic-workflows-intro.md).
- [Terminal Basics](side-quest-01-01-terminal-basics.md) — optional primer that branches from [Step 1](01-prerequisites.md).
- [Environment Reference](side-quest-01-02-environment-reference.md) — glossary of workshop environments and tool terms with official docs links; branches from [Step 1](01-prerequisites.md).
- [Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md) — optional install troubleshooting reference that branches from [Step 6](06-install-gh-aw.md).
- [Using `gh aw compile` to Catch Errors Early](side-quest-07-01-compile-workflow.md) — quick reference for `gh aw compile`, `--validate`, `--watch`, and common compile errors; branches from [Step 7](07-your-first-workflow.md), [Step 11a](07-your-first-workflow.md), or [Step 12](12-test-and-iterate.md).
- [Fix Codespaces `actions:write` Errors When Running `gh aw run`](side-quest-08-01-codespaces-actions-write.md) — troubleshooting guide for Codespaces workflow-trigger permission errors with a UI-first path and advanced recovery path; branches from [Step 8](08-run-your-workflow.md).
- [Diagnosing Common Agent Output Patterns](side-quest-09-01-debug-output.md) — expanded troubleshooting guide for the five most common log patterns; branches from [Step 9](08b-interpret-your-run.md).
- [Writing a Clear Agent Brief](side-quest-10-01-agent-brief.md) — five-step framework for designing any agentic workflow brief; branches from [Step 10](09-agentic-editing.md).
- [Jailbreaking the Agent Brief](side-quest-10-02-jailbreak-brief.md) — explains how adversarial instructions embedded in repository content attempt to override the agent's task brief, and how the compiled brief, minimal `permissions:`, `safe-outputs`, and `network.allowed-domains` contain any partial success; branches from [Step 10](09-agentic-editing.md).
- [Frontmatter Deep Dive — Part A](side-quest-11-01-frontmatter-deep-dive.md) — walkthrough of the opening, trigger, and permissions sections of `gh-aw` frontmatter, with predict-and-try activities; branches from [Step 11a](07-your-first-workflow.md).
- [Frontmatter Deep Dive — Part B](side-quest-11-08-frontmatter-tools-outputs.md) — walkthrough of the tools, safe-outputs, closing fence, and agent body sections, with predict-and-try activities; continues from Part A.
- [Pattern: Auto-Label PRs by Content](side-quest-13-01-pr-labeler-pattern.md) — apply labels automatically based on which files changed in a pull request; branches from [Step 14b](14b-pr-reviewer-workflow.md).
- [Pattern: Generate a PR Summary Comment](side-quest-13-02-pr-summary-pattern.md) — post a structured, changelog-ready summary comment when a pull request opens; branches from [Step 14b](14b-pr-reviewer-workflow.md).
- [Pattern: PR Review Checklist](side-quest-13-03-pr-checklist-pattern.md) — evaluate pull requests against a quality checklist and post a pass/fail table; branches from [Step 14b](14b-pr-reviewer-workflow.md).
- [Observe and Reduce Token Costs](side-quest-13-04-token-optimization.md) — hands-on optimization activity for building an AIC baseline, auditing expensive runs, identifying cost drivers, and testing one token-reduction change at a time; branches from [Step 14b](14b-pr-reviewer-workflow.md).
- [Fuzzy Schedule Expressions](side-quest-13-01-schedule-expressions.md) — quick reference for choosing between `daily`, `hourly`, `weekly`, and other fuzzy schedule expressions; branches from [Step 12](12-test-and-iterate.md).
- [Evaluating and Iterating on Agent Output](side-quest-12-01-iterate-agent-output.md) — structured rubric for judging output quality, a five-row problem-to-fix reference table, and a one-change-at-a-time iteration loop; branches from [Step 12](12-test-and-iterate.md).
- [GitHub Actions Expressions and Contexts](side-quest-15-01-expressions-and-contexts.md) — deep dive into `${{ }}` syntax, available context objects, output references, and `if:` conditions; branches from [Step 15](15-conditional-logic.md).
- [YAML Frontmatter Pitfalls](side-quest-11-02-yaml-frontmatter.md) — reference guide for the five most common YAML mistakes; branches from [Step 11a](07-your-first-workflow.md).
- [Write Better AI Task Briefs](side-quest-11-03-better-prompts.md) — five prompt-engineering techniques for getting clearer, more consistent AI output; branches from [Step 11a](07-your-first-workflow.md).
- [Explore and Adapt an Annotated Workflow](side-quest-11-04-annotated-workflow.md) — annotated `daily-status.md` walkthrough with hands-on edits to confirm each design decision; branches from [Step 11a](07-your-first-workflow.md).
- [Event-Driven Triggers in Agentic Workflows](side-quest-11-05-event-triggers.md) — primer on choosing between `pull_request`, `push`, `issues`, and `schedule`, and on matching `safe-outputs` to the trigger; branches from [Step 11c](15-conditional-logic.md).
- [Passing Data Between Steps with $GITHUB_OUTPUT](side-quest-16-01-github-output.md) — deep-dive into how `$GITHUB_OUTPUT` works; branches from [Step 16](16-connect-data-source.md).
- [How MCP Tool Servers Work](side-quest-17-01-mcp-concepts.md) — conceptual primer explaining what MCP is, how the agentic loop changes, and how to read tool calls in the Actions log; branches from [Step 17](17-add-mcp-tools.md).
- [Storing Credentials with GitHub Secrets](side-quest-16-02-secrets-and-permissions.md) — guide to creating repository secrets, referencing them in workflow steps, using the built-in `GITHUB_TOKEN`, and scoping permissions; branches from [Step 16](16-connect-data-source.md) or [Step 17](17-add-mcp-tools.md).
- [Token and Secret Exfiltration in Agentic Workflows](side-quest-16-03-token-exfiltration.md) — explains how crafted repository content can attempt to leak tokens or API keys, and how log masking, `safe-outputs`, `network.allowed-domains`, and minimal `permissions:` stop it; branches from [Step 16](16-connect-data-source.md).
- [Deterministic vs Agentic Data Ops](side-quest-16-04-deterministic-vs-agentic-data-ops.md) — decision guide for splitting fixed data operations from agentic interpretation in hybrid workflows; branches from [Step 16](16-connect-data-source.md).
- [Long-Lived Credential Risks in Agentic Workflows](side-quest-16-05-long-lived-credentials.md) — explains why personal access tokens create a larger attack surface than the ephemeral `GITHUB_TOKEN` and how `permissions:` minimization and `network.allowed-domains` contain the blast radius; branches from [Step 16](16-connect-data-source.md).
- [Agentic Workflow Security Architecture (Explain Like You're 5)](side-quest-17-02-security-architecture.md) — visual, beginner-friendly explanation of sandbox boundaries, where the agent runs, and what safe outputs look like; branches from [Step 17](17-add-mcp-tools.md).
- [Prompt Injection Attacks in Agentic Workflows](side-quest-17-03-prompt-injection.md) — explains what prompt injection is, how gh-aw's task brief, `permissions:`, and `safe-outputs` limit the impact, and what you can do as a workflow author; branches from [Step 17](17-add-mcp-tools.md).
- [Permission Escalation in Agentic Workflows](side-quest-17-04-permission-escalation.md) — explains how over-scoped workflow authority lets a misdirected agent attempt changes the task never needed, and how minimal `permissions:`, `safe-outputs`, and `protected-files` enforce least privilege; branches from [Step 17](17-add-mcp-tools.md).
- [Supply Chain Attacks via MCP Tool Servers](side-quest-17-05-supply-chain-mcp.md) — explains how a compromised or malicious MCP server can feed poisoned tool results to your agent, and how `network.allowed-domains`, the explicit `tools:` block, minimal permissions, and `safe-outputs` reduce that risk; branches from [Step 17](17-add-mcp-tools.md).
- [Output Injection via Safe Outputs](side-quest-17-06-output-injection.md) — explains how crafted repository content can embed misleading markdown into agent output to fool human reviewers, and how `safe-outputs` surface declarations and label scoping prevent it; branches from [Step 17](17-add-mcp-tools.md).
- [Repository Poisoning via Agentic Write Access](side-quest-17-07-repo-poisoning.md) — explains how a misdirected agent granted `contents: write` could be tricked into committing backdoors or overwriting sensitive files, and how `contents: read`, `protected-files`, and `safe-outputs: create-pull-request` close that path entirely; branches from [Step 17](17-add-mcp-tools.md).
- [Configure GitHub Copilot for Agentic Workflows](side-quest-06-03-copilot-token.md) — explains organization centralized billing and personal `COPILOT_GITHUB_TOKEN` billing; branches from [Step 7d](07d-confirm-model-access.md).
- [Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md) — step-by-step guide to generating an Anthropic key, storing it as a repository secret, and switching your workflow to `engine: claude`; branches from [Step 11a](07-your-first-workflow.md).
- [Configure an OpenAI API Key](side-quest-11-07-openai-key.md) — step-by-step guide to generating an OpenAI key, storing it as a repository secret, and switching your workflow to `engine: codex`; branches from [Step 11a](07-your-first-workflow.md).
- [Choosing Between Cache Memory and Repo Memory](side-quest-20-01-memory-patterns.md) — decision guide, full field references, and example task briefs for both `cache-memory` and `repo-memory`; branches from [Step 20](20-persistent-memory.md).
- [Sub-Agent Syntax Reference](side-quest-21-01-sub-agent-syntax.md) — name rules, block boundary rules, supported frontmatter fields, and model alias table for inline sub-agents; branches from [Step 21](21-inline-sub-agents.md).
- [Agent Session Phases Explained](side-quest-11-09-agent-session-phases.md) — full phase reference table, activity feed tips, steering prompts, and advanced agent merge / `--watch` paths; branches from [Step 11d2](12-test-and-iterate.md).
- [Audit Reference — Artifacts, Firewall Logs, and Report Contents](side-quest-25-01-audit-reference.md) — detailed breakdown of `gh aw audit` report fields, agent artifact files, ⌖ AIC billing, `firewall.md`, and `network.allow`; branches from [Step 25](25-audit-and-observability.md).
- [Project Future AI Credit Costs with `gh aw forecast`](side-quest-26-01-forecast-costs.md) — full walkthrough of `gh aw forecast`: reading P10/P50/P90 output, using `--period week` and `--days 7`, forecasting all workflows, and deriving a `max-daily-ai-credits` value from the P90 figure; branches from [Step 26](26-manage-costs-and-budgets.md).

## Getting Started

Start at [Welcome](00-welcome.md) — it shows you what you'll build and sets you up for success.
