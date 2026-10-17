import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { ColorCard, type ColorData } from "./ColorCard";

export default defineMeta({
  title: "Adwaita/ColorCard",
  component: ColorCard,
  parameters: { width: 480, height: 220 },
});

const PALETTE: ColorData[] = [
  { hex: "#8fbf9f", name: "Sage", source: "named" },
  { hex: "#e5a50a", name: "Amber", source: "named" },
  { hex: "#5b6470", name: "Slate", source: "named" },
];

export const resolved = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="resolved hex">
        <ColorCard data={{ hex: "#3584e4", name: "Blue", source: "hex" }} />
      </Labeled>
      <Labeled caption="no color resolved">
        <ColorCard data={{ hex: null, name: null, source: null }} />
      </Labeled>
    </Column>
  ),
});

export const palette = defineStory({
  parameters: { width: 480, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="several swatches with labels">
        <ColorCard
          data={{ hex: null, name: "Palette", source: "named" }}
          swatches={PALETTE}
        />
      </Labeled>
    </Column>
  ),
});
