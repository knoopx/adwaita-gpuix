import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { CountdownCard } from "./CountdownCard";

export default defineMeta({
  title: "Adwaita/CountdownCard",
  component: CountdownCard,
  parameters: { width: 528, height: 340 },
});

export const basic = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled
      caption="basic — remaining time + elapsed progress"
      style={{ width: "100%" }}
    >
      <CountdownCard
        data={{
          title: "Launch",
          remaining: "2d 4h",
          progress: 0.45,
          date: "2026-09-14T00:00:00.000Z",
        }}
      />
    </Labeled>
  ),
});

export const upcoming = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="more than a week away" style={{ width: "100%" }}>
        <CountdownCard
          data={{
            title: "Conference",
            remaining: "12d 4h",
            progress: 0.3,
            date: "2026-09-14T00:00:00.000Z",
          }}
        />
      </Labeled>
      <Labeled caption="imminent (warning)" style={{ width: "100%" }}>
        <CountdownCard
          data={{
            title: "Deadline",
            remaining: "5d 2h",
            progress: 0.8,
            date: "2026-07-21T00:00:00.000Z",
            tone: "warning",
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const nearZero = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled caption="near zero (warning)" style={{ width: "100%" }}>
      <CountdownCard
        data={{
          title: "Sale ends",
          remaining: "00:14:23",
          progress: 0.95,
          tone: "warning",
        }}
      />
    </Labeled>
  ),
});

export const expired = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled caption="expired (destructive, bar full)" style={{ width: "100%" }}>
      <CountdownCard
        data={{
          title: "Event ended",
          remaining: "0d 0h",
          progress: 1,
          date: "2026-07-01T00:00:00.000Z",
          tone: "expired",
        }}
      />
    </Labeled>
  ),
});
