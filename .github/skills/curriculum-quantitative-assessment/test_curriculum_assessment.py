from __future__ import annotations

import unittest

from curriculum_assessment import DIMENSIONS, DISPATCHER_DIMENSIONS, is_non_learning_page, score_markdown


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

DISPATCHER_MARKDOWN = """# Choose Your Path

<!-- learning:false -->

Pick the adventure that suits you.

- [Adventure A](10a.md)
- [Adventure B](10b.md)

<!-- journey: all -->
**Next:** Choose one of the adventures above.
<!-- /journey -->
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

    def test_is_learning_page_true_for_regular_page(self) -> None:
        scored = score_markdown(SAMPLE_MARKDOWN, "example.md")
        self.assertTrue(scored["is_learning_page"])

    def test_is_learning_page_false_for_dispatcher_page(self) -> None:
        scored = score_markdown(DISPATCHER_MARKDOWN, "dispatcher.md")
        self.assertFalse(scored["is_learning_page"])

    def test_dispatcher_page_uses_dispatcher_weights(self) -> None:
        scored = score_markdown(DISPATCHER_MARKDOWN, "dispatcher.md")
        weighted_sum = sum(scored["dim_scores"][dimension] * weight for dimension, weight in DISPATCHER_DIMENSIONS.items())
        expected_overall = round(weighted_sum / sum(DISPATCHER_DIMENSIONS.values()), 2)
        self.assertEqual(scored["overall_score"], expected_overall)


class IsNonLearningPageTests(unittest.TestCase):
    def test_returns_false_for_regular_page(self) -> None:
        self.assertFalse(is_non_learning_page(SAMPLE_MARKDOWN))

    def test_returns_true_for_bare_tag(self) -> None:
        self.assertTrue(is_non_learning_page("<!-- learning:false -->"))

    def test_returns_true_case_insensitive(self) -> None:
        self.assertTrue(is_non_learning_page("<!-- Learning:False -->"))

    def test_returns_true_with_extra_whitespace(self) -> None:
        self.assertTrue(is_non_learning_page("<!--   learning : false   -->"))

    def test_returns_false_when_absent(self) -> None:
        self.assertFalse(is_non_learning_page("# Normal page\n\nSome content.\n"))


if __name__ == "__main__":
    unittest.main()
