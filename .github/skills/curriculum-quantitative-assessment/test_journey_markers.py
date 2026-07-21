from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
WORKSHOP_DIR = ROOT / "workshop"
ALLOWED_JOURNEYS = {"all", "ui", "terminal", "codespace", "local", "copilot"}
ALLOWED_ADVENTURES = {
    "core", "setup", "scenario-a", "scenario-b", "scenario-c", "scenario-d",
    "advanced", "side-quest",
}
# Section-level journey block opener: <!-- journey: X --> ... <!-- /journey -->
OPEN_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*journey:\s*([a-z,\s]+?)\s*-->\s*$")
CLOSE_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*/journey\s*-->\s*$")
# Page-level annotation comments (lines 1–2, no closing tag)
PAGE_JOURNEY_RE = re.compile(r"^<!--\s*page-journey:\s*([a-z,\s]+?)\s*-->\s*$")
PAGE_ADVENTURE_RE = re.compile(r"^<!--\s*page-adventure:\s*([a-z-]+)\s*-->\s*$")
NAV_RE = re.compile(
    r"^\s*(?:>\s*)?(?:\*\*Next(?: \(pick one\))?:\*\*|\*\*Return to:\*\*|Continue to \[|Return to \[|Go back to \[|Need a refresher .*Go back to \[)"
)
FORWARD_NAV_RE = re.compile(
    r"^\s*(?:>\s*)?\*\*Next:\*\*\s*(?:Open\s+)?\[[^\]]+\]\(([^)#?]+\.md)(?:#[^)]*)?\)\.?\s*$"
)
DEPRECATED_FORWARD_NAV_RE = re.compile(r"^\s*(?:>\s*)?Continue (?:to|with) \[")


class JourneyMarkerTests(unittest.TestCase):
    def test_page_annotations_present_and_valid(self) -> None:
        """Every workshop page must start with <!-- page-journey: X --> and <!-- page-adventure: Y -->."""
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                lines = path.read_text(encoding="utf-8").splitlines()
                self.assertGreaterEqual(len(lines), 2, f"{path.name} must have at least 2 lines")

                journey_match = PAGE_JOURNEY_RE.match(lines[0])
                self.assertIsNotNone(
                    journey_match,
                    f"Line 1 of {path.name} must be a page-level journey annotation: <!-- page-journey: X -->",
                )
                if journey_match is None:
                    continue
                journey_values = [v.strip() for v in journey_match.group(1).split(",")]
                invalid_journey = [v for v in journey_values if v not in ALLOWED_JOURNEYS]
                self.assertFalse(
                    invalid_journey,
                    f"Invalid journey value(s) in {path.name}: {invalid_journey}",
                )

                adventure_match = PAGE_ADVENTURE_RE.match(lines[1])
                self.assertIsNotNone(
                    adventure_match,
                    f"Line 2 of {path.name} must be a page-level adventure annotation: <!-- page-adventure: Y -->",
                )
                if adventure_match is None:
                    continue
                adventure_value = adventure_match.group(1).strip()
                self.assertIn(
                    adventure_value,
                    ALLOWED_ADVENTURES,
                    f"Invalid adventure value in {path.name}: {adventure_value!r}",
                )

    def test_journey_markers_have_valid_syntax_and_are_balanced(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                text = path.read_text(encoding="utf-8")
                self.assertIn("<!-- page-journey:", text, "Every workshop page must include a page-journey annotation")

                stack: list[int] = []
                for line_number, line in enumerate(text.splitlines(), start=1):
                    # Lines 1–2 are page-level annotations (<!-- page-journey: X --> / <!-- page-adventure: Y -->)
                    # and cannot match OPEN_RE, so no skip is needed. The section-level OPEN_RE only
                    # matches <!-- journey: X --> (no "page-" prefix).
                    opener = OPEN_RE.match(line)
                    if opener:
                        self.assertFalse(stack, f"Nested journey marker in {path.name}:{line_number}")
                        values = [value.strip() for value in opener.group(1).split(",")]
                        self.assertTrue(all(values), f"Empty journey value in {path.name}:{line_number}")
                        self.assertEqual(
                            len(values),
                            len(set(values)),
                            f"Duplicate journey value in {path.name}:{line_number}",
                        )
                        invalid = [value for value in values if value not in ALLOWED_JOURNEYS]
                        self.assertFalse(invalid, f"Invalid journey value in {path.name}:{line_number}: {invalid}")
                        stack.append(line_number)
                        continue

                    if CLOSE_RE.match(line):
                        self.assertTrue(stack, f"Closing journey marker without opener in {path.name}:{line_number}")
                        stack.pop()

                if stack:
                    self.fail(f"Unclosed journey marker in {path.name}:{stack[-1]}")

    def test_navigation_blocks_are_wrapped_by_journey_markers(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                depth = 0
                lines = path.read_text(encoding="utf-8").splitlines()
                for line_number, line in enumerate(lines, start=1):
                    # Page-level annotations (<!-- page-journey: X --> / <!-- page-adventure: Y -->) on lines 1–2
                    # do not match OPEN_RE, so no special skip is needed here.
                    if OPEN_RE.match(line):
                        depth += 1

                    if NAV_RE.match(line):
                        self.assertGreater(
                            depth,
                            0,
                            f"Navigation line must be inside a journey marker in {path.name}:{line_number}",
                        )

                    if CLOSE_RE.match(line):
                        depth -= 1

    def test_forward_navigation_lines_match_build_docs_parser(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                lines = path.read_text(encoding="utf-8").splitlines()
                for line_number, line in enumerate(lines, start=1):
                    stripped = line.strip()
                    if stripped.startswith("**Next:**"):
                        self.assertRegex(
                            line,
                            FORWARD_NAV_RE,
                            f"Forward navigation line must use the build-docs format in {path.name}:{line_number}",
                        )

    def test_deprecated_forward_navigation_phrases_are_not_used(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                lines = path.read_text(encoding="utf-8").splitlines()
                for line_number, line in enumerate(lines, start=1):
                    self.assertIsNone(
                        DEPRECATED_FORWARD_NAV_RE.match(line),
                        f"Use '**Next:** [Title](file.md)' instead of deprecated forward-navigation phrasing in {path.name}:{line_number}",
                    )


if __name__ == "__main__":
    unittest.main()
