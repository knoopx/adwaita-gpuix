import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { CalcCard } from "./CalcCard";

export default defineMeta({
  title: "Adwaita/CalcCard",
  component: CalcCard,
  parameters: { width: 320, height: 580 },
});

function Showcase() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="with result">
        <CalcCard data={{ expression: "12 × 8", result: 96 }} />
      </Labeled>
      <Labeled caption="unable to evaluate">
        <CalcCard data={{ expression: "7 ÷ 0", result: null }} />
      </Labeled>
    </Column>
  );
}

export const evaluated = defineStory({
  parameters: { width: 320, height: 580 },
  render: () => <Showcase />,
});
