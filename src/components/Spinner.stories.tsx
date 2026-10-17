import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row } from "./Box";
import { Spinner } from "./Spinner";

export default defineMeta({
  title: "Adwaita/Spinner",
  component: Spinner,
  parameters: { width: 528, height: 320 },
});

export const basic = defineStory({
  render: () => (
    <Labeled caption="default (32, accent, a11y label)">
      <Spinner />
    </Labeled>
  ),
});

export const sizes = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="16">
        <Spinner size={16} />
      </Labeled>
      <Labeled caption="32">
        <Spinner size={32} />
      </Labeled>
      <Labeled caption="64">
        <Spinner size={64} />
      </Labeled>
    </Row>
  ),
});

export const colors = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="accent">
        <Spinner size={32} />
      </Labeled>
      <Labeled caption="success">
        <Spinner size={32} color="success" />
      </Labeled>
      <Labeled caption="warning">
        <Spinner size={32} color="warning" />
      </Labeled>
      <Labeled caption="destructive">
        <Spinner size={32} color="destructive" />
      </Labeled>
    </Row>
  ),
});

export const states = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="a11y label (visually hidden)">
        <Spinner size={32} label />
      </Labeled>
      <Labeled caption="no label">
        <Spinner size={32} label={false} />
      </Labeled>
    </Row>
  ),
});
