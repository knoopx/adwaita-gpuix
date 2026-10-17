import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { TravelCard } from "./TravelCard";

export default defineMeta({
  title: "Adwaita/TravelCard",
  component: TravelCard,
  parameters: { width: 528, height: 320 },
});

export const basic = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Labeled
      caption="basic — origin → destination, duration, date"
      style={{ width: "100%" }}
    >
      <TravelCard
        data={{
          origin: "Berlin",
          destination: "Vienna",
          duration: "2h 30m",
          start: "2026-09-04T00:00:00.000Z",
          end: null,
        }}
      />
    </Labeled>
  ),
});

export const range = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="origin → destination, with range" style={{ width: "100%" }}>
        <TravelCard
          data={{
            origin: "Barcelona",
            destination: "Lisbon",
            duration: "2h 35m",
            start: "2026-09-04T00:00:00.000Z",
            end: "2026-09-09T00:00:00.000Z",
          }}
        />
      </Labeled>
      <Labeled caption="destination only" style={{ width: "100%" }}>
        <TravelCard
          data={{
            origin: null,
            destination: "Prague",
            duration: "4h 15m",
            start: null,
            end: null,
          }}
        />
      </Labeled>
    </Column>
  ),
});

export const noDate = defineStory({
  parameters: { width: 528, height: 160 },
  render: () => (
    <Labeled
      caption="no date — origin → destination with duration only"
      style={{ width: "100%" }}
    >
      <TravelCard
        data={{
          origin: "Milan",
          destination: "Venice",
          duration: "2h 15m",
          start: null,
          end: null,
        }}
      />
    </Labeled>
  ),
});
