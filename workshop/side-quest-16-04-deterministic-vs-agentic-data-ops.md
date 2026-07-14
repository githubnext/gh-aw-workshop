# Side Quest: Deterministic vs Agentic Data Ops

> _Optional: use this guide when you are unsure which parts of a data workflow should stay deterministic and which parts should be agentic, then return to [Step 16](16-connect-data-source.md)._

Data-heavy workflows are strongest when you split responsibilities on purpose. Keep repeatable data operations deterministic. Use the agent where judgment is required.

---

## The decision rule

Use this quick test:

- If you can define exact pass/fail logic in advance, keep it deterministic.
- If the task depends on interpretation, ambiguity, prioritization, or communication quality, make it agentic.

You do not need to choose one mode for the entire workflow. Most production workflows are hybrid.

---

## Data-ops examples

| Task | Better fit | Why |
|---|---|---|
| Fetch the last 24 hours of commits | Deterministic | Same command, same shape, every run |
| Count open P1 incidents from issue labels | Deterministic | Exact filter and count logic |
| Decide which incidents look most urgent to humans | Agentic | Needs contextual judgment |
| Summarize trend changes for leadership | Agentic | Requires interpretation and audience-aware writing |
| Validate JSON schema before downstream use | Deterministic | Fixed validation rules |
| Explain likely causes behind a change spike | Agentic | Hypothesis and narrative reasoning |

---

## Hybrid blueprint you can reuse

Follow this structure for repository status, incident triage, and reporting flows:

1. **Deterministic extraction**: run fixed commands (`gh`, `git`, API calls) to collect data.
2. **Deterministic shaping**: normalize and label outputs (`$GITHUB_OUTPUT`, JSON fields, counts).
3. **Agentic interpretation**: ask the agent to identify risk, priority, and notable patterns.
4. **Agentic communication**: ask for role-specific output (engineering digest, leadership summary, on-call handoff).

This keeps your pipeline reliable while still getting adaptive reasoning where scripts become brittle.

---

## Common anti-patterns

- Pushing raw noisy logs straight into the prompt without shaping them first
- Asking the agent to compute exact metrics that shell commands can compute reliably
- Hard-coding dozens of branching rules for narrative tasks that change every week
- Using the agent for safety checks that require strict deterministic guarantees

---

## ✅ Checkpoint

- [ ] I can explain the difference between deterministic and agentic work in one sentence
- [ ] I can identify one step in my workflow that should stay deterministic
- [ ] I can identify one step in my workflow that should become agentic
- [ ] I can describe a hybrid design for my current data workflow
- [ ] I know when deterministic validation should remain outside the agent

---

Return to [Step 16: Connect a Live Data Source to Your Workflow](16-connect-data-source.md).
