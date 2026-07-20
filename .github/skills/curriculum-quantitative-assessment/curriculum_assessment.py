from __future__ import annotations

import pathlib
import re

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)", re.MULTILINE)
CODE_FENCE_RE = re.compile(r"```[^\n]*\n(.*?)```", re.DOTALL)
INLINE_CMD_RE = re.compile(r"`([^`\n]+)`")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
CHECKPOINT_RE = re.compile(r"##\s+✅\s*Checkpoint", re.IGNORECASE)
CHECKLIST_RE = re.compile(r"^\s*-\s+\[[ xX]\]", re.MULTILINE)
CALLOUT_RE = re.compile(r"^>\s*\[!(TIP|NOTE|IMPORTANT|WARNING)\]", re.MULTILINE)
NUMBERED_HDR_RE = re.compile(r"^#{1,6}\s+\d+[.)]\s+", re.MULTILINE)
SENTENCE_RE = re.compile(r"[.!?]+")
# Marks a page as a dispatcher or informational page excluded from learning KPIs.
# Usage in a workshop markdown file: <!-- learning:false -->
LEARNING_FALSE_RE = re.compile(r"<!--\s*learning\s*:\s*false\s*-->", re.IGNORECASE)

BLOOM_SIGNALS = {
    "remember": ["welcome", "reference", "vocabulary", "definition", "terminology", "glossary", "prerequisite"],
    "understand": ["intro", "introduction", "overview", "understand", "concept", "architecture", "explain", "at a glance"],
    "apply": ["run", "execute", "install", "setup", "configure", "connect", "schedule", "use"],
    "analyze": ["analyze", "analyse", "inspect", "debug", "diagnose", "compare", "output", "troubleshoot", "investigate"],
    "evaluate": ["evaluate", "assess", "judge", "review", "validate", "verify", "test", "iterate"],
    "create": ["create", "build", "design", "author", "compose", "construct", "generate", "write"],
}
BLOOM_LEVELS = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
BLOOM_TIE_BREAK = {level: len(BLOOM_LEVELS) - idx for idx, level in enumerate(BLOOM_LEVELS)}
INTRO_TOKEN_LIMIT = 220
TITLE_WEIGHT = 3
INTRO_WEIGHT = 1

DIMENSIONS = {
    "cognitive_load": 2.0,
    "readability": 1.5,
    "active_learning": 2.0,
    "checkpoint_quality": 2.0,
    "scaffolding": 1.5,
    "style_compliance": 1.0,
}
# Dispatcher/informational pages are scored for clarity and simplicity only.
# Active learning, checkpoint quality, and scaffolding are not expected.
DISPATCHER_DIMENSIONS = {
    "cognitive_load": 2.0,
    "readability": 2.0,
    "active_learning": 0.0,
    "checkpoint_quality": 0.0,
    "scaffolding": 0.0,
    "style_compliance": 2.0,
}


def sort_workshop_key(name: str) -> tuple[int, str]:
    match = re.match(r"^(\d+)([a-z]?)", name)
    if not match:
        return (999, name)
    return (int(match.group(1)), match.group(2) or "")


def is_non_learning_page(raw: str) -> bool:
    """Return True if the page is marked as a dispatcher or informational page.

    Pages marked with ``<!-- learning:false -->`` are dispatcher/choice hubs that
    remain part of the workshop navigation graph but are scored for clarity and
    simplicity rather than active learning.  The ``active_learning``,
    ``checkpoint_quality``, and ``scaffolding`` dimensions are given zero weight;
    ``cognitive_load``, ``readability``, and ``style_compliance`` are emphasised
    (see :data:`DISPATCHER_DIMENSIONS`).

    Matching is case-insensitive and tolerates minor whitespace variations.
    Accepted formats include::

        <!-- learning:false -->
        <!-- Learning:False -->
        <!--   learning : false   -->
    """
    return bool(LEARNING_FALSE_RE.search(raw))


def sorted_workshop_files(
    workshop_dir: str | pathlib.Path,
    include_readme: bool = False,
    learning_only: bool = False,
) -> list[pathlib.Path]:
    """Return sorted workshop markdown files.

    Args:
        workshop_dir: Path to the workshop directory.
        include_readme: When True, include README.md in the results.
        learning_only: When True, exclude pages marked with
            ``<!-- learning:false -->``.  Note that enabling this option reads
            each file once during filtering; callers that subsequently call
            :func:`score_workshop_file` on the returned paths will read each
            file a second time.
    """
    root = pathlib.Path(workshop_dir)
    paths = sorted(
        (
            path
            for path in root.glob("*.md")
            if include_readme or path.name != "README.md"
        ),
        key=lambda path: sort_workshop_key(path.name),
    )
    if learning_only:
        paths = [p for p in paths if not is_non_learning_page(p.read_text(encoding="utf-8"))]
    return paths


def extract_title(raw: str, fallback: str) -> str:
    for line in raw.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def fk_grade(text: str) -> float:
    words = re.findall(r"[a-zA-Z']+", text)
    if not words:
        return 0.0
    sentences = max(1, len(SENTENCE_RE.findall(text)))
    syllables = sum(max(1, len(re.findall(r"[aeiouAEIOU]+", word))) for word in words)
    return round(0.39 * (len(words) / sentences) + 11.8 * (syllables / len(words)) - 15.59, 1)


def count_new_concepts(text: str) -> int:
    bold = re.findall(r"\*\*([^*\n]{2,40})\*\*", text)
    code_short = [
        token
        for token in re.findall(r"`([^`\n]{2,30})`", text)
        if not token.startswith(("gh ", "git ", "cd ", "cat ", "echo ", "mkdir "))
    ]
    return len(set(bold)) + len(set(code_short))


def classify_bloom_level(title: str, text: str, filename: str) -> tuple[str, str]:
    title_text = f"{filename} {title}".lower()
    prose = CODE_FENCE_RE.sub("", text).lower()
    intro = " ".join(re.findall(r"[a-z']+", prose)[:INTRO_TOKEN_LIMIT])

    scores = {level: 0 for level in BLOOM_LEVELS}
    evidence = {level: [] for level in BLOOM_LEVELS}

    for level in BLOOM_LEVELS:
        for cue in BLOOM_SIGNALS[level]:
            if re.search(r"\b" + re.escape(cue) + r"\b", title_text):
                scores[level] += TITLE_WEIGHT
                evidence[level].append(f"title:{cue}")
            if re.search(r"\b" + re.escape(cue) + r"\b", intro):
                scores[level] += INTRO_WEIGHT
                evidence[level].append(f"intro:{cue}")

    if len(CODE_FENCE_RE.findall(text)) > 0 or len(INLINE_CMD_RE.findall(text)) >= 3:
        scores["apply"] += 1
        evidence["apply"].append("activity:commands_or_code")
    if CHECKPOINT_RE.search(text):
        scores["evaluate"] += 1
        evidence["evaluate"].append("activity:checkpoint")

    selected = max(BLOOM_LEVELS, key=lambda level: (scores[level], BLOOM_TIE_BREAK[level]))
    if scores[selected] == 0:
        return "unknown", "No reliable Bloom cues found in title or intro."

    top_cues = ", ".join(evidence[selected][:2]) or "general activity cues"
    return selected, f"Primary cues: {top_cues}."


def collect_metrics_from_text(raw: str, filename: str, *, title: str | None = None) -> dict:
    prose = CODE_FENCE_RE.sub("", raw)
    words = re.findall(r"[a-zA-Z']+", prose)
    headings = HEADING_RE.findall(raw)
    code_blocks = CODE_FENCE_RE.findall(raw)
    inline_cmds = INLINE_CMD_RE.findall(raw)
    links = LINK_RE.findall(raw)
    has_checkpoint = bool(CHECKPOINT_RE.search(raw))
    checklist_items = len(CHECKLIST_RE.findall(raw))
    callout_count = len(CALLOUT_RE.findall(raw))
    numbered_headings = len(NUMBERED_HDR_RE.findall(raw))
    new_concepts = count_new_concepts(prose)
    page_title = title or next((heading.strip() for level, heading in headings if level == "#"), filename.removesuffix(".md"))
    bloom_level, bloom_reason = classify_bloom_level(page_title, raw, filename)

    return {
        "file": filename,
        "title": page_title,
        "sort_key": list(sort_workshop_key(filename)),
        "is_learning_page": not is_non_learning_page(raw),
        "word_count": len(words),
        "sentence_count": max(1, len(SENTENCE_RE.findall(prose))),
        "h2_sections": sum(1 for level, _ in headings if level == "##"),
        "code_blocks": len(code_blocks),
        "inline_commands": len(inline_cmds),
        "external_links": sum(1 for _, url in links if url.startswith("http")),
        "internal_links": sum(1 for _, url in links if not url.startswith("http")),
        "has_checkpoint": has_checkpoint,
        "checklist_items": checklist_items,
        "callout_count": callout_count,
        "numbered_headings": numbered_headings,
        "new_concepts": new_concepts,
        "fk_grade": fk_grade(prose),
        "activity_density": round((len(code_blocks) + checklist_items) / max(1, len(words) / 100), 2),
        "has_prereq_section": bool(
            re.search(r"##\s+📋\s*Before You Start", raw, re.IGNORECASE)
            or re.search(r"##\s+Prerequisites", raw, re.IGNORECASE)
        ),
        "bloom_level": bloom_level,
        "bloom_justification": bloom_reason,
    }


def score_cognitive_load(metrics: dict) -> float:
    word_count_score = max(0, 10 - max(0, (metrics["word_count"] - 800) / 100))
    concept_score = max(0, 10 - max(0, (metrics["new_concepts"] - 15) / 2))
    return round((word_count_score + concept_score) / 2, 1)


def score_readability(metrics: dict) -> float:
    fk = metrics["fk_grade"]
    if 8 <= fk <= 12:
        return 10.0
    return round(max(0, 10 - abs(fk - 10) * 0.8), 1)


def score_active_learning(metrics: dict) -> float:
    return round(min(10, metrics["activity_density"] * 3.3), 1)


def score_checkpoint_quality(metrics: dict) -> float:
    if not metrics["has_checkpoint"]:
        return 0.0
    return round(min(10, metrics["checklist_items"] * 2.5), 1)


def score_scaffolding(metrics: dict) -> float:
    return 10.0 if metrics["has_prereq_section"] else 5.0


def score_style_compliance(metrics: dict) -> float:
    penalty = metrics["numbered_headings"] * 2 + max(0, metrics["callout_count"] - 3) * 1.5
    return round(max(0, 10 - penalty), 1)


SCORE_FNS = {
    "cognitive_load": score_cognitive_load,
    "readability": score_readability,
    "active_learning": score_active_learning,
    "checkpoint_quality": score_checkpoint_quality,
    "scaffolding": score_scaffolding,
    "style_compliance": score_style_compliance,
}


def overall_score_from_metrics(metrics: dict, weights: dict | None = None) -> tuple[dict, float]:
    effective_weights = weights if weights is not None else DIMENSIONS
    dim_scores = {dimension: score_fn(metrics) for dimension, score_fn in SCORE_FNS.items()}
    weighted_sum = sum(dim_scores[dimension] * effective_weights[dimension] for dimension in effective_weights)
    return dim_scores, round(weighted_sum / sum(effective_weights.values()), 2)


def score_markdown(raw: str, filename: str, *, title: str | None = None) -> dict:
    metrics = collect_metrics_from_text(raw, filename, title=title)
    weights = DISPATCHER_DIMENSIONS if not metrics["is_learning_page"] else None
    dim_scores, overall_score = overall_score_from_metrics(metrics, weights=weights)
    return {**metrics, **dim_scores, "dim_scores": dim_scores, "overall_score": overall_score}


def score_workshop_file(path: str | pathlib.Path) -> dict:
    file_path = pathlib.Path(path)
    return score_markdown(file_path.read_text(encoding="utf-8"), file_path.name)
