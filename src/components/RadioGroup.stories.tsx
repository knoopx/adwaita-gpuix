import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row } from "./Box";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

export default defineMeta({
  title: "Adwaita/RadioGroup",
  component: RadioGroup,
  parameters: { width: 528, height: 320 },
});

export const controlled = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="group (value='b')">
        <RadioGroup value="b" onValueChange={() => {}}>
          <RadioGroupItem value="a" label="Option A" />
          <RadioGroupItem value="b" label="Option B (selected)" />
          <RadioGroupItem value="c" label="Option C" />
        </RadioGroup>
      </Labeled>
    </Row>
  ),
});

export const disabledItem = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="group (value='a')">
        <RadioGroup value="a" onValueChange={() => {}}>
          <RadioGroupItem value="a" label="Selected" />
          <RadioGroupItem value="b" label="Disabled" disabled />
        </RadioGroup>
      </Labeled>
    </Row>
  ),
});

export const uncontrolled = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="group (defaultValue='c')">
        <RadioGroup defaultValue="c" onValueChange={() => {}}>
          <RadioGroupItem value="a" label="Option A" />
          <RadioGroupItem value="c" label="Option C (default selected)" />
        </RadioGroup>
      </Labeled>
    </Row>
  ),
});

export const noSelection = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="group (no value)">
        <RadioGroup onValueChange={() => {}}>
          <RadioGroupItem value="a" label="Option A" />
          <RadioGroupItem value="b" label="Option B" />
          <RadioGroupItem value="c" label="Option C" />
        </RadioGroup>
      </Labeled>
    </Row>
  ),
});

export const horizontal = defineStory({
  render: () => (
    <Labeled caption="group (defaultValue='b', row layout)">
      <RadioGroup
        defaultValue="b"
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B (default selected)" />
        <RadioGroupItem value="c" label="Option C" />
      </RadioGroup>
    </Labeled>
  ),
});
