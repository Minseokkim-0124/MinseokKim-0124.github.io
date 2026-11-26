import { baseURL } from "@/resources";
export const dynamic = "force-static";
export default function sitemap() {
  return ["/", "/about/", "/publications/", "/projects/", "/cv/", "/gallery/", "/work/autonomous-delivery/", "/work/quadrupedal-robot/"].map(
    (path) => ({ url: `${baseURL}${path}` })
  );
}
