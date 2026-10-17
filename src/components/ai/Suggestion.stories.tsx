import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { Suggestions, Suggestion } from "./Suggestion";

export default defineMeta({
  title: "Adwaita/Suggestion",
  component: Suggestion,
  parameters: { width: 528, height: 320 },
});

export const pillRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="Suggestions with onSelect">
        <Suggestions onSelect={() => {}} style={{ width: "100%" }}>
          <Suggestion
            suggestion={{
              title: "Explain the render loop",
              description: "Frame pacing + present",
            }}
          />
          <Suggestion
            suggestion={{
              title: "Profile GPU time",
              description: "Per-draw breakdown",
            }}
          />
          <Suggestion
            suggestion={{
              title: "Compare backends",
              description: "Vulkan vs Metal",
            }}
          />
        </Suggestions>
      </Labeled>
    </Column>
  ),
});

export const titleOnly = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="single-line pills">
        <Suggestions style={{ width: "100%" }}>
          <Suggestion suggestion={{ title: "Summarize" }} />
          <Suggestion suggestion={{ title: "Translate" }} />
        </Suggestions>
      </Labeled>
    </Column>
  ),
});

export const withIcons = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="icon + label (clickable)">
        <Suggestions onSelect={() => {}}>
          <Suggestion suggestion={{ icon: "sparkles", title: "Summarize" }} />
          <Suggestion suggestion={{ icon: "search", title: "Explain" }} />
          <Suggestion suggestion={{ icon: "code", title: "Refactor" }} />
        </Suggestions>
      </Labeled>
      <Labeled caption="icon + label + description">
        <Suggestions onSelect={() => {}}>
          <Suggestion
            suggestion={{
              icon: "timer",
              title: "Profile GPU time",
              description: "Per-draw breakdown",
            }}
          />
          <Suggestion
            suggestion={{
              icon: "refresh",
              title: "Compare backends",
              description: "Vulkan vs Metal",
            }}
          />
        </Suggestions>
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="disabled (50% opacity, no pointer, no hover)">
        <Suggestions>
          <Suggestion
            disabled
            suggestion={{ icon: "sparkles", title: "Summarize" }}
          />
          <Suggestion disabled suggestion={{ title: "Translate" }} />
          <Suggestion suggestion={{ title: "Active" }} />
        </Suggestions>
      </Labeled>
    </Column>
  ),
});
