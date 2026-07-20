from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
WORKSHOP_DIR = ROOT / "workshop"
ALLOWED_JOURNEYS = {"all", "ui", "terminal", "codespace", "local", "copilot"}
OPEN_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*journey:\s*([a-z,\s]+?)\s*-->\s*$")
CLOSE_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*/journey\s*-->\s*$")
NAV_RE = re.compile(
    r"^\s*(?:>\s*)?(?:\*\*Next(?: \(pick one\))?:\*\*|\*\*Return to:\*\*|Continue to \[|Return to \[|Go back to \[|Need a refresher .*Go back to \[)"
)

ALLOWED_EXPERIENCES = {"workshop", "standalone"}
EXP_OPEN_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*experience:\s*([a-z]+)\s*-->\s*$")
EXP_CLOSE_RE = re.compile(r"^\s*(?:>\s*)?<!--\s*/experience\s*-->\s*$")


class JourneyMarkerTests(unittest.TestCase):
    def test_journey_markers_have_valid_syntax_and_are_balanced(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                text = path.read_text(encoding="utf-8")
                self.assertIn("<!-- journey:", text, "Every workshop page must include journey markers")

                stack: list[int] = []
                for line_number, line in enumerate(text.splitlines(), start=1):
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
                for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
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


class ExperienceMarkerTests(unittest.TestCase):
    def test_experience_markers_have_valid_syntax_and_are_balanced(self) -> None:
        for path in sorted(WORKSHOP_DIR.glob("*.md")):
            if path.name == "README.md":
                continue

            with self.subTest(file=path.name):
                stack: list[int] = []
                for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
                    opener = EXP_OPEN_RE.match(line)
                    if opener:
                        self.assertFalse(stack, f"Nested experience marker in {path.name}:{line_number}")
                        raw = opener.group(1).strip()
                        self.assertNotIn(
                            ",",
                            raw,
                            f"Experience marker accepts exactly one value (no comma-separated list) in {path.name}:{line_number}",
                        )
                        self.assertIn(
                            raw,
                            ALLOWED_EXPERIENCES,
                            f"Invalid experience value '{raw}' in {path.name}:{line_number}",
                        )
                        stack.append(line_number)
                        continue

                    if EXP_CLOSE_RE.match(line):
                        self.assertTrue(
                            stack, f"Closing experience marker without opener in {path.name}:{line_number}"
                        )
                        stack.pop()

                if stack:
                    self.fail(f"Unclosed experience marker in {path.name}:{stack[-1]}")


if __name__ == "__main__":
    unittest.main()
