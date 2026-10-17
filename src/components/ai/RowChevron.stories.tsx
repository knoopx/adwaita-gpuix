import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Stage } from "../.storybook/story-helpers";
import { RowChevron } from "./RowChevron";

function LabeledChevron({ open }: { open: boolean }) {
  return (
    <Labeled
      caption={open ? "open · chevron down" : "closed · chevron right"}
      style={{ padding: 16, width: "100%", minWidth: 0 }}
    >
      <RowChevron open={open} />
    </Labeled>
  );
}

export default defineMeta({
  title: "Adwaita/RowChevron",
  component: RowChevron,
  parameters: { width: 240, height: 100 },
});

export const open = defineStory({
  parameters: { width: 240, height: 100 },
  render: () => (
    <Stage width={240} height={100} radius={12}>
      <LabeledChevron open />
    </Stage>
  ),
});

export const closed = defineStory({
  parameters: { width: 240, height: 100 },
  render: () => (
    <Stage width={240} height={100} radius={12}>
      <LabeledChevron open={false} />
    </Stage>
  ),
});
