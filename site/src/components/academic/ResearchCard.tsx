import { Column, Heading, SmartLink, Text } from "@once-ui-system/core";
import papers from "@/resources/papers.json";
const media: Record<string, [string, string]> = {
  oh2026lidar: ["lidar.mp4", "lidar-poster.jpg"],
  jeong2026multimodal: ["distillation.mp4", "MMDD.png"],
  jeong2026zsc: ["zero-shot-coordination.mp4", "coordination-poster.jpg"],
  oh2026pointdps: ["point-dps.mp4", "point-dps-poster.jpg"],
};
export function ResearchCard({ paperKey }: { paperKey: string }) {
  const p = papers.find((p) => p.key === paperKey)!;
  const [video, poster] = media[paperKey];
  return (
    <Column as="article" fillWidth gap="16">
      <video
        className="research-video"
        controls
        muted
        playsInline
        preload="none"
        poster={`/assets/${poster}`}
        aria-label={`${p.title} — research video`}
      >
        <source src={`/assets/${video}`} type="video/mp4" />
      </video>
      <Text variant="label-strong-s" onBackground="brand-weak">
        {p.venue} · {p.year}
      </Text>
      <Heading as="h3" variant="heading-strong-xl">
        <SmartLink href={`/publications/#paper-${p.key}`}>{p.title}</SmartLink>
      </Heading>
    </Column>
  );
}
