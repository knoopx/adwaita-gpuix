import { defineMeta, defineStory } from "storybook";
import { Stage, PaddedColumn } from "../.storybook/story-helpers";
import { ReplayButton } from "./ReplayButton";

export default defineMeta({
  title: "Adwaita/ReplayButton",
  component: ReplayButton,
  parameters: { width: 240, height: 100 },
});

export const secondary = defineStory({
  parameters: { width: 240, height: 100 },
  render: () => (
    <Stage width={240} height={100} radius={12}>
      <PaddedColumn>
        <ReplayButton />
      </PaddedColumn>
    </Stage>
  ),
});
