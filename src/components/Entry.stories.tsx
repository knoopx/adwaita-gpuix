import { defineMeta, defineStory } from "storybook";
import { Entry } from "./Entry";
import {
  fieldStatesStory,
  fieldFocusedStory,
  fieldTypesStory,
  fieldIconsStory,
} from "./.storybook/story-helpers";

export default defineMeta({
  title: "Adwaita/Entry",
  component: Entry,
  parameters: { width: 528, height: 480 },
});

export const states = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => fieldStatesStory(Entry),
});

export const focused = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => fieldFocusedStory(Entry, "Focused entry"),
});

export const types = defineStory({
  parameters: { width: 528, height: 500 },
  render: () => fieldTypesStory(Entry),
});

export const withIcons = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => fieldIconsStory(Entry),
});
