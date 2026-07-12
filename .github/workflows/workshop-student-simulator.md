---
emoji: 🔬
description: Daily simulation of 38 students with various agentic technical levels attempting the "Learning GitHub Agentic Workflows" workshop. The curriculum is inferred from workshop markdown files at runtime. Produces a concise report issue with progressive disclosure and actionable sub-issues for improvements.
on:
  schedule: daily
  workflow_dispatch: {}
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  cache-memory: true
safe-outputs:
  create-issue:
    title-prefix: "[workshop-sim] "
    labels: [workshop, simulation, feedback]
    max: 5
    close-older-issues: true
network:
  allowed:
    - defaults
steps:
  - name: Prepare simulation workspace
    run: |
      mkdir -p /tmp/gh-aw/agent/sim/data
      mkdir -p /tmp/gh-aw/cache-memory
      TODAY=$(date -u +%Y-%m-%d)
      echo "TODAY=$TODAY" >> "$GITHUB_ENV"

  - name: Initialize student profiles if missing
    run: |
      if [ ! -f /tmp/gh-aw/cache-memory/profiles.json ]; then
        cat > /tmp/gh-aw/cache-memory/profiles.json <<'EOF'
      {
        "version": 2,
        "students": [
          {"id":1,  "name":"Alex Chen",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"personal-learning",    "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":2,  "name":"Jamie Liu",       "level":"beginner",     "personality":"methodical",  "background":"no-coding",       "goal":"personal-learning",    "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":3,  "name":"Morgan Kim",      "level":"beginner",     "personality":"confused",    "background":"no-coding",       "goal":"personal-learning",    "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":4,  "name":"Riley Park",      "level":"beginner",     "personality":"impatient",   "background":"no-coding",       "goal":"personal-learning",    "tool":"CCA",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":5,  "name":"Skyler Nguyen",   "level":"beginner",     "personality":"skeptical",   "background":"no-coding",       "goal":"personal-learning",    "tool":"CCA",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":6,  "name":"Casey Wong",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"teaching-others",      "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":7,  "name":"Drew Tanaka",     "level":"github-basic", "personality":"methodical",  "background":"web-dev",         "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":8,  "name":"Avery Singh",     "level":"github-basic", "personality":"curious",     "background":"web-dev",         "goal":"work-project",         "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":9,  "name":"Jordan Martinez", "level":"github-basic", "personality":"impatient",   "background":"web-dev",         "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":10, "name":"Quinn Lopez",     "level":"github-basic", "personality":"confused",    "background":"web-dev",         "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":11, "name":"Reece Thompson",  "level":"github-basic", "personality":"skeptical",   "background":"backend-dev",     "goal":"team-evaluation",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":12, "name":"Sam Patel",       "level":"github-basic", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":13, "name":"Blake Rivera",    "level":"github-basic", "personality":"curious",     "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":14, "name":"Chris Davis",     "level":"github-basic", "personality":"confused",    "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":15, "name":"Dana Wilson",     "level":"actions-user", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":16, "name":"Eli Brown",       "level":"actions-user", "personality":"curious",     "background":"devops",          "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":17, "name":"Frankie Moore",   "level":"actions-user", "personality":"impatient",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":18, "name":"Gio Jackson",     "level":"actions-user", "personality":"skeptical",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":19, "name":"Harper Lee",      "level":"actions-user", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":20, "name":"Indigo Taylor",   "level":"actions-user", "personality":"curious",     "background":"backend-dev",     "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":21, "name":"Jesse Anderson",  "level":"actions-user", "personality":"confused",    "background":"web-dev",         "goal":"work-project",         "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":22, "name":"Kai White",       "level":"actions-user", "personality":"methodical",  "background":"devops",          "goal":"team-evaluation",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":23, "name":"Lane Harris",     "level":"advanced",     "personality":"skeptical",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":24, "name":"Max Clark",       "level":"advanced",     "personality":"impatient",   "background":"backend-dev",     "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":25, "name":"Nova Robinson",   "level":"advanced",     "personality":"methodical",  "background":"devops",          "goal":"teaching-others",      "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":26, "name":"Ocean Lewis",     "level":"advanced",     "personality":"curious",     "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":27, "name":"Piper Walker",    "level":"advanced",     "personality":"skeptical",   "background":"web-dev",         "goal":"team-evaluation",      "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":28, "name":"Quinn Hall",      "level":"github-basic", "personality":"impatient",   "background":"no-coding",       "goal":"work-project",         "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":29, "name":"River Young",     "level":"beginner",     "personality":"methodical",  "background":"data-science",    "goal":"work-project",         "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":30, "name":"Sage King",       "level":"actions-user", "personality":"curious",     "background":"web-dev",         "goal":"teaching-others",      "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":31, "name":"Tatum Wright",    "level":"advanced",     "personality":"confused",    "background":"backend-dev",     "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":32, "name":"Uma Scott",       "level":"beginner",     "personality":"curious",     "background":"web-dev",         "goal":"team-evaluation",      "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":33, "name":"Vale Green",      "level":"github-basic", "personality":"methodical",  "background":"devops",          "goal":"personal-learning",    "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":34, "name":"Alex Morgan",     "level":"advanced",     "personality":"skeptical",   "background":"enterprise-devops","goal":"work-project",         "tool":"CCA",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":35, "name":"Blair Chen",      "level":"actions-user", "personality":"methodical",  "background":"enterprise-dev",  "goal":"team-evaluation",      "tool":"CCA",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":36, "name":"Cameron Ross",    "level":"github-basic", "personality":"impatient",   "background":"enterprise-dev",  "goal":"work-project",         "tool":"CCA",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":37, "name":"Devon Patel",     "level":"github-basic", "personality":"confused",    "background":"program-manager", "goal":"team-evaluation",      "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":38, "name":"Ellis Wang",      "level":"beginner",     "personality":"curious",     "background":"program-manager", "goal":"team-evaluation",      "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0}
        ]
      }
      EOF
        echo "Initialized fresh student profiles (38 students)"
      else
        echo "Loaded existing student profiles from cache"
        cat /tmp/gh-aw/cache-memory/profiles.json | python3 -c "
      import json,sys
      d=json.load(sys.stdin)
      runs=sum(s['runs'] for s in d['students'])
      print(f'Total prior simulation runs across all students: {runs}')
      "
      fi

  - name: Gather workshop content
    run: |
      mkdir -p /tmp/gh-aw/agent/sim/data
      python3 <<'PY'
      import json, pathlib, re

      workshop = pathlib.Path('workshop')
      if not workshop.is_dir():
          data = {'main_steps': [], 'side_quests': [], 'step_count': 0}
          pathlib.Path('/tmp/gh-aw/agent/sim/data/curriculum.json').write_text(json.dumps(data))
          print("No workshop directory found")
          import os
          with open(os.environ['GITHUB_ENV'], 'a') as ef:
              ef.write('WORKSHOP_STEP_COUNT=0\n')
          exit(0)

      def extract_title(f):
          for line in f.read_text().splitlines():
              if line.startswith('# '):
                  return line[2:].strip()
          return f.stem

      def sort_key(name):
          """Sort workshop filenames in curriculum order.

          Numbered files (e.g. 02a-setup.md) are sorted numerically with the
          optional letter suffix sorted alphabetically (02a < 02b). Files without
          a leading number (e.g. side-quest-*.md) sort last, alphabetically.
          """
          m = re.match(r'^(\d+)([a-z]?)', name)
          if not m:
              return (999, name)
          return (int(m.group(1)), m.group(2) or '')

      all_files = sorted(
          (f for f in workshop.glob('*.md') if f.name != 'README.md'),
          key=lambda f: sort_key(f.name)
      )
      main_steps = [f for f in all_files if not f.name.startswith('side-quest')]
      side_quests = [f for f in all_files if f.name.startswith('side-quest')]

      curriculum = [
          {'index': i, 'file': f.name, 'title': extract_title(f)}
          for i, f in enumerate(main_steps)
      ]
      side_quest_list = [{'file': f.name, 'title': extract_title(f)} for f in side_quests]

      data = {
          'main_steps': curriculum,
          'side_quests': side_quest_list,
          'step_count': len(curriculum),
      }
      pathlib.Path('/tmp/gh-aw/agent/sim/data/curriculum.json').write_text(json.dumps(data, indent=2))

      import os
      env_file = os.environ['GITHUB_ENV']
      with open(env_file, 'a') as ef:
          ef.write(f"WORKSHOP_STEP_COUNT={len(curriculum)}\n")
      print(f"Workshop curriculum: {len(curriculum)} main steps, {len(side_quests)} side quests")
      for entry in curriculum:
          print(f"  [{entry['index']}] {entry['file']}: {entry['title']}")
      PY
---

# Workshop Student Simulator

## Role

You are an expert UX researcher and instructional designer specialising in developer education. Your task is to **simulate 38 students with distinct profiles** attempting the "Learning GitHub Agentic Workflows" workshop and produce a detailed quality report.

---

## Context

The workshop teaches GitHub beginners how to create and run agentic workflows. The curriculum is determined at runtime from the workshop markdown files.

Read `/tmp/gh-aw/agent/sim/data/curriculum.json`. It contains:
- `main_steps`: ordered array of `{index, file, title}` for each main workshop step (excludes `README.md` and side-quest files)
- `side_quests`: array of `{file, title}` for optional supplementary steps
- `step_count`: total number of main steps

Use the `main_steps` array as the definitive curriculum for this simulation. Each element's `file` field is the filename in `workshop/`, and `title` is the heading extracted from that file. Do not rely on any previously known or hardcoded list of steps.

The workshop content available today: **${{ env.WORKSHOP_STEP_COUNT }} main steps** (plus side quests listed in `curriculum.json`).

---

## Student Profiles (38 students)

Read `/tmp/gh-aw/cache-memory/profiles.json` to load the student profiles. Each student has:
- `id` — unique identifier (1–38)
- `name` — persona name
- `level` — agentic technical level:
  - `beginner`: no prior GitHub or coding experience
  - `github-basic`: can clone/commit/push but has not used GitHub Actions or AI tools
  - `actions-user`: familiar with GitHub Actions YAML, but new to agentic/AI workflows
  - `advanced`: experienced developer or DevOps engineer who has used LLM-based tools
- `personality` — `curious`, `methodical`, `impatient`, `confused`, `skeptical`
- `background` — role background:
  - `no-coding`: no software development background
  - `web-dev`: frontend or full-stack web developer
  - `backend-dev`: backend or systems developer
  - `devops`: DevOps engineer or SRE
  - `data-science`: data scientist or ML engineer
  - `enterprise-dev`: enterprise developer using GHE or GHES with self-hosted runners
  - `enterprise-devops`: senior DevOps or platform engineer managing self-hosted runner fleets
  - `program-manager`: program or product manager evaluating agentic workflows
- `goal` — `personal-learning`, `work-project`, `team-evaluation`, `teaching-others`
- `ui_preferred` — `true` if the student prefers using the GitHub web UI over the terminal; `false` if they prefer the CLI
- `tool` — preferred agentic tool entry point:
  - `cli`: uses the `gh aw` CLI extension in a terminal
  - `vscode`: uses VS Code with the GitHub Copilot extension
  - `CCA`: uses the GitHub Copilot Cloud Agent (web or mobile app/chat interface, or cloud coding agent)
- `runs` — number of prior simulation runs (accumulated across days)
- `successes` — number of prior successful completions

---

## Simulation Task

### Load student profiles

Read `/tmp/gh-aw/cache-memory/profiles.json`. You will update this file at the end with accumulated run counts.

### Simulate each student through the workshop

For **each of the 38 students**, simulate their experience step-by-step using the following rules:

Before calculating probabilities, invoke the `micro-environment-simulator` skill (`.github/skills/micro-environment-simulator/SKILL.md`) and run:

```bash
node .github/skills/micro-environment-simulator/simulator.js \
  --students /tmp/gh-aw/cache-memory/profiles.json \
  --journey .github/skills/micro-environment-simulator/workshop-student-journey.js \
  --date "${{ env.TODAY }}" \
  --out /tmp/gh-aw/agent/sim/data/environment-replay.json
```

Use this replay output to execute a JavaScript abstract state machine replay for each student that models:

- OS
- terminal
- installed software (`gh`, `aw`)
- login status
- account type
- GitHub deployment type (`github.com`, `ghec`, `ghes`)

Use the simulator run to verify environment assumptions for each workshop step. If an assumption fails, stop the replay at that step and include the assumption mismatch in the student's pain points.

Treat browser-driven workflow execution steps differently from local CLI steps: triggering a workflow from the **Actions** tab should not require local Copilot credentials. Only flag secret-related problems at that stage when the workflow itself depends on repository-side Actions secrets or model access that the learner was expected to configure.

#### Simulation Rules

**Success probability per step** must be evaluated dynamically for each student-step pair. Do **not** use a fixed lookup table. Instead, reason from the student's full profile and the step's actual content and demands:

1. **Read the step**: Consult the step's `title` and `file` from `curriculum.json`. Where necessary (especially for steps with high simulated failure rates in this run, or steps that appear complex based on their title), read the actual workshop markdown file to understand what the learner is asked to do — for example, whether it requires terminal commands, YAML authoring, understanding new concepts, or multi-action sequences. For any step where the reasoning framework does not yield a clear probability estimate, fall back to the calibration anchors below using your best judgment about step difficulty relative to the student's level.

2. **Assess step difficulty** from the content:
   - How many distinct actions must the learner perform?
   - Does the step introduce a new concept, tool, or syntax?
   - Does it require prior setup or state from earlier steps to succeed?
   - Are there clear error messages or validation steps that help a confused learner self-correct?

3. **Match student profile to step demands**: For each student, consider:
   - **`level`** vs. assumed knowledge: a `beginner` facing a YAML-authoring step needs a much lower base probability than an `actions-user`.
   - **`background`** vs. step domain: a `devops` student on a CLI install step will fare far better than a `program-manager` or `no-coding` background student on the same step.
   - **`tool`** and **`ui_preferred`** vs. step tooling: if a step requires running `gh aw` in a terminal and the student is `ui_preferred` or uses `CCA`, reduce probability appropriately; for `gh aw run`, assume Codespaces auth does not include `actions:write` and treat CLI triggering as a failing path unless a GitHub Actions UI path is followed; if the step is UI-native (e.g., editing a file on GitHub.com), increase it for UI-preferred students.
   - **`personality`**: a `methodical` student reads carefully and retries — raise probability; a `confused` student may not know why something failed — lower probability; an `impatient` student may skip prerequisite reading — lower probability particularly for steps that depend on earlier state.
   - **`goal`**: a student evaluating for their team (`team-evaluation`) will abandon sooner than someone learning for personal interest; a `teaching-others` goal drives thoroughness.
   - **Prior runs** (`runs`, `successes`): a student who has completed the workshop before will have a meaningfully higher success probability on familiar steps.

4. **Calibration anchors** (reference points, not hard constraints — use these to sanity-check your derived probability and narrow the range for a specific student-step pair):
   - An `advanced`/`devops` student on an orientation or welcome step: ~98%.
   - A `beginner`/`no-coding` student on a hands-on CLI install step: ~45–55% (e.g., if the step has multiple commands and no validation feedback, lean toward 45%; if it has a clear success indicator, lean toward 55%).
   - Any student on a pure conceptual overview step: 75–95% depending on level (e.g., a `beginner` reading a concepts page with no actions: ~80%; an `advanced` student: ~93%).
   - Any student on a complex multi-action build or compile step: 40–90% depending on level and personality (e.g., a `confused`/`beginner` on a YAML compile step: ~40%; a `methodical`/`actions-user` on the same step: ~85%).
   - Any student on a final/wrap-up step (having reached this far): 88–97%.

5. **UI-preference adjustments**: Where a step requires terminal or CLI interaction and the student is `ui_preferred`:
   - Steps that are entirely CLI-based (install, auth, compile commands) are genuine blockers — apply a meaningful reduction.
   - Steps that can be done through the GitHub web editor (editing files, committing changes) are easier for UI-preferred students — apply a modest increase.
   - Reason about each step's actual UI/CLI split rather than applying a blanket rule.

After deriving the base probability from the above reasoning, apply these qualitative multipliers to reflect personality and goal traits — cap the final probability at 0.99:

- `methodical` personality: ×1.10 (follows steps carefully)
- `curious` personality: ×1.05 (engages more deeply)
- `skeptical` personality: ×0.90 (questions value, may abandon)
- `impatient` personality: ×0.85 (skips steps)
- `confused` personality: ×0.80 (needs more guidance)
- `teaching-others` goal: ×1.08 (thorough)
- `work-project` goal: ×1.05 (motivated)
- `team-evaluation` goal: ×0.95 (less patient)
- `personal-learning` goal: ×1.00 (neutral)

UI-preferred students who fail a step that requires terminal access should record the pain point explaining that no UI alternative exists for that specific action.

A student **fails at a step** if a random roll exceeds their adjusted probability. When a student fails a step, they stop — they do NOT attempt subsequent steps.

Use deterministic simulation: derive pseudo-random rolls from the student id, step number, and today's date (`${{ env.TODAY }}`). This makes results reproducible for the same day.

**Formula**: `roll = ((student_id * 7 + step_index * 13 + day_of_year * 17) % 100) / 100`
where `day_of_year` is the day number in the current year (1–366).

A step succeeds if `roll < adjusted_probability`.

### Collect pain points per student

For each student who fails at a step, note:
- Which step they failed on
- Any environment assumption mismatch from the simulator replay
- Likely reason (based on their profile):
  - **beginner + setup steps**: "No prior CLI experience — unfamiliar with terminal commands"
  - **beginner + install gh-aw**: "gh CLI extension install command confusing"
  - **impatient + any step**: "Skipped prerequisite reading, hit unexpected error"
  - **confused + workflow syntax**: "YAML frontmatter syntax unclear without more examples"
  - **github-basic + agentic concepts**: "Distinction between classic Actions and agentic workflows not obvious"
  - **skeptical + early steps**: "Value proposition not convincingly stated"
  - **actions-user + agentic intro**: "Kept mapping to classic Actions patterns, got confused by differences"
  - **advanced + basics**: "Introduction moves too slowly; want to jump to complex examples"
  - **enterprise-dev + setup steps**: "GHE/GHES configuration differs from github.com — self-hosted runner or proxy requirements not covered"
  - **enterprise-devops + install gh-aw**: "Org-owned Codespaces can use org-scoped tokens; `gh extension install github/gh-aw` may 403 and needs the install script fallback from installation instructions"
  - **program-manager + any step**: "Technical CLI steps feel out of scope; needs higher-level overview before hands-on configuration tasks"
  - **ui_preferred + any compile step**: "gh aw compile requires terminal — UI path users are unaware of syntax errors until the workflow runs and fails"
  - **vscode + CLI steps**: "VS Code user expects to stay in the editor UI — encourage running `gh aw` commands in the VS Code integrated terminal; suggest `gh copilot suggest` as a helper when a CLI command is unfamiliar"
  - **CCA + install gh-aw**: "GitHub Copilot Cloud Agent user has no terminal context — step 6 assumes CLI access that is entirely absent"
  - **codespaces + gh aw run**: "Codespaces auth token does not include `actions:write`, so `gh aw run` fails and learners need the GitHub Actions UI trigger path"
  - **CCA + local setup**: "GitHub Copilot Cloud Agent user expects fully managed environment; local install and auth steps are unexpected friction"
- Any student failing an `*install*` step: "gh aw install command requires gh CLI preinstalled — not clearly stated as prerequisite"
- Any student failing a workflow execution step because of missing credentials: "The workflow depends on repository-side Actions secrets or model access that are not configured yet; local Copilot CLI auth does not fix this"
- Any student failing a `*build*` step: "Full workflow source harder to understand without line-by-line annotation"

### Aggregate and analyse results

Compute:
- **Overall success rate** (% of students who complete all ${{ env.WORKSHOP_STEP_COUNT }} steps)
- **Per-step dropout rate** (% of students who fail at each step)
- **Top 5 dropout steps** (highest failure rates)
- **Success rate by technical level**
- **Success rate by personality**
- **Success rate by UI preference** (compare `ui_preferred: true` vs `ui_preferred: false`)
- **Most common pain points** (top 10, ranked by frequency)
- **Improvement opportunities** — specific, actionable suggestions for each top dropout step

### Update student profiles

Update `/tmp/gh-aw/cache-memory/profiles.json`:
- Increment `runs` by 1 for every student
- Increment `successes` by 1 for every student who completed all ${{ env.WORKSHOP_STEP_COUNT }} steps
- Write the updated JSON back to `/tmp/gh-aw/cache-memory/profiles.json`

### Read workshop files (if available)

If `${{ env.WORKSHOP_STEP_COUNT }}` > 0, use the available tools to read up to 3 of the workshop step files to ground your improvement suggestions in the actual content. Focus on the highest-dropout steps.

### Create a concise report issue

Use `create-issue` safe output with:

- `temporary_id`: `aw_workshop_simulation_parent` (safe-outputs requires the `aw_` prefix; this parent issue handle is used by child issues in step 8)
- **Title**: `Workshop Simulation Report — ${{ env.TODAY }} (Run #N)`
- where N is the total accumulated runs across all students divided by 38 (round to nearest integer).

Keep the report short and to the point. Keep critical findings visible; move verbose content into `<details>` sections for progressive disclosure.

**Body**: structure the issue as follows:

```markdown
### Overview
- Date: YYYY-MM-DD
- Students simulated: 38
- Workshop steps available: N/${{ env.WORKSHOP_STEP_COUNT }}
- Completion: N/38 (XX%)
- Highest-dropout step: Step N (XX%)

### Critical Findings
1. 2-4 bullets with the most important blockers and who they affect.

### Top Repairs to Prioritize
1. Repair summary 1
2. Repair summary 2
3. Repair summary 3

<details>
<summary>Dropout by step</summary>

Table with: step, dropouts, dropout rate, top reason.

</details>

<details>
<summary>Segment breakdowns</summary>

Technical level and personality completion tables.

</details>

<details>
<summary>Notable student journeys (3)</summary>

Briefly cover one surprising success, one unexpected dropout, and one content-gap case.

</details>
```

### Create actionable sub-issues for repairs

After creating the report issue, create **exactly 3 child issues** using `create-issue` where each issue:
- sets `parent: "aw_workshop_simulation_parent"` to link directly to the parent from step 7
- has a concise, imperative title starting with `Repair:` or `Improve:`
- describes one concrete workshop improvement only
- includes:
  - problem statement
  - proposed change
  - acceptance criteria checklist (2-4 items)
  - suggested owner profile (for example: `copilot coding agent` or `workshop maintainer`)

Choose repairs from the highest-dropout steps and keep each child issue independently actionable and assignable.
