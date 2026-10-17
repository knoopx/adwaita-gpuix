import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { EventCard } from "./EventCard";

export default defineMeta({
  title: "Adwaita/EventCard",
  component: EventCard,
  parameters: { width: 528, height: 340 },
});

export const basic = defineStory({
  parameters: { width: 528, height: 170 },
  render: () => (
    <Labeled
      caption="basic — title + date/time + location"
      style={{ width: "100%" }}
    >
      <EventCard
        data={{
          title: "Team sync",
          date: "2026-07-21T14:00:00.000Z",
          hasTime: true,
          people: [],
          link: null,
          location: "Room 2",
        }}
      />
    </Labeled>
  ),
});

export const withStatusBadge = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="status badge — today" style={{ width: "100%" }}>
        <EventCard
          data={{
            title: "Design review",
            date: "2026-07-20T15:00:00.000Z",
            hasTime: true,
            people: [],
            link: null,
            location: "Room 4B",
            status: "Today",
          }}
        />
      </Labeled>
      <Labeled caption="status badge — tomorrow" style={{ width: "100%" }}>
        <EventCard
          data={{
            title: "1:1 with Ada",
            date: "2026-07-21T10:30:00.000Z",
            hasTime: true,
            people: [],
            link: null,
            location: "Video call",
            status: "Tomorrow",
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const withDetails = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with location, people, link" style={{ width: "100%" }}>
        <EventCard
          data={{
            title: "Design review",
            date: "2026-07-20T15:00:00.000Z",
            hasTime: true,
            people: ["Ada", "Linus"],
            link: "https://meet.example.com/design",
            location: "Room 4B",
          }}
        />
      </Labeled>
      <Labeled caption="title + date only" style={{ width: "100%" }}>
        <EventCard
          data={{
            title: "Team lunch",
            date: "2026-07-22T00:00:00.000Z",
            hasTime: false,
            people: [],
            link: null,
            location: null,
          }}
        />
      </Labeled>
    </Column>
  ),
});
