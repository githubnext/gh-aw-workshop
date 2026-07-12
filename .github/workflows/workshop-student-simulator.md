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
    max: 4
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
          {"id":1,  "name":"Alex Chen",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":2,  "name":"Jamie Liu",       "level":"beginner",     "personality":"methodical",  "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":3,  "name":"Morgan Kim",      "level":"beginner",     "personality":"confused",    "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":4,  "name":"Riley Park",      "level":"beginner",     "personality":"impatient",   "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":5,  "name":"Skyler Nguyen",   "level":"beginner",     "personality":"skeptical",   "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":6,  "name":"Casey Wong",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"teaching-others",      "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
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
          {"id":28, "name":"Quinn Hall",      "level":"github-basic", "personality":"impatient",   "background":"no-coding",       "goal":"work-project",         "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":29, "name":"River Young",     "level":"beginner",     "personality":"methodical",  "background":"data-science",    "goal":"work-project",         "tool":"vscode",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":30, "name":"Sage King",       "level":"actions-user", "personality":"curious",     "background":"web-dev",         "goal":"teaching-others",      "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":31, "name":"Tatum Wright",    "level":"advanced",     "personality":"confused",    "background":"backend-dev",     "goal":"work-project",         "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":32, "name":"Uma Scott",       "level":"beginner",     "personality":"curious",     "background":"web-dev",         "goal":"team-evaluation",      "tool":"vscode",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":33, "name":"Vale Green",      "level":"github-basic", "personality":"methodical",  "background":"devops",          "goal":"personal-learning",    "tool":"cli",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":34, "name":"Alex Morgan",     "level":"advanced",     "personality":"skeptical",   "background":"enterprise-devops","goal":"work-project",         "tool":"cloud-agent",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":35, "name":"Blair Chen",      "level":"actions-user", "personality":"methodical",  "background":"enterprise-dev",  "goal":"team-evaluation",      "tool":"cloud-agent",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":36, "name":"Cameron Ross",    "level":"github-basic", "personality":"impatient",   "background":"enterprise-dev",  "goal":"work-project",         "tool":"cloud-agent",   "ui_preferred":false, "runs":0, "successes":0},
          {"id":37, "name":"Devon Patel",     "level":"github-basic", "personality":"confused",    "background":"program-manager", "goal":"team-evaluation",      "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":38, "name":"Ellis Wang",      "level":"beginner",     "personality":"curious",     "background":"program-manager", "goal":"team-evaluation",      "tool":"copilot-app",   "ui_preferred":true,  "runs":0, "successes":0}
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
          import os; open(os.environ['GITHUB_ENV'], 'a').write('WORKSHOP_STEP_COUNT=0\n')
          exit(0)

      def extract_title(f):
          for line in f.read_text().splitlines():
              if line.startswith('# '):
                  return line[2:].strip()
          return f.stem

      def sort_key(name):
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
- `level` — agentic technical level: `beginner`, `github-basic`, `actions-user`, `advanced`
- `personality` — `curious`, `methodical`, `impatient`, `confused`, `skeptical`
- `background` — `no-coding`, `web-dev`, `backend-dev`, `devops`, `data-science`, `enterprise-dev`, `enterprise-devops`, `program-manager`
- `goal` — `personal-learning`, `work-project`, `team-evaluation`, `teaching-others`
- `ui_preferred` — `true` if the student prefers using the GitHub web UI over the terminal; `false` if they prefer the CLI
- `tool` — preferred agentic tool entry point: `cli`, `vscode`, `copilot-app`, `cloud-agent`
- `runs` — number of prior simulation runs (accumulated across days)
- `successes` — number of prior successful completions

### Technical Level Definitions

| Level | Description |
|-------|-------------|
| `beginner` | No prior GitHub or coding experience |
| `github-basic` | Can clone/commit/push but never used GitHub Actions or AI tools |
| `actions-user` | Familiar with GitHub Actions YAML; new to agentic/AI workflows |
| `advanced` | Experienced developer or DevOps; has used LLM-based tools before |

### Background Definitions

| Background | Description |
|------------|-------------|
| `no-coding` | No software development background |
| `web-dev` | Frontend or full-stack web developer |
| `backend-dev` | Backend or systems developer |
| `devops` | DevOps engineer or SRE |
| `data-science` | Data scientist or ML engineer |
| `enterprise-dev` | Enterprise developer using GHE or GHES with self-hosted runners |
| `enterprise-devops` | Senior DevOps or platform engineer managing self-hosted runner fleets |
| `program-manager` | Program or product manager evaluating agentic workflows |

### Tool Definitions

| Tool | Description |
|------|-------------|
| `cli` | Uses the `gh aw` CLI extension directly in a terminal |
| `vscode` | Uses VS Code with the GitHub Copilot extension; should be encouraged to run `gh aw` commands in the VS Code integrated terminal and to use `gh copilot suggest` as a helper when stuck on CLI steps |
| `copilot-app` | Uses the GitHub Copilot web or mobile app / chat interface |
| `cloud-agent` | Uses the GitHub Copilot cloud coding agent (Copilot coding agent) inside GitHub.com |

---

## Simulation Task

### 1. Load student profiles

Read `/tmp/gh-aw/cache-memory/profiles.json`. You will update this file at the end with accumulated run counts.

### 2. Simulate each student through the workshop

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

#### Simulation Rules

**Success probability per step** is determined by the step's category, inferred from its filename and title. For each step in `curriculum.json`, classify it using the following pattern table and apply the corresponding base probabilities:

| Category | Filename pattern | beginner | github-basic | actions-user | advanced |
|----------|-----------------|---------|-------------|-------------|---------|
| Welcome / orientation | `*welcome*` | 95% | 98% | 99% | 99% |
| Prerequisites | `*prerequisite*` | 70% | 85% | 95% | 98% |
| Environment setup | `*setup-*` | 55% | 75% | 90% | 97% |
| Repository creation | `*create-*repo*` | 65% | 88% | 97% | 99% |
| Concepts / intro | `*intro*`, `*concepts*` | 75% | 85% | 82% | 88% |
| Tool install | `*install*` | 50% | 70% | 88% | 95% |
| Hands-on: first workflow | `*first-workflow*` | 45% | 65% | 80% | 92% |
| Hands-on: run / output | `*run*`, `*output*`, `*understand*` | 55% | 70% | 82% | 93% |
| Design step | `*design*` | 70% | 78% | 85% | 90% |
| Build step | `*build*` | 45% | 62% | 78% | 90% |
| Test / iterate | `*test*`, `*iterate*` | 50% | 65% | 80% | 92% |
| Schedule / automation | `*schedule*` | 55% | 70% | 85% | 94% |
| Advanced features | `*conditional*`, `*data-source*`, `*mcp*`, `*connect*` | 40% | 58% | 75% | 90% |
| Next steps / wrap-up | last step, `*next-step*` | 90% | 92% | 95% | 97% |
| Other (default) | anything else | 65% | 75% | 85% | 93% |

If a step's filename matches multiple categories, use the most specific match (longest pattern match). The "last step" rule applies to whichever step has the highest index in `curriculum.json`.

**Personality modifiers** (multiply the base probability):
- `curious`: ×1.05 (engages more deeply, higher completion)
- `methodical`: ×1.10 (follows steps carefully, highest completion)
- `impatient`: ×0.85 (skips steps, lower completion)
- `confused`: ×0.80 (needs more guidance, lowest completion)
- `skeptical`: ×0.90 (questions value, may abandon)

**Goal modifiers**:
- `personal-learning`: ×1.00 (neutral)
- `work-project`: ×1.05 (motivated to complete)
- `team-evaluation`: ×0.95 (less patient, evaluating quickly)
- `teaching-others`: ×1.08 (thorough, high completion)

**UI-preference modifiers** (apply when `ui_preferred` is `true`):

UI-preferred students work entirely through the GitHub web interface and avoid the terminal. Apply the following adjustments to their base probabilities for the matching steps (match by filename pattern):

| Step pattern | Adjustment | Reason |
|-------------|-----------|--------|
| `*create-*repo*` | ×1.15 | Using github.com/new is easier than `gh repo create` for non-coders |
| `*install*` | ×0.75 | `gh extension install` still requires a terminal — this is a genuine barrier |
| `*first-workflow*` | ×1.10 | GitHub web editor removes the need for `mkdir`/`touch` |
| `*build*` | ×1.05 | Web editor avoids local file management friction |
| `*test*`, `*iterate*` | ×1.10 | Committing via **Commit changes** is simpler than `git push` |
| `*schedule*` | ×1.08 | Web editor commit replaces `git add/commit/push` |

UI-preferred students who fail an `*install*` step should record the pain point: `"ui_preferred + install gh-aw: Extension install requires terminal — no UI alternative exists; workshop should recommend Codespace as a workaround"`.

A student **fails at a step** if a random roll exceeds their adjusted probability. When a student fails a step, they stop — they do NOT attempt subsequent steps.

Use deterministic simulation: derive pseudo-random rolls from the student id, step number, and today's date (`${{ env.TODAY }}`). This makes results reproducible for the same day.

**Formula**: `roll = ((student_id * 7 + step_index * 13 + day_of_year * 17) % 100) / 100`
where `day_of_year` is the day number in the current year (1–366).

A step succeeds if `roll < adjusted_probability`.

### 3. Collect pain points per student

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
  - **enterprise-devops + install gh-aw**: "Corporate network policies and self-hosted runner setup block standard `gh` CLI authentication flows"
  - **program-manager + any step**: "Technical CLI steps feel out of scope; needs higher-level overview before hands-on configuration tasks"
  - **ui_preferred + any compile step**: "gh aw compile requires terminal — UI path users are unaware of syntax errors until the workflow runs and fails"
  - **vscode + CLI steps**: "VS Code user expects to stay in the editor UI — encourage running `gh aw` commands in the VS Code integrated terminal; suggest `gh copilot suggest` as a helper when a CLI command is unfamiliar"
  - **copilot-app + install gh-aw**: "Copilot app user has no terminal context — step 6 assumes CLI access that is entirely absent"
  - **cloud-agent + local setup**: "Cloud agent user expects fully managed environment; local install and auth steps are unexpected friction"
- Any student failing an `*install*` step: "gh aw install command requires gh CLI preinstalled — not clearly stated as prerequisite"
- Any student failing a `*build*` step: "Full workflow source harder to understand without line-by-line annotation"

### 4. Aggregate and analyse results

Compute:
- **Overall success rate** (% of students who complete all ${{ env.WORKSHOP_STEP_COUNT }} steps)
- **Per-step dropout rate** (% of students who fail at each step)
- **Top 5 dropout steps** (highest failure rates)
- **Success rate by technical level**
- **Success rate by personality**
- **Success rate by UI preference** (compare `ui_preferred: true` vs `ui_preferred: false`)
- **Most common pain points** (top 10, ranked by frequency)
- **Improvement opportunities** — specific, actionable suggestions for each top dropout step

### 5. Update student profiles

Update `/tmp/gh-aw/cache-memory/profiles.json`:
- Increment `runs` by 1 for every student
- Increment `successes` by 1 for every student who completed all ${{ env.WORKSHOP_STEP_COUNT }} steps
- Write the updated JSON back to `/tmp/gh-aw/cache-memory/profiles.json`

### 6. Read workshop files (if available)

If `${{ env.WORKSHOP_STEP_COUNT }}` > 0, use the available tools to read up to 3 of the workshop step files to ground your improvement suggestions in the actual content. Focus on the highest-dropout steps.

### 7. Create a concise report issue

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

### 8. Create actionable sub-issues for repairs

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
