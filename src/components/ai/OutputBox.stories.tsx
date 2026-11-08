import { defineMeta, defineStory } from "storybook";
import { PaddedColumn, Stage } from "../../../.storybook/story-helpers";
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
    <Stage width={420} height={height} radius={8}>
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

export const longLines = defineStory({
  parameters: { width: 420, height: 140 },
  render: () => (
    <OutputDemo
      text={
        "$ bun run test --filter transcript\n" +
        "  ✓ renders the line a shell printed long before the box was wide (12ms)\n" +
        "  ✓ keeps every other line on its own row"
      }
    />
  ),
});

export const terminalColours = defineStory({
  parameters: { width: 420, height: 160 },
  render: () => (
    <OutputDemo
      text={
        "$ bun run test\n" +
        "\u001b[1msrc/transcript.test.ts\u001b[0m\n" +
        "  \u001b[32m✓\u001b[0m paints the colour a command asked for (12ms)\n" +
        "  \u001b[31m✗\u001b[0m keeps a \u001b[2mdim run\u001b[0m on its own row (3ms)\n" +
        "\u001b[90m1 failed, 2 passed\u001b[0m"
      }
    />
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
