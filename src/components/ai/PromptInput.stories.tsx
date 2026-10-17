import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import {
  PromptInput,
  type PromptInputModelOption,
  type PromptInputEffortOption,
} from "./PromptInput";

const STORYBOOK_MODELS: PromptInputModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic" },
];

const STORYBOOK_EFFORTS: PromptInputEffortOption[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export default defineMeta({
  title: "Adwaita/PromptInput",
  component: PromptInput,
  parameters: { width: 528, height: 320 },
});

export const withValue = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="textarea + attach + model + effort + submit">
        <PromptInput
          value="How do I reduce GPU memory bandwidth?"
          models={STORYBOOK_MODELS}
          model="gpt-4o"
          efforts={STORYBOOK_EFFORTS}
          effort="medium"
        />
      </Labeled>
    </Column>
  ),
});

export const empty = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="placeholder, no selectors">
        <PromptInput />
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="disabled input">
        <PromptInput
          value="Read-only prompt."
          disabled
          models={STORYBOOK_MODELS}
          model="gpt-4o"
          efforts={STORYBOOK_EFFORTS}
          effort="low"
        />
      </Labeled>
    </Column>
  ),
});

export const attachOnly = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="filled, attach + submit only">
        <PromptInput value="Summarize this week's commits." />
      </Labeled>
    </Column>
  ),
});

export const focused = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="focused textarea (accent ring + caret)">
        <PromptInput
          value="Draft a release note."
          autoFocus
          models={STORYBOOK_MODELS}
          model="claude-sonnet-4"
        />
      </Labeled>
    </Column>
  ),
});
