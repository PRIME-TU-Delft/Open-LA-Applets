#!/usr/bin/env python3
"""
Scan TUDelft-PRIME-Books repositories for {applet} directive usage
and output a JSON file listing which applets are referenced in each book.
"""

import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

BOOKS = [
    {
        "name": "Linear-Algebra",
        "repo": "https://github.com/TUDelft-PRIME-Books/Linear-Algebra.git",
    },
    {
        "name": "Calculus",
        "repo": "https://github.com/TUDelft-PRIME-Books/Calculus.git",
    },
]

# Regex to match {applet} directive blocks and extract key-value options
APPLET_DIRECTIVE_RE = re.compile(
    r"\{applet\}\s*\n((?:\s*:[\w-]+:.*\n)+)", re.MULTILINE
)
OPTION_RE = re.compile(r":(\w[\w-]*):\s*(.*)")


def clone_repo(repo_url: str, dest: str) -> bool:
    """Shallow-clone a repository. Returns True on success."""
    result = subprocess.run(
        ["git", "clone", "--depth", "1", repo_url, dest],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Warning: failed to clone {repo_url}: {result.stderr}", file=sys.stderr)
        return False
    return True


def find_applet_usages(book_dir: str) -> list[dict]:
    """Scan all files in book_dir for {applet} directives."""
    applets = []
    book_path = Path(book_dir)

    for filepath in book_path.rglob("*"):
        if not filepath.is_file():
            continue
        if filepath.suffix not in (".md", ".rst", ".txt", ".myst", ""):
            continue

        try:
            content = filepath.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for match in APPLET_DIRECTIVE_RE.finditer(content):
            options_block = match.group(1)
            options = {}
            for opt_match in OPTION_RE.finditer(options_block):
                options[opt_match.group(1)] = opt_match.group(2).strip()

            if "url" not in options:
                continue

            applets.append(
                {
                    "url": options["url"],
                    "title": options.get("title", ""),
                    "name": options.get("name", ""),
                    "source_file": str(filepath.relative_to(book_path)),
                }
            )

    return applets


def main():
    output_path = (
        Path(__file__).resolve().parent.parent / "static" / "book-applets.json"
    )

    result = {}

    with tempfile.TemporaryDirectory() as tmpdir:
        for book in BOOKS:
            dest = os.path.join(tmpdir, book["name"])
            print(f"Cloning {book['name']}...")
            if not clone_repo(book["repo"], dest):
                result[book["name"]] = {"error": "clone failed", "applets": []}
                continue

            applets = find_applet_usages(dest)
            print(f"  Found {len(applets)} applet reference(s) in {book['name']}")

            # Deduplicate by url, keep all source files
            seen: dict[str, dict] = {}
            for a in applets:
                url = a["url"]
                if url in seen:
                    if a["source_file"] not in seen[url]["source_files"]:
                        seen[url]["source_files"].append(a["source_file"])
                else:
                    seen[url] = {
                        "url": url,
                        "title": a["title"],
                        "name": a["name"],
                        "source_files": [a["source_file"]],
                    }

            result[book["name"]] = {
                "applets": sorted(seen.values(), key=lambda x: x["url"])
            }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nWritten to {output_path}")


if __name__ == "__main__":
    main()
