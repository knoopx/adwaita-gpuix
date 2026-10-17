import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ConvertCard } from "./ConvertCard";

export default defineMeta({
  title: "Adwaita/ConvertCard",
  component: ConvertCard,
  parameters: { width: 320, height: 340 },
});

function Showcase() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="with result">
        <ConvertCard data={{ value: 100, from: "USD", to: "EUR", result: 92.5 }} />
      </Labeled>
      <Labeled caption="no value yet">
        <ConvertCard data={{ value: null, from: "USD", to: "EUR", result: null }} />
      </Labeled>
    </Column>
  );
}

export const converted = defineStory({
  parameters: { width: 320, height: 340 },
  render: () => <Showcase />,
});

export const withCaption = defineStory({
  parameters: { width: 320, height: 200 },
  render: () => (
    <Column gap={4} align="center">
      <Labeled caption="unit caption">
        <ConvertCard
          data={{ value: 25, from: "°C", to: "°F", result: 77 }}
          caption="Temperature"
        />
      </Labeled>
    </Column>
  ),
});
