<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows Across Your Organisation

> _Enterprise teams need consistent policies — learn how to centralise safe-output rules, required reviewers, and workflow standards so every team stays within bounds._

## :dart: What You'll Do

You'll apply three organisation-level controls to your agentic workflow: branch-protection requiring code review on workflow changes, a shared `SKILL.md` that encodes your permitted safe-output surface, and a reusable governance wrapper that other workflows can call without bypassing its safeguards. By the end of this step you have a repeatable governance pattern for any workflow your organisation deploys.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- You have at least one working agentic workflow (for example `daily-status.md`) that you can edit and recompile.
- You have `write` or `admin` access to your practice repository's branch-protection settings on GitHub.

> [!NOTE]
> The controls in this step apply equally to GitHub Enterprise Cloud (GHEC) and standard GitHub.com organisations. GHES users on 3.12 or later can follow along, but some UI paths may differ — check your administrator's documentation for org policy settings.

## Steps

### Add a required-reviewer rule for workflow changes

1. Open your practice repository on GitHub.com.
2. Go to **Settings** → **Branches** → **Add branch ruleset** (or **Add rule** on GHES).
3. Set **Target branches** to `main`.
4. Enable **Require a pull request before merging** and set **Required approvals** to `1`.
5. Enable **Restrict pushes that create matching files** and add the pattern `.github/workflows/**`.
6. Click **Save changes**.

From now on, a workflow change that reaches `main` must be approved by at least one reviewer who is not the change author.

![Branch protection rule requiring approval for workflow changes](images/30-branch-protection.png)

### Centralise your safe-output policy in a shared skill

Encode your permitted output surface in a shared `SKILL.md`. Workflow authors who write new briefs will automatically apply the same allowlist.

In the Codespace terminal:

```bash
gh copilot
```

Ask the agent:

```prompt
/agentic-workflows create a new skill at .github/skills/org-safe-output-policy/SKILL.md that documents our safe-output policy: workflows may create issues and add PR comments, but must never approve PRs or push directly to branches. Reference this skill from daily-status.md using the hint strategy.
```

Compile after the change:

```bash
gh aw compile
```

Open the compiled `.lock.yml` and confirm the skill installation step appears before the agent job.

### Introduce a reusable workflow wrapper

A reusable workflow lets you centralise steps — such as a mandatory audit upload — that callers cannot bypass.

Ask your agent:

```prompt
/agentic-workflows add a reusable workflow at .github/workflows/aw-governance-wrapper.md that accepts a workflow_call trigger, sets permissions to contents:read and issues:write only, and includes a mandatory step that uploads the run's audit artifact using actions/upload-artifact. Then update daily-status.md to call this wrapper instead of running the agent job inline.
```

Compile both files:

```bash
gh aw compile
```

Open the compiled `.lock.yml` files and confirm the wrapper has a `workflow_call` trigger and `daily-status.lock.yml` contains a `uses:` reference to the wrapper.

Before pushing, confirm each control is in place:

| Control | Where it lives | How to verify |
|---|---|---|
| Required reviewer for workflow changes | Branch protection rule | Settings → Branches → confirm rule is active |
| Safe-output policy encoded in skill | `.github/skills/org-safe-output-policy/SKILL.md` | File exists and is referenced in `daily-status.md` |
| Reusable governance wrapper | `.github/workflows/aw-governance-wrapper.md` | Compiled and has `workflow_call` trigger |
| `daily-status.md` calls wrapper | `daily-status.lock.yml` | Contains `uses: ./.github/workflows/aw-governance-wrapper.lock.yml` |

Commit all changed files, open a pull request, and request a review.

## :white_check_mark: Checkpoint

- [ ] Your repository has a branch protection rule that requires at least one review on changes to `.github/workflows/**`
- [ ] You created `.github/skills/org-safe-output-policy/SKILL.md` describing your permitted safe-output surface
- [ ] `daily-status.md` references the org skill using the hint strategy
- [ ] You created `aw-governance-wrapper.md` with a `workflow_call` trigger and a mandatory audit upload step
- [ ] `gh aw compile` succeeded for both `daily-status.md` and `aw-governance-wrapper.md`
- [ ] You opened a pull request for these changes and can see the required-reviewer gate is active
- [ ] You can explain why centralising safe-output policy in a skill is safer than trusting individual workflow frontmatter alone

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
