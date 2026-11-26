import Image from "next/image";
import { Heading, Text, Button, RevealFx, Column, Row, Tag, SmartLink, Line } from "@once-ui-system/core";
import { home, person } from "@/resources";
import { Introduction, PublicationList } from "@/components/academic";
export const metadata = { title: home.title, description: home.description, alternates: { canonical: "/" } };
export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="32" horizontal="center">
      <Column fillWidth horizontal="center" gap="24">
        <Image className="home-portrait" src={person.avatar} alt={person.name} width={960} height={1280} preload />
        <Column horizontal="center" align="center" gap="16">
          <RevealFx translateY="4" fillWidth horizontal="center">
            <Column align="center" gap="16">
              <Heading as="h1" variant="display-strong-xl">
                {home.headline}
              </Heading>
              <Text variant="display-default-xs" onBackground="neutral-weak">
                {home.subline}
              </Text>
            </Column>
          </RevealFx>
          <Button href="/about/" variant="secondary" size="m" data-border="rounded">
            Ph.D. candidate · KAIST VILAB
          </Button>
        </Column>
        <Row wrap gap="8" horizontal="center">
          {["Multimodal AI", "3D Understanding", "AR/VR Applications"].map((x) => (
            <Tag key={x} size="l">
              {x}
            </Tag>
          ))}
        </Row>
        <Column maxWidth="s" paddingTop="24">
          <Introduction />
        </Column>
        <Row gap="16" wrap horizontal="center">
          <Button href="/publications/" arrowIcon>
            Explore my research
          </Button>
          <Button href="/cv/" variant="secondary" prefixIcon="document">
            Curriculum vitae
          </Button>
        </Row>
      </Column>
      <Column as="section" id="research" fillWidth gap="32" paddingTop="40">
        <Row fillWidth horizontal="between" vertical="center" wrap gap="16">
          <Heading as="h2" variant="display-strong-s">
            All Publications
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            * Equal contribution
          </Text>
        </Row>
        <PublicationList linkTitles />
      </Column>
      <Column as="section" id="projects" fillWidth gap="24" paddingTop="32">
        <Row fillWidth horizontal="between" vertical="center" wrap gap="16">
          <Heading as="h2" variant="display-strong-s">
            Research projects
          </Heading>
          <SmartLink href="/projects/" suffixIcon="arrowRight">
            All projects
          </SmartLink>
        </Row>
        <video
          className="research-video"
          controls
          muted
          playsInline
          preload="none"
          poster="/assets/delivery-poster.jpg"
          aria-label="Unmanned autonomous delivery project video"
        >
          <source src="/assets/autonomous-delivery.mp4" type="video/mp4" />
        </video>
        <Heading as="h3" variant="heading-strong-xl">
          <SmartLink href="/work/autonomous-delivery/">Development of Mobility and Connectivity Platform for Unmanned Autonomous Delivery</SmartLink>
        </Heading>
        <Text onBackground="neutral-weak">March 2025 – Present · Research Member · MOTIE, Korea</Text>
        <Text>Sensors: RGB, Depth, Radar, Active IR</Text>
        <Line />
        <SmartLink href="/work/quadrupedal-robot/">
          Development of quadrupedal robot system technology for surveillance, reconnaissance, and search missions
        </SmartLink>
        <Text onBackground="neutral-weak">March 2023 – December 2024 · Project Member · ADD, Korea</Text>
      </Column>
      <Column as="section" id="about" fillWidth gap="24" paddingY="32">
        <Text variant="label-strong-s" onBackground="brand-weak">
          A LITTLE ABOUT ME
        </Text>
        <Heading as="h2" variant="display-strong-s">
          Beyond research
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          My background is in mechanical engineering, from Hanyang University to KAIST. Outside research, I enjoy playing electric guitar, taking
          photographs, and working out.
        </Text>
        <Row gap="24">
          <SmartLink href="/about/" suffixIcon="arrowRight">
            More about me
          </SmartLink>
          <SmartLink href="/gallery/" suffixIcon="arrowRight">
            Through my lens
          </SmartLink>
        </Row>
      </Column>
      <Column id="contact" fillWidth gap="16" paddingY="32" borderTop="neutral-alpha-medium">
        <Heading as="h2" variant="heading-strong-xl">
          Let’s connect.
        </Heading>
        <Text onBackground="neutral-weak">VILAB, KAIST · Daejeon, South Korea</Text>
        <SmartLink href={`mailto:${person.email}`} suffixIcon="arrowUpRight">
          {person.email}
        </SmartLink>
      </Column>
    </Column>
  );
}
