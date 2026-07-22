#!/usr/bin/env python3
"""Optimize workshop images for download size.

Resizes images wider than MAX_WIDTH to MAX_WIDTH and re-compresses them at
the highest PNG compression level.  Run from the repository root:

    python3 scripts/optimize-images.py [glob ...]

If no glob patterns are given the default target is workshop/images/*.png.
"""

import argparse
import glob as glob_module
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Pillow is required.  Install it with:  pip install pillow", file=sys.stderr)
    sys.exit(1)

MAX_WIDTH = 1400  # pixels – sufficient for 2× retina on a ~700 px content area


def optimize(path: str, max_width: int = MAX_WIDTH, dry_run: bool = False) -> None:
    before = os.path.getsize(path)
    img = Image.open(path)

    if img.width > max_width:
        new_height = round(img.height * max_width / img.width)
        img = img.resize((max_width, new_height), Image.LANCZOS)
        resized = True
    else:
        resized = False

    if dry_run:
        print(
            f"[dry-run] {path}: {before // 1024} KB"
            + (f" → would resize to {max_width}×{img.height}" if resized else "")
        )
        return

    img.save(path, "PNG", optimize=True, compress_level=9)
    after = os.path.getsize(path)
    savings = (1 - after / before) * 100
    tag = f" (resized to {img.width}×{img.height})" if resized else ""
    print(f"{path}: {before // 1024} KB → {after // 1024} KB  ({savings:.0f}% savings){tag}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "patterns",
        nargs="*",
        default=["workshop/images/*.png"],
        metavar="GLOB",
        help="Glob patterns of PNG files to optimize (default: workshop/images/*.png)",
    )
    parser.add_argument(
        "--max-width",
        type=int,
        default=MAX_WIDTH,
        help=f"Maximum image width in pixels (default: {MAX_WIDTH})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report what would change without modifying files",
    )
    args = parser.parse_args()

    paths = []
    for pattern in args.patterns:
        matched = glob_module.glob(pattern, recursive=True)
        if not matched:
            print(f"Warning: no files matched '{pattern}'", file=sys.stderr)
        paths.extend(matched)

    if not paths:
        print("No files to process.", file=sys.stderr)
        sys.exit(1)

    for path in sorted(set(paths)):
        try:
            optimize(path, max_width=args.max_width, dry_run=args.dry_run)
        except Exception as exc:
            print(f"Error processing {path}: {exc}", file=sys.stderr)


if __name__ == "__main__":
    main()
