"""Check the published portfolio routes and their local links/assets."""

import argparse
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROUTES = (
    "index.html",
    "gallery/index.html",
    "gallery.html",
    "cv/index.html",
    "projects/index.html",
    "projects/1_project/index.html",
    "projects/2_project/index.html",
    "publications/index.html",
    "404.html",
)


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for key in ("href", "src", "poster"):
            if key in attrs:
                self.references.append(attrs[key])


def check(directory):
    errors = []
    reference_count = 0
    for route in ROUTES:
        path = directory / route
        if not path.is_file():
            errors.append(f"Missing route: {route}")
            continue
        text = path.read_text(encoding="utf-8")
        if not re.search(r'cursor-magic\.js\?v=[a-f0-9]+', text):
            errors.append(f"Missing current design/version: {route}")
        page = Page()
        page.feed(text)
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc or not url.path:
                continue
            target = directory / unquote(url.path).lstrip("/") if url.path.startswith("/") else path.parent / unquote(url.path)
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"Broken local reference in {route}: {reference}")
            reference_count += 1
    gallery_data = (directory / "gallery-data.js").read_text(encoding="utf-8")
    gallery_assets = re.findall(r'"(/assets/gallery/[^"\s]+)"', gallery_data)
    for asset in gallery_assets:
        if not (directory / asset.lstrip("/")).is_file():
            errors.append(f"Missing gallery photo: {asset}")
    if not gallery_assets:
        errors.append("Gallery data contains no photographs")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Verified {len(ROUTES)} portfolio routes, {reference_count} local links/assets, and {len(gallery_assets)} gallery assets.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", required=True, type=Path)
    check(parser.parse_args().directory.resolve())
