import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { NoteCard } from "./NoteCard";

export default defineMeta({
  title: "Adwaita/NoteCard",
  component: NoteCard,
  parameters: { width: 528, height: 280 },
});

export const withBody = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with body">
        <NoteCard
          data={{
            title: "Meeting notes",
            body: "Agreed on the release date. Follow up with the design team on the empty states before Thursday.",
          }}
        />
      </Labeled>
      <Labeled caption="empty body">
        <NoteCard data={{ title: "New note", body: "" }} />
      </Labeled>
    </Column>
  ),
});

export const withTag = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with tag">
        <NoteCard
          data={{
            title: "Meeting notes",
            body: "Agreed on the release date. Follow up with the design team on the empty states before Thursday.",
            tag: "Work",
          }}
        />
      </Labeled>
      <Labeled caption="tag only — no body">
        <NoteCard data={{ title: "New note", body: "", tag: "Personal" }} />
      </Labeled>
    </Column>
  ),
});
