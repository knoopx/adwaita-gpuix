import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Row, Column } from "../Box";
import { Stage } from "../.storybook/story-helpers";
import {
  InlineCitation,
  InlineCitationCard,
  type CitationSource,
} from "./InlineCitation";

const STORYBOOK_SOURCES: CitationSource[] = [
  {
    title: "Vulkan Descriptor Sets Guide",
    url: "https://vulkan.lunarg.com/doc/latest/best_practices.html",
    quote: "Batch bindings into descriptor sets to avoid per-draw CPU cost.",
  },
  {
    title: "GPU Memory Bandwidth",
    url: "https://arxiv.org/abs/2401.00000",
    quote: "Texture fetches dominate bandwidth on mobile GPUs.",
  },
];

function Sentence({ children }: { children: ReactNode }) {
  return (
    <Row gap={4} padding={12} align="start">
      {children}
    </Row>
  );
}

export default defineMeta({
  title: "Adwaita/InlineCitation",
  component: InlineCitation,
  parameters: { width: 480, height: 220 },
});

function CitationStage({
  height,
  children,
}: {
  height: number;
  children?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <Stage width={440} height={height} radius={12}>
      <Sentence>
        <T size="body" color={t.colors.fg}>
          Batch bindings into descriptor sets to avoid per-draw CPU cost
        </T>
        <InlineCitation sources={STORYBOOK_SOURCES} index={1} />
        {children}
      </Sentence>
    </Stage>
  );
}

export function inSentence() {
  return <CitationStage height={64} />;
}

export function multipleCitations() {
  const t = useAdwaita();
  return (
    <CitationStage height={88}>
      <T size="body" color={t.colors.fg}>
        , and texture fetches dominate bandwidth on mobile GPUs
      </T>
      <InlineCitation sources={STORYBOOK_SOURCES} index={2} />
      <T size="body" color={t.colors.fg}>.
      </T>
    </CitationStage>
  );
}

export function label() {
  const t = useAdwaita();
  return (
    <Stage width={440} height={64} radius={12}>
      <Sentence>
        <T size="body" color={t.colors.fg}>
          Descriptor-set batching cuts per-draw CPU cost
        </T>
        <InlineCitation
          sources={STORYBOOK_SOURCES}
          index={1}
          label="Vulkan"
        />
      </Sentence>
    </Stage>
  );
}

export const openCard = defineStory({
  render: () => (
    <Stage width={440} height={128} radius={12}>
      <Column padding={12}>
        <InlineCitationCard sources={STORYBOOK_SOURCES} index={1} open />
      </Column>
    </Stage>
  ),
});

export const openCardWithQuote = defineStory({
  render: () => (
    <Stage width={440} height={168} radius={12}>
      <Column padding={12}>
        <InlineCitationCard sources={STORYBOOK_SOURCES} index={1} open quote />
      </Column>
    </Stage>
  ),
});
