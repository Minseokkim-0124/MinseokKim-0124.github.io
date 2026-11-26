import { Column, Text, Heading, Row, SmartLink } from "@once-ui-system/core";
import papers from "@/resources/papers.json";
export function PublicationList({ items = papers, linkTitles = false }: { items?: typeof papers; linkTitles?: boolean }) {
  return (
    <Column fillWidth gap="32">
      {items.map((p) => (
        <Row
          as="article"
          key={p.key}
          id={`paper-${p.key}`}
          gap="24"
          s={{ direction: "column" }}
          vertical="center"
          fillWidth
          paddingTop="24"
          borderTop="neutral-alpha-medium"
          className="publication"
        >
          <Column flex={1} fillWidth gap="8">
            <Text variant="label-strong-s" onBackground="brand-weak">
              {p.venue} · {p.year}
            </Text>
            <Heading as="h3" variant="heading-strong-l">
              {linkTitles ? <SmartLink href={`/publications/#paper-${p.key}`}>{p.title}</SmartLink> : p.title}
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {p.authors.split(" and ").map((author, i) => (
                <span key={i}>
                  {i > 0 ? ", " : ""}
                  {author.startsWith("Minseok Kim") ? <strong className="author-name">{author}</strong> : author}
                </span>
              ))}
            </Text>
          </Column>
          {p.video && (
            <Column flex={1} fillWidth>
              <video
                className="research-video"
                controls
                muted
                playsInline
                preload="none"
                poster={p.video.poster}
                aria-label={`${p.title} — research video`}
              >
                <source src={p.video.src} type="video/mp4" />
              </video>
            </Column>
          )}
        </Row>
      ))}
    </Column>
  );
}
