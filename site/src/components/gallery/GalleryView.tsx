"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Column, MasonryGrid, Media, Row, Text } from "@once-ui-system/core";
import photos from "@/resources/gallery.json";
import styles from "./GalleryView.module.scss";
export default function GalleryView() {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const photo = selected === null ? null : photos[selected];
  const move = (offset: number) => {
    setSelected((i) => (i === null ? i : (i + offset + photos.length) % photos.length));
    setZoomed(false);
  };
  useEffect(() => {
    if (selected !== null && !dialog.current?.open) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (selected === null && dialog.current?.open) {
      dialog.current?.close();
      opener.current?.focus();
    }
  }, [selected]);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  return (
    <>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {photos.map((p, index) => (
          <button
            className={styles.thumbnail}
            key={p.src}
            aria-label={`Open photograph ${index + 1}: ${p.alt}`}
            onClick={() => {
              setSelected(index);
              setZoomed(false);
            }}
          >
            <Media
              priority={index < 4}
              sizes="(max-width: 560px) 100vw, 50vw"
              radius="m"
              aspectRatio={`${p.width} / ${p.height}`}
              src={p.thumb}
              alt={p.alt}
            />
          </button>
        ))}
      </MasonryGrid>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label="Photograph viewer"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {photo && (
          <Column fill gap="16">
            <Row horizontal="between" vertical="center" gap="16" wrap>
              <Text aria-live="polite">
                {(selected ?? 0) + 1} / {photos.length}
              </Text>
              <Row gap="8" wrap>
                <Button variant="secondary" size="s" onClick={() => setZoomed(!zoomed)}>
                  {zoomed ? "Fit image" : "Zoom"}
                </Button>
                <Button variant="secondary" size="s" href={photo.src} target="_blank" rel="noopener noreferrer">
                  Open image
                </Button>
                <Button variant="secondary" size="s" onClick={() => setSelected(null)} autoFocus>
                  Close
                </Button>
              </Row>
            </Row>
            <Column className={`${styles.stage} ${zoomed ? styles.zoomed : ""}`} fill>
              {/* Full-resolution files are requested only when opened. */}
              <img src={photo.src} alt={photo.alt} className={styles.fullImage} />
            </Column>
            <Row horizontal="between" vertical="center" gap="16">
              <Button variant="secondary" onClick={() => move(-1)}>
                Previous
              </Button>
              <Text className={styles.caption} onBackground="neutral-weak">
                {photo.alt}
              </Text>
              <Button variant="secondary" onClick={() => move(1)}>
                Next
              </Button>
            </Row>
          </Column>
        )}
      </dialog>
    </>
  );
}
