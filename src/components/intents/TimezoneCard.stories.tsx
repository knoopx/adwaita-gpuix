import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { TimezoneCard } from "./TimezoneCard";

export default defineMeta({
  title: "Adwaita/TimezoneCard",
  component: TimezoneCard,
  parameters: { width: 528, height: 280 },
});

export const now = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled caption="converting now (with badge)" style={{ width: "100%" }}>
      <TimezoneCard
        data={{
          instant: "2026-07-18T12:00:00.000Z",
          isNow: true,
          from: { label: "London", tz: "Europe/London" },
          to: { label: "New York", tz: "America/New_York" },
        }}
      />
    </Labeled>
  ),
});

export const singleZone = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled caption="single zone (no target)" style={{ width: "100%" }}>
      <TimezoneCard
        data={{
          instant: "2026-07-18T12:00:00.000Z",
          isNow: false,
          from: { label: "Tokyo", tz: "Asia/Tokyo" },
          to: null,
        }}
      />
    </Labeled>
  ),
});

export const noTime = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled caption="no time set (instant null)" style={{ width: "100%" }}>
      <TimezoneCard
        data={{
          instant: null,
          isNow: false,
          from: { label: "Berlin", tz: "Europe/Berlin" },
          to: { label: "Tokyo", tz: "Asia/Tokyo" },
        }}
      />
    </Labeled>
  ),
});
