import Project, { generateMetadata as projectMetadata } from "@/app/work/[slug]/page";
export function generateMetadata() {
  return projectMetadata({ params: Promise.resolve({ slug: "autonomous-delivery" }) });
}
export default function LegacyProject() {
  return <Project params={Promise.resolve({ slug: "autonomous-delivery" })} />;
}
