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
    max: 5
steps:
  - name: Collect workshop corpus and compute quantitative metrics
    run: |
      set -euo pipefail
      mkdir -p /tmp/gh-aw/data

      python3 <<'PY'
      import json, re, pathlib, math

      workshop_dir = pathlib.Path('workshop')
      files = sorted(
          p for p in workshop_dir.glob('*.md')
          if p.name not in ('README.md',)
      )

      def sort_key(p):
          m = re.match(r'(\d+)([a-z]?)', p.stem)
          if not m:
              return (999, p.stem)
          return (int(m.group(1)), m.group(2) or 'z')

      # ---------- helpers ----------
      HEADING_RE    = re.compile(r'^(#{1,6})\s+(.+)', re.MULTILINE)
      CODE_FENCE_RE = re.compile(r'```[^\n]*\n(.*?)```', re.DOTALL)
      INLINE_CMD_RE = re.compile(r'`([^`\n]+)`')
      LINK_RE       = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
      CHECKPOINT_RE = re.compile(r'## ✅ Checkpoint', re.MULTILINE)
      CHECKLIST_RE  = re.compile(r'^\s*-\s+\[[ xX]\]', re.MULTILINE)
      CALLOUT_RE    = re.compile(r'^>\s*\[!(TIP|NOTE|IMPORTANT|WARNING)\]', re.MULTILINE)
      NUMBERED_HDR  = re.compile(r'^#{1,6}\s+\d+[.)]\s+', re.MULTILINE)

      BLOOM_SIGNALS = {
          'remember':   ['welcome', 'reference', 'vocabulary', 'definition', 'terminology', 'glossary', 'prerequisite'],
          'understand': ['intro', 'introduction', 'overview', 'understand', 'concept', 'architecture', 'explain', 'at a glance'],
          'apply':      ['run', 'execute', 'install', 'setup', 'configure', 'connect', 'schedule', 'use'],
          'analyze':    ['analyze', 'analyse', 'inspect', 'debug', 'diagnose', 'compare', 'output', 'troubleshoot', 'investigate'],
          'evaluate':   ['evaluate', 'assess', 'judge', 'review', 'validate', 'verify', 'test', 'iterate'],
          'create':     ['create', 'build', 'design', 'author', 'compose', 'construct', 'generate', 'write'],
      }
      BLOOM_LEVELS = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']
      BLOOM_TIE_BREAK = {level: len(BLOOM_LEVELS) - idx for idx, level in enumerate(BLOOM_LEVELS)}
      INTRO_TOKEN_LIMIT = 220  # Limit the intro analysis to the first 220 word tokens.
      TITLE_WEIGHT = 3
      INTRO_WEIGHT = 1
      MIN_UNDERSTAND_STEPS = 3
      MIN_ANALYZE_STEPS = 2

      def classify_bloom_level(title, text, filename):
          title_text = f"{filename} {title}".lower()
          prose = CODE_FENCE_RE.sub('', text).lower()
          intro = ' '.join(re.findall(r"[a-z']+", prose)[:INTRO_TOKEN_LIMIT])

          scores = {level: 0 for level in BLOOM_LEVELS}
          evidence = {level: [] for level in BLOOM_LEVELS}

          for level in BLOOM_LEVELS:
              for cue in BLOOM_SIGNALS[level]:
                  if re.search(r'\b' + re.escape(cue) + r'\b', title_text):
                      scores[level] += TITLE_WEIGHT
                      evidence[level].append(f"title:{cue}")
                  if re.search(r'\b' + re.escape(cue) + r'\b', intro):
                      scores[level] += INTRO_WEIGHT
                      evidence[level].append(f"intro:{cue}")

          if len(CODE_FENCE_RE.findall(text)) > 0 or len(INLINE_CMD_RE.findall(text)) >= 3:
              scores['apply'] += 1
              evidence['apply'].append('activity:commands_or_code')
          if CHECKPOINT_RE.search(text):
              scores['evaluate'] += 1
              evidence['evaluate'].append('activity:checkpoint')

          # On score ties, prefer lower-order levels first to avoid over-tagging as "create".
          selected = max(BLOOM_LEVELS, key=lambda level: (scores[level], BLOOM_TIE_BREAK[level]))

          if scores[selected] == 0:
              return 'unknown', "No reliable Bloom cues found in title or intro."

          top_cues = ', '.join(evidence[selected][:2])
          if not top_cues:
              top_cues = 'general activity cues'
          return selected, f"Primary cues: {top_cues}."

      def fk_grade(text):
          """Flesch–Kincaid Grade Level (approximate)."""
          words = re.findall(r"[a-zA-Z']+", text)
          sentences = max(1, len(re.findall(r'[.!?]+', text)))
          syllables = sum(
              max(1, len(re.findall(r'[aeiouAEIOU]+', w)))
              for w in words
          )
          if not words:
              return 0.0
          return 0.39 * (len(words) / sentences) + 11.8 * (syllables / len(words)) - 15.59

      def count_new_concepts(text):
          """Heuristic: count bold/code terms introduced for the first time."""
          bold = re.findall(r'\*\*([^*\n]{2,40})\*\*', text)
          code_short = [t for t in re.findall(r'`([^`\n]{2,30})`', text)
                        if not t.startswith(('gh ', 'git ', 'cd ', 'cat ', 'echo ', 'mkdir '))]
          return len(set(bold)) + len(set(code_short))

      entries = []
      for path in sorted(files, key=sort_key):
          raw = path.read_text(encoding='utf-8')

          # strip code fences for prose analysis
          prose = CODE_FENCE_RE.sub('', raw)

          words        = re.findall(r"[a-zA-Z']+", prose)
          sentences    = max(1, len(re.findall(r'[.!?]+', prose)))
          headings     = HEADING_RE.findall(raw)
          h2_count     = sum(1 for h,_ in headings if h == '##')
          code_blocks  = CODE_FENCE_RE.findall(raw)
          inline_cmds  = INLINE_CMD_RE.findall(raw)
          links        = LINK_RE.findall(raw)
          has_checkpoint = bool(CHECKPOINT_RE.search(raw))
          checklist_items = len(CHECKLIST_RE.findall(raw))
          callout_count   = len(CALLOUT_RE.findall(raw))
          numbered_hdrs   = len(NUMBERED_HDR.findall(raw))
          new_concepts    = count_new_concepts(prose)
          fk              = round(fk_grade(prose), 1)

          # scaffolding proxy: does it link to a prerequisite section?
          has_prereq_link = bool(re.search(r'##\s+📋\s*Before You Start', raw, re.IGNORECASE) or
                                 re.search(r'##\s+Prerequisites', raw, re.IGNORECASE))

          # active-learning ratio: code blocks + checklist items vs. word count
          activity_density = round((len(code_blocks) + checklist_items) / max(1, len(words) / 100), 2)

          title = next((t.strip() for _,t in headings if _ == '#'), path.stem)

          bloom, bloom_reason = classify_bloom_level(title, raw, path.name)

          entries.append({
              'file':             path.name,
              'title':            title,
              'sort_key':         list(sort_key(path)),
              'word_count':       len(words),
              'sentence_count':   sentences,
              'h2_sections':      h2_count,
              'code_blocks':      len(code_blocks),
              'inline_commands':  len(inline_cmds),
              'external_links':   sum(1 for _,u in links if u.startswith('http')),
              'internal_links':   sum(1 for _,u in links if not u.startswith('http')),
              'has_checkpoint':   has_checkpoint,
              'checklist_items':  checklist_items,
              'callout_count':    callout_count,
              'numbered_headings': numbered_hdrs,
              'new_concepts':     new_concepts,
              'fk_grade':         fk,
              'activity_density': activity_density,
              'has_prereq_section': has_prereq_link,
              'bloom_level':      bloom,
              'bloom_justification': bloom_reason,
          })

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
      files   = data['files']

      # ---------- rubric weights (0–10 per dimension) ----------
      def score_cognitive_load(f):
          """Penalise high concept density and very long steps."""
          wc   = f['word_count']
          nc   = f['new_concepts']
          # ideal: < 800 words, < 15 new concepts per step
          # each 100 words over 800 reduces score by 1 point; each 2 concepts over 15 reduces by 1
          wc_score = max(0, 10 - max(0, (wc - 800) / 100))
          nc_score = max(0, 10 - max(0, (nc - 15) / 2))
          return round((wc_score + nc_score) / 2, 1)

      def score_readability(f):
          """FK grade 8–12 is ideal for tech docs; penalise outliers."""
          fk = f['fk_grade']
          if 8 <= fk <= 12:
              return 10.0
          return round(max(0, 10 - abs(fk - 10) * 0.8), 1)

      def score_active_learning(f):
          """Higher activity density = better."""
          ad = f['activity_density']
          return round(min(10, ad * 3.3), 1)

      def score_checkpoint_quality(f):
          """Must have checkpoint; more checklist items = better (up to 5)."""
          if not f['has_checkpoint']:
              return 0.0
          items = f['checklist_items']
          return round(min(10, items * 2.5), 1)

      def score_scaffolding(f):
          """Having a 'Before You Start' / prerequisites section."""
          return 10.0 if f['has_prereq_section'] else 5.0

      def score_style_compliance(f):
          """Penalise numbered headings (violates guidelines) and excessive callouts."""
          penalty = f['numbered_headings'] * 2 + max(0, f['callout_count'] - 3) * 1.5
          return round(max(0, 10 - penalty), 1)

      DIMENSIONS = {
          'cognitive_load':      (score_cognitive_load,  2.0),
          'readability':         (score_readability,      1.5),
          'active_learning':     (score_active_learning,  2.0),
          'checkpoint_quality':  (score_checkpoint_quality, 2.0),
          'scaffolding':         (score_scaffolding,      1.5),
          'style_compliance':    (score_style_compliance, 1.0),
      }
      total_weight = sum(w for _, w in DIMENSIONS.values())

      scored = []
      for f in files:
          dim_scores = {}
          weighted_sum = 0.0
          for dim, (fn, w) in DIMENSIONS.items():
              s = fn(f)
              dim_scores[dim] = s
              weighted_sum += s * w
          overall = round(weighted_sum / total_weight, 2)
          scored.append({**f, 'dim_scores': dim_scores, 'overall_score': overall})

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
              'description': "This step explains Bloom levels with concrete workshop examples so you can tell the difference between understanding, applying, and creating tasks. It includes a quick rewrite exercise where you convert one 'build' instruction into a concept-first explanation."
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

Read both generated files before writing any issues:

1. `/tmp/gh-aw/data/corpus-metrics.json` — raw per-file metrics for every workshop step
2. `/tmp/gh-aw/data/rubric-results.json` — rubric scores per dimension, corpus statistics, and flagged findings

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

Create at most **5 issues**, prioritised by impact and evidence quality. Each issue must follow this exact structure:

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

- Use `create-issue` for each confirmed finding. Maximum 5 issues.
- Use `noop` if the corpus is healthy.
- In the issue body, always include the full scored rubric table and the ready-to-use improvement prompt.
