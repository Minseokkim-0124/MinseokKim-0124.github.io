import { Column, Text, Heading, Row } from "@once-ui-system/core";
import papers from "@/resources/papers.json";
export function PublicationList({ items = papers }: { items?: typeof papers }) {
  return (
    <Column fillWidth gap="32">
      {items.map((p) => (
        <Column as="article" key={p.key} id={`paper-${p.key}`} gap="8" className="publication">
          <Row gap="12">
            <Text variant="label-strong-s" onBackground="brand-weak">
              {p.venue} · {p.year}
            </Text>
          </Row>
          <Heading as="h3" variant="heading-strong-l">
            {p.title}
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
      ))}
    </Column>
  );
}
