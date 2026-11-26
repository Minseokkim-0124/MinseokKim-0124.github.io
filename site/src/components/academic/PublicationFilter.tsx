"use client";
import { useState } from "react";
import { Column, Row, ToggleButton, Text } from "@once-ui-system/core";
import papers from "@/resources/papers.json";
import { PublicationList } from "./PublicationList";
export function PublicationFilter() {
  const [filter, setFilter] = useState("all");
  const shown = papers.filter((p) => filter === "all" || p.kind === filter);
  return (
    <Column gap="32" fillWidth>
      <Row gap="8" wrap>
        {[
          ["all", "All"],
          ["conference", "Conferences"],
          ["preprint", "Preprints"],
        ].map(([value, label]) => (
          <ToggleButton key={value} selected={filter === value} onClick={() => setFilter(value)}>
            {label}
          </ToggleButton>
        ))}
      </Row>
      <Text onBackground="neutral-weak" variant="body-default-s" aria-live="polite">
        {shown.length} publications · * Equal contribution
      </Text>
      <PublicationList items={shown} />
    </Column>
  );
}
