import { Column, Heading, Text, SmartLink } from "@once-ui-system/core";
import { PublicationFilter } from "@/components/academic";
export const metadata = {
  title: "Publications — Minseok Kim",
  description: "Publications and preprints by Minseok Kim, KAIST VILAB.",
  alternates: { canonical: "/publications/" },
};
export default function Publications() {
  return (
    <Column maxWidth="m" gap="40" paddingY="40">
      <Column gap="16">
        <Heading as="h1" variant="display-strong-l">
          Publications
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Computer vision, multimodal learning, and human-centred intelligence.
        </Text>
        <SmartLink href="https://scholar.google.com/citations?user=74B4XPgAAAAJ" suffixIcon="arrowUpRight">
          Google Scholar
        </SmartLink>
      </Column>
      <PublicationFilter />
    </Column>
  );
}
