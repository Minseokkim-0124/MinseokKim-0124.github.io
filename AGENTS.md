# Portfolio maintenance

The active website is the official Magic Portfolio app in `site/` (Next.js + Once UI). This supersedes the Jekyll build instructions for the current deployed site. Historical al-folio files and `portfolio/` remain as reference only.

- Read `site/.agents` for Once UI component and layout conventions.
- Edit identity/About content in `site/src/resources/content.tsx`, the shared research introduction in `site/src/components/academic/Introduction.tsx`, publications in `papers.json`, and CV data in `cv.json`.
- Build with `npm ci` and `npm run build` inside `site/` (Node 22+). Run `python scripts/check_export.py --directory out` and verify relevant pages in a browser.
- Before commits run `npx prettier . --write` at repository root. Keep the formatter check passing.
- Stage explicit paths, use Conventional Commits, and never stage unpublished manuscript PDFs or original large videos.
- Preserve existing URLs, content, gallery photos, video playback and the required Once UI attribution.
- Only `site/out` is deployed. Do not re-enable the legacy Jekyll overlay.
- Docker/Jekyll guidance in `.github/copilot-instructions.md` applies only if working on the archived al-folio implementation.
