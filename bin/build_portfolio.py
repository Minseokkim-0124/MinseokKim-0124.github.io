"""Overlay the portfolio design on Jekyll output without removing existing URLs.

Usage: python bin/build_portfolio.py --output _site
Requires PyYAML. CV and project content stays in the existing Jekyll data files.
"""

import argparse
import html
import hashlib
import re
import shutil
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import yaml


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "portfolio"


def esc(value):
    return html.escape(str(value))


def bullets(values):
    return "<ul>" + "".join(f"<li>{esc(value)}</li>" for value in values) + "</ul>" if values else ""


def entry(date, title, subtitle="", details=()):
    return (
        f'<article class="cv-entry"><time>{esc(date)}</time><div><h3>{esc(title)}</h3>'
        + (f"<p>{esc(subtitle)}</p>" if subtitle else "")
        + bullets(details)
        + "</div></article>"
    )


def period(item):
    start, end = item.get("start_date", ""), item.get("end_date", "")
    return str(start) if start == end else f"{start} – {end}"


def render_cv():
    cv = yaml.safe_load((ROOT / "_data/cv.yml").read_text(encoding="utf-8"))["cv"]
    data = cv["sections"]
    sections = []

    def section(title, body):
        slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        sections.append((slug, title, f'<section class="cv-section" id="{slug}"><h2>{title}</h2>{body}</section>'))

    contacts = [("Name", cv["name"]), ("Title", cv["headline"]), ("Email", cv["email"]), ("Phone", cv["phone"]), ("Location", cv["location"])]
    contact_html = '<dl class="cv-contact">'
    for label, value in contacts:
        display = f'<a href="mailto:{esc(value)}">{esc(value)}</a>' if label == "Email" else esc(value)
        contact_html += f"<dt>{label}</dt><dd>{display}</dd>"
    contact_html += "</dl>" + "".join(f"<p>{esc(line)}</p>" for line in data["Summary"])
    section("Contact", contact_html)
    section("Education", "".join(entry(period(item), item["studyType"] + " · " + item["institution"], item["area"] + " · " + item["location"], item.get("highlights", [])) for item in data["Education"]))
    section("Experience", "".join(entry(period(item), item["position"], item["company"] + " · " + item["location"], item.get("highlights", [])) for item in data["Experience"]))
    section("Research interests", '<div class="research-areas"><span>Multimodal AI</span><span>3D Understanding</span><span>AR/VR Applications</span></div>')
    section("Publications", "".join(entry(item["releaseDate"], item["title"], item["publisher"], [item["summary"]]) for item in data["Publications"]) + '<a class="text-link" href="/#publications">View all publications and preprints</a>')
    section("Projects", "".join(entry(period(item), item["name"], item["summary"], item.get("highlights", [])) for item in data["Projects"]) + '<a class="text-link" href="/projects/">Explore research projects</a>')
    section("Honors and Awards", "".join(entry(item["date"], item["name"], item["location"]) for item in data["Honors and Awards"]))
    for title in ("Extracurricular Activities", "Academic Services"):
        section(title, bullets([item["bullet"] for item in data[title]]))
    section("Languages", '<dl class="cv-contact">' + "".join(f'<dt>{esc(item["name"])}</dt><dd>{esc(item["summary"])}</dd>' for item in data["Languages"]) + "</dl>")
    nav = '<nav class="cv-index" aria-label="CV sections">' + "".join(f'<a href="#{slug}">{title}</a>' for slug, title, _ in sections) + "</nav>"
    return '<div class="cv-layout">' + nav + '<div class="cv-content">' + "".join(body for _, _, body in sections) + "</div></div>"


def render_projects():
    projects = []
    for file in (ROOT / "_projects").glob("*.md"):
        item = yaml.safe_load(file.read_text(encoding="utf-8").split("---", 2)[1])
        if item.get("category") == "research":
            projects.append(item)
    result = []
    for item in sorted(projects, key=lambda item: item["start_sort"], reverse=True):
        delivery = "Unmanned Autonomous Delivery" in item["title"]
        slug = "autonomous-delivery" if delivery else "quadrupedal-robot"
        media = '<div class="delivery-media"><video controls muted playsinline preload="none" poster="/assets/delivery-poster.jpg" aria-label="Unmanned autonomous delivery project video"><source src="/assets/autonomous-delivery.mp4" type="video/mp4"></video></div>' if delivery else ""
        skills = "".join(f"<span>{esc(skill.strip())}</span>" for skill in item["skills"].split(","))
        sensors = f'<p class="project-sensors"><strong>Sensors</strong> · {esc(item["sensors"])}</p>' if item.get("sensors") else ""
        result.append(f'<article class="project-detail" id="{slug}">{media}<div class="delivery-content"><span class="eyebrow">{esc(item["period"])}</span><h2>{esc(item["title"])}</h2><p>{esc(item["role"])}</p><p class="funding">Funded by {esc(item["funder"])}.</p>{sensors}<div class="project-skills">{skills}</div></div></article>')
    return "".join(result)


def replace_content(path, name, content):
    page = path.read_text(encoding="utf-8")
    pattern = rf"<!-- {name}:start -->.*?<!-- {name}:end -->"
    page, count = re.subn(pattern, lambda _: f"<!-- {name}:start -->{content}<!-- {name}:end -->", page, flags=re.S)
    if count != 1:
        raise ValueError(f"Expected one {name} content region in {path}")
    path.write_text(page, encoding="utf-8")


def version_page_links(output, pages):
    """Give internal navigation and CSS/JS fresh URLs after a content change.

    GitHub Pages caches HTML for ten minutes. A design migration otherwise can
    mix newly loaded homepages with old cached destination pages or scripts.
    Canonical URLs, same-page anchors and large media URLs stay unchanged.
    """
    hasher = hashlib.sha256()
    for path in sorted(set(pages) | set(output.glob("*.js")) | set(output.glob("*.css"))):
        hasher.update(str(path.relative_to(output)).encode())
        hasher.update(path.read_bytes())
    version = hasher.hexdigest()[:12]
    routes = {"/", "/index.html", "/404.html"}
    for page in pages:
        route = "/" + page.relative_to(output).as_posix()
        routes.add(route)
        if route.endswith("/index.html"):
            routes.add(route[:-10])
    for page in pages:
        content = page.read_text(encoding="utf-8")

        def stamp(match):
            attribute, value = match.group(1), html.unescape(match.group(2))
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path.startswith("/"):
                return match.group(0)
            if url.path not in routes and Path(url.path).suffix not in {".js", ".css"}:
                return match.group(0)
            query = dict(parse_qsl(url.query))
            query["v"] = version
            result = urlunsplit(("", "", url.path, urlencode(query), url.fragment))
            return f'{attribute}="{esc(result)}"'

        content = re.sub(r'(href|src)="([^"]+)"', stamp, content)
        page.write_text(content, encoding="utf-8")
    return version


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    output = parser.parse_args().output.resolve()
    if output == ROOT or output == SOURCE or SOURCE in output.parents:
        raise ValueError("Output must not overwrite the source repository or portfolio source")
    output.mkdir(parents=True, exist_ok=True)
    pages = []
    for file in SOURCE.rglob("*"):
        if not file.is_file():
            continue
        relative = file.relative_to(SOURCE)
        if relative.parts[0] != "assets" and file.suffix not in {".html", ".css", ".js"}:
            continue
        dest = output / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, dest)
        if file.suffix == ".html":
            pages.append(dest)
    replace_content(output / "cv/index.html", "cv", render_cv())
    replace_content(output / "projects/index.html", "projects", render_projects())
    # Existing project-detail URLs continue to use the new design.
    for name in ("1_project", "2_project"):
        dest = output / "projects" / name / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(output / "projects/index.html", dest)
        pages.append(dest)
    version = version_page_links(output, pages)
    (output / ".nojekyll").touch()
    print(f"Portfolio pages prepared in {output} (version {version})")


if __name__ == "__main__":
    main()
