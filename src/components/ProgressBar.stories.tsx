import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { ProgressBar } from "./ProgressBar";

export default defineMeta({
  title: "Adwaita/ProgressBar",
  component: ProgressBar,
  parameters: { width: 528, height: 320 },
});

export const basic = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="65%" style={{ width: 240 }}>
        <ProgressBar value={65} />
      </Labeled>
    </Column>
  ),
});

export const values = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="0%" style={{ width: 240 }}>
        <ProgressBar value={0} />
      </Labeled>
      <Labeled caption="25%" style={{ width: 240 }}>
        <ProgressBar value={25} />
      </Labeled>
      <Labeled caption="50%" style={{ width: 240 }}>
        <ProgressBar value={50} />
      </Labeled>
      <Labeled caption="75%" style={{ width: 240 }}>
        <ProgressBar value={75} />
      </Labeled>
      <Labeled caption="100%" style={{ width: 240 }}>
        <ProgressBar value={100} />
      </Labeled>
    </Column>
  ),
});

export const percentScale = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="percent 0.5" style={{ width: 240 }}>
        <ProgressBar value={0.5} percent />
      </Labeled>
      <Labeled caption="percent 1" style={{ width: 240 }}>
        <ProgressBar value={1} percent />
      </Labeled>
    </Column>
  ),
});

export const colors = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="accent" style={{ width: 240 }}>
        <ProgressBar value={65} />
      </Labeled>
      <Labeled caption="success" style={{ width: 240 }}>
        <ProgressBar value={65} color="success" />
      </Labeled>
      <Labeled caption="warning" style={{ width: 240 }}>
        <ProgressBar value={65} color="warning" />
      </Labeled>
      <Labeled caption="destructive" style={{ width: 240 }}>
        <ProgressBar value={65} color="destructive" />
      </Labeled>
    </Column>
  ),
});

export const heights = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="6" style={{ width: 240 }}>
        <ProgressBar value={40} height={6} />
      </Labeled>
      <Labeled caption="12" style={{ width: 240 }}>
        <ProgressBar value={40} height={12} />
      </Labeled>
      <Labeled caption="20" style={{ width: 240 }}>
        <ProgressBar value={40} height={20} />
      </Labeled>
    </Row>
  ),
});
