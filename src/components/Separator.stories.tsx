import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row, Column } from "./Box";
import { Separator } from "./Separator";

export default defineMeta({
  title: "Adwaita/Separator",
  component: Separator,
  parameters: { width: 528, height: 320 },
});

function HorizontalSample() {
  return (
    <Column gap={8} align="center">
      <T>Top</T>
      <Separator />
      <T>Bottom</T>
    </Column>
  );
}

function VerticalSample() {
  return (
    <Row gap={8} align="center">
      <T>Left</T>
      <Separator orientation="vertical" style={{ height: 24 }} />
      <T>Right</T>
    </Row>
  );
}

export const orientations = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="horizontal">
        <HorizontalSample />
      </Labeled>
      <Labeled caption="vertical">
        <VerticalSample />
      </Labeled>
    </Row>
  ),
});

export const inset = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="horizontal, inset 24">
        <Column gap={8} align="center">
          <T>Top</T>
          <Separator inset={24} />
          <T>Bottom</T>
        </Column>
      </Labeled>
      <Labeled caption="vertical, inset 8">
        <Row gap={8} align="center">
          <T>Left</T>
          <Separator
            orientation="vertical"
            inset={8}
            style={{ height: 24 }}
          />
          <T>Right</T>
        </Row>
      </Labeled>
    </Row>
  ),
});

export function inContext() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <Column gap={12}>
      <Labeled caption="in a card" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          overflow: "hidden",
        }}
      >
        <Column gap={4} padding={16}>
          <T weight={600}>Header</T>
          <T size="caption" color={colors.dim_fg}>
            Body text above the line
          </T>
        </Column>
        <Separator style={{ margin: 16, marginBottom: 0 }} />
        <Column gap={4} padding={16}>
          <T weight={600}>Footer</T>
          <T size="caption" color={colors.dim_fg}>
            Body text below the line
          </T>
        </Column>
      </div>
    </Column>
  );
}
