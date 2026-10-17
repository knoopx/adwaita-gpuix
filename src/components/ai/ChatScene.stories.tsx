import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Column } from "../Box";
import { Stage } from "../.storybook/story-helpers";
import { ChatScene } from "./ChatScene";

function ShellContent() {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <Column gap={8} style={{ minWidth: 0 }}>
      <T size="body" color={colors.fg}>
        Ran the test suite.
      </T>
      <T size="body" color={colors.dim_fg}>
        All 12 tests passed in 0.4s.
      </T>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/ChatScene",
  component: ChatScene,
  parameters: { width: 480, height: 400 },
});

export const shell = defineStory({
  parameters: { width: 480, height: 400 },
  render: () => (
    <Stage width={480} height={400}>
      <ChatScene title="New Thread">
        <ShellContent />
      </ChatScene>
    </Stage>
  ),
});
