#!/usr/bin/env python3
"""Run dependency-free consistency checks before publishing the static site."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
ROOT_PAGES = sorted(ROOT.glob("*.html"))
ALL_PAGES = sorted(ROOT.rglob("*.html"))
ATTR_PATTERN = re.compile(r"(?:href|src)=\"([^\"]+)\"")
NAV_PATTERN = re.compile(r"<nav class=\"nav\".*?</nav>", re.DOTALL)
FOOTER_PATTERN = re.compile(r"<footer class=\"site-footer\">.*?</footer>", re.DOTALL)
CSS_URL_PATTERN = re.compile(r"url\((?:['\"])?([^)'\"]+)")


def compact(markup: str) -> str:
    markup = re.sub(r"\s+", " ", markup).strip()
    return re.sub(r">\s+<", "><", markup)


def local_target(source: Path, reference: str) -> Path | None:
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc or reference.startswith(("#", "mailto:", "tel:", "data:")):
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    return (source.parent / path).resolve()


def main() -> int:
    errors: list[str] = []

    nav_reference: str | None = None
    footer_reference: str | None = None
    css_versions: set[str] = set()
    speaker_script_versions: set[str] = set()

    for page in ROOT_PAGES:
        text = page.read_text(encoding="utf-8")

        nav_match = NAV_PATTERN.search(text)
        footer_match = FOOTER_PATTERN.search(text)
        if not nav_match:
            errors.append(f"{page.name}: primary navigation not found")
        else:
            current_nav = compact(nav_match.group(0))
            nav_reference = nav_reference or current_nav
            if current_nav != nav_reference:
                errors.append(f"{page.name}: primary navigation differs from the shared version")

        if not footer_match:
            errors.append(f"{page.name}: site footer not found")
        else:
            current_footer = compact(footer_match.group(0))
            footer_reference = footer_reference or current_footer
            if current_footer != footer_reference:
                errors.append(f"{page.name}: footer differs from the shared version")

        css_match = re.search(r"css/style\.css\?v=([^\"']+)", text)
        if not css_match:
            errors.append(f"{page.name}: versioned shared stylesheet not found")
        else:
            css_versions.add(css_match.group(1))

        speaker_script_match = re.search(r"js/speakers\.js\?v=([^\"']+)", text)
        if speaker_script_match:
            speaker_script_versions.add(speaker_script_match.group(1))

        if re.search(r"\bDr (?=[A-Z])", text):
            errors.append(f"{page.name}: use 'Dr.' with a full stop")

    if len(css_versions) != 1:
        errors.append(f"shared stylesheet versions are inconsistent: {sorted(css_versions)}")
    if speaker_script_versions and speaker_script_versions != css_versions:
        errors.append(
            "speaker loader and stylesheet versions differ: "
            f"{sorted(speaker_script_versions)} versus {sorted(css_versions)}"
        )

    for page in ALL_PAGES:
        text = page.read_text(encoding="utf-8")
        for reference in ATTR_PATTERN.findall(text):
            target = local_target(page, reference)
            if target is not None and not target.exists():
                errors.append(f"{page.relative_to(ROOT)}: missing local target {reference}")

    stylesheet = ROOT / "css" / "style.css"
    css_text = stylesheet.read_text(encoding="utf-8")
    for reference in CSS_URL_PATTERN.findall(css_text):
        target = local_target(stylesheet, reference)
        if target is not None and not target.exists():
            errors.append(f"css/style.css: missing local asset {reference}")

    try:
        json.loads((ROOT / "speakers-data.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"speakers-data.json: {exc}")

    if errors:
        print("Site checks failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"Site checks passed: {len(ROOT_PAGES)} pages, shared navigation/footer, "
        f"local assets, stylesheet version {next(iter(css_versions))}, and speaker JSON."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
