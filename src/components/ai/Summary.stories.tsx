import { defineMeta, defineStory } from "storybook";
import { Stage, PaddedColumn } from "../.storybook/story-helpers";
import { Summary } from "./Summary";

export default defineMeta({
  title: "Adwaita/Summary",
  component: Summary,
  parameters: { width: 400, height: 100 },
});

export const summary = defineStory({
  parameters: { width: 400, height: 100 },
  render: () => (
    <Stage width={400} height={100} radius={12}>
      <PaddedColumn>
        <Summary text="All 12 tests passed in 0.4s." />
      </PaddedColumn>
    </Stage>
  ),
});
