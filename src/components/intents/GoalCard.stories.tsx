import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { GoalCard } from "./GoalCard";

export default defineMeta({
  title: "Adwaita/GoalCard",
  component: GoalCard,
  parameters: { width: 528, height: 280 },
});

export const progress = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="with target" style={{ width: "100%" }}>
        <GoalCard
          data={{ title: "Daily steps", current: 6500, target: 10000, unit: "" }}
        />
      </Labeled>
      <Labeled caption="no target (0%)" style={{ width: "100%" }}>
        <GoalCard
          data={{ title: "Read pages", current: 120, target: null, unit: "pg" }}
        />
      </Labeled>
    </Column>
  ),
});

export const completed = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="completed (100%, success)" style={{ width: "100%" }}>
        <GoalCard
          data={{ title: "Read 12 books", current: 12, target: 12, unit: "books" }}
        />
      </Labeled>
      <Labeled
        caption="over target (clamped to 100%)"
        style={{ width: "100%" }}
      >
        <GoalCard
          data={{ title: "Daily steps", current: 12500, target: 10000, unit: "" }}
        />
      </Labeled>
    </Column>
  ),
});
