import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column } from "./Box";
import { Timeline, type TimelineItem } from "./Timeline";

const ISSUES: TimelineItem[] = [
  { at: "09:02", title: "Issue filed", note: "Draft survives a thread switch" },
  { at: "09:40", title: "Reproduced" },
  {
    at: "10:15",
    title: "Fix in review",
    note: "Clears the slot on switch",
    status: "current",
  },
  { at: "11:00", title: "Release 0.14.1", status: "upcoming" },
];

const RELEASE: TimelineItem[] = [
  { at: "Jun 2", title: "0.13 cut", note: "the last release before the composer rewrite" },
  {
    at: "Jun 9",
    title: "0.14 cut",
    note: "a long one: the composer owns its draft, and the diff is read by tree-sitter",
    status: "current",
  },
  { at: "Jun 16", title: "0.15 planned", status: "upcoming" },
];

export default defineMeta({
  title: "Adwaita/Timeline",
  component: Timeline,
  parameters: { width: 528, height: 340 },
});

export const events = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="one note · the current event is marked on the gutter" style={{ flexGrow: 1 }}>
        <Timeline items={ISSUES} />
      </Labeled>
    </Column>
  ),
});

export const notes = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="a note that wraps: the gutter still runs the whole row"
        style={{ flexGrow: 1 }}
      >
        <div style={{ width: 400 }}>
          <Timeline items={RELEASE} />
        </div>
      </Labeled>
    </Column>
  ),
});

export const noNotes = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="titles only, a wide time column" style={{ flexGrow: 1 }}>
        <Timeline
          items={ISSUES.map(({ title, at, status }) => ({ at, title, status }))}
          timeWidth={72}
        />
      </Labeled>
    </Column>
  ),
});
