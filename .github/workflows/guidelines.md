# Shared Workshop Authoring Guidelines

Use these rules across workshop authoring/editing workflows to keep the tutorial beginner-friendly and avoid over-indexing on the GitHub CLI.

## 1) Tooling progression: delay and minimize `gh`

- Prefer GitHub UI and Codespaces paths early in the workshop.
- Do not require `gh` installation/authentication in early shared steps unless a command in that same step truly requires it.
- Delay `gh` setup and `gh-aw` install requirements until the latest practical point (typically the dedicated install step or later).
- Minimize `gh` command volume throughout; use it only when it provides clear value or when no equivalent UI path exists.

## 2) UI-first instruction design

- For repo/file/edit/commit actions, prefer a UI-first path and provide terminal commands as optional alternatives.
- Keep any required terminal path concise and explicit.
- If terminal-only actions are required (for example, local `gh aw compile --validate`), clearly state why and how UI-first learners can continue safely.

## 3) Prerequisite discipline

- List only prerequisites needed immediately for the current step.
- Avoid future-looking prerequisites that front-load setup before learners need it.
- Never require `gh auth login` in a step that does not use authenticated `gh` commands.

## 4) Learner empathy

- Assume many learners are new to terminal workflows.
- Keep command-heavy content narrow, purposeful, and optional when possible.
- When terminal use is unavoidable, point learners to Codespaces as a low-friction bridge.

## 5) Step ordering: environment before tools, credentials before running

- Do not instruct learners to install `gh` or `gh-aw` before a Codespace or local terminal session is open. The install step must always come after the environment setup step (Codespace or local terminal).
- Always configure agent credentials (via `gh auth login` with Copilot access) before guiding learners to trigger a workflow run. Do not place credential setup steps after the run-workflow step. Learners can verify their Copilot access is included in their authentication by running `gh auth status` and confirming the `github.com` token includes the `read:org` scope or that a Copilot subscription is active under their account (covered in [Step 6: Install the gh-aw CLI Extension](../../workshop/06-install-gh-aw.md)).

## 6) Node.js is not required

- Do **not** list Node.js as a prerequisite or required tool anywhere in the workshop.
- Do **not** include `node --version` checks or Node.js install steps in any activity or setup step.
- Node.js is incidentally present in Codespaces but learners must never be told they need to install or verify it.
- If a step currently references Node.js, remove that reference and update any associated checkpoint items.

## 7) Consistency check

Before finalizing workshop edits, quickly confirm that early steps remain UI-first, do not require `gh` before it is truly needed, and do not reference Node.js as a prerequisite.
