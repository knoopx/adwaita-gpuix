import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { TimerCard } from "./TimerCard";

export default defineMeta({
  title: "Adwaita/TimerCard",
  component: TimerCard,
  parameters: { width: 528, height: 280 },
});

export const set = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with duration (no total, no bar)" style={{ width: "100%" }}>
        <TimerCard data={{ seconds: 125, label: "Pomodoro" }} />
      </Labeled>
      <Labeled caption="no duration set" style={{ width: "100%" }}>
        <TimerCard data={{ seconds: null, label: "Break" }} />
      </Labeled>
    </Column>
  ),
});

export const basic = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled
      caption="basic — remaining time + elapsed progress"
      style={{ width: "100%" }}
    >
      <TimerCard data={{ seconds: 270, label: "Break", totalSeconds: 600 }} />
    </Labeled>
  ),
});

export const finished = defineStory({
  parameters: { width: 528, height: 180 },
  render: () => (
    <Labeled
      caption="finished — 0:00 remaining, bar full"
      style={{ width: "100%" }}
    >
      <TimerCard data={{ seconds: 0, label: "Focus", totalSeconds: 600 }} />
    </Labeled>
  ),
});
