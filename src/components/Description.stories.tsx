import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Column } from "./Box";
import { Description } from "./Description";

export default defineMeta({
  title: "Adwaita/Description",
  component: Description,
  parameters: { width: 528, height: 320 },
});

export const plain = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="bare description line">
        <Description>
          A short descriptive line of dim text explaining the value above.
        </Description>
      </Labeled>
    </Column>
  ),
});

export const underLabel = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="label + description">
        <Column gap={4}>
          <T size="title3" weight={600}>
            Field label
          </T>
          <Description>
            Help text describing what this field controls and its effect.
          </Description>
        </Column>
      </Labeled>
    </Column>
  ),
});

export const wrapped = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="long text wraps inside a constrained width">
        <Column style={{ width: 280 }}>
          <Description>
            A longer descriptive paragraph that wraps line by line inside a
            constrained width, keeping the dim foreground colour and body size
            from the theme tokens.
          </Description>
        </Column>
      </Labeled>
    </Column>
  ),
});

export const stacked = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="stacked description lines">
        <Column gap={4}>
          <T size="title3" weight={600}>
            Storage
          </T>
          <Description>Used space shown for the selected drive.</Description>
          <Description>Values refresh automatically as files change.</Description>
        </Column>
      </Labeled>
    </Column>
  ),
});

export function styled() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="style prop override (caption size)">
        <Description style={{ fontSize: t.typography.caption }}>
          The same dim description text rendered at caption size via the style
          prop.
        </Description>
      </Labeled>
    </Column>
  );
}
