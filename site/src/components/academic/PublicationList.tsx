import { Column, Text, Heading, Row, SmartLink } from "@once-ui-system/core";
import papers from "@/resources/papers.json";
type PublicationListProps = {
  items?: typeof papers;
  linkTitles?: boolean;
  yearHeading?: "h2" | "h3";
};

export function PublicationList({ items = papers, linkTitles = false, yearHeading = "h2" }: PublicationListProps) {
  const papersByYear: Record<string, typeof papers> = {};
  for (const paper of items) {
    (papersByYear[paper.year] ??= []).push(paper);
  }
  const years = Object.keys(papersByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <Column fillWidth gap="48">
      {years.map((year) => (
        <Column as="section" key={year} aria-labelledby={`publications-${year}`} fillWidth gap="24">
          <Heading as={yearHeading} id={`publications-${year}`} variant="heading-strong-xl" onBackground="brand-strong">
            {year}
          </Heading>
          {papersByYear[year].map((p) => (
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
                <Heading as={yearHeading === "h2" ? "h3" : "h4"} variant="heading-strong-l">
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
      ))}
    </Column>
  );
}
