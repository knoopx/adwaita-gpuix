import { defineMeta, defineStory } from "storybook";
import { SPACE } from "../theme/adwaita";
import { Labeled, type TextSize } from "./common";
import { Row, Column } from "./Box";
import { Label, type LabelVariant } from "./Label";

export default defineMeta({
  title: "Adwaita/Label",
  component: Label,
  parameters: { width: 528, height: 360 },
});

export const states = defineStory({
  render: () => (
    <Row gap={SPACE.lg} align="start">
      <Labeled caption="default">
        <Label>Email</Label>
      </Labeled>
      <Labeled caption="disabled (dimmed, matches a disabled control)">
        <Label disabled>Email</Label>
      </Labeled>
    </Row>
  ),
});

export const sizes = defineStory({
  render: () => {
    const ladder: { size: TextSize; label: string }[] = [
      { size: "title1", label: "Title 1" },
      { size: "title2", label: "Title 2" },
      { size: "title3", label: "Title 3" },
      { size: "title4", label: "Title 4" },
      { size: "body", label: "Body" },
      { size: "caption", label: "Caption" },
    ];
    return (
      <Column gap={SPACE.md}>
        {ladder.map((item) => (
          <Labeled key={item.size} caption={item.size}>
            <Label size={item.size}>{item.label}</Label>
          </Labeled>
        ))}
      </Column>
    );
  },
});

export const variants = defineStory({
  render: () => {
    const list: { variant: LabelVariant; label: string }[] = [
      { variant: "default", label: "default" },
      { variant: "dim", label: "dim" },
      { variant: "accent", label: "accent" },
      { variant: "destructive", label: "destructive" },
      { variant: "success", label: "success" },
      { variant: "warning", label: "warning" },
    ];
    return (
      <Column gap={SPACE.md}>
        {list.map((item) => (
          <Labeled key={item.variant} caption={item.variant}>
            <Label variant={item.variant}>{item.label}</Label>
          </Labeled>
        ))}
      </Column>
    );
  },
});

export const weights = defineStory({
  render: () => {
    const list = [
      { weight: 400, label: "normal (400)" },
      { weight: 500, label: "medium (500)" },
      { weight: 600, label: "semibold (600)" },
      { weight: 700, label: "bold (700)" },
    ];
    return (
      <Column gap={SPACE.md}>
        {list.map((item) => (
          <Labeled key={item.weight} caption={item.label}>
            <Label weight={item.weight}>{item.label}</Label>
          </Labeled>
        ))}
      </Column>
    );
  },
});
