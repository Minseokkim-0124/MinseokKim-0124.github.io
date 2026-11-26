# Personal portfolio

This directory contains the published dark/light portfolio design. GitHub Actions first builds the existing Jekyll site, then `bin/build_portfolio.py` overlays these pages. This preserves existing PDF, publication, project, and other legacy URLs while replacing the home, Projects, CV, Publications, and Gallery pages.

- Edit homepage content in `index.html`, visual styling in `style.css`, and publication metadata in `papers.js` (keep it consistent with `_bibliography/papers.bib`).
- CV content comes from `_data/cv.yml`; the build fills the marked region in `cv/index.html`.
- Projects come from the research entries in `_projects/`; the build fills `projects/index.html`.
- Gallery photos and captions are in `assets/gallery/` and `gallery-data.js`.
- Shared navigation is in each HTML page; shared theme and clock behavior is in `site.js`.
- `cursor-magic.js` renders the silver-blue pointer trail, disabled on touch devices and when reduced motion is requested.
- The existing CV PDF remains at `/assets/pdf/Academic_Curriculum_Vitae.pdf`.

For a standalone local preview, install PyYAML, run `python bin/build_portfolio.py --output _site`, and serve `_site` with `python -m http.server 4173 --directory _site --bind 127.0.0.1`. The full deployment also retains the original Jekyll output.

Pushes to `main` deploy automatically using `.github/workflows/deploy.yml`. Only files in this directory and the generated CV/project content are overlaid; untracked draft PDFs in the repository root are not part of the redesign.

Navigation URLs and CSS/JS include a content version generated during the build, preventing old cached pages from mixing with a new design. `bin/check_portfolio.py --directory _site` checks all main routes, legacy project addresses, and gallery files before deployment and against the published branch.
