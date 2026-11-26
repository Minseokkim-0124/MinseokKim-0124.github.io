"""Overlay the portfolio design on Jekyll output without removing existing URLs.

Usage: python bin/build_portfolio.py --output _site
Requires PyYAML. CV and project content stays in the existing Jekyll data files.
"""

import argparse
import html
import re
import shutil
from pathlib import Path

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
    section("Projects", "".join(entry(period(item), item["name"], item["summary"]) for item in data["Projects"]) + '<a class="text-link" href="/projects/">Explore research projects</a>')
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
        result.append(f'<article class="project-detail" id="{slug}">{media}<div class="delivery-content"><span class="eyebrow">{esc(item["period"])}</span><h2>{esc(item["title"])}</h2><p>{esc(item["role"])}</p><p class="funding">Funded by {esc(item["funder"])}.</p><div class="project-skills">{skills}</div></div></article>')
    return "".join(result)


def replace_content(path, name, content):
    page = path.read_text(encoding="utf-8")
    pattern = rf"<!-- {name}:start -->.*?<!-- {name}:end -->"
    page, count = re.subn(pattern, lambda _: f"<!-- {name}:start -->{content}<!-- {name}:end -->", page, flags=re.S)
    if count != 1:
        raise ValueError(f"Expected one {name} content region in {path}")
    path.write_text(page, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    output = parser.parse_args().output.resolve()
    if output == ROOT or output == SOURCE or SOURCE in output.parents:
        raise ValueError("Output must not overwrite the source repository or portfolio source")
    output.mkdir(parents=True, exist_ok=True)
    for file in SOURCE.rglob("*"):
        if not file.is_file():
            continue
        relative = file.relative_to(SOURCE)
        if relative.parts[0] != "assets" and file.suffix not in {".html", ".css", ".js"}:
            continue
        dest = output / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, dest)
    replace_content(output / "cv/index.html", "cv", render_cv())
    replace_content(output / "projects/index.html", "projects", render_projects())
    # Existing project-detail URLs continue to use the new design.
    for name in ("1_project", "2_project"):
        dest = output / "projects" / name / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(output / "projects/index.html", dest)
    (output / ".nojekyll").touch()
    print(f"Portfolio pages prepared in {output}")


if __name__ == "__main__":
    main()
