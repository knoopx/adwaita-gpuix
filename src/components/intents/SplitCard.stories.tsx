import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { SplitCard } from "./SplitCard";

export default defineMeta({
  title: "Adwaita/SplitCard",
  component: SplitCard,
  parameters: { width: 528, height: 280 },
});

export const split = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="split among people" style={{ width: "100%" }}>
      <SplitCard
        data={{ title: "Dinner split", total: 84, people: 3, currency: "$" }}
      />
    </Labeled>
  ),
});

export const totalOnly = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="total only (no people)" style={{ width: "100%" }}>
      <SplitCard data={{ total: 58, people: null, currency: "€" }} />
    </Labeled>
  ),
});

export const peopleOnly = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="people only (no total)" style={{ width: "100%" }}>
      <SplitCard data={{ total: null, people: 2, currency: "£" }} />
    </Labeled>
  ),
});
