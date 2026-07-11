---
name: markdown-chunker
description: >
  Parse markdown and QMD files into AST-based section chunks for
  similarity analysis. Explains the chunking algorithm, output format,
  and how to interpret chunk and cluster data.
disable-model-invocation: true
---

# Markdown Chunker Skill

Use this skill when you need to understand how the `markdown-dedup` workflow
parsed markdown files into sections and what the chunk data means.

## Parsing Strategy

The workflow uses a **heading-based AST chunker** that processes each file in
two passes:

1. **Primary (mistletoe AST)**: If `mistletoe` is importable, the file is parsed
   to a full AST and sections are extracted from `Heading` nodes. This gives
   accurate text content free of raw markdown syntax characters.

2. **Fallback (regex)**: If mistletoe is unavailable, a regex-based parser splits
   on heading lines (`^#{1,6}\s+`) while tracking fenced code blocks to avoid
   false heading matches inside code examples.

Both approaches produce the same output schema.

## Chunk Schema

Each chunk object in `md-chunks.json` has:

```json
{
  "file": "workshop/07-your-first-workflow.md",
  "level": 2,
  "title": "Steps",
  "heading_path": ["Write Your First Workflow", "Steps"],
  "content": "...",
  "text": "Steps ...",
  "word_count": 142
}
```

| Field | Description |
|---|---|
| `file` | Repository-relative path |
| `level` | Heading depth (`1`–`6`) |
| `title` | Heading text (stripped) |
| `heading_path` | Breadcrumb from document root to this section |
| `text` | Heading title + content concatenated — used for similarity scoring |
| `word_count` | Token count of `text`; chunks with fewer than 20 words are excluded |

## Cluster Schema

Each cluster object in `md-clusters.json` has:

```json
{
  "id": "cluster-42",
  "size": 3,
  "files": ["workshop/07-your-first-workflow.md", "workshop/11-build-daily-status.md"],
  "max_similarity": 0.82,
  "chunks": [ /* chunk objects as above */ ]
}
```

| Field | Description |
|---|---|
| `max_similarity` | Highest cosine similarity among all pairs in the cluster |
| `files` | Distinct source files; always ≥ 2 (same-file pairs are excluded) |

## Similarity Algorithm

1. Tokenize each chunk's `text` (lowercase, alphabetical words ≥ 3 characters).
2. Compute IDF over all chunks: `idf(t) = log(N / (1 + df(t)))`.
3. Build TF-IDF vectors per chunk.
4. Score all cross-file pairs; keep pairs with cosine similarity ≥ 0.55.
5. Union-Find groups overlapping pairs into clusters.
6. Discard clusters where all members belong to the same file.

## Interpreting Similarity Scores

| Score | Typical meaning |
|---|---|
| ≥ 0.80 | Near-verbatim duplicate — very likely genuine redundancy |
| 0.65–0.80 | Strong overlap — probably the same concept in different words |
| 0.55–0.65 | Partial overlap — shared vocabulary; may be intentional parallel structure |

When `max_similarity` is in the lower band, read both sections in full before
recommending consolidation.
