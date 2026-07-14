---
name: curriculum-quantitative-assessment
description: Shared quantitative curriculum assessment helpers for workshop scoring and simulator guardrails.
disable-model-invocation: true
---

# Curriculum Quantitative Assessment

Use this skill when a workflow needs the workshop's shared quantitative curriculum rubric.

## Included Source

Use the checked-in Python helper directly:

- `.github/skills/curriculum-quantitative-assessment/curriculum_assessment.py`

It provides reusable helpers for:

- sorting workshop step files in curriculum order
- collecting per-file markdown metrics
- scoring the shared rubric dimensions
- calculating overall curriculum scores without duplicating formulas across workflows

## Shared Rubric

The shared rubric is the source of truth for:

- `cognitive_load`
- `readability`
- `active_learning`
- `checkpoint_quality`
- `scaffolding`
- `style_compliance`

Workflows that recommend edits should use these scores as guardrails and avoid suggesting changes that would lower the current educational score when a score-preserving alternative exists.
