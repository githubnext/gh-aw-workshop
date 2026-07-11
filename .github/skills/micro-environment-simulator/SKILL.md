---
name: micro-environment-simulator
description: Build a JavaScript micro environment simulator (abstract state machine) to replay workshop steps and verify environment assumptions.
disable-model-invocation: true
---

# Micro Environment Simulator

Use this skill when a workflow needs code-based simulation of learner environments before or during workshop replay analysis.

## Goal

Create and run a **JavaScript abstract state machine** that models student execution environments and validates workshop assumptions step-by-step.

## Included Source

Use the checked-in source directly (do not re-implement from scratch):

- `.github/skills/micro-environment-simulator/simulator.js`

It exports:

- `STEP_IDS`
- `defaultEnvironmentForStudent(student, dayOfYear)`
- `replayWorkshop({ student, date, initialState, steps })`
- `simulateStudents(students, date)`

CLI usage:

```bash
node .github/skills/micro-environment-simulator/simulator.js \
  --students /tmp/gh-aw/agent/sim/data/profiles.json \
  --date "$TODAY" \
  --out /tmp/gh-aw/agent/sim/data/environment-replay.json
```

Use `/tmp/gh-aw/agent/sim/data/environment-replay.json` as the source of environment mismatch diagnostics during simulation.

## Required Environment Model

Model environment state with explicit fields for:

- OS (`macos`, `linux`, `windows`)
- terminal (`bash`, `zsh`, `powershell`, `cmd`)
- installed software (`gh`, `aw`, and related versions)
- login status (`gh auth status` equivalent)
- account type (`personal`, `enterprise-managed`)
- deployment type (`github.com`, `ghec`, `ghes`)

## Approach

1. Represent environment as immutable state snapshots.
2. Define workshop instructions as transitions with:
   - preconditions
   - state updates
   - expected observable outputs
3. Execute deterministic replay per student persona and stop on first violated precondition.
4. Emit structured diagnostics for each failure:
   - step id
   - failed assumption
   - current state
   - remediation hint

## Validation Rules

- Use JavaScript for simulator implementation.
- Keep transition logic deterministic and testable.
- Ensure every instruction checks assumptions before mutating state.
- Distinguish platform-specific command behavior across OS/terminal combinations.
- Distinguish auth/account/deployment constraints (`github.com` vs `ghec` vs `ghes`).

## Output Contract

Return concise JSON-friendly results that workflows can aggregate:

- completion status per student
- first failing step (if any)
- failure reason category
- normalized remediation action

If assumptions hold for a full replay, mark the run successful and include the final state summary.
