import { Column, Heading, Text } from "@once-ui-system/core";
import { Projects } from "@/components/work/Projects";
export const metadata = {
  title: "Research projects — Minseok Kim",
  description: "Research projects in robotics and autonomous systems.",
  alternates: { canonical: "/projects/" },
};
export default function Work() {
  return (
    <Column maxWidth="m" gap="40" paddingY="40">
      <Column gap="16">
        <Heading as="h1" variant="display-strong-l">
          Research projects
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Perception for autonomous systems in the real world.
        </Text>
      </Column>
      <Projects />
    </Column>
  );
}
