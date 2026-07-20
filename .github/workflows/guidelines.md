# Shared Workshop Authoring Guidelines

Use these rules across workshop authoring/editing workflows to keep the tutorial beginner-friendly and avoid over-indexing on the GitHub CLI.

## Tooling progression: delay and minimize `gh`

- Prefer GitHub UI and Codespaces paths early in the workshop.
- Do not require `gh` installation/authentication in early shared steps unless a command in that same step truly requires it.
- Delay `gh` setup and `gh-aw` install requirements until the latest practical point (typically the dedicated install step or later).
- Minimize `gh` command volume throughout; use it only when it provides clear value or when no equivalent UI path exists.

## UI-first instruction design

- For repo/file/edit/commit actions, prefer a UI-first path and provide terminal commands as optional alternatives.
- Keep any required terminal path concise and explicit.
- If terminal-only actions are required (for example, local `gh aw compile`), clearly state why and how UI-first learners can continue safely.

## Prerequisite discipline

- List only prerequisites needed immediately for the current step.
- Avoid future-looking prerequisites that front-load setup before learners need it.
- Never require `gh auth login` in a step that does not use authenticated `gh` commands.

## Learner empathy

- Assume many learners are new to terminal workflows.
- Keep command-heavy content narrow, purposeful, and optional when possible.
- When terminal use is unavoidable, point learners to Codespaces as a low-friction bridge.

## Positioning agentic workflows as an Actions-compatible superset

- Present agentic workflows as a **smooth transition from classic GitHub Actions**, not a replacement that forces learners to start over.
- State explicitly that frontmatter is **Actions YAML compatible** (triggers, permissions, runners, and deterministic steps still apply), while the Markdown body is the agent prompt with advanced templating features.
- Reinforce that workflow authors can create **hybrid deterministic + agentic designs** by keeping or importing custom jobs and steps for fixed data collection, then delegating reasoning and synthesis to the agent.
- In data-ops examples, teach a split of responsibilities: deterministic steps fetch/shape data, and the agentic prompt interprets that data and decides how to communicate outcomes.

## Header style

- Do **not** number Markdown headers inside a file. Use descriptive headings such as `### Open the Codespace`, not `### 2. Open the Codespace`.
- Keep ordering in ordered lists, tables, filenames, and checkpoint lists instead of in the heading text itself.

## Alert callouts: use `<details>` only for multi-line content

### Alert level ceiling

Use the **lowest alert level that accurately conveys the information**. For regular workshop content, cap callout severity at `[!NOTE]` or `[!TIP]`. Do **not** escalate to `[!WARNING]` or `[!CAUTION]` unless the situation is a **major security issue** — for example, a step that could expose credentials or grant unintended broad permissions.

- Prefer `[!TIP]` for helpful hints and shortcuts.
- Prefer `[!NOTE]` for important-but-not-urgent context that a learner should read.
- Use `[!IMPORTANT]` sparingly for information the learner **must** act on before continuing safely.
- Reserve `[!WARNING]` and `[!CAUTION]` for **major security issues only** (e.g., credential exposure, irreversible destructive actions with significant consequences). Do not use them for ordinary setup caveats, optional tool differences, or anything that would merely inconvenience a learner.
- Never use dramatic or alarmist language in callout body text. Keep the tone calm and matter-of-fact even when the level is high.

GitHub alert callouts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`) follow two patterns depending on how much content the callout contains.

**Single-line callout:** place the text directly in the blockquote — no `<details>` wrapper.

**Multi-line callout:** wrap the content in a `<details>` element so the page stays scannable by default and reveals supplementary information only when the learner expands it.

> [!IMPORTANT]
> Never put all content inside a `<summary>` with an empty `<details>` body. That creates a broken disclosure widget — the learner can click the expand triangle but nothing more appears.

### Pattern — single-line

```markdown
> [!TYPE]
> Single informative sentence that stands on its own.
```

### Pattern — multi-line

```markdown
> [!TYPE]
> <details>
> <summary>One-line summary visible when collapsed</summary>
>
> Full content revealed when expanded. Can include lists,
> tables, code blocks, and other Markdown.
>
> </details>
```

- The `<summary>` line is always visible. Make it informative enough to stand alone — a learner should be able to decide whether to expand without reading the body.
- If the callout has a **bold title** on the first line (e.g. `**Enterprise users: complete this check before continuing.**`), use that title as the `<summary>` and place the remainder of the content in the body.
- Markdown bold syntax (`**...**`) is not supported inside `<summary>`; use HTML bold (`<b>...</b>`) instead.
- Keep the `>` blockquote prefix on every line including blank separator lines (use `>` on its own for blank lines inside the adornment).
- Do **not** use `<details open>` — the collapsed default enforces progressive disclosure.

### Examples

Single-line callout (plain text, no `<details>`):

```markdown
> [!TIP]
> **Already know GitHub Actions?** Check the three boxes below and skip ahead.
```

Multi-line callout (summary + body):

```markdown
> [!IMPORTANT]
> <details>
> <summary><b>Enterprise users: complete this check before continuing.</b></summary>
>
> - [ ] Copilot Enterprise is enabled for the organization
> - [ ] A Copilot Enterprise seat is assigned to your account
>
> </details>
```

## Step ordering: environment before tools, credentials before running

- Do not instruct learners to install `gh` or `gh-aw` before a Codespace or local terminal session is open. The install step must always come after the environment setup step (Codespace or local terminal).
- Prefer guiding learners to trigger manual workflow runs from the GitHub Actions web UI.
- If a step includes `gh aw run`, present it as an optional advanced path and place credential setup (`gh auth login`) before the CLI-trigger instructions. Learners can verify their Copilot access is included in their authentication by running `gh auth status` and confirming the `github.com` token includes the `read:org` scope or that a Copilot subscription is active under their account (covered in [Step 6: Install the gh-aw CLI Extension](../../workshop/06-install-gh-aw.md)).

## Schedule triggers: always use fuzzy syntax in agentic workflow files

- In agentic workflow `.md` files, **always** use fuzzy schedule expressions such as `schedule: daily`, `schedule: daily on weekdays`, `schedule: weekly`, or `schedule: every 6 hours`.
- **Never** write raw cron syntax (e.g., `- cron: "0 8 * * *"`) inside an agentic workflow `.md` file. Cron expressions belong only in the compiled `.lock.yml` files generated by `gh aw compile`.
- Classic GitHub Actions YAML workflows use cron syntax directly. Agentic workflows do not — `gh aw compile` generates the cron value automatically.

## Node.js is not required

- Do **not** list Node.js as a prerequisite or required tool anywhere in the workshop.
- Do **not** include `node --version` checks or Node.js install steps in any activity or setup step.
- Node.js is incidentally present in Codespaces but learners must never be told they need to install or verify it.
- If a step currently references Node.js, remove that reference and update any associated checkpoint items.

## UI/CLI split path

When a step diverges significantly between a terminal-based workflow and a browser-only workflow, **split it into separate files** rather than mixing both paths in a single file. Segmenting users into path-specific files keeps each file focused, reduces cognitive load, and avoids long blocks of instructions that do not apply to the reader.

### Prefer file split over inline sections

Use a file split when the Terminal path and the GitHub UI path differ in more than one or two instructions. Inline `### Terminal path —` / `### GitHub UI path —` sections are only appropriate for short, mostly-converging steps where the divergence is a single action (for example, one commit step at the end).

For new file-split steps, follow the existing **choose-your-path branch ID** naming convention (`NNx` where `x` is a lowercase letter):

- `NNa-<slug>-terminal.md` — Terminal path file
- `NNb-<slug>-ui.md` — GitHub UI path file

At the top of each path file, add a brief note pointing back to the decision point — do **not** link directly to the sibling path file. Learners who need to switch should return to the decision point and choose again.

### Named paths

- **Terminal path** — the learner has a terminal open (Codespace or local). They create files with shell commands, compile with `gh aw compile`, and push with `git`.
- **GitHub UI path** — the learner works entirely in the browser. They create and edit files using the GitHub web editor, paste complete file content, and commit directly from the browser.

### Heading convention (for inline sections)

When inline sections are appropriate, use `###` headings that state both the path name and the action, separated by an em dash:

```
### Terminal path — <action>
### GitHub UI path — <action>
```

Always capitalize **Terminal path** and **GitHub UI path** exactly as shown. Do not use lowercase (`terminal path`) or alternate labels (`CLI path`, `browser path`).

### Structure rules

- Place the **Terminal path** section before the **GitHub UI path** section for the same action.
- For the GitHub UI path, always provide the complete file content in a copy-paste block so learners can paste once and commit.
- For the Terminal path, guide learners to build incrementally and compile after each section with `gh aw compile` (recompiles all workflows). Recommend the `--watch` flag as an alternative: `gh aw compile --watch` keeps a second terminal compiling on save for continuous feedback.
- After the split sections, add a short bridging paragraph that calls out what each path skips (for example, the UI path skips `gh aw compile` checkpoints).

### Compile defaults

- Prefer `gh aw compile` as the default command in workshop instructions; learners do not need to specify a filename in most cases.
- Reserve `--validate` for targeted troubleshooting or explicit schema/deprecation audits.

### Compile checkpoints

- Skip `gh aw compile` checkpoints for UI-path learners — compilation happens implicitly when GitHub Actions runs the workflow.
- For Terminal-path learners, place a compile checkpoint after each meaningful addition to the workflow file.

## Enterprise user preference in design decisions

When two workshop design choices are of equal or comparable value, **favor the option that better serves enterprise users** — learners using GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), or self-hosted runners. Apply this rule at every decision point:

- **Path prioritization**: when two candidate nodes or improvements are comparable in scope and impact, choose the one that closes a gap for enterprise learners first.
- **Default examples**: when selecting a code example, URL, or configuration snippet and multiple options are valid, prefer one that works in both github.com and enterprise environments (for example, avoid hardcoded `github.com` URLs where an enterprise base URL would be needed).
- **Credential and network guidance**: when documenting authentication, token, or network steps, include enterprise-specific notes (SSO, SAML, proxy configuration) alongside the standard path — even when they are not the primary path.
- **Tie-breaking in UI vs. CLI decisions**: when it is genuinely unclear whether a step should be UI-first or CLI-first, prefer the approach that works reliably in enterprise environments (some enterprises restrict browser-based agent sessions; CLI paths may be more reliable in those contexts).
- **Side-quest and branch selection**: when choosing which optional content to add next, enterprise-relevant topics (self-hosted runners, GHES configuration, enterprise authentication) take precedence over non-enterprise topics of equal priority.

This rule does not override clearly superior choices for all learners. It is a tie-breaker, not an absolute reorder of priorities.

## No "See Also" sections — documentation links belong inline

- Do **not** add `## See Also`, `## 📚 See Also`, or any equivalent dedicated "See Also" section to workshop files.
- When a concept or term has a matching reference page in the gh-aw docs, link it **inline** at its first bare occurrence in the prose (e.g., `[safe-outputs](https://github.github.com/gh-aw/reference/safe-outputs/)`).
- If you want to surface a relevant doc URL without anchoring it to specific prose, place the bare URL on its own line in the text — do **not** wrap it in a `[title](url)` list under a "See Also" heading.
- Any existing `## See Also` / `## 📚 See Also` sections are violations of this rule and must be removed.

## Consistency check

Before finalizing workshop edits, quickly confirm that early steps remain UI-first, do not require `gh` before it is truly needed, and do not reference Node.js as a prerequisite.

## Linear path navigation

The workshop is structured as a small number of **linear learner paths**, not a graph. Learners should never have to interpret sibling files or make judgement calls mid-tutorial. Apply these rules to every workshop file:

- **Choices happen only at explicit decision points.** A decision-point page announces the available paths clearly and lets the learner choose once. It must not ask learners to consult or cross-reference adjacent files in order to decide.
- **Each path is linear until convergence.** After entering a path, every "Next" or "Continue" link leads to the next step on that same path — never to a sibling path file. Learners should never need to read a file from a different path to understand where they are.
- **No cross-path references mid-journey.** Do not mention what learners on other paths are doing, do not link to sibling files inside the body of a step, and do not imply that something on another path is the learner's "alternative" while they are already in a step.
- **Convergence points are explicitly defined.** When a branched path rejoins the shared trunk, the last file in that branch must state the convergence clearly (for example: "All paths continue at [Step NN](NN-slug.md)").
- **Return-to-decision-point, not sibling-file links.** The only cross-path reference permitted is a brief note at the very top of a path file to redirect learners who arrived via the wrong branch back to the decision point. Never link directly to the sibling path file from within a step.

## Activity numbering for linear learner paths

Use a single activity ID scheme across core steps, branch variants, and side quests so tables of contents can be regenerated by script.

- **Core/shared step IDs**: `NN` (two digits, zero-padded), for example `00`, `01`, `10`.
- **Choose-your-path branch IDs**: `NNx` where `x` is a lowercase branch letter, for example `02a`, `02b`.
- **Side-quest IDs**: `NN-SQMM` where:
  - `NN` is the parent/main step number where learners branch out
  - `MM` is a two-digit side-quest sequence under that parent (`01`, `02`, ...)
  - Example IDs: `11-SQ01`, `11-SQ02`, `16-SQ01`

Recommended filename patterns for new content:

- Core/shared: `NN-<slug>.md`
- Branch variant: `NNx-<slug>.md`
- Side quest: `side-quest-NN-MM-<slug>.md`

TOC generation rules (script-friendly):

1. Parse activity IDs from filenames using these regexes:
   - Core/shared: `^(?<step>\d{2})-`
   - Branch variant: `^(?<step>\d{2})(?<branch>[a-z])-`
   - Side quest: `^side-quest-(?<step>\d{2})-(?<sq>\d{2})-`
2. Sort by `(step ASC, type_order ASC, branch/sq ASC)` where `type_order` is:
   - `0` = core/shared step
   - `1` = branch variant
   - `2` = side quest
3. Render labels as:
   - Core/shared: `NN`
   - Branch variant: `NNx`
   - Side quest: `NN-SQMM`

This keeps IDs lexically sortable, supports the linear learner path model with explicit choice points, and cleanly groups optional side quests under their parent step.

## Workshop page frontmatter schema

Every Markdown file in `workshop/` (except `README.md`) carries a YAML frontmatter block that describes the user journey and adventure category of the page. Tools and tables of contents use these fields to filter pages by learner profile.

### Frontmatter format

```yaml
---
journey: <value>
adventure: <value>
---
```

Place this block as the **very first content** in the file, before the `#` heading.

### `journey` — learner path

Describes which learner profile the page targets.

### Journey comment markers for conditional sections

Use XML comments with a `journey` marker when only part of a page should be shown for a specific learner journey.

```xml
<!-- journey: ui -->
...content shown only for the UI journey...
<!-- /journey -->
```

Rules:

- `journey:` accepts one or more comma-separated journey values from this schema: `all`, `ui`, `terminal`, `codespace`, `local`, `copilot`.
- Use `all` only when a downstream processor requires explicit tagging for every block in a normalized output. If no filtering is needed for a block, prefer leaving it unwrapped instead of `journey: all`.
- Keep `journey` frontmatter at the top of the file. Inline comment markers are for section-level filtering inside a page, not page-level routing.
- Prefer journey comment markers for path-specific alerts/callouts and for `Next`/`Continue` link blocks.
- Wrap complete block sections (for example, a full callout or a full next-step line), not partial words inside a sentence.
- Do not nest journey markers. Keep each commented journey block self-contained, and place it at normal block boundaries (paragraphs, list items, callouts, or next-link lines).

Example patterns:

```markdown
<!-- journey: codespace -->
> [!TIP]
> Using a Codespace? Continue to [Step 2a](02a-setup-codespace.md).
<!-- /journey -->

<!-- journey: local -->
**Next:** [Step 2b: Set Up Your Local Terminal](02b-setup-local.md)
<!-- /journey -->
```

| Value | Meaning |
|-------|---------|
| `all` | Applicable to every learner regardless of environment |
| `ui` | GitHub web UI path only (no terminal required) |
| `terminal` | Any terminal user — Codespace or local |
| `codespace` | Codespace-specific instructions (subset of `terminal`) |
| `local` | Local terminal-specific instructions (subset of `terminal`) |
| `copilot` | GitHub Copilot app or Agents tab users |

Rules for assigning `journey`:

- Use `all` for shared hub pages and conceptual introductions that every learner reads.
- Use `terminal` for pages where the primary instructions require a shell (Codespace or local). Use `codespace` or `local` only when the content is specific to one of those environments and would not apply to the other.
- Use `ui` for pages written exclusively for learners who stay in the GitHub browser UI.
- Use `copilot` for pages that target the Copilot desktop app or the browser-based Agents tab (Adventure D).

### `adventure` — content category

Describes the role the page plays in the overall workshop structure.

| Value | Meaning |
|-------|---------|
| `core` | Required shared path — every learner follows these pages |
| `setup` | Environment or tool setup steps (Codespace, local, gh-aw install) |
| `scenario-a` | Adventure A — Daily Repo Status Report |
| `scenario-b` | Adventure B — Daily Documentation Updater |
| `scenario-c` | Adventure C — PR Code Reviewer |
| `scenario-d` | Adventure D — Build with GitHub Copilot (Agents tab / CCA) |
| `advanced` | Optional post-core topics (steps 14 and above) |
| `side-quest` | Optional deep-dive supplementary content branching off a main step |

### Assignment rules by file pattern

| Filename pattern | Typical `journey` | Typical `adventure` |
|-----------------|-------------------|---------------------|
| `NN-<slug>.md` (core/shared) | `all` | `core` or `advanced` |
| `NNa-<slug>-terminal.md` | `terminal` | matches parent step |
| `NNb-<slug>-ui.md` | `ui` | matches parent step |
| `NNc-<slug>-copilot.md` | `copilot` | matches parent step |
| `10a-*`, `11a-*`, `11a2-*` | `all` or split by sub-path | `scenario-a` |
| `10b-*`, `11b-*` | `all` or split by sub-path | `scenario-b` |
| `10c-*`, `11c-*` | `all` or split by sub-path | `scenario-c` |
| `11d-*` | `copilot` | `scenario-d` |
| `02a-*`, `06a-*` | `codespace` | `setup` |
| `02b-*`, `06b-*` | `local` | `setup` |
| `06c-*` | `ui` | `setup` |
| `side-quest-NN-MM-<slug>.md` | varies (see below) | `side-quest` |

Side quest `journey` assignment:

- `terminal` — content is exclusively about terminal commands or `gh aw compile` (e.g., `side-quest-07-01-compile-workflow.md`).
- `codespace` — content addresses a Codespaces-specific error or configuration (e.g., `side-quest-08-01-codespaces-actions-write.md`).
- `ui` — content is only applicable to GitHub UI path learners (e.g., `side-quest-06-03c-copilot-github-token-ui-only.md`).
- `copilot` — content is specific to the Copilot CCA or Agents tab environment (e.g., `side-quest-06-02-cca-codespace.md`).
- `all` — conceptual, reference, or debugging content relevant regardless of environment (the majority of side quests).
