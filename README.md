# Minseok Kim — academic portfolio

Live website: [minseokkim-0124.github.io](https://minseokkim-0124.github.io/)

The published site now uses the **official [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio)** template with Next.js and Once UI. The application source is in [`site/`](site/), based on upstream version 2.3.0. See [template provenance and modifications](site/TEMPLATE-NOTICE.md).

## Local development

Use Node.js 22 or newer.

```sh
cd site
npm ci
npm run dev
```

To build the same files that GitHub Pages serves:

```sh
npm run build
python scripts/check_export.py --directory out
```

## Editing content

| Content                              | Source                                          |
| ------------------------------------ | ----------------------------------------------- |
| Identity, links, About page          | `site/src/resources/content.tsx`                |
| Full research introduction           | `site/src/components/academic/Introduction.tsx` |
| Publications and preprints           | `site/src/resources/papers.json`                |
| CV, including military service       | `site/src/resources/cv.json`                    |
| Research projects                    | `site/src/app/work/projects/*.mdx`              |
| Gallery photo order and descriptions | `site/src/resources/gallery.json`               |
| Images, videos and downloadable CV   | `site/public/assets/`                           |
| Appearance and template options      | `site/src/resources/once-ui.config.ts`          |

The site includes 10 publications, 5 videos, 2 research projects and 24 gallery photos. Spatializing Frozen Video-to-Audio Generators is listed as a preprint with Minseok Kim and Kuk-Jin Yoon; its submission PDF is intentionally not published. The existing CV PDF is preserved separately from the updated web CV.

## Publishing

Push application changes to `main`. The **Deploy site** workflow builds `site/out`, validates the exported pages and media, and publishes that output to the existing `gh-pages` branch. The website address stays the same. GitHub fork metadata is independent of the source template; no repository replacement is required.

Legacy `.html` page URLs and both original project URLs are retained. Unknown routes use the new template’s 404 page.

Earlier Jekyll/al-folio content and the previous custom `portfolio/` implementation remain in the repository for reference, but are **not built or deployed**. Edit `site/` for the current website. Unpublished manuscripts and original large videos are not included in the public export.

## Credits

Magic Portfolio by [Once UI](https://once-ui.com/products/magic-portfolio), licensed under [CC BY-NC 4.0](site/LICENSE). Academic pages, content, gallery controls and GitHub Pages deployment have been adapted for Minseok Kim. Legacy al-folio files retain their original license.
