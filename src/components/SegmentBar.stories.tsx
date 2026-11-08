import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./text";
import { Column } from "./Box";
import { ProgressBar } from "./ProgressBar";
import { SegmentBar, type Segment } from "./SegmentBar";

const MODELS: Segment[] = [
  { value: 1.66 },
  { value: 0.86 },
  { value: 0.24 },
];

const STAGES: Segment[] = [
  { value: 12, tone: "success" },
  { value: 41, tone: "warning" },
  { value: 7, tone: "destructive" },
];

export default defineMeta({
  title: "Adwaita/SegmentBar",
  component: SegmentBar,
  parameters: { width: 528, height: 300 },
});

export const budget = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="three parts, and the room the budget still has" style={{ flexGrow: 1 }}>
        <SegmentBar segments={MODELS} tail={7.24} />
      </Labeled>
      <Labeled caption="a whole bar with no tail" style={{ flexGrow: 1 }}>
        <SegmentBar segments={STAGES} />
      </Labeled>
      <Labeled caption="taller, for a figure the bar stands under" style={{ flexGrow: 1 }}>
        <SegmentBar segments={MODELS} height={12} />
      </Labeled>
    </Column>
  ),
});

export const againstProgressBar = defineStory({
  parameters: { width: 528, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="ProgressBar answers one figure against its maximum" style={{ flexGrow: 1 }}>
        <ProgressBar value={62} />
      </Labeled>
      <Labeled caption="SegmentBar answers what that figure is made of" style={{ flexGrow: 1 }}>
        <SegmentBar segments={MODELS} tail={7.24} />
      </Labeled>
    </Column>
  ),
});
