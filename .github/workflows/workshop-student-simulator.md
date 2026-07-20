---
emoji: 🔬
description: Daily Monte Carlo simulation of 46 students (1000 runs each) with various agentic technical levels attempting the "Learning GitHub Agentic Workflows" workshop. The curriculum is inferred from workshop markdown files at runtime. Produces a concise report issue with progressive disclosure and actionable sub-issues for improvements.
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
    expires: 1d
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
      echo "MONTE_CARLO_RUNS=1000" >> "$GITHUB_ENV"

  - name: Initialize student profiles if missing
    run: |
      PROFILES=/tmp/gh-aw/cache-memory/profiles.json
      NEEDS_INIT=true
      if [ -f "$PROFILES" ]; then
        if python3 << 'PYEOF'
      import json, sys
      try:
          with open('/tmp/gh-aw/cache-memory/profiles.json') as f:
              d = json.load(f)
          students = d.get('students', [])
          assert isinstance(students, list) and students and isinstance(students[0], dict) and 'runs' in students[0]
          sys.exit(0)
      except Exception:
          sys.exit(1)
      PYEOF
        then
          NEEDS_INIT=false
        else
          echo "Cached profiles are in an incompatible format. Reinitializing..."
        fi
      fi
      if [ "$NEEDS_INIT" = "true" ]; then
        cat > "$PROFILES" <<'EOF'
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
          {"id":38, "name":"Ellis Wang",      "level":"beginner",     "personality":"curious",     "background":"program-manager", "goal":"team-evaluation",      "tool":"CCA",   "ui_preferred":true,  "runs":0, "successes":0},
          {"id":39, "name":"Sam Torres",      "level":"beginner",     "personality":"curious",     "background":"no-coding",       "goal":"personal-learning",    "tool":"mobile", "ui_preferred":true,  "runs":0, "successes":0},
          {"id":40, "name":"Hayden Brooks",  "level":"github-basic", "personality":"impatient",   "background":"program-manager", "goal":"team-evaluation",      "tool":"mobile", "ui_preferred":true,  "runs":0, "successes":0},
          {"id":41, "name":"Rowan Diaz",     "level":"beginner",     "personality":"confused",    "background":"no-coding",       "goal":"work-project",         "tool":"mobile", "ui_preferred":true,  "runs":0, "successes":0},
          {"id":42, "name":"Jordan Ellis",   "level":"advanced",     "personality":"skeptical",   "background":"enterprise-devops","goal":"team-evaluation",      "tool":"cli",    "ui_preferred":false, "runs":0, "successes":0},
          {"id":43, "name":"Taylor Nguyen",  "level":"actions-user", "personality":"methodical",  "background":"enterprise-devops","goal":"team-evaluation",      "tool":"cli",    "ui_preferred":false, "runs":0, "successes":0},
          {"id":44, "name":"Avery Kim",      "level":"github-basic", "personality":"impatient",   "background":"enterprise-dev",  "goal":"work-project",         "tool":"vscode", "ui_preferred":false, "runs":0, "successes":0},
          {"id":45, "name":"Casey Jordan",   "level":"advanced",     "personality":"curious",     "background":"enterprise-devops","goal":"teaching-others",      "tool":"cli",    "ui_preferred":false, "runs":0, "successes":0},
          {"id":46, "name":"Morgan Dale",    "level":"actions-user", "personality":"confused",    "background":"enterprise-dev",  "goal":"work-project",         "tool":"CCA",    "ui_preferred":true,  "runs":0, "successes":0}
        ]
      }
      EOF
        echo "Initialized fresh student profiles (46 students)"
      else
        echo "Loaded existing student profiles from cache"
        cat "$PROFILES" | python3 -c "
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
      import json, pathlib, statistics, sys

      workshop = pathlib.Path('workshop')
      if not workshop.is_dir():
          data = {'main_steps': [], 'side_quests': [], 'step_count': 0}
          pathlib.Path('/tmp/gh-aw/agent/sim/data/curriculum.json').write_text(json.dumps(data))
          print("No workshop directory found")
          import os
          with open(os.environ['GITHUB_ENV'], 'a') as ef:
              ef.write('WORKSHOP_STEP_COUNT=0\n')
          exit(0)

      sys.path.insert(0, str(pathlib.Path('.github/skills/curriculum-quantitative-assessment').resolve()))
      from curriculum_assessment import extract_title, score_workshop_file, sorted_workshop_files

      all_files = sorted_workshop_files(workshop)
      main_steps = [f for f in all_files if not f.name.startswith('side-quest')]
      side_quests = [f for f in all_files if f.name.startswith('side-quest')]

      curriculum = []
      quality_metrics = []
      for i, f in enumerate(main_steps):
          scored = score_workshop_file(f)
          curriculum.append({'index': i, 'file': f.name, 'title': scored['title']})
          quality_metrics.append(scored)

      side_quest_list = []
      for f in side_quests:
          raw = f.read_text(encoding='utf-8')
          side_quest_list.append({'file': f.name, 'title': extract_title(raw, f.stem)})

      quality_mean = round(statistics.mean([m['overall_score'] for m in quality_metrics]), 2) if quality_metrics else 0.0
      lowest_quality = min(quality_metrics, key=lambda m: m['overall_score']) if quality_metrics else None

      data = {
          'main_steps': curriculum,
          'side_quests': side_quest_list,
          'step_count': len(curriculum),
      }
      pathlib.Path('/tmp/gh-aw/agent/sim/data/curriculum.json').write_text(json.dumps(data, indent=2))
      pathlib.Path('/tmp/gh-aw/agent/sim/data/curriculum-quality-metrics.json').write_text(
          json.dumps({
              'generated_from': 'workshop-student-simulator',
              'total_steps': len(quality_metrics),
              'mean_overall_score': quality_mean,
              'lowest_quality_step': lowest_quality,
              'steps': quality_metrics,
          }, indent=2)
      )

      import os
      env_file = os.environ['GITHUB_ENV']
      with open(env_file, 'a') as ef:
          ef.write(f"WORKSHOP_STEP_COUNT={len(curriculum)}\n")
      print(f"Workshop curriculum: {len(curriculum)} main steps, {len(side_quests)} side quests")
      print(f"Curriculum quality mean score: {quality_mean}")
      if lowest_quality:
          print(f"Lowest quality step: {lowest_quality['file']} ({lowest_quality['overall_score']}/10)")
      for entry in curriculum:
          print(f"  [{entry['index']}] {entry['file']}: {entry['title']}")
      PY

  - name: Run Monte Carlo simulation (${{ env.MONTE_CARLO_RUNS }} runs per student)
    run: |
      node .github/skills/micro-environment-simulator/simulator.js \
        --students /tmp/gh-aw/cache-memory/profiles.json \
        --journey .github/skills/micro-environment-simulator/workshop-student-journey.js \
        --curriculum /tmp/gh-aw/agent/sim/data/curriculum.json \
        --date "$TODAY" \
        --runs "$MONTE_CARLO_RUNS" \
        --out /tmp/gh-aw/agent/sim/data/monte-carlo-replay.json
      echo "Monte Carlo simulation complete"
      node -e "
        const d = require('/tmp/gh-aw/agent/sim/data/monte-carlo-replay.json');
        console.log('Overall success rate:', (d.aggregate.overallSuccessRate * 100).toFixed(1) + '%');
        const top = Object.entries(d.aggregate.dropoutRateByStep)
          .sort(([,a],[,b]) => b - a).slice(0, 3);
        console.log('Top dropout steps:', top.map(([s,r]) => s + ' (' + (r*100).toFixed(1) + '%)').join(', '));
      "
---

# Workshop Student Simulator

## Role

You are an expert UX researcher and instructional designer specialising in developer education. Your task is to **simulate 46 students with distinct profiles** attempting the "Learning GitHub Agentic Workflows" workshop and produce a detailed quality report.

---

## Context

The workshop teaches GitHub beginners how to create and run agentic workflows. The curriculum is determined at runtime from the workshop markdown files.

Read `/tmp/gh-aw/agent/sim/data/curriculum.json`. It contains:
- `main_steps`: ordered array of `{index, file, title}` for each main workshop step (excludes `README.md` and side-quest files)
- `side_quests`: array of `{file, title}` for optional supplementary steps
- `step_count`: total number of main steps

Use the `main_steps` array as the definitive curriculum for this simulation. Each element's `file` field is the filename in `workshop/`, and `title` is the heading extracted from that file. Do not rely on any previously known or hardcoded list of steps.

Read `/tmp/gh-aw/agent/sim/data/curriculum-quality-metrics.json` for step-level curriculum quality metrics, including `overall_score` and per-dimension rubric scores (`cognitive_load`, `readability`, `active_learning`, `checkpoint_quality`, `scaffolding`, `style_compliance`).
These metrics come from the shared rubric in `.github/skills/curriculum-quantitative-assessment/curriculum_assessment.py`.
Treat that rubric as the educational score source of truth when you recommend repairs, and use this data to ground dropout analysis and repair recommendations.

The workshop content available today: **${{ env.WORKSHOP_STEP_COUNT }} main steps** (plus side quests listed in `curriculum.json`).

---

## Student Profiles (46 students)

Read `/tmp/gh-aw/cache-memory/profiles.json` to load the student profiles. Each student has:
- `id` — unique identifier (1–46)
- `name` — persona name
- `level` — agentic technical level: `beginner` (no prior GitHub/coding) | `github-basic` (can clone/commit/push; no Actions or AI tools) | `actions-user` (familiar with Actions YAML; new to agentic/AI workflows) | `advanced` (experienced developer/DevOps engineer with LLM tooling experience)
- `personality` — `curious` | `methodical` | `impatient` | `confused` | `skeptical`
- `background` — role background: `no-coding` (no software development background) | `web-dev` (frontend/full-stack web developer) | `backend-dev` (backend/systems developer) | `devops` (DevOps engineer/SRE) | `data-science` (data scientist/ML engineer) | `enterprise-dev` (enterprise developer using GHE/GHES with self-hosted runners) | `enterprise-devops` (senior DevOps/platform engineer managing self-hosted runner fleets) | `program-manager` (program/product manager evaluating agentic workflows)
- `goal` — `personal-learning` | `work-project` | `team-evaluation` | `teaching-others`
- `ui_preferred` — `true` if the student prefers using the GitHub web UI over the terminal; `false` if they prefer the CLI
- `tool` — preferred agentic tool entry point: `cli` (uses the `gh aw` CLI extension in a terminal) | `vscode` (uses VS Code with the GitHub Copilot extension) | `CCA` (uses GitHub Copilot Cloud Agent via web/browser chat or cloud coding agent) | `mobile` (uses the GitHub Mobile app on iOS or Android to spawn agent sessions and review pull requests; no coding support)
- `runs` — number of prior simulation runs (accumulated across days)
- `successes` — number of prior successful completions

---

## Simulation Task

### Simulate each student through the workshop

For **each of the 46 students**, simulate their experience step-by-step using the following rules:

First read the baseline Monte Carlo output that was already written to `/tmp/gh-aw/agent/sim/data/monte-carlo-replay.json` to identify the highest dropout or highest-risk steps. Then read both `curriculum.json` and `curriculum-quality-metrics.json`. For each high-risk step, inspect that step and the preceding activities that produce its required state before writing `/tmp/gh-aw/agent/sim/data/agent-step-insights.json`. For example, inspect the learner's Step 7 authoring path (Terminal, GitHub UI, or GitHub Copilot) and the shared Step 7d model-access activity before adjusting Step 8.

Use this JSON shape:

```json
{
  "stepInsightsById": {
    "<step-id>": {
      "summary": "Short explanation of the content-specific risk or support you inferred.",
      "bias": -0.04,
      "signalAdjustments": {
        "complexity": -0.02,
        "terminalDemand": -0.05,
        "browserSupport": 0.04,
        "authDemand": -0.03,
        "troubleshootingSupport": 0.02,
        "conceptDemand": -0.02,
        "enterpriseDemand": -0.03
      },
      "pathAdjustments": {
        "browser": 0.06,
        "cli": -0.05,
        "codespaces": -0.03,
        "local": 0.02,
        "mobile": -0.08,
        "uiPreferred": 0.03,
        "enterprise": -0.04
      },
      "riskTags": ["browser-first", "auth-friction"]
    }
  }
}
```

- Omit steps where you have no meaningful adjustment.
- Use positive numbers to increase success probability and negative numbers to decrease it.
- Base these adjustments on the actual wording, path structure, fallbacks, and recovery guidance in the files you inspect — not only on the numeric signals already present in the simulator.

Then rerun the simulator yourself so those agent-derived insights are incorporated into the probabilities:

```bash
node .github/skills/micro-environment-simulator/simulator.js \
  --students /tmp/gh-aw/cache-memory/profiles.json \
  --journey .github/skills/micro-environment-simulator/workshop-student-journey.js \
  --curriculum /tmp/gh-aw/agent/sim/data/curriculum.json \
  --agent-insights /tmp/gh-aw/agent/sim/data/agent-step-insights.json \
  --date "$TODAY" \
  --runs "$MONTE_CARLO_RUNS" \
  --out /tmp/gh-aw/agent/sim/data/monte-carlo-replay.json
```

The Monte Carlo simulation written to `/tmp/gh-aw/agent/sim/data/monte-carlo-replay.json` should therefore reflect both the simulator's constraint model and your content-aware adjustments:

```json
{
  "mode": "monte-carlo",
  "runs": ${{ env.MONTE_CARLO_RUNS }},
  "total": 46,
  "stepContentById": {
    "<step-id>": {
      "files": [{"file": "<workshop-file>", "title": "<title>"}],
      "complexity": <0.0–1.0>,
      "terminalDemand": <0.0–1.0>,
      "browserSupport": <0.0–1.0>,
      "authDemand": <0.0–1.0>,
      "troubleshootingSupport": <0.0–1.0>,
      "agentInsight": {
        "summary": "<optional content-aware rationale>",
        "riskTags": ["<tag>", "..."]
      }
    }
  },
  "monteCarlo": [
    {
      "studentId": 1,
      "name": "Alex Chen",
      "runs": ${{ env.MONTE_CARLO_RUNS }},
      "successes": <N>,
      "successRate": <0.0–1.0>,
      "failuresByStep": { "<step-id>": <count>, ... },
      "failureCategoriesByStep": {
        "<step-id>": { "<failure-category>": <count>, ... }
      },
      "mostCommonFailureStep": "<step-id> | null"
    },
    ...
  ],
  "aggregate": {
    "overallSuccessRate": <0.0–1.0>,
    "dropoutRateByStep": { "<step-id>": <rate 0.0–1.0>, ... },
    "failureCategoriesByStep": {
      "<step-id>": { "<failure-category>": <count>, ... }
    }
  }
}
```

Use `monteCarlo[*].successRate` as the **statistical success probability** for each student. Use `aggregate.dropoutRateByStep` to identify the highest-dropout steps across the entire cohort. Use `stepContentById` — including any `agentInsight` you added before rerunning the simulator — to explain how the actual workshop content changes those probabilities from step to step. Do not reuse the same generic explanation for every learner.

Then, for each student, use the environment assumptions modelled by the simulator to explain **why** their success rate is what it is. Read the student's Monte Carlo entry (`failuresByStep`, `mostCommonFailureStep`), inspect the matching `stepContentById[mostCommonFailureStep]`, and cross-reference both with the student profile to produce per-student pain points:

- Which step failed most often across the ${{ env.MONTE_CARLO_RUNS }} runs
- The likely environment or profile reason (OS, tool, auth, level, personality)
- The likely content reason (for example: terminal-heavy instructions, browser-friendly fallback, auth-heavy setup, or high conceptual density)
- Treat browser-driven workflow execution steps differently from local CLI steps: triggering a workflow from the **Actions** tab should not require local Copilot credentials. Only flag secret-related problems at that stage when `aggregate.failureCategoriesByStep` reports that exact runtime failure after the learner completed the preceding model-access activity.
- Do not infer a failure reason from lexical signals such as `authDemand`. The baseline first workflow uses GitHub Copilot; do not introduce optional engines or credentials from later side quests into its failure analysis. Use `failureCategoriesByStep` as the source of truth for the top reason.

#### Qualitative depth for top-failure students

For students whose `successRate` < 0.50 (the most at-risk half), apply additional qualitative reasoning from the student profile to enrich the pain-point description:

- **`level`** vs. assumed knowledge
- **`background`** vs. step domain
- **`tool`** and **`ui_preferred`** vs. step tooling (if a step requires running `gh aw` in a terminal and the student is `ui_preferred` or uses `CCA` or `mobile`, note that no UI alternative exists)
- **`personality`**: `methodical` reads carefully; `confused` needs more guidance; `impatient` skips steps
- **`goal`**: `team-evaluation` abandons sooner; `teaching-others` is thorough
- **Prior runs** (`runs`, `successes`): higher prior completions correlate with better outcomes

### Collect pain points per student

For each student whose `successRate` < 1.0, note:
- Which step failed most often across the ${{ env.MONTE_CARLO_RUNS }} Monte Carlo runs (`mostCommonFailureStep`)
- The failure count per step from `failuresByStep`
- Likely reason (based on profile **and** content): reason from the student's `level`, `background`, `personality`, `tool`, and `ui_preferred` in relation to `stepContentById[step]` and the step's actual content and demands. Do **not** match against a fixed template. Key edge cases to flag explicitly: `ui_preferred: true` students hitting terminal-only steps (no UI alternative exists); Codespaces learners choosing the optional CLI trigger path and hitting `actions:write` friction; enterprise/proxy environments adding friction to setup steps.

### Aggregate and analyse results

Use the pre-computed values from `monte-carlo-replay.json` as the primary data source:

- **Overall success rate** — read from `aggregate.overallSuccessRate`
- **Per-step dropout rate** — read from `aggregate.dropoutRateByStep`; sort descending to find the worst steps
- **Top 5 dropout steps** — highest values in `aggregate.dropoutRateByStep`
- **Success rate by technical level** — group `monteCarlo` entries by student level and average `successRate`
- **Success rate by personality** — group `monteCarlo` entries by student personality and average `successRate`
- **Success rate by UI preference** — compare average `successRate` for students where `ui_preferred: true` vs `ui_preferred: false`
- **Most common pain points** (top 10, ranked by total failure count across all students from `failuresByStep`; use `aggregate.failureCategoriesByStep` for the exact causes)
- **Curriculum quality hotspots** — correlate top-dropout steps with low `overall_score` and weak rubric dimensions from `curriculum-quality-metrics.json`
- **Learning KPI index** — compute the cohort-wide mean of the three learning-outcome dimensions from `curriculum-quality-metrics.json` across all main steps: `active_learning`, `checkpoint_quality`, and `scaffolding`. Report each as a standalone mean score (0–10) and their weighted average using the same weights as the shared rubric: `(2.0 × active_learning + 2.0 × checkpoint_quality + 1.5 × scaffolding) / 5.5`. This index measures whether learners who stay in the workshop are actually building skills, independent of whether others drop out.
- **Learning-vs-dropout trade-off** — for each top-dropout step, classify the primary failure mode as either *access barrier* (environment setup, tooling, auth) or *learning barrier* (conceptual density, insufficient scaffolding, weak checkpoints). Access barriers can often be reduced (for example by adding alternative paths, clearer setup instructions, or better error recovery guidance) without touching learning KPIs. Learning barriers must be addressed by improving scaffolding, adding intermediate checkpoints, or restructuring concept introduction — not by removing complexity or reducing cognitive demand.
- **Improvement opportunities** — specific, actionable suggestions for each top dropout step, prioritised by their expected impact on the learning KPI index as well as on the completion rate
- **Learning-quality-safe repairs** — each recommendation must:
  - Explicitly name the rubric dimension(s) it targets
  - Preserve or improve the affected step's `overall_score`
  - Not reduce the cohort learning KPI index (`active_learning`, `checkpoint_quality`, or `scaffolding` means) relative to their current values
  - Accept that some students will drop out: do **not** lower the cognitive bar or remove practice just to improve headline completion numbers. A well-scaffolded step that challenging students find hard is not itself a bug. Only recommend simplification when the step has a genuine instructional gap (low `scaffolding` or `active_learning` score) rather than appropriate challenge.

### Update student profiles

Update `/tmp/gh-aw/cache-memory/profiles.json`:
- Increment `runs` by **${{ env.MONTE_CARLO_RUNS }}** for every student (one Monte Carlo batch = ${{ env.MONTE_CARLO_RUNS }} runs)
- Increment `successes` by the student's `successes` count from `monte-carlo-replay.json` (i.e., the number of successful runs in the ${{ env.MONTE_CARLO_RUNS }}-run batch)
- Write the updated JSON back to `/tmp/gh-aw/cache-memory/profiles.json`

### Read workshop files (if available)

If `${{ env.WORKSHOP_STEP_COUNT }}` > 0, use the available tools to read up to 3 of the workshop step files to ground both your `agent-step-insights.json` adjustments and your improvement suggestions in the actual content. Focus on the highest-dropout or highest-risk steps.

### Create a concise report issue

Use `create-issue` safe output with:

- `temporary_id`: `aw_sim_parent` (safe-outputs requires the `aw_` prefix; this parent issue handle is used by child issues in step 8)
- **Title**: `Workshop Simulation Report — ${{ env.TODAY }} (Run #N, ${{ env.MONTE_CARLO_RUNS }}×Monte Carlo)`
- where N is the total accumulated runs across all students divided by 46 (round to nearest integer).

Keep the report short and to the point. Keep critical findings visible; move verbose content into `<details>` sections for progressive disclosure.

**Body**: structure the issue as follows:

```markdown
### Overview
- Date: YYYY-MM-DD
- Students simulated: 46 × ${{ env.MONTE_CARLO_RUNS }} Monte Carlo runs
- Workshop steps available: N/${{ env.WORKSHOP_STEP_COUNT }}
- Overall success rate: XX% (from `aggregate.overallSuccessRate`)
- Highest-dropout step: <step-id> (XX% dropout rate)
- Lowest curriculum quality step: `<file>` (overall score X.X/10)
- Learning KPI index: X.X/10 (active_learning X.X · checkpoint_quality X.X · scaffolding X.X)

### Critical Findings
1. 2-4 bullets with the most important blockers and who they affect.
2. Include one bullet on the learning quality health: whether the learning KPI index indicates learners who stay in the workshop are building skills effectively.

### Top Repairs to Prioritize
Note: some student dropout is expected and acceptable. Repairs must maintain or improve the learning KPI index — do not lower the cognitive bar or remove practice to chase headline completion numbers.

1. Repair summary 1 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)
2. Repair summary 2 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)
3. Repair summary 3 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)

<details>
<summary>Dropout by step</summary>

Table with: step, dropouts, dropout rate, failure mode (access barrier | learning barrier), top reason. The top reason must be the highest-count category in `aggregate.failureCategoriesByStep[step]`, translated into plain language without changing its meaning.

</details>

<details>
<summary>Learning quality KPIs</summary>

Table with: step file, overall score, active_learning score, checkpoint_quality score, scaffolding score, learning KPI index, repair priority.

Include a row for the cohort mean at the bottom.

</details>

<details>
<summary>Curriculum quality metrics</summary>

Table with: step file, overall score, lowest rubric dimension, recommended repair focus.

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
- sets `parent: "aw_sim_parent"` to link directly to the parent from step 7
- has a concise, imperative title starting with `Repair:` or `Improve:`
- describes one concrete workshop improvement only
- ties the change back to the current quantitative rubric scores for that step
- includes:
  - problem statement
  - proposed change
  - failure mode classification: *access barrier* or *learning barrier*
  - quantitative guardrail: current `overall_score`, weakest rubric dimension(s), and current learning KPI index values (`active_learning`, `checkpoint_quality`, `scaffolding`) for the affected step — including both the `overall_score` and individual learning KPI dimensions — with an explanation of why the proposed change should maintain or raise all of these scores
  - acceptance criteria checklist (2-4 items) that includes all three of the following as separate, independently verifiable items:
    - the shared curriculum quantitative assessment `overall_score` for the affected step stays flat or improves after the change
    - the step's learning KPI index (`(2.0 × active_learning + 2.0 × checkpoint_quality + 1.5 × scaffolding) / 5.5`) stays flat or improves — confirming that students who remain in the workshop are still building skills effectively
    - hands-on practice, checkpoints, and scaffolding are preserved or strengthened (not removed or weakened to improve headline completion numbers)
  - suggested owner profile (for example: `copilot coding agent` or `workshop maintainer`)

Choose repairs from the highest-dropout steps and keep each child issue independently actionable and assignable.
