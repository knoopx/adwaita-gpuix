import { defineMeta, defineStory } from "storybook";
import { PaddedColumn, Stage } from "../../../.storybook/story-helpers";
import { Row } from "../Box";
import { Labeled } from "../text";
import {
  ImagePlaceholder,
  type ImagePlaceholderState,
} from "./ImagePlaceholder";

export default defineMeta({
  title: "Adwaita/ImagePlaceholder",
  component: ImagePlaceholder,
  parameters: { width: 480, height: 240 },
});

export const simple = defineStory({
  parameters: { width: 480, height: 240 },
  render: () => (
    <Stage width={480} height={240} radius={8}>
      <PaddedColumn>
        <ImagePlaceholder width={288} height={216} />
      </PaddedColumn>
    </Stage>
  ),
});

export const labelled = defineStory({
  parameters: { width: 480, height: 240 },
  render: () => (
    <Stage width={480} height={240} radius={8}>
      <PaddedColumn>
        <ImagePlaceholder
          width={288}
          height={216}
          label="clipboard-2026-02-14-1026x153.png"
          caption="AVIF · 12.6 kB — no preview available"
        />
      </PaddedColumn>
    </Stage>
  ),
});

const STATES: ImagePlaceholderState[] = [
  "pending",
  "unsupported",
  "missing",
  "error",
];

export const states = defineStory({
  parameters: { width: 480, height: 200 },
  render: () => (
    <Stage width={480} height={200} radius={8}>
      <PaddedColumn>
        <Row gap={12}>
          {STATES.map((state) => (
            <ImagePlaceholder
              key={state}
              state={state}
              width={96}
              height={72}
            />
          ))}
        </Row>
      </PaddedColumn>
    </Stage>
  ),
});

export const thumbs = defineStory({
  parameters: { width: 480, height: 128 },
  render: () => (
    <Stage width={480} height={128} radius={8}>
      <PaddedColumn>
        <Row gap={8}>
          <ImagePlaceholder size="thumb" state="pending" width={48} />
          <ImagePlaceholder size="thumb" state="unsupported" width={48} />
          <ImagePlaceholder size="thumb" state="missing" width={48} />
          <ImagePlaceholder size="thumb" state="error" width={48} />
        </Row>
      </PaddedColumn>
    </Stage>
  ),
});
