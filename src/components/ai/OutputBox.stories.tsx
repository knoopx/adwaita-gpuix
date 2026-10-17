import { defineMeta, defineStory } from "storybook";
import { Stage, PaddedColumn } from "../.storybook/story-helpers";
import { OutputBox } from "./OutputBox";

function OutputDemo({
  text,
  tone,
  height = 140,
}: {
  text: string;
  tone?: "default" | "error";
  height?: number;
}) {
  return (
    <Stage width={420} height={height} radius={12}>
      <PaddedColumn>
        <OutputBox text={text} tone={tone} />
      </PaddedColumn>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/OutputBox",
  component: OutputBox,
  parameters: { width: 420, height: 160 },
});

export const defaultTone = defineStory({
  parameters: { width: 420, height: 140 },
  render: () => (
    <OutputDemo text={"$ bun run test\n  ✓ renders (12ms)\n  ✓ themes (3ms)"} />
  ),
});

export const errorTone = defineStory({
  parameters: { width: 420, height: 140 },
  render: () => (
    <OutputDemo
      text={"$ bun run test\n  ✗ render fails\n    expected 1, got 0"}
      tone="error"
    />
  ),
});
