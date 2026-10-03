<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Cost Guardrail Fields Reference

> _Optional: read this field-by-field reference if you want to understand exactly how `timeout-minutes`, `max-ai-credits`, and `max-daily-ai-credits` behave before adding them to your workflow, then return to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md)._

## :dart: What You'll Do

You'll learn what each of the three cost-guardrail [frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) fields does, what its default value is, and how to disable it when you need to — so you can set values confidently instead of guessing.

## :clipboard: Before You Start

- You completed the "Reduce token consumption and set guardrails" section of [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
- You have a workflow file open and ready to edit.

## Steps

### Field 1 — `timeout-minutes`

[`timeout-minutes`](https://github.github.com/gh-aw/reference/rate-limiting-controls/#timeouts) cancels the entire Actions job if it runs longer than the limit. The run fails, and you are billed only for the tokens consumed before cancellation.

```markdown .github/workflows/daily-status.md
---
timeout-minutes: 10
---
```

There is no "disable" value for `timeout-minutes` — GitHub Actions itself enforces a job-level maximum regardless of what you set. Start with a generous limit (10–15 minutes) and tighten it once you know how long typical runs take.

> [!NOTE]
> On GitHub Enterprise Server (GHES) and GitHub Enterprise Cloud (GHEC), administrators can set a maximum job timeout at the organisation or enterprise level. When that policy is more restrictive than your `timeout-minutes` value, the enterprise limit takes precedence.

### Field 2 — `max-ai-credits`

[`max-ai-credits`](https://github.github.com/gh-aw/reference/cost-management/#cap-ai-credits-per-run) caps the AI Credits (AIC) a **single run** may consume, enforced by the Agent Workflow Firewall (AWF).

```markdown .github/workflows/daily-status.md
---
max-ai-credits: 1000
---
```

- Default when omitted: **1000 AIC**.
- Set to a negative value (for example, `-1`) to disable enforcement and token steering entirely.

### Field 3 — `max-daily-ai-credits`

[`max-daily-ai-credits`](https://github.github.com/gh-aw/reference/cost-management/#cap-daily-ai-credits-per-workflow) caps the total AIC this workflow may consume across the **last 24 hours** for the triggering user. Runs that would exceed the cap are blocked before they start.

```markdown .github/workflows/daily-status.md
---
max-daily-ai-credits: 2500
---
```

- A system default threshold applies when this field is omitted.
- Set to `-1` to disable the guardrail.
- Provide an explicit integer to override the default.

## :hammer_and_wrench: Try it

Using your own workflow's average AIC per run (from `gh aw logs` or `gh aw forecast`), calculate a `max-daily-ai-credits` value that allows for 3 full runs before the guardrail engages. Add all three fields to your frontmatter and recompile:

```bash
gh aw compile
```

## :white_check_mark: Checkpoint

- [ ] You can explain what happens when `timeout-minutes` is exceeded
- [ ] You know the default value of `max-ai-credits` and how to disable it
- [ ] You know the difference between `max-ai-credits` (per run) and `max-daily-ai-credits` (24-hour total)
- [ ] You calculated a `max-daily-ai-credits` value based on your own workflow's average AIC per run
- [ ] You know that an enterprise-level timeout policy can override your `timeout-minutes` value

---

<!-- journey: all -->
Return to [Manage Costs and AI Credit Budgets](26-manage-costs-and-budgets.md).
<!-- /journey -->
