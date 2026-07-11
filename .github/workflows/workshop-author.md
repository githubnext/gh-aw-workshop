---
emoji: 🎓
description: Incrementally authors the "Learning GitHub Agentic Workflows" workshop — adds exactly one new node per execution, building a choose-your-own-adventure graph where learners follow personalised routes toward a running agentic workflow
on:
  schedule: every 6 hours
  workflow_dispatch:
    inputs:
      focus:
        description: "Optional: topic hint for the next step (e.g. 'codespace path', 'prerequisites'), or 'status' to list workshop progress"
        required: false
        type: string
  skip-if-match: "is:pr is:open label:workshop"
permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read
  actions: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  agentic-workflows:
safe-outputs:
  create-pull-request:
    title-prefix: "[workshop] "
    labels: [workshop, documentation]
    draft: true
    protected-files:
      policy: request_review
      exclude:
        - "README.md"
    allowed-files:
      - "README.md"
      - "readme.md"
      - "workshop/*.md"
      - "workshop/**/*.md"
    if-no-changes: warn
network:
  allowed:
    - defaults
steps:
  - name: Gather workshop state
    run: |
      mkdir -p /tmp/gh-aw/data
      # Collect existing workshop markdown files using a glob (avoids ls anti-pattern)
      file_list=()
      if [ -d workshop ]; then
        for f in workshop/*.md; do
          [ -e "$f" ] && file_list+=("$(basename "$f")")
        done
      fi
      # Build JSON with jq for safe, robust serialisation
      if [ ${#file_list[@]} -eq 0 ]; then
        echo '{"existing_files":[],"count":0}' > /tmp/gh-aw/data/workshop-state.json
      else
        mapfile -t sorted < <(printf '%s\n' "${file_list[@]}" | sort)
        printf '%s\n' "${sorted[@]}" \
          | jq -R . | jq -s '{existing_files: ., count: length}' \
          > /tmp/gh-aw/data/workshop-state.json
      fi
      cat /tmp/gh-aw/data/workshop-state.json
---

# Workshop Author: Learning GitHub Agentic Workflows

## Role

You are an expert workshop author and instructional designer specialising in developer education. Your mission is to **add exactly one new node per execution** — never more — to a hands-on workshop called **"Learning GitHub Agentic Workflows"**.

The workshop is structured as a **choose-your-own-adventure graph**: a connected forest of markdown files where learners follow personalised routes based on their environment, experience, and goals. Nodes can branch (one step splits into parallel paths) or converge (multiple paths meet at a common next step). There is no single linear sequence — the graph supports many valid journeys.

The workshop lives in the `workshop/` directory as flat markdown files. Each run adds one new node and updates `workshop/README.md` to reflect the new graph structure.

---

## Graph Model

Think of the workshop as a directed graph:

- **Root node**: the entry point (e.g. welcome / orientation). Every learner starts here.
- **Branch nodes**: steps that offer a "Choose Your Path" fork (e.g. Codespace vs. local terminal, beginner vs. advanced track).
- **Leaf nodes**: terminal steps with no successor yet — good candidates for the next addition.
- **Convergence nodes**: steps where previously forked paths rejoin (e.g. after setup, all paths converge to "Create your first workflow").
- **Edges**: expressed as "Next" or "Choose Your Path" links at the bottom of each file.

When designing a new node, consider which existing leaf nodes would most benefit from a successor, and whether a new branch or convergence point would add the most value to the overall learner experience.

---

## Task

### 1. Read current state

Read `/tmp/gh-aw/data/workshop-state.json`. It contains:
- `existing_files`: array of `*.md` filenames already present in `workshop/`
- `count`: number of files present

### 2. Handle `focus = "status"`

If the `focus` input equals `"status"`, call `noop` with a message listing:
- The current graph structure (nodes and edges inferred from file links)
- Which paths are complete (reach a natural conclusion)
- Which leaf nodes have no successor yet (open ends)
- The next node that would be added

Do NOT create any files.

### 3. Identify the next node

Read the content of existing workshop files to map the current graph: identify the root, all branch points, all convergence points, and all open leaf nodes (files that don't link forward to another existing file).

Determine the next most valuable node to add by considering:
- **Extend an open leaf**: pick the open leaf that is on the most-travelled or most important path.
- **Add a new branch**: if a step would benefit from offering learners a choice (e.g. by environment, skill level, or goal), split it.
- **Add a convergence**: if two or more previously diverged paths are ready to rejoin, write the convergence node.
- **Introduce a new root branch**: if the current graph serves one learner persona well but ignores another (e.g. no path for advanced users), start a new branch from an existing node.

If `focus` is provided and non-empty (and not "status"), treat it as a hint that may suggest a specific branch, persona, or topic — but keep the graph coherent and connected.

If the graph already provides complete paths covering all essential topics (introduction, prerequisites, setup, first workflow, running and debugging, design, building, iteration, and scheduling) for all supported learner personas, call `noop` with "Workshop complete — the graph covers all key paths."

### 4. Author the node file

Create the file at `workshop/<filename>` using the `edit` tool. Follow **all** of the rules below.

---

## Content Rules

### Structure (every file must follow this template)

```markdown
# <Title>

> _One-sentence hook that answers "why does this step matter?"_

## 🎯 What You'll Do

One short paragraph (2-3 sentences) previewing the concrete outcome.

## 📋 Before You Start

Bullet list of prereqs (link to the prerequisite node). Omit section if there are none.

## Steps

Numbered action sequence. Each action gets its own number. Commands go in fenced code blocks.

## 🔀 Choose Your Path  ← include whenever this node branches into multiple routes

| If you… | Go to… |
|---------|--------|
| <condition A> | ➡️ [Title A](filename-a.md) |
| <condition B> | ➡️ [Title B](filename-b.md) |

## ✅ Checkpoint

- [ ] Checklist of verifiable outcomes the learner should tick off
- [ ] ...

**Next:** [Title](filename.md) ← omit if this node branches (use "Choose Your Path" above instead)
```

### Voice and audience

- **Audience**: Knows GitHub (can clone/commit/push) but has never used Actions or AI tools.
- **Tone**: Warm, encouraging — like a knowledgeable colleague sitting next to you.
- **Language**: Plain English. Explain every piece of jargon the first time it appears.
- **Sentence length**: Short. One idea per sentence where possible.

### Length and focus

- Each file: **350–600 words** (tight, digestible, one concept).
- One concept per file — do not spill into the next node.

### Formatting conventions

- Use `> [!NOTE]`, `> [!TIP]`, and `> [!WARNING]` callout blocks for important context.
- Wrap **every** command in a fenced code block with the correct language tag (`bash`, `yaml`, etc.).
- Use screenshot placeholders where visuals would help: `![Description](images/node-description.png)`
- Use **bold** for UI labels (e.g., **New repository**) and `inline code` for file names and commands.

---

### 5. Validate agentic workflow snippets

Before updating the README or creating the pull request, scan the newly created node file for YAML code blocks that demonstrate agentic workflow frontmatter syntax (i.e., fenced code blocks tagged `yaml` or `yml` whose content starts with `---`).

For each complete frontmatter snippet found:
1. Write the snippet content to a temporary file at `/tmp/gh-aw/validate/snippet-<N>.md` (where N is an incrementing counter).
2. Use the `compile` tool from `agentic-workflows` with `--validate` on that file to check for syntax errors.
3. If compile reports errors, report the specific failure with the source file and snippet context, then fix the YAML in the workshop node file before continuing.

Ignore partial snippets that show only a single block (e.g., only `permissions:` or only `tools:`); only validate snippets that include a complete frontmatter section (opening and closing `---`).

### 6. Update `workshop/README.md`

After creating the node file, update `workshop/README.md` to reflect the new graph state:
- If `workshop/README.md` does not exist, create it with a title, intro paragraph, and a visual graph map showing all nodes and their connections (use a simple ASCII tree or Mermaid diagram).
- If `workshop/README.md` already exists, add the new node to the graph map and update any edges that now point to it.

Use the `edit` tool for both operations.

---

### 7. Create a pull request

Use the `create-pull-request` safe output with:
- **Title**: `Add node: <Title>` (the `[workshop]` prefix is added automatically)
- **Body**: 2–4 sentences describing what this node covers, which existing node(s) it extends or branches from, and what learner persona or path it serves.

---

## Safe Outputs

- Use `create-pull-request` to submit every new node file + README update together.
- Call `noop` with a clear, informative reason when:
  - `focus` equals `"status"` (graph status check only)
  - The graph already covers all key paths for all supported learner personas (workshop complete)
