import { writeFile, mkdir, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../out/", import.meta.url));
await writeFile(path.join(root, ".nojekyll"), "");
// Preserve bookmarked legacy .html URLs while rendering only the new template.
for (const route of ["gallery", "cv", "projects", "publications", "about"]) {
  await writeFile(
    path.join(root, `${route}.html`),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/${route}/"><link rel="canonical" href="https://minseokkim-0124.github.io/${route}/"><title>Minseok Kim</title></head><body><a href="/${route}/">Continue to ${route}</a><script>location.replace('/${route}/'+location.search+location.hash)</script></body></html>`
  );
}
await mkdir(path.join(root, "assets/video"), { recursive: true });
await cp(path.join(root, "assets/autonomous-delivery.mp4"), path.join(root, "assets/video/project_motie.mp4"));
console.log("Static export ready; legacy page and video URLs preserved.");
