import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { RandomCard } from "./RandomCard";

export default defineMeta({
  title: "Adwaita/RandomCard",
  component: RandomCard,
  parameters: { width: 528, height: 280 },
});

export const basic = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="dice — rolled">
        <RandomCard data={{ kind: "dice", count: 2, sides: 6 }} result="7" />
      </Labeled>
    </Column>
  ),
});

export const kinds = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="dice — pending">
        <RandomCard data={{ kind: "dice", count: 2, sides: 6 }} />
      </Labeled>
      <Labeled caption="pick — pending">
        <RandomCard data={{ kind: "pick", options: ["red", "green", "blue"] }} />
      </Labeled>
    </Column>
  ),
});

export const values = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="number">
        <RandomCard data={{ kind: "number", min: 1, max: 100 }} result={42} />
      </Labeled>
      <Labeled caption="pick — word">
        <RandomCard
          data={{ kind: "pick", options: ["lucky", "foxy", "sunny"] }}
          result="Lucky"
        />
      </Labeled>
      <Labeled caption="coin">
        <RandomCard data={{ kind: "coin" }} result="Heads" />
      </Labeled>
    </Column>
  ),
});
