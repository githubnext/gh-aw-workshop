<!-- page-journey: all -->
<!-- page-adventure: side-quest -->
# Side Quest: Skill Injection Strategies — Hint, Fusion, and Inline

> _Optional: use this deeper guide if you want the full decision picture for wiring a `SKILL.md` into a workflow prompt before you return to [Step 29](29-skills-and-domain-knowledge.md)._

## :dart: What You'll Do

Compare three strategies for connecting a `SKILL.md` to a workflow prompt — **hint**, **fusion**, and **inline** — and practice writing each one. By the end, you'll be able to pick the right strategy for a given task and context budget.

## :clipboard: Before You Start

- You are working through [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You have a `SKILL.md` file already written, such as `.github/skills/issue-triage/SKILL.md` from Step 29.

---

## Decide with one table

| Factor | Hint (generalist) | Fusion (targeted) | Inline (self-contained) |
|---|---|---|---|
| Task domain | Broad or unknown at authoring time | Narrow and well-defined | Specific to one workflow |
| Skill set | Grows dynamically over time | Known and stable | Not reused elsewhere |
| Context budget | Generous | Tight | Small — only what fits inline |
| Determinism | Lower — agent chooses what applies | Higher — you specify the exact fragment | Highest — content ships with the workflow |
| Reuse | Across many workflows | Across many workflows | Single workflow only |

> :thinking: **Predict:** Before reading the examples below, guess which strategy fits your Step 29 skill. Does your task domain stay narrow, or could it grow to cover new conventions later?

---

## Hint: let the agent discover skills itself

Use **hint** when you want the agent to look around the repository and self-select relevant skills. This is the lowest-effort option and scales well as your skill library grows, at the cost of some determinism — you're trusting the agent's judgment about what applies.

```markdown
If the repository contains `SKILL.md` files under `skills/` or `.github/skills/`,
check which ones are relevant to this task. For each relevant skill, read its
content and apply the guidance it provides.
```

**Action:** Add this hint paragraph to a workflow brief that touches issues, pull requests, or another domain covered by one of your skills.

---

## Fusion: reference the exact fragment you need

Use **fusion** when you know exactly which skill section the agent needs and want to keep the prompt compact. A fusion comment references only the relevant fragment — never the whole file — so the compiler pulls in just that piece at compile time.

```markdown
<!-- gh-skill-fusion: .github/skills/issue-triage/SKILL.md#issue-triage -->

Classify this issue as bug, feature, or question. If it is a bug, confirm the
body includes reproduction steps, expected vs. actual behavior, and environment
details.
```

**Action:** Add a `gh-skill-fusion` comment above one workflow section that maps directly to a heading in your `SKILL.md`.

> [!TIP]
> The anchor after `#` in the fusion comment must match a heading in the target `SKILL.md` exactly. If it doesn't match, the compiler cannot resolve the fragment.

---

## Inline: embed the skill in the workflow file itself

Use **inline** skills when the skill is small, specific to a single workflow, and you don't need it anywhere else. Embed the fragment directly in the workflow file under a `## skill: \`name\`` heading — gh-aw extracts it to the right location at setup time, so you don't maintain a separate `SKILL.md` file at all.

```markdown
## skill: `issue-triage`

Classify each issue as `bug`, `feature`, or `question` based on its title and body.
For issues classified as `bug`, confirm the body includes steps to reproduce,
expected vs. actual behavior, and environment details.
```

**Action:** If you have a one-off convention that only this workflow needs, try moving it into a `## skill:` block instead of a separate file.

---

## Practice: apply all three to one skill

Take the `.github/skills/issue-triage/SKILL.md` file you wrote in Step 29 (or an equivalent skill of your own) and try each strategy in turn:

1. Add a **hint** paragraph to a workflow brief and compile it.
2. Replace the hint with a **fusion** comment pointing at one heading in your skill, and compile again.
3. Copy the same content into a `## skill:` inline block in the workflow file itself, remove the fusion comment, and compile a third time.

After each compile, check the `.lock.yml` for the activation step or extracted skill content, and confirm you get no warnings about an unpinned or unresolved skill reference.

```bash
gh aw compile
```

## :white_check_mark: Checkpoint

- [ ] I can explain when to choose hint over fusion, and when to choose inline over both
- [ ] I wrote a hint paragraph referencing `skills/` or `.github/skills/`
- [ ] I wrote a fusion comment with a valid anchor matching a `SKILL.md` heading
- [ ] I wrote an inline `## skill:` block as an alternative to a separate file
- [ ] `gh aw compile` succeeded for at least one of these strategies with no unpinned-skill warnings

---

<!-- journey: all -->
Return to [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
<!-- /journey -->
