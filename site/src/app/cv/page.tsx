import { Column, Row, Heading, Text, Button, SmartLink, Tag } from "@once-ui-system/core";
import cv from "@/resources/cv.json";
import { PublicationList } from "@/components/academic/PublicationList";
export const metadata = {
  title: "Curriculum vitae — Minseok Kim",
  description: "Education, research, experience, and service of Minseok Kim, KAIST VILAB.",
  alternates: { canonical: "/cv/" },
};
type Entry = Record<string, unknown>;
const sections = Object.entries(cv.sections) as [string, Entry[] | string[]][];
function EntryView({ entry }: { entry: Entry | string }) {
  if (typeof entry === "string") return <Text variant="body-default-m">{entry}</Text>;
  const title = String(entry.institution || entry.company || entry.title || entry.name || entry.bullet || "");
  const period = entry.start_date ? `${entry.start_date} – ${entry.end_date}` : entry.date ? String(entry.date) : "";
  const subtitle = entry.studyType ? `${entry.studyType} in ${entry.area}` : String(entry.position || "");
  return (
    <Column gap="8" fillWidth>
      <Row horizontal="between" gap="16" wrap>
        <Heading as="h3" variant="heading-strong-m" style={{ flex: "1 1 20rem" }}>
          {title}
        </Heading>
        {period && <Text onBackground="neutral-weak">{period}</Text>}
      </Row>
      {subtitle && <Text onBackground="brand-weak">{subtitle}</Text>}
      {[entry.location, entry.publisher, entry.summary].filter(Boolean).map((text, i) => (
        <Text key={i} onBackground="neutral-weak" variant="body-default-m">
          {String(text)}
        </Text>
      ))}
      {Array.isArray(entry.highlights) && (
        <Column as="ul" gap="8" style={{ paddingLeft: "1.25rem", margin: 0 }}>
          {entry.highlights.map((text, i) => (
            <Text as="li" key={i} variant="body-default-m">
              {String(text)}
            </Text>
          ))}
        </Column>
      )}
      {Array.isArray(entry.keywords) && (
        <Row gap="8" wrap>
          {entry.keywords.map((tag, i) => (
            <Tag size="l" key={i}>
              {String(tag)}
            </Tag>
          ))}
        </Row>
      )}
    </Column>
  );
}
export default function CV() {
  return (
    <Column maxWidth="m" gap="40" paddingY="40">
      <Column gap="16">
        <Text onBackground="brand-weak" variant="label-strong-s">
          CURRICULUM VITAE
        </Text>
        <Heading as="h1" variant="display-strong-l">
          Minseok Kim
        </Heading>
        <Text variant="heading-default-xl" onBackground="neutral-weak">
          Ph.D. candidate in Mechanical Engineering at KAIST
        </Text>
        <Row gap="16" wrap>
          <SmartLink href={`mailto:${cv.email}`}>{cv.email}</SmartLink>
          <Text onBackground="neutral-weak">{cv.phone}</Text>
        </Row>
        <Text onBackground="neutral-weak">{cv.location}</Text>
        <Row>
          <Button href="/assets/pdf/Academic_Curriculum_Vitae.pdf" prefixIcon="document" variant="secondary">
            Download PDF
          </Button>
        </Row>
      </Column>
      <Row as="nav" aria-label="CV sections" wrap gap="16">
        {sections.map(([title]) => (
          <SmartLink key={title} href={`#${title.toLowerCase().replaceAll(" ", "-")}`}>
            {title}
          </SmartLink>
        ))}
      </Row>
      {sections.map(([title, entries]) => (
        <Column as="section" key={title} id={title.toLowerCase().replaceAll(" ", "-")} gap="24" paddingTop="24" borderTop="neutral-alpha-medium">
          <Heading as="h2" variant="heading-strong-xl">
            {title === "Publications" ? "All Publications" : title}
          </Heading>
          {title === "Publications" ? (
            <>
              <Text onBackground="neutral-weak" variant="body-default-s">
                * Equal contribution
              </Text>
              <PublicationList linkTitles />
            </>
          ) : (
            entries.map((entry, i) => <EntryView key={i} entry={entry} />)
          )}
          {title === "Projects" && (
            <SmartLink href="/projects/" suffixIcon="arrowRight">
              Project details and video
            </SmartLink>
          )}
        </Column>
      ))}
    </Column>
  );
}
