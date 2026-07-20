<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Deterministic vs Agentic Data Ops

> _Optional: use this guide when you are unsure which parts of a data workflow should stay deterministic and which parts should be agentic, then return to [Step 16](16-connect-data-source.md)._

Data workflows work best when you split jobs on purpose. Keep repeatable operations [deterministic](https://github.github.com/gh-aw/patterns/deterministic-ops/). Use the agent when you need judgment.

## 📋 Before You Start

- Complete [Connect a Live Data Source](16-connect-data-source.md) (required)
- Be familiar with `gh` CLI commands

---

## The decision rule

Use this quick test:

- If you can define exact pass/fail logic in advance, keep it deterministic.
- If you need to decide which of 40 open issues is most urgent, make it agentic.
- If you need to explain trend changes to leadership, make it agentic.

You do not need one mode for the whole workflow. Most production workflows are hybrid.

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

## Hybrid blueprint

Follow this structure for repository status, incident triage, and reporting flows:

1. **Deterministic extraction**: run fixed commands (`gh`, `git`, API calls) to collect data.
2. **Deterministic shaping**: normalize and label outputs (`$GITHUB_OUTPUT`, JSON fields, counts).
3. **Agentic interpretation**: ask the agent to identify risk, priority, and notable patterns.
4. **Agentic communication**: ask for role-specific output (engineering digest, leadership summary, on-call handoff).

This keeps your pipeline reliable. It also gives you flexible reasoning where scripts become brittle.

## 🛠️ Try it: Label each step D or A

Read the workflow snippet. In the comment block, label each step as **D** (deterministic) or **A** (agentic).

```yaml
# Step A: Fetch open issues from the last 24 hours.
gh issue list --state open --search "updated:>=2026-07-13" --json number,title,labels,updatedAt

# Step B: Shape the output into a sorted table with issue number, label count, and last update time.

# Step C: Decide which three issues need maintainer attention today and explain why.

# Your labels:
# Step A: _
# Step B: _
# Step C: _
```

<details>
<summary>Show answer key</summary>

- Step A: **D** — fixed command and fixed fields.
- Step B: **D** — fixed transform and sort rules.
- Step C: **A** — requires prioritization and explanation.

</details>

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

<!-- journey: all -->
Return to [Connect a Live Data Source to Your Workflow](16-connect-data-source.md).
<!-- /journey -->


