---
layout: ../layouts/BaseLayout.astro
title: Facilitator Guide
---

## Facilitator Guide (90 Minutes)

### Outcomes

By the end of the session, learners should be able to:

1. Explain the core loop of agentic workflows.
2. Write prompts with clear context, constraints, and success criteria.
3. Validate generated output before accepting it.
4. Adapt the loop to their real daily tasks.

### Materials

- This Astro workshop site
- A repository participants can safely modify
- Any agentic engine (cloud, local, IDE, or CLI)
- Projector + timer

### Facilitation flow

#### 1) Foundations (0–15 min)

- Define **agentic workflow** as multi-step collaboration with checkpoints.
- Compare “one-shot prompt” vs “iterative loop with verification”.
- Set expectation: the agent accelerates work, the human remains accountable.

#### 2) Prompt architecture (15–35 min)

Teach learners to include four parts in every request:

- **Intent**: what result is needed
- **Context**: files, constraints, audience
- **Quality bar**: style, tests, security checks
- **Output format**: plan, diff, docs, checklist

Exercise: ask learners to rewrite a weak prompt into a high-context prompt.

#### 3) Guided build (35–60 min)

- Instruct learners to generate a small workshop site section with the agent.
- Require one planning step before implementation.
- Encourage small commits and explicit checklists.

#### 4) Validation lab (60–80 min)

- Run build/test/lint commands.
- Review generated changes in pairs.
- Ask learners to identify one hallucination or incorrect assumption and fix it.

#### 5) Reflection (80–90 min)

- Each learner writes a 20-minute daily workflow they will use tomorrow.
- Share one anti-pattern to avoid.

### Common anti-patterns

- Accepting output without verification
- Asking for broad changes without boundaries
- Skipping tests/build checks
- Ignoring security implications when adding dependencies

### Debrief prompts

- What step in the loop gave you the most value?
- Where did the agent need the most correction?
- What will you automate next week?
