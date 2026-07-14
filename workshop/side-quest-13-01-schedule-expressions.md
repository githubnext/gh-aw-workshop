# Side Quest: Fuzzy Schedule Expressions

> _Optional: use this quick reference if you want help choosing a schedule expression for [Step 13: Schedule It to Run Every Day](13-schedule-it.md), then return to the main adventure._

## 🎯 What You'll Do

You'll learn how `gh-aw`'s plain-English schedule syntax maps to GitHub Actions cron schedules. By the end, you'll know which fuzzy expression fits your workflow, how to verify the compiled cron value, and how agentic workflows differ from classic Actions YAML when it comes to scheduling.

## Cron in one minute

GitHub Actions stores schedules as **cron expressions** — five fields that describe **minute, hour, day of month, month, and day of week**.

You do **not** need to write cron by hand for common cases. In `gh-aw`, you can write a fuzzy expression like `daily on weekdays`, then let `gh aw compile` convert it for you.

> [!NOTE]
> `gh-aw` often **scatters** schedules across different minutes or hours so not every workflow runs at the same time. That means your compiled cron may differ from the examples below. Treat your own compiled output as the source of truth.

## Fuzzy schedule reference

| What you want | Fuzzy expression | Example compiled cron | What it means |
|---------------|------------------|-----------------------|---------------|
| Once a day | `schedule: daily` | `49 23 * * *` | Run once per day at a compiler-chosen UTC time. |
| Weekdays only | `schedule: daily on weekdays` | `50 11 * * 1-5` | Run once per weekday at a compiler-chosen UTC time. |
| Once a week | `schedule: weekly` | `20 4 * * 5` | Run once per week at a compiler-chosen UTC day and time. |
| Every hour | `schedule: hourly` | `30 */1 * * *` | Run every hour, usually at a scattered minute. |
| Every six hours | `schedule: every 6 hours` | `14 */6 * * *` | Run every six hours, usually at a scattered minute. |

## Which cadence should you choose?

Use this rule of thumb:

- **`hourly`** — use when you want fast feedback while experimenting or monitoring something that changes often.
- **`every 6 hours`** — use when you want multiple updates per day without generating hourly noise.
- **`daily`** — use for a standard once-a-day summary.
- **`daily on weekdays`** — use when the workflow matters during the work week but can stay quiet on weekends.
- **`weekly`** — use for a low-noise roundup or audit-style report.

## Verify the compiled cron after `gh aw compile`

Run:

```bash
gh aw compile .github/workflows/daily-status.md
```

Then open the generated lock file and look for the `cron:` line under `on.schedule`:

```yaml
on:
  schedule:
    - cron: "50 11 * * 1-5"
      # Friendly format: daily on weekdays (scattered)
```

This is the exact schedule GitHub Actions will register for **your** workflow.

## When should you use raw cron?

Raw cron expressions belong in **classic GitHub Actions YAML** workflows — not in agentic workflow `.md` files. In an agentic workflow, always use a fuzzy expression; `gh aw compile` generates the cron value in the `.lock.yml` automatically.

If none of the fuzzy options match your exact timing need, choose the closest fuzzy expression. The fuzzy expressions cover the most common cadences, and the compiler scatters the exact minute and hour to avoid load spikes.

> In a classic Actions workflow you would write cron directly:
>
> ```yaml
> # classic-actions.yml (NOT an agentic workflow)
> on:
>   schedule:
>     - cron: "15 9 * * 1-5"
> ```
>
> In an agentic workflow `.md`, always use fuzzy syntax instead:
>
> ```yaml
> on:
>   schedule: daily on weekdays
>   workflow_dispatch: {}
> ```

## ✅ Checkpoint

- [ ] I can explain what a cron expression is at a high level
- [ ] I know which fuzzy schedule expression best matches my workflow cadence
- [ ] I know that `gh aw compile` turns fuzzy syntax into a concrete cron value in the `.lock.yml`
- [ ] I know where to look for the compiled `cron:` line after compilation
- [ ] I know that raw cron belongs in classic Actions YAML, not in agentic workflow `.md` files

---

Return to the main adventure: [Step 13: Schedule It to Run Every Day](13-schedule-it.md).
