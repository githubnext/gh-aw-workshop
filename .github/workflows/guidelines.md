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

## 5) Consistency check

Before finalizing workshop edits, quickly confirm that early steps remain UI-first and do not require `gh` before it is truly needed.
