import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Toggle } from "./Toggle";

export default defineMeta({
  title: "Adwaita/Toggle",
  component: Toggle,
  parameters: { width: 528, height: 320 },
});

export const states = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="unpressed">
        <Toggle pressed={false} onPressed={() => {}}>
          Bold
        </Toggle>
      </Labeled>
      <Labeled caption="pressed">
        <Toggle pressed onPressed={() => {}}>
          Bold
        </Toggle>
      </Labeled>
    </Row>
  ),
});

export const variants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="default (unpressed)">
        <Toggle pressed={false} variant="default" onPressed={() => {}}>
          Default
        </Toggle>
      </Labeled>
      <Labeled caption="default (pressed)">
        <Toggle pressed variant="default" onPressed={() => {}}>
          Default
        </Toggle>
      </Labeled>
      <Labeled caption="outline (unpressed — flat, transparent)">
        <Toggle pressed={false} variant="outline" onPressed={() => {}}>
          Outline
        </Toggle>
      </Labeled>
      <Labeled caption="outline (pressed — accentTint)">
        <Toggle pressed variant="outline" onPressed={() => {}}>
          Outline
        </Toggle>
      </Labeled>
    </Column>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="sm (28px)">
        <Toggle pressed={false} size="sm" onPressed={() => {}}>
          Sm
        </Toggle>
      </Labeled>
      <Labeled caption="default (34px)">
        <Toggle pressed={false} size="default" onPressed={() => {}}>
          Default
        </Toggle>
      </Labeled>
      <Labeled caption="lg (40px)">
        <Toggle pressed={false} size="lg" onPressed={() => {}}>
          Large
        </Toggle>
      </Labeled>
    </Row>
  ),
});

export const withIcon = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16} align="center">
        <Labeled caption="icon (unpressed)">
          <Toggle pressed={false} icon="moon" onPressed={() => {}} />
        </Labeled>
        <Labeled caption="icon (pressed)">
          <Toggle pressed icon="moon" onPressed={() => {}} />
        </Labeled>
        <Labeled caption="icon (unpressed)">
          <Toggle pressed={false} icon="bell" variant="outline" onPressed={() => {}} />
        </Labeled>
        <Labeled caption="icon (pressed)">
          <Toggle pressed icon="bell" variant="outline" onPressed={() => {}} />
        </Labeled>
      </Row>
      <Row gap={16} align="center">
        <Labeled caption="icon + label (unpressed)">
          <Toggle pressed={false} icon="grid" onPressed={() => {}}>
            Grid
          </Toggle>
        </Labeled>
        <Labeled caption="icon + label (pressed)">
          <Toggle pressed icon="grid" onPressed={() => {}}>
            Grid
          </Toggle>
        </Labeled>
      </Row>
    </Column>
  ),
});

export const disabled = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="disabled (unpressed)">
        <Toggle pressed={false} disabled onPressed={() => {}}>
          Bold
        </Toggle>
      </Labeled>
      <Labeled caption="disabled (pressed)">
        <Toggle pressed disabled icon="moon" variant="outline" onPressed={() => {}} />
      </Labeled>
    </Row>
  ),
});
