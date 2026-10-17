import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../common";
import { Row, Column } from "../Box";
import { InputGroup } from "../../components/InputGroup";
import {
  ModelSelector,
  ModelSelectorEffort,
  type ModelSelectorModel,
  type ModelSelectorEffortOption,
} from "./ModelSelector";

const STORYBOOK_MODELS: ModelSelectorModel[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "o3", name: "O3", provider: "OpenAI" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic" },
];

const STORYBOOK_EFFORTS: ModelSelectorEffortOption[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

function Stage({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height: 310,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/ModelSelector",
  component: ModelSelector,
  parameters: { width: 528, height: 510 },
});

export const closed = defineStory({
  render: () => (
    <Labeled caption="closed — model + effort triggers">
      <Row gap={16} align="center">
        <ModelSelector
          models={STORYBOOK_MODELS}
          defaultValue="claude-sonnet-4"
        />
        <ModelSelectorEffort
          efforts={STORYBOOK_EFFORTS}
          defaultValue="medium"
          showLabel
        />
      </Row>
    </Labeled>
  ),
});

export const closedTriggers = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="button-style triggers (input group context)">
        <InputGroup>
          <ModelSelector models={STORYBOOK_MODELS} defaultValue="claude-sonnet-4" />
          <ModelSelectorEffort efforts={STORYBOOK_EFFORTS} defaultValue="medium" />
        </InputGroup>
      </Labeled>
    </Row>
  ),
});

export const openProviderGroups = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Stage>
        <Row justify="start" align="start" gap={16} padding={8}>
          <div style={{ position: "relative" }}>
            <ModelSelector
              models={STORYBOOK_MODELS}
              defaultValue="claude-sonnet-4"
              open
            />
          </div>
          <div style={{ position: "relative", marginLeft: 150 }}>
            <ModelSelectorEffort efforts={STORYBOOK_EFFORTS} defaultValue="medium" open />
          </div>
        </Row>
      </Stage>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Labeled caption="disabled — triggers are inert and dimmed">
      <Row gap={16} align="center">
        <ModelSelector
          models={STORYBOOK_MODELS}
          defaultValue="claude-sonnet-4"
          disabled
        />
        <ModelSelectorEffort
          efforts={STORYBOOK_EFFORTS}
          defaultValue="medium"
          showLabel
          disabled
        />
      </Row>
    </Labeled>
  ),
});
