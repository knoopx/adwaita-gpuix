import { defineMeta, defineStory } from "storybook";
import { PaddedColumn, Stage } from "../../../.storybook/story-helpers";
import { ReplayButton } from "./ReplayButton";

export default defineMeta({
  title: "Adwaita/ReplayButton",
  component: ReplayButton,
  parameters: { width: 240, height: 100 },
});

export const secondary = defineStory({
  parameters: { width: 240, height: 100 },
  render: () => (
    <Stage width={240} height={100} radius={8}>
      <PaddedColumn>
        <ReplayButton />
      </PaddedColumn>
    </Stage>
  ),
});
