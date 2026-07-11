---
emoji: 🔬
description: Daily simulation of 38 students with various agentic technical levels attempting the "Learning GitHub Agentic Workflows" workshop. Produces a concise report issue with progressive disclosure and actionable sub-issues for improvements.
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
        "version": 1,
        "students": [
          {"id":1,  "name":"Alex Chen",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":2,  "name":"Jamie Liu",       "level":"beginner",     "personality":"methodical",  "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":3,  "name":"Morgan Kim",      "level":"beginner",     "personality":"confused",    "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":4,  "name":"Riley Park",      "level":"beginner",     "personality":"impatient",   "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":5,  "name":"Skyler Nguyen",   "level":"beginner",     "personality":"skeptical",   "background":"no-coding",       "goal":"personal-learning",    "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":6,  "name":"Casey Wong",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"teaching-others",      "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":7,  "name":"Drew Tanaka",     "level":"github-basic", "personality":"methodical",  "background":"web-dev",         "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":8,  "name":"Avery Singh",     "level":"github-basic", "personality":"curious",     "background":"web-dev",         "goal":"work-project",         "tool":"vscode",        "runs":0, "successes":0},
          {"id":9,  "name":"Jordan Martinez", "level":"github-basic", "personality":"impatient",   "background":"web-dev",         "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":10, "name":"Quinn Lopez",     "level":"github-basic", "personality":"confused",    "background":"web-dev",         "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":11, "name":"Reece Thompson",  "level":"github-basic", "personality":"skeptical",   "background":"backend-dev",     "goal":"team-evaluation",      "tool":"cli",           "runs":0, "successes":0},
          {"id":12, "name":"Sam Patel",       "level":"github-basic", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":13, "name":"Blake Rivera",    "level":"github-basic", "personality":"curious",     "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":14, "name":"Chris Davis",     "level":"github-basic", "personality":"confused",    "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":15, "name":"Dana Wilson",     "level":"actions-user", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":16, "name":"Eli Brown",       "level":"actions-user", "personality":"curious",     "background":"devops",          "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":17, "name":"Frankie Moore",   "level":"actions-user", "personality":"impatient",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",           "runs":0, "successes":0},
          {"id":18, "name":"Gio Jackson",     "level":"actions-user", "personality":"skeptical",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",           "runs":0, "successes":0},
          {"id":19, "name":"Harper Lee",      "level":"actions-user", "personality":"methodical",  "background":"backend-dev",     "goal":"work-project",         "tool":"vscode",        "runs":0, "successes":0},
          {"id":20, "name":"Indigo Taylor",   "level":"actions-user", "personality":"curious",     "background":"backend-dev",     "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":21, "name":"Jesse Anderson",  "level":"actions-user", "personality":"confused",    "background":"web-dev",         "goal":"work-project",         "tool":"vscode",        "runs":0, "successes":0},
          {"id":22, "name":"Kai White",       "level":"actions-user", "personality":"methodical",  "background":"devops",          "goal":"team-evaluation",      "tool":"cli",           "runs":0, "successes":0},
          {"id":23, "name":"Lane Harris",     "level":"advanced",     "personality":"skeptical",   "background":"devops",          "goal":"team-evaluation",      "tool":"cli",           "runs":0, "successes":0},
          {"id":24, "name":"Max Clark",       "level":"advanced",     "personality":"impatient",   "background":"backend-dev",     "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":25, "name":"Nova Robinson",   "level":"advanced",     "personality":"methodical",  "background":"devops",          "goal":"teaching-others",      "tool":"cli",           "runs":0, "successes":0},
          {"id":26, "name":"Ocean Lewis",     "level":"advanced",     "personality":"curious",     "background":"data-science",    "goal":"personal-learning",    "tool":"vscode",        "runs":0, "successes":0},
          {"id":27, "name":"Piper Walker",    "level":"advanced",     "personality":"skeptical",   "background":"web-dev",         "goal":"team-evaluation",      "tool":"vscode",        "runs":0, "successes":0},
          {"id":28, "name":"Quinn Hall",      "level":"github-basic", "personality":"impatient",   "background":"no-coding",       "goal":"work-project",         "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":29, "name":"River Young",     "level":"beginner",     "personality":"methodical",  "background":"data-science",    "goal":"work-project",         "tool":"vscode",        "runs":0, "successes":0},
          {"id":30, "name":"Sage King",       "level":"actions-user", "personality":"curious",     "background":"web-dev",         "goal":"teaching-others",      "tool":"vscode",        "runs":0, "successes":0},
          {"id":31, "name":"Tatum Wright",    "level":"advanced",     "personality":"confused",    "background":"backend-dev",     "goal":"work-project",         "tool":"cli",           "runs":0, "successes":0},
          {"id":32, "name":"Uma Scott",       "level":"beginner",     "personality":"curious",     "background":"web-dev",         "goal":"team-evaluation",      "tool":"vscode",        "runs":0, "successes":0},
          {"id":33, "name":"Vale Green",      "level":"github-basic", "personality":"methodical",  "background":"devops",          "goal":"personal-learning",    "tool":"cli",           "runs":0, "successes":0},
          {"id":34, "name":"Alex Morgan",     "level":"advanced",     "personality":"skeptical",   "background":"enterprise-devops","goal":"work-project",         "tool":"cloud-agent",   "runs":0, "successes":0},
          {"id":35, "name":"Blair Chen",      "level":"actions-user", "personality":"methodical",  "background":"enterprise-dev",  "goal":"team-evaluation",      "tool":"cloud-agent",   "runs":0, "successes":0},
          {"id":36, "name":"Cameron Ross",    "level":"github-basic", "personality":"impatient",   "background":"enterprise-dev",  "goal":"work-project",         "tool":"cloud-agent",   "runs":0, "successes":0},
          {"id":37, "name":"Devon Patel",     "level":"github-basic", "personality":"confused",    "background":"program-manager", "goal":"team-evaluation",      "tool":"copilot-app",   "runs":0, "successes":0},
          {"id":38, "name":"Ellis Wang",      "level":"beginner",     "personality":"curious",     "background":"program-manager", "goal":"team-evaluation",      "tool":"copilot-app",   "runs":0, "successes":0}
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
      # Read available workshop steps
      if [ -d workshop ]; then
        step_files=$(find workshop -name '*.md' | sort | tr '\n' ',' | sed 's/,$//')
        step_count=$(find workshop -name '*.md' | wc -l | tr -d ' ')
      else
        step_files=""
        step_count=0
      fi
      echo "WORKSHOP_STEP_COUNT=$step_count" >> "$GITHUB_ENV"
      echo "WORKSHOP_STEP_FILES=$step_files" >> "$GITHUB_ENV"
      echo "Workshop has $step_count step files available: $step_files"
---

# Workshop Student Simulator

## Role

You are an expert UX researcher and instructional designer specialising in developer education. Your task is to **simulate 38 students with distinct profiles** attempting the "Learning GitHub Agentic Workflows" workshop and produce a detailed quality report.

---

## Context

The workshop teaches GitHub beginners how to create and run agentic workflows. It follows a 15-step curriculum:

| # | Step | Title |
|---|------|-------|
| 0 | `00-welcome.md` | Welcome — What We'll Build |
| 1 | `01-prerequisites.md` | What You Need Before We Start |
| 2a | `02a-setup-codespace.md` | Set Up a Codespace |
| 2b | `02b-setup-local.md` | Set Up Your Local Terminal |
| 3 | `03-create-your-repo.md` | Create Your Practice Repository |
| 4 | `04-github-actions-intro.md` | What Are GitHub Actions? |
| 5 | `05-agentic-workflows-intro.md` | What Are Agentic Workflows? |
| 6 | `06-install-gh-aw.md` | Install the gh-aw CLI Extension |
| 7 | `07-your-first-workflow.md` | Write Your First Agentic Workflow |
| 8 | `08-run-your-workflow.md` | Run and Watch Your Workflow |
| 9 | `09-understand-output.md` | Reading Workflow Output |
| 10 | `10-design-daily-status.md` | Design: Your Daily Repo Status Report |
| 11 | `11-build-daily-status.md` | Build: Daily Repo Status Workflow |
| 12 | `12-test-and-iterate.md` | Test and Improve Your Workflow |
| 13 | `13-schedule-it.md` | Schedule It to Run Every Day |
| 14 | `14-next-steps.md` | What's Next? Keep Exploring |

The workshop content available today: **${{ env.WORKSHOP_STEP_COUNT }} step files** at `${{ env.WORKSHOP_STEP_FILES }}`.

---

## Student Profiles (38 students)

Read `/tmp/gh-aw/cache-memory/profiles.json` to load the student profiles. Each student has:
- `id` — unique identifier (1–38)
- `name` — persona name
- `level` — agentic technical level: `beginner`, `github-basic`, `actions-user`, `advanced`
- `personality` — `curious`, `methodical`, `impatient`, `confused`, `skeptical`
- `background` — `no-coding`, `web-dev`, `backend-dev`, `devops`, `data-science`, `enterprise-dev`, `enterprise-devops`, `program-manager`
- `goal` — `personal-learning`, `work-project`, `team-evaluation`, `teaching-others`
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

**Success probability per step** depends on technical level:

| Step | beginner | github-basic | actions-user | advanced |
|------|----------|--------------|--------------|----------|
| 0 Welcome | 95% | 98% | 99% | 99% |
| 1 Prerequisites | 70% | 85% | 95% | 98% |
| 2a/2b Setup | 55% | 75% | 90% | 97% |
| 3 Create Repo | 65% | 88% | 97% | 99% |
| 4 Actions Intro | 80% | 90% | 85% | 90% |
| 5 Agentic Intro | 75% | 85% | 80% | 88% |
| 6 Install gh-aw | 50% | 70% | 88% | 95% |
| 7 First Workflow | 45% | 65% | 80% | 92% |
| 8 Run Workflow | 50% | 68% | 82% | 94% |
| 9 Understand Output | 60% | 72% | 83% | 93% |
| 10 Design | 70% | 78% | 85% | 90% |
| 11 Build | 45% | 62% | 78% | 90% |
| 12 Test & Iterate | 50% | 65% | 80% | 92% |
| 13 Schedule | 55% | 70% | 85% | 94% |
| 14 Next Steps | 90% | 92% | 95% | 97% |

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
  - **vscode + CLI steps**: "VS Code user expects to stay in the editor UI — encourage running `gh aw` commands in the VS Code integrated terminal; suggest `gh copilot suggest` as a helper when a CLI command is unfamiliar"
  - **copilot-app + install gh-aw**: "Copilot app user has no terminal context — step 6 assumes CLI access that is entirely absent"
  - **cloud-agent + local setup**: "Cloud agent user expects fully managed environment; local install and auth steps are unexpected friction"
  - Any student failing step 6: "gh aw install command requires gh CLI preinstalled — not clearly stated as prerequisite"
  - Any student failing step 11: "Full workflow source harder to understand without line-by-line annotation"

### 4. Aggregate and analyse results

Compute:
- **Overall success rate** (% of students who complete all 15 steps)
- **Per-step dropout rate** (% of students who fail at each step)
- **Top 5 dropout steps** (highest failure rates)
- **Success rate by technical level**
- **Success rate by personality**
- **Most common pain points** (top 10, ranked by frequency)
- **Improvement opportunities** — specific, actionable suggestions for each top dropout step

### 5. Update student profiles

Update `/tmp/gh-aw/cache-memory/profiles.json`:
- Increment `runs` by 1 for every student
- Increment `successes` by 1 for every student who completed all 15 steps
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
- Workshop steps available: N/15
- Completion: N/38 (XX%)
- Highest-dropout step: Step N (XX%)

### Critical Findings
1. 2-4 bullets with the most important blockers and who they affect.

### Top Repairs to Prioritize
1. Repair summary 1
2. Repair summary 2
3. Repair summary 3

<details>
<summary>Dropout by step (0-14)</summary>

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
