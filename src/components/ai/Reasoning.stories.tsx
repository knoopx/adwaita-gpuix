import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import {
  Reasoning,
  ReasoningHeader,
  ReasoningContent,
} from "./Reasoning";

const REASONING_PARAGRAPHS = [
  "The deploy log has three phases. Install takes 38s and next build takes 52s, both normal for this repo.",
  "Image optimization takes 3m 50s. It reruns on every deploy because its cache key includes the commit hash, so the cache never hits.",
];

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <Column gap={16} align="center">
      <Labeled caption={caption}>{children}</Labeled>
    </Column>
  );
}

function ReasoningFrame({
  caption,
  isStreaming,
  duration,
  open,
  paragraphs,
}: {
  caption: string;
  isStreaming?: boolean;
  duration?: number;
  open?: boolean;
  paragraphs: string[];
}) {
  return (
    <Frame caption={caption}>
      <Reasoning
        isStreaming={isStreaming}
        duration={duration}
        open={open}
        onOpenChange={() => {}}
      >
        <ReasoningHeader />
        <ReasoningContent>{paragraphs.map((p) => p)}</ReasoningContent>
      </Reasoning>
    </Frame>
  );
}

export default defineMeta({
  title: "Adwaita/Reasoning",
  component: Reasoning,
  parameters: { width: 528, height: 400 },
});

export const streaming = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <ReasoningFrame
      caption="Streaming — thinking, open"
      isStreaming
      open
      paragraphs={[REASONING_PARAGRAPHS[0]]}
    />
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 120 },
  render: () => (
    <ReasoningFrame
      caption="Done — collapsed, 5s"
      duration={5}
      open={false}
      paragraphs={[REASONING_PARAGRAPHS[0], REASONING_PARAGRAPHS[1]]}
    />
  ),
});

export const expanded = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <ReasoningFrame
      caption="Done — expanded, 5s"
      duration={5}
      open
      paragraphs={[REASONING_PARAGRAPHS[0], REASONING_PARAGRAPHS[1]]}
    />
  ),
});
