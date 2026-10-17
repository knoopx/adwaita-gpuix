import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { LinkCard } from "./LinkCard";

export default defineMeta({
  title: "Adwaita/LinkCard",
  component: LinkCard,
  parameters: { width: 528, height: 280 },
});

export const withNote = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="note + monogram + domain" style={{ width: "100%" }}>
        <LinkCard
          data={{
            url: "https://developer.example.com/docs",
            domain: "developer.example.com",
            monogram: "D",
            note: "Developer docs",
          }}
        />
      </Labeled>
      <Labeled caption="domain derived from URL" style={{ width: "100%" }}>
        <LinkCard
          data={{
            url: "https://www.github.com/adwaita",
            domain: null,
            monogram: "",
            note: "",
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const noDomain = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="no domain — note only" style={{ width: "100%" }}>
        <LinkCard
          data={{ url: null, domain: null, monogram: "", note: "Reading list" }}
        />
      </Labeled>
      <Labeled
        caption="empty data — title falls back to Link"
        style={{ width: "100%" }}
      >
        <LinkCard data={{ url: null, domain: null, monogram: "", note: "" }} />
      </Labeled>
    </Column>
  ),
});
