import { defineMeta, defineStory } from "storybook";
import { Stage, PaddedColumn } from "../.storybook/story-helpers";
import { UserBubble } from "./UserBubble";

export default defineMeta({
  title: "Adwaita/UserBubble",
  component: UserBubble,
  parameters: { width: 400, height: 100 },
});

export const singleLine = defineStory({
  parameters: { width: 400, height: 100 },
  render: () => (
    <Stage width={400} height={100} radius={12}>
      <PaddedColumn>
        <UserBubble text="Deploy the adwaita-gpuix library" />
      </PaddedColumn>
    </Stage>
  ),
});
