---
emoji: 🔬
description: Daily Monte Carlo simulation of a configurable synthetic learner population attempting the "Learning GitHub Agentic Workflows" workshop. The population assumptions and curriculum are loaded at runtime. Produces a concise report issue with progressive disclosure and actionable sub-issues for improvements.
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
      MONTE_CARLO_RUNS=$(node -p "require('./.github/skills/micro-environment-simulator/workshop-student-population.json').monteCarloRuns")
      echo "MONTE_CARLO_RUNS=$MONTE_CARLO_RUNS" >> "$GITHUB_ENV"

  - name: Initialize student profiles if missing
    run: |
      PROFILES=/tmp/gh-aw/cache-memory/profiles.json
      MODEL=.github/skills/micro-environment-simulator/workshop-student-population.json
      NEEDS_INIT=true
      if [ -f "$PROFILES" ]; then
        if node - "$PROFILES" "$MODEL" <<'NODE'
      const fs = require("node:fs");
      try {
        const profiles = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
        const model = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
        const students = profiles.students;
        const valid =
          profiles.version === 4 &&
          profiles.population_model_version === model.modelVersion &&
          Array.isArray(students) &&
          students.length === model.cohortSize &&
          students.every((student) => Number.isFinite(student.runs) && Number.isFinite(student.successes));
        process.exit(valid ? 0 : 1);
      } catch {
        process.exit(1);
      }
      NODE
        then
          NEEDS_INIT=false
        else
          echo "Cached profiles do not match the current population model. Reinitializing..."
        fi
      fi
      if [ "$NEEDS_INIT" = "true" ]; then
        node .github/skills/micro-environment-simulator/simulator.js \
          --generate-population \
          --population-model "$MODEL" \
          --seed workshop-student-cohort \
          --out "$PROFILES"
        echo "Initialized synthetic student profiles from $MODEL"
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
      import json, pathlib, re, statistics, sys

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

      def lesson_number(filename):
          match = re.search(r'(?:^|-)0*(\d{1,2})(?:[a-z])?(?=[-.]|$)', filename)
          return int(match.group(1)) if match else None

      def part_label(filename):
          lesson = lesson_number(filename)
          if lesson is None:
              return 'other'
          return 'part1' if lesson <= 14 else 'part2'

      def summarize_scores(rows):
          if not rows:
              return {'files': 0, 'mean_score': None, 'stdev_score': None}
          scores = [row['overall_score'] for row in rows]
          return {
              'files': len(rows),
              'mean_score': round(statistics.mean(scores), 2),
              'stdev_score': round(statistics.stdev(scores) if len(scores) > 1 else 0, 2),
          }

      all_files = sorted_workshop_files(workshop)
      main_steps = [f for f in all_files if not f.name.startswith('side-quest')]
      side_quests = [f for f in all_files if f.name.startswith('side-quest')]

      curriculum = []
      quality_metrics = []
      for i, f in enumerate(main_steps):
          scored = score_workshop_file(f)
          part = part_label(f.name)
          scored['part'] = part
          curriculum.append({
              'index': i,
              'file': f.name,
              'title': scored['title'],
              'part': part,
              'is_learning_page': scored.get('is_learning_page', True),
          })
          quality_metrics.append(scored)

      side_quest_list = []
      for f in side_quests:
          raw = f.read_text(encoding='utf-8')
          side_quest_list.append({'file': f.name, 'title': extract_title(raw, f.stem)})

      quality_mean = round(statistics.mean([m['overall_score'] for m in quality_metrics]), 2) if quality_metrics else 0.0
      lowest_quality = min(quality_metrics, key=lambda m: m['overall_score']) if quality_metrics else None
      part1_metrics = [m for m in quality_metrics if m.get('part') == 'part1']
      part2_metrics = [m for m in quality_metrics if m.get('part') == 'part2']
      other_metrics = [m for m in quality_metrics if m.get('part') == 'other']

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
              'part1': summarize_scores(part1_metrics),
              'part2': summarize_scores(part2_metrics),
              'other': summarize_scores(other_metrics),
              'lowest_quality_step': lowest_quality,
              'steps': quality_metrics,
          }, indent=2)
      )

      import os
      env_file = os.environ['GITHUB_ENV']
      with open(env_file, 'a') as ef:
          ef.write(f"WORKSHOP_STEP_COUNT={len(curriculum)}\n")
      non_learning_count = sum(1 for m in quality_metrics if not m.get('is_learning_page', True))
      print(f"Workshop curriculum: {len(curriculum)} main steps, {len(side_quests)} side quests ({non_learning_count} dispatcher pages scored for clarity/simplicity)")
      print(f"Curriculum quality mean score: {quality_mean}")
      print(f"Curriculum parts: part1={len(part1_metrics)}, part2={len(part2_metrics)}, other={len(other_metrics)}")
      if lowest_quality:
          print(f"Lowest quality step: {lowest_quality['file']} ({lowest_quality['overall_score']}/10)")
      for entry in curriculum:
          tags = [entry['part']]
          if not entry['is_learning_page']:
              tags.append('dispatcher')
          print(f"  [{entry['index']}] {entry['file']}: {entry['title']} [{' · '.join(tags)}]")
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

You are an expert UX researcher and instructional designer specialising in developer education. Your task is to simulate the synthetic learner cohort in `/tmp/gh-aw/cache-memory/profiles.json` attempting the "Learning GitHub Agentic Workflows" workshop and produce a detailed quality report.

---

## Context

The workshop teaches GitHub beginners how to create and run agentic workflows. The curriculum is determined at runtime from the workshop markdown files.

Read `/tmp/gh-aw/agent/sim/data/curriculum.json`. It contains:
- `main_steps`: ordered array of `{index, file, title, part, is_learning_page}` for each main workshop step (excludes `README.md` and side-quest files)
- `side_quests`: array of `{file, title}` for optional supplementary steps
- `step_count`: total number of main steps

Use the `main_steps` array as the definitive curriculum for this simulation. Each element's `file` field is the filename in `workshop/`, `title` is the heading extracted from that file, and `part` is one of `part1` (lessons `00–14`), `part2` (lessons `15+`), or `other`. Do not rely on any previously known or hardcoded list of steps.

Read `/tmp/gh-aw/agent/sim/data/curriculum-quality-metrics.json` for step-level curriculum quality metrics, including per-part summary stats in `part1`, `part2`, and `other`, plus each step's `overall_score` and per-dimension rubric scores (`cognitive_load`, `readability`, `active_learning`, `checkpoint_quality`, `scaffolding`, `style_compliance`).
These metrics come from the shared rubric in `.github/skills/curriculum-quantitative-assessment/curriculum_assessment.py`.
Treat that rubric as the educational score source of truth when you recommend repairs, and use this data to ground dropout analysis and repair recommendations.

The workshop content available today: **${{ env.WORKSHOP_STEP_COUNT }} main steps** (plus side quests listed in `curriculum.json`).

---

## Synthetic Learner Profiles

Read `/tmp/gh-aw/cache-memory/profiles.json` to load the student profiles. Each student has:
- `id` — unique identifier within the generated cohort
- `name` — persona name
- `level` — agentic technical level: `beginner` (no prior GitHub/coding) | `github-basic` (can clone/commit/push; no Actions or AI tools) | `actions-user` (familiar with Actions YAML; new to agentic/AI workflows) | `advanced` (experienced developer/DevOps engineer with LLM tooling experience)
- `personality` — `curious` | `methodical` | `impatient` | `confused` | `skeptical`
- `background` — role background: `no-coding` (no software development background) | `web-dev` (frontend/full-stack web developer) | `backend-dev` (backend/systems developer) | `devops` (DevOps engineer/SRE) | `data-science` (data scientist/ML engineer) | `enterprise-dev` (enterprise developer using GHE/GHES with self-hosted runners) | `enterprise-devops` (senior DevOps/platform engineer managing self-hosted runner fleets) | `program-manager` (program/product manager evaluating agentic workflows)
- `goal` — `personal-learning` | `work-project` | `team-evaluation` | `teaching-others`
- `ui_preferred` — `true` if the student prefers using the GitHub web UI over the terminal; `false` if they prefer the CLI
- `tool` — preferred agentic tool entry point: `cli` (uses the `gh aw` CLI extension in a terminal) | `vscode` (uses VS Code with the GitHub Copilot extension) | `CCA` (uses GitHub Copilot Cloud Agent via the Agents tab or another browser/chat surface, where the learner sends prompts rather than terminal commands and should explicitly invoke `/agentic-workflows` for workflow-authoring tasks)
- `mobile` — `true` if the student accesses GitHub primarily from the GitHub Mobile app on iOS or Android (spawns agent sessions and reviews pull requests; no coding or terminal support); `false` or absent otherwise. May be combined with any `tool` value; in practice most mobile students use `CCA`.
- `runs` — number of prior simulation runs (accumulated across days)
- `successes` — number of prior successful completions

The profiles are generated from `.github/skills/micro-environment-simulator/workshop-student-population.json`. Treat its distributions as explicit expert assumptions, not measured learner demographics. Do not present simulated rates as observed human outcomes.

---

## Simulation Task

### Simulate each student through the workshop

For each student in the generated cohort, simulate their experience step-by-step using the following rules:

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
- For Copilot / Agents-tab paths, verify that the content treats the surface as prompt-driven chat and explicitly calls out `/agentic-workflows` for workflow-authoring tasks. Missing that cue, or presenting shell commands as if they run inside the Agents tab, is an access barrier for `tool: CCA` learners.

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
  "total": <generated cohort size>,
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

Use `successRateCi95`, `aggregate.overallSuccessRateCi95`, and `aggregate.dropoutRateCi95ByStep` to show Monte Carlo uncertainty. These intervals do not cover uncertainty in the assumed population weights or probability model; repeat that limitation in the report. Use `aggregate.attemptsByStep` as each step's at-risk denominator. `aggregate.dropoutRateByStep` is the conditional probability of failing among runs that reached the step, not a percentage of all starting runs.

Then, for each student, use the environment assumptions modelled by the simulator to explain **why** their success rate is what it is. Read the student's Monte Carlo entry (`failuresByStep`, `mostCommonFailureStep`), inspect the matching `stepContentById[mostCommonFailureStep]`, and cross-reference both with the student profile to produce per-student pain points:

- Which step failed most often across the ${{ env.MONTE_CARLO_RUNS }} runs
- The likely environment or profile reason (OS, tool, auth, level, personality)
- The likely content reason (for example: terminal-heavy instructions, browser-friendly fallback, auth-heavy setup, or high conceptual density)
- Treat browser-driven workflow execution steps differently from local CLI steps: triggering a workflow from the **Actions** tab should not require local Copilot credentials. Only flag secret-related problems at that stage when `aggregate.failureCategoriesByStep` reports that exact runtime failure after the learner completed the preceding model-access activity.
- Do not infer a failure reason from lexical signals such as `authDemand`. The baseline first workflow uses GitHub Copilot; do not introduce optional engines or credentials from later side quests into its failure analysis. Use `failureCategoriesByStep` as the source of truth for the top reason.
- For `tool: CCA` learners, treat the Agents tab as a prompt surface. If the step tells the learner to run shell commands there, or fails to call out `/agentic-workflows` for workflow-authoring work, classify that as a content mismatch rather than a generic terminal-skill gap.

#### Qualitative depth for top-failure students

For students whose `successRate` < 0.50 (the most at-risk half), apply additional qualitative reasoning from the student profile to enrich the pain-point description:

- **`level`** vs. assumed knowledge
- **`background`** vs. step domain
- **`tool`**, **`mobile`**, and **`ui_preferred`** vs. step tooling (if a step requires running `gh aw` in a terminal and the student is `ui_preferred`, `mobile: true`, or uses `CCA`, note that no UI alternative exists)
- **`personality`**: `methodical` reads carefully; `confused` needs more guidance; `impatient` skips steps
- **`goal`**: `team-evaluation` abandons sooner; `teaching-others` is thorough
- **Prior runs** (`runs`, `successes`): higher prior completions correlate with better outcomes

### Collect pain points per student

For each student whose `successRate` < 1.0, note:
- Which step failed most often across the ${{ env.MONTE_CARLO_RUNS }} Monte Carlo runs (`mostCommonFailureStep`)
- The failure count per step from `failuresByStep`
- Likely reason (based on profile **and** content): reason from the student's `level`, `background`, `personality`, `tool`, `mobile`, and `ui_preferred` in relation to `stepContentById[step]` and the step's actual content and demands. Do **not** match against a fixed template. Key edge cases to flag explicitly: `ui_preferred: true` or `mobile: true` students hitting terminal-only steps (no UI alternative exists); Codespaces learners choosing the optional CLI trigger path and hitting `actions:write` friction; enterprise/proxy environments adding friction to setup steps.

### Aggregate and analyse results

Use the pre-computed values from `monte-carlo-replay.json` as the primary data source:

- **Overall success rate** — read from `aggregate.overallSuccessRate`
- **Per-step conditional dropout rate** — read from `aggregate.dropoutRateByStep`; sort descending to find the worst steps, and report each rate with its at-risk count from `aggregate.attemptsByStep` and interval from `aggregate.dropoutRateCi95ByStep`
- **Top 5 dropout steps** — highest values in `aggregate.dropoutRateByStep`
- **Success rate by technical level** — group `monteCarlo` entries by student level and average `successRate`
- **Success rate by personality** — group `monteCarlo` entries by student personality and average `successRate`
- **Success rate by UI preference** — compare average `successRate` for students where `ui_preferred: true` vs `ui_preferred: false`
- **Part summary** — report `curriculum-quality-metrics.json.part1`, `.part2`, and overall mean so the core path (lessons `00–14`) is separated from the advanced lessons (`15+`)
- **Part-specific hotspots** — when listing top-dropout steps or curriculum repairs, note whether each step belongs to Part 1 (`00–14`) or Part 2 (`15+`) using `curriculum.json.main_steps[*].part`
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
- where N is the total accumulated runs across all students divided by the generated cohort size (round to nearest integer).

Keep the report short and to the point. Keep critical findings visible; move verbose content into `<details>` sections for progressive disclosure.

**Body**: structure the issue as follows:

```markdown
### Overview
- Date: YYYY-MM-DD
- Students simulated: N × ${{ env.MONTE_CARLO_RUNS }} Monte Carlo runs
- Workshop steps available: N/${{ env.WORKSHOP_STEP_COUNT }}
- Overall success rate: XX% (95% Monte Carlo interval: XX%–XX%)
- Highest-dropout step: <step-id> (XX% conditional dropout among N at-risk runs; 95% Monte Carlo interval: XX%–XX%)
- Lowest curriculum quality step: `<file>` (overall score X.X/10)
- Learning KPI index: X.X/10 (active_learning X.X · checkpoint_quality X.X · scaffolding X.X)
- Model: `<journeyModelVersion>` / `<populationModelVersion>` (parameter hash `<parameterHash>`)
- Limitation: synthetic results reflect explicit model assumptions; intervals exclude model and population-assumption uncertainty

### Part Summary
| Part | Files | Mean Score | Std Dev |
|---|---|---|---|
| Part 1 — core path (lessons 00–14) | `N1` | `X.XX / 10.0` | `±S1` |
| Part 2 — advanced (lessons 15+) | `N2` | `Y.YY / 10.0` | `±S2` |
| Overall corpus | `N` | `Z.ZZ / 10.0` | `±S` |

If any pages are classified as `other`, add one short bullet noting how many there are and whether their `mean_score` is below, equal to, or above the overall corpus mean.

### Critical Findings
1. 2-4 bullets with the most important blockers and who they affect.
2. Include one bullet on the learning quality health: whether the learning KPI index indicates learners who stay in the workshop are building skills effectively.
3. At least one bullet should say whether the most important repair belongs to Part 1 (`00–14`) or Part 2 (`15+`).

### Top Repairs to Prioritize
Note: some student dropout is expected and acceptable. Repairs must maintain or improve the learning KPI index — do not lower the cognitive bar or remove practice to chase headline completion numbers.

1. Repair summary 1 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)
2. Repair summary 2 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)
3. Repair summary 3 (completion impact: ↑/↔/↓ · learning KPI impact: ↑/↔/↓)

<details>
<summary>Dropout by step</summary>

Table with: step, at-risk runs, dropouts, conditional dropout rate, 95% Monte Carlo interval, failure mode (access barrier | learning barrier), top reason. The top reason must be the highest-count category in `aggregate.failureCategoriesByStep[step]`, translated into plain language without changing its meaning.

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
