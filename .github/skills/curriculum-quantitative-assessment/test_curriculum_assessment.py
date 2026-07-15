from __future__ import annotations

import unittest

from curriculum_assessment import DIMENSIONS, score_markdown


SAMPLE_MARKDOWN = """# Example Step

## 📋 Before You Start

- Install the CLI.

## Try it

Run `gh aw compile`.

```bash
gh aw compile
```

## ✅ Checkpoint

- [ ] You ran the command
- [ ] You verified the output
"""


class ScoreMarkdownTests(unittest.TestCase):
    def test_dimension_scores_are_emitted_at_top_level(self) -> None:
        scored = score_markdown(SAMPLE_MARKDOWN, "example.md")

        for dimension in DIMENSIONS:
            self.assertIn(dimension, scored)
            self.assertEqual(scored[dimension], scored["dim_scores"][dimension])

        weighted_sum = sum(scored["dim_scores"][dimension] * weight for dimension, weight in DIMENSIONS.items())
        expected_overall = round(weighted_sum / sum(DIMENSIONS.values()), 2)
        self.assertEqual(scored["overall_score"], expected_overall)


if __name__ == "__main__":
    unittest.main()
