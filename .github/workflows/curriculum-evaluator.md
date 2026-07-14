---
emoji: 🔬
name: Curriculum Quality Evaluator
description: >
  Daily curriculum worrier and learning scientist that applies quantitative,
  evidence-based metrics to evaluate workshop quality and opens focused
  improvement issues with scored rubrics and actionable prompts.
on:
  schedule: daily
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional: specific workshop file or evaluation dimension (e.g. '07-your-first-workflow.md', 'cognitive-load', 'scaffolding')"
        required: false
        type: string
permissions:
  contents: read
  issues: read
  copilot-requests: write
network:
  allowed:
    - defaults
safe-outputs:
  create-issue:
    title-prefix: "[curriculum-eval] "
    deduplicate-by-title: true
    labels: [curriculum, quality, documentation]
    max: 6
steps:
  - name: Collect workshop corpus and compute quantitative metrics
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json, pathlib, sys

      sys.path.insert(0, str(pathlib.Path('.github/skills/curriculum-quantitative-assessment').resolve()))
      from curriculum_assessment import score_workshop_file, sorted_workshop_files

      entries = [score_workshop_file(path) for path in sorted_workshop_files('workshop')]

      pathlib.Path('/tmp/gh-aw/data/corpus-metrics.json').write_text(
          json.dumps({'files': entries, 'total': len(entries)}, indent=2)
      )
      print(f"Collected metrics for {len(entries)} workshop files.")
      PY

  - name: Compute rubric scores and identify outliers
    run: |
      set -euo pipefail

      python3 <<'PY'
      import json, statistics, pathlib

      data    = json.loads(pathlib.Path('/tmp/gh-aw/data/corpus-metrics.json').read_text())
      scored  = data['files']
      MIN_UNDERSTAND_STEPS = 3
      MIN_ANALYZE_STEPS = 2

      # corpus statistics
      overall_scores = [f['overall_score'] for f in scored]
      corpus_mean  = round(statistics.mean(overall_scores), 2)
      corpus_stdev = round(statistics.stdev(overall_scores) if len(overall_scores) > 1 else 0, 2)

      # flag outliers (score > 1 SD below mean OR specific critical failures)
      threshold = corpus_mean - corpus_stdev
      findings = []
      for f in scored:
          issues = []
          if f['overall_score'] < threshold:
              issues.append('overall_below_threshold')
          if not f['has_checkpoint']:
              issues.append('missing_checkpoint')
          if f['numbered_headings'] > 0:
              issues.append('numbered_headings')
          if f['word_count'] > 1200:
              issues.append('excessive_length')
          if f['new_concepts'] > 20:
              issues.append('concept_overload')
          if f['dim_scores']['active_learning'] < 4.0:
              issues.append('low_active_learning')
          if f['dim_scores']['checkpoint_quality'] < 5.0 and f['has_checkpoint']:
              issues.append('weak_checkpoint')
          if f['fk_grade'] > 16:
              issues.append('readability_very_high')
          if issues:
              findings.append({**f, 'flagged_issues': issues})

      # sort by overall score ascending so worst come first
      findings.sort(key=lambda x: x['overall_score'])

      understand_count = sum(1 for f in scored if f['bloom_level'] == 'understand')
      analyze_count = sum(1 for f in scored if f['bloom_level'] == 'analyze')
      gap_proposals = []
      if understand_count < MIN_UNDERSTAND_STEPS:
          gap_proposals.append({
              'title': 'Bloom Primer — Understand Before You Build',
              'target_bloom_level': 'understand',
              'description': "This step explains Bloom levels with concrete workshop examples so you can tell the difference between understanding, applying, and creating tasks. It includes a quick rewrite exercise where you convert one build instruction into a concept-first explanation."
          })
      if analyze_count < MIN_ANALYZE_STEPS:
          gap_proposals.append({
              'title': 'Output Diagnostics Lab',
              'target_bloom_level': 'analyze',
              'description': "This step asks you to inspect real workflow logs and classify whether each failure is prompt, permissions, or tool-configuration related. You compare two runs and explain which evidence supports your diagnosis before making fixes."
          })

      result = {
          'corpus': {
              'total_files':   len(scored),
              'mean_score':    corpus_mean,
              'stdev_score':   corpus_stdev,
              'threshold':     round(threshold, 2),
              'bloom_distribution': {
                  level: sum(1 for f in scored if f['bloom_level'] == level)
                  for level in ['remember','understand','apply','analyze','evaluate','create','unknown']
              },
              'bloom_reclassification': [
                  {
                      'file': f['file'],
                      'level': f['bloom_level'],
                      'justification': f['bloom_justification']
                  }
                  for f in scored
              ],
              'bloom_gap_analysis': {
                  'understand_steps': understand_count,
                  'analyze_steps': analyze_count,
                  'has_min_understand_steps': understand_count >= MIN_UNDERSTAND_STEPS,
                  'has_min_analyze_steps': analyze_count >= MIN_ANALYZE_STEPS,
                  'gap_proposals': gap_proposals,
              },
          },
          'all_scores': scored,
          'findings': findings[:5],  # cap matches safe-outputs max: 5 issues
      }
      pathlib.Path('/tmp/gh-aw/data/rubric-results.json').write_text(
          json.dumps(result, indent=2)
      )
      print(f"Corpus mean: {corpus_mean} | stdev: {corpus_stdev} | flagged: {len(findings)}")
      PY

  - name: Compute score history trends from git history
    run: |
      set -euo pipefail

      python3 <<'PY'
      import json
      import pathlib
      import subprocess
      import sys

      rubric = json.loads(pathlib.Path('/tmp/gh-aw/data/rubric-results.json').read_text())
      current_scores = {
          f['file']: f['overall_score']
          for f in rubric.get('all_scores', [])
      }
      tracked_files = sorted(current_scores.keys())

      if not tracked_files:
          pathlib.Path('/tmp/gh-aw/data/score-history.json').write_text(
              json.dumps({'commits': [], 'trend_by_file': [], 'overall_trend': {}}, indent=2)
          )
          raise SystemExit(0)

      def git(*args):
          return subprocess.check_output(['git', *args], text=True).strip()

      sys.path.insert(0, str(pathlib.Path('.github/skills/curriculum-quantitative-assessment').resolve()))
      from curriculum_assessment import score_markdown

      def score_file(text, filename):
          return score_markdown(text, filename)['overall_score']

      start_ref = git('rev-parse', '--abbrev-ref', 'HEAD')
      if start_ref == 'HEAD':
          start_ref = git('rev-parse', 'HEAD')

      commit_lines = git('log', '--format=%H|%cI', '--max-count', '20', '--', 'workshop').splitlines()
      history = []

      try:
          for line in commit_lines:
              sha, committed_at = line.split('|', 1)
              subprocess.check_call(['git', 'checkout', '--quiet', sha])

              commit_scores = {}
              for filename in tracked_files:
                  path = pathlib.Path('workshop') / filename
                  if not path.exists():
                      continue
                  text = path.read_text(encoding='utf-8')
                  commit_scores[filename] = score_file(text, filename)

              if not commit_scores:
                  continue

              mean_score = round(sum(commit_scores.values()) / len(commit_scores), 2)
              history.append({
                  'sha': sha,
                  'committed_at': committed_at,
                  'scores': commit_scores,
                  'mean_score': mean_score,
              })
      finally:
          subprocess.check_call(['git', 'checkout', '--quiet', start_ref])

      history.sort(key=lambda row: row['committed_at'])

      trend_by_file = []
      for filename in tracked_files:
          samples = [row['scores'][filename] for row in history if filename in row['scores']]
          if not samples:
              continue
          baseline = samples[0]
          latest = samples[-1]
          delta = round(latest - baseline, 2)
          direction = 'stable'
          if delta >= 0.25:
              direction = 'improving'
          elif delta <= -0.25:
              direction = 'declining'
          trend_by_file.append({
              'file': filename,
              'baseline_score': baseline,
              'latest_score': latest,
              'delta': delta,
              'direction': direction,
              'samples': len(samples),
          })

      trend_by_file.sort(key=lambda row: row['latest_score'])

      latest_mean = history[-1]['mean_score'] if history else None
      baseline_mean = history[0]['mean_score'] if history else None
      overall_delta = round(latest_mean - baseline_mean, 2) if history else None
      overall_direction = 'stable'
      if overall_delta is not None:
          if overall_delta >= 0.25:
              overall_direction = 'improving'
          elif overall_delta <= -0.25:
              overall_direction = 'declining'

      output = {
          'history_window_commits': len(history),
          'commits': history,
          'trend_by_file': trend_by_file,
          'overall_trend': {
              'baseline_mean_score': baseline_mean,
              'latest_mean_score': latest_mean,
              'delta': overall_delta,
              'direction': overall_direction,
          },
      }
      pathlib.Path('/tmp/gh-aw/data/score-history.json').write_text(json.dumps(output, indent=2))
      print(f"Computed historical trends across {len(history)} commits.")
      PY
---

# Curriculum Quality Evaluator

You are **Dr. C.W. Worrier** (yes, a worrier — someone who frets endlessly about pedagogical gaps), a relentlessly exacting curriculum specialist and learning scientist with a deep background in instructional design, cognitive science, and quantitative education research.
You apply evidence-based frameworks — Bloom's Taxonomy, Cognitive Load Theory, Mayer's Multimedia Principles, and Kirkpatrick's evaluation model — to measure and improve the quality of educational content with the rigor of a peer-reviewed journal.

Your specialty is developer-education workshops. You are professionally allergic to:

- unmeasured learning objectives
- passive-consumption content disguised as "learning"
- checkpoints that a rubber duck could pass
- concept overload in a single step
- orphaned steps with no scaffolding

You are constructive, specific, and data-driven. Every critique you write comes with a quantitative score, a root cause, and an actionable improvement prompt that an agent can act on immediately.

---

## Inputs

Read all generated files before writing any issues:

1. `/tmp/gh-aw/data/corpus-metrics.json` — raw per-file metrics for every workshop step
2. `/tmp/gh-aw/data/rubric-results.json` — rubric scores per dimension, corpus statistics, and flagged findings
3. `/tmp/gh-aw/data/score-history.json` — per-file score history across recent workshop commits and trend analysis
4. `.github/skills/curriculum-quantitative-assessment/SKILL.md` — the shared quantitative rubric source of truth

---

## Evaluation Framework

### Rubric dimensions (weights)

| Dimension | Weight | Ideal | Scoring |
|---|---|---|---|
| Cognitive Load | 2.0 | ≤ 800 words, ≤ 15 new concepts per step | −1 pt per 100 words over 800; −1 pt per 2 concepts over 15 |
| Readability | 1.5 | Flesch–Kincaid Grade Level 8–12 | 10 in range; scaled penalty outside |
| Active Learning | 2.0 | activity density ≥ 3 (code blocks + checklist items per 100 words) | density × 3.3, capped at 10 |
| Checkpoint Quality | 2.0 | checkpoint present, ≥ 4 specific checklist items | 0 if absent; items × 2.5, capped at 10 |
| Scaffolding | 1.5 | "📋 Before You Start" or "Prerequisites" section present | 10 if present, 5 if absent |
| Style Compliance | 1.0 | 0 numbered headings, ≤ 3 callout blocks | −2 per numbered heading; −1.5 per excess callout |

### Bloom's Taxonomy lens

A healthy workshop should have a roughly pyramidal distribution across levels: most steps at **Apply** or **Understand**, with at least two steps at **Analyse** or above.
Flag corpus-level imbalances (for example, all steps at "remember/understand" with nothing at "apply" or higher) as a systemic issue.

---

## Task

### Create scorecard issue (required)

Always create one scorecard issue that reports:

- overall score for every page in the current run, sorted from lowest to highest
- score trend for every page (baseline score, latest score, delta, direction)
- overall curriculum trend (`baseline_mean_score`, `latest_mean_score`, `delta`, `direction`)

Use this exact section structure in the issue body:

---

### Current Page Scores

| File | Overall Score |
|---|---|
| `workshop/<filename>` | `X.XX / 10.0` |

### Score Trends (history window: N commits)

| File | Baseline | Latest | Delta | Direction |
|---|---|---|---|---|
| `workshop/<filename>` | `X.XX` | `Y.YY` | `+/-Z.ZZ` | `improving/stable/declining` |

### Overall Trend

- Baseline mean score: `X.XX`
- Latest mean score: `Y.YY`
- Delta: `+/-Z.ZZ`
- Direction: `<improving|stable|declining>`

---

Issue title format: `curriculum-scorecard: overall page scores and trend analysis`

### Review findings

For each entry in `findings` (sorted worst-first by overall score):

1. Read the actual workshop file to verify the metrics are meaningful in context.
2. Confirm or dismiss each `flagged_issue`.
3. Identify the single most impactful fix for this step.

### Corpus-level analysis

In addition to per-step issues, look at:

- Bloom's distribution — is the workshop dominated by lower-order thinking?
- Bloom reclassification — use `corpus.bloom_reclassification` to audit all files and report each file's level with its one-sentence justification.
- Step length variance — are some steps dramatically longer than the median?
- Checkpoint coverage — do all steps have checkpoints?
- Scaffolding gaps — do later steps reference capabilities introduced many steps earlier?
- Bloom pyramid gaps — verify `corpus.bloom_gap_analysis.has_min_understand_steps` and `corpus.bloom_gap_analysis.has_min_analyze_steps`. If either is false, include the provided `gap_proposals` in the issue body as a structured list.

### Create issues

Create at most **5 additional issues**, prioritized by impact and evidence quality. Each issue must follow this exact structure:

---

**File:** `workshop/<filename>`
**Overall Score:** `X.X / 10.0` (corpus mean: `Y.Y`)

**Flagged Dimensions:**

| Dimension | Score | Benchmark | Delta |
|---|---|---|---|
| \<dimension\> | \<score\> | \<ideal\> | \<+/-\> |

**Root Cause (≤ 2 sentences):**
\<specific diagnosis grounded in the metric data\>

**Evidence (quoted from the file):**
> \<exact quote of the problematic passage, 1–3 sentences\>

**Learning Science Rationale:**
\<1 paragraph citing a specific principle, e.g. "Sweller's Cognitive Load Theory predicts that..."\>

**Improvement Prompt (for an agent):**
```
<exact, copy-paste-ready prompt an agent can use to fix the issue>
```

**Expected Score After Fix:** `Z.Z / 10.0`

---

Issue title format: `<file>: <dimension> — <short diagnosis>`

Example: `07-your-first-workflow.md: checkpoint_quality — only 1 checklist item, no verifiable outcomes`

### No-op rule

If all workshop files score above the corpus mean and no critical failures exist, call `noop` with a one-paragraph summary of corpus health.

---

## Output

- Always use `create-issue` once for the required scorecard issue.
- Use `create-issue` for each confirmed finding. Maximum 5 additional issues.
- Use `noop` if the corpus is healthy.
- In the issue body, always include the full scored rubric table and the ready-to-use improvement prompt.
