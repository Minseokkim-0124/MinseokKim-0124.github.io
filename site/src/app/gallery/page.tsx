import { Column, Heading, Text, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: person.avatar,
    path: gallery.path,
  });
  // Meta.generate writes a canonical only alongside language alternates.
  return { ...metadata, alternates: { canonical: metadata.openGraph.url } };
}

export default function Gallery() {
  return (
    <Column maxWidth="l" gap="40" paddingY="40">
      <Column gap="16">
        <Heading as="h1" variant="display-strong-l">
          Through my lens
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Travels, everyday moments, and things that catch my eye.
        </Text>
      </Column>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={person.avatar}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView />
    </Column>
  );
}
