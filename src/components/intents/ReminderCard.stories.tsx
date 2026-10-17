import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ReminderCard } from "./ReminderCard";

export default defineMeta({
  title: "Adwaita/ReminderCard",
  component: ReminderCard,
  parameters: { width: 528, height: 280 },
});

export const timed = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with time" style={{ width: "100%" }}>
        <ReminderCard
          data={{ task: "Water the plants", when: "2026-07-18T08:30:00.000Z", hasTime: true }}
        />
      </Labeled>
      <Labeled caption="no time set" style={{ width: "100%" }}>
        <ReminderCard data={{ task: "Call the bank", when: null, hasTime: false }} />
      </Labeled>
    </Column>
  ),
});

export const withRepeat = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="repeat — daily" style={{ width: "100%" }}>
        <ReminderCard
          data={{
            task: "Water the plants",
            when: "2026-07-18T08:30:00.000Z",
            hasTime: true,
            repeat: "Daily",
          }}
        />
      </Labeled>
      <Labeled caption="no repeat" style={{ width: "100%" }}>
        <ReminderCard
          data={{
            task: "Call the bank",
            when: "2026-07-21T10:00:00.000Z",
            hasTime: true,
            repeat: null,
          }}
        />
      </Labeled>
    </Column>
  ),
});
