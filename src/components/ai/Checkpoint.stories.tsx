import { defineMeta, defineStory } from "storybook";
import { FullWidth, FullWidthLabeled } from "../.storybook/story-helpers";
import { Checkpoint } from "./Checkpoint";

export default defineMeta({
  title: "Adwaita/Checkpoint",
  component: Checkpoint,
  parameters: { width: 528, height: 320 },
});

export const plain = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="plain (no action)">
        <Checkpoint label="Fine-tune model" />
      </FullWidthLabeled>
    </FullWidth>
  ),
});

export const withRestore = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="restore button (outline sm)">
        <Checkpoint label="Fine-tune model" timestamp="14:32" onRestore={() => {}} />
      </FullWidthLabeled>
    </FullWidth>
  ),
});

export const actions = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="resume + restore actions">
        <Checkpoint
          label="Fine-tune model"
          timestamp="14:32"
          onResume={() => {}}
          onRestore={() => {}}
        />
      </FullWidthLabeled>
    </FullWidth>
  ),
});

export const statuses = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="status: success">
        <Checkpoint label="Run completed" status="success" timestamp="14:32" />
      </FullWidthLabeled>
      <FullWidthLabeled caption="status: warning">
        <Checkpoint
          label="Context window nearly full"
          status="warning"
          timestamp="14:35"
        />
      </FullWidthLabeled>
      <FullWidthLabeled caption="status: destructive">
        <Checkpoint label="Run failed" status="destructive" timestamp="14:38" />
      </FullWidthLabeled>
    </FullWidth>
  ),
});

export const disabled = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="disabled (actions inert)">
        <Checkpoint
          label="Fine-tune model"
          timestamp="14:32"
          onRestore={() => {}}
          onResume={() => {}}
          disabled
        />
      </FullWidthLabeled>
    </FullWidth>
  ),
});
