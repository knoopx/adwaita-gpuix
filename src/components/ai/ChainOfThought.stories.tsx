import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Icon, type IconName } from "../../components/icons";
import { Labeled, T } from "../common";
import { Column } from "../Box";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtImage,
} from "./ChainOfThought";

function ImagePlaceholder() {
  const t = useAdwaita();
  return <Icon name="grid" size={24} color={t.colors.dim_fg} />;
}

type ThoughtStepSpec = {
  icon: IconName;
  label: string;
  description?: string;
  status: "complete" | "running" | "pending";
};

const ACTIVE_STEPS: ThoughtStepSpec[] = [
  {
    icon: "search",
    label: "Searched the web for GPU compute APIs",
    description: "12 results",
    status: "complete",
  },
  { icon: "fileText", label: "Reading the vendor developer docs", status: "running" },
  { icon: "circle", label: "Summarizing the findings", status: "pending" },
];

const COMPLETED_STEPS: ThoughtStepSpec[] = [
  {
    icon: "search",
    label: "Searched the web for GPU compute APIs",
    description: "12 results",
    status: "complete",
  },
  {
    icon: "fileText",
    label: "Read the vendor developer docs",
    description: "3 sources",
    status: "complete",
  },
  { icon: "sparkles", label: "Summarized the findings", status: "complete" },
];

function CoTFrame({
  caption,
  active,
  open,
  children,
}: {
  caption: string;
  active?: boolean;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <Column gap={16} align="center">
      <Labeled caption={caption}>
        <ChainOfThought active={active} open={open} onOpenChange={() => {}}>
          <ChainOfThoughtHeader steps={3} />
          <ChainOfThoughtContent open={open}>{children}</ChainOfThoughtContent>
        </ChainOfThought>
      </Labeled>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/ChainOfThought",
  component: ChainOfThought,
  parameters: { width: 528, height: 420 },
});

function renderSteps(steps: ThoughtStepSpec[]) {
  return steps.map((s) => (
    <ChainOfThoughtStep
      key={s.label}
      icon={s.icon}
      label={s.label}
      description={s.description}
      status={s.status}
    />
  ));
}

export const expanded = defineStory({
  render: () => (
    <CoTFrame caption="Researched in 3 steps" open>
      {renderSteps(ACTIVE_STEPS)}
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>cuda</ChainOfThoughtSearchResult>
        <ChainOfThoughtSearchResult>vulkan</ChainOfThoughtSearchResult>
        <ChainOfThoughtSearchResult>opencl</ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
      <ChainOfThoughtImage caption="Captured benchmark chart">
        <ImagePlaceholder />
      </ChainOfThoughtImage>
    </CoTFrame>
  ),
});

export const collapsed = defineStory({
  render: () => (
    <CoTFrame caption="Header only" open={false}>
      <T size="body">Hidden steps.</T>
    </CoTFrame>
  ),
});

export const thinking = defineStory({
  render: () => (
    <CoTFrame caption="Active — thinking, open" active open>
      {renderSteps(ACTIVE_STEPS)}
    </CoTFrame>
  ),
});

export const thinkingCollapsed = defineStory({
  render: () => (
    <CoTFrame caption="Active — thinking, collapsed" active open={false}>
      <T size="body">Hidden steps.</T>
    </CoTFrame>
  ),
});

export const completed = defineStory({
  render: () => (
    <CoTFrame caption="Completed — all steps done" open>
      {renderSteps(COMPLETED_STEPS)}
    </CoTFrame>
  ),
});
