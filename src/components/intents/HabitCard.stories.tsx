import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { HabitCard } from "./HabitCard";

export default defineMeta({
  title: "Adwaita/HabitCard",
  component: HabitCard,
  parameters: { width: 528, height: 280 },
});

export const weekly = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="scheduled days + label" style={{ width: "100%" }}>
        <HabitCard
          data={{ title: "Meditation", days: [1, 3, 5], perWeek: 3, label: "3× a week" }}
        />
      </Labeled>
      <Labeled caption="no days set" style={{ width: "100%" }}>
        <HabitCard data={{ title: "Stretch", days: [], perWeek: null, label: null }} />
      </Labeled>
    </Column>
  ),
});

export const fullWeek = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all days filled" style={{ width: "100%" }}>
        <HabitCard
          data={{
            title: "Read 20 pages",
            days: [0, 1, 2, 3, 4, 5, 6],
            perWeek: 7,
            label: null,
          }}
        />
      </Labeled>
    </Column>
  ),
});
